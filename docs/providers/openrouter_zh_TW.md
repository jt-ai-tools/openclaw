---
summary: "在 OpenClaw 中透過 OpenRouter 的統一 API 存取多種模型"
read_when:
  - 您想要使用單一 API 密鑰存取多種 LLM 時
  - 您想要在 OpenClaw 中透過 OpenRouter 執行模型時
title: "OpenRouter"
---

> 此文件為 [English Version](/providers/openrouter_zh_TW) 的繁體中文版本。

# OpenRouter

OpenRouter 提供一個 **統一的 API**，將請求路由至位於單一端點與 API 密鑰之後的多種模型。它與 OpenAI 相容，因此大多數 OpenAI SDK 僅需切換基礎 URL 即可運作。

## CLI 設定

```bash
openclaw onboard --auth-choice apiKey --token-provider openrouter --token "$OPENROUTER_API_KEY"
```

## 組態片段

```json5
{
  env: { OPENROUTER_API_KEY: "sk-or-..." },
  agents: {
    defaults: {
      model: { primary: "openrouter/anthropic/claude-sonnet-4-5" },
    },
  },
}
```

## 注意事項

- 模型參考格式為 `openrouter/<提供者>/<模型>`。
- 更多模型/提供者選項，請參閱 [模型提供者概念](/concepts/model-providers_zh_TW)。
- OpenRouter 在底層會使用帶有您 API 密鑰的 Bearer 權杖。
