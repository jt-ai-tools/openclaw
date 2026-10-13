---
summary: "LINE Messaging API 外掛程式設定、組態與用法說明"
read_when:
  - 您想要將 OpenClaw 連接至 LINE 時
  - 您需要設定 LINE Webhook 與憑證時
  - 您想要使用 LINE 專屬的訊息選項時
title: "LINE"
---

> 此文件為 [English Version](/channels/line_zh_TW) 的繁體中文版本。

# LINE (外掛程式)

LINE 透過 LINE Messaging API 連接至 OpenClaw。此功能以 Webhook 接收器的形式執行於閘道器上，並使用您的頻道存取權杖 (Channel access token) 與頻道密鑰 (Channel secret) 進行驗證。

目前狀態：透過外掛程式支援。支援私訊、群組對話、多媒體、地理位置、Flex 訊息、模板訊息以及快速回覆 (Quick replies)。不支援回應表情與執行緒。

## 外掛程式需求
LINE 功能是以外掛程式形式提供的。
- 安裝指令：`openclaw plugins install @openclaw/line`。

## 設定步驟

1. **建立開發者帳號**：登入 [LINE Developers Console](https://developers.line.biz/console/)。
2. **建立 Messaging API 頻道**：獲取 **Channel access token** 與 **Channel secret**。
3. **啟用 Webhook**：在 Messaging API 設定中開啟「Use webhook」。
4. **設定 Webhook URL**：將網址指向您的閘道器端點（必須使用 HTTPS）：
   `https://您的閘道器主機/line/webhook`

## 配置組態

在 `openclaw.json` 中配置：
```json5
{
  channels: {
    line: {
      enabled: true,
      channelAccessToken: "您的頻道存取權杖",
      channelSecret: "您的頻道密鑰",
      dmPolicy: "pairing",
    },
  },
}
```

## 存取控制
- **私訊政策**：預設為 `pairing`。未知傳送者需獲核准。
- **LINE ID 格式**：
  - 使用者：`U` 開頭 + 32 位 16 進位字元。
  - 群組：`C` 開頭 + 32 位 16 進位字元。

## 訊息行為
- 文字上限為 5000 字元。
- Markdown 格式會被剝離；程式碼區塊與表格會盡可能轉換為 Flex 卡片。
- 串流回覆會被緩衝處理；LINE 會在代理人執行期間顯示「載入中」動畫。

## 豐富訊息 (Rich Messages)
您可以透過 `channelData.line` 發送快速回覆、地理位置、Flex 卡片或模板訊息。外掛程式也隨附了一個 `/card` 指令用於快速發送預設的 Flex 卡片。
