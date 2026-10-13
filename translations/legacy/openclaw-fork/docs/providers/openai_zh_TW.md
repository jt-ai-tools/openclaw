---
summary: "在 OpenClaw 中透過 API 密鑰或 Codex 訂閱使用 OpenAI"
read_when:
  - 您想要在 OpenClaw 中使用 OpenAI 模型時
  - 您想要使用 Codex 訂閱驗證而非 API 密鑰時
title: "OpenAI"
---

> 此文件為 [English Version](/providers/openai_zh_TW) 的繁體中文版本。

# OpenAI

OpenAI 為 GPT 模型提供開發者 API。Codex 支援透過 **ChatGPT 登入**（訂閱制存取）或 **API 密鑰登入**（按量計費存取）。Codex 雲端版必須使用 ChatGPT 登入。

## 選項 A：OpenAI API 密鑰 (OpenAI Platform)

**最適用於**：直接的 API 存取與按量計費。
從 OpenAI 儀表板獲取您的 API 密鑰。

### CLI 設定

```bash
openclaw onboard --auth-choice openai-api-key
# 或非互動式指令
openclaw onboard --openai-api-key "$OPENAI_API_KEY"
```

### 組態片段

```json5
{
  env: { OPENAI_API_KEY: "sk-..." },
  agents: { defaults: { model: { primary: "openai/gpt-5.1-codex" } } },
}
```

## 選項 B：OpenAI Code (Codex) 訂閱

**最適用於**：使用 ChatGPT/Codex 訂閱存取而非 API 密鑰。
Codex 雲端版需要 ChatGPT 登入，而 Codex CLI 則支援 ChatGPT 或 API 密鑰登入。

### CLI 設定 (Codex OAuth)

```bash
# 在引導精靈中執行 Codex OAuth
openclaw onboard --auth-choice openai-codex

# 或直接執行 OAuth 登入
openclaw models auth login --provider openai-codex
```

### 組態片段 (Codex 訂閱)

```json5
{
  agents: { defaults: { model: { primary: "openai-codex/gpt-5.3-codex" } } },
}
```

## 注意事項

- 模型參考一律使用 `提供者/模型` 格式（參閱 [模型概念](/concepts/models_zh_TW)）。
- 驗證詳情與重用規則請參閱 [OAuth 概念](/concepts/oauth_zh_TW)。
