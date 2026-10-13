---
summary: "外部 CLI (signal-cli, 舊版 imsg) 的 RPC 適配器與閘道器模式說明"
read_when:
  - 新增或修改外部 CLI 整合功能時
  - 偵錯 RPC 適配器時
title: "RPC 適配器"
---

> 此文件為 [English Version](/reference/rpc_zh_TW) 的繁體中文版本。

# RPC 適配器 (RPC adapters)

OpenClaw 透過 JSON-RPC 整合外部 CLI 工具。目前主要使用兩類模式：

## 模式 A：HTTP 背景程式 (signal-cli)

- `signal-cli` 作為背景程序執行，透過 HTTP 提供 JSON-RPC 服務。
- 事件串流採用 SSE (`/api/v1/events`)。
- 閘道器負責管理其生命週期。

## 模式 B：標準輸入/輸出子程序 (舊版 imsg)

> **注意**：對於新的 iMessage 設定，強烈建議改用 [BlueBubbles](/channels/bluebubbles_zh_TW)。

- OpenClaw 將 `imsg rpc` 作為子程序啟動。
- JSON-RPC 訊息以行為單位透過 stdin/stdout 傳輸。
- 無需連接埠，無需背景程式。

## 設計準則
- 閘道器擁有程序控制權（啟動/停止與提供者生命週期掛鉤）。
- RPC 客戶端需具備彈性：包含逾時機制與自動重啟。
- 優先使用穩定 ID（如 `chat_id`）而非顯示名稱。
