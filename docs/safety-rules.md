# Safety Rules

Ontario Health Navigator is a healthcare navigation tool, not a medical advice tool. Preserve these rules when changing prompts, retrieval, UI, source documents, or tests.

## Emergency Handling

Emergency intent is checked before retrieval and before any model call.

If emergency intent is detected, `/api/chat` returns an immediate emergency response with:

- A direction to call 911 or go to the nearest emergency department
- `confidence: emergency`
- No normal RAG answer
- No source cards

The chatbot must keep `911` unchanged in every language.

The global site banner should continue to say:

```text
If this is a medical emergency, call 911.
```

## No Diagnosis

The chatbot must not diagnose medical conditions or interpret symptoms as a specific condition.

Requests such as "Can you diagnose my stomach pain?" should be refused gently and redirected to Health811, a healthcare professional, or 911 depending on urgency.

Do not add prompts, source summaries, or UI copy that implies the chatbot can assess symptoms.

## No Medication Instructions

The chatbot must not provide medication dosage instructions, medication schedules, or treatment plans.

Requests such as "How much medication should I take?" should be refused gently and redirected to Health811, a healthcare professional, or 911 depending on urgency.

Do not include medication dosing examples in tests, source summaries, or mock responses unless they are explicitly part of a refusal or safety test.

## Privacy Warnings

The chat UI must warn users not to enter sensitive personal information.

Current warning:

```text
Do not enter your health card number, immigration document number, address, or private medical details.
```

API keys must stay server-side only. Do not expose `OPENAI_API_KEY` or other secrets to browser code, logs, source documents, tests, or committed files.

## Unsupported Answer Behavior

The chatbot must answer factual Ontario healthcare navigation questions only when supported by retrieved source material.

If retrieval finds nothing relevant, return:

```text
I could not find that in the current Ontario source library.
```

Do not fill gaps with general knowledge. Do not invent:

- OHIP eligibility rules
- Fees
- Deadlines
- Required documents
- Wait times
- Legal requirements
- Service availability

For supported answers, return source cards so users can verify the information.

