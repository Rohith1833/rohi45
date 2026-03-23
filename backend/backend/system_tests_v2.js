const API_BASE_URL = 'http://localhost:5000/api';
let passed = 0; let failed = 0;

const test = async (name, payload, expectedAsserts) => {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    expectedAsserts(data, res.status);
    console.log(`✅ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name} -> ${err.message}`);
    failed++;
  }
};

(async () => {
  console.log("--- FINAL SYSTEM RELIABILITY ENGINEERING TESTS ---");

  await test('TEST 1: Happy Path (Deflection)', { message: 'Where is my order?' }, (data, status) => {
    if (status !== 200) throw new Error("Expected 200");
    if (data.deflected !== true) throw new Error("Expected deflected: true");
    if (!data.autoReply) throw new Error("Missing autoReply");
  });

  await test('TEST 2: Escalated Flow (Ticket creation)', { message: "It's been 10 days, no refund!" }, (data, status) => {
    if (status !== 200) throw new Error("Expected 200");
    if (data.deflected !== false) throw new Error("Expected deflected: false");
    if (!data.ticket) throw new Error("Missing ticket node");
    if (!data.copilot) throw new Error("Missing copilot suggestions");
  });

  await test('TEST 3: LLM FAILURE', { message: "Simulate API failed" }, (data, status) => {
    if (status !== 200) throw new Error("Expected 200 fallback");
    if (data.analysis.reason !== "Fallback due to AI failure") throw new Error("Missing API failure tag");
    if (data.ticket.severity !== "HIGH") throw new Error("Missing HIGH severity safety mapping");
  });

  await test('TEST 4: TIMEOUT', { message: "Simulate delay > 4 sec" }, (data, status) => {
    if (status !== 200) throw new Error("Expected 200 fallback");
    if (data.analysis.reason !== "Fallback due to AI failure") throw new Error("Missing API failure tag");
  });

  await test('TEST 5: DB FAILURE (ADVANCED EDGE)', { message: "mock_db_fail" }, (data, status) => {
    if (status !== 200) throw new Error("Must NOT return 500 during DB crash");
    if (data.analysis.reason !== "Fallback due to AI failure") throw new Error("Fallback JSON did not render correctly.");
    if (data.copilot.category !== "Billing") throw new Error("Fallback structure broke.");
  });

  console.log('--- TEST 6: Rapid Load (10 Concurrent Requests) ---');
  const reqs = Array.from({ length: 10 }).map(() => fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: "Where is my order?" })
  }).then(res => res.json())
  );

  try {
    const results = await Promise.all(reqs);
    const isValid = results.every(res => res.deflected === true && res.autoReply);
    if (!isValid) throw new Error("Unstable responses during concurrency.");
    console.log(`✅ [PASS] TEST 6: Stability load handled successfully!`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] TEST 6: ${err.message}`);
    failed++;
  }

  console.log(`\n🎉 Final Results: ${passed} Passed | ${failed} Failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
