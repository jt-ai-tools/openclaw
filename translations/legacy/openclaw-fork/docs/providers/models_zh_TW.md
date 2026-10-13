---
summary: "OpenClaw 支援的模型提供者 (LLMs) 快速入門"
read_when:
  - 您想要選擇模型提供者時
  - 您需要 LLM 驗證與模型選擇的快速設定範例時
title: "模型提供者快速入門"
---

> 此文件為 [English Version](/providers/models_zh_TW) 的繁體中文版本。

# 模型提供者 (Model Providers)

OpenClaw 支援多種 LLM 提供者。挑選一個提供者，完成驗證，然後將預設模型設定為 `提供者/模型` 格式。

## 亮點介紹：Venice (Venice AI)

Venice 是我們推薦的 Venice AI 設定，適用於隱私優先的推論，並可選擇在處理最艱巨任務時使用 Opus。

- 預設：`venice/llama-3.3-70b`
- 最佳平衡：`venice/claude-opus-45`（Opus 仍是目前最強大的模型）

請參閱 [Venice AI](/providers/venice_zh_TW)。

## 快速開始（兩步驟）

1. 與提供者進行驗證（通常透過 `openclaw onboard`）。
2. 設定預設模型：

```json5
{
  agents: { defaults: { model: { primary: "anthropic/claude-opus-4-6" } } },
}
```

## 支援的提供者（初步集合）

- [OpenAI (API + Codex)](/providers/openai_zh_TW)
- [Anthropic (API + Claude Code CLI)](/providers/anthropic_zh_TW)
- [OpenRouter](/providers/openrouter_zh_TW)
- [Vercel AI 閘道器](/providers/vercel-ai-gateway_zh_TW)
- [Cloudflare AI 閘道器](/providers/cloudflare-ai-gateway_zh_TW)
- [Moonshot AI (Kimi + Kimi Coding)](/providers/moonshot_zh_TW)
- [合成 (Synthetic)](/providers/synthetic_zh_TW)
- [OpenCode Zen](/providers/opencode_zh_TW)
- [Z.AI](/providers/zai_zh_TW)
- [GLM 模型](/providers/glm_zh_TW)
- [MiniMax](/providers/minimax_zh_TW)
- [Venice (Venice AI)](/providers/venice_zh_TW)
- [Amazon Bedrock](/providers/bedrock_zh_TW)
- [百度千帆 (Qianfan)](/providers/qianfan_zh_TW)

完整的提供者型錄（包含 xAI, Groq, Mistral 等）與進階組態，請參閱 [模型提供者概念](/concepts/model-providers_zh_TW)。
