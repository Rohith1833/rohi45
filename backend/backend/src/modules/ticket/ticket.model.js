const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    message: { type: String, required: true, maxlength: 150 },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    category: {
      type: String,
      enum: ['Billing', 'Technical', 'Account', 'General'],
      default: 'General',
    },
    emotion: {
      type: String,
      enum: ['Calm', 'Neutral', 'Frustrated', 'Angry'],
      default: 'Neutral',
    },
    aiSummary: { type: String },
    reason: { type: String },
    replyDraft: { type: String },
    suggestedAction: { type: String },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved'],
      default: 'Open',
    },
    copilot: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
