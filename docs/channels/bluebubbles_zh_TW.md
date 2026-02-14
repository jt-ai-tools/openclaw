---
summary: "透過 BlueBubbles macOS 伺服器整合 iMessage（REST 傳送/接收、輸入中指示、表情回應、配對與進階動作）說明"
read_when:
  - 設定 BlueBubbles 頻道時
  - 偵錯 Webhook 配對問題時
  - 在 macOS 上配置 iMessage 時
title: "BlueBubbles"
---

> 此文件為 [English Version](/channels/bluebubbles_zh_TW) 的繁體中文版本。

# BlueBubbles (macOS REST)

目前狀態：隨附外掛程式，透過 HTTP 與 BlueBubbles macOS 伺服器通訊。**推薦用於 iMessage 整合**，因為與舊版的 imsg 頻道相比，它具備更豐富的 API 且設定更容易。

## 概觀

- 透過 BlueBubbles 輔助 App ([bluebubbles.app](https://bluebubbles.app)) 執行於 macOS。
- OpenClaw 透過其 REST API 進行通訊。
- 傳入訊息透過 Webhooks 抵達；傳出回覆、輸入中指示、已讀回條與回應表情則是透過 REST 呼叫。
- 進階功能：編輯、收回訊息、回覆執行緒、訊息特效、群組管理。

## 快速開始

1. 在您的 Mac 安裝 BlueBubbles 伺服器。
2. 在 BlueBubbles 設定中，啟用 Web API 並設定密鑰。
3. 執行 `openclaw onboard` 並選擇 BlueBubbles，或手動配置：

```json5
{
  channels: {
    bluebubbles: {
      enabled: true,
      serverUrl: "http://192.168.1.100:1234",
      password: "您的密鑰",
      webhookPath: "/bluebubbles-webhook",
    },
  },
}
```

4. 將 BlueBubbles 的 Webhook 指向您的閘道器（例如：`https://您的閘道器主機:3000/bluebubbles-webhook?password=<密鑰>`）。

## 保持 Messages.app 活躍 (VM / 無頭環境)

在虛擬機器或始終在線的環境中，Messages.app 有時會進入「閒置」狀態（停止接收事件）。建議使用 AppleScript + LaunchAgent 每 5 分鐘「撥弄」一下 Messages。詳情請參閱英文原版文件中的腳本範例。

## 存取控制 (DMs + 群組)

- **私訊 (DMs)**：預設使用 `pairing` 模式。未知傳送者會收到配對碼，需核准後才能對話。
- **群組原則**：預設為 `allowlist`。
- **提及門控 (Mention gating)**：支援群組中的提及檢查，僅在被標記時回應。

## 進階動作

BlueBubbles 支援豐富的訊息動作：
- **表情回應 (React)**：新增或移除回應表情 (Tapbacks)。
- **編輯 (Edit)** / **收回 (Unsend)**：僅限 macOS 13+。
- **回覆 (Reply)**：針對特定訊息 GUID 建立執行緒。
- **訊息特效 (SendWithEffect)**：發送帶有 iMessage 特效（如強烈、震撼等）的訊息。
- **多媒體傳送**：支援傳送語音訊息（將 MP3/CAF 轉換為語音訊息格式）。

## 安全性注意

- Webhook 請求會透過密鑰進行驗證。
- 請妥善保管您的 API 密鑰。
- 建議在 BlueBubbles 伺服器上啟用 HTTPS 並設定防火牆規則。

## 疑難排解

- 若輸入中/已讀事件停止運作，請檢查 Webhook 日誌並確認閘道器路徑正確。
- 配對碼有效期為一小時。
- 部分進階動作（如編輯、收回）需要 macOS 13+ 支援。
