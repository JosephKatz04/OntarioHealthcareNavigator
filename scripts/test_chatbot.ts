import {
  spawn,
  spawnSync,
  type ChildProcessWithoutNullStreams
} from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

type ChatbotTest = {
  id: string;
  question: string;
  language: string;
  required_phrases: string[];
  forbidden_phrases: string[];
  expect_sources: boolean;
};

type ChatResponse = {
  answer?: string;
  sources?: unknown[];
  confidence?: string;
  state?: string;
};

const testsPath = resolve(
  process.cwd(),
  "test_questions",
  "healthcare_navigation_tests.json"
);
const tests = JSON.parse(readFileSync(testsPath, "utf8")) as ChatbotTest[];
const port = 3025;
const baseUrl = `http://127.0.0.1:${port}`;
const bundledNpmCliPath = join(
  dirname(process.execPath),
  "node_modules",
  "npm",
  "bin",
  "npm-cli.js"
);
const npmCommand = existsSync(bundledNpmCliPath)
  ? process.execPath
  : process.platform === "win32"
    ? "npm.cmd"
    : "npm";
const npmArgsPrefix = existsSync(bundledNpmCliPath)
  ? [bundledNpmCliPath]
  : [];

function wait(ms: number) {
  return new Promise((resolveWait) => setTimeout(resolveWait, ms));
}

async function waitForServer(process: ChildProcessWithoutNullStreams) {
  let output = "";

  process.stdout.on("data", (data) => {
    output += data.toString();
  });
  process.stderr.on("data", (data) => {
    output += data.toString();
  });

  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/chat`);

      if (response.ok) {
        return;
      }
    } catch {
      await wait(500);
    }
  }

  throw new Error(`Timed out waiting for dev server.\n${output}`);
}

function includesPhrase(answer: string, phrase: string) {
  return answer.toLowerCase().includes(phrase.toLowerCase());
}

function evaluateResponse(test: ChatbotTest, response: ChatResponse) {
  const failures: string[] = [];
  const answer = response.answer ?? "";
  const sourceCount = Array.isArray(response.sources)
    ? response.sources.length
    : 0;

  for (const phrase of test.required_phrases) {
    if (!includesPhrase(answer, phrase)) {
      failures.push(`missing required phrase "${phrase}"`);
    }
  }

  for (const phrase of test.forbidden_phrases) {
    if (includesPhrase(answer, phrase)) {
      failures.push(`included forbidden phrase "${phrase}"`);
    }
  }

  if (test.expect_sources && sourceCount === 0) {
    failures.push("expected source cards but received none");
  }

  if (!test.expect_sources && sourceCount > 0) {
    failures.push(`expected no sources but received ${sourceCount}`);
  }

  return failures;
}

async function runTest(test: ChatbotTest) {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: test.question,
      language: test.language
    })
  });
  const body = (await response.json()) as ChatResponse;
  const failures = evaluateResponse(test, body);

  if (!response.ok) {
    failures.push(`HTTP ${response.status}`);
  }

  return {
    body,
    failures
  };
}

const server = spawn(
  npmCommand,
  [
    ...npmArgsPrefix,
    "run",
    "dev",
    "--",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port)
  ],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      CHATBOT_EVAL_MODE: "1",
      OPENAI_VECTOR_STORE_ID: "",
      OPENAI_API_KEY: ""
    }
  }
);

function stopServer(serverProcess: ChildProcessWithoutNullStreams) {
  if (serverProcess.killed) {
    return;
  }

  if (process.platform === "win32" && serverProcess.pid) {
    spawnSync("taskkill", ["/pid", String(serverProcess.pid), "/T", "/F"], {
      stdio: "ignore"
    });
    return;
  }

  serverProcess.kill("SIGTERM");
}

try {
  await waitForServer(server);

  let failed = 0;

  for (const test of tests) {
    const result = await runTest(test);

    if (result.failures.length === 0) {
      console.log(`PASS ${test.id}`);
    } else {
      failed += 1;
      console.log(`FAIL ${test.id}`);
      for (const failure of result.failures) {
        console.log(`  - ${failure}`);
      }
      console.log(`  answer: ${result.body.answer ?? ""}`);
      console.log(`  state: ${result.body.state ?? "unknown"}`);
      console.log(
        `  sources: ${
          Array.isArray(result.body.sources) ? result.body.sources.length : 0
        }`
      );
    }
  }

  console.log(`\n${tests.length - failed}/${tests.length} chatbot tests passed.`);

  if (failed > 0) {
    process.exitCode = 1;
  }
} finally {
  stopServer(server);
}

process.exit(process.exitCode ?? 0);
