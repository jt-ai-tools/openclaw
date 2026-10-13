---
summary: "模型提供者概觀，包含組態範例與 CLI 流程說明"
read_when:
  - 您需要各個提供者的模型設定參考時
  - 您想要查看模型提供者的組態範例或 CLI 引導指令時
title: "模型提供者"
---

> 此文件為 [English Version](/concepts/model-providers_zh_TW) 的繁體中文版本。

# 模型提供者 (Model providers)

本頁面涵蓋 **LLM/模型提供者**（而非 WhatsApp/Telegram 等通訊頻道）。
關於模型選擇規則，請參閱 [/concepts/models](/concepts/models_zh_TW)。

## 快速規則

- 模型參考使用 `提供者/模型` 格式（例如：`opencode/claude-opus-4-6`）。
- 如果您設定了 `agents.defaults.models`，它會成為模型允許清單。
- CLI 輔助指令：`openclaw onboard`, `openclaw models list`, `openclaw models set <提供者/模型>`。

## 內建提供者 (pi-ai 型錄)

OpenClaw 隨附 pi‑ai 型錄。這些提供者 **無需** 額外的 `models.providers` 組態；只需設定驗證並挑選模型即可。

### OpenAI

- 提供者：`openai`
- 驗證環境變數：`OPENAI_API_KEY`
- 範例模型：`openai/gpt-5.1-codex`
- CLI：`openclaw onboard --auth-choice openai-api-key`

```json5
{
  agents: { defaults: { model: { primary: "openai/gpt-5.1-codex" } } },
}
```

### Anthropic

- 提供者：`anthropic`
- 驗證：`ANTHROPIC_API_KEY` 或 `claude setup-token`
- 範例模型：`anthropic/claude-opus-4-6`
- CLI：`openclaw onboard --auth-choice token` (貼上 setup-token) 或 `openclaw models auth paste-token --provider anthropic`

```json5
{
  agents: { defaults: { model: { primary: "anthropic/claude-opus-4-6" } } },
}
```

### OpenAI Code (Codex)

- 提供者：`openai-codex`
- 驗證：OAuth (ChatGPT)
- 範例模型：`openai-codex/gpt-5.3-codex`
- CLI：`openclaw onboard --auth-choice openai-codex` 或 `openclaw models auth login --provider openai-codex`

```json5
{
  agents: { defaults: { model: { primary: "openai-codex/gpt-5.3-codex" } } },
}
```

### OpenCode Zen

- 提供者：`opencode`
- 驗證環境變數：`OPENCODE_API_KEY` (或 `OPENCODE_ZEN_API_KEY`)
- 範例模型：`opencode/claude-opus-4-6`
- CLI：`openclaw onboard --auth-choice opencode-zen`

```json5
{
  agents: { defaults: { model: { primary: "opencode/claude-opus-4-6" } } },
}
```

### Google Gemini (API 密鑰)

- 提供者：`google`
- 驗證環境變數：`GEMINI_API_KEY`
- 範例模型：`google/gemini-3-pro-preview`
- CLI：`openclaw onboard --auth-choice gemini-api-key`

### Google Vertex, Antigravity 與 Gemini CLI

- 提供者：`google-vertex`, `google-antigravity`, `google-gemini-cli`
- 驗證：Vertex 使用 gcloud ADC；Antigravity/Gemini CLI 使用各自的驗證流程。
- Antigravity OAuth 以內建外掛程式形式提供 (`google-antigravity-auth`，預設停用)。
  - 啟用：`openclaw plugins enable google-antigravity-auth`
  - 登入：`openclaw models auth login --provider google-antigravity --set-default`
- Gemini CLI OAuth 以內建外掛程式形式提供 (`google-gemini-cli-auth`，預設停用)。
  - 啟用：`openclaw plugins enable google-gemini-cli-auth`
  - 登入：`openclaw models auth login --provider google-gemini-cli --set-default`
  - 注意：您 **不需** 將 Client ID 或 Secret 貼入 `openclaw.json`。CLI 登入流程會將 Token 儲存在閘道器主機的驗證設定檔中。

### Z.AI (GLM)

- 提供者：`zai`
- 驗證環境變數：`ZAI_API_KEY`
- 範例模型：`zai/glm-4.7`
- CLI：`openclaw onboard --auth-choice zai-api-key`
  - 別名：`z.ai/*` 與 `z-ai/*` 會自動規範化為 `zai/*`

### Vercel AI Gateway

- 提供者：`vercel-ai-gateway`
- 驗證環境變數：`AI_GATEWAY_API_KEY`
- 範例模型：`vercel-ai-gateway/anthropic/claude-opus-4.6`
- CLI：`openclaw onboard --auth-choice ai-gateway-api-key`

### 其他內建提供者

- OpenRouter：`openrouter` (`OPENROUTER_API_KEY`)
- 範例模型：`openrouter/anthropic/claude-sonnet-4-5`
- xAI：`xai` (`XAI_API_KEY`)
- Groq：`groq` (`GROQ_API_KEY`)
- Cerebras：`cerebras` (`CEREBRAS_API_KEY`)
  - Cerebras 上的 GLM 模型使用 ID `zai-glm-4.7` 與 `zai-glm-4.6`。
  - 相容於 OpenAI 的基礎 URL：`https://api.cerebras.ai/v1`。
- Mistral：`mistral` (`MISTRAL_API_KEY`)
- GitHub Copilot：`github-copilot` (`COPILOT_GITHUB_TOKEN` / `GH_TOKEN` / `GITHUB_TOKEN`)

## 透過 `models.providers` 使用提供者 (自訂/基礎 URL)

使用 `models.providers` (或 `models.json`) 來新增 **自訂** 提供者或相容於 OpenAI/Anthropic 的代理伺服器。

### Moonshot AI (Kimi)

Moonshot 使用相容於 OpenAI 的端點，因此將其配置為自訂提供者：

- 提供者：`moonshot`
- 驗證環境變數：`MOONSHOT_API_KEY`
- 範例模型：`moonshot/kimi-k2.5`

Kimi K2 模型 ID 列表：

- `moonshot/kimi-k2.5`
- `moonshot/kimi-k2-0905-preview`
- `moonshot/kimi-k2-turbo-preview`
- `moonshot/kimi-k2-thinking`
- `moonshot/kimi-k2-thinking-turbo`

```json5
{
  agents: {
    defaults: { model: { primary: "moonshot/kimi-k2.5" } },
  },
  models: {
    mode: "merge",
    providers: {
      moonshot: {
        baseUrl: "https://api.moonshot.ai/v1",
        apiKey: "${MOONSHOT_API_KEY}",
        api: "openai-completions",
        models: [{ id: "kimi-k2.5", name: "Kimi K2.5" }],
      },
    },
  },
}
```

### Kimi Coding

Kimi Coding 使用 Moonshot AI 相容於 Anthropic 的端點：

- 提供者：`kimi-coding`
- 驗證環境變數：`KIMI_API_KEY`
- 範例模型：`kimi-coding/k2p5`

```json5
{
  env: { KIMI_API_KEY: "sk-..." },
  agents: {
    defaults: { model: { primary: "kimi-coding/k2p5" } },
  },
}
```

### Qwen OAuth (免費版)

Qwen 透過裝置代碼流程提供對 Qwen Coder 與 Vision 的 OAuth 存取。啟用內建外掛程式後即可登入：

```bash
openclaw plugins enable qwen-portal-auth
openclaw models auth login --provider qwen-portal --set-default
```

模型參考：

- `qwen-portal/coder-model`
- `qwen-portal/vision-model`

設定細節與注意事項請參閱 [/providers/qwen](/providers/qwen_zh_TW)。

### Synthetic

Synthetic 提供位於 `synthetic` 提供者後方且相容於 Anthropic 的模型：

- 提供者：`synthetic`
- 驗證環境變數：`SYNTHETIC_API_KEY`
- 範例模型：`synthetic/hf:MiniMaxAI/MiniMax-M2.1`
- CLI：`openclaw onboard --auth-choice synthetic-api-key`

```json5
{
  agents: {
    defaults: { model: { primary: "synthetic/hf:MiniMaxAI/MiniMax-M2.1" } },
  },
  models: {
    mode: "merge",
    providers: {
      synthetic: {
        baseUrl: "https://api.synthetic.new/anthropic",
        apiKey: "${SYNTHETIC_API_KEY}",
        api: "anthropic-messages",
        models: [{ id: "hf:MiniMaxAI/MiniMax-M2.1", name: "MiniMax M2.1" }],
      },
    },
  },
}
```

### MiniMax

由於 MiniMax 使用自訂端點，因此需透過 `models.providers` 進行配置：

- MiniMax (相容於 Anthropic)：`--auth-choice minimax-api`
- 驗證環境變數：`MINIMAX_API_KEY`

設定細節、模型選項與組態片段請參閱 [/providers/minimax](/providers/minimax_zh_TW)。

### Ollama

Ollama 是一個提供相容於 OpenAI API 的本地端 LLM 執行環境：

- 提供者：`ollama`
- 驗證：無需驗證（本地伺服器）
- 範例模型：`ollama/llama3.3`
- 安裝網址：[https://ollama.ai](https://ollama.ai)

```bash
# 安裝 Ollama 後，提取模型：
ollama pull llama3.3
```

```json5
{
  agents: {
    defaults: { model: { primary: "ollama/llama3.3" } },
  },
}
```

當執行於 `http://127.0.0.1:11434/v1` 時，OpenClaw 會自動偵測。模型建議與自訂組態請參閱 [/providers/ollama](/providers/ollama_zh_TW)。

### 本地代理伺服器 (LM Studio, vLLM, LiteLLM 等)

範例（相容於 OpenAI）：

```json5
{
  agents: {
    defaults: {
      model: { primary: "lmstudio/minimax-m2.1-gs32" },
      models: { "lmstudio/minimax-m2.1-gs32": { alias: "Minimax" } },
    },
  },
  models: {
    providers: {
      lmstudio: {
        baseUrl: "http://localhost:1234/v1",
        apiKey: "LMSTUDIO_KEY",
        api: "openai-completions",
        models: [
          {
            id: "minimax-m2.1-gs32",
            name: "MiniMax M2.1",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 200000,
            maxTokens: 8192,
          },
        ],
      },
    },
  },
}
```

注意事項：

- 針對自訂提供者，`reasoning`, `input`, `cost`, `contextWindow` 與 `maxTokens` 皆為選填。
- 若省略上述欄位，OpenClaw 將預設為：
  - `reasoning: false`
  - `input: ["text"]`
  - `cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }`
  - `contextWindow: 200000`
  - `maxTokens: 8192`
- 建議方式：根據您的代理伺服器/模型限制設定明確的數值。

## CLI 範例

```bash
openclaw onboard --auth-choice opencode-zen
openclaw models set opencode/claude-opus-4-6
openclaw models list
```

完整的組態範例請參閱 [/gateway/configuration](/gateway/configuration_zh_TW)。
