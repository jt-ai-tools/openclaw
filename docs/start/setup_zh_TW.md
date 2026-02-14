---
summary: "OpenClaw 的進階設定與開發工作流說明"
read_when:
  - 在新機器上進行設定時
  - 您想要在不破壞個人設定的情況下體驗「最新功能」時
title: "進階設定"
---

> 此文件為 [English Version](/start/setup_zh_TW) 的繁體中文版本。

# 進階設定 (Setup)

<Note>
如果您是第一次設定，請先閱讀 [開始使用 (Getting Started)](/start/getting-started_zh_TW)。
</Note>

## 核心重點

- **自訂內容獨立於儲存庫**：您的個人化內容應存放在 `~/.openclaw/workspace` (工作區) 與 `~/.openclaw/openclaw.json` (組態)。
- **穩定工作流**：安裝 macOS App，由它來管理內建的閘道器 (Gateway)。
- **開發者工作流**：手動透過 `pnpm gateway:watch` 執行閘道器，並讓 macOS App 以本地模式連接。

## 隔離自訂內容（確保更新不衝突）

為了享受輕鬆更新且同時擁有「100% 個人化」的助理，請將您的修改保持在：
- **組態**：`~/.openclaw/openclaw.json`。
- **工作區**：`~/.openclaw/workspace`（存放技能、提示詞、記憶；建議設為私有的 Git 儲存庫）。

第一次執行時，請使用：
```bash
openclaw setup
```

## 開發者模式 (Bleeding edge)

目標：開發 TypeScript 閘道器原始碼，享受熱重載 (Hot reload)，同時保持 macOS App UI 的連接。

1. **啟動開發版閘道器**：
   ```bash
   pnpm install
   pnpm gateway:watch
   ```
2. **將 macOS App 指向您的閘道器**：
   在 **OpenClaw.app** 的連線模式中選擇 **Local**。App 會自動偵測並連接至已在執行中的程序。

## 狀態儲存路徑 (State Directory)

在偵錯或備份時可參考以下路徑：
- **憑證**：`~/.openclaw/credentials/`。
- **工作階段**：`~/.openclaw/agents/<agentId>/sessions/`。
- **日誌**：`/tmp/openclaw/`。

## 相關連結
- [閘道器執行手冊 (Gateway runbook)](/gateway_zh_TW)
- [組態設定 (Configuration)](/gateway/configuration_zh_TW)
- [macOS App 生命週期](/platforms/macos_zh_TW)
