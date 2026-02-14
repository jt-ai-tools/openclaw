---
summary: "macOS App 如何回報閘道器與 Baileys 的健康狀態說明"
read_when:
  - 偵錯 Mac App 健康指示燈時
title: "健康檢查"
---

> 此文件為 [English Version](/platforms/mac/health_zh_TW) 的繁體中文版本。

# macOS 上的健康檢查 (Health Checks)

如何從選單列 App 查看連結的頻道是否健康。

## 選單列圖示

- 狀態圓點反映了連線健康度：
  - **綠色**：已連結且通訊端已開啟。
  - **橘色**：正在連線或重試。
  - **紅色**：已登出或探針檢查失敗。
- 次要資訊列會顯示「已連結 · 驗證 12m」或顯示失敗原因。
- 點擊選單中的「執行健康檢查 (Run Health Check)」可觸發即時探針偵測。

## 設定介面

- **一般 (General)** 設定分頁包含健康狀態卡，顯示：連結驗證時長、工作階段存儲路徑、上次檢查時間、最後一次錯誤碼等。
- **頻道 (Channels)** 分頁呈現 WhatsApp/Telegram 的頻道狀態與控制項（QR Code 登入、登出、探針偵測、最後連線失敗原因）。

## 探針運作原理

- App 每隔約 60 秒（以及按需求）透過 `ShellExecutor` 執行 `openclaw health --json`。探針會載入憑證並回報狀態，不會發送實際訊息。
- 系統會分別快取最後一次正常的快照與最後一次錯誤，以避免介面閃爍。

## 疑難排解

- 您仍可使用 [閘道器健康 (Gateway health)](/gateway/health_zh_TW) 中的 CLI 流程執行 `openclaw status --deep` 或 `openclaw health --json` 進行診斷。
