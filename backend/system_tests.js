const API_BASE_URL = 'http://localhost:5000/api';
let passed = 0; let failed = 0;

const test = async (name, testLogic) => {
  try {
    await testLogic();
    console.log(`✅ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name} -> ${err.message}`);
    failed++;
  }
};

(async () => {
  console.log("--- ECHO DESK AI: FULL SYSTEM VALIDATION TESTS ---");

  await test('TEST 1: Deflection (isL1 + LOW)', async () => {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "How to reset password" })
    });
    const data = await res.json();
    if (data.deflected !== true) throw new Error("Expected deflected true");
  });

  await test('TEST 2: Escalated Ticket Workflow', async () => {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Refund not received" })
    });
    const data = await res.json();
    if (data.deflected !== false || !data.ticket || !data.copilot) throw new Error("Missing DB logic integrations");
  });

  await test('TEST 3: Invalid Input (Empty Object)', async () => {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (res.status !== 400 && res.status !== 429) throw new Error("Expected HTTP 400 Invalid Block");
  });

  await test('TEST 5: LLM Failure Safely Caught', async () => {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Mock failure" })
    });
    const data = await res.json();
    if (res.status === 500) throw new Error("App crashed on LLM error!");
    if (res.status === 200 && (!data.meta || data.meta.fallback !== true) && !data.error) throw new Error("Did not return proper Fallback JSON");
  });

  await test('TEST 6: Timeout SLA Breach (>4000ms)', async () => {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Delay >4s" })
    });
    const data = await res.json();
    if (res.status === 500) throw new Error("App hung and crashed on timeout");
  });

  await test('TEST 7: DB Failure Safely Caught', async () => {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "mock_db_fail" })
    });
    if (res.status === 500) throw new Error("Catastrophic Uncaught DB Crash");
  });

  await test('TEST 8: Data Integrity (GET /api/tickets)', async () => {
    const res = await fetch(`${API_BASE_URL}/tickets`);
    const data = await res.json();
    if (!Array.isArray(data.tickets) || !data.stats) throw new Error("GET Feed broken");
  });

  // TEST 4 — Moved to End intentionally to prevent 429 limiting real endpoint tests inside 1 min window
  await test('TEST 4: Rate Limiter Protection (15 requests)', async () => {
    const reqs = Array.from({ length: 15 }).map(() => fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Refund not received" })
    }));
    const results = await Promise.all(reqs);
    if (!results.some(r => r.status === 429)) throw new Error("Did not return 429 limit!");
  });

  console.log(`\n🎉 Final System Check: ${passed} Passed | ${failed} Failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
