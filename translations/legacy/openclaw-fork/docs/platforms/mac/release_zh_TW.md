---
summary: "OpenClaw macOS 發佈檢查清單（Sparkle 饋送、打包與簽署）"
read_when:
  - 執行或驗證 OpenClaw macOS 發佈流程時
  - 更新 Sparkle appcast 或饋送資產時
title: "macOS 發佈"
---

> 此文件為 [English Version](/platforms/mac/release_zh_TW) 的繁體中文版本。

# OpenClaw macOS 發佈流程 (Sparkle)

本應用程式現在支援 Sparkle 自動更新。發佈版本必須經過 Developer ID 簽署、壓縮為 Zip，並發佈帶有簽署項目的 Appcast。

## 事前準備

- 已安裝 **Developer ID Application** 憑證。
- 已在環境變數中設定 Sparkle 私鑰路徑 `SPARKLE_PRIVATE_KEY_FILE`。
- 若要進行 Gatekeeper 安全的 DMG/Zip 發佈，需要公證憑證（Keychain 設定檔或 API 密鑰）。
  - 我們使用名為 `openclaw-notary` 的 Keychain 設定檔。
- `pnpm` 依賴項已安裝。

## 建置與打包

**注意事項：**
- `APP_BUILD` 對應 `CFBundleVersion`；必須為數值且遞增（不可包含 `-beta`）。
- 預設為目前架構。若要發佈通用版本 (Universal)，請設定 `BUILD_ARCHS="arm64 x86_64"`。
- 使用 `scripts/package-mac-dist.sh` 產生發佈資產。

```bash
# 從儲存庫根目錄執行
BUNDLE_ID=bot.molt.mac 
APP_VERSION=2026.2.13 
APP_BUILD="$(git rev-list --count HEAD)" 
BUILD_CONFIG=release 
SIGN_IDENTITY="Developer ID Application: <開發者名稱> (<TEAMID>)" 
scripts/package-mac-app.sh

# 壓縮以供發佈 (保留資源分叉以支援 Sparkle 增量更新)
ditto -c -k --sequesterRsrc --keepParent dist/OpenClaw.app dist/OpenClaw-2026.2.13.zip

# 選用：同時建置精美的 DMG 檔
scripts/create-dmg.sh dist/OpenClaw.app dist/OpenClaw-2026.2.13.dmg
```

## Appcast 項目

使用發佈說明產生器，讓 Sparkle 能渲染格式化的 HTML 說明：

```bash
SPARKLE_PRIVATE_KEY_FILE=/路徑/到/私鑰 scripts/make_appcast.sh dist/OpenClaw-2026.2.13.zip https://raw.githubusercontent.com/openclaw/openclaw/main/appcast.xml
```

此腳本會從 `CHANGELOG.md` 產生 HTML 發佈說明並嵌入至 Appcast 項目中。發佈時，請將更新後的 `appcast.xml` 與發佈資產一併提交。

## 發佈與驗證

- 將 Zip 檔案上傳至對應標籤的 GitHub Release。
- 確保 Appcast URL 能正確存取。
- **自我檢查**：
  - `curl -I <appcast URL>` 回傳 200。
  - 使用舊版本執行「檢查更新…」，確認 Sparkle 能乾淨地安裝新版本。
