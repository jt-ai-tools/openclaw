---
summary: "網頁搜尋與獲取工具 (包含 Brave Search API 與 Perplexity)"
read_when:
  - 您想要啟用 web_search 或 web_fetch 時
  - 您需要設定 Brave Search API 密鑰時
  - 您想要使用 Perplexity Sonar 進行網頁搜尋時
title: "網頁工具"
---

> 此文件為 [English Version](/tools/web_zh_TW) 的繁體中文版本。

# 網頁工具 (Web tools)

OpenClaw 內建兩款輕量級網頁工具：

- `web_search` — 透過 Brave Search API (預設) 或 Perplexity Sonar 搜尋網頁。
- `web_fetch` — HTTP 獲取 + 可讀內容擷取 (HTML 轉為 Markdown/純文字)。

這些工具 **不是** 瀏覽器自動化。對於需要執行大量 JavaScript 或登入的網站，請使用 [瀏覽器工具 (Browser tool)](/tools/browser_zh_TW)。

## 工作原理

- `web_search` 會呼叫您配置的提供者並回傳結果。
  - **Brave** (預設)：回傳結構化結果（標題、URL、摘要）。
  - **Perplexity**：回傳由 AI 彙整、帶有引用的實時搜尋答案。
- `web_fetch` 執行純 HTTP GET 並擷取主要內容（正文），**不會** 執行 JavaScript。
- 搜尋結果會根據查詢內容快取 15 分鐘（可自訂）。

## 選擇搜尋提供者

| 提供者              | 優點                                         | 缺點                                     | API 密鑰                                     |
| ------------------- | -------------------------------------------- | ---------------------------------------- | -------------------------------------------- |
| **Brave** (預設)    | 快速、結構化結果、提供免費額度               | 傳統搜尋結果樣式                         | `BRAVE_API_KEY`                              |
| **Perplexity**      | AI 彙整答案、帶有引用、實時性               | 需要 Perplexity 或 OpenRouter 存取權限   | `OPENROUTER_API_KEY` 或 `PERPLEXITY_API_KEY` |

## 獲取 Brave API 密鑰

1. 在 [https://brave.com/search/api/](https://brave.com/search/api/) 建立帳號。
2. 在儀表板中選擇 **Data for Search** 方案（注意：不是 “Data for AI”）並產生 API 密鑰。
3. 執行 `openclaw configure --section web` 將密鑰儲存於組態中。

## 使用 Perplexity (直接連接或透過 OpenRouter)

Perplexity Sonar 模型內建網頁搜尋能力。您可以透過 OpenRouter 使用它們（支援加密貨幣預付，無需信用卡）。

### 設定 Perplexity 搜尋

```json5
{
  tools: {
    web: {
      search: {
        enabled: true,
        provider: "perplexity",
        perplexity: {
          apiKey: "在此填入_密鑰",
          baseUrl: "https://openrouter.ai/api/v1",
          model: "perplexity/sonar-pro",
        },
      },
    },
  },
}
```

## `web_search` 工具參數

- `query` (必填)
- `count` (1–10；預設從組態讀取)
- `freshness` (選填，僅限 Brave)：依發現時間過濾 (`pd` 過去一天, `pw` 過去一週, `pm` 過去一月, `py` 過去一年)。

## `web_fetch` 工具參數

- `url` (必填，僅限 http/https)
- `extractMode` (`markdown` | `text`)
- `maxChars` (截斷長頁面)

**注意事項：**
- `web_fetch` 會優先使用 Readability 擷取正文，若失敗則回退至 Firecrawl (若有配置)。
- Firecrawl 請求使用繞過機器人偵測模式。
- `maxChars` 的硬性上限由 `tools.web.fetch.maxCharsCap` 定義（預設 50,000 字元）。
