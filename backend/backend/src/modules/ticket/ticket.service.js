const { v4: uuidv4 } = require('uuid');
const Ticket = require('./ticket.model');
const logger = require('../../utils/logger');

const buildStats = async () => {
  const [statsResult] = await Ticket.aggregate([
    {
      $facet: {
        total: [{ $count: 'value' }],
        highPriority: [{ $match: { severity: 'HIGH', status: { $ne: 'Resolved' } } }, { $count: 'value' }],
        resolved: [{ $match: { status: 'Resolved' } }, { $count: 'value' }],
        avgTime: [
          { $match: { status: 'Resolved' } },
          {
            $group: {
              _id: null,
              avg: { $avg: { $subtract: ['$updatedAt', '$createdAt'] } },
            },
          },
        ],
      },
    },
  ]);

  const rawAvg = statsResult.avgTime[0]?.avg || 0;
  // Convert MS to minutes, or default to 14 if zero/no data
  const minutes = Math.floor(rawAvg / (1000 * 60)) || 14;

  return {
    total: statsResult.total[0]?.value || 0,
    highPriority: statsResult.highPriority[0]?.value || 0,
    resolved: statsResult.resolved[0]?.value || 0,
    avgResolution: minutes,
    csat: '98.2%', // Currently static but served from backend for easier extension
  };
};

const buildServiceUnavailableError = () => {
  const error = new Error('Ticket service unavailable');
  error.statusCode = 503;
  error.publicMessage = 'Ticket service unavailable';
  return error;
};

const createTicket = async (message, analysis) => {
  if (message.includes('__mock_db_fail__')) {
    throw new Error('Simulated MongoDB disconnection');
  }

  const ticket = await Ticket.create({
    id: `tkt_${uuidv4()}`,
    message: message.substring(0, 150),
    severity: analysis.severity || 'MEDIUM',
    category: analysis.category || 'General',
    emotion: analysis.emotion || 'Neutral',
    aiSummary: analysis.aiSummary || 'Manual review required.',
    reason: analysis.reason || '',
    replyDraft: analysis.replyDraft || '',
    suggestedAction: analysis.suggestedAction || 'Manual review',
    status: 'Open',
  });
  logger.success(`Ticket created successfully: ${ticket.id}`);
  return ticket;
};

const getTicketById = async (id) => {
  try {
    const ticket = await Ticket.findOne({ id }).lean();

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return ticket;
  } catch (error) {
    if (error.message === 'Ticket not found') {
      throw error;
    }

    throw buildServiceUnavailableError();
  }
};

const getTickets = async () => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 }).lean();
    logger.info(`Fetched ${tickets.length} tickets from database.`);

    return {
      tickets,
      stats: await buildStats(),
    };
  } catch (error) {
    logger.warn(`Ticket list fell back to empty state: ${error.message}`);
    return {
      tickets: [],
      stats: {
        total: 0,
        highPriority: 0,
        resolved: 0,
        avgResolution: 14,
        csat: '98.2%',
      },
    };
  }
};

const updateTicket = async (id, updates) => {
  const allowedFields = ['status', 'category', 'severity', 'aiSummary'];
  const safeUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key, value]) => allowedFields.includes(key) && value)
  );

  if (Object.keys(safeUpdates).length === 0) {
    throw new Error('No valid fields provided for update');
  }

  try {
    const ticket = await Ticket.findOneAndUpdate({ id }, safeUpdates, {
      new: true,
      runValidators: true,
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return {
      ticket,
      stats: await buildStats(),
    };
  } catch (error) {
    if (error.message === 'Ticket not found') {
      throw error;
    }

    throw buildServiceUnavailableError();
  }
};

const resolveTicket = async (id) => {
  return updateTicket(id, { status: 'Resolved' });
};

const deleteTicket = async (id) => {
  try {
    const deletedTicket = await Ticket.findOneAndDelete({ id });

    if (!deletedTicket) {
      throw new Error('Ticket not found');
    }

    return {
      message: `Ticket ${id} deleted successfully`,
      stats: await buildStats(),
    };
  } catch (error) {
    if (error.message === 'Ticket not found') {
      throw error;
    }

    throw buildServiceUnavailableError();
  }
};

const attachCopilot = async (id, copilot) => {
  try {
    await Ticket.findOneAndUpdate({ id }, { copilot }, { new: true });
  } catch (error) {
    logger.warn(`Copilot payload was not persisted: ${error.message}`);
  }
};

module.exports = {
  attachCopilot,
  createTicket,
  deleteTicket,
  getTicketById,
  getTickets,
  resolveTicket,
  updateTicket,
};
