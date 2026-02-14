---
summary: "配置 Moonshot K2 與 Kimi Coding（獨立提供者與密鑰）"
read_when:
  - 您想要設定 Moonshot K2 (Moonshot 開放平台) 或 Kimi Coding 時
  - 您需要了解兩者不同的端點、密鑰與模型參考時
  - 您想要直接複製任一提供者的組態範例時
title: "Moonshot AI"
---

> 此文件為 [English Version](/providers/moonshot_zh_TW) 的繁體中文版本。

# Moonshot AI (Kimi)

Moonshot 提供與 OpenAI 相容端點的 Kimi API。配置此提供者並將預設模型設定為 `moonshot/kimi-k2.5`，或是使用 `kimi-coding/k2p5` 來使用 Kimi Coding。

目前的 Kimi K2 模型 ID 列表：

- `kimi-k2.5`
- `kimi-k2-0905-preview`
- `kimi-k2-turbo-preview`
- `kimi-k2-thinking`
- `kimi-k2-thinking-turbo`

```bash
openclaw onboard --auth-choice moonshot-api-key
```

使用 Kimi Coding：

```bash
openclaw onboard --auth-choice kimi-code-api-key
```

**注意**：Moonshot 與 Kimi Coding 是兩個獨立的提供者。其 API 密鑰不互通、端點不同，且模型參考格式也不同（Moonshot 使用 `moonshot/...`，Kimi Coding 使用 `kimi-coding/...`）。

## 組態片段 (Moonshot API)

```json5
{
  env: { MOONSHOT_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: { primary: "moonshot/kimi-k2.5" },
      models: {
        "moonshot/kimi-k2.5": { alias: "Kimi K2.5" },
        "moonshot/kimi-k2-0905-preview": { alias: "Kimi K2" },
        "moonshot/kimi-k2-turbo-preview": { alias: "Kimi K2 Turbo" },
        "moonshot/kimi-k2-thinking": { alias: "Kimi K2 Thinking" },
        "moonshot/kimi-k2-thinking-turbo": { alias: "Kimi K2 Thinking Turbo" },
      },
    },
  },
  models: {
    mode: "merge",
    providers: {
      moonshot: {
        baseUrl: "https://api.moonshot.ai/v1",
        apiKey: "${MOONSHOT_API_KEY}",
        api: "openai-completions",
        models: [
          {
            id: "kimi-k2.5",
            name: "Kimi K2.5",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 256000,
            maxTokens: 8192,
          },
          // ... 其它模型配置相同
        ],
      },
    },
  },
}
```

## Kimi Coding 組態

```json5
{
  env: { KIMI_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: { primary: "kimi-coding/k2p5" },
      models: {
        "kimi-coding/k2p5": { alias: "Kimi K2.5" },
      },
    },
  },
}
```

## 注意事項

- Moonshot 模型參考使用 `moonshot/<modelId>`。Kimi Coding 使用 `kimi-coding/<modelId>`。
- 國際端點請使用 `https://api.moonshot.ai/v1`，中國端點請使用 `https://api.moonshot.cn/v1`。
