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
  console.log("--- SYSTEM RELIABILITY ENGINEERING TESTS ---");

  // TEST 1 — Normal flow: "Where is my order?"
  await test('TEST 1: Normal flow (Deflected)', { message: 'Where is my order?' }, (data, status) => {
    if (status !== 200) throw new Error("Expected 200");
    if (data.deflected !== true) throw new Error("Expected deflected: true");
    if (!data.autoReply) throw new Error("Missing autoReply");
  });

  // TEST 2 — Escalation: "It's been 10 days, no refund!"
  await test('TEST 2: Escalated Flow (Ticket creation)', { message: "It's been 10 days, no refund!" }, (data, status) => {
    if (status !== 200) throw new Error("Expected 200");
    if (data.deflected !== false) throw new Error("Expected deflected: false");
    if (!data.ticket) throw new Error("Missing ticket node");
    if (!data.copilot) throw new Error("Missing copilot suggestions");
  });

  // TEST 3 — LLM FAILURE
  await test('TEST 3: API Error Fallback', { message: "Simulate API failed" }, (data, status) => {
    if (status !== 200) throw new Error("Expected 200 fallback");
    if (data.analysis.reason !== "Fallback due to AI failure") throw new Error("Missing strictly structured reason logic");
    if (data.ticket.severity !== "HIGH") throw new Error("Fallback must assume HIGH severity safety logic.");
  });

  // TEST 4 — TIMEOUT
  await test('TEST 4: Timeout Error Fallback (>4s)', { message: "Simulate delay > 4 sec" }, (data, status) => {
    if (status !== 200) throw new Error("Expected 200 fallback despite 4s LLM execution");
    if (data.analysis.reason !== "Fallback due to AI failure") throw new Error("Missing strictly structured reason logic");
  });

  // TEST 5 — INVALID INPUT
  await test('TEST 5: Invalid Input Validation', {}, (data, status) => {
    if (status !== 400) throw new Error("Expected 400 rejection");
    if (data.error !== "message field is required") throw new Error("Bad error string.");
  });

  // TEST 6 — SYSTEM STABILITY (Spamming)
  console.log('--- TEST 6: Spamming 10 requests rapidly (Stability Load) ---');
  const reqs = Array.from({ length: 10 }).map((_, i) => fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Where is my order?" })
    }).then(res => res.json())
  );

  try {
    const results = await Promise.all(reqs);
    const isValid = results.every(res => res.deflected === true && res.autoReply);
    if (!isValid) throw new Error("Concurrent executions yielded unstable structures.");
    console.log(`✅ [PASS] TEST 6: Stability load handled successfully!`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] TEST 6: ${err.message}`);
    failed++;
  }

  console.log(`\n🎉 Test Final Results: ${passed} Passed | ${failed} Failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
