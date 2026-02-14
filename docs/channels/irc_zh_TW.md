---
title: IRC
description: 將 OpenClaw 連接至 IRC 頻道與私訊。
---

> 此文件為 [English Version](/channels/irc_zh_TW) 的繁體中文版本。

# IRC (外掛程式)

當您希望 OpenClaw 存在於傳統的 IRC 頻道（如 `#room`）與私訊中時使用。IRC 以擴充外掛程式的形式提供，但組態設定位於主組態的 `channels.irc` 下。

## 快速設定

1. 在 `~/.openclaw/openclaw.json` 中啟用 IRC 組態。
2. 設定必要欄位：
```json
{
  "channels": {
    "irc": {
      "enabled": true,
      "host": "irc.libera.chat",
      "port": 6697,
      "tls": true,
      "nick": "openclaw-bot",
      "channels": ["#openclaw"]
    }
  }
}
```
3. 啟動或重啟閘道器。

## 安全性預設值
- `dmPolicy`：預設為 `"pairing"`。
- `groupPolicy`：預設為 `"allowlist"`。
- 建議一律使用 TLS (`tls=true`)。

## 存取控制 (Access control)
IRC 頻道有兩層「門控」：
1. **頻道存取** (`groupPolicy` + `groups`)：決定機器人是否接受來自該頻道的訊息。
2. **傳送者存取** (`groupAllowFrom`)：決定頻道內誰可以觸發機器人。

**常見陷阱**：`allowFrom` 僅用於私訊 (DMs)，非頻道。若要在頻道中允許傳送者，請設定 `groupAllowFrom` 或針對特定頻道的 `groups["#channel"].allowFrom`。

## 回覆觸發 (提及門控)
即使頻道與傳送者皆獲允許，OpenClaw 在群組環境下預設仍會執行 **提及門控 (Mention-gating)**。
若要讓機器人回覆 **無需標記**，請針對該頻道設定 `requireMention: false`。

## 安全性建議（針對公開頻道）
如果您在公開頻道允許所有人 (`allowFrom: ["*"]`) 觸發機器人，強烈建議限制該頻道的工具權限，例如停用 `group:runtime` 或 `group:fs` 以降低風險。

## NickServ
支援連線後自動與 NickServ 進行身分驗證或一次性註冊。詳情請參閱組態參考。
