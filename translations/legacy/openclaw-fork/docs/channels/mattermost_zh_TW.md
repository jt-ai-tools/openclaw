---
summary: "Mattermost 機器人設定與 OpenClaw 組態說明"
read_when:
  - 設定 Mattermost 時
  - 偵錯 Mattermost 路由時
title: "Mattermost"
---

> 此文件為 [English Version](/channels/mattermost_zh_TW) 的繁體中文版本。

# Mattermost (外掛程式)

目前狀態：透過外掛程式支援（機器人權杖 + WebSocket 事件）。支援頻道、群組與私訊。Mattermost 是一款可自託管的團隊訊息平台。

## 外掛程式需求
Mattermost 功能是以外掛程式形式提供的。
- 安裝指令：`openclaw plugins install @openclaw/mattermost`。

## 快速設定

1. **安裝外掛程式**。
2. **建立機器人**：在 Mattermost 建立一個機器人帳號並獲取 **機器人權杖 (Bot Token)**。
3. **獲取基礎網址**：例如 `https://您的聊天伺服器網址`。
4. **配置組態**：
```json5
{
  channels: {
    mattermost: {
      enabled: true,
      botToken: "您的權杖",
      baseUrl: "https://您的伺服器網址",
      dmPolicy: "pairing",
    },
  },
}
```
5. **啟動閘道器**。

## 對談模式 (Chat modes)
頻道行為由 `chatmode` 控制：
- `oncall` (預設)：僅在頻道中被標記 (@mention) 時回應。
- `onmessage`：針對頻道中的每一則訊息進行回應。
- `onchar`：當訊息以特定前綴（如 `>` 或 `!`）開頭時回應。

## 存取控制
- **私訊政策**：預設為 `pairing`。未知傳送者需獲核准。
- **頻道原則**：預設為 `allowlist` 且預設要求標記機器人。

## 疑難排解
- **頻道中不回覆**：請確認機器人已在頻道內，且符合對談模式的觸發條件。
- **驗證錯誤**：請檢查權杖與基礎網址是否正確。
