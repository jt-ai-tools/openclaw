---
summary: "macOS 上的閘道器生命週期（透過 launchd 管理）說明"
read_when:
  - 將 Mac App 與閘道器生命週期整合時
title: "閘道器生命週期"
---

> 此文件為 [English Version](/platforms/mac/child-process_zh_TW) 的繁體中文版本。

# macOS 上的閘道器生命週期

macOS App 預設 **透過 launchd 管理閘道器 (Gateway)**，而不會直接將其作為子程序 (Child process) 啟動。App 會優先嘗試連線至已在配置連接埠上執行的閘道器；若連線失敗，則透過外部的 `openclaw` CLI 啟用 launchd 服務。這提供了可靠的登入自動啟動與崩潰後自動重啟功能。

目前 **不使用** 子程序模式（即由 App 直接產生的閘道器）。若您需要與 UI 更緊密的結合，請在終端機手動執行閘道器。

## 預設行為 (launchd)

- App 安裝一個名為 `bot.molt.gateway` 的使用者級 LaunchAgent。
- 啟用本地模式時，App 確保載入 LaunchAgent 並在必要時啟動閘道器。
- 日誌會被寫入 launchd 閘道器日誌路徑。

## 未簽署的開發版本
當執行 `scripts/restart-mac.sh --no-sign` 進行快速建置時，為了防止 launchd 指向未簽署的二進位檔，腳本會建立 `~/.openclaw/disable-launchagent` 標記檔案。

## 僅限連接模式 (Attach-only mode)
若要強制 macOS App **永不安裝或管理 launchd**，請帶參數 `--attach-only` 啟動。這會設定上述的停用標記，使 App 僅嘗試連接至現有的閘道器。

## 為什麼優先選用 launchd
- 登入時自動啟動。
- 內建重啟與 KeepAlive 語義。
- 可預測的日誌記錄與程序監控。
