---
summary: "`openclaw message` (傳送與頻道動作) 的 CLI 參考資料"
read_when:
  - 新增或修改訊息 CLI 動作時
  - 更改傳出頻道行為時
title: "message"
---

> 此文件為 [English Version](/cli/message_zh_TW) 的繁體中文版本。

# `openclaw message`

用於傳送訊息與執行頻道動作的單一傳出指令（支援 Discord, Google Chat, Slack, Mattermost, Telegram, WhatsApp, Signal, iMessage, MS Teams）。

## 用法

```
openclaw message <子指令> [旗標]
```

**頻道選擇：**
- 若配置了多個頻道，則必須使用 `--channel`。
- 若僅配置一個頻道，該頻道將成為預設值。
- 數值：`whatsapp|telegram|discord|googlechat|slack|mattermost|signal|imessage|msteams`。

**目標格式 (`--target`)：**
- **WhatsApp**：E.164 號碼或群組 JID。
- **Telegram**：聊天 ID 或 `@使用者名稱`。
- **Discord**：`channel:<id>` 或 `user:<id>`。
- **Google Chat**：`spaces/<spaceId>` 或 `users/<userId>`。
- **Slack**：`channel:<id>` 或 `user:<id>`。
- **Mattermost**：`channel:<id>`, `user:<id>` 或 `@使用者名稱`。
- **Signal**：`+E.164`, `group:<id>` 或 `username:<name>`。
- **iMessage**：識別碼 (Handle), `chat_id:<id>`, `chat_guid:<guid>` 或 `chat_identifier:<id>`。
- **MS Teams**：對話 ID (`19:...@thread.tacv2`) 或 `user:<aad-物件-id>`。

## 常用旗標

- `--channel <名稱>`
- `--account <ID>`
- `--target <目標>`（目標頻道或使用者，用於傳送/投票/讀取等）
- `--targets <名稱>`（可重複；僅用於廣播）
- `--json`
- `--dry-run` (模擬執行)
- `--verbose` (詳細模式)

## 動作 (Actions)

### 核心動作
- **`send` (傳送)**：支援所有頻道。需提供 `--target` 以及 `--message` 或 `--media`。
- **`poll` (投票)**：支援 WhatsApp, Discord, MS Teams。需提供問題與選項。
- **`react` (回應表情)**：支援 Discord, Google Chat, Slack, Telegram, WhatsApp, Signal。
- **`read` (讀取)**：支援 Discord, Slack。
- **`edit` (編輯)**：支援 Discord, Slack。
- **`delete` (刪除)**：支援 Discord, Slack, Telegram。
- **`pin` / `unpin` (釘選/取消釘選)**：支援 Discord, Slack。
- **`permissions` (權限)**：僅限 Discord。
- **`search` (搜尋)**：僅限 Discord。

### 執行緒 (Threads)
- **`thread create`**：僅限 Discord。
- **`thread list`**：僅限 Discord。
- **`thread reply`**：僅限 Discord。

### 表情符號與貼圖 (Discord/Slack)
- **`emoji list`**
- **`emoji upload`**
- **`sticker send`**
- **`sticker upload`**

### 管理動作 (僅限 Discord)
- **`timeout`** (禁言), **`kick`** (踢出), **`ban`** (封鎖)。

### 廣播 (Broadcast)
- **`broadcast`**：針對多個目標或所有提供者發送訊息。

## 範例

**傳送 Discord 回覆：**
```bash
openclaw message send --channel discord 
  --target channel:123 --message "哈囉" --reply-to 456
```

**建立 Discord 投票：**
```bash
openclaw message poll --channel discord 
  --target channel:123 
  --poll-question "午餐吃什麼？" 
  --poll-option 披薩 --poll-option 壽司 
  --poll-multi --poll-duration-hours 48
```

**在 Slack 中回應表情：**
```bash
openclaw message react --channel slack 
  --target C123 --message-id 456 --emoji "✅"
```

**傳送 Telegram 內嵌按鈕：**
```bash
openclaw message send --channel telegram --target @mychat --message "請選擇：" 
  --buttons '[ [{"text":"是","callback_data":"cmd:yes"}], [{"text":"否","callback_data":"cmd:no"}] ]'
```
