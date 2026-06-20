# AGENTS.md

## Project

Ontario Health Navigator is a multilingual RAG-based healthcare navigation website for newcomers to Ontario, Canada.

The product should help users understand where to find official healthcare information and services. It must not act as a doctor, eligibility decision-maker, legal advisor, or emergency triage service.

## Setup

- Use Next.js App Router, TypeScript, and Tailwind CSS.
- Keep the app mobile-first, accessible, readable, and suitable for public-service information.
- Keep API keys and service credentials server-side only.
- Do not commit secrets, private data, or production credentials.
- Prefer clear, reusable components and simple content models that can support future RAG source ingestion.

## Safety Rules

- Do not invent healthcare eligibility rules, fees, deadlines, coverage details, wait times, required documents, or service availability.
- Do not diagnose medical conditions.
- Do not provide treatment plans, medication instructions, or individualized medical advice.
- Do not provide emergency triage beyond official redirection.
- If a user describes a possible emergency, direct them to call 911.
- For non-emergency health navigation, the chatbot may suggest official Ontario resources only when supported by sources.
- If an answer is not supported by the source library, say that the information was not found.
- Keep disclaimers visible where users may confuse navigation help with medical, legal, or eligibility advice.

## Source And Citation Rules

- Use official or reputable sources for healthcare information, such as Ontario government pages, ServiceOntario, Health811, public health units, hospitals, and recognized settlement or community health organizations.
- The chatbot must cite retrieved sources in its answers.
- RAG answers should be grounded only in retrieved source content, not general model knowledge.
- Source records should track title, URL, organization, topic, language availability, and review date when possible.
- If sources conflict, say so clearly and direct users to the official source owner.

## Engineering Rules

- Use Next.js App Router conventions under `src/app`.
- Use TypeScript for application code.
- Use Tailwind for styling.
- Keep components accessible: semantic HTML, keyboard-friendly controls, sufficient contrast, and clear labels.
- Keep layouts responsive and mobile-first.
- Add or update tests when behavior changes.
- Run lint and build after significant changes.
- Before major work, propose a short plan.

## Testing

- Run `npm run lint` after code changes.
- Run `npm run typecheck` after TypeScript changes.
- Run `npm run build` after significant routing, layout, dependency, or configuration changes.
- Verify important pages and navigation locally before considering work complete.

## Done Criteria

- Changes should preserve the safety rules above.
- New healthcare content should be source-backed or clearly marked as placeholder content.
- Chatbot behavior should cite sources and decline unsupported answers.
- The app should lint, typecheck, and build before handoff when practical.
