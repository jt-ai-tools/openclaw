---
summary: "網頁搜尋 (web_search) 的 Perplexity Sonar 設定說明"
read_when:
  - 您想要在網頁搜尋中使用 Perplexity Sonar 時
  - 您需要 PERPLEXITY_API_KEY 或 OpenRouter 設定時
title: "Perplexity Sonar"
---

> 此文件為 [English Version](/perplexity_zh_TW) 的繁體中文版本。

# Perplexity Sonar

OpenClaw 可以使用 Perplexity Sonar 作為 `web_search` (網頁搜尋) 工具。您可以透過 Perplexity 的直接 API 或透過 OpenRouter 進行連接。

## API 選項

### Perplexity (直接連接)

- 基礎 URL：[https://api.perplexity.ai](https://api.perplexity.ai)
- 環境變數：`PERPLEXITY_API_KEY`

### OpenRouter (替代方案)

- 基礎 URL：[https://openrouter.ai/api/v1](https://openrouter.ai/api/v1)
- 環境變數：`OPENROUTER_API_KEY`
- 支援預付 / 加密貨幣額度。

## 組態範例

```json5
{
  tools: {
    web: {
      search: {
        provider: "perplexity",
        perplexity: {
          apiKey: "pplx-...",
          baseUrl: "https://api.perplexity.ai",
          model: "perplexity/sonar-pro",
        },
      },
    },
  },
}
```

## 從 Brave 切換至 Perplexity

```json5
{
  tools: {
    web: {
      search: {
        provider: "perplexity",
        perplexity: {
          apiKey: "pplx-...",
          baseUrl: "https://api.perplexity.ai",
        },
      },
    },
  },
}
```

如果同時設定了 `PERPLEXITY_API_KEY` 與 `OPENROUTER_API_KEY`，請設定 `tools.web.search.perplexity.baseUrl`（或 `tools.web.search.perplexity.apiKey`）以進行區分。

如果未設定基礎 URL，OpenClaw 會根據 API 密鑰來源選擇預設值：

- `PERPLEXITY_API_KEY` 或 `pplx-...` → 直接連接 Perplexity (`https://api.perplexity.ai`)
- `OPENROUTER_API_KEY` 或 `sk-or-...` → OpenRouter (`https://openrouter.ai/api/v1`)
- 未知密鑰格式 → OpenRouter（安全備援方案）

## 模型

- `perplexity/sonar` — 具備網頁搜尋能力的快速問答。
- `perplexity/sonar-pro`（預設） — 多步驟推理 + 網頁搜尋。
- `perplexity/sonar-reasoning-pro` — 深度研究。

完整的網頁搜尋組態請參閱 [網頁工具 (Web tools)](/tools/web_zh_TW)。
