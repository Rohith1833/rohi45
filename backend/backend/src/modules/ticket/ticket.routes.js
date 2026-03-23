const express = require('express');
const {
  deleteTicket,
  getTicketById,
  getTickets,
  resolveTicket,
  updateTicket,
} = require('./ticket.controller');

const router = express.Router();

router.get('/', getTickets);
router.get('/:id', getTicketById);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);
router.post('/:id/resolve', resolveTicket);

module.exports = router;
