---
summary: "工作流中僅限 JSON 的 LLM 任務步驟（選用的外掛程式工具）"
read_when:
  - 您想要在工作流中加入僅限 JSON 的 LLM 步驟時
  - 您需要為自動化流程獲取經 Schema 驗證的 LLM 輸出時
title: "LLM Task"
---

> 此文件為 [English Version](/tools/llm-task_zh_TW) 的繁體中文版本。

# LLM Task

`llm-task` 是一個 **選用的外掛程式工具**，用於執行「僅限 JSON (JSON-only)」的 LLM 任務，並回傳結構化輸出（可選用 JSON Schema 進行驗證）。

這對於像 Lobster 這樣的工作流引擎非常理想：您可以在不為每個工作流撰寫自訂 OpenClaw 程式碼的情況下，新增一個 LLM 步驟。

## 啟用外掛程式

1. **啟用外掛程式**：
```json
{
  "plugins": {
    "entries": {
      "llm-task": { "enabled": true }
    }
  }
}
```

2. **將工具加入允許清單**（該工具註冊時標記為 `optional: true`）：
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

## 工具參數

- `prompt` (字串，必填)：LLM 任務提示。
- `input` (選填)：輸入數據。
- `schema` (物件，選填的 JSON Schema)：驗證規則。
- `model` (選填)：指定特定模型。

## 輸出結果

回傳包含已解析 JSON 內容的 `details.json`（若提供 `schema` 則會進行驗證）。

## 範例：Lobster 工作流步驟

```lobster
openclaw.invoke --tool llm-task --action json --args-json '{
  "prompt": "根據輸入的郵件，回傳意圖與草稿。",
  "input": {
    "subject": "哈囉",
    "body": "你能幫忙嗎？"
  },
  "schema": {
    "type": "object",
    "properties": {
      "intent": { "type": "string" },
      "draft": { "type": "string" }
    },
    "required": ["intent", "draft"]
  }
}'
```

## 安全注意事項

- 該工具是 **僅限 JSON (JSON-only)**，並指示模型僅輸出 JSON（不含程式碼區塊或解說）。
- 在該回合中，模型無法存取任何工具。
- 在執行具備副作用的步驟（如傳送、發佈、執行）之前，請務必先執行核准步驟。
