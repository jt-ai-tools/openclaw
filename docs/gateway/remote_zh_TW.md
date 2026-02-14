---
summary: "使用 SSH 隧道 (閘道器 WS) 與 Tailnets 進行遠端存取"
read_when:
  - 執行或偵錯遠端閘道器設定時
title: "遠端存取"
---

> 此文件為 [English Version](/gateway/remote_zh_TW) 的繁體中文版本。

# 遠端存取 (SSH、隧道與 Tailnets)

此專案支援「透過 SSH 進行遠端操作」，其方式是讓單一的閘道器 (Gateway)（主控端）在專用主機（桌機/伺服器）上執行，並將各用戶端連線至該主機。

- 對於 **操作員 (您 / macOS App)**：SSH 隧道是通用的備援方案。
- 對於 **節點 (iOS/Android 與未來裝置)**：連線至閘道器的 **WebSocket**（視需要使用 LAN/tailnet 或 SSH 隧道）。

## 核心概念

- 閘道器 WebSocket 會綁定到您設定連接埠上的 **迴路位址 (loopback)**（預設為 18789）。
- 對於遠端使用，您可以透過 SSH 轉發該迴路連接埠（或使用 tailnet/VPN 以減少隧道需求）。

## 常見的 VPN/tailnet 設定 (代理人所在位置)

您可以將 **閘道器主機** 視為「代理人居住的地方」。它擁有對談、驗證設定檔、頻道以及狀態。
您的筆電/桌機（以及節點）會連線到該主機。

### 1) 在 tailnet 中執行永遠在線的閘道器 (VPS 或家用伺服器)

在持久性主機上執行閘道器，並透過 **Tailscale** 或 SSH 連接。

- **最佳體驗：** 保持 `gateway.bind: "loopback"` 並使用 **Tailscale Serve** 提供控制 UI。
- **備援方案：** 保持 loopback 並從任何需要存取的機器建立 SSH 隧道。
- **範例：** [exe.dev](/install/exe-dev_zh_TW) (簡單的虛擬機) 或 [Hetzner](/install/hetzner_zh_TW) (生產級 VPS)。

當您的筆電經常進入睡眠，但您希望代理人永遠在線時，這是最理想的選擇。

### 2) 家用桌機執行閘道器，筆電作為遠端控制

筆電 **不執行** 代理人，而是遠端連線：

- 使用 macOS App 的 **Remote over SSH** 模式 (Settings → General → “OpenClaw runs”)。
- App 會自動開啟並管理隧道，因此 WebChat 與健康檢查都能「直接運作」。

執行手冊：[macOS 遠端存取](/platforms/mac/remote_zh_TW)。

### 3) 筆電執行閘道器，從其他機器遠端存取

讓閘道器留在本地但安全地對外曝露：

- 從其他機器建立 SSH 隧道到筆電，或者
- 使用 Tailscale Serve 開放控制 UI 並保持閘道器僅限於 loopback。

指南：[Tailscale](/gateway/tailscale_zh_TW) 與 [網頁概觀](/web_zh_TW)。

## 指令流程 (何處執行什麼)

單一閘道器服務擁有狀態與頻道。節點則是週邊設備。

流程範例 (Telegram → 節點)：

- Telegram 訊息抵達 **閘道器**。
- 閘道器執行 **代理人** 並決定是否調用節點工具。
- 閘道器透過閘道器 WebSocket (`node.*` RPC) 調用 **節點**。
- 節點傳回結果；閘道器回覆至 Telegram。

注意事項：

- **節點不執行閘道器服務。** 除非您刻意執行隔離的設定檔，否則每個主機僅應執行一個閘道器（參見 [多個閘道器](/gateway/multiple-gateways_zh_TW)）。
- macOS App 的「節點模式」僅是透過閘道器 WebSocket 連線的節點用戶端。

## SSH 隧道 (CLI 與工具)

建立指向遠端閘道器 WS 的本地隧道：

```bash
ssh -N -L 18789:127.0.0.1:18789 user@host
```

隧道建立後：

- `openclaw health` 與 `openclaw status --deep` 現在會透過 `ws://127.0.0.1:18789` 接觸到遠端閘道器。
- `openclaw gateway {status,health,send,agent,call}` 在需要時也可透過 `--url` 指定轉發後的 URL。

注意：請將 `18789` 替換為您設定的 `gateway.port`（或 `--port`/`OPENCLAW_GATEWAY_PORT`）。
注意：當您傳遞 `--url` 時，CLI 不會自動使用組態或環境變數中的憑證。
請明確包含 `--token` 或 `--password`。缺少明確憑證將會導致錯誤。

## CLI 遠端預設值

您可以持久化遠端目標，以便 CLI 指令預設使用：

```json5
{
  gateway: {
    mode: "remote",
    remote: {
      url: "ws://127.0.0.1:18789",
      token: "您的-token",
    },
  },
}
```

當閘道器僅限 loopback 時，請將 URL 保持在 `ws://127.0.0.1:18789` 並先開啟 SSH 隧道。

## 透過 SSH 使用聊天 UI

WebChat 不再使用獨立的 HTTP 連接埠。SwiftUI 聊天 UI 直接連線至閘道器 WebSocket。

- 透過 SSH 轉發 `18789`（見上文），接著將用戶端連線至 `ws://127.0.0.1:18789`。
- 在 macOS 上，建議使用 App 的 “Remote over SSH” 模式，它會自動管理隧道。

## macOS App “Remote over SSH”

macOS 選單列應用程式可以驅動整個端到端設定（遠端狀態檢查、WebChat 與語音喚醒轉發）。

執行手冊：[macOS 遠端存取](/platforms/mac/remote_zh_TW)。

## 安全性規則 (遠端/VPN)

簡短摘要：**除非確定需要綁定，否則請保持閘道器僅限於 loopback。**

- **Loopback + SSH/Tailscale Serve** 是最安全的預設設定（無公開曝光）。
- **非迴路位址 (Non-loopback) 綁定**（`lan`/`tailnet`/`custom`，或 loopback 不可用時的 `auto`）必須使用驗證 Token/密碼。
- `gateway.remote.token` **僅** 用於遠端 CLI 調用 —— 它不會啟用本地驗證。
- 使用 `wss://` 時，可透過 `gateway.remote.tlsFingerprint` 固定遠端 TLS 憑證。
- 當 `gateway.auth.allowTailscale: true` 時，**Tailscale Serve** 可透過識別標頭進行驗證。
  若您偏好使用 Token/密碼，請將其設為 `false`。
- 將瀏覽器控制視為操作員級存取：僅限 tailnet + 審慎進行節點配對。

深度探討：[安全性](/gateway/security_zh_TW)。
