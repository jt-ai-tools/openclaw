---
summary: "透過 WKWebView 與自訂 URL 語法嵌入的代理人受控畫布面板說明"
read_when:
  - 實作 macOS 畫布 (Canvas) 面板時
  - 為視覺工作區增加代理人控制項時
  - 偵錯 WKWebView 畫布載入問題時
title: "畫布 (Canvas)"
---

> 此文件為 [English Version](/platforms/mac/canvas_zh_TW) 的繁體中文版本。

# 畫布 (Canvas - macOS App)

macOS App 使用 `WKWebView` 嵌入了一個由代理人控制的 **畫布面板**。它是一個用於 HTML/CSS/JS、A2UI 以及小型互動式 UI 介面的輕量級視覺工作區。

## 畫布存放位置

畫布狀態儲存於 Application Support 目錄下：
`~/Library/Application Support/OpenClaw/canvas/<工作階段>/...`

畫布面板透過 **自訂 URL 語法** 提供這些檔案的存取：
`openclaw-canvas://<工作階段>/<路徑>`

範例：
`openclaw-canvas://main/` → 對應至 `<畫布根目錄>/main/index.html`。

若根目錄下不存在 `index.html`，App 會顯示一個 **內建的腳手架頁面**。

## 面板行為

- 無邊框、可縮放的面板，錨定於選單列附近。
- 會記住每個工作階段的尺寸與位置。
- 當本地畫布檔案變更時會自動重新整理。
- 畫布功能可在「設定」→ **Allow Canvas** 中停用。

## 代理人 API 介面

畫布透過 **閘道器 WebSocket** 公開，代理人可以執行以下動作：
- 顯示/隱藏面板。
- 導覽至路徑或 URL。
- 執行 JavaScript。
- 擷取快照圖片。

## 畫布中的 A2UI

A2UI 由閘道器畫布主機託管，並在畫布面板中進行渲染。
目前接受 **A2UI v0.8** 的伺服器至客戶端訊息：
- `beginRendering`
- `surfaceUpdate`
- `dataModelUpdate`
- `deleteSurface`

## 安全性注意

- 畫布語法會阻擋目錄遍歷 (Directory traversal)；檔案必須存放在工作階段根目錄下。
- 本地畫布內容使用自訂語法，無需本地端伺服器即可運作。
