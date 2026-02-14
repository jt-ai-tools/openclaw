---
summary: "為開發 OpenClaw macOS App 的開發者提供的設定指南"
read_when:
  - 設定 macOS 開發環境時
title: "macOS 開發設定"
---

> 此文件為 [English Version](/platforms/mac/dev-setup_zh_TW) 的繁體中文版本。

# macOS 開發者設定 (macOS Developer Setup)

本指南涵蓋了從原始碼建置並執行 OpenClaw macOS 應用程式的必要步驟。

## 事前準備

在建置 App 前，請確保您已安裝：
1. **Xcode 26.2+**：Swift 開發必備。
2. **Node.js 22+ 與 pnpm**：用於閘道器、CLI 與打包腳本。

## 1. 安裝依賴項
安裝專案範圍的依賴項：
```bash
pnpm install
```

## 2. 建置與打包 App
若要建置 macOS App 並打包至 `dist/OpenClaw.app`，請執行：
```bash
./scripts/package-mac-app.sh
```
如果您沒有 Apple Developer ID 憑證，腳本會自動使用 **臨機操作簽署 (Ad-hoc signing)** (`-`)。

## 3. 安裝 CLI
macOS App 需要全域安裝的 `openclaw` CLI 來管理背景任務。建議透過以下方式安裝：
1. 開啟 OpenClaw App。
2. 前往 **General** (一般) 設定分頁。
3. 點擊 **"Install CLI"**。

## 疑難排解 (Troubleshooting)

### 建置失敗：工具鏈或 SDK 不符
macOS App 需要最新的 macOS SDK 與 Swift 6.2 工具鏈。請檢查版本：
```bash
xcodebuild -version
xcrun swift --version
```

### 授權權限時 App 崩潰
若在授予 **語音辨識** 或 **麥克風** 存取權時崩潰，可能是 TCC 快取損壞。
修復方式：
```bash
tccutil reset All bot.molt.mac.debug
```

### 閘道器卡在 "Starting..."
檢查是否有僵屍程序占用連接埠：
```bash
openclaw gateway status
openclaw gateway stop
# 若手動執行卡住，查找監聽程序：
lsof -nP -iTCP:18789 -sTCP:LISTEN
```
