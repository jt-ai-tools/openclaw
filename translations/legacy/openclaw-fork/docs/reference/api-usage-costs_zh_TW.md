---
summary: "審計哪些功能會消耗費用、使用了哪些密鑰，以及如何查看用量說明"
read_when:
  - 您想要了解哪些功能可能呼叫付費 API 時
  - 您需要審計密鑰、成本與用量可見性時
title: "API 用量與成本"
---

> 此文件為 [English Version](/reference/api-usage-costs_zh_TW) 的繁體中文版本。

# API 用量與成本 (API usage & costs)

本文件列出了會 **呼叫 API 密鑰** 的功能及其成本顯示位置。主要聚焦於 OpenClaw 中會產生供應商用量或付費 API 呼叫的功能。

## 成本顯示位置

- **工作階段成本快照**：在聊天中使用 `/status` 指令可查看目前模型、上下文用量，以及最後一則回應的 **估計成本**（僅限使用 API 密鑰驗證時）。
- **每則訊息成本註腳**：使用 `/usage full` 指令可為每則回覆附加用量資訊。
- **CLI 用量窗口**：`openclaw status --usage` 顯示供應商的配額快照（並非每則訊息的成本）。

詳情請參閱 [Token 使用與成本](/reference/token-use_zh_TW)。

## 會產生費用的功能列表

### 1) 核心模型回應 (聊天 + 工具)
這是最主要的用量來源。每次回覆或工具呼叫都會使用目前的模型供應商（如 OpenAI, Anthropic 等）。

### 2) 多媒體理解 (音訊/圖片/影片)
傳入的多媒體會在回覆前進行摘要或轉錄：
- **音訊**：OpenAI / Groq / Deepgram。
- **圖片**：OpenAI / Anthropic / Google。
- **影片**：Google。

### 3) 記憶嵌入與語義搜尋
當配置雲端供應商時，記憶搜尋會呼叫 **嵌入 (Embedding) API**：
- 支援供應商：OpenAI, Gemini, Voyage。
- 您可以選擇 `provider = "local"` 以保持本地化（無 API 費用）。

### 4) 網頁搜尋工具 (Brave / Perplexity)
`web_search` 使用 API 密鑰，可能會產生費用：
- **Brave Search API**：提供每月 2,000 次免費請求（需綁定信用卡驗證）。
- **Perplexity** (透過 OpenRouter)。

### 5) 網頁獲取工具 (Firecrawl)
當配置了 `FIRECRAWL_API_KEY` 時，`web_fetch` 會呼叫 Firecrawl 作為備援方案。

### 6) 語音模式 (Talk mode)
當配置了 ElevenLabs 時，語音模式會呼叫其 API。

### 7) 技能 (Skills)
某些第三方技能可能會在 `skills.entries.<名稱>.apiKey` 中儲存密鑰，並呼叫外部付費 API。
