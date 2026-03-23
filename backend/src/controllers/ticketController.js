const ticketService = require('../services/ticketService');

/**
 * Controller to fetch all tickets and statistics.
 */
const getTickets = async (req, res) => {
  try {
    const data = await ticketService.getTickets();
    
    return res.status(200).json({
      tickets: data.tickets.map(tkt => ({
        id: tkt.id,
        message: tkt.message,
        severity: tkt.severity,
        category: tkt.category,
        emotion: tkt.emotion,
        aiSummary: tkt.aiSummary,
        status: tkt.status,
        createdAt: tkt.createdAt,
        copilot: tkt.copilot
      })),
      stats: data.stats
    });
  } catch (error) {
    console.error("Get Tickets Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Controller to resolve a ticket by ID and fetch updated stats.
 */
const resolveTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Ticket ID is required" });
    }

    const data = await ticketService.resolveTicket(id);

    return res.status(200).json({
      ticket: {
        id: data.ticket.id,
        status: data.ticket.status,
        updatedAt: data.ticket.updatedAt
      },
      stats: data.stats
    });
  } catch (error) {
    console.error("Resolve Ticket Error:", error);
    if (error.message === "Ticket not found") {
      return res.status(400).json({ error: "Invalid ticket ID" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getTickets, resolveTicket };
