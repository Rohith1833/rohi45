import mongoose from "mongoose";

/**
 * Support Ticket Schema as requested.
 * Fields: title, description, status, priority.
 */
const SupportTicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["open", "in-progress", "closed"],
        message: "{VALUE} is not a valid status",
      },
      default: "open",
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "{VALUE} is not a valid priority",
      },
      default: "medium",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Prevent model re-compilation on HMR
export default mongoose.models.SupportTicket || 
  mongoose.model("SupportTicket", SupportTicketSchema);
