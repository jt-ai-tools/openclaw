---
summary: "WhatsApp 群組訊息處理的行為與組態（mentionPatterns 為跨平台共用）說明"
read_when:
  - 更改群組訊息規則或提及模式時
title: "群組訊息"
---

> 此文件為 [English Version](/channels/group-messages_zh_TW) 的繁體中文版本。

# 群組訊息 (Group messages - WhatsApp)

目標：讓 OpenClaw 存在於 WhatsApp 群組中，僅在被標記 (Ping) 時喚醒，並保持該執行緒與個人私訊 (DM) 工作階段隔離。

**注意**：`agents.list[].groupChat.mentionPatterns` 目前也被 Telegram/Discord/Slack/iMessage 使用。

## 功能特色

- **啟動模式 (Activation modes)**：支援 `mention` (預設，需標記) 與 `always` (一律回應)。
  - `mention` 需要透過 WhatsApp 原生的 @-mentions、正則表達式或機器人的門號觸發。
  - `always` 會讓代理人針對每則訊息喚醒，但代理人應僅在能提供價值時才回覆，否則回傳 `NO_REPLY` 保持沈默。
- **群組原則 (Group policy)**：控制是否接受群組訊息 (`open|disabled|allowlist`)。預設為 `allowlist`。
- **獨立工作階段**：群組工作階段金鑰格式為 `agent:<agentId>:whatsapp:group:<jid>`。斜線指令（如 `/verbose`）僅作用於該群組，不影響個人私訊狀態。
- **上下文注入**：未觸發執行的待處理訊息會被彙整在 `[Chat messages since your last reply - for context]` 區段下，作為背景資訊提供給模型。
- **顯示傳送者**：每則群組訊息末尾會加上 `[from: 傳送者名稱 (+門號)]`，讓代理人知道是誰在說話。

## 組態範例 (WhatsApp)

在 `~/.openclaw/openclaw.json` 中新增 `groupChat` 區段，即使 WhatsApp 在文字正文中剝離了 `@` 符號，顯示名稱的標記仍能運作：

```json5
{
  channels: {
    whatsapp: {
      groups: {
        "*": { requireMention: true },
      },
    },
  },
  agents: {
    list: [
      {
        id: "main",
        groupChat: {
          historyLimit: 50,
          mentionPatterns: ["@?openclaw", "\+?15555550123"],
        },
      },
    ],
  },
}
```

## 啟動指令 (限擁有者)

在群組中使用以下指令調整模式：
- `/activation mention`
- `/activation always`

只有配置的擁有者門號可以更改此設定。發送 `/status` 可查看目前的啟動模式。

## 注意事項
- **心跳 (Heartbeats)**：群組對話預設跳過心跳偵測，以避免吵雜的廣播。
- **回音抑制**：若發送兩則完全相同且未標記的訊息，系統僅會針對第一則進行處理。
- **輸入中指示**：群組中的輸入中狀態遵循 `agents.defaults.typingMode` 設定。
