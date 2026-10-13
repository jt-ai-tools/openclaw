---
summary: "提升權限執行模式與 /elevated 指令說明"
read_when:
  - 調整提升權限模式的預設值、允許清單或斜線指令行為時
title: "提升權限模式"
---

> 此文件為 [English Version](/tools/elevated_zh_TW) 的繁體中文版本。

# 提升權限模式 (/elevated 指令)

## 功能說明

- `/elevated on`：在閘道器主機上執行，並保留執行核准程序（等同於 `/elevated ask`）。
- `/elevated full`：在閘道器主機上執行，且 **自動核准** 執行（跳過執行核准程序）。
- `/elevated ask`：在閘道器主機上執行，並保留執行核准程序。
- **僅限沙箱環境**：此指令僅在代理人處於 **沙箱化 (Sandboxed)** 狀態時才會改變行為。若未開啟沙箱，執行原本就在主機上進行。
- **指令形式**：`/elevated on|off|ask|full`, `/elev on|off|ask|full`。

## 控制範圍

- **可用性門控**：`tools.elevated` 是全域基準；`agents.list[].tools.elevated` 可針對個別代理人進一步限制。
- **工作階段狀態**：設定目前工作階段金鑰的提升等級。
- **內嵌指令**：訊息中的指令僅適用於該則訊息。
- **主機執行**：提升權限會強制將 `exec` 導向閘道器主機。
- **核准機制**：`full` 會跳過核准；`on`/`ask` 則遵循允許清單或詢問規則。

## 解析優先順序

1. 訊息中的 **內嵌指令**。
2. **工作階段覆寫**。
3. **全域預設值** (`agents.defaults.elevatedDefault`)。

## 設定工作階段預設值

- 發送一則 **僅包含** 指令的訊息，例如 `/elevated full`。
- 系統會回傳確認訊息（如：「提升權限模式已設為 full」）。
- 若發送者不在核准的允許清單中，指令將回傳錯誤且不變更狀態。
- 發送不帶參數的 `/elevated` 可查看目前等級。

## 可用性與允許清單

- **功能開關**：`tools.elevated.enabled`。
- **傳送者允許清單**：`tools.elevated.allowFrom`（按提供者區分）。
- **個別代理人限制**：`agents.list[].tools.elevated.enabled/allowFrom`。傳送者必須 **同時滿足** 全域與代理人的允許清單。
- **Discord 備援**：若未設定 `tools.elevated.allowFrom.discord`，則會回退至 `channels.discord.dm.allowFrom` 清單。

## 日誌與狀態

- 提升權限的執行呼叫會被記錄在 info 等級的日誌中。
- 工作階段狀態會包含提升權限模式（例如 `elevated=ask`）。
