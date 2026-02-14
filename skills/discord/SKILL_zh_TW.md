---
name: discord
description: 當您需要透過 discord 工具從 OpenClaw 控制 Discord 時使用：傳送訊息、回應表情、發佈或上傳貼圖、上傳表情符號、發起投票、管理執行緒/釘選/搜尋、建立/編輯/刪除頻道與類別、獲取權限或成員/身分組/頻道資訊、設定機器人狀態/活動，或在 Discord 私訊或頻道中處理管理動作。
metadata: {"openclaw":{"emoji":"🎮","requires":{"config":["channels.discord"]}}}
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# Discord 動作 (Discord Actions)

## 概觀

使用 `discord` 來管理訊息、回應、執行緒、投票與管理動作。您可以透過 `discord.actions.*` 停用特定功能群組（預設為啟用，身分組與管理動作除外）。此工具使用為 OpenClaw 配置的機器人權杖 (Bot Token)。

## 需要收集的輸入

- **回應 (Reactions)**：需要 `channelId`, `messageId` 以及一個 `emoji`。
- **獲取訊息 (fetchMessage)**：需要 `guildId`, `channelId`, `messageId` 或訊息連結 `messageLink`（例如 `https://discord.com/channels/<guildId>/<channelId>/<messageId>`）。
- **貼圖/投票/傳送訊息**：目標 `to` (`channel:<id>` 或 `user:<id>`)。選填的 `content` 文字。
- **投票 (Polls)**：需要一個 `question` 以及 2–10 個 `answers`。
- **媒體 (Media)**：`mediaUrl` 使用 `file:///路徑` 讀取本地檔案，或使用 `https://...` 讀取遠端檔案。
- **上傳表情符號**：`guildId`, `name`, `mediaUrl`，選填 `roleIds`（限制 256KB, PNG/JPG/GIF）。
- **上傳貼圖**：`guildId`, `name`, `description`, `tags`, `mediaUrl`（限制 512KB, PNG/APNG/Lottie JSON）。

訊息上下文包含 `discord message id` 與 `channel` 欄位，您可以直接重複使用。

**注意：** `sendMessage` 使用 `to: "channel:<id>"` 格式，而非 `channelId`。其它動作如 `react`, `readMessages`, `editMessage` 則直接使用 `channelId`。
**注意：** `fetchMessage` 接受訊息 ID 或完整連結。

## 動作 (Actions)

### 回應訊息 (React)

```json
{
  "action": "react",
  "channelId": "123",
  "messageId": "456",
  "emoji": "✅"
}
```

### 列出回應與使用者 (Reactions)

```json
{
  "action": "reactions",
  "channelId": "123",
  "messageId": "456",
  "limit": 100
}
```

### 傳送貼圖 (Sticker)

```json
{
  "action": "sticker",
  "to": "channel:123",
  "stickerIds": ["9876543210"],
  "content": "做得好！"
}
```

- 每一則訊息最多支援 3 個貼圖 ID。
- 私訊時 `to` 可使用 `user:<id>`。

### 上傳自訂表情符號 (Emoji Upload)

```json
{
  "action": "emojiUpload",
  "guildId": "999",
  "name": "party_blob",
  "mediaUrl": "file:///tmp/party.png",
  "roleIds": ["222"]
}
```

- 表情符號圖片必須為 PNG/JPG/GIF 且小於等於 256KB。
- `roleIds` 為選填；省略則所有人皆可使用。

### 上傳貼圖 (Sticker Upload)

```json
{
  "action": "stickerUpload",
  "guildId": "999",
  "name": "openclaw_wave",
  "description": "OpenClaw 揮手打招呼",
  "tags": "👋",
  "mediaUrl": "file:///tmp/wave.png"
}
```

- 貼圖需要 `name`, `description` 與 `tags`。
- 上傳格式必須為 PNG/APNG/Lottie JSON 且小於等於 512KB。

### 建立投票 (Poll)

```json
{
  "action": "poll",
  "to": "channel:123",
  "question": "午餐吃什麼？",
  "answers": ["披薩", "壽司", "沙拉"],
  "allowMultiselect": false,
  "durationHours": 24,
  "content": "現在開始投票"
}
```

- `durationHours` 預設為 24；最高 32 天 (768 小時)。

### 檢查頻道的機器人權限

```json
{
  "action": "permissions",
  "channelId": "123"
}
```

## 可以嘗試的點子

- 使用 ✅/⚠️ 回應來標記狀態更新。
- 針對發佈決定或會議時間發起快速投票。
- 在部署成功後傳送慶祝貼圖。
- 為發佈時刻上傳新的表情符號或貼圖。
- 在團隊頻道執行每週「優先順序檢查」投票。
- 當使用者請求完成時，透過私訊傳送貼圖作為確認。

## 動作門控 (Action gating)

使用 `discord.actions.*` 來停用特定功能群組：

- `reactions`（回應 + 回應清單 + 表情符號清單）
- `stickers`, `polls`, `permissions`, `messages`, `threads`, `pins`, `search`
- `emojiUploads`, `stickerUploads`
- `memberInfo`, `roleInfo`, `channelInfo`, `voiceStatus`, `events`
- `roles`（身分組新增/移除，預設為 `false`）
- `channels`（頻道/類別建立/編輯/刪除/移動，預設為 `false`）
- `moderation`（停權/踢出/封鎖，預設為 `false`）
- `presence`（機器人狀態/活動，預設為 `false`）

### 讀取最近訊息

```json
{
  "action": "readMessages",
  "channelId": "123",
  "limit": 20
}
```

### 傳送/編輯/刪除訊息

```json
{
  "action": "sendMessage",
  "to": "channel:123",
  "content": "來自 OpenClaw 的問候"
}
```

- `to` 使用 `channel:<id>` 格式，私訊則使用 `user:<id>`（不是 `channelId`！）。
- `mediaUrl` 支援本地檔案與遠端 URL。
- 選填 `replyTo` 帶入訊息 ID 以回覆特定訊息。

### 執行緒 (Threads)

```json
{
  "action": "threadCreate",
  "channelId": "123",
  "name": "Bug 分類",
  "messageId": "456"
}
```

### 搜尋訊息

```json
{
  "action": "searchMessages",
  "guildId": "999",
  "content": "發佈說明",
  "channelIds": ["123", "456"],
  "limit": 10
}
```

### 頻道管理 (預設停用)

建立、編輯、刪除與移動頻道及類別。需透過 `discord.actions.channels: true` 啟用。

```json
{
  "action": "channelCreate",
  "guildId": "999",
  "name": "一般聊天",
  "type": 0,
  "parentId": "888",
  "topic": "一般討論"
}
```

- `type`：0 = 文字, 2 = 語音, 4 = 類別。

### 機器人狀態與活動 (預設停用)

設定機器人在線狀態與活動。需透過 `discord.actions.presence: true` 啟用。

**設定正在玩狀態：**

```json
{
  "action": "setPresence",
  "activityType": "playing",
  "activityName": "玩火"
}
```

側邊欄顯示結果：「正在玩 **玩火**」。

**設定自訂狀態（側邊欄顯示文字）：**

```json
{
  "action": "setPresence",
  "activityType": "custom",
  "activityState": "放鬆中"
}
```

- `status`: `online` (預設), `dnd` (請勿打擾), `idle` (閒置), `invisible` (隱身)。

## Discord 撰寫風格指南

**保持對話感！** Discord 是一個聊天平台，不是說明文件。

### 建議做法 (Do)

- 訊息簡短有力（理想為 1-3 句）。
- 頻繁快速的回覆 > 一大塊文字內容。
- 使用表情符號來表達語氣或強調 🦞。
- 適合使用全小寫的隨興風格。
- 將資訊拆解成易於消化的小塊。
- 配合對話的氛圍。

### 避免做法 (Don't)

- 不要使用 Markdown 表格（Discord 會渲染得很醜）。
- 隨興聊天不要使用 `## 標題`（使用 **粗體** 或全大寫來強調）。
- 避免多段落的文章。
- 不要過度解釋簡單的事情。
- 跳過「我很樂意幫忙！」之類的廢話。

### 有效的格式化

- **粗體** 用於強調。
- `code` 用於技術術語。
- 清單 用於多個項目。
- `> 引用` 用於參考。
- 使用 `<>` 包裹多個連結以抑制自動預覽。
