---
summary: "網頁搜尋 (web_search) 的 Brave Search API 設定說明"
read_when:
  - 您想要在網頁搜尋中使用 Brave Search 時
  - 您需要 BRAVE_API_KEY 或方案細節時
title: "Brave Search"
---

> 此文件為 [English Version](/brave-search) 的繁體中文版本。

# Brave Search API

OpenClaw 使用 Brave Search 作為 `web_search` (網頁搜尋) 的預設提供者。

## 獲取 API 密鑰

1. 在 [https://brave.com/search/api/](https://brave.com/search/api/) 建立 Brave Search API 帳號。
2. 在儀表板中選擇 **Data for Search** 方案並產生 API 密鑰。
3. 將密鑰儲存在組態檔案中（建議方式），或在閘道器 (Gateway) 環境中設定 `BRAVE_API_KEY`。

## 組態範例

```json5
{
  tools: {
    web: {
      search: {
        provider: "brave",
        apiKey: "在此填入_BRAVE_API_KEY",
        maxResults: 5,
        timeoutSeconds: 30,
      },
    },
  },
}
```

## 注意事項

- **Data for AI** 方案與 `web_search` **不** 相容。
- Brave 提供免費版以及付費方案；目前的限制請參閱 Brave API 門戶網站。

完整的網頁搜尋組態請參閱 [網頁工具 (Web tools)](/tools/web_zh_TW)。
