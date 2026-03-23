import { resolveTicket } from "../../../lib/ticketStore";

/**
 * Handles ticket resolution.
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  // PATCH /api/tickets/:id: Resolve ticket
  if (method === "PATCH") {
    const updatedTicket = await resolveTicket(id);

    if (!updatedTicket) {
      return res.status(404).json({ error: `Ticket ${id} not found` });
    }

    return res.status(200).json(updatedTicket);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
