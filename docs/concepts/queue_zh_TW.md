---
summary: "指令佇列設計：將傳入的自動回覆執行過程序列化"
read_when:
  - 更改自動回覆執行邏輯或並發設定時
title: "指令佇列"
---

> 此文件為 [English Version](/concepts/queue_zh_TW) 的繁體中文版本。

# 指令佇列 (Command Queue)

我們透過一個小型的工作程序內佇列，將所有頻道的傳入自動回覆執行過程進行 **序列化 (Serialize)**。這能防止多個代理人執行回合發生衝突，同時仍允許不同會話之間安全的並行處理。

## 為何需要

- 自動回覆執行的成本較高（涉及 LLM 調用），且當多個訊息幾乎同時抵達時可能會發生衝突。
- 序列化處理可避免對共享資源（會話檔案、日誌、CLI 標準輸入）的競爭，並減少觸發上游 API 頻率限制的機率。

## 運作原理

- 系統採用具備 **軌道感知 (Lane-aware)** 能力的先進先出 (FIFO) 佇列，每個軌道皆有可配置的並發上限（未配置的軌道預設為 1；主要軌道預設為 4，子代理人軌道預設為 8）。
- `runEmbeddedPiAgent` 會根據 **對談金鑰 (Session key)**（軌道格式為 `session:<key>`）進行排隊，確保每個會話同時僅有一個活動中的執行回合。
- 每個會話的回合接著會被排入一個 **全域軌道 (Global lane)**（預設為 `main`），使整體的並行數受限於 `agents.defaults.maxConcurrent`。
- 啟用詳細記錄 (Verbose) 時，若佇列中的回合在開始前等待超過約 2 秒，系統會發出簡短通知。
- 排入佇列後，正在輸入指示器 (Typing indicators) 會立即觸發（若頻道支援），因此在等待執行期間，使用者體驗不會受到影響。

## 佇列模式 (各頻道獨立設定)

傳入訊息可以引導目前的執行回合、等待後續回合，或兩者兼施：

- `steer` (引導)：立即注入目前的執行回合（在下一個工具執行邊界後取消待處理的工具調用）。若非串流模式，則回退至 `followup`。
- `followup` (後續回合)：在目前回合結束後，為下一回合代理人執行排隊。
- `collect` (收集)：將所有排隊中的訊息合併為 **單一一次** 後續回合（預設值）。若訊息目標為不同頻道或討論串，則會分別處理以保留正確路由。
- `steer-backlog` (即 `steer+backlog`)：立即引導 **且** 將訊息保留給後續回合。
- `interrupt` (舊版)：中止該對談目前活動中的執行，然後執行最新訊息。
- `queue` (舊版別名)：與 `steer` 相同。

`steer-backlog` 模式代表您在引導執行後還會收到一個後續回覆，在串流介面上這看起來可能像是重複回覆。若您希望每個傳入訊息僅對應一個回覆，請優先選擇 `collect` 或 `steer`。
您可以發送 `/queue collect` 作為獨立指令（針對單次對談），或在組態中設定 `messages.queue.byChannel.discord: "collect"`。

預設值（組態未設定時）：

- 所有介面 → `collect`

可透過 `messages.queue` 進行全域或各頻道配置：

```json5
{
  messages: {
    queue: {
      mode: "collect",
      debounceMs: 1000,
      cap: 20,
      drop: "summarize",
      byChannel: { discord: "collect" },
    },
  },
}
```

## 佇列選項

選項適用於 `followup`, `collect`, 與 `steer-backlog`（以及回退至 followup 的 `steer` 模式）：

- `debounceMs`: 在啟動後續回合前等待一段靜態期 (Quiet period)，以防止「連續不斷的執行」。
- `cap`: 每個會話排隊訊息的最大數量。
- `drop`: 溢位處理原則 (`old` 捨棄舊的, `new` 捨棄新的, `summarize` 摘要)。

`summarize` 模式會保留被捨棄訊息的簡短清單，並將其作為合成的後續提示詞注入。
預設值：`debounceMs: 1000`, `cap: 20`, `drop: summarize`。

## 針對單次對談的覆寫

- 發送 `/queue <模式>` 作為獨立指令，可儲存目前會話使用的模式。
- 選項可以組合使用：`/queue collect debounce:2s cap:25 drop:summarize`
- 發送 `/queue default` 或 `/queue reset` 可清除會話專屬的覆寫設定。

## 適用範圍與保證

- 適用於所有使用閘道器回覆管線的傳入頻道自動回覆執行過程（WhatsApp web, Telegram, Slack, Discord, Signal, iMessage, WebChat 等）。
- 預設軌道 (`main`) 是針對程序全域的傳入訊息與主要心跳偵測；請設定 `agents.defaults.maxConcurrent` 以允許同時進行多個會話。
- 可能存在額外軌道（如 `cron`, `subagent`），使背景任務能平行執行，而不阻塞傳入訊息的回覆。
- 每個對談專屬的軌道保證了同時間僅有一個代理人執行程序會觸碰特定的會話。
- 無外部依賴，亦無背景工作執行緒；純 TypeScript + Promises 實作。

## 故障排除

- 若指令看起來卡住了，請啟用詳細日誌並尋找「queued for ...ms」字樣，以確認佇列是否正在正常處理中。
- 若需查看佇列深度，請啟用詳細日誌並觀察佇列計時相關記錄。
