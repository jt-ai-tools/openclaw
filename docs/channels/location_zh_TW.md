---
summary: "傳入頻道的地理位置剖析（Telegram + WhatsApp）與上下文欄位說明"
read_when:
  - 新增或修改頻道位置剖析邏輯時
  - 在代理人提示詞或工具中使用位置上下文欄位時
title: "頻道位置剖析"
---

> 此文件為 [English Version](/channels/location_zh_TW) 的繁體中文版本。

# 頻道位置剖析 (Channel location parsing)

OpenClaw 會將聊天頻道分享的地理位置標準化為：
- 附加在傳入訊息正文中的人類可讀文字。
- 自動回覆上下文酬載中的結構化欄位。

目前支援：**Telegram**, **WhatsApp**, **Matrix**。

## 文字格式

位置會被渲染為友善的文字行：
- **定位點**：`📍 48.858844, 2.294351 ±12m`。
- **具名地點**：`📍 艾菲爾鐵塔 — Champ de Mars, Paris (48.858844, 2.294351 ±12m)`。
- **即時位置分享**：`🛰 即時位置：48.858844, 2.294351 ±12m`。

## 上下文欄位

當存在位置資訊時，以下欄位會被加入 `ctx`：
- `LocationLat` (緯度)
- `LocationLon` (經度)
- `LocationAccuracy` (精確度，公尺)
- `LocationName` (地點名稱)
- `LocationAddress` (地址)
- `LocationSource` (`pin | place | live`)
- `LocationIsLive` (是否為即時位置)

## 各頻道注意事項
- **Telegram**：場域 (Venues) 會映射至地點名稱/地址。
- **WhatsApp**：註解或標題會被附加在位置文字行之後。
- **Matrix**：`geo_uri` 被解析為定位點，高度資訊會被忽略。
