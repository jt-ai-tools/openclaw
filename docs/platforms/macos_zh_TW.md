---
summary: "OpenClaw macOS 配套 App（選單列 + 閘道器經紀人）"
read_when:
  - 實作 macOS App 功能時
  - 更改 macOS 上的閘道器生命週期或節點橋接時
title: "macOS App"
---

> 此文件為 [English Version](/platforms/macos_zh_TW) 的繁體中文版本。

# OpenClaw macOS 配套 App (macOS Companion)

macOS App 是 OpenClaw 的 **選單列配套程式**。它負責管理權限、本地連接或啟動閘道器 (Gateway)，並將 macOS 的能力以節點 (Node) 形式公開給代理人使用。

## 功能特色

- 在選單列顯示原生通知與狀態。
- 管理 TCC 權限提示（通知、輔助使用、螢幕錄製、麥克風、語音辨識、自動化/AppleScript）。
- 執行或連線至閘道器（本地或遠端）。
- 公開 macOS 專屬工具（畫布 Canvas、相機、螢幕錄製、`system.run`）。
- 支援 **PeekabooBridge** 以進行 UI 自動化。
- 支援按需求安裝全域 CLI 指令 (`openclaw`)。

## 本地 vs 遠端模式

- **本地 (Local)** (預設)：App 連接至正在執行的本地閘道器；若未執行，則透過 `openclaw gateway install` 啟用 launchd 服務。
- **遠端 (Remote)**：App 透過 SSH/Tailscale 連線至遠端閘道器，且不啟動本地閘道器程序。此模式下會啟動 **節點主機服務 (Node host service)**，以便遠端閘道器能存取此 Mac。

## Launchd 控制

App 管理一個名為 `bot.molt.gateway` 的使用者級 LaunchAgent。

```bash
# 啟動服務
launchctl kickstart -k gui/$UID/bot.molt.gateway
# 停止服務
launchctl bootout gui/$UID/bot.molt.gateway
```

## 節點能力 (mac)

macOS App 將自己呈現為一個節點。常用指令包含：
- **畫布**：`canvas.present`, `canvas.navigate`, `canvas.eval` 等。
- **相機**：`camera.snap`, `camera.clip`。
- **螢幕**：`screen.record`。
- **系統**：`system.run` (執行指令), `system.notify` (發送通知)。

## 執行核准 (system.run)

`system.run` 受到 macOS App 內 **執行核准 (Exec approvals)** 的控制。安全性設定與允許清單儲存於：
`~/.openclaw/exec-approvals.json`

## 深層連結 (Deep links)

App 註冊了 `openclaw://` URL 語法用於觸發本地動作。

### `openclaw://agent`
觸發一個閘道器代理人請求。

```bash
open 'openclaw://agent?message=Hello%20from%20deep%20link'
```

## 遠端連線機制 (SSH 隧道)

當 App 處於「遠端」模式時，會開啟 SSH 隧道，使本地 UI 組件能像存取 localhost 一樣與遠端閘道器通訊。

- **目的**：健康檢查、狀態查詢、網頁聊天 (Web Chat)、組態配置等。
- **本地連接埠**：閘道器連接埠（預設 `18789`）。
- **遠端連接埠**：遠端主機上相同的閘道器連接埠。
