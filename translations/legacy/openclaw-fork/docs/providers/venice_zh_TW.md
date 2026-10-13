---
summary: "在 OpenClaw 中使用 Venice AI 隱私優先模型"
read_when:
  - 您想要在 OpenClaw 中進行隱私優先的推論時
  - 您需要 Venice AI 設定指引時
title: "Venice AI"
---

> 此文件為 [English Version](/providers/venice_zh_TW) 的繁體中文版本。

# Venice AI (Venice 亮點介紹)

**Venice** 是我們推薦的 Venice 設定，適用於隱私優先的推論，並可選擇透過其匿名代理存取商用模型。

Venice AI 提供專注於隱私的 AI 推論，支援無審查 (Uncensored) 模型，並能透過匿名代理存取主流的商用模型。所有的推論預設皆為私密 —— 不會使用您的數據進行訓練，也不會記錄日誌。

## 為什麼在 OpenClaw 中選用 Venice

- **私密推論**：針對開源模型提供私密推論（不留日誌）。
- **無審查模型**：在有需要時可存取無內容限制的模型。
- **匿名存取**：當重視品質時，可匿名存取商用模型 (Opus/GPT/Gemini)。
- 相容於 OpenAI 的 `/v1` 端點。

## 隱私模式

Venice 提供兩種隱私層級 —— 了解這點是選擇模型的關鍵：

| 模式           | 說明                                                                                                                 | 模型                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **私密 (Private)** | 完全私密。提示詞/回應 **絕不被儲存或記錄**。瞬時性。                                                               | Llama, Qwen, DeepSeek, Venice Uncensored 等。 |
| **匿名 (Anonymized)** | 透過 Venice 代理並移除詮釋資料。底層提供者 (OpenAI, Anthropic) 僅能看到匿名化的請求。 | Claude, GPT, Gemini, Grok, Kimi, MiniMax       |

## 功能特色

- **隱私優先**：在「私密」（完全私密）與「匿名」（代理）模式間切換。
- **無審查模型**：存取無內容限制的模型。
- **主流模型存取**：透過 Venice 匿名代理使用 Claude, GPT-5.2, Gemini, Grok。
- **相容於 OpenAI 的 API**：標準 `/v1` 端點，易於整合。
- **串流 (Streaming)**：✅ 所有模型皆支援。
- **工具呼叫 (Function calling)**：✅ 部分模型支援（請檢查模型能力）。
- **視覺 (Vision)**：✅ 具備視覺能力的模型皆支援。

## 設定步驟

### 1. 獲取 API 密鑰

1. 在 [venice.ai](https://venice.ai) 註冊。
2. 前往 **Settings → API Keys → Create new key**。
3. 複製您的 API 密鑰（格式：`vapi_xxxxxxxxxxxx`）。

### 2. 配置 OpenClaw

**選項 A：環境變數**

```bash
export VENICE_API_KEY="vapi_xxxxxxxxxxxx"
```

**選項 B：互動式設定（建議方式）**

```bash
openclaw onboard --auth-choice venice-api-key
```

### 3. 驗證設定

```bash
openclaw chat --model venice/llama-3.3-70b "哈囉，運作正常嗎？"
```

## 模型選擇建議

| 使用情境                     | 建議模型                         | 原因                                      |
| ---------------------------- | -------------------------------- | ----------------------------------------- |
| **一般聊天**                 | `llama-3.3-70b`                  | 表現均衡且完全私密                        |
| **最佳整體品質**             | `claude-opus-45`                 | 對於艱巨任務，Opus 仍是最強模型           |
| **隱私 + Claude 品質**       | `claude-opus-45`                 | 透過匿名代理獲得最佳推理能力              |
| **程式碼編寫**               | `qwen3-coder-480b-a35b-instruct` | 針對程式碼優化，具備 262k 上下文          |
| **視覺任務**                 | `qwen3-vl-235b-a22b`             | 最佳的私密視覺模型                        |
| **無審查需求**               | `venice-uncensored`              | 無任何內容限制                            |
| **快速且廉價**               | `qwen3-4b`                       | 輕量級但仍具備一定能力                    |
| **複雜推理**                 | `deepseek-v3.2`                  | 強大的推理能力，且具備私密性              |

## 可用模型（總計 25 個）

### 私密模型 (15) —— 完全私密，無日誌

| 模型 ID                          | 名稱                    | 上下文 (Tokens) | 特色                    |
| -------------------------------- | ----------------------- | --------------- | ----------------------- |
| `llama-3.3-70b`                  | Llama 3.3 70B           | 131k            | 通用                    |
| `qwen3-coder-480b-a35b-instruct` | Qwen3 Coder 480B        | 262k            | 程式碼                  |
| `qwen3-vl-235b-a22b`             | Qwen3 VL 235B           | 262k            | 視覺                    |
| `venice-uncensored`              | Venice Uncensored       | 32k             | 無審查                  |
| `deepseek-v3.2`                  | DeepSeek V3.2           | 163k            | 推理                    |

### 匿名模型 (10) —— 透過 Venice 代理

| 模型 ID                  | 原始模型          | 上下文 (Tokens) | 特色                    |
| ------------------------ | ----------------- | --------------- | ----------------------- |
| `claude-opus-45`         | Claude Opus 4.5   | 202k            | 推理, 視覺              |
| `claude-sonnet-45`       | Claude Sonnet 4.5 | 202k            | 推理, 視覺              |
| `openai-gpt-52`          | GPT-5.2           | 262k            | 推理                    |
| `gemini-3-pro-preview`   | Gemini 3 Pro      | 202k            | 推理, 視覺              |

## 連結

- [Venice AI](https://venice.ai)
- [API 說明文件](https://docs.venice.ai)
- [定價資訊](https://venice.ai/pricing)
- [服務狀態](https://status.venice.ai)
