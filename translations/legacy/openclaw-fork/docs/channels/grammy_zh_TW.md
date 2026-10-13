---
summary: "透過 grammY 整合 Telegram Bot API 的設定說明"
read_when:
  - 處理 Telegram 或 grammY 相關路徑功能時
title: grammY
---

> 此文件為 [English Version](/channels/grammy_zh_TW) 的繁體中文版本。

# grammY 整合 (Telegram Bot API)

## 為什麼選擇 grammY

- 這是以 TypeScript 為主的 Bot API 客戶端，內建長輪詢 (Long-poll) 與 Webhook 輔助工具、中間件、錯誤處理以及速率限制器。
- 提供比手寫 Fetch + FormData 更乾淨的多媒體處理工具。
- 具備可擴充性：支援代理伺服器、工作階段中間件以及類型安全的上下文。

## 已實作功能

- **單一客戶端路徑**：已移除基於 Fetch 的舊實作；grammY 現在是唯一的 Telegram 客戶端，並預設啟動了節流器 (Throttler)。
- **閘道器**：支援標記/允許清單門控、透過 `getFile`/`download` 下載多媒體，並發送各種訊息類型（文字、照片、影片、音訊、文件）。支援長輪詢或 Webhook。
- **代理伺服器**：可選用 `channels.telegram.proxy` 設定。
- **Webhook 支援**：當設定了 `webhookUrl` 與 `webhookSecret` 時啟動 Webhook 模式，否則使用長輪詢。
- **工作階段**：私訊合併至主工作階段；群組則使用獨立的群組 ID 工作階段。
- **草稿串流 (Draft streaming)**：可選用 `channels.telegram.streamMode` 在私有主題對話中串流顯示草稿。

## 配置項說明

- `channels.telegram.botToken`：機器人權杖。
- `channels.telegram.dmPolicy`：私訊原則。
- `channels.telegram.groups`：群組允許清單與提及預設值。
- `channels.telegram.mediaMaxMb`：多媒體大小上限。
- `channels.telegram.streamMode`：草稿串流模式。
- `channels.telegram.webhookUrl / webhookSecret`：Webhook 相關設定。
