# RAG Architecture

Ontario Health Navigator uses retrieval-augmented generation so chatbot answers can be tied to source documents instead of unsupported general knowledge.

## User Question

The chat UI sends a POST request to `/api/chat` with:

- `message`: the user's question
- `language`: the selected supported language

The API route validates that the message is present before continuing.

## Language Handling

Supported languages are defined in `src/lib/chat/languages.ts`:

- English
- French
- Mandarin Chinese
- Punjabi
- Arabic
- Hindi
- Urdu
- Spanish
- Tagalog

The selected language is normalized server-side. If the value is unknown, the server falls back to English.

For non-English answers, the API appends:

```text
This answer was generated from Ontario source documents and translated for convenience.
```

When local keyword retrieval is used, `src/lib/rag/searchChunks.ts` expands some common non-English healthcare navigation terms into English retrieval terms. When OpenAI File Search is configured, the prompt instructs the model to reformulate non-English questions into English for retrieval and answer in the selected language.

## Retrieval

There are two retrieval paths.

### OpenAI File Search

If `OPENAI_VECTOR_STORE_ID` is set, `/api/chat` uses OpenAI Responses API with the `file_search` tool and the configured vector store.

The vector store is populated by:

```powershell
npm run upload:vector-store
```

The upload script reads `data/processed_chunks/chunks.json`, uploads each chunk, attaches metadata, writes `data/source_metadata/vector_store_manifest.json`, and updates `.env.local`.

### Local Fallback

If `OPENAI_VECTOR_STORE_ID` is not set, `/api/chat` uses `searchChunks` from `src/lib/rag/searchChunks.ts`.

The local fallback:

- Reads `data/processed_chunks/chunks.json`
- Expands simple synonyms and selected multilingual terms
- Scores chunks by keyword overlap
- Returns up to five matching chunks

If no relevant chunks are found, the API returns:

```text
I could not find that in the current Ontario source library.
```

## Answer Generation

Before retrieval or model calls, `src/lib/chat/guardrails.ts` checks for emergency and unsafe medical-advice requests.

For normal navigation questions:

- With OpenAI File Search, the model receives the system prompt and uses file search against the vector store.
- With local fallback, the model receives the retrieved chunks in the prompt.
- In `CHATBOT_EVAL_MODE=1`, the local fallback returns a deterministic source-library answer without making an OpenAI call. This is used by `npm run test:chatbot`.

The system prompt requires the model to answer only from retrieved source material and not invent healthcare facts.

## Citations

The API returns source cards in a `sources` array. Each source includes:

- `id`
- `title`
- `organization`
- `url`
- `last_checked`

For local fallback, source cards are built directly from retrieved chunks. For OpenAI File Search, source cards are built from file search results and `data/source_metadata/vector_store_manifest.json`.

Source URLs are not translated.

## Confidence States

The API currently uses these confidence values:

- `emergency`: emergency guardrail response
- `medium`: answered from retrieved source material
- `low`: unsupported, invalid request, medical-advice refusal, or safe error response
- `high`: reserved in the type but not currently emitted by the route

The response can also include a `state`, such as:

- `emergency`
- `medical_advice_refusal`
- `answered`
- `not_found`
- `error`

