const { v4: uuidv4 } = require('uuid');
const Ticket = require('../models/Ticket');

class TicketService {
  async generateTicketId() {
    const count = await Ticket.countDocuments();
    const sequence = (count + 1).toString().padStart(3, '0');
    return `tkt_${sequence}`;
  }

  async createTicket(message, analysisResult) {
    try {
      if (message.includes('mock_db_fail')) {
          throw new Error("Simulated MongoDB Disconnection!");
      }

      const id = await this.generateTicketId();
      
      const ticketData = {
        id,
        message: message.substring(0, 120),
        severity: analysisResult.severity,
        category: analysisResult.category,
        emotion: analysisResult.emotion,
        aiSummary: analysisResult.aiSummary,
        status: "Open"
      };

      return await Ticket.create(ticketData);
    } catch (error) {
       console.error("DB Write Error:", error.message);
       throw new Error("DB Connection/Validation Error during Ticket Creation");
    }
  }

  async getTickets() {
    try {
      const tickets = await Ticket.find().sort({ createdAt: -1 });

      const total = tickets.length;
      const highPriority = tickets.filter(t => t.severity === "HIGH").length;
      const resolved = tickets.filter(t => t.status === "Resolved").length;

      return {
        tickets,
        stats: { total, highPriority, resolved }
      };
    } catch (error) {
      throw new Error("Database Read Error");
    }
  }

  async resolveTicket(id) {
    try {
      const ticket = await Ticket.findOne({ id });
      if (!ticket) throw new Error("Ticket not found");

      ticket.status = "Resolved";
      await ticket.save();

      const ticketsData = await this.getTickets();

      return { ticket, stats: ticketsData.stats };
    } catch (error) {
      throw error;
    }
  }

  async attachCopilot(ticketId, copilotData) {
    try {
      const ticket = await Ticket.findOne({ id: ticketId });
      if (ticket) {
        ticket.copilot = copilotData;
        await ticket.save();
      }
      return ticket;
     } catch(err) {
       // We can just log DB fails here, the outer structure catches fatal issues
       throw new Error("Failed to attach Copilot to Database");
     }
  }
}

module.exports = new TicketService();
