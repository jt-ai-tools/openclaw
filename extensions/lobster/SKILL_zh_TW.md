# 龍蝦 (Lobster)

Lobster 執行帶有核准檢查點的多步驟工作流。適用於以下情境：

- 使用者需要可重複的自動化流程（分類、監控、同步）。
- 動作在執行前需要人工核准（傳送、發佈、刪除）。
- 多個工具呼叫應作為一個單一且確定性的操作執行。

## 何時使用 Lobster

| 使用者意圖                                             | 使用 Lobster?                                 |
| ------------------------------------------------------ | --------------------------------------------- |
| 「分類我的電子郵件」                                   | 是 — 多步驟，可能發送回覆                      |
| 「傳送一則訊息」                                       | 否 — 單一動作，直接使用訊息工具                |
| 「每天早上檢查我的郵件並在回覆前詢問我」               | 是 — 帶有核准機制的預約工作流                  |
| 「天氣如何？」                                         | 否 — 簡單查詢                                  |
| 「監控此 PR 並在變更時通知我」                         | 是 — 具備狀態、循環性                          |

## 基本用法

### 執行管線 (Pipeline)

```json
{
  "action": "run",
  "pipeline": "gog.gmail.search --query 'newer_than:1d' --max 20 | email.triage"
}
```

回傳結構化結果：

```json
{
  "protocolVersion": 1,
  "ok": true,
  "status": "ok",
  "output": [{ "summary": {...}, "items": [...] }],
  "requiresApproval": null
}
```

### 處理核准

如果工作流需要核准：

```json
{
  "status": "needs_approval",
  "output": [],
  "requiresApproval": {
    "prompt": "發送 3 份草稿回覆？",
    "items": [...],
    "resumeToken": "..."
  }
}
```

向使用者呈現提示詞。若使用者核准：

```json
{
  "action": "resume",
  "token": "<resumeToken>",
  "approve": true
}
```

## 工作流範例

### 電子郵件分類

```
gog.gmail.search --query 'newer_than:1d' --max 20 | email.triage
```

獲取最近的郵件，並將其分類至不同的儲存桶（需回覆、需處理、知會事項）。

### 具備核准門控的電子郵件分類

```
gog.gmail.search --query 'newer_than:1d' | email.triage | approve --prompt '處理這些郵件嗎？'
```

與上述相同，但在回傳前會停止以等待核准。

## 核心行為

- **確定性 (Deterministic)**：相同輸入 → 相同輸出（管線執行中不具 LLM 變異性）。
- **核准門控 (Approval gates)**：`approve` 指令會暫停執行，並回傳權杖 (Token)。
- **可恢復執行 (Resumable)**：使用帶有權杖的 `resume` 動作來繼續。
- **結構化輸出**：一律回傳帶有 `protocolVersion` 的 JSON 信封。

## 不適合使用 Lobster 的情境

- 簡單的單一動作請求（直接使用工具即可）。
- 在流程中需要 LLM 進行即時解釋的查詢。
- 不會重複執行的單次任務。
