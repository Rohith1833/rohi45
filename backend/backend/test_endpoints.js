const assert = require('assert');

const API_BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🚀 Starting API Integration Tests...');

  let passed = 0;
  let failed = 0;

  const runTest = async (name, testFn) => {
    try {
      await testFn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (error) {
      console.error(`❌ [FAIL] ${name}`);
      console.error(`   Error: ${error.message}`);
      failed++;
    }
  };

  // Test 1: POST /api/analyze (Missing Message)
  await runTest('Test 1: POST /api/analyze (Missing Message)', async () => {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'message field is required');
  });

  // Test 2: POST /api/analyze (Valid Payload - Escalated) - "Where is my refund?"
  await runTest('Test 2: POST /api/analyze (Valid Payload - Escalated)', async () => {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Where is my refund?' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.deflected, false);
    assert.ok(data.ticket.id);
    assert.strictEqual(data.ticket.status, 'Open');
    assert.ok(data.copilot);
  });

  // Test 3: POST /api/analyze (Simulate LLM Failure)
  await runTest('Test 3: POST /api/analyze (Simulate LLM Failure)', async () => {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'trigger fail_llm' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    // Fallback JSON format should be returned
    assert.strictEqual(data.deflected, false);
    assert.strictEqual(data.analysis.category, 'Unknown');
    assert.strictEqual(data.analysis.aiSummary.includes('Failsafe'), true);
  });

  // Test 4: GET /api/tickets
  await runTest('Test 4: GET /api/tickets (Check if sorted & stats exist)', async () => {
    const res = await fetch(`${API_BASE_URL}/tickets`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.tickets));
    assert.ok(data.stats);
    assert.strictEqual(typeof data.stats.total, 'number');
  });

  // Get a valid ticket ID for resolution test
  const getRes = await fetch(`${API_BASE_URL}/tickets`);
  const getData = await getRes.json();
  const validTicketId = getData.tickets.find(t => t.status !== 'Resolved')?.id || 'tkt_001';

  // Test 5: POST /api/tickets/:id/resolve
  await runTest('Test 5: POST /api/tickets/:id/resolve (Valid ID)', async () => {
    // Note: Due to mock logic creating custom IDs, we'll try resolving an existing one
    const res = await fetch(`${API_BASE_URL}/tickets/${validTicketId}/resolve`, {
      method: 'POST'
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ticket.id, validTicketId);
    assert.strictEqual(data.ticket.status, 'Resolved');
    assert.ok(data.stats);
  });

  // Test 6: POST /api/tickets/:id/resolve (Invalid ID)
  await runTest('Test 6: POST /api/tickets/:id/resolve (Invalid ID)', async () => {
    const res = await fetch(`${API_BASE_URL}/tickets/invalid_id/resolve`, {
      method: 'POST'
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'Invalid ticket ID');
  });

  console.log(`\n🎉 Tests Completed: ${passed} Passed | ${failed} Failed`);
  process.exit(failed > 0 ? 1 : 0);
};

runTests();
