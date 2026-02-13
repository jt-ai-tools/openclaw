---
summary: "閘道器 (Gateway)、節點與 Canvas 宿主如何進行連線"
read_when:
  - 您需要了解閘道器網路模型的簡要概觀時
title: "網路模型"
---

> 此文件為 [English Version](/gateway/network-model) 的繁體中文版本。

大多數的操作皆透過閘道器 (`openclaw gateway`) 進行，這是一個長期執行的程序，負責管理通訊頻道連線與 WebSocket 控制平面。

## 核心規則

- 建議每個主機僅執行一個閘道器。它是唯一被允許擁有 WhatsApp Web 會話的程序。若需要救援機器人或嚴格的隔離，請使用隔離的設定檔與連接埠執行多個閘道器。請參閱 [多個閘道器](/gateway/multiple-gateways_zh_TW)。
- **優先使用迴路位址 (Loopback)**：閘道器 WS 預設為 `ws://127.0.0.1:18789`。引導精靈預設會產生一個閘道器 Token（即使是 loopback 亦然）。若需 Tailnet 存取，請執行 `openclaw gateway --bind tailnet --token ...`，因為非迴路位址的綁定必須提供 Token。
- **節點 (Nodes)**：視需要透過區域網路 (LAN)、Tailnet 或 SSH 連線至閘道器 WS。舊版的 TCP 橋接方式已棄用。
- **Canvas 宿主**：是一個執行於 `canvasHost.port`（預設為 `18793`）的 HTTP 檔案伺服器，為節點的 WebView 提供 `/__openclaw__/canvas/` 的服務。請參閱 [閘道器組態](/gateway/configuration_zh_TW) (`canvasHost`)。
- **遠端使用**：通常透過 SSH 隧道或 Tailnet VPN 實現。請參閱 [遠端存取](/gateway/remote_zh_TW) 與 [發現機制](/gateway/discovery_zh_TW)。
