---
summary: "OpenClaw 如何建構提示詞上下文並回報 Token 用量與成本說明"
read_when:
  - 解釋 Token 用量、成本或上下文視窗時
  - 偵錯上下文增長或壓縮行為時
title: "Token 使用與成本"
---

> 此文件為 [English Version](/reference/token-use_zh_TW) 的繁體中文版本。

# Token 使用與成本 (Token use & costs)

OpenClaw 追蹤的是 **Tokens**，而非字元數。Tokens 的計算方式依模型而異，但大多數 OpenAI 風格的模型對於英文文字平均約為每 Token 4 個字元。

## 系統提示詞的組成

OpenClaw 在每次執行時會組裝其專屬的系統提示詞 (System Prompt)，包含：
- 工具列表與簡短描述。
- 技能列表（僅包含詮釋資料；指令內容僅在 `read` 時加載）。
- 工作區種子檔案 (`AGENTS.md`, `SOUL.md`, `IDENTITY.md`, `USER.md` 等)。
- 時間（UTC 與使用者時區）。
- 執行時期元數據（主機、OS、模型、推理等級）。

## 上下文視窗包含哪些內容

模型接收到的所有內容都會計入上下文限制：
- 系統提示詞。
- 對談歷史（使用者與助理的訊息）。
- 工具呼叫與工具執行結果。
- 附件與轉錄內容（圖片、音訊、檔案）。
- 壓縮摘要 (Compaction summaries) 與修剪產出物。

## 如何查看目前的 Token 用量

在聊天中執行：
- `/status`：顯示帶有表情符號的狀態卡，包含工作階段模型、上下文用量以及 **估計成本**（僅限 API 密鑰驗證）。
- `/usage off|tokens|full`：為每則回覆附加 **用量註腳**。
- `/usage cost`：顯示來自 OpenClaw 工作階段紀錄的本地成本摘要。

## 成本估算

成本是根據您的模型定價組態估算的：
`models.providers.<provider>.models[].cost`
數值以 **每百萬 (1M) Tokens 的美元金額** 表示（包含 input, output, cacheRead, cacheWrite）。

## 減少 Token 壓力的建議

- 使用 `/compact` 壓縮長對話的工作階段。
- 保持技能描述簡潔。
- 對於瑣碎、探索性的任務，優先選用較小的模型。
- 利用快取機制：設定心跳 (Heartbeat) 以保持快取「溫熱 (Warm)」，避免重複支付快取寫入成本。
