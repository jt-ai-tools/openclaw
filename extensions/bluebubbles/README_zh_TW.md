# BlueBubbles 擴充功能 (開發者參考)

本目錄包含 OpenClaw 的 **BlueBubbles 外部頻道外掛程式**。

如果您是在尋找 **如何以代理人/工具使用者身分使用 BlueBubbles**，請參閱：

- `skills/bluebubbles/SKILL.md`

## 目錄配置 (Layout)

- 擴充功能套件：`extensions/bluebubbles/`（入口點：`index.ts`）。
- 頻道實作：`extensions/bluebubbles/src/channel.ts`。
- Webhook 處理：`extensions/bluebubbles/src/monitor.ts`（透過 `api.registerHttpHandler` 註冊）。
- REST 輔助程式：`extensions/bluebubbles/src/send.ts` + `extensions/bluebubbles/src/probe.ts`。
- 執行時期橋接：`extensions/bluebubbles/src/runtime.ts`（透過 `api.runtime` 設定）。
- 引導設定型錄項目：`src/channels/plugins/catalog.ts`。

## 內部輔助程式 (請使用這些，而非原始 API 呼叫)

- `extensions/bluebubbles/src/probe.ts` 中的 `probeBlueBubbles`：用於健康檢查。
- `extensions/bluebubbles/src/send.ts` 中的 `sendMessageBlueBubbles`：用於文字傳送。
- `extensions/bluebubbles/src/send.ts` 中的 `resolveChatGuidForTarget`：用於聊天對象查找。
- `extensions/bluebubbles/src/reactions.ts` 中的 `sendBlueBubblesReaction`：用於發送 Tapbacks (回應表情)。
- `extensions/bluebubbles/src/chat.ts` 中的 `sendBlueBubblesTyping` + `markBlueBubblesChatRead`。
- `extensions/bluebubbles/src/attachments.ts` 中的 `downloadBlueBubblesAttachment`：用於傳入媒體。
- `extensions/bluebubbles/src/types.ts` 中的 `buildBlueBubblesApiUrl` + `blueBubblesFetchWithTimeout`：用於共享的 REST 基礎設施。

## Webhooks

- BlueBubbles 會將 JSON 傳送至閘道器 (Gateway) 的 HTTP 伺服器。
- 防禦性地規範化 (Normalize) 傳送者/聊天 ID（酬載內容因版本而異）。
- 跳過標記為來自自身的訊息。
- 透過外掛程式執行時期 (`api.runtime`) 與 `openclaw/plugin-sdk` 輔助程式將訊息路由至核心回應管線。
- 對於附件/貼圖，當文字為空時請使用 `<media:...>` 佔位符，並透過傳入上下文中的 `MediaUrl(s)` 附加媒體路徑。

## 核心組態 (Config)

- `channels.bluebubbles.serverUrl` (基礎 URL), `channels.bluebubbles.password`, `channels.bluebubbles.webhookPath`。
- 動作門控 (Action gating)：`channels.bluebubbles.actions.reactions`（預設為 true）。

## 訊息工具注意事項

- **回應 (Reactions)：** `react` 動作除了 `messageId` 外，還需要 `target`（電話號碼或聊天識別碼）。
  範例：
  `action=react target=+15551234567 messageId=ABC123 emoji=❤️`
