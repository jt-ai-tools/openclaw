---
summary: "OpenClaw 在頻道、路由、媒體與使用者體驗方面的功能概觀"
read_when:
  - 您想了解 OpenClaw 支援的所有功能清單時
title: "功能特性"
---

> 此文件為 [English Version](/concepts/features_zh_TW) 的繁體中文版本。

## 功能亮點

<Columns>
  <Card title="通訊頻道" icon="message-square">
    透過單一閘道器支援 WhatsApp、Telegram、Discord 與 iMessage。
  </Card>
  <Card title="外掛程式" icon="plug">
    透過擴充套件加入 Mattermost 等更多平台。
  </Card>
  <Card title="路由機制" icon="route">
    具備隔離對談會話的多代理人路由功能。
  </Card>
  <Card title="媒體支援" icon="image">
    支援影像、音訊與文件的傳入與傳出。
  </Card>
  <Card title="App 與 UI" icon="monitor">
    提供網頁控制 UI 以及 macOS 配套應用程式。
  </Card>
  <Card title="行動端節點" icon="smartphone">
    支援具備 Canvas 功能的 iOS 與 Android 節點。
  </Card>
</Columns>

## 完整清單

- 透過 WhatsApp Web (Baileys) 整合 WhatsApp。
- 支援 Telegram 機器人 (grammY)。
- 支援 Discord 機器人 (channels.discord.js)。
- 支援 Mattermost 機器人 (外掛程式)。
- 透過本地 imsg CLI (macOS) 整合 iMessage。
- 支援 Pi 在 RPC 模式下的代理人橋接與工具串流。
- 針對長篇回覆提供串流 (Streaming) 與分塊 (Chunking) 功能。
- 提供多代理人路由，為每個工作區或傳送者建立隔離的對談會話。
- 透過 OAuth 提供 Anthropic 與 OpenAI 的訂閱版驗證。
- 對談會話管理：直接對話會歸併至共用的 `main`；群組則保持隔離。
- 支援群組聊天，並具備基於「提及 (Mention)」的觸發機制。
- 支援影像、音訊與文件的媒體功能。
- 選用的語音訊息逐字稿鉤子 (Transcription hook)。
- 提供 WebChat 與 macOS 選單列應用程式。
- 提供支援配對與 Canvas 介面的 iOS 節點。
- 提供支援配對、Canvas、聊天與相機功能的 Android 節點。

<Note>
舊版的 Claude, Codex, Gemini 與 Opencode 路徑已被移除。Pi 是目前唯一的編碼代理人路徑。
</Note>
