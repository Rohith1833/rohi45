import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  message: {
    type: String,
    required: true,
    maxlength: 150,
  },
  severity: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    required: true,
  },
  category: {
    type: String,
    enum: ["Billing", "Technical", "Account", "General"],
    required: true,
  },
  emotion: {
    type: String,
    enum: ["Calm", "Neutral", "Frustrated", "Angry"],
    required: true,
  },
  aiSummary: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Resolved"],
    default: "Open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replyDraft: {
    type: String,
  },
  suggestedAction: {
    type: String,
  },
});

// Avoid re-compiling the model if it already exists
export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
