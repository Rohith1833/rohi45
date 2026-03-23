require('dotenv').config();
const mongoose = require('mongoose');
const Ticket = require('./src/models/Ticket');
const connectDB = require('./src/config/db');

const seedDatabase = async () => {
  await connectDB();
  
  if (mongoose.connection.readyState !== 1) {
    console.error("Unable to seed database. MongoDB connection not established.");
    process.exit(1);
  }

  try {
    // Clear existing data
    await Ticket.deleteMany();
    console.log("Cleared existing tickets.");

    const seedTickets = [
      {
        id: "tkt_001",
        message: "Where is my refund? It has been 5 days.",
        severity: "HIGH",
        category: "Billing",
        emotion: "Frustrated",
        aiSummary: "User is asking about a delayed refund.",
        status: "Open",
        copilot: {
          suggestedReply: "I'm sorry for the delay! Let me check the status of your refund right now.",
          internalNotes: "User intent identified as refund. High severity due to delay."
        }
      },
      {
        id: "tkt_002",
        message: "How do I reset my password?",
        severity: "MEDIUM",
        category: "Technical Support",
        emotion: "Neutral",
        aiSummary: "User needs help resetting password.",
        status: "Resolved"
      },
      {
        id: "tkt_003",
        message: "Your application is broken, I get a 500 error every time I try to upload a file.",
        severity: "HIGH",
        category: "Bug Report",
        emotion: "Angry",
        aiSummary: "User encountered a 500 error during file upload.",
        status: "Open"
      },
      {
        id: "tkt_004",
        message: "Do you offer enterprise plans?",
        severity: "LOW",
        category: "General Inquiry",
        emotion: "Neutral",
        aiSummary: "User is inquiring about enterprise pricing.",
        status: "In Progress"
      }
    ];

    await Ticket.insertMany(seedTickets);
    console.log("Database seeded successfully with 4 mock tickets.");
    process.exit(0);
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
