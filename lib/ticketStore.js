/**
 * @typedef {import('./config').AnalysisResult} AnalysisResult
 * @typedef {Object} Ticket
 * @property {string} id
 * @property {string} message
 * @property {string} status - "Open" | "Resolved"
 * @property {string} createdAt - ISO date string
 * @property {AnalysisResult} analysis
 */

import dbConnect from "./db";
import Ticket from "./models/Ticket";

/** @type {Ticket[]} */
const memoryStore = [
  {
    id: "tkt_004",
    message: "Password reset not working",
    status: "Open",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    analysis: { severity: "LOW", category: "Account", reason: "User cannot reset password", emotion: "Neutral", aiSummary: "Reset issue", replyDraft: "Hi...", suggestedAction: "Reset Link", isL1: false }
  },
  {
    id: "tkt_003",
    message: "Charged twice for the subscription",
    status: "Open",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    analysis: { severity: "HIGH", category: "Billing", reason: "Duplicate charge reported", emotion: "Frustrated", aiSummary: "Billing error", replyDraft: "Apologies...", suggestedAction: "Refund", isL1: false }
  },
  {
    id: "tkt_002",
    message: "App keeps crashing on startup",
    status: "Open",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    analysis: { severity: "HIGH", category: "Technical", reason: "Crash on startup", emotion: "Angry", aiSummary: "App crash", replyDraft: "Checking logs...", suggestedAction: "Dev Escalation", isL1: false }
  },
  {
    id: "tkt_001",
    message: "How do I upgrade my plan?",
    status: "Resolved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    analysis: { severity: "LOW", category: "General", reason: "Plan upgrade query", emotion: "Calm", aiSummary: "Upgrade inquiry", replyDraft: "Here's how...", suggestedAction: "Pricing Page", isL1: false }
  }
];

let nextId = memoryStore.length + 1;

/**
 * Creates a new ticket and saves it to MongoDB while maintaining memory fallback.
 * @param {AnalysisResult} analysis 
 * @param {string} message 
 */
export async function createTicket(analysis, message) {
  const truncatedMessage = message.length > 150 ? message.substring(0, 147) + "..." : message;
  const tId = `tkt_${String(nextId++).padStart(3, "0")}`;
  
  const ticketData = {
    id: tId,
    message: truncatedMessage,
    status: "Open",
    createdAt: new Date().toISOString(),
    ...analysis, // Collapse analysis for MongoDB schema
    analysis,     // Keep nested for in-memory and frontend compatibility
  };

  // 1. Update In-Memory fallback (Unshift for LIFO)
  memoryStore.unshift({ ...ticketData });
  if (memoryStore.length > 100) memoryStore.pop();

  // 2. Persist to MongoDB (Fault-Tolerant)
  try {
    await dbConnect();
    await Ticket.create({
      id: tId,
      message: truncatedMessage,
      status: "Open",
      severity: analysis.severity,
      category: analysis.category,
      reason: analysis.reason,
      emotion: analysis.emotion,
      aiSummary: analysis.aiSummary,
      replyDraft: analysis.replyDraft,
      suggestedAction: analysis.suggestedAction,
    });
  } catch (err) {
    console.error("[EchoDeskAI] MongoDB persistence failed:", err.message);
  }

  return { ...ticketData };
}

/**
 * Returns all tickets, preferring MongoDB or falling back to memory.
 * @returns {Promise<Ticket[]>}
 */
export async function getTickets() {
  try {
    await dbConnect();
    const dbTickets = await Ticket.find({}).sort({ createdAt: -1 }).lean();
    if (!dbTickets.length) return memoryStore.map(t => ({ ...t }));

    // Reconstruct analysis object for frontend compatibility from lean docs
    return dbTickets.map(t => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
      analysis: {
        severity: t.severity,
        category: t.category,
        reason: t.reason,
        emotion: t.emotion,
        aiSummary: t.aiSummary,
        replyDraft: t.replyDraft,
        suggestedAction: t.suggestedAction,
        isL1: false
      }
    }));
  } catch (err) {
    console.warn("[EchoDeskAI] Falling back to in-memory store for listing.");
    return memoryStore.map(t => ({ ...t }));
  }
}

/**
 * Resolves a ticket by ID in both memory and MongoDB.
 * @param {string} id 
 */
export async function resolveTicket(id) {
  // Update memory
  const mTicket = memoryStore.find(t => t.id === id);
  if (mTicket) mTicket.status = "Resolved";

  // Update MongoDB
  try {
    await dbConnect();
    const dbTicket = await Ticket.findOneAndUpdate({ id }, { status: "Resolved" }, { new: true }).lean();
    if (!dbTicket) return mTicket ? { ...mTicket } : null;
    
    return {
      ...dbTicket,
      createdAt: dbTicket.createdAt.toISOString(),
      analysis: mTicket ? mTicket.analysis : null // Re-use analysis if available
    };
  } catch (err) {
    console.error("[EchoDeskAI] MongoDB resolve failed:", err.message);
    return mTicket ? { ...mTicket } : null;
  }
}

/**
 * Aggregates statistics, preferring MongoDB.
 */
export async function getStats() {
  try {
    await dbConnect();
    const stats = await Ticket.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          highPriority: [{ $match: { severity: "HIGH" } }, { $count: "count" }],
          resolved: [{ $match: { status: "Resolved" } }, { $count: "count" }]
        }
      }
    ]);

    const result = stats[0];
    return {
      total: result.total[0]?.count || 0,
      highPriority: result.highPriority[0]?.count || 0,
      resolved: result.resolved[0]?.count || 0,
    };
  } catch (err) {
    console.warn("[EchoDeskAI] Stats fallback used.");
    return {
      total: memoryStore.length,
      highPriority: memoryStore.filter(t => t.analysis.severity === "HIGH").length,
      resolved: memoryStore.filter(t => t.status === "Resolved").length,
    };
  }
}
