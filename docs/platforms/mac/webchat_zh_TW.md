---
summary: "Mac App 如何嵌入閘道器 WebChat 及其偵錯方法說明"
read_when:
  - 偵錯 Mac WebChat 視圖或環回連接埠時
title: "WebChat"
---

> 此文件為 [English Version](/platforms/mac/webchat_zh_TW) 的繁體中文版本。

# WebChat (macOS App)

macOS 選單列 App 將 WebChat UI 嵌入為原生的 SwiftUI 視圖。它會連接至閘道器 (Gateway)，並預設使用所選代理人的 **主工作階段 (main session)**。

- **本地模式**：直接連接至本地閘道器的 WebSocket。
- **遠端模式**：透過 SSH 轉發閘道器控制連接埠，並使用該隧道作為數據平面。

## 啟動與偵錯

- **手動開啟**：點擊龍蝦選單 → 「開啟聊天 (Open Chat)」。
- **測試用自動開啟**：
  ```bash
  dist/OpenClaw.app/Contents/MacOS/OpenClaw --webchat
  ```
- **查看日誌**：使用 `./scripts/clawlog.sh` 並指定分類為 `WebChatSwiftUI`。

## 系統串接

- **數據平面**：使用閘道器 WS 方法如 `chat.history`, `chat.send`, `chat.abort` 等。
- **工作階段**：預設使用主工作階段 (`main`)。UI 介面提供工作階段切換器。
- **引導設定**：使用專用的工作階段，以將首次設定與一般對話分開。

## 已知限制

- UI 針對對談工作階段進行了優化（並非完整的瀏覽器沙箱）。
