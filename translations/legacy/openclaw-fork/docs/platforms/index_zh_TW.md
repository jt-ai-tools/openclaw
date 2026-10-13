---
summary: "平台支援概觀（包含閘道器與配套 App）"
read_when:
  - 尋找作業系統支援或安裝路徑時
  - 決定要在哪裡執行閘道器時
title: "平台"
---

> 此文件為 [English Version](/platforms/index_zh_TW) 的繁體中文版本。

# 平台 (Platforms)

OpenClaw 核心使用 TypeScript 撰寫。**建議使用 Node 作為執行環境**。不建議為閘道器 (Gateway) 使用 Bun（存在 WhatsApp/Telegram 相關 Bug）。

我們為 macOS 提供配套 App（選單列 App），並為行動裝置提供節點 App (iOS/Android)。Windows 與 Linux 的配套 App 正在開發中，但閘道器在目前的 Windows (WSL2) 與 Linux 上已獲得完整支援。

## 選擇您的作業系統

- [macOS](/platforms/macos_zh_TW)
- [iOS](/platforms/ios_zh_TW)
- [Android](/platforms/android_zh_TW)
- [Windows](/platforms/windows_zh_TW)
- [Linux](/platforms/linux_zh_TW)

## VPS 與代管 (Hosting)

- VPS 中心：[VPS 託管 (VPS hosting)](/vps_zh_TW)
- [Fly.io](/install/fly_zh_TW)
- [Hetzner (Docker)](/install/hetzner_zh_TW)
- [GCP (Compute Engine)](/install/gcp_zh_TW)
- [exe.dev (VM + HTTPS 代理)](/install/exe-dev_zh_TW)

## 常用連結

- 安裝指南：[開始使用 (Getting started)](/start/getting-started_zh_TW)
- 閘道器執行手冊：[閘道器 (Gateway)](/gateway_zh_TW)
- 閘道器組態：[組態設定 (Configuration)](/gateway/configuration_zh_TW)
- 服務狀態：`openclaw gateway status`

## 閘道器服務安裝 (CLI)

建議使用以下任一方式安裝：
- 設定精靈（推薦）：`openclaw onboard --install-daemon`。
- 直接安裝：`openclaw gateway install`。
- 配置流程：`openclaw configure` → 選擇 **Gateway service**。
- 診斷修復：`openclaw doctor`。

服務目標依作業系統而定：
- **macOS**：LaunchAgent (`bot.molt.gateway`)。
- **Linux/WSL2**：systemd 使用者服務 (`openclaw-gateway.service`)。
