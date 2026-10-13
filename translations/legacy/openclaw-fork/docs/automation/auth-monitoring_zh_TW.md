---
summary: "模型提供者的 OAuth 過期狀態監控說明"
read_when:
  - 設定驗證過期監控或警報時
  - 自動化檢查 Claude Code / Codex OAuth 重新整理狀態時
title: "驗證監控"
---

> 此文件為 [English Version](/automation/auth-monitoring_zh_TW) 的繁體中文版本。

# 驗證監控 (Auth monitoring)

OpenClaw 透過 `openclaw models status` 公開 OAuth 的過期健康狀態。建議優先使用此指令進行自動化與警報。

## 推薦方式：CLI 檢查 (具備移植性)

```bash
openclaw models status --check
```

**退出代碼 (Exit codes)：**
- `0`：一切正常。
- `1`：憑證已過期或缺失。
- `2`：即將過期（24 小時內）。

此指令可直接與 Cron 或 systemd 配合使用，無需額外腳本。

## 選用的輔助腳本 (手機工作流)

這些位於 `scripts/` 下的腳本是 **選用** 的，主要針對 Termux 或進階手機自動化設計：
- `auth-monitor.sh`：定時任務目標，發送 ntfy 或手機通知。
- `mobile-reauth.sh`：透過 SSH 引導重新驗證的流程。
- `termux-quick-auth.sh`：一鍵顯示狀態並開啟驗證網址。

如果您不需要手機自動化，可以略過這些腳本。
