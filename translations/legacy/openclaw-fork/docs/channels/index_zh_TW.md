---
summary: "OpenClaw 可連線的通訊平台清單"
read_when:
  - 您想為 OpenClaw 選擇通訊頻道時
  - 您需要了解所支援通訊平台的簡要概觀時
title: "通訊頻道"
---

> 此文件為 [English Version](/channels/index_zh_TW) 的繁體中文版本。

# 通訊頻道 (Chat Channels)

OpenClaw 可以透過您已在使用的任何聊天 App 與您交談。每個頻道皆透過閘道器 (Gateway) 連線。純文字訊息在所有平台皆受支援；媒體檔案與心情回應的支援程度則因頻道而異。

## 支援的頻道

- [WhatsApp](/channels/whatsapp_zh_TW) — 最受歡迎；使用 Baileys 並需要 QR Code 配對。
- [Telegram](/channels/telegram_zh_TW) — 透過 grammY 使用 Bot API；支援群組。
- [Discord](/channels/discord_zh_TW) — Discord Bot API + 閘道器；支援伺服器、頻道與私訊。
- [IRC](/channels/irc_zh_TW) — 傳統 IRC 伺服器；包含支援配對/允許清單控管的頻道與私訊。
- [Slack](/channels/slack_zh_TW) — 使用 Bolt SDK；工作區應用程式。
- [飛書 (Feishu)](/channels/feishu_zh_TW) — 透過 WebSocket 使用飛書/Lark 機器人（外掛程式，需另行安裝）。
- [Google Chat](/channels/googlechat_zh_TW) — 透過 HTTP Webhook 使用 Google Chat API 應用程式。
- [Mattermost](/channels/mattermost_zh_TW) — Bot API + WebSocket；支援頻道、群組與私訊（外掛程式，需另行安裝）。
- [Signal](/channels/signal_zh_TW) — 使用 signal-cli；注重隱私。
- [BlueBubbles](/channels/bluebubbles_zh_TW) — **iMessage 的建議方案**；使用 BlueBubbles macOS 伺服器 REST API，支援完整功能（編輯、收回訊息、效果、心情回應、群組管理 —— 編輯功能目前在 macOS 26 Tahoe 上異常）。
- [iMessage (舊版)](/channels/imessage_zh_TW) — 透過 imsg CLI 提供的舊版 macOS 整合（已棄用，新設定請改用 BlueBubbles）。
- [Microsoft Teams](/channels/msteams_zh_TW) — 使用 Bot Framework；企業級支援（外掛程式，需另行安裝）。
- [LINE](/channels/line_zh_TW) — LINE Messaging API 機器人（外掛程式，需另行安裝）。
- [Nextcloud Talk](/channels/nextcloud-talk_zh_TW) — 透過 Nextcloud Talk 提供的自代管聊天功能（外掛程式，需另行安裝）。
- [Matrix](/channels/matrix_zh_TW) — Matrix 協定（外掛程式，需另行安裝）。
- [Nostr](/channels/nostr_zh_TW) — 透過 NIP-04 提供的去中心化私訊（外掛程式，需另行安裝）。
- [Tlon](/channels/tlon_zh_TW) — 基於 Urbit 的通訊軟體（外掛程式，需另行安裝）。
- [Twitch](/channels/twitch_zh_TW) — 透過 IRC 連線使用的 Twitch 聊天（外掛程式，需另行安裝）。
- [Zalo](/channels/zalo_zh_TW) — Zalo Bot API；越南受歡迎的通訊軟體（外掛程式，需另行安裝）。
- [Zalo Personal](/channels/zalouser_zh_TW) — 透過 QR Code 登入使用的 Zalo 個人帳號（外掛程式，需另行安裝）。
- [WebChat](/web/webchat_zh_TW) — 透過 WebSocket 提供的閘道器 WebChat UI。

## 注意事項

- 各頻道可同時執行；設定多個頻道後，OpenClaw 會根據對話進行路由。
- 最快完成設定的通常是 **Telegram**（僅需簡單的機器人 Token）。WhatsApp 則需要進行 QR Code 配對，並在磁碟上儲存較多狀態資訊。
- 群組行為因頻道而異；請參閱 [群組](/channels/groups_zh_TW)。
- 為確保安全，系統會強制執行私訊配對與允許清單；請參閱 [安全性](/gateway/security_zh_TW)。
- Telegram 內部機制：[grammY 註記](/channels/grammy_zh_TW)。
- 故障排除：[頻道故障排除](/channels/troubleshooting_zh_TW)。
- 模型提供者文件的說明是獨立的；請參閱 [模型提供者](/providers/models_zh_TW)。
