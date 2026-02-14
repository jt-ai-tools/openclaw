---
summary: "macOS 權限持久化 (TCC) 與簽署要求說明"
read_when:
  - 偵錯缺失或卡住的 macOS 權限提示時
  - 打包或簽署 macOS App 時
  - 更改 Bundle ID 或 App 安裝路徑時
title: "macOS 權限"
---

> 此文件為 [English Version](/platforms/mac/permissions_zh_TW) 的繁體中文版本。

# macOS 權限 (TCC)

macOS 的權限授予機制 (TCC) 非常敏感。權限是與 App 的 **代碼簽署 (Code signature)**、**套件識別碼 (Bundle identifier)** 以及 **磁碟路徑** 關聯的。若其中任何一項發生變動，macOS 會將其視為全新 App，並可能隱藏或丟失權限提示。

## 穩定權限的要求

- **固定路徑**：從固定的位置執行 App（對 OpenClaw 而言為 `dist/OpenClaw.app`）。
- **固定套件識別碼 (Bundle ID)**：更改 Bundle ID 會建立全新的權限身分。
- **已簽署的 App**：未簽署或僅使用臨機操作簽署 (Ad-hoc signed) 的建置版本無法持久化權限。
- **一致的簽署身分**：使用真實的 Apple Development 或 Developer ID 憑證，確保簽署在重新建置後維持穩定。

**臨機操作簽署** 會在每次建置時產生新身分。macOS 會忘記先前的權限設定，且提示視窗可能會完全消失。

## 權限提示消失時的修復清單

1. 退出 App。
2. 在「系統設定」->「隱私權與安全性」中移除該 App 的現有項目。
3. 從相同路徑重新啟動 App 並重新授予權限。
4. 若提示仍未出現，使用 `tccutil` 重置 TCC 條目並重試。
5. 部分權限（如螢幕錄製）可能需要重啟 macOS 才能恢復。

重置範例：
```bash
sudo tccutil reset Accessibility bot.molt.mac (輔助使用)
sudo tccutil reset ScreenCapture bot.molt.mac (螢幕錄製)
sudo tccutil reset AppleEvents (AppleScript 自動化)
```

## 檔案與資料夾權限 (桌面/文件/下載)

macOS 也會對終端機或背景程序存取「桌面」、「文件」與「下載」資料夾進行限制。若檔案讀取或目錄列表卡住，請確保對執行該操作的程序上下文（如 Terminal, iTerm 或 LaunchAgent）授予存取權。

**替代方案**：將檔案移動至 OpenClaw 工作區 (`~/.openclaw/workspace`) 以避開逐個資料夾的權限要求。
