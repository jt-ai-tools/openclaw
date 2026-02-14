---
name: imsg
description: 用於列出聊天對話、歷史紀錄、監看與發送訊息的 iMessage/SMS CLI 工具。
homepage: https://imsg.to
metadata:
  {
    "openclaw":
      {
        "emoji": "📨",
        "os": ["darwin"],
        "requires": { "bins": ["imsg"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "steipete/tap/imsg",
              "bins": ["imsg"],
              "label": "安裝 imsg (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# imsg 動作指令

## 概觀

使用 `imsg` 指令在 macOS 上讀取與發送 Messages.app 的 iMessage/SMS 訊息。

**要求**：已登入 Messages.app、終端機具備「全域磁碟存取權」，且具備「自動化」權限以控制 Messages.app 進行發送。

## 需要收集的輸入

- 傳送訊息時的 **收件者識別碼**（電話/信箱）。
- 讀取歷史/監看時的 `chatId`（可從 `imsg chats --limit 10 --json` 獲取）。
- 訊息內文 `text` 與選用的附件路徑 `file`。

## 動作 (Actions)

### 列出對話 (List chats)

```bash
imsg chats --limit 10 --json
```

### 獲取聊天歷史 (Fetch chat history)

```bash
imsg history --chat-id 1 --limit 20 --attachments --json
```

### 監看對話 (Watch a chat)

```bash
imsg watch --chat-id 1 --attachments
```

### 發送訊息 (Send a message)

```bash
imsg send --to "+14155551212" --text "您好" --file /路徑/圖片.jpg
```

## 注意事項

- `--service imessage|sms|auto` 用於控制發送服務。
- 在發送前，請務必先與使用者確認收件者與訊息內文。
