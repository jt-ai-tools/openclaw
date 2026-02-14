---
summary: "Android App (節點)：連線指南與畫布/對談/相機功能說明"
read_when:
  - 配對或重新連線 Android 節點時
  - 偵錯 Android 的閘道器探索或驗證問題時
  - 驗證跨客戶端的聊天歷史一致性時
title: "Android App"
---

> 此文件為 [English Version](/platforms/android_zh_TW) 的繁體中文版本。

# Android App (節點)

## 支援概觀

- **角色**：配套節點 App（Android 不負責託管閘道器）。
- **閘道器要求**：是（需執行於 macOS, Linux 或 Windows WSL2）。
- **安裝與配對**：[開始使用](/start/getting-started_zh_TW) + [配對 (Pairing)](/gateway/pairing_zh_TW)。

## 連線指南 (Connection Runbook)

Android 節點 App ⇄ (mDNS/NSD + WebSocket) ⇄ **閘道器**

Android 直接連線至閘道器的 WebSocket（預設為 `ws://<主機>:18789`），並使用由閘道器管理的配對機制。

### 1) 啟動閘道器 (Gateway)

```bash
openclaw gateway --port 18789 --verbose
```

確認日誌中顯示 `listening on ws://0.0.0.0:18789`。對於 Tailscale 專用設定，建議將閘道器繫結至 Tailnet IP。

### 2) 驗證探索功能（選用）
從閘道器機器執行：
```bash
dns-sd -B _openclaw-gw._tcp local.
```

### 3) 從 Android 裝置連線
在 Android App 中：
- App 透過 **前台服務 (Foreground service)** 保持與閘道器的連線。
- 開啟 **Settings** (設定)。
- 在 **Discovered Gateways** (已發現的閘道器) 下，選擇您的閘道器並點擊 **Connect**。
- 若 mDNS 被阻擋，請使用 **Advanced → Manual Gateway** 手動輸入主機位址與連接埠。

### 4) 核准配對 (CLI)
在閘道器機器上執行：
```bash
openclaw nodes pending
openclaw nodes approve <請求ID>
```

### 5) 驗證節點已連線
```bash
openclaw nodes status
```

### 6) 聊天與歷史紀錄
Android 節點使用閘道器的 **主工作階段金鑰** (`main`)，因此歷史紀錄與回覆會與 WebChat 及其它客戶端共用。

### 7) 畫布 (Canvas) 與相機
Android 支援呈現閘道器代管的 HTML 內容，並可執行以下指令：
- **畫布**：`canvas.eval`, `canvas.snapshot`, `canvas.navigate`。
- **相機**：`camera.snap` (照片), `camera.clip` (影片)。

相機功能詳情請參閱：[相機節點 (Camera node)](/nodes/camera_zh_TW)。
