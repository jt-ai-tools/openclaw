---
summary: "OpenClaw App、閘道器節點傳輸以及 PeekabooBridge 的 macOS IPC 架構說明"
read_when:
  - 編輯 IPC 合約或選單列 App 的 IPC 時
title: "macOS IPC"
---

> 此文件為 [English Version](/platforms/mac/xpc_zh_TW) 的繁體中文版本。

# OpenClaw macOS IPC 架構

**目前模型**：透過一個本地端的 UNIX Socket 將 **節點主機服務 (Node host service)** 連接至 **macOS App**，用於執行核准 (Exec approvals) 與 `system.run`。UI 自動化則使用 PeekabooBridge。

## 目標

- 單一 GUI App 實例擁有所有 TCC 權限（通知、螢幕錄製、麥克風、語音、AppleScript）。
- 提供一個小型的自動化介面：包含閘道器與節點指令，以及用於 UI 自動化的 PeekabooBridge。
- 具備可預測的權限：始終使用相同的已簽署 Bundle ID 並由 launchd 啟動，以確保 TCC 權限有效。

## 工作原理

### 閘道器與節點傳輸
- App 在本地模式下執行閘道器，並以節點身分連接至閘道器。
- 代理人動作（如 `system.run`, `system.notify`）透過 `node.invoke` 執行。

### 節點服務與 App IPC
- 無頭節點主機服務連接至閘道器的 WebSocket。
- `system.run` 請求會透過本地 UNIX Socket 轉發至 macOS App。
- App 在 UI 內容中執行該指令，並在需要時彈出核准提示，最後回傳輸出結果。

架構圖：
`代理人 -> 閘道器 -> 節點服務 (WS) -> [IPC] -> Mac App (UI + TCC + system.run)`

### PeekabooBridge (UI 自動化)
- UI 自動化使用一個名為 `bridge.sock` 的獨立 UNIX Socket 以及 PeekabooBridge JSON 協定。
- 主機偏好順序：Peekaboo.app → Claude.app → OpenClaw.app。

## 安全性強化
- 所有的 Privileged surfaces 優先要求 TeamID 匹配。
- 所有的通訊保持僅限本地存取，不公開任何網路通訊端。
- IPC 強化：Socket 模式 `0600`、具備權杖、同行 UID 檢查、HMAC 挑戰/回應以及短效 TTL。
