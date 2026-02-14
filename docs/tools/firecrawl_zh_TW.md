---
summary: "web_fetch 的 Firecrawl 備援方案（繞過機器人偵測 + 快取擷取）"
read_when:
  - 您想要使用基於 Firecrawl 的網頁內容擷取時
  - 您需要 Firecrawl API 密鑰時
  - 您需要為 web_fetch 提供繞過機器人偵測的擷取功能時
title: "Firecrawl"
---

> 此文件為 [English Version](/tools/firecrawl_zh_TW) 的繁體中文版本。

# Firecrawl

OpenClaw 可以使用 **Firecrawl** 作為 `web_fetch` (網頁獲取) 工具的備援擷取器。它是一項代管的內容擷取服務，支援繞過機器人偵測 (Bot circumvention) 與快取功能，對於需要執行大量 JavaScript 或封鎖一般 HTTP 獲取的網站非常有用。

## 獲取 API 密鑰

1. 在 Firecrawl 官方網站建立帳號並產生 API 密鑰。
2. 將密鑰儲存於組態檔案中，或在閘道器環境中設定 `FIRECRAWL_API_KEY`。

## 配置 Firecrawl

```json5
{
  tools: {
    web: {
      fetch: {
        firecrawl: {
          apiKey: "在此填入_FIRECRAWL_API_KEY",
          baseUrl: "https://api.firecrawl.dev",
          onlyMainContent: true,
          maxAgeMs: 172800000, // 快取保留時間（毫秒），預設 2 天
          timeoutSeconds: 60,
        },
      },
    },
  },
}
```

## 隱身 / 繞過機器人偵測 (Bot circumvention)

Firecrawl 提供代理模式參數以繞過機器人偵測（`basic`, `stealth` 或 `auto`）。OpenClaw 在進行 Firecrawl 請求時，一律會使用 `proxy: "auto"` 並搭配 `storeInCache: true`。使用 `auto` 模式時，若基本擷取失敗，會自動嘗試使用隱身代理重試。

## `web_fetch` 如何使用 Firecrawl

`web_fetch` 的內容擷取順序如下：
1. **Readability**（本地端處理）。
2. **Firecrawl**（若已配置）。
3. **基本 HTML 清理**（最後的備援方案）。

完整的網頁工具設定請參閱 [網頁工具 (Web tools)](/tools/web_zh_TW)。
