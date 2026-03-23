import { getTickets, createTicket } from "../../lib/ticketStore";
import { analyzeMessage } from "../../lib/llm";

/**
 * Handles ticket listing and creation.
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default async function handler(req, res) {
  const { method } = req;

  // GET /api/tickets: Return all tickets
  if (method === "GET") {
    const tickets = await getTickets();
    return res.status(200).json(tickets);
  }

  // POST /api/tickets: Accept message, analyze, and conditionally create ticket
  if (method === "POST") {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message field is required" });
    }

    try {
      const analysis = await analyzeMessage(message.trim());

      // If L1 → auto-resolve/prevent ticket
      if (analysis.isL1) {
        return res.status(200).json({ status: "prevented" });
      }

      // Create ticket
      const ticket = await createTicket(analysis, message.trim());
      return res.status(201).json(ticket);
    } catch (err) {
      console.error(`[EchoDeskAI] Ticket store POST error: ${err.message}`);
      return res.status(500).json({ error: "Failed to process ticket" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
