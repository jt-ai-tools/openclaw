---
summary: "在本地端執行 OpenClaw 的 LLM 模型（LM Studio、vLLM、LiteLLM、自訂 OpenAI 端點）"
read_when:
  - 您希望從自有的 GPU 主機提供模型服務
  - 您正在連接 LM Studio 或相容於 OpenAI 的代理伺服器
  - 您需要最安全的本地模型使用指引
title: "本地模型"
---

> 此文件為 [English Version](/gateway/local-models) 的繁體中文版本。

# 本地模型

在本地端執行模型是可行的，但 OpenClaw 要求大型上下文 (Context) 以及強大的提示詞注入 (Prompt injection) 防禦能力。性能不足的顯示卡會導致上下文被截斷並產生安全性漏洞。請以此目標為準：**至少兩台頂配的 Mac Studio 或同等級的 GPU 設備（預算約 3 萬美元以上）**。單張 **24 GB** 的 GPU 僅適用於較短的提示詞，且延遲較高。請使用 **您可以執行的最大型 / 全尺寸模型變體**；過度量化 (Aggressively quantized) 或「小型」的檢查點 (Checkpoints) 會增加提示詞注入的風險（詳見 [安全性](/gateway/security_zh_TW)）。

## 建議設定：LM Studio + MiniMax M2.1 (Responses API, 全尺寸)

這是目前最佳的本地技術組合。在 LM Studio 中載入 MiniMax M2.1，啟用本地伺服器（預設為 `http://127.0.0.1:1234`），並使用 Responses API 將推理過程與最終文字分開。

```json5
{
  agents: {
    defaults: {
      model: { primary: "lmstudio/minimax-m2.1-gs32" },
      models: {
        "anthropic/claude-opus-4-6": { alias: "Opus" },
        "lmstudio/minimax-m2.1-gs32": { alias: "Minimax" },
      },
    },
  },
  models: {
    mode: "merge",
    providers: {
      lmstudio: {
        baseUrl: "http://127.0.0.1:1234/v1",
        apiKey: "lmstudio",
        api: "openai-responses",
        models: [
          {
            id: "minimax-m2.1-gs32",
            name: "MiniMax M2.1 GS32",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 196608,
            maxTokens: 8192,
          },
        ],
      },
    },
  },
}
```

**設定檢查清單**

- 安裝 LM Studio：[https://lmstudio.ai](https://lmstudio.ai)
- 在 LM Studio 中，下載 **可用的最大型 MiniMax M2.1 版本**（避免使用「小型」或高度量化的變體），啟動伺服器，並確認 `http://127.0.0.1:1234/v1/models` 已將其列出。
- 保持模型已載入狀態；冷啟動載入 (Cold-load) 會增加啟動延遲。
- 若您的 LM Studio 版本不同，請調整 `contextWindow`/`maxTokens`。
- 針對 WhatsApp，請堅持使用 Responses API，以確保僅發送最終文字。

即使執行本地模型，也請保留託管模型的組態；使用 `models.mode: "merge"` 確保備援模型始終可用。

### 混合配置：託管作為主要，本地作為備援

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-5",
        fallbacks: ["lmstudio/minimax-m2.1-gs32", "anthropic/claude-opus-4-6"],
      },
      models: {
        "anthropic/claude-sonnet-4-5": { alias: "Sonnet" },
        "lmstudio/minimax-m2.1-gs32": { alias: "MiniMax Local" },
        "anthropic/claude-opus-4-6": { alias: "Opus" },
      },
    },
  },
  models: {
    mode: "merge",
    providers: {
      lmstudio: {
        baseUrl: "http://127.0.0.1:1234/v1",
        apiKey: "lmstudio",
        api: "openai-responses",
        models: [
          {
            id: "minimax-m2.1-gs32",
            name: "MiniMax M2.1 GS32",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 196608,
            maxTokens: 8192,
          },
        ],
      },
    },
  },
}
```

### 本地優先並搭配託管安全網

交換主要與備援的順序；保留相同的提供者區塊與 `models.mode: "merge"`，這樣當本地主機斷線時，系統可以自動回退到 Sonnet 或 Opus。

### 區域代管 / 數據路由

- 託管的 MiniMax/Kimi/GLM 變體也存在於 OpenRouter 上，並具備地區固定的端點（例如美國代管）。選擇這些區域變體，可以讓流量留在您指定的轄區內，同時仍能使用 `models.mode: "merge"` 進行 Anthropic/OpenAI 的備援。
- 僅限本地 (Local-only) 仍是隱私性最強的路徑；當您需要提供者功能但又想控制數據流向時，託管的區域路由是理想的折衷方案。

## 其他相容於 OpenAI 的本地代理伺服器

vLLM、LiteLLM、OAI-proxy 或自訂閘道器，只要能提供 OpenAI 風格的 `/v1` 端點即可運作。請將上方的提供者區塊替換為您的端點與模型 ID：

```json5
{
  models: {
    mode: "merge",
    providers: {
      local: {
        baseUrl: "http://127.0.0.1:8000/v1",
        apiKey: "sk-local",
        api: "openai-responses",
        models: [
          {
            id: "my-local-model",
            name: "本地模型",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 120000,
            maxTokens: 8192,
          },
        ],
      },
    },
  },
}
```

保持 `models.mode: "merge"` 讓託管模型能作為備援使用。

## 故障排除

- 閘道器是否能接觸到代理伺服器？執行 `curl http://127.0.0.1:1234/v1/models`。
- LM Studio 模型是否已卸載？請重新載入；冷啟動 (Cold start) 是常見的「程序停滯」原因。
- 上下文錯誤？請調低 `contextWindow` 或調高伺服器限制。
- 安全性：本地模型會跳過提供者端的過濾機制；請縮減代理人的權限範圍並保持壓縮功能開啟，以限制提示詞注入的影響範圍。
