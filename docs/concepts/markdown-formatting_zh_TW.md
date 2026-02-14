---
summary: "傳出頻道的 Markdown 格式化管線說明"
read_when:
  - 更改傳出頻道的 Markdown 格式化或切分邏輯時
  - 新增頻道格式化程式或樣式映射時
  - 偵錯跨頻道的格式化迴歸問題時
title: "Markdown 格式化"
---

> 此文件為 [English Version](/concepts/markdown-formatting_zh_TW) 的繁體中文版本。

# Markdown 格式化 (Markdown formatting)

OpenClaw 透過將傳出的 Markdown 轉換為 **中間表示層 (Intermediate Representation, IR)** 來進行格式化。IR 保留了原始文字並帶有樣式與連結區間，這確保了跨頻道的切分 (Chunking) 與渲染能保持一致。

## 核心目標

- **一致性**：單次剖析，多個渲染器。
- **安全切分**：在渲染前切分文字，確保行內格式（如粗體）不會因為切分而中斷。
- **頻道適配**：將同一個 IR 映射至 Slack 的 mrkdwn、Telegram 的 HTML 或 Signal 的樣式區間。

## 執行管線

1. **Markdown 轉 IR**：產生純文字加上樣式區間（粗體/斜體/刪除線/程式碼/雷幕）與連結。
2. **IR 切分 (Format-first)**：在渲染前針對 IR 文字進行切分。樣式區間會按切分塊進行分割，確保每塊內容都能正確開啟並關閉樣式。
3. **分頻道渲染**：
   - **Slack**：轉換為 mrkdwn 權杖。
   - **Telegram**：轉換為 HTML 標籤。
   - **Signal**：轉換為純文字加上 `text-style` 區間。

## 表格處理

由於各通訊軟體對表格的支援不一，可透過 `markdown.tables` 控制轉換方式：
- `code`：將表格渲染為程式碼區塊（多數頻道的預設值）。
- `bullets`：將每行轉換為列點（Signal 與 WhatsApp 的預設值）。
- `off`：停用表格轉換，直接傳送原始 Markdown 語法。

## 連結原則
- **Slack**：`[標籤](網址)` → `<網址|標籤>`。
- **Telegram**：使用 HTML 的 `<a href>` 標籤。
- **Signal**：`標籤 (網址)`。

## 開發者注意
- **轉義字元**：Slack 的角括號、Telegram 的 HTML 特殊字元必須妥善轉義。
- **UTF-16 偏移量**：Signal 的樣式區間依賴 UTF-16 偏移量，請勿使用字元碼偏移量。
