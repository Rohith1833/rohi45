import { getStats } from "../../lib/ticketStore";

/**
 * Returns ticket statistics.
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default async function handler(req, res) {
  const { method } = req;

  // GET /api/stats: Return store statistics
  if (method === "GET") {
    const stats = await getStats();
    return res.status(200).json(stats);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
