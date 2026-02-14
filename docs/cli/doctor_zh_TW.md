---
summary: "`openclaw doctor` (健康檢查與引導式修復) 的 CLI 參考資料"
read_when:
  - 您遇到連線或驗證問題，並想要引導式的修復方案時
  - 您完成更新後想要進行完整性檢查時
title: "doctor"
---

> 此文件為 [English Version](/cli/doctor_zh_TW) 的繁體中文版本。

# `openclaw doctor`

針對閘道器 (Gateway) 與通訊頻道的健康檢查與快速修復工具。

相關資訊：
- 疑難排解：[疑難排解 (Troubleshooting)](/gateway/troubleshooting_zh_TW)
- 安全性審計：[安全性 (Security)](/gateway/security_zh_TW)

## 範例

```bash
openclaw doctor
openclaw doctor --repair (或 --fix)
openclaw doctor --deep (深度檢查)
```

## 注意事項：

- 互動式提示（如金鑰圈/OAuth 修復）僅在 stdin 為 TTY 且 **未設定** `--non-interactive` 時執行。無頭執行（Cron、Telegram、無終端機環境）將跳過提示。
- `--fix` (別名為 `--repair`) 會在修復前將備份寫入 `~/.openclaw/openclaw.json.bak`，並移除未知的組態鍵值，同時列出每項移除內容。

## macOS：`launchctl` 環境變數覆寫

如果您先前曾執行過 `launchctl setenv OPENCLAW_GATEWAY_TOKEN ...`，該數值會覆寫您的組態檔案，並可能導致持續性的「unauthorized（未授權）」錯誤。

```bash
# 檢查數值
launchctl getenv OPENCLAW_GATEWAY_TOKEN
launchctl getenv OPENCLAW_GATEWAY_PASSWORD

# 取消設定
launchctl unsetenv OPENCLAW_GATEWAY_TOKEN
launchctl unsetenv OPENCLAW_GATEWAY_PASSWORD
```
