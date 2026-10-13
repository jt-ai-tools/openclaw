---
title: 傳出訊息工作階段鏡像重構 (Issue #1520)
description: 追蹤傳出訊息工作階段鏡像的重構筆記、決策、測試與待辦事項。
---

> 此文件為 [English Version](/refactor/outbound-session-mirroring_zh_TW) 的繁體中文版本。

# 傳出訊息工作階段鏡像重構 (Issue #1520)

## 目前狀態
- 進行中。
- 核心與外掛程式頻道路由已針對傳出鏡像進行更新。
- 閘道器發送指令在省略 `sessionKey` 時會自動推導目標工作階段。

## 背景資訊
以往傳出訊息會鏡像至「目前」的代理人工作階段（即工具呼叫的工作階段），而非目標頻道的實際對話工作階段。由於傳入路由使用頻道/同儕工作階段金鑰，這導致傳出回覆被存入了錯誤的位置，且首次聯絡的對象往往缺少工作階段紀錄。

## 核心目標
- 將傳出訊息鏡像至 **目標頻道的工作階段金鑰** 中。
- 當傳出時缺少工作階段條目時，自動建立。
- 保持執行緒 (Thread) 與主題 (Topic) 的範圍與傳入訊息的金鑰格式一致。
- 涵蓋核心頻道與所有內建擴充功能。

## 實作摘要
- 新增傳出工作階段路由輔助工具：`src/infra/outbound/outbound-session.ts`。
- `message-tool` 不再直接執行鏡像，僅負責從目前金鑰推導代理人 ID。
- 外掛程式發送路徑透過推導出的金鑰，呼叫 `appendAssistantMessageToSessionTranscript` 進行鏡像。

## 涵蓋的擴充功能
- Matrix, MS Teams, Mattermost, BlueBubbles, Nextcloud Talk, Zalo, Zalo Personal, Nostr, Tlon。
- **注意**：BlueBubbles 群組目標會剝離 `chat_*` 前綴以匹配傳入金鑰；Slack 自動執行緒鏡像採用不分大小寫的頻道 ID 匹配。

## 核心決策
- **閘道器發送的工作階段推導**：若提供 `sessionKey` 則優先使用；否則根據目標與預設代理人推導金鑰。
- **金鑰格式標準化**：寫入與遷移過程中，一律將工作階段金鑰轉為小寫。
