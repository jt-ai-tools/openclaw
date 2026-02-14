---
summary: "會話管理規則、金鑰定義以及聊天紀錄的持久化說明"
read_when:
  - 修改會話處理邏輯或存儲方式時
title: "會話管理"
---

> 此文件為 [English Version](/concepts/session_zh_TW) 的繁體中文版本。

# 會話管理 (Session Management)

OpenClaw 將 **每個代理人的一個直接對話會話 (Direct-chat session)** 視為主要會話。直接對話會歸併至 `agent:<agentId>:<mainKey>`（預設為 `main`），而群組/頻道對話則擁有各自獨立的金鑰。系統會遵循 `session.mainKey` 的設定。

使用 `session.dmScope` 可控制 **直接訊息 (私訊)** 如何進行分組：

- `main` (預設)：所有私訊共享主會話，以維持對話的連續性。
- `per-peer`：依據跨頻道的傳送者 ID 進行隔離。
- `per-channel-peer`：依據「頻道 + 傳送者」進行隔離（建議多使用者收件匣使用）。
- `per-account-channel-peer`：依據「帳號 + 頻道 + 傳送者」進行隔離（建議多帳號收件匣使用）。
  使用 `session.identityLinks` 可將帶有提供者前綴的同儕 ID 映射至一個規範身分 (Canonical identity)，使同一個人在使用 `per-peer` 等模式時能跨頻道共享私訊會話。

## 安全私訊模式 (建議多使用者環境使用)

> **安全性警告：** 如果您的代理人會接收來自 **多個人** 的私訊，強烈建議您啟用安全私訊模式。否則，所有使用者將共享同一個對話上下文，這可能導致使用者之間的隱私資訊外洩。

**預設設定下的問題範例：**

- Alice (`<傳送者_A>`) 傳訊給您的代理人討論私密話題（例如：醫療預約）。
- Bob (`<傳送者_B>`) 接著傳訊詢問：「我們剛才在聊什麼？」
- 由於兩人的私訊共享同一個會話，模型可能會使用 Alice 先前的上下文來回答 Bob。

**解決方案：** 設定 `dmScope` 以隔離每個使用者的會話：

```json5
// ~/.openclaw/openclaw.json
{
  session: {
    // 安全私訊模式：依據「頻道 + 傳送者」隔離私訊上下文。
    dmScope: "per-channel-peer",
  },
}
```

**何時應啟用此功能：**

- 您已為超過一位傳送者核准了配對。
- 您的私訊允許清單中包含多個項目。
- 您設定了 `dmPolicy: "open"`。
- 多個電話號碼或帳號可以傳訊給您的代理人。

注意事項：

- 預設值為 `dmScope: "main"`，旨在提供連貫性（所有私訊共享一個主會話）。這對於單使用者環境是沒問題的。
- 針對同一個頻道上的多帳號收件匣，建議使用 `per-account-channel-peer`。
- 如果同一個人透過多個頻道聯繫您，請使用 `session.identityLinks` 將其私訊會話歸併為一個規範身分。
- 您可以透過 `openclaw security audit` 驗證您的私訊設定（請參閱 [安全性](/cli/security_zh_TW)）。

## 閘道器為單一事實來源

所有會話狀態皆 **由閘道器擁有**（即「主控端」OpenClaw）。UI 用戶端（macOS App、WebChat 等）必須向閘道器查詢會話列表與 Token 計數，而非讀取本地檔案。

- 在 **遠端模式** 下，您所關心的對談存儲區位於遠端閘道器主機上，而非您的 Mac。
- UI 中顯示的 Token 計數來自閘道器的存儲欄位 (`inputTokens`, `outputTokens`, `totalTokens`, `contextTokens`)。用戶端不會自行解析 JSONL 轉錄紀錄來「修正」總數。

## 狀態儲存位置

- 在 **閘道器主機** 上：
  - 存儲檔案：`~/.openclaw/agents/<agentId>/sessions/sessions.json`（每個代理人一份）。
- 轉錄紀錄：`~/.openclaw/agents/<agentId>/sessions/<SessionId>.jsonl`（Telegram 主題會話使用 `.../<SessionId>-topic-<threadId>.jsonl`）。
- 存儲區是一個對照表 (Map) `sessionKey -> { sessionId, updatedAt, ... }`。刪除條目是安全的；系統會按需重新建立。
- 群組條目可能包含 `displayName`, `channel`, `subject`, `room` 與 `space` 等欄位，用於在 UI 中標註會話。
- 會話條目包含 `origin` 元數據（標籤 + 路由提示），以便 UI 說明會話來源。
- OpenClaw **不會** 讀取舊版的 Pi/Tau 對談資料夾。

## 會話修剪 (Session pruning)

預設情況下，OpenClaw 會在調用 LLM 之前，從記憶體上下文中裁切掉 **舊的工具執行結果**。這 **不會** 重寫磁碟上的 JSONL 歷史紀錄。請參閱 [/concepts/session-pruning](/concepts/session-pruning_zh_TW)。

## 壓縮前的記憶體清除 (Memory flush)

當會話接近自動壓縮門檻時，OpenClaw 可以執行一次 **無聲的記憶體清除** 回合，提醒模型將持久性筆記寫入磁碟。此功能僅在工作區可寫入時執行。請參閱 [記憶 (Memory)](/concepts/memory_zh_TW) 與 [壓縮機制 (Compaction)](/concepts/compaction_zh_TW)。

## 傳輸方式與會話金鑰的映射

- 直接對話遵循 `session.dmScope` 設定（預設為 `main`）。
  - `main`: `agent:<agentId>:<mainKey>`（跨裝置/頻道的連貫性）。
    - 多個電話號碼與頻道可以映射到同一個代理人主金鑰；它們作為進入同一個對話的傳輸管道。
  - `per-peer`: `agent:<agentId>:dm:<peerId>`。
  - `per-channel-peer`: `agent:<agentId>:<channel>:dm:<peerId>`。
  - `per-account-channel-peer`: `agent:<agentId>:<channel>:<accountId>:dm:<peerId>`（accountId 預設為 `default`）。
  - 若 `session.identityLinks` 匹配到帶有提供者前綴的同儕 ID（例如 `telegram:123`），則規範金鑰會取代 `<peerId>`，使同一個人在跨頻道時共享會話。
- 群組對話會隔離狀態：`agent:<agentId>:<channel>:group:<id>`（房間/頻道則使用 `agent:<agentId>:<channel>:channel:<id>`）。
  - Telegram 論壇主題會在群組 ID 後附加 `:topic:<threadId>` 以達成隔離。
  - 舊版的 `group:<id>` 金鑰仍會被識別以進行遷移。
- 傳入的上下文仍可能使用 `group:<id>`；頻道資訊會從 `Provider` 推論並規範化為 `agent:<agentId>:<channel>:group:<id>` 格式。
- 其他來源：
  - 排程任務 (Cron)：`cron:<job.id>`
  - Webhooks: `hook:<uuid>`（除非由 Hook 明確設定）
  - 節點執行：`node-<nodeId>`

## 生命週期

- 重設原則：會話會持續重用直到過期，過期判定會在下一次傳入訊息時進行評估。
- 每日重設：預設為 **閘道器主機當地時間凌晨 4:00**。若會話的最後更新時間早於最近一次每日重設時間，則視為過期。
- 閒置重設（選填）：`idleMinutes` 增加了一個滑動閒置窗口。當同時設定了每日重設與閒置重設時，**以先到期者為準** 強制開啟新會話。
- 舊版僅限閒置：若您僅設定 `session.idleMinutes` 而未配置 `session.reset`/`resetByType`，OpenClaw 會為了向後相容而維持在僅限閒置重設的模式。
- 各類型覆寫（選填）：`resetByType` 允許您針對 `direct`, `group` 與 `thread` 會話分別覆寫原則（thread 包含 Slack/Discord 討論串、Telegram 主題、以及由連接器提供的 Matrix 討論串）。
- 各頻道覆寫（選填）：`resetByChannel` 覆寫特定頻道的重設原則（適用於該頻道的各類會話，且優先權高於 `reset`/`resetByType`）。
- 重設觸發器：傳送精確的 `/new` 或 `/reset`（以及 `resetTriggers` 中的任何額外項目）會啟動一個全新的會話 ID，並將訊息的剩餘部分傳遞下去。`/new <model>` 接受模型別名、`provider/model` 或提供者名稱（模糊匹配）來設定新會話的模型。若單獨傳送 `/new` 或 `/reset`，OpenClaw 會執行一次簡短的「您好」問候回合以確認重設。
- 手動重設：從存儲區刪除特定金鑰，或移除 JSONL 轉錄檔；下一次訊息抵達時會重新建立它們。
- 隔離的 Cron 任務每次執行皆會產生全新的 `sessionId`（不進行閒置重用）。

## 發送原則 (選用)

無需列出個別 ID，即可阻擋特定會話類型的訊息遞送。

```json5
{
  session: {
    sendPolicy: {
      rules: [
        { action: "deny", match: { channel: "discord", chatType: "group" } },
        { action: "deny", match: { keyPrefix: "cron:" } },
      ],
      default: "allow",
    },
  },
}
```

執行階段覆寫（僅限擁有者）：

- `/send on` → 允許此會話發送
- `/send off` → 禁止此會話發送
- `/send inherit` → 清除覆寫，遵循組態規則
  請將這些指令作為獨立訊息發送以供註冊。

## 組態設定 (選用重新命名範例)

```json5
// ~/.openclaw/openclaw.json
{
  session: {
    scope: "per-sender", // 保持群組金鑰獨立
    dmScope: "main", // 私訊連貫性 (針對共享收件匣可設為 per-channel-peer/per-account-channel-peer)
    identityLinks: {
      alice: ["telegram:123456789", "discord:987654321012345678"],
    },
    reset: {
      // 預設值：mode=daily, atHour=4 (閘道器主機當地時間)。
      // 若同時設定 idleMinutes，則以先到期者為準。
      mode: "daily",
      atHour: 4,
      idleMinutes: 120,
    },
    resetByType: {
      thread: { mode: "daily", atHour: 4 },
      direct: { mode: "idle", idleMinutes: 240 },
      group: { mode: "idle", idleMinutes: 120 },
    },
    resetByChannel: {
      discord: { mode: "idle", idleMinutes: 10080 },
    },
    resetTriggers: ["/new", "/reset"],
    store: "~/.openclaw/agents/{agentId}/sessions/sessions.json",
    mainKey: "main",
  },
}
```

## 檢查會話

- `openclaw status` — 顯示存儲路徑與近期會話。
- `openclaw sessions --json` — 傾倒所有條目（可透過 `--active <分鐘>` 篩選）。
- `openclaw gateway call sessions.list --params '{}'` — 從執行中的閘道器獲取會話列表（遠端存取請使用 `--url`/`--token`）。
- 在聊天中發送 `/status` 作為獨立訊息，查看代理人是否可達、會話上下文已使用多少、目前的思考/詳細模式開關，以及您的 WhatsApp Web 憑證上次重新整理的時間（有助於判斷是否需重新連結）。
- 傳送 `/context list` 或 `/context detail` 查看系統提示詞內容與注入的工作區檔案（以及哪些部分佔用了最多上下文）。
- 傳送 `/stop` 作為獨立訊息來中止目前的執行回合、清除該會話排隊中的後續任務，並停止從中產生的任何子代理人執行（回覆內容會包含已停止的數量）。
- 傳送 `/compact`（選填指令）作為獨立訊息來摘要舊的上下文並釋放視窗空間。請參閱 [/concepts/compaction](/concepts/compaction_zh_TW)。
- 可以直接開啟 JSONL 轉錄紀錄檔案來檢視完整的對話回合。

## 小提示

- 保持主金鑰專用於 1:1 的流量；讓群組使用各自獨立的金鑰。
- 在進行自動化清理時，請刪除個別金鑰而非整個存儲區，以保留其他地方的上下文。

## 會話來源元數據 (Origin metadata)

每個會話條目都會在 `origin` 欄位中盡力記錄其來源：

- `label`: 易讀標籤（解析自對話標籤 + 群組主旨/頻道）。
- `provider`: 規範化的頻道 ID（包含擴充功能）。
- `from`/`to`: 來自傳入封裝的原始路由 ID。
- `accountId`: 提供者帳號 ID（多帳號時適用）。
- `threadId`: 執行緒/主題 ID（當頻道支援時）。
  私訊、頻道與群組都會填充這些來源欄位。如果一個連接器僅更新遞送路由（例如：為了保持私訊主會話最新），它仍應提供傳入上下文，以便會話保留其說明的元數據。擴充功能可以透過在傳入上下文中傳送 `ConversationLabel`, `GroupSubject`, `GroupChannel`, `GroupSpace` 與 `SenderName` 並調用 `recordSessionMetaFromInbound`（或將相同上下文傳遞給 `updateLastRoute`）來實現此功能。
