# Ontario Health Navigator

A public-facing Next.js App Router website prototype that helps newcomers to
Ontario, Canada understand broad healthcare navigation topics.

The content is intentionally safe placeholder text. It does not include detailed
Ontario healthcare rules, medical advice, legal advice, or eligibility guidance.

## Local Development

Requirements:

- Node.js 20 or newer
- npm

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your local values. Never commit `.env.local`.

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Check TypeScript:

```bash
npm run typecheck
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Run the chatbot evaluation suite:

```bash
npm run test:chatbot
```

## Environment Variables

Required for AI-backed chat responses:

```text
OPENAI_API_KEY=your_openai_api_key_here
```

Optional:

```text
OPENAI_MODEL=gpt-5.4-mini
OPENAI_VECTOR_STORE_ID=your_vector_store_id_here
```

`OPENAI_VECTOR_STORE_ID` is required only when using OpenAI File Search / vector
store retrieval. If it is not set, the app falls back to local keyword search
over `data/processed_chunks/chunks.json`.

Secrets must stay server-side. Do not prefix secret variables with
`NEXT_PUBLIC_`.

## Source Library

Validate source metadata:

```bash
npm run check:sources
```

Rebuild processed chunks from `data/raw_sources`:

```bash
npm run ingest
```

Upload or refresh the OpenAI vector store:

```bash
npm run upload:vector-store
```

The upload script requires `OPENAI_API_KEY` and writes the new
`OPENAI_VECTOR_STORE_ID` to `.env.local`.

## Vercel Deployment

1. Push the repository to GitHub.
2. Create a new Vercel project and import the repository.
3. Use the default Next.js framework settings.
4. Add environment variables in Vercel Project Settings:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` if you want to override the default model
   - `OPENAI_VECTOR_STORE_ID` if using vector store retrieval
5. Deploy.

Vercel should use:

```text
Build Command: npm run build
Install Command: npm install
Output Directory: .next
```

Health check endpoint:

```text
/api/health
```

## Security Notes

- `.env.local` is ignored by Git.
- Do not commit API keys or vector-store credentials.
- Keep OpenAI calls inside server routes only.
- The chatbot should answer healthcare facts only when supported by retrieved
  source documents.
- Emergency messages should direct users to call 911.
