---
summary: "橫跨信封、提示詞、工具與連接器的日期與時間處理機制"
read_when:
  - 您正在更改時間戳記向模型或使用者顯示的方式時
  - 您正在偵錯訊息或系統提示詞輸出中的時間格式時
title: "日期與時間"
---

> 此文件為 [English Version](/date-time) 的繁體中文版本。

# 日期與時間 (Date & Time)

OpenClaw 針對 **傳輸時間戳記預設使用主機本地時間**，而 **使用者時區僅用於系統提示詞**。
提供者時間戳記會被保留，以便工具維持其原生語義（目前時間可透過 `session_status` 取得）。

## 訊息信封 (Message envelopes，預設為本地時間)

傳入的訊息會附帶時間戳記（精確度為分鐘）：

```
[Provider ... 2026-01-05 16:26 PST] message text
```

此信封時間戳記 **預設為主機本地時間**，與提供者時區無關。

您可以覆寫此行為：

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
- `envelopeTimezone: "local"` 使用主機時區。
- `envelopeTimezone: "user"` 使用 `agents.defaults.userTimezone`（若未設定則回退至主機時區）。
- 使用明確的 IANA 時區（例如：`"Asia/Taipei"`）以固定時區。
- `envelopeTimestamp: "off"` 從信封標頭中移除絕對時間戳記。
- `envelopeElapsed: "off"` 移除經過時間後綴（例如 `+2m` 樣式）。

### 範例

**本地時間（預設）：**

```
[WhatsApp +1555 2026-01-18 00:19 PST] hello
```

**使用者時區：**

```
[WhatsApp +1555 2026-01-18 00:19 CST] hello
```

**啟用經過時間：**

```
[WhatsApp +1555 +30s 2026-01-18T05:19Z] follow-up
```

## 系統提示詞：目前日期與時間

如果已知使用者時區，系統提示詞會包含一個專用的 **目前日期與時間 (Current Date & Time)** 區塊，其中僅包含 **時區**（不含時鐘/時間格式），以保持提示詞快取 (Prompt caching) 的穩定性：

```
Time zone: Asia/Taipei
```

當助理需要目前時間時，請使用 `session_status` 工具；狀態卡中包含時間戳記行。

## 系統事件行 (System event lines，預設為本地時間)

插入助理上下文的佇列系統事件會帶有時間戳記前綴，使用與訊息信封相同的時區選擇（預設：主機本地時間）。

```
System: [2026-01-12 12:19:17 PST] Model switched.
```

### 配置使用者時區與格式

```json5
{
  agents: {
    defaults: {
      userTimezone: "Asia/Taipei",
      timeFormat: "auto", // auto | 12 | 24
    },
  },
}
```

- `userTimezone` 設定提示詞上下文的 **使用者本地時區**。
- `timeFormat` 控制提示詞中的 **12h/24h 顯示**。`auto` 會遵循作業系統偏好設定。

## 時間格式偵測 (auto)

當設定為 `timeFormat: "auto"` 時，OpenClaw 會檢查作業系統偏好設定（macOS/Windows），若偵測不到則回退至區域格式化 (Locale formatting)。偵測到的值會被 **每個程序快取一次**，以避免重複的系統呼叫。

## 工具酬載與連接器 (原始提供者時間 + 規範化欄位)

頻道工具會回傳 **提供者原生時間戳記**，並附加規範化欄位以保持一致性：

- `timestampMs`：Epoch 毫秒 (UTC)
- `timestampUtc`：ISO 8601 UTC 字串

原始提供者欄位會被保留，不會遺失任何資訊。

- Slack：來自 API 的類 Epoch 字串
- Discord：UTC ISO 時間戳記
- Telegram/WhatsApp：提供者特定的數字/ISO 時間戳記

如果您需要本地時間，請使用已知時區進行下游轉換。

## 相關文件

- [系統提示詞 (System Prompt)](/concepts/system-prompt_zh_TW)
- [時區 (Timezones)](/concepts/timezone_zh_TW)
- [訊息 (Messages)](/concepts/messages_zh_TW)
