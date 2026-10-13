---
summary: "整合的瀏覽器控制服務與動作指令說明"
read_when:
  - 增加由代理人控制的瀏覽器自動化功能時
  - 偵錯為何 OpenClaw 干擾到您個人的 Chrome 時
  - 在 macOS App 中實作瀏覽器設定與生命週期管理時
title: "瀏覽器 (OpenClaw 管理)"
---

> 此文件為 [English Version](/tools/browser_zh_TW) 的繁體中文版本。

# 瀏覽器 (OpenClaw-managed)

OpenClaw 可以執行一個代理人專用的 **Chrome/Brave/Edge/Chromium 設定檔**。它與您的個人瀏覽器完全隔離，並透過閘道器 (Gateway) 內部的本地控制服務進行管理。

## 概觀

- 可以將其視為一個 **僅限代理人使用的獨立瀏覽器**。
- `openclaw` 設定檔 **不會** 觸動您的個人瀏覽器資料。
- 代理人可以在安全的環境中執行 **開啟分頁、讀取網頁、點擊與輸入** 等操作。
- 預設的 `chrome` 設定檔會透過擴充功能中繼控制您的 **系統預設瀏覽器**；若需要隔離的環境，請切換至 `openclaw`。

## 功能特色

- 一個名為 **openclaw** 的獨立瀏覽器設定檔。
- 確定性的分頁控制（列表/開啟/聚焦/關閉）。
- 代理人動作（點擊/輸入/拖曳/選擇）、網頁快照 (Snapshots)、螢幕截圖與 PDF 匯出。
- 支援多設定檔（例如 `openclaw`, `work`, `remote`）。

這不是您的日常瀏覽器，而是一個用於代理人自動化與驗證的安全、隔離空間。

## 快速開始

```bash
openclaw browser --browser-profile openclaw status (檢查狀態)
openclaw browser --browser-profile openclaw start (啟動)
openclaw browser --browser-profile openclaw open https://example.com (開啟網址)
openclaw browser --browser-profile openclaw snapshot (獲取快照)
```

## 設定檔 (Profiles)：`openclaw` vs `chrome`

- `openclaw`：受控、隔離的瀏覽器（無需擴充功能）。
- `chrome`：擴充功能中繼，連接至您的 **系統瀏覽器**（需要安裝 OpenClaw 擴充功能）。

## 組態設定 (Configuration)

瀏覽器設定位於 `~/.openclaw/openclaw.json`。

```json5
{
  browser: {
    enabled: true, // 預設：true
    defaultProfile: "chrome",
    color: "#FF4500", // UI 顏色標記
    headless: false, // 是否使用無頭模式
    executablePath: "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    profiles: {
      openclaw: { cdpPort: 18800, color: "#FF4500" },
      work: { cdpPort: 18801, color: "#0066CC" },
    },
  },
}
```

## 本地 vs 遠端控制

- **本地控制 (預設)**：閘道器啟動本地控制服務並開啟瀏覽器。
- **遠端控制 (節點主機)**：在有安裝瀏覽器的機器上執行節點主機；閘道器會將動作代理至該節點。
- **遠端 CDP**：連接至遠端執行中的 Chromium 系列瀏覽器網址 (CDP URL)。

## 安全性

- 瀏覽器控制僅限本地環回 (Loopback) 存取；外部存取需透過閘道器驗證。
- 遠端 CDP URL 與權杖應視為秘密，建議使用環境變數。
- 由於 `evaluate` 動作會執行任意 JavaScript，若不需要請透過 `browser.evaluateEnabled=false` 停用。

## 快照與引用識別碼 (Snapshots & Refs)

OpenClaw 支援兩種「快照」樣式：

- **AI 快照 (數字引用)**：`openclaw browser snapshot` (預設)。
  - 輸出包含數字 ID 的文字快照。
  - 動作範例：`click 12`, `type 23 "hello"`。
- **角色快照 (如 `e12`)**：`openclaw browser snapshot --interactive`。
  - 輸出基於角色 (Role) 的列表/樹狀結構。
  - 動作範例：`click e12`。

**引用標籤行為：**
- 引用 ID 在 **導覽後會失效**；若失敗，請重新執行 `snapshot` 獲取最新 ID。

## 代理人工具與控制原理

代理人會獲得一個 `browser` 工具，包含以下動作：
- `snapshot`：回傳穩定的 UI 樹狀結構（AI 或 ARIA）。
- `act`：使用快照中的 `ref` ID 執行點擊/輸入/拖曳/選擇。
- `screenshot`：擷取畫面像素。

這種設計使代理人能具備確定性的行為，避免使用脆弱的 CSS 選擇器。
