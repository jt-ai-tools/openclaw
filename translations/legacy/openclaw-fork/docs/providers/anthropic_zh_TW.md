---
summary: "在 OpenClaw 中透過 API 密鑰或 setup-token 使用 Anthropic Claude"
read_when:
  - 您想要在 OpenClaw 中使用 Anthropic 模型時
  - 您想要使用 setup-token 而非 API 密鑰時
title: "Anthropic"
---

> 此文件為 [English Version](/providers/anthropic_zh_TW) 的繁體中文版本。

# Anthropic (Claude)

Anthropic 開發了 **Claude** 模型家族，並透過 API 提供存取。在 OpenClaw 中，您可以使用 API 密鑰或 **setup-token** 進行驗證。

## 選項 A：Anthropic API 密鑰

**最適用於**：標準的 API 存取與按量計費。
在 Anthropic 主控台建立您的 API 密鑰。

### CLI 設定

```bash
openclaw onboard
# 選擇：Anthropic API key

# 或非互動式指令
openclaw onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
```

### 組態片段

```json5
{
  env: { ANTHROPIC_API_KEY: "sk-ant-..." },
  agents: { defaults: { model: { primary: "anthropic/claude-opus-4-6" } } },
}
```

## 提示詞快取 (Anthropic API)

OpenClaw 支援 Anthropic 的提示詞快取 (Prompt caching) 功能。此功能 **僅限 API 使用**；訂閱制驗證不支援快取設定。

### 配置方式

在您的模型組態中使用 `cacheRetention` 參數：

| 數值    | 快取時長       | 說明                               |
| ------- | -------------- | ---------------------------------- |
| `none`  | 不快取         | 停用提示詞快取                     |
| `short` | 5 分鐘         | API 密鑰驗證的預設值               |
| `long`  | 1 小時         | 延長快取（需要 Beta 旗標）         |

```json5
{
  agents: {
    defaults: {
      models: {
        "anthropic/claude-opus-4-6": {
          params: { cacheRetention: "long" },
        },
      },
    },
  },
}
```

### 預設行為

使用 Anthropic API 密鑰驗證時，OpenClaw 會自動為所有 Anthropic 模型套用 `cacheRetention: "short"`（5 分鐘快取）。您可以透過在組態中明確設定 `cacheRetention` 來覆寫此行為。

### 舊版參數

為了保持向後相容性，目前仍支援舊有的 `cacheControlTtl` 參數：
- `"5m"` 映射至 `short`。
- `"1h"` 映射至 `long`。
我們建議遷移至新的 `cacheRetention` 參數。

## 選項 B：Claude setup-token

**最適用於**：使用您的 Claude 訂閱。

### 如何獲取 setup-token

Setup-token 是由 **Claude Code CLI** 產生的，而非 Anthropic 主控台。您可以在 **任何機器** 上執行以下指令：

```bash
claude setup-token
```

將權杖貼入 OpenClaw（精靈選項：**Anthropic token (paste setup-token)**），或直接在閘道器主機上執行：

```bash
openclaw models auth setup-token --provider anthropic
```

如果您是在其它機器上產生權杖，請使用：

```bash
openclaw models auth paste-token --provider anthropic
```

### 組態片段 (setup-token)

```json5
{
  agents: { defaults: { model: { primary: "anthropic/claude-opus-4-6" } } },
}
```

## 疑難排解

**401 錯誤 / 權杖突然失效**
- Claude 訂閱驗證可能會過期或被撤銷。請重新執行 `claude setup-token` 並將其貼入 **閘道器主機**。
- 如果 Claude CLI 登入資訊位於其它機器，請在閘道器主機上使用 `openclaw models auth paste-token --provider anthropic`。

**找不到提供者 "anthropic" 的 API 密鑰**
- 驗證是 **針對個別代理人** 的。新建立的代理人不會繼承主代理人的密鑰。
- 請為該代理人重新執行引導設定，或在閘道器主機上貼入權杖/密鑰，然後使用 `openclaw models status` 驗證。

更多資訊：[疑難排解](/gateway/troubleshooting_zh_TW) 與 [常見問答](/help/faq_zh_TW)。
