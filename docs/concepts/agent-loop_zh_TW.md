---
summary: "代理人迴圈生命週期、串流與等待語意說明"
read_when:
  - 您需要了解代理人迴圈或生命週期事件的確切流程時
title: "代理人迴圈"
---

> 此文件為 [English Version](/concepts/agent-loop) 的繁體中文版本。

# 代理人迴圈 (Agent Loop - OpenClaw)

代理人迴圈 (Agentic loop) 是代理人一次完整的「真實」執行過程：包含輸入 (Intake) → 上下文組裝 (Context assembly) → 模型推理 (Model inference) → 工具執行 (Tool execution) → 串流回覆 (Streaming replies) → 持久化 (Persistence)。這是將訊息轉化為動作與最終回覆的權威路徑，同時確保對談狀態的一致性。

在 OpenClaw 中，迴圈是每個會話中單一且序列化的執行過程，它會在模型進行思考、調用工具與串流輸出時發出生命週期與串流事件。本文件將解釋這個端到端串接的完整迴圈機制。

## 入口點 (Entry points)

- 閘道器 RPC：`agent` 與 `agent.wait`。
- CLI：`agent` 指令。

## 運作原理 (高階概觀)

1. `agent` RPC 驗證參數、解析會話（sessionKey/sessionId）、持久化會話元數據，並立即回傳 `{ runId, acceptedAt }`。
2. `agentCommand` 執行代理人：
   - 解析模型以及思考/詳細程度的預設值。
   - 載入技能 (Skills) 快照。
   - 調用 `runEmbeddedPiAgent` (pi-agent-core 執行環境)。
   - 若內嵌迴圈未發出結束事件，則發出 **生命週期結束/錯誤 (lifecycle end/error)** 事件。
3. `runEmbeddedPiAgent`：
   - 透過各會話專屬軌道 (Lane) 與全域軌道將執行過程序列化。
   - 解析模型與驗證設定檔，並建立 Pi 對談。
   - 訂閱 Pi 事件並串流傳輸助理/工具的增量 (Deltas)。
   - 強制執行逾時機制 -> 若超過時限則終止執行。
   - 回傳負載內容與用量元數據。
4. `subscribeEmbeddedPiSession` 將 pi-agent-core 事件橋接至 OpenClaw 的 `agent` 串流：
   - 工具事件 => `stream: "tool"`
   - 助理增量 => `stream: "assistant"`
   - 生命週期事件 => `stream: "lifecycle"` (`phase: "start" | "end" | "error"`)
5. `agent.wait` 使用 `waitForAgentJob`：
   - 等待指定 `runId` 的 **生命週期結束/錯誤** 事件。
   - 回傳 `{ status: ok|error|timeout, startedAt, endedAt, error? }`。

## 佇列與並發 (Queueing + concurrency)

- 執行過程會針對每個對談金鑰（會話軌道）進行序列化，並可選擇性地經過全域軌道。
- 這能防止工具/會話之間的競爭，並保持對談歷史紀錄的一致性。
- 通訊頻道可以選擇不同的佇列模式 (collect/steer/followup) 來餵入此軌道系統。請參閱 [指令佇列](/concepts/queue_zh_TW)。

## 會話與工作區準備

- 解析並建立工作區；沙箱化的執行可能會重新導向至沙箱工作區根目錄。
- 載入技能（或從快照重用）並注入到環境變數與提示詞中。
- 解析引導/上下文檔案並注入到系統提示詞報告中。
- 獲取會話寫入鎖定；在開始串流前開啟並準備好 `SessionManager`。

## 提示詞組裝與系統提示詞

- 系統提示詞結合了 OpenClaw 基礎提示詞、技能提示詞、引導上下文以及每次執行的覆寫設定。
- 強制執行模型專屬限制與壓縮 (Compaction) 預留 Token。
- 請參閱 [系統提示詞](/concepts/system-prompt_zh_TW) 以了解模型看到的內容。

## 鉤子點 (可攔截位置)

OpenClaw 具備兩套鉤子系統：

- **內部鉤子 (Gateway hooks)**：針對指令與生命週期事件的事件驅動腳本。
- **外掛程式鉤子 (Plugin hooks)**：位於代理人/工具生命週期與閘道器管線內部的擴充點。

### 內部鉤子 (閘道器鉤子)

- **`agent:bootstrap`**：在系統提示詞定案前，於建置引導檔案期間執行。可用於新增或移除引導上下文檔案。
- **指令鉤子**：`/new`, `/reset`, `/stop` 以及其他指令事件。

設定與範例請參閱 [鉤子 (Hooks)](/automation/hooks_zh_TW)。

### 外掛程式鉤子 (代理人 + 閘道器生命週期)

執行於代理人迴圈或閘道器管線內部：

- **`before_agent_start`**：在執行開始前注入上下文或覆寫系統提示詞。
- **`agent_end`**：在完成後檢視最終訊息列表與執行元數據。
- **`before_compaction` / `after_compaction`**：觀察或標註壓縮週期。
- **`before_tool_call` / `after_tool_call`**：攔截工具參數或執行結果。
- **`tool_result_persist`**：在工具結果寫入對談轉錄紀錄前，同步進行轉換。
- **`message_received` / `message_sending` / `message_sent`**：傳入與傳出訊息的鉤子。
- **`session_start` / `session_end`**：會話生命週期邊界。
- **`gateway_start` / `gateway_stop`**：閘道器生命週期事件。

關於鉤子 API 與註冊細節，請參閱 [外掛程式](/tools/plugin_zh_TW#外掛程式鉤子)。

## 串流與部分回覆

- 助理增量 (Deltas) 從 pi-agent-core 串流傳出，並以 `assistant` 事件形式發出。
- 區塊串流 (Block streaming) 可以在 `text_end` 或 `message_end` 時發出部分回覆。
- 推理過程串流可以作為獨立串流發出，或作為區塊回覆發出。
- 關於分塊與區塊回覆行為，請參閱 [串流 (Streaming)](/concepts/streaming_zh_TW)。

## 工具執行與通訊工具

- 工具的啟動/更新/結束事件會透過 `tool` 串流發出。
- 工具結果在記錄/發出前，會針對大小與影像負載進行淨化處理。
- 通訊工具的發送動作會被追蹤，以抑制重複的助理確認訊息。

## 回覆修飾與抑制 (Shaping + suppression)

- 最終負載內容由以下部分組成：
  - 助理文字（以及選用的推理過程）
  - 行內工具摘要（當啟用詳細模式且被允許時）
  - 當模型發生錯誤時的助理錯誤文字
- `NO_REPLY` 被視為靜默 Token，會從外傳負載中過濾掉。
- 最終負載列表中會移除重複的通訊工具發送內容。
- 若無剩餘的可渲染負載且工具執行出錯，則會發出備援的工具錯誤回覆（除非通訊工具已發送過使用者可見的回覆）。

## 壓縮與重試

- 自動壓縮會發出 `compaction` 串流事件，並可能觸發重試。
- 重試時，記憶體緩衝區與工具摘要會重置，以避免重複輸出。
- 關於壓縮管線，請參閱 [壓縮 (Compaction)](/concepts/compaction_zh_TW)。

## 事件串流 (現狀)

- `lifecycle`: 由 `subscribeEmbeddedPiSession` 發出（或作為 `agentCommand` 的備援）。
- `assistant`: 來自 pi-agent-core 的串流增量。
- `tool`: 來自 pi-agent-core 的串流工具事件。

## 聊天頻道處理

- 助理增量會緩衝至聊天的 `delta` 訊息中。
- 在 **生命週期結束/錯誤** 時，會發出聊天的 `final` 訊息。

## 逾時機制

- `agent.wait` 預設：30 秒（僅針對等待動作）。可透過 `timeoutMs` 參數覆寫。
- 代理人執行環境：`agents.defaults.timeoutSeconds` 預設 600 秒；由 `runEmbeddedPiAgent` 中的終止計時器強制執行。

## 可能提前結束的情況

- 代理人逾時（中止）
- AbortSignal（取消）
- 閘道器斷線或 RPC 逾時
- `agent.wait` 逾時（僅停止等待，不停止代理人執行）
