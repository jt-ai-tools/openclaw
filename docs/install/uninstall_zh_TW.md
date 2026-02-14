---
summary: "完全解除安裝 OpenClaw（包含 CLI、服務、狀態與工作區）"
read_when:
  - 您想要從機器上移除 OpenClaw 時
  - 解除安裝後閘道器服務仍在執行時
title: "解除安裝"
---

> 此文件為 [English Version](/install/uninstall_zh_TW) 的繁體中文版本。

# 解除安裝 (Uninstall)

分為兩種路徑：若 `openclaw` 仍安裝著，請使用 **快速路徑**；若 CLI 已移除但服務仍在執行，請執行 **手動服務移除**。

## 快速路徑 (CLI 仍存在)

建議方式：使用內建的解除安裝指令。
```bash
openclaw uninstall
```

針對自動化環境或使用 npx 執行：
```bash
openclaw uninstall --all --yes --non-interactive
```

手動步驟如下：
1. **停止閘道器服務**：`openclaw gateway stop`。
2. **解除安裝系統服務**：`openclaw gateway uninstall`。
3. **刪除狀態與組態**：`rm -rf ~/.openclaw`。
4. **刪除工作區 (選用)**：`rm -rf ~/.openclaw/workspace`（這會移除所有代理人檔案）。
5. **移除 CLI 工具**：執行 `npm rm -g openclaw`。
6. **移除 macOS App (若有安裝)**：刪除 `/Applications/OpenClaw.app`。

## 手動服務移除 (CLI 已不存在)

若閘道器服務持續執行但已找不到 `openclaw` 指令時使用。

### macOS (launchd)
服務標籤預設為 `bot.molt.gateway`：
```bash
launchctl bootout gui/$UID/bot.molt.gateway
rm -f ~/Library/LaunchAgents/bot.molt.gateway.plist
```

### Linux (systemd user unit)
服務名稱預設為 `openclaw-gateway.service`：
```bash
systemctl --user disable --now openclaw-gateway.service
rm -f ~/.config/systemd/user/openclaw-gateway.service
systemctl --user daemon-reload
```

### Windows (工作排程器)
工作名稱預設為 `OpenClaw Gateway`：
```powershell
schtasks /Delete /F /TN "OpenClaw Gateway"
Remove-Item -Force "$env:USERPROFILE\.openclaw\gateway.cmd"
```

## 一般安裝 vs 原始碼簽出 (Checkout)

如果您是使用 `git clone` 執行開發版本：
1. **先解除安裝服務**（使用上述快速路徑或手動移除）。
2. **刪除儲存庫目錄**。
3. **移除狀態與工作區目錄**。
