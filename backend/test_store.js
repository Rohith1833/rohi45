import { createTicket, getTickets, getStats } from './lib/ticketStore.js';
import mongoose from 'mongoose';

async function runTest() {
  console.log('--- Ticket Store (MongoDB + Memory) Test ---');
  
  // Note: This test assumes MongoDB might be down, testing fallback.
  const initialStats = await getStats();
  console.log('Initial stats:', initialStats);

  const initialTickets = await getTickets();
  console.log('Initial tickets count:', initialTickets.length);

  const testAnalysis = {
    severity: 'HIGH',
    category: 'Billing',
    reason: 'Duplicate charge',
    emotion: 'Frustrated',
    aiSummary: 'Charged twice',
    replyDraft: 'Sorry for that.',
    suggestedAction: 'Refund',
    isL1: false
  };

  const newTicket = await createTicket(testAnalysis, 'I have been charged twice for my subscription.');
  console.log('Created ticket:', newTicket.id);

  const afterStats = await getStats();
  console.log('Stats after create:', afterStats);

  const afterTickets = await getTickets();
  console.log('Tickets after create:', afterTickets.length);

  if (afterTickets.length > initialTickets.length) {
    console.log('SUCCESS: Ticket store working with persistence/memory sync.');
  }

  // Gracefully close mongoose if it connected
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

runTest().catch(console.error);
