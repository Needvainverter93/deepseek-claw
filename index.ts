#!/usr/bin/env node
/**
 * deepseek-claw MCP server
 * Bridges OpenClaw / Claude Desktop to the Python DeepSeek skill via subprocess.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, "..");
const PYTHON_CLI = path.join(SKILL_ROOT, "scripts", "deepseek.py");

// ── Tool definitions ──────────────────────────────────────────────────────────

const TOOLS: Tool[] = [
  {
    name: "deepseek_chat",
    description:
      "Chat with DeepSeek-Chat model. General purpose conversation, Q&A, writing assistance.",
    inputSchema: {
      type: "object",
      required: ["message"],
      properties: {
        message: { type: "string", description: "Message to send to DeepSeek" },
        model: {
          type: "string",
          description: "Model to use (default: deepseek-chat)",
          enum: ["deepseek-chat", "deepseek-reasoner"],
        },
        system: { type: "string", description: "Optional system prompt" },
      },
    },
  },
  {
    name: "deepseek_reason",
    description:
      "Deep step-by-step reasoning via DeepSeek-Reasoner (R1). Best for math, logic, complex analysis.",
    inputSchema: {
      type: "object",
      required: ["question"],
      properties: {
        question: { type: "string", description: "Question or problem to reason about" },
        show_thinking: {
          type: "boolean",
          description: "Show reasoning chain (default: true)",
        },
      },
    },
  },
  {
    name: "deepseek_code",
    description:
      "Generate or explain code using DeepSeek. Supports any programming language.",
    inputSchema: {
      type: "object",
      required: ["task"],
      properties: {
        task: { type: "string", description: "Coding task or question" },
        language: {
          type: "string",
          description: "Target programming language (default: python)",
        },
      },
    },
  },
  {
    name: "deepseek_session_start",
    description: "Start a new persistent multi-turn conversation session.",
    inputSchema: {
      type: "object",
      properties: {
        model: {
          type: "string",
          description: "Model for this session (default: deepseek-chat)",
        },
      },
    },
  },
  {
    name: "deepseek_session_message",
    description: "Send a message in the current session (maintains conversation history).",
    inputSchema: {
      type: "object",
      required: ["text"],
      properties: {
        text: { type: "string", description: "Your message" },
      },
    },
  },
  {
    name: "deepseek_session_show",
    description: "Display current session conversation history.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "deepseek_session_clear",
    description: "Clear the current session history and start fresh.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "deepseek_models",
    description: "List available DeepSeek models with descriptions.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "deepseek_status",
    description: "Check DeepSeek API connectivity and account balance.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "deepseek_summarize",
    description: "Summarize long text intelligently using DeepSeek.",
    inputSchema: {
      type: "object",
      required: ["text"],
      properties: {
        text: { type: "string", description: "Text to summarize" },
        language: {
          type: "string",
          description: "Output language (default: same as input)",
        },
      },
    },
  },
  {
    name: "deepseek_translate",
    description: "Translate text to another language.",
    inputSchema: {
      type: "object",
      required: ["text"],
      properties: {
        text: { type: "string", description: "Text to translate" },
        to: { type: "string", description: "Target language (default: English)" },
      },
    },
  },
  {
    name: "deepseek_review",
    description: "Code review — finds bugs, security issues, performance problems, and style violations.",
    inputSchema: {
      type: "object",
      required: ["code"],
      properties: {
        code: { type: "string", description: "Code to review" },
        language: { type: "string", description: "Programming language hint (optional)" },
      },
    },
  },
];

// ── CLI runner ────────────────────────────────────────────────────────────────

async function runCLI(args: string[]): Promise<string> {
  const uvArgs = ["run", "python", PYTHON_CLI, ...args];
  try {
    const { stdout, stderr } = await execFileAsync("uv", uvArgs, {
      cwd: SKILL_ROOT,
      env: { ...process.env },
      timeout: 120_000,
    });
    return stdout + (stderr ? `\n[stderr]\n${stderr}` : "");
  } catch (err: any) {
    return `Error: ${err.message}\n${err.stderr ?? ""}`;
  }
}

// ── Tool dispatcher ───────────────────────────────────────────────────────────

async function callTool(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case "deepseek_chat": {
      const cliArgs = ["chat", String(args.message)];
      if (args.model) cliArgs.push("--model", String(args.model));
      if (args.system) cliArgs.push("--system", String(args.system));
      return runCLI(cliArgs);
    }

    case "deepseek_reason": {
      const cliArgs = ["reason", String(args.question)];
      if (args.show_thinking === false) cliArgs.push("--no-show-thinking");
      return runCLI(cliArgs);
    }

    case "deepseek_code": {
      const cliArgs = ["code", String(args.task)];
      if (args.language) cliArgs.push("--language", String(args.language));
      return runCLI(cliArgs);
    }

    case "deepseek_session_start": {
      const cliArgs = ["session", "start"];
      if (args.model) cliArgs.push("--model", String(args.model));
      return runCLI(cliArgs);
    }

    case "deepseek_session_message":
      return runCLI(["session", "message", String(args.text)]);

    case "deepseek_session_show":
      return runCLI(["session", "show"]);

    case "deepseek_session_clear":
      return runCLI(["session", "clear"]);

    case "deepseek_models":
      return runCLI(["models"]);

    case "deepseek_status":
      return runCLI(["status"]);

    case "deepseek_summarize": {
      const cliArgs = ["summarize", String(args.text)];
      if (args.language) cliArgs.push("--language", String(args.language));
      return runCLI(cliArgs);
    }

    case "deepseek_translate": {
      const cliArgs = ["translate", String(args.text)];
      if (args.to) cliArgs.push("--to", String(args.to));
      return runCLI(cliArgs);
    }

    case "deepseek_review": {
      const cliArgs = ["review", String(args.code)];
      if (args.language) cliArgs.push("--language", String(args.language));
      return runCLI(cliArgs);
    }

    default:
      return `Unknown tool: ${name}`;
  }
}

// ── MCP Server ────────────────────────────────────────────────────────────────

const server = new Server(
  { name: "deepseek-claw", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const result = await callTool(
    req.params.name,
    (req.params.arguments ?? {}) as Record<string, unknown>
  );
  return {
    content: [{ type: "text", text: result }],
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
