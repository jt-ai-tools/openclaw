---
summary: "各頻道的路由規則（WhatsApp, Telegram, Discord, Slack）與共用上下文說明"
read_when:
  - 更改頻道路由或收件匣行為時
title: "頻道路由"
---

> 此文件為 [English Version](/channels/channel-routing_zh_TW) 的繁體中文版本。

# 頻道與路由 (Channels & routing)

OpenClaw 會將回覆 **路由回訊息來源的頻道**。模型本身不會選擇頻道；路由是確定性的，由主機組態控制。

## 關鍵術語

- **頻道 (Channel)**：例如 `whatsapp`, `telegram`, `discord`, `slack` 等。
- **代理人 ID (AgentId)**：一個隔離的工作區與工作階段存儲（大腦）。
- **工作階段金鑰 (SessionKey)**：用於儲存上下文與控制並行執行的桶子金鑰。

## 工作階段金鑰格式 (Session key shapes)

**私訊 (DMs)** 會合併至代理人的 **主 (main)** 工作階段：
- `agent:<agentId>:main` (預設：`agent:main:main`)

**群組與頻道** 則按頻道隔離：
- 群組：`agent:<agentId>:<channel>:group:<id>`
- 頻道/聊天室：`agent:<agentId>:<channel>:channel:<id>`

**執行緒 (Threads)**：
- Slack/Discord 執行緒會在基礎金鑰後加上 `:thread:<threadId>`。
- Telegram 論壇主題則會在群組金鑰中嵌入 `:topic:<topicId>`。

## 路由規則 (如何選擇代理人)

針對每則傳入訊息，路由會依序挑選 **一個代理人**：

1. **精確同儕匹配 (Exact peer match)**：透過 `bindings` 中的 `peer.kind` + `peer.id`。
2. **伺服器匹配 (Guild match)**：Discord 專屬，透過 `guildId`。
3. **團隊匹配 (Team match)**：Slack 專屬，透過 `teamId`。
4. **帳號匹配 (Account match)**：針對頻道上的特定 `accountId`。
5. **頻道匹配 (Channel match)**：該頻道的任何帳號。
6. **預設代理人**：`agents.list[].default`，或列表第一項，最後回退至 `main`。

匹配到的代理人決定了將使用哪一個工作區與工作階段存儲。

## 廣播群組 (執行多個代理人)

廣播群組讓您在 OpenClaw 正常回覆時，針對同一個對象執行 **多個代理人**。詳情請參閱 [廣播群組](/channels/broadcast-groups_zh_TW)。

## 工作階段儲存

工作階段存儲位於狀態目錄下（預設 `~/.openclaw`）：
`~/.openclaw/agents/<agentId>/sessions/sessions.json`

## WebChat 行為

WebChat 會附加至 **選定的代理人** 並預設使用其主工作階段。因此，WebChat 讓您可以在一個地方查看該代理人的跨頻道上下文。
