---
summary: "用於列出會話、獲取歷史紀錄與跨會話傳送訊息的代理人對談工具說明"
read_when:
  - 新增或修改會話工具時
title: "對談工具"
---

> 此文件為 [English Version](/concepts/session-tool) 的繁體中文版本。

# 對談工具 (Session Tools)

目標：提供一組精簡且不易誤用的工具，讓代理人能列出會話、獲取歷史紀錄並傳送訊息至另一個會話。

## 工具名稱

- `sessions_list`
- `sessions_history`
- `sessions_send`
- `sessions_spawn`

## 識別金鑰模型

- 主要直接對話容器 (Direct chat bucket) 的金鑰一律為 `"main"`（會解析為目前代理人的主金鑰）。
- 群組聊天使用 `agent:<agentId>:<channel>:group:<id>` 或 `agent:<agentId>:<channel>:channel:<id>`（需傳遞完整金鑰）。
- 排程任務使用 `cron:<job.id>`。
- 鉤子使用 `hook:<uuid>`（除非有明確設定）。
- 節點會話使用 `node-<nodeId>`（除非有明確設定）。

`global` 與 `unknown` 為保留值，絕不會出現在列表中。若 `session.scope = "global"`，我們會為所有工具將其別名設為 `main`，確保調用者不會看見 `global`。

## sessions_list

以陣列形式列出對談會話。

參數：

- `kinds?: string[]` 篩選條件：`"main" | "group" | "cron" | "hook" | "node" | "other"` 其中的任一項。
- `limit?: number` 最大行數（預設為伺服器預設值，例如上限 200）。
- `activeMinutes?: number` 僅列出在 N 分鐘內有更新的會話。
- `messageLimit?: number` 0 = 不包含訊息（預設為 0）； >0 = 包含最後 N 則訊息。

行為：

- `messageLimit > 0` 會獲取每個會話的 `chat.history` 並包含最後 N 則訊息。
- 工具執行結果會從列表輸出中過濾掉；如需工具訊息請使用 `sessions_history`。
- 在 **沙箱化 (sandboxed)** 的代理人會話中執行時，對談工具預設僅具備 **衍生會話可見度**（見下文）。

資料列結構 (JSON)：

- `key`: 對談金鑰 (字串)。
- `kind`: `main | group | cron | hook | node | other`。
- `channel`: `whatsapp | telegram | discord | signal | imessage | webchat | internal | unknown`。
- `displayName`（若可用，則顯示群組顯示標籤）。
- `updatedAt` (單位：毫秒)。
- `sessionId`。
- `model`, `contextTokens`, `totalTokens`。
- `thinkingLevel`, `verboseLevel`, `systemSent`, `abortedLastRun`。
- `sendPolicy`（若有設定，則為會話覆寫值）。
- `lastChannel`, `lastTo`。
- `deliveryContext`（若可用，則為規範化的 `{ channel, to, accountId }`）。
- `transcriptPath`（盡力而為取得的路徑，衍生自存儲目錄 + sessionId）。
- `messages?`（僅當 `messageLimit > 0` 時出現）。

## sessions_history

獲取特定會話的轉錄紀錄。

參數：

- `sessionKey`（必填；接受對談金鑰或來自 `sessions_list` 的 `sessionId`）。
- `limit?: number` 最大訊息數（受伺服器上限限制）。
- `includeTools?: boolean`（預設為 false）。

行為：

- `includeTools=false` 會過濾掉 `role: "toolResult"` 的訊息。
- 以原始轉錄格式傳回訊息陣列。
- 當提供 `sessionId` 時，OpenClaw 會將其解析為對應的對談金鑰（若找不到 ID 則報錯）。

## sessions_send

傳送一則訊息至另一個會話。

參數：

- `sessionKey`（必填；接受對談金鑰或來自 `sessions_list` 的 `sessionId`）。
- `message`（必填）。
- `timeoutSeconds?: number`（預設 >0；0 = 發送後不理）。

行為：

- `timeoutSeconds = 0`：排入佇列並回傳 `{ runId, status: "accepted" }`。
- `timeoutSeconds > 0`：最多等待 N 秒直至完成，然後回傳 `{ runId, status: "ok", reply }`。
- 若等待逾時：`{ runId, status: "timeout", error }`。執行會繼續進行；之後可調用 `sessions_history` 查看。
- 若執行失敗：`{ runId, status: "error", error }`。
- 「宣告式遞送 (Announce delivery)」會在主要執行完成後以盡力而為的方式進行；`status: "ok"` 並不保證宣告訊息已成功送達。
- 透過閘道器的 `agent.wait`（伺服器端）進行等待，因此重新連線不會中斷等待過程。
- 代理人間的訊息上下文會注入至主要執行回合中。
- 會話間訊息會標註 `message.provenance.kind = "inter_session"` 進行持久化，以便轉錄紀錄閱讀者區分路由後的代理人指令與外部使用者輸入。
- 主要執行完成後，OpenClaw 會執行 **回覆迴圈 (reply-back loop)**：
  - 第二回合起在請求方與目標代理人間交替進行。
  - 回覆內容精確為 `REPLY_SKIP` 可停止乒乓交互。
  - 最大回合數由 `session.agentToAgent.maxPingPongTurns` 控制（0–5，預設 5）。
- 迴圈結束後，OpenClaw 執行 **代理人間宣告步驟**（僅限目標代理人）：
  - 回覆內容精確為 `ANNOUNCE_SKIP` 可保持沈默。
  - 任何其他回覆都會傳送至目標頻道。
  - 宣告步驟包含原始請求 + 第一回合回覆 + 最近一次乒乓回覆。

## 頻道欄位 (Channel Field)

- 針對群組，`channel` 是會話條目上記錄的頻道。
- 針對直接對話，`channel` 映射自 `lastChannel`。
- 針對 cron/hook/node，`channel` 為 `internal`。
- 若缺失，`channel` 為 `unknown`。

## 安全性 / 發送原則

基於頻道/聊天類型的原則性阻擋（而非針對個別會話 ID）。

```json
{
  "session": {
    "sendPolicy": {
      "rules": [
        {
          "match": { "channel": "discord", "chatType": "group" },
          "action": "deny"
        }
      ],
      "default": "allow"
    }
  }
}
```

執行階段覆寫（針對各個會話條目）：

- `sendPolicy: "allow" | "deny"`（未設定 = 繼承組態）
- 可透過 `sessions.patch` 或僅限擁有者調用的 `/send on|off|inherit`（獨立訊息）進行設定。

強制執行點：

- `chat.send` / `agent` (閘道器)
- 自動回覆遞送邏輯

## sessions_spawn

在隔離會話中衍生 (Spawn) 一個子代理人執行回合，並將結果宣告回請求方的聊天頻道。

參數：

- `task` (必填)。
- `label?`（選填；用於日誌/UI）。
- `agentId?`（選填；若允許則在另一個代理人 ID 下衍生）。
- `model?`（選填；覆寫子代理人模型；無效值將報錯）。
- `runTimeoutSeconds?`（預設為 0；設定後若超過 N 秒則中止子代理人執行）。
- `cleanup?` (`delete|keep`，預設為 `keep`)。

允許清單：

- `agents.list[].subagents.allowAgents`：允許透過 `agentId` 指定的代理人 ID 列表（`["*"]` 代表允許全部）。預設僅允許請求方代理人。

發現機制：

- 使用 `agents_list` 發現哪些代理人 ID 被允許用於 `sessions_spawn`。

行為：

- 啟動一個新的 `agent:<agentId>:subagent:<uuid>` 會話，並設定 `deliver: false`。
- 子代理人預設擁有完整的工具集，**但不含會話工具 (session tools)**（可透過 `tools.subagents.tools` 配置）。
- 子代理人不允許調用 `sessions_spawn`（禁止子代理人再衍生子代理人）。
- 始終採非阻塞方式：立即回傳 `{ status: "accepted", runId, childSessionKey }`。
- 完成後，OpenClaw 會執行子代理人 **宣告步驟**，並將結果發佈至請求方的聊天頻道。
- 在宣告步驟中精確回覆 `ANNOUNCE_SKIP` 可保持沈默。
- 宣告回覆內容會規範化為 `Status`/`Result`/`Notes`；`Status` 來自執行結果（非模型文字）。
- 子代理人會話在 `agents.defaults.subagents.archiveAfterMinutes`（預設 60 分鐘）後自動封存。
- 宣告回覆包含統計資訊行（執行時間、Token 數、會話金鑰/ID、轉錄路徑，以及選用的成本資訊）。

## 沙箱會話可見度

沙箱化會話可以使用會話工具，但預設僅能看見由其透過 `sessions_spawn` 衍生的會話。

組態設定：

```json5
{
  agents: {
    defaults: {
      sandbox: {
        // 預設值："spawned"
        sessionToolsVisibility: "spawned", // 或 "all"
      },
    },
  },
}
```
