---
summary: "訊息流程、會話、佇列機制以及推理過程可見度說明"
read_when:
  - 解釋傳入訊息如何轉化為回覆時
  - 釐清會話、佇列模式或串流行為時
  - 記錄推理過程可見度及其對用量影響時
title: "訊息機制"
---

> 此文件為 [English Version](/concepts/messages) 的繁體中文版本。

# 訊息機制 (Messages)

本頁面整合說明了 OpenClaw 如何處理傳入訊息、會話 (Sessions)、佇列 (Queueing)、串流 (Streaming) 以及推理過程的可見度。

## 訊息流程 (高階概觀)

```
傳入訊息
  -> 路由/綁定 -> 對談金鑰 (Session key)
  -> 佇列 (若已有執行中的回合)
  -> 代理人執行 (串流 + 工具)
  -> 傳出回覆 (頻道限制 + 分塊)
```

關鍵的控制項位於組態設定中：

- `messages.*`：用於前綴、佇列與群組行為。
- `agents.defaults.*`：用於區塊串流與分塊預設值。
- 頻道覆寫項（`channels.whatsapp.*`, `channels.telegram.*` 等）：用於大小上限與串流開關。

詳細架構請參閱 [組態設定](/gateway/configuration_zh_TW)。

## 傳入重複刪除 (Dedupe)

頻道可能會在重新連線後重新遞送同一則訊息。OpenClaw 維持一個短期的快取，以「頻道/帳號/同儕/會話/訊息 ID」為鍵值，確保重複的訊息不會觸發第二次代理人執行。

## 傳入防震 (Debouncing)

來自 **同一傳送者** 的快速連續訊息可以透過 `messages.inbound` 批次處理為單一代理人回合。防震機制的作用範圍是每個「頻道 + 對話」，並使用最近一則訊息來處理回覆執行緒與 ID。

組態（全域預設值 + 各頻道覆寫）：

```json5
{
  messages: {
    inbound: {
      debounceMs: 2000,
      byChannel: {
        whatsapp: 5000,
        slack: 1500,
        discord: 1500,
      },
    },
  },
}
```

注意事項：

- 防震僅適用於 **純文字** 訊息；媒體/附件會立即處理。
- 控制指令會繞過防震機制，以保持其獨立執行。

## 會話與裝置

會話 (Sessions) 由閘道器擁有，而非由用戶端擁有。

- 直接對話會歸併至代理人的主對談金鑰。
- 群組/頻道擁有各自的對談金鑰。
- 對談存儲區與轉錄紀錄存放在閘道器主機上。

多個裝置/頻道可以映射到同一個會話，但歷史紀錄不會完全同步回每個用戶端。建議：對於長篇對話，請使用一個主要裝置，以避免上下文產生分歧 (Divergent context)。控制 UI 與 TUI 一律顯示由閘道器支援的對談轉錄紀錄，因此它們是單一事實來源。

詳情請見：[會話管理](/concepts/session_zh_TW)。

## 傳入內容與歷史上下文

OpenClaw 將 **提示詞內容 (Prompt body)** 與 **指令內容 (Command body)** 分開處理：

- `Body`：傳送給代理人的提示文字。這可能包含頻道封裝 (Envelopes) 與選用的歷史紀錄包裝。
- `CommandBody`：用於解析引導指令/指令的原生使用者文字。
- `RawBody`：`CommandBody` 的舊版別名（保留以維持相容性）。

當頻道提供歷史紀錄時，會使用共享的包裝格式：

- `[Chat messages since your last reply - for context]` (自您上次回覆後的聊天訊息 - 供參考)
- `[Current message - respond to this]` (目前訊息 - 請針對此則回覆)

對於 **非直接對話**（群組/頻道/房間），**目前訊息內容** 會加上傳送者標籤（與歷史紀錄條目的樣式相同）。這能讓即時訊息與佇列/歷史訊息在代理人提示詞中保持一致。

歷史緩衝區僅包含 **待處理訊息**：這包括未觸發執行的群組訊息（例如：因提及門檻而被過濾的訊息），且 **不包含** 已存在於對談轉錄紀錄中的訊息。

指令語移除 (Directive stripping) 僅適用於「目前訊息」區段，以確保歷史紀錄保持完整。包裝歷史紀錄的頻道應將 `CommandBody`（或 `RawBody`）設為原始訊息文字，並將 `Body` 設為組合後的提示詞。歷史緩衝區的大小可透過 `messages.groupChat.historyLimit`（全域預設值）與各頻道覆寫（如 `channels.slack.historyLimit` 或 `channels.telegram.accounts.<id>.historyLimit`）進行配置（設為 `0` 即可停用）。

## 佇列與後續處理 (Followups)

若已有執行中的回合，傳入的訊息可以被排入佇列、引導 (Steer) 進入目前回合，或收集起來用於下一次的回補回合 (Followup turn)。

- 透過 `messages.queue`（與 `messages.queue.byChannel`）進行配置。
- 模式包含：`interrupt`, `steer`, `followup`, `collect` 以及待處理 (Backlog) 變體。

詳情請見：[佇列機制](/concepts/queue_zh_TW)。

## 串流、分塊與批次處理

區塊串流 (Block streaming) 會在模型產生文字區塊時發送部分回覆。分塊機制會遵循頻道的文字限制，並避免切斷圍欄程式碼 (Fenced code)。

關鍵設定：

- `agents.defaults.blockStreamingDefault` (`on|off`，預設為 off)
- `agents.defaults.blockStreamingBreak` (`text_end|message_end`)
- `agents.defaults.blockStreamingChunk` (`minChars|maxChars|breakPreference`)
- `agents.defaults.blockStreamingCoalesce`（基於閒置時間的批次處理）
- `agents.defaults.humanDelay`（區塊回覆之間的模擬真人停頓）
- 頻道覆寫：`*.blockStreaming` 與 `*.blockStreamingCoalesce`（非 Telegram 頻道需要明確設定 `*.blockStreaming: true`）

詳情請見：[串流與分塊](/concepts/streaming_zh_TW)。

## 推理過程可見度與 Token

OpenClaw 可以顯示或隱藏模型的推理過程：

- `/reasoning on|off|stream` 控制可見度。
- 即使被隱藏，推理內容在由模型產生時仍會計入 Token 用量。
- Telegram 支援將推理過程串流至草稿氣泡中。

詳情請見：[思考與推理指令](/tools/thinking_zh_TW) 以及 [Token 用量](/reference/token-use_zh_TW)。

## 前綴、執行緒與回覆

傳出訊息的格式化集中在 `messages` 中管理：

- `messages.responsePrefix`、`channels.<channel>.responsePrefix` 與 `channels.<channel>.accounts.<id>.responsePrefix`（傳出前綴的階層式覆寫），以及 `channels.whatsapp.messagePrefix`（WhatsApp 傳入前綴）。
- 透過 `replyToMode` 與各頻道預設值控制回覆執行緒。

詳情請見：[組態設定](/gateway/configuration_zh_TW#訊息) 與各頻道說明文件。
