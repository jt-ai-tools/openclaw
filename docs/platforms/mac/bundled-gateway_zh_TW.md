---
summary: "macOS 上的閘道器執行環境（外部 launchd 服務）"
read_when:
  - 打包 OpenClaw.app 時
  - 偵錯 macOS 閘道器 launchd 服務時
  - 為 macOS 安裝閘道器 CLI 時
title: "macOS 上的閘道器"
---

> 此文件為 [English Version](/platforms/mac/bundled-gateway_zh_TW) 的繁體中文版本。

# macOS 上的閘道器 (外部 launchd)

OpenClaw.app 不再內建 Node/Bun 或閘道器 (Gateway) 執行環境。macOS App 預期存在一個 **外部安裝** 的 `openclaw` CLI，它不會將閘道器作為子程序啟動，而是管理一個使用者級別的 launchd 服務來保持閘道器持續執行。

## 安裝 CLI（本地模式必備）

您需要在 Mac 上安裝 Node 22+，然後全域安裝 `openclaw`：

```bash
npm install -g openclaw@<版本號>
```

macOS App 中的 **Install CLI** 按鈕也會執行相同的 npm/pnpm 安裝流程。

## Launchd (將閘道器作為 LaunchAgent)

服務標籤 (Label)：
- `bot.molt.gateway` (或 `bot.molt.<設定檔名稱>`)。

Plist 檔案位置：
- `~/Library/LaunchAgents/bot.molt.gateway.plist`。

運作行為：
- 當勾選「OpenClaw Active」時，會啟用 launchd 服務。
- **退出 App 不會停止閘道器**（launchd 會保持其執行）。
- 若已有閘道器在配置的連接埠上執行，App 會直接連線至該程序而非重新啟動。

日誌路徑：
- `/tmp/openclaw/openclaw-gateway.log`。

## 版本相容性

macOS App 會檢查閘道器版本是否與其自身版本相符。若不相符，請更新全域 CLI 以對齊 App 版本。
