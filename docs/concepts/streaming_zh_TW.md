---
summary: "串流與分塊行為說明（區塊回覆、草稿串流、限制大小）"
read_when:
  - 解釋頻道上的串流或分塊運作原理時
  - 更改區塊串流或頻道分塊行為時
  - 偵錯重複/過早的區塊回覆或草稿串流時
title: "串流與分塊"
---

> 此文件為 [English Version](/concepts/streaming_zh_TW) 的繁體中文版本。

# 串流與分塊 (Streaming + chunking)

OpenClaw 具備兩個獨立的「串流」層級：

- **區塊串流 (Block streaming - 適用於多個頻道)：** 在助理撰寫內容的同時，發出已完成的 **區塊 (blocks)**。這些是正常的頻道訊息（而非 Token 增量）。
- **類 Token 串流 (僅限 Telegram)：** 在生成過程中以部分文字更新 **草稿氣泡 (draft bubble)**；最終訊息會在結束時發送。

目前傳送到外部頻道的訊息 **並非真實的 Token 串流**。Telegram 的草稿串流是目前唯一支援部分顯示的介面。

## 區塊串流 (頻道訊息)

區塊串流會將助理的輸出以粗略的分塊方式發送（當內容可用時）。

```
模型輸出
  └─ text_delta/events (文字增量/事件)
       ├─ (blockStreamingBreak=text_end)
       │    └─ 分塊器隨緩衝區增長發出區塊
       └─ (blockStreamingBreak=message_end)
            └─ 分塊器在訊息結束 (message_end) 時清空
                   └─ 頻道發送 (區塊回覆)
```

圖例說明：

- `text_delta/events`：模型串流事件（對於非串流模型可能較為稀疏）。
- `chunker`：`EmbeddedBlockChunker` 套用上下限範圍 + 斷句偏好。
- `channel send`：實際發送的外傳訊息（區塊回覆）。

**控制項：**

- `agents.defaults.blockStreamingDefault`: `"on"`/`"off"` (預設為 off)。
- 頻道覆寫：`*.blockStreaming`（及其帳號層級變體），用於強制各頻道的開關狀態。
- `agents.defaults.blockStreamingBreak`: `"text_end"` 或 `"message_end"`。
- `agents.defaults.blockStreamingChunk`: `{ minChars, maxChars, breakPreference? }`。
- `agents.defaults.blockStreamingCoalesce`: `{ minChars?, maxChars?, idleMs? }` (發送前合併串流區塊)。
- 頻道硬性上限：`*.textChunkLimit` (例如：`channels.whatsapp.textChunkLimit`)。
- 頻道分塊模式：`*.chunkMode`（預設為 `length` 依長度；`newline` 則在長度分塊前先依空白行/段落邊界切分）。
- Discord 軟上限：`channels.discord.maxLinesPerMessage` (預設 17) 會切分過長的回覆，以避免 UI 顯示被截斷。

**邊界語意 (Boundary semantics)：**

- `text_end`：一旦分塊器發出內容即串流傳輸；在每個 `text_end` 點清空發送。
- `message_end`：等待助理訊息完全結束，再清空緩衝區輸出。

若緩衝文字超過 `maxChars`，`message_end` 仍會使用分塊器，因此可能在結束時發出多個分塊。

## 分塊演算法 (下限/上限)

區塊分塊由 `EmbeddedBlockChunker` 實作：

- **下限 (Low bound)**：除非強制清空，否則在緩衝區長度 < `minChars` 前不發出內容。
- **上限 (High bound)**：優先在 `maxChars` 前尋找斷點；若強制切分，則在 `maxChars` 處截斷。
- **斷句偏好 (Break preference)**：`paragraph` (段落) → `newline` (換行) → `sentence` (句子) → `whitespace` (空白) → 硬截斷。
- **程式碼圍欄 (Code fences)**：絕不在圍欄內部切分；若在 `maxChars` 處被強制切分，會先關閉圍欄再重新開啟，以保持 Markdown 格式有效。

`maxChars` 會被限制在頻道的 `textChunkLimit` 之內，因此不會超過各頻道的上限。

## 合併 (Coalescing - 合併串流區塊)

啟用區塊串流時，OpenClaw 可以在發送前 **合併連續的區塊片段**。這能在提供漸進式輸出的同時，減少「單行洗版」的情況。

- 合併機制會等待 **閒置間隔** (`idleMs`) 後再行發送。
- 緩衝區受 `maxChars` 限制，若超過則會立即發送。
- `minChars` 可防止過小的片段被發送，直到累積足夠文字（最終清空時仍會發送剩餘文字）。
- 連接符 (Joiner) 衍生自 `blockStreamingChunk.breakPreference`
  (`paragraph` → `

`, `newline` → `
`, `sentence` → 空格)。
- 可透過 `*.blockStreamingCoalesce`（包含個別帳號組態）進行頻道覆寫。
- Signal/Slack/Discord 的預設合併 `minChars` 已提升至 1500（除非被覆寫）。

## 區塊間的類真人節奏

啟用區塊串流後，您可以在區塊回覆之間加入 **隨機停頓**（從第二個區塊開始）。這能讓多氣泡的回應感覺更自然。

- 組態項：`agents.defaults.humanDelay`（可透過 `agents.list[].humanDelay` 為各代理人覆寫）。
- 模式：`off` (預設), `natural` (800–2500ms), `custom` (使用 `minMs`/`maxMs`)。
- 僅適用於 **區塊回覆 (block replies)**，不適用於最終回覆或工具摘要。

## 「串流分塊或是全量發送」

這對應到：

- **串流分塊：** `blockStreamingDefault: "on"` + `blockStreamingBreak: "text_end"` (即時發送)。非 Telegram 頻道還需要設定 `*.blockStreaming: true`。
- **結束時全量發送：** `blockStreamingBreak: "message_end"` (一次性發送，若內容極長可能分為多個分塊)。
- **不使用區塊串流：** `blockStreamingDefault: "off"` (僅發送最終回覆)。

**頻道注意事項：** 針對非 Telegram 頻道，區塊串流預設為 **關閉**，除非 `*.blockStreaming` 被明確設為 `true`。Telegram 可以在不使用區塊回覆的情況下執行草稿串流 (`channels.telegram.streamMode`)。

組態位置提醒：`blockStreaming*` 的預設值位於 `agents.defaults` 下，而非根目錄。

## Telegram 草稿串流 (類 Token 串流)

Telegram 是目前唯一支援草稿串流的頻道：

- 在 **啟用主題 (Topics) 的私訊** 中使用機器人 API 的 `sendMessageDraft` 功能。
- `channels.telegram.streamMode: "partial" | "block" | "off"`。
  - `partial`: 根據最新的串流文字更新草稿。
  - `block`: 以分塊方式更新草稿（遵循相同的分塊器規則）。
  - `off`: 不使用草稿串流。
- 草稿分塊組態（僅適用於 `streamMode: "block"`）：`channels.telegram.draftChunk` (預設值：`minChars: 200`, `maxChars: 800`)。
- 草稿串流與區塊串流是獨立的；區塊回覆預設關閉，且僅在非 Telegram 頻道設定 `*.blockStreaming: true` 時啟用。
- 最終回覆仍是一則正常的訊息。
- `/reasoning stream` 指令會將推理過程寫入草稿氣泡中（僅限 Telegram）。

當草稿串流活動時，OpenClaw 會停用該次回覆的區塊串流，以避免重複顯示。

```
Telegram (私訊 + 主題功能)
  └─ sendMessageDraft (草稿氣泡)
       ├─ streamMode=partial → 更新最新文字
       └─ streamMode=block   → 分塊器更新草稿
  └─ 最終回覆 → 正常訊息
```

圖例說明：

- `sendMessageDraft`: Telegram 草稿氣泡（非真實訊息）。
- `final reply`: 發送正常的 Telegram 訊息。
