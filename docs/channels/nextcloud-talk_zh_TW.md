---
summary: "Nextcloud Talk 支援狀態、能力與組態設定說明"
read_when:
  - 處理 Nextcloud Talk 頻道功能時
title: "Nextcloud Talk"
---

> 此文件為 [English Version](/channels/nextcloud-talk_zh_TW) 的繁體中文版本。

# Nextcloud Talk (外掛程式)

目前狀態：透過外掛程式支援（Webhook 機器人）。支援私訊、房間、回應表情以及 Markdown 訊息。

## 外掛程式需求
Nextcloud Talk 功能是以外掛程式形式提供的。
- 安裝指令：`openclaw plugins install @openclaw/nextcloud-talk`。

## 快速設定

1. **安裝外掛程式**。
2. **建立機器人**：在您的 Nextcloud 伺服器上執行 `occ talk:bot:install` 指令。
3. **啟用機器人**：在目標房間的設定中啟用該機器人。
4. **配置組態**：
```json5
{
  channels: {
    "nextcloud-talk": {
      enabled: true,
      baseUrl: "https://您的雲端網址",
      botSecret: "共享秘密金鑰",
      dmPolicy: "pairing",
    },
  },
}
```
5. **重啟閘道器**。

## 注意事項
- **機器人無法主動傳訊**：使用者必須先傳送訊息給機器人。
- **多媒體限制**：機器人 API 不支援檔案上傳；多媒體會以網址形式發送。
- **判別私訊 vs 房間**：Webhook 酬載預設不區分兩者。建議設定 `apiUser` 與 `apiPassword` 以啟用房間類型查詢功能。

## 存取控制
- **私訊政策**：預設為 `pairing`。未知傳送者需獲核准。
- **房間原則**：預設為 `allowlist` 且預設要求標記機器人。

## 功能能力
- **私訊/房間**：支援。
- **回應表情**：支援。
- **多媒體**：僅限網址。
- **執行緒**：不支援。
