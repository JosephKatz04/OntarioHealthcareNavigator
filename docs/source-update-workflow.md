# Source Update Workflow

Ontario Health Navigator answers should be grounded in verified source documents. Use this workflow when adding or updating source material for the chatbot.

## Add a New Official Source

1. Choose an official or reliable source.
   - Prefer Government of Ontario, Ontario health-system organizations, municipal or provincial directories, and established newcomer-service organizations.
   - Do not add unverified blogs, forum posts, or copied AI summaries.

2. Add metadata to `data/sources.json`.
   - Required fields are `id`, `title`, `organization`, `url`, `category`, `jurisdiction`, `language`, `last_checked`, `reliability_level`, and `notes`.
   - Use kebab-case for `id`, for example `health-care-connect`.
   - Use an `https://` URL.
   - Use `YYYY-MM-DD` for `last_checked`.

3. Add a raw source document in `data/raw_sources`.
   - Use a `.md` file with YAML frontmatter.
   - The `source_id` should match the source identity used by chunks and citations.
   - Include only text that has been manually verified from the source.
   - If you write a plain-language summary, keep it cautious and source-grounded.
   - Do not invent eligibility rules, fees, deadlines, wait times, required documents, service availability, or legal requirements.

Example:

```markdown
---
source_id: example_source
title: Example Ontario health page
organization: Government of Ontario
url: https://www.ontario.ca/example
category: health_navigation
language: English
last_checked: 2026-06-19
---

Verified source text or a cautious plain-language summary goes here.
```

## Update `last_checked`

When you review a source, update `last_checked` in both places:

- `data/sources.json`
- The matching raw markdown file in `data/raw_sources`

Only update the date after checking the current source page. If the official page changed, update the raw markdown summary before ingesting.

## Validate Source Metadata

Run:

```powershell
npm run check:sources
```

This validates `data/sources.json` for required fields, supported categories, reliability levels, URL format, date format, and duplicate IDs.

## Rebuild Processed Chunks

Run:

```powershell
npm run ingest
```

This reads every markdown file in `data/raw_sources`, validates frontmatter, splits each body into chunks, and writes `data/processed_chunks/chunks.json`.

The chatbot local fallback reads this chunks file through `src/lib/rag/searchChunks.ts`.

## Upload or Update the Vector Store

After `npm run ingest`, upload chunks to OpenAI File Search:

```powershell
npm run upload:vector-store
```

This script:

- Reads `data/processed_chunks/chunks.json`
- Creates a new OpenAI vector store
- Uploads each processed chunk as a markdown file
- Writes `data/source_metadata/vector_store_manifest.json`
- Updates `.env.local` with `OPENAI_VECTOR_STORE_ID`

Required local environment:

```text
OPENAI_API_KEY=your_openai_api_key_here
```

Do not commit `.env.local` or API keys.

## Run Chatbot Tests

Run:

```powershell
npm run test:chatbot
```

The test runner starts a temporary local Next.js server in evaluation mode and sends test questions to `/api/chat`. It checks required phrases, forbidden phrases, and whether source cards are returned.

Also run the regular checks after meaningful source or chatbot changes:

```powershell
npm test
npm run typecheck
npm run lint
npm run build
```

