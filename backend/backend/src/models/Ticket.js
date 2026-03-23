const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 120
  },
  severity: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "LOW"
  },
  category: {
    type: String
  },
  emotion: {
    type: String
  },
  aiSummary: {
    type: String
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Resolved"],
    default: "Open"
  },
  copilot: {
    type: Object,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
