---
summary: "針對向提供者 (Provider) 發出之外部請求的重試原則說明"
read_when:
  - 更新提供者重試行為或預設值時
  - 偵錯提供者傳送錯誤或頻率限制時
title: "重試原則"
---

> 此文件為 [English Version](/concepts/retry_zh_TW) 的繁體中文版本。

# 重試原則 (Retry policy)

## 目標

- 針對單一 HTTP 請求進行重試，而非針對整個多步驟流程。
- 僅重試目前步驟以保留執行順序。
- 避免重複執行非冪等 (Non-idempotent) 的操作。

## 預設值

- 嘗試次數：3 次
- 最大延遲上限：30000 毫秒 (ms)
- 抖動 (Jitter)：0.1 (10%)
- 各提供者預設值：
  - Telegram 最小延遲：400 ms
  - Discord 最小延遲：500 ms

## 行為特性

### Discord

- 僅在遇到頻率限制錯誤 (HTTP 429) 時進行重試。
- 若有提供則使用 Discord 的 `retry_after` 數值，否則使用指數退避 (Exponential backoff)。

### Telegram

- 在發生暫時性錯誤 (429, 逾時, 連線重置/關閉, 暫時不可用) 時進行重試。
- 若有提供則使用 `retry_after` 數值，否則使用指數退避。
- Markdown 解析錯誤不會進行重試；系統會直接回退使用純文字發送。

## 組態設定

可在 `~/.openclaw/openclaw.json` 中針對各提供者設定重試原則：

```json5
{
  channels: {
    telegram: {
      retry: {
        attempts: 3,
        minDelayMs: 400,
        maxDelayMs: 30000,
        jitter: 0.1,
      },
    },
    discord: {
      retry: {
        attempts: 3,
        minDelayMs: 500,
        maxDelayMs: 30000,
        jitter: 0.1,
      },
    },
  },
}
```

## 注意事項

- 重試適用於每個獨立請求（如訊息發送、媒體上傳、心情回應、投票、貼圖）。
- 複合流程 (Composite flows) 中，已完成的步驟不會再次重試。
