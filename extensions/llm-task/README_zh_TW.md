# LLM Task (外掛程式)

新增一個 **選用** 的代理人工具 `llm-task`，用於執行 **僅限 JSON (JSON-only)** 的 LLM 任務（如起草、摘要、分類），並支援選用的 JSON Schema 驗證。

旨在從工作流引擎（例如 Lobster 透過 `openclaw.invoke --each`）呼叫，而無需為每個工作流增加新的 OpenClaw 程式碼。

## 啟用

1. 啟用外掛程式：

```json
{
  "plugins": {
    "entries": {
      "llm-task": { "enabled": true }
    }
  }
}
```

2. 將工具加入允許清單（它註冊時標記為 `optional: true`）：

```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "tools": { "allow": ["llm-task"] }
      }
    ]
  }
}
```

## 組態設定 (選填)

```json
{
  "plugins": {
    "entries": {
      "llm-task": {
        "enabled": true,
        "config": {
          "defaultProvider": "openai-codex",
          "defaultModel": "gpt-5.2",
          "defaultAuthProfileId": "main",
          "allowedModels": ["openai-codex/gpt-5.2"],
          "maxTokens": 800,
          "timeoutMs": 30000
        }
      }
    }
  }
}
```

`allowedModels` 是 `提供者/模型` 字串的允許清單。如果設定了此項，任何清單之外的請求都將被拒絕。

## 工具 API

### 參數 (Parameters)

- `prompt` (字串，必填)
- `input` (任意類型，選填)
- `schema` (物件，選填的 JSON Schema)
- `provider` (字串，選填)
- `model` (字串，選填)
- `authProfileId` (字串，選填)
- `temperature` (數字，選填)
- `maxTokens` (數字，選填)
- `timeoutMs` (數字，選填)

### 輸出 (Output)

回傳包含已解析 JSON 的 `details.json`（如果提供了 `schema`，則會進行驗證）。

## 注意事項

- 此工具為 **僅限 JSON (JSON-only)**，並會指示模型僅輸出 JSON（無程式碼區塊，無評論解說）。
- 此執行過程中模型無法存取任何工具。
- 副作用 (Side effects) 應在此工具之外處理（例如在 Lobster 中進行核准），然後再呼叫發送訊息/電子郵件的工具。

## 內建擴充功能說明

此擴充功能依賴於 OpenClaw 內部模組（內嵌代理人執行器）。它旨在作為 **內建 (Bundled)** 的 OpenClaw 擴充功能（如 `lobster`）發佈，並透過 `plugins.entries` 與工具允許清單啟用。

目前它 **並未** 被設計為可複製到 `~/.openclaw/extensions` 作為獨立外掛程式目錄使用。
