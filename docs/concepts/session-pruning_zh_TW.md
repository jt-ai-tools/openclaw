---
title: "工作階段裁剪 (Session Pruning)"
summary: "工作階段裁剪：縮減工具結果以減少上下文膨脹"
read_when:
  - 您希望減少模型呼叫中因工具輸出導致的上下文增長時
  - 您正在調整 agents.defaults.contextPruning 時
---

> 此文件為 [English Version](/concepts/session-pruning) 的繁體中文版本。

# 工作階段裁剪 (Session Pruning)

工作階段裁剪會在每次 LLM 呼叫前，從記憶體內的上下文中裁掉 **舊有的工具結果 (tool results)**。它 **不會** 改寫磁碟上的工作階段歷史檔案 (`*.jsonl`)。

## 執行時機

- 當啟用了 `mode: "cache-ttl"` 且該工作階段的上一次 Anthropic 呼叫早於 `ttl` 時。
- 僅影響該次請求發送給模型的訊息。
- 僅對 Anthropic API 呼叫（及 OpenRouter 的 Anthropic 模型）有效。
- 為了獲得最佳效果，請將 `ttl` 與您的模型 `cacheControlTtl` 相匹配。
- 裁剪後，TTL 視窗會重設，因此後續請求將保留快取直到 `ttl` 再次到期。

## 智慧預設值 (Anthropic)

- **OAuth 或 setup-token** 設定檔：啟用 `cache-ttl` 裁剪，並將心跳 (heartbeat) 設定為 `1h`。
- **API 密鑰 (API key)** 設定檔：啟用 `cache-ttl` 裁剪，將心跳設定為 `30m`，且 Anthropic 模型的預設 `cacheControlTtl` 為 `1h`。
- 如果您手動設定了這些值，OpenClaw **不會** 覆寫它們。

## 改進之處（成本與快取行為）

- **為什麼要裁剪：** Anthropic 的提示詞快取 (Prompt caching) 僅在 TTL 內有效。如果工作階段閒置超過 TTL，除非您先進行裁剪，否則下一次請求將重新快取完整的提示詞。
- **什麼會變便宜：** 裁剪減少了 TTL 到期後第一次請求的 **快取寫入 (cacheWrite)** 大小。
- **為什麼 TTL 重設很重要：** 一旦執行裁剪，快取視窗就會重設，因此後續請求可以重複使用新鮮快取的提示詞，而不需要再次快取完整歷史。
- **它不會做什麼：** 裁剪不會增加 Token 或造成「雙倍」成本；它只會改變 TTL 到期後首次請求的快取內容。

## 哪些內容可以被裁剪

- 僅限 `toolResult` 訊息。
- 使用者 (User) 與助理 (Assistant) 的訊息 **絕不會** 被修改。
- 最後 `keepLastAssistants` 個助理訊息會受到保護；在該切分點之前的工具結果會被裁剪。
- 如果沒有足夠的助理訊息來建立切分點，則會跳過裁剪。
- 包含 **圖片區塊 (image blocks)** 的工具結果會被跳過（絕不縮減或清除）。

## 上下文視窗估算

裁剪使用預估的上下文視窗大小（字元數 ≈ Token 數 × 4）。基準視窗大小按以下順序解析：

1. `models.providers.*.models[].contextWindow` 覆寫值。
2. 模型定義的 `contextWindow`（來自模型註冊表）。
3. 預設值 `200000` Tokens。

如果設定了 `agents.defaults.contextTokens`，它會被視為解析視窗的上限（最小值）。

## 模式 (Mode)

### cache-ttl

- 僅在最後一次 Anthropic 呼叫早於 `ttl`（預設為 `5m`）時才執行裁剪。
- 執行時的行為：與先前相同的軟剪裁 (soft-trim) 與硬清除 (hard-clear) 行為。

## 軟剪裁 vs 硬清除

- **軟剪裁 (Soft-trim)**：僅針對過大的工具結果。
  - 保留開頭與結尾，插入 `...`，並附上原始大小的說明。
  - 跳過包含圖片區塊的結果。
- **硬清除 (Hard-clear)**：將整個工具結果替換為 `hardClear.placeholder`。

## 工具選擇 (Tool selection)

- `tools.allow` / `tools.deny` 支援 `*` 萬用字元。
- 拒絕清單 (Deny) 優先權較高。
- 匹配不分大小寫。
- 空的允許清單意指允許所有工具。

## 與其他限制的交互作用

- 內建工具通常會自行截斷輸出；工作階段裁剪是額外的一層保護，防止長時間對談在模型上下文中累積過多的工具輸出。
- 壓縮 (Compaction) 是獨立的機制：壓縮會進行摘要並持久化，裁剪則是針對每次請求的暫時性處理。請參閱 [/concepts/compaction](/concepts/compaction_zh_TW)。

## 預設值（啟用時）

- `ttl`: `"5m"`
- `keepLastAssistants`: `3`
- `softTrimRatio`: `0.3`
- `hardClearRatio`: `0.5`
- `minPrunableToolChars`: `50000`
- `softTrim`: `{ maxChars: 4000, headChars: 1500, tailChars: 1500 }`
- `hardClear`: `{ enabled: true, placeholder: "[Old tool result content cleared]" }`

## 範例

預設值（關閉）：

```json5
{
  agent: {
    contextPruning: { mode: "off" },
  },
}
```

啟用 TTL 感知的裁剪：

```json5
{
  agent: {
    contextPruning: { mode: "cache-ttl", ttl: "5m" },
  },
}
```

限制裁剪特定的工具：

```json5
{
  agent: {
    contextPruning: {
      mode: "cache-ttl",
      tools: { allow: ["exec", "read"], deny: ["*image*"] },
    },
  },
}
```

組態參考請參閱：[閘道器組態](/gateway/configuration_zh_TW)
