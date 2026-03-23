const { checkDeflection } = require('./src/services/deflectionService');

// Minimal Test Runner
const assert = (name, input, expectedDeflected, expectedReply) => {
  try {
    const result = checkDeflection(input);
    const passDeflect = result.deflected === expectedDeflected;
    const passReply = result.autoReply === expectedReply;

    if (passDeflect && passReply) {
      console.log(`✅ [PASS] ${name}`);
    } else {
      console.log(`❌ [FAIL] ${name} | Got: ${JSON.stringify(result)}`);
    }
  } catch (error) {
    console.log(`❌ [CRASH] ${name} | Error: ${error.message}`);
  }
};

console.log("--- Deflection Service Tests ---");

// Test 1: L1 AND LOW severity -> Deflect
assert(
  "TEST 1: isL1: true, severity: 'LOW'", 
  { isL1: true, severity: "LOW", replyDraft: "Reset via link" }, 
  true, 
  "Reset via link"
);

// Test 2: NOT L1 AND LOW -> Escalate
assert(
  "TEST 2: isL1: false, severity: 'LOW'", 
  { isL1: false, severity: "LOW" }, 
  false, 
  undefined
);

// Test 3: L1 AND MEDIUM severity -> Escalate
assert(
  "TEST 3: isL1: true, severity: 'MEDIUM'", 
  { isL1: true, severity: "MEDIUM" }, 
  false, 
  undefined
);

// Test 4: L1 AND HIGH severity -> Escalate
assert(
  "TEST 4: isL1: true, severity: 'HIGH'", 
  { isL1: true, severity: "HIGH" }, 
  false, 
  undefined
);

// Test 5: NOT L1 AND HIGH -> Escalate
assert(
  "TEST 5: isL1: false, severity: 'HIGH'", 
  { isL1: false, severity: "HIGH" }, 
  false, 
  undefined
);

// Test 6: Empty Object (Edge Case) -> Escalate
assert(
  "TEST 6: {}", 
  {}, 
  false, 
  undefined
);

// Test 7: Null Payload (Safety Check) -> Escalate
assert(
  "TEST 7: null payload", 
  null, 
  false, 
  undefined
);
