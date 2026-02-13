---
summary: "用於喚醒與隔離代理人執行的 Webhook 入站 (Ingress) 說明"
read_when:
  - 新增或變更 Webhook 端點時
  - 將外部系統串接至 OpenClaw 時
title: "Webhooks"
---

> 此文件為 [English Version](/automation/webhook) 的繁體中文版本。

# Webhooks

閘道器 (Gateway) 可公開一個簡單的 HTTP Webhook 端點，用於接收外部系統的觸發。

## 啟用方式

```json5
{
  hooks: {
    enabled: true,
    token: "共享秘密",
    path: "/hooks",
    // 選填：將明確的 `agentId` 路由限制在此允許清單內。
    // 省略或包含 "*" 則允許任何代理人。
    // 設定為 [] 則拒絕所有明確的 `agentId` 路由。
    allowedAgentIds: ["hooks", "main"],
  },
}
```

注意事項：

- 當 `hooks.enabled=true` 時，`hooks.token` 為必填項。
- `hooks.path` 預設為 `/hooks`。

## 驗證 (Auth)

每個請求都必須包含 Hook Token。建議使用標頭 (Header) 傳送：

- `Authorization: Bearer <token>` (建議方式)
- `x-openclaw-token: <token>`
- 不接受透過查詢字串 (Query-string) 傳送的 Token（`?token=...` 將傳回 `400`）。

## 端點 (Endpoints)

### `POST /hooks/wake` (喚醒)

負載 (Payload)：

```json
{ "text": "系統行文字", "mode": "now" }
```

- `text` **必填** (字串)：事件的描述（例如：「收到新郵件」）。
- `mode` 選填 (`now` | `next-heartbeat`)：決定是立即觸發心跳偵測（預設為 `now`）還是等待下一次的週期性檢查。

效果：

- 為 **主對談 (main)** 排入一條系統事件。
- 若 `mode=now`，則立即觸發心跳偵測。

### `POST /hooks/agent` (執行代理人)

負載 (Payload)：

```json
{
  "message": "執行此內容",
  "name": "電子郵件",
  "agentId": "hooks",
  "sessionKey": "hook:email:msg-123",
  "wakeMode": "now",
  "deliver": true,
  "channel": "last",
  "to": "+15551234567",
  "model": "openai/gpt-5.2-mini",
  "thinking": "low",
  "timeoutSeconds": 120
}
```

- `message` **必填** (字串)：交給代理人處理的提示詞或訊息。
- `name` 選填 (字串)：Hook 的易讀名稱（例如：「GitHub」），作為對談摘要的前綴。
- `agentId` 選填 (字串)：將此 Hook 路由至特定代理人。未知的 ID 會回退到預設代理人。設定後，Hook 將使用該代理人的工作區與組態執行。
- `sessionKey` 選填 (字串)：用於識別代理人會話的金鑰。除非 `hooks.allowRequestSessionKey=true`，否則預設會拒絕此欄位。
- `wakeMode` 選填 (`now` | `next-heartbeat`)：決定是立即觸發心跳偵測（預設為 `now`）還是等待下一次的週期性檢查。
- `deliver` 選填 (布林值)：若為 `true`，代理人的回應將被傳送至通訊頻道。預設為 `true`。僅包含心跳確認的回應會被自動跳過。
- `channel` 選填 (字串)：遞送訊息的頻道。可選：`last` (最後通訊頻道), `whatsapp`, `telegram`, `discord`, `slack`, `mattermost` (外掛), `signal`, `imessage`, `msteams`。預設為 `last`。
- `to` 選填 (字串)：頻道收件者識別碼（例如：WhatsApp/Signal 的電話號碼、Telegram 的聊天 ID、Discord/Slack/Mattermost 的頻道 ID、MS Teams 的對話 ID）。預設為主會話的最後一位收件者。
- `model` 選填 (字串)：模型覆寫（例如：`anthropic/claude-3-5-sonnet` 或別名）。若有權限限制，則必須在允許的模型清單中。
- `thinking` 選填 (字串)：思考等級覆寫（例如：`low`, `medium`, `high`）。
- `timeoutSeconds` 選填 (數字)：代理人執行回合的最大持續時間（秒）。

效果：

- 執行一個 **隔離的** 代理人回合（具備獨立的會話金鑰）。
- 一律會在 **主會話** 中發佈一段摘要。
- 若 `wakeMode=now`，則立即觸發心跳偵測。

## 對談金鑰政策 (破壞性變更)

`/hooks/agent` 負載中的 `sessionKey` 覆寫功能預設為停用。

- 建議方式：設定固定的 `hooks.defaultSessionKey` 並保持請求覆寫功能關閉。
- 選用方式：僅在需要時允許請求覆寫，並限制前綴。

建議組態：

```json5
{
  hooks: {
    enabled: true,
    token: "${OPENCLAW_HOOKS_TOKEN}",
    defaultSessionKey: "hook:ingress",
    allowRequestSessionKey: false,
    allowedSessionKeyPrefixes: ["hook:"],
  },
}
```

相容性組態（舊版行為）：

```json5
{
  hooks: {
    enabled: true,
    token: "${OPENCLAW_HOOKS_TOKEN}",
    allowRequestSessionKey: true,
    allowedSessionKeyPrefixes: ["hook:"], // 強烈建議設定
  },
}
```

### `POST /hooks/<名稱>` (映射模式)

自訂的 Hook 名稱透過 `hooks.mappings` 進行解析（請參閱組態設定）。映射功能可以將任意負載轉換為 `wake` (喚醒) 或 `agent` (代理人) 動作，並支援範本或程式碼轉換 (Code transforms)。

映射選項摘要：

- `hooks.presets: ["gmail"]` 啟用內建的 Gmail 映射。
- `hooks.mappings` 可讓您在組態中定義 `match` (匹配條件), `action` (動作) 以及範本。
- `hooks.transformsDir` + `transform.module` 用於載入 JS/TS 模組實作自訂邏輯。
- 使用 `match.source` 可維持單一的通用入口點（由負載驅動路由）。
- TS 轉換需要執行階段具備 TS 載入器（如 `bun` 或 `tsx`）或預編譯的 `.js` 檔案。
- 在映射中設定 `deliver: true` 加上 `channel`/`to` 可將回覆路由回聊天介面（`channel` 預設為 `last`，若無則回退至 WhatsApp）。
- `agentId` 將 Hook 路由至特定代理人；未知的 ID 會回退到預設代理人。
- `hooks.allowedAgentIds` 限制明確的 `agentId` 路由設定。省略（或包含 `*`）則允許任何代理人；設為 `[]` 則禁止所有明確路由。
- `hooks.defaultSessionKey` 設定未提供明確金鑰時，Hook 代理人執行的預設會話。
- `hooks.allowRequestSessionKey` 控制 `/hooks/agent` 負載是否可自行設定 `sessionKey`（預設為 `false`）。
- `hooks.allowedSessionKeyPrefixes` 可選用來限制來自請求負載與映射的 `sessionKey` 數值前綴。
- `allowUnsafeExternalContent: true` 針對該 Hook 停用外部內容安全封裝（**具危險性**；僅限受信任的內部來源）。
- `openclaw webhooks gmail setup` 指令會寫入 `hooks.gmail` 組態，以便執行 `openclaw webhooks gmail run`。關於完整的 Gmail 監控流程，請參閱 [Gmail Pub/Sub](/automation/gmail-pubsub_zh_TW)。

## 回應狀態碼

- `200`：用於 `/hooks/wake`。
- `222`：用於 `/hooks/agent` (非同步執行已啟動)。
- `401`：驗證失敗。
- `429`：來自同一用戶端的重複驗證失敗（請檢查 `Retry-After`）。
- `400`：無效的負載內容。
- `413`：負載內容過大。

## 範例

```bash
curl -X POST http://127.0.0.1:18789/hooks/wake 
  -H 'Authorization: Bearer SECRET' 
  -H 'Content-Type: application/json' 
  -d '{"text":"收到新郵件","mode":"now"}'
```

```bash
curl -X POST http://127.0.0.1:18789/hooks/agent 
  -H 'x-openclaw-token: SECRET' 
  -H 'Content-Type: application/json' 
  -d '{"message":"摘要收件匣","name":"電子郵件","wakeMode":"next-heartbeat"}'
```

### 使用不同的模型

在代理人負載（或映射）中加入 `model` 即可覆寫該次執行的模型：

```bash
curl -X POST http://127.0.0.1:18789/hooks/agent 
  -H 'x-openclaw-token: SECRET' 
  -H 'Content-Type: application/json' 
  -d '{"message":"摘要收件匣","name":"電子郵件","model":"openai/gpt-5.2-mini"}'
```

如果您強制執行了 `agents.defaults.models` 限制，請確保覆寫的模型包含在該清單中。

```bash
curl -X POST http://127.0.0.1:18789/hooks/gmail 
  -H 'Authorization: Bearer SECRET' 
  -H 'Content-Type: application/json' 
  -d '{"source":"gmail","messages":[{"from":"Ada","subject":"您好","snippet":"Hi"}]}'
```

## 安全性建議

- 應將 Webhook 端點置於 loopback、Tailnet 或受信任的反向代理之後。
- 使用專用的 Hook Token；請勿重用閘道器的驗證 Token。
- 系統會針對各用戶端位址限制重複驗證失敗的頻率，以減緩暴力破解 (Brute-force) 嘗試。
- 若您使用多代理人路由，請設定 `hooks.allowedAgentIds` 以限制明確的 `agentId` 選擇。
- 除非您需要由調用者指定會話，否則請保持 `hooks.allowRequestSessionKey=false`。
- 若啟用了請求 `sessionKey` 功能，請務必限制 `hooks.allowedSessionKeyPrefixes`（例如：`["hook:"]`）。
- 避免在 Webhook 日誌中包含敏感的原始負載數據。
- Hook 負載預設被視為不可信內容，並會被包裝在安全邊界中。若您必須為特定 Hook 停用此機制，請在該 Hook 的映射中設定 `allowUnsafeExternalContent: true`（**請注意安全性風險**）。
