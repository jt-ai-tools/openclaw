---
summary: "監控模型提供者的 OAuth 到期狀態說明"
read_when:
  - 設定驗證到期監控或警報時
  - 自動化執行 Claude Code / Codex 的 OAuth 重新整理檢查時
title: "驗證監控"
---

> 此文件為 [English Version](/automation/auth-monitoring) 的繁體中文版本。

# 驗證監控 (Auth monitoring)

OpenClaw 透過 `openclaw models status` 公開 OAuth 的到期檢查狀態。建議將其用於自動化與警報功能；腳本部分則是針對手機工作流提供的選用額外工具。

## 偏好方式：CLI 檢查 (跨平台)

```bash
openclaw models status --check
```

結束代碼 (Exit codes)：

- `0`：正常 (OK)
- `1`：憑證已過期或缺失
- `2`：即將過期（24 小時內）

此指令可在 Cron 或 systemd 中運作，無需額外的腳本。

## 選用腳本 (維運 / 手機工作流)

這些腳本位於 `scripts/` 目錄下，屬於 **選用** 項目。它們假設您可以透過 SSH 存取閘道器主機，並針對 systemd 與 Termux 進行了優化。

- `scripts/claude-auth-status.sh` 現在使用 `openclaw models status --json` 作為單一事實來源（若 CLI 不可用則回退至直接讀取檔案），因此請確保 `openclaw` 位於計時器執行的 `PATH` 路徑中。
- `scripts/auth-monitor.sh`：Cron/systemd 計時器目標；傳送警報（透過 ntfy 或手機）。
- `scripts/systemd/openclaw-auth-monitor.{service,timer}`：systemd 使用者計時器。
- `scripts/claude-auth-status.sh`：Claude Code + OpenClaw 驗證檢查器（支援 full/json/simple 模式）。
- `scripts/mobile-reauth.sh`：透過 SSH 進行的引導式重新驗證流程。
- `scripts/termux-quick-auth.sh`：一鍵小工具狀態顯示 + 開啟驗證 URL。
- `scripts/termux-auth-widget.sh`：完整的引導式小工具流程。
- `scripts/termux-sync-widget.sh`：將 Claude Code 憑證同步至 OpenClaw。

如果您不需要手機自動化或 systemd 計時器，可以跳過這些腳本。
