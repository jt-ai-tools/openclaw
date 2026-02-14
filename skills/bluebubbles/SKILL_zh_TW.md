---
name: bluebubbles
description: 當需要透過 BlueBubbles（建議的 iMessage 整合方案）傳送或管理 iMessage 時使用。呼叫會透過 channel="bluebubbles" 的通用 message 工具進行。
metadata: { "openclaw": { "emoji": "🫧", "requires": { "config": ["channels.bluebubbles"] } } }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# BlueBubbles 動作指令

## 概觀

BlueBubbles 是 OpenClaw 建議的 iMessage 整合方案。使用 `message` 工具並指定 `channel: "bluebubbles"` 來傳送訊息與管理 iMessage 對話：支援傳送文字與附件、回應表情 (Tapbacks)、編輯/收回訊息、串文回覆以及管理群組成員/名稱/圖示。

## 需要收集的輸入

- `target`：目標（優先使用 `chat_guid:...`；亦可使用 E.164 格式的 `+15551234567` 或電子信箱）。
- `message`：傳送/編輯/回覆的內文。
- `messageId`：回應表情/編輯/收回/回覆所需的訊息識別碼。
- 附件 `path`：本地檔案路徑。

若使用者意圖模糊（例如：「傳簡訊給我媽」），請詢問收件者識別碼或聊天 ID (Guid) 以及精確的訊息內容。

## 動作 (Actions)

### 傳送訊息 (Send)

```json
{
  "action": "send",
  "channel": "bluebubbles",
  "target": "+15551234567",
  "message": "來自 OpenClaw 的問候"
}
```

### 回應表情 (React / Tapback)

```json
{
  "action": "react",
  "channel": "bluebubbles",
  "target": "+15551234567",
  "messageId": "<message-guid>",
  "emoji": "❤️"
}
```

### 編輯已傳送訊息 (Edit)

```json
{
  "action": "edit",
  "channel": "bluebubbles",
  "target": "+15551234567",
  "messageId": "<message-guid>",
  "message": "更新後的文字"
}
```

### 收回訊息 (Unsend)

```json
{
  "action": "unsend",
  "channel": "bluebubbles",
  "target": "+15551234567",
  "messageId": "<message-guid>"
}
```

### 傳送附件 (Send Attachment)

```json
{
  "action": "sendAttachment",
  "channel": "bluebubbles",
  "target": "+15551234567",
  "path": "/tmp/photo.jpg",
  "caption": "給您的檔案"
}
```

## 注意事項

- 需要閘道器組態中已設定 `channels.bluebubbles`（包含 serverUrl/password/webhookPath）。
- 如果已知 `chat_guid`，請優先使用（特別是群組對話）。
- 部分動作（如編輯）可能受限於 macOS 版本。
- 底層外掛程式的開發者參考文件位於 `extensions/bluebubbles/README.md`。
