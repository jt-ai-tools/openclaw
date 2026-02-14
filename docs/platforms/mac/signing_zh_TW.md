---
summary: "由打包腳本產生的 macOS 偵錯版本簽署步驟說明"
read_when:
  - 建置或簽署 Mac 偵錯版本時
title: "macOS 簽署"
---

> 此文件為 [English Version](/platforms/mac/signing_zh_TW) 的繁體中文版本。

# Mac 簽署 (macOS Signing - 偵錯版本)

本應用程式通常透過 `scripts/package-mac-app.sh` 進行建置，該腳本現在會：

- 設定穩定的偵錯套件識別碼：`ai.openclaw.mac.debug`。
- 呼叫 `scripts/codesign-mac-app.sh` 簽署主要二進位檔與 App Bundle，以便 macOS 將每次重建視為相同的已簽署套件，進而保留 TCC 權限。
- 預設使用 `CODESIGN_TIMESTAMP=auto` 以啟用受信任的時間戳記。
- 將建置 Metadata 注入 `Info.plist`：`OpenClawBuildTimestamp` (UTC) 與 `OpenClawGitCommit` (Git 短雜湊)。
- 從環境變數讀取 `SIGN_IDENTITY`。建議將 `export SIGN_IDENTITY="Apple Development: Your Name (TEAMID)"` 加入您的 Shell 設定檔。
- **臨機操作簽署 (Ad-hoc signing)** 需要透過 `ALLOW_ADHOC_SIGNING=1` 或 `SIGN_IDENTITY="-"` 明確啟用（不建議用於權限測試）。

## 用法

```bash
# 從儲存庫根目錄執行
scripts/package-mac-app.sh (自動選擇身分)
SIGN_IDENTITY="Developer ID Application: Your Name" scripts/package-mac-app.sh (使用正式憑證)
ALLOW_ADHOC_SIGNING=1 scripts/package-mac-app.sh (臨機操作簽署，權限不會保留)
```

### 臨機操作簽署注意事項
使用 `SIGN_IDENTITY="-"` 簽署時，腳本會自動停用 **強化執行階段 (Hardened Runtime)**。這是必要的，以防止 App 在載入具有不同 Team ID 的內嵌框架（如 Sparkle）時發生崩潰。

## 為什麼要簽署？
macOS 的 TCC 權限與 Bundle ID 及代碼簽署掛鉤。未簽署且每次建置產生不同 UUID 的偵錯版本會導致 macOS 在每次重建後忘記已授予的權限。透過簽署二進位檔並保持固定的路徑 (`dist/OpenClaw.app`)，可以確保權限在建置間得以保留。
