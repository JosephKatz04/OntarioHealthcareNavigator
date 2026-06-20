# RAG Source Document Format

Raw source documents live in `data/raw_sources`.

Each source document should be a Markdown file with YAML frontmatter at the top, followed by verified source text or a careful plain-language summary. Do not add healthcare content unless it has been checked against the source URL.

## Required Frontmatter

```md
---
source_id: short_unique_id
title: Official page title
organization: Source organization name
url: https://official-source-url.example
category: Source category
language: English
last_checked: YYYY-MM-DD
---

Verified source text or a plain-language summary goes here.
```

## Field Rules

- `source_id`: Stable unique ID for this raw source document.
- `title`: Title of the official or reliable source page.
- `organization`: Organization that owns or publishes the source.
- `url`: Direct URL to the source page.
- `category`: Broad topic, such as `OHIP`, `Primary care`, `Emergency care`, `Mental health and addictions`, or `Newcomer health navigation`.
- `language`: Language of the source document.
- `last_checked`: Date the source was manually checked, using `YYYY-MM-DD`.

Every source needs a `last_checked` date because healthcare information, service availability, eligibility rules, fees, documents, deadlines, and contact details can change.

## Acceptable Sources

Use official or reliable Ontario/newcomer service websites, such as:

- Government of Ontario pages
- ServiceOntario pages
- Health811
- Ontario Health or Ontario Health atHome
- Public health units
- Hospitals and official health system organizations
- Recognized newcomer settlement organizations
- Reliable community service directories such as 211 Ontario

## Content Rules

- Do not invent healthcare eligibility rules, fees, deadlines, wait times, required documents, or service availability.
- Do not copy large amounts of text from a source page.
- Prefer short verified excerpts or careful plain-language summaries.
- If you cannot verify the page content, say `Content not extracted yet.` and explain what still needs review.
- If the source is not official government content, make that clear in the summary.
- Keep emergency guidance simple: if this is a medical emergency, call 911.

## Manual Add Process

1. Choose an official or reliable source page.
2. Create a Markdown file in `data/raw_sources`.
3. Add the required frontmatter.
4. Read the source page manually.
5. Add only verified text or a cautious plain-language summary.
6. Set `last_checked` to the date you reviewed the source.
7. If the source contains eligibility, fees, deadlines, required documents, or service availability, keep the summary cautious and point users back to the official URL.
8. Run:

```bash
npm run check:sources
```

`npm run check:sources` validates `data/sources.json`. Raw Markdown validation can be added later when the ingestion pipeline is built.
