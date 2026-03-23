const ticketService = require('./ticket.service');

const getTickets = async (req, res, next) => {
  try {
    const data = await ticketService.getTickets();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    res.status(200).json({ ticket });
  } catch (error) {
    if (error.message === 'Ticket not found') {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    return next(error);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const data = await ticketService.updateTicket(req.params.id, req.body || {});
    res.status(200).json(data);
  } catch (error) {
    if (error.message === 'Ticket not found') {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (error.message === 'No valid fields provided for update') {
      return res.status(400).json({ error: error.message });
    }

    return next(error);
  }
};

const resolveTicket = async (req, res, next) => {
  try {
    const data = await ticketService.resolveTicket(req.params.id);

    res.status(200).json({
      ticket: {
        id: data.ticket.id,
        status: data.ticket.status,
        updatedAt: data.ticket.updatedAt,
      },
      stats: data.stats,
    });
  } catch (error) {
    if (error.message === 'Ticket not found') {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    return next(error);
  }
};

const deleteTicket = async (req, res, next) => {
  try {
    const data = await ticketService.deleteTicket(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    if (error.message === 'Ticket not found') {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    return next(error);
  }
};

module.exports = {
  deleteTicket,
  getTicketById,
  getTickets,
  resolveTicket,
  updateTicket,
};
