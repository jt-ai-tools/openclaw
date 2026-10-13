---
name: slack
description: 當您需要透過 slack 工具從 OpenClaw 控制 Slack 時使用，包含在 Slack 頻道或私訊中回應訊息、釘選或取消釘選項目。
metadata: { "openclaw": { "emoji": "💬", "requires": { "config": ["channels.slack"] } } }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# Slack 動作 (Slack Actions)

## 概觀

使用 `slack` 進行回應、管理釘選、傳送/編輯/刪除訊息以及獲取成員資訊。此工具使用為 OpenClaw 配置的機器人權杖 (Bot Token)。

## 需要收集的輸入

- `channelId` 與 `messageId`（Slack 訊息時間戳記，例如 `1712023032.1234`）。
- **回應 (Reactions)**：需要一個 `emoji`（Unicode 或 `:名稱:`）。
- **傳送訊息**：目標 `to` (`channel:<id>` 或 `user:<id>`) 以及 `content` 內容。

訊息上下文包含 `slack message id` 與 `channel` 欄位，您可以直接重複使用。

## 動作 (Actions)

### 動作群組

| 動作群組     | 預設值 | 備註                   |
| ------------ | ------ | ---------------------- |
| reactions    | 啟用   | 回應 + 列出回應         |
| messages     | 啟用   | 讀取/傳送/編輯/刪除     |
| pins         | 啟用   | 釘選/取消釘選/列出      |
| memberInfo   | 啟用   | 成員資訊               |
| emojiList    | 啟用   | 自訂表情符號清單       |

### 回應訊息 (React)

```json
{
  "action": "react",
  "channelId": "C123",
  "messageId": "1712023032.1234",
  "emoji": "✅"
}
```

### 列出回應 (Reactions)

```json
{
  "action": "reactions",
  "channelId": "C123",
  "messageId": "1712023032.1234"
}
```

### 傳送訊息 (sendMessage)

```json
{
  "action": "sendMessage",
  "to": "channel:C123",
  "content": "來自 OpenClaw 的問候"
}
```

### 編輯訊息 (editMessage)

```json
{
  "action": "editMessage",
  "channelId": "C123",
  "messageId": "1712023032.1234",
  "content": "更新內容"
}
```

### 讀取最近訊息 (readMessages)

```json
{
  "action": "readMessages",
  "channelId": "C123",
  "limit": 20
}
```

### 釘選訊息 (pinMessage)

```json
{
  "action": "pinMessage",
  "channelId": "C123",
  "messageId": "1712023032.1234"
}
```

### 列出釘選項目 (listPins)

```json
{
  "action": "listPins",
  "channelId": "C123"
}
```

### 成員資訊 (memberInfo)

```json
{
  "action": "memberInfo",
  "userId": "U123"
}
```

## 可以嘗試的點子

- 使用 ✅ 回應來標記已完成的任務。
- 釘選關鍵決定或每週狀態更新。
