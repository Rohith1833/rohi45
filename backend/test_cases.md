# API Entry Point Component Tests

The following are cURL commands (which you can also import into Postman as raw text) covering the mandatory test cases for the EchoDesk API Entry Point.

---

### **Test 1: POST /api/analyze (Missing Message)**
Simulates a bad request where the message field is omitted.

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response**: `400 Bad Request`
```json
{
  "error": "message field is required"
}
```

---

### **Test 2: POST /api/analyze (Valid Payload)**
Simulates a valid request inquiring about a refund.

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "Where is my refund?"}'
```

**Expected Response**: `200 OK` (Valid structured response for human routing)
```json
{
  "deflected": false,
  "analysis": {
    "category": "Billing",
    "severity": "HIGH",
    "emotion": "Frustrated",
    "aiSummary": "User is inquiring about billing or refunds.",
    "intent": "refund"
  },
  "ticket": {
    "id": "tkt_005",
    "message": "Where is my refund?",
    "severity": "HIGH",
    "category": "Billing",
    "emotion": "Frustrated",
    "aiSummary": "User is inquiring about billing or refunds.",
    "status": "Open",
    "createdAt": "2026-03-24T00:00:00Z"
  },
  "copilot": {
    "suggestedReply": "I understand you're asking about a refund. Let me review your recent transactions.",
    "internalNotes": "User intent identified as refund. Severity is HIGH.",
    "actions": [
      "Review account history",
      "Check billing details",
      "Initiate refund workflow"
    ]
  }
}
```

---

### **Test 3: POST /api/analyze (Simulate LLM Failure)**
Simulates a scenario where the LLM throws a timeout or fails. The keyword "fail_llm" triggers the mock failure.

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "trigger fail_llm"}'
```

**Expected Response**: `200 OK` (Fallback JSON format, safely catching exceptions securely)
```json
{
  "deflected": false,
  "analysis": {
    "category": "Unknown",
    "severity": "MEDIUM",
    "emotion": "Neutral",
    "aiSummary": "Failsafe: Auto-generated summary. The user encountered an unknown issue.",
    "rawResponse": null
  },
  "ticket": {
    "message": "trigger fail_llm",
    "status": "Open"
  },
  "copilot": {
    "suggestedReply": "Thanks for reaching out! A human agent will be with you shortly.",
    "internalNotes": "System routed to fallback due to LLM failure/timeout."
  }
}
```

---

### **Test 4: GET /api/tickets**
Fetches all tickets, sorting by newest first, and attaches collection-level analytics.

```bash
curl -X GET http://localhost:5000/api/tickets \
  -H "Content-Type: application/json"
```

**Expected Response**: `200 OK`
Contains 4 mock tickets (if newly seeded) globally sorted with stats:
```json
{
  "tickets": [
    {
      "id": "tkt_004",
      "message": "Do you offer enterprise plans?",
      "severity": "LOW",
      "category": "General Inquiry",
      "status": "In Progress"
    },
    ...
  ],
  "stats": {
    "total": 4,
    "highPriority": 2,
    "resolved": 1
  }
}
```

---

### **Test 5: POST /api/tickets/tkt_001/resolve**
Marks a ticket successfully as "Resolved".

```bash
curl -X POST http://localhost:5000/api/tickets/tkt_001/resolve \
  -H "Content-Type: application/json"
```

**Expected Response**: `200 OK`
```json
{
  "ticket": {
    "id": "tkt_001",
    "status": "Resolved",
    "updatedAt": "2026-03-24T00:00:00Z"
  },
  "stats": {
    "total": 4,
    "highPriority": 2,
    "resolved": 2
  }
}
```

---

### **Test 6: POST /api/tickets/invalid_id/resolve (Invalid Ticket ID)**
Simulates attempting to close a ticket identifier that doesn't exist.

```bash
curl -X POST http://localhost:5000/api/tickets/invalid_id/resolve \
  -H "Content-Type: application/json"
```

**Expected Response**: `400 Bad Request`
```json
{
  "error": "Invalid ticket ID"
}
```
