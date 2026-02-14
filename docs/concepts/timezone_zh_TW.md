---
summary: "助理、信封與提示詞的時區處理機制"
read_when:
  - 您需要了解時間戳記如何為模型進行規範化時
  - 為系統提示詞配置使用者時區時
title: "時區"
---

> 此文件為 [English Version](/concepts/timezone) 的繁體中文版本。

# 時區 (Timezones)

OpenClaw 規範化了時間戳記，使模型能看到 **單一的參考時間**。

## 訊息信封 (Message envelopes，預設為本地時間)

傳入的訊息會被封裝在信封中，如下所示：

```
[Provider ... 2026-01-05 16:26 PST] message text
```

信封中的時間戳記 **預設為主機本地時間**，精確度為分鐘。

您可以使用以下設定進行覆寫：

```json5
{
  agents: {
    defaults: {
      envelopeTimezone: "local", // "utc" | "local" | "user" | IANA 時區
      envelopeTimestamp: "on", // "on" | "off"
      envelopeElapsed: "on", // "on" | "off"
    },
  },
}
```

- `envelopeTimezone: "utc"` 使用 UTC。
- `envelopeTimezone: "user"` 使用 `agents.defaults.userTimezone`（若未設定則回退至主機時區）。
- 使用明確的 IANA 時區（例如：`"Asia/Taipei"`）以固定偏移量。
- `envelopeTimestamp: "off"` 從信封標頭中移除絕對時間戳記。
- `envelopeElapsed: "off"` 移除經過時間後綴（例如 `+2m` 樣式）。

### 範例

**本地時間（預設）：**

```
[Signal Alice +1555 2026-01-18 00:19 PST] hello
```

**固定時區：**

```
[Signal Alice +1555 2026-01-18 06:19 GMT+1] hello
```

**經過時間：**

```
[Signal Alice +1555 +2m 2026-01-18T05:19Z] follow-up
```

## 工具酬載 (Tool payloads，原始提供者數據 + 規範化欄位)

工具呼叫（如 `channels.discord.readMessages`, `channels.slack.readMessages` 等）會回傳 **原始提供者時間戳記**。
為了保持一致性，我們也會附加規範化欄位：

- `timestampMs` (UTC Epoch 毫秒)
- `timestampUtc` (ISO 8601 UTC 字串)

原始提供者欄位將會保留。

## 系統提示詞中的使用者時區

設定 `agents.defaults.userTimezone` 來告知模型使用者的本地時區。如果未設定，OpenClaw 會在 **執行時期解析主機時區**（不會寫入組態）。

```json5
{
  agents: { defaults: { userTimezone: "Asia/Taipei" } },
}
```

系統提示詞包含：

- `Current Date & Time` 區塊，包含本地時間與時區。
- `Time format: 12-hour` 或 `24-hour`。

您可以使用 `agents.defaults.timeFormat` (`auto` | `12` | `24`) 控制提示詞格式。

完整的行為與範例請參閱 [日期與時間 (Date & Time)](/date-time)。
