---
name: session-logs
description: 使用 jq 搜尋並分析您自己的工作階段紀錄（舊有的或父級對談）。
metadata: { "openclaw": { "emoji": "📜", "requires": { "bins": ["jq", "rg"] } } }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# 對談紀錄 (session-logs)

搜尋儲存在工作階段 JSONL 檔案中的完整對談歷史。當使用者參考舊有的/父級對談，或詢問之前說過什麼話時使用。

## 觸發時機

當使用者詢問先前的聊天內容、父級對談，或不在記憶檔案中的歷史上下文時，請使用此技能。

## 檔案位置

工作階段紀錄位於：`~/.openclaw/agents/<agentId>/sessions/`（使用系統提示詞 Runtime 行中的 `agent=<id>` 數值）。

- **`sessions.json`**：將工作階段金鑰 (Session keys) 映射至工作階段 ID 的索引檔案。
- **`<session-id>.jsonl`**：每個工作階段的完整對談逐字稿。

## 檔案結構

每個 `.jsonl` 檔案包含多條具備以下欄位的訊息：

- `type`："session" (詮釋資料) 或 "message" (訊息)。
- `timestamp`：ISO 時間戳記。
- `message.role`："user" (使用者), "assistant" (助理), 或 "toolResult" (工具結果)。
- `message.content[]`：包含文字、推理或工具呼載（過濾 `type=="text"` 可獲取人類可讀內容）。
- `message.usage.cost.total`：每次回應的成本。

## 常見查詢範例

### 依日期與大小列出所有工作階段

```bash
for f in ~/.openclaw/agents/<agentId>/sessions/*.jsonl; do
  date=$(head -1 "$f" | jq -r '.timestamp' | cut -dT -f1)
  size=$(ls -lh "$f" | awk '{print $5}')
  echo "$date $size $(basename $f)"
done | sort -r
```

### 尋找特定日期的工作階段

```bash
for f in ~/.openclaw/agents/<agentId>/sessions/*.jsonl; do
  head -1 "$f" | jq -r '.timestamp' | grep -q "2026-01-06" && echo "$f"
done
```

### 從工作階段中擷取使用者訊息

```bash
jq -r 'select(.message.role == "user") | .message.content[]? | select(.type == "text") | .text' <工作階段ID>.jsonl
```

### 搜尋助理回應中的關鍵字

```bash
jq -r 'select(.message.role == "assistant") | .message.content[]? | select(.type == "text") | .text' <工作階段ID>.jsonl | rg -i "關鍵字"
```

### 獲取單一工作階段的總成本

```bash
jq -s '[.[] | .message.usage.cost.total // 0] | add' <工作階段ID>.jsonl
```

### 統計工作階段中的訊息數與 Token 數

```bash
jq -s '{
  messages: length,
  user: [.[] | select(.message.role == "user")] | length,
  assistant: [.[] | select(.message.role == "assistant")] | length,
  first: .[0].timestamp,
  last: .[-1].timestamp
}' <工作階段ID>.jsonl
```

### 跨所有工作階段搜尋特定詞彙

```bash
rg -l "詞彙" ~/.openclaw/agents/<agentId>/sessions/*.jsonl
```

## 小撇步

- 工作階段是僅限附加 (Append-only) 的 JSONL 檔案（每行一個 JSON 物件）。
- 大型工作階段可能達數 MB —— 請使用 `head`/`tail` 進行取樣查看。
- `sessions.json` 索引將聊天提供者（Discord, WhatsApp 等）映射至工作階段 ID。
- 已刪除的工作階段會帶有 `.deleted.<時間戳記>` 後綴。
