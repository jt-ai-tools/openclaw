---
title: 龍蝦 (Lobster)
summary: "OpenClaw 的具備類型之工作流執行環境，支援可恢復執行的核准門控。"
description: OpenClaw 的具備類型之工作流執行環境 —— 具備核准門控的可組合管線。
read_when:
  - 您想要執行具備明確核准機制的確定性多步驟工作流時
  - 您需要恢復執行工作流，而不想重複執行先前步驟時
---

> 此文件為 [English Version](/tools/lobster_zh_TW) 的繁體中文版本。

# 龍蝦 (Lobster)

Lobster 是一個工作流 Shell，讓 OpenClaw 能將多步驟的工具序列作為單一、確定性的操作執行，並具備明確的核准檢查點。

## 為什麼要用 Lobster

目前複雜的工作流需要多次往返的工具呼叫。每次呼叫都會消耗 Token，且 LLM 必須編排每一個步驟。Lobster 將這種編排轉移至具備型別的執行環境中：

- **單次呼叫取代多次呼叫**：OpenClaw 執行一個 Lobster 工具呼叫即可獲得結構化結果。
- **內建核准機制**：具備副作用的動作（如傳送郵件、發表評論）會暫停工作流，直到獲得明確核准。
- **可恢復執行**：暫停的工作流會回傳權杖 (Token)；核准後即可恢復執行，無需從頭開始。

## 工作原理

OpenClaw 以 **工具模式** 啟動本地的 `lobster` CLI，並從標準輸出 (stdout) 解析 JSON 信封。如果管線暫停等待核准，工具會回傳一個 `resumeToken` 以供稍後繼續執行。

### 模式：小型 CLI + JSON 管線 + 核准

建立輸出 JSON 的微型指令，然後將它們串接成單一的 Lobster 呼叫。

```json
{
  "action": "run",
  "pipeline": "inbox list --json | inbox categorize --json | inbox apply --json | approve --prompt '套用變更嗎？'",
  "timeoutMs": 30000
}
```

AI 觸發工作流；Lobster 執行步驟。核准門控使副作用變得明確且可稽核。

## 僅限 JSON 的 LLM 步驟 (llm-task)

對於需要 **結構化 LLM 步驟** 的工作流，請啟用選用的 `llm-task` 外掛程式工具並從 Lobster 中呼叫。這能保持工作流的確定性，同時仍能利用模型進行分類、摘要或起草。

詳情請參閱 [LLM Task](/tools/llm-task_zh_TW)。

## 工作流檔案 (.lobster)

Lobster 可以執行 YAML/JSON 格式的工作流檔案，其中包含 `name`, `args`, `steps`, `condition` 與 `approval` 等欄位。

```yaml
name: inbox-triage
steps:
  - id: collect
    command: inbox list --json
  - id: approve
    command: inbox apply --approve
    stdin: $collect.stdout
    approval: required
  - id: execute
    command: inbox apply --execute
    condition: $approve.approved
```

## 啟用工具

Lobster 是一個 **選用** 的外掛程式工具（預設為停用）。建議在代理人設定中啟用：

```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "tools": { "alsoAllow": ["lobster"] }
      }
    ]
  }
}
```

## 核准機制

若回傳結果中存在 `requiresApproval`，請檢查提示內容並決定：
- `approve: true` → 恢復執行並繼續產生副作用。
- `approve: false` → 取消並結束工作流。

## 安全性

- **僅限本地子程序**：外掛程式本身不進行網路呼叫。
- **無秘密資訊**：Lobster 不管理 OAuth；它呼叫具備驗證能力的 OpenClaw 工具。
- **沙箱感知**：當工具上下文處於沙箱化時會自動停用。
- **強化防護**：強制執行逾時機制與輸出大小限制。
