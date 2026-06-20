import assert from "node:assert/strict";
import { supportedLanguages } from "../src/lib/chat/languages.ts";
import { evaluateChatGuardrails } from "../src/lib/chat/guardrails.ts";
import { searchChunks } from "../src/lib/rag/searchChunks.ts";

const emergency = evaluateChatGuardrails(
  "I have chest pain and trouble breathing"
);
assert.equal(emergency.triggered, true);
assert.equal(emergency.state, "emergency");
assert.equal(emergency.confidence, "emergency");
assert.match(emergency.answer ?? "", /call 911/i);

const diagnosis = evaluateChatGuardrails("Can you diagnose my stomach pain?");
assert.equal(diagnosis.triggered, true);
assert.equal(diagnosis.state, "medical_advice_refusal");
assert.match(diagnosis.answer ?? "", /cannot diagnose/i);
assert.match(diagnosis.answer ?? "", /Health811|healthcare professional/i);

const medication = evaluateChatGuardrails("How much medication should I take?");
assert.equal(medication.triggered, true);
assert.equal(medication.state, "medical_advice_refusal");
assert.match(medication.answer ?? "", /cannot give medication dosage/i);

const ohip = evaluateChatGuardrails("How do I apply for OHIP?");
assert.equal(ohip.triggered, false);
assert.equal(ohip.state, "navigation_allowed");
assert.equal(searchChunks("How do I apply for OHIP?")[0]?.source_id, "ontario_ohip_apply");

const familyDoctor = evaluateChatGuardrails("I need a family doctor");
assert.equal(familyDoctor.triggered, false);
assert.equal(familyDoctor.state, "navigation_allowed");
assert.equal(
  searchChunks("I need a family doctor")[0]?.source_id,
  "health_care_connect"
);

const mandarinOhip = evaluateChatGuardrails("我如何申请健康卡？", "Mandarin Chinese");
assert.equal(mandarinOhip.triggered, false);
assert.equal(mandarinOhip.state, "navigation_allowed");
assert.equal(searchChunks("我如何申请健康卡？")[0]?.source_id, "ontario_ohip_apply");

for (const language of supportedLanguages) {
  const result = evaluateChatGuardrails(
    "I have chest pain and trouble breathing",
    language
  );
  assert.equal(result.triggered, true);
  assert.equal(result.state, "emergency");
  assert.equal(result.confidence, "emergency");
  assert.match(result.answer ?? "", /911/);
}

console.log("Guardrail tests passed.");
