---
summary: "用於閘道器排程器的排程任務 (Cron jobs) 與喚醒機制說明"
read_when:
  - 排定背景任務或喚醒動作時
  - 串接應與心跳偵測同步或併行執行的自動化流程時
  - 在心跳偵測與排程任務之間做選擇時
title: "排程任務 (Cron Jobs)"
---

> 此文件為 [English Version](/automation/cron-jobs) 的繁體中文版本。

# 排程任務 (Cron jobs - 閘道器排程器)

> **排程任務 vs 心跳偵測？** 請參閱 [排程任務 vs 心跳偵測](/automation/cron-vs-heartbeat_zh_TW) 以了解兩者的使用時機。

Cron 是閘道器 (Gateway) 內建的排程器。它能持久化保存任務，在正確的時間喚醒代理人，並可選擇將輸出結果傳送回聊天頻道。

如果您想要 *「每天早上執行此操作」* 或 *「在 20 分鐘後提醒代理人」*，Cron 就是對應的機制。

故障排除：[/automation/troubleshooting](/automation/troubleshooting_zh_TW)

## 重點摘要 (TL;DR)

- Cron 執行於 **閘道器內部** (而非模型內部)。
- 任務持久化儲存於 `~/.openclaw/cron/` 下，因此重啟後不會遺失排程。
- 兩種執行風格：
  - **主會話 (Main session)**：將系統事件排入佇列，並在下一次心跳偵測時執行。
  - **隔離會話 (Isolated)**：在 `cron:<jobId>` 中執行獨立的代理人回合，並進行遞送（預設為「宣告 (Announce)」模式或「無」）。
- 喚醒機制是一等公民：任務可以要求「立即喚醒」或「隨下次心跳」。

## 快速上手 (可執行指令)

建立一個單次提醒，驗證其存在，並立即執行：

```bash
openclaw cron add 
  --name "提醒" 
  --at "2026-02-01T16:00:00Z" 
  --session main 
  --system-event "提醒：檢查排程任務文件草稿" 
  --wake now 
  --delete-after-run

openclaw cron list
openclaw cron run <任務ID>
openclaw cron runs --id <任務ID>
```

排定一個具備遞送功能的週期性隔離任務：

```bash
openclaw cron add 
  --name "晨間簡報" 
  --cron "0 7 * * *" 
  --tz "Asia/Taipei" 
  --session isolated 
  --message "摘要昨晚的更新內容。" 
  --announce 
  --channel slack 
  --to "channel:C1234567890"
```

## 工具調用的等效方式 (閘道器 Cron 工具)

關於標準的 JSON 格式與範例，請參閱 [工具調用的 JSON 架構 (Schema)](/automation/cron-jobs_zh_TW#工具調用的-JSON-架構-Schema)。

## 排程任務的儲存位置

排程任務預設持久化儲存於閘道器主機的 `~/.openclaw/cron/jobs.json`。閘道器會將該檔案載入記憶體，並在變動時寫回；因此僅建議在閘道器 **停止執行** 時才手動編輯此檔案。建議透過 `openclaw cron add/edit` 或 Cron 工具調用 API 進行變更。

## 新手概觀

您可以將排程任務視為：**何時** 執行 + 要 **做什麼**。

1. **選擇排程方式**
   - 單次提醒 → `schedule.kind = "at"` (CLI: `--at`)
   - 週期性任務 → `schedule.kind = "every"` 或 `schedule.kind = "cron"`
   - 如果您的 ISO 時間戳記省略了時區，系統會將其視為 **UTC**。

2. **選擇執行位置**
   - `sessionTarget: "main"` → 在下一次心跳偵測期間，連同主上下文一併執行。
   - `sessionTarget: "isolated"` → 在 `cron:<jobId>` 中執行獨立的代理人回合。

3. **選擇負載內容 (Payload)**
   - 主會話 → `payload.kind = "systemEvent"`
   - 隔離會話 → `payload.kind = "agentTurn"`

選填：單次執行任務 (`schedule.kind = "at"`) 在成功執行後預設會自動刪除。設定 `deleteAfterRun: false` 可保留該任務（執行後會自動停用）。

## 概念說明

### 任務 (Jobs)

一個排程任務是包含以下資訊的儲存記錄：

- **排程方式**（何時執行）
- **負載內容**（要做什麼）
- 選用的 **遞送模式**（宣告或無）
- 選用的 **代理人綁定** (`agentId`)：在特定代理人下執行該任務；若缺失或 ID 不明，則回退至預設代理人。

任務透過穩定的 `jobId` 進行識別（用於 CLI/閘道器 API）。在代理人工具調用中，`jobId` 是規範欄位；舊版的 `id` 為相容性而接受。單次執行任務成功後預設自動刪除。

### 排程方式 (Schedules)

Cron 支援三種排程種類：

- `at`: 透過 `schedule.at` 指定單次時間戳記 (ISO 8601)。
- `every`: 固定時間間隔 (單位：毫秒)。
- `cron`: 包含 5 個欄位的 Cron 表達式，可選填 IANA 時區。

Cron 表達式使用 `croner` 解析。若省略時區，則預設使用閘道器主機的本地時區。

### 主會話 vs 隔離執行

#### 主會話任務 (系統事件)

主會話任務會將系統事件排入佇列，並可選擇性地喚醒心跳執行器。這類任務必須使用 `payload.kind = "systemEvent"`。

- `wakeMode: "now"` (預設)：事件會立即觸發心跳偵測執行。
- `wakeMode: "next-heartbeat"`：事件會等待下一次預定的心跳偵測。

當您需要標準的心跳提示詞 + 主會話上下文時，這是最佳選擇。請參閱 [心跳偵測](/gateway/heartbeat_zh_TW)。

#### 隔離任務 (專用的 Cron 會話)

隔離任務在會話 `cron:<jobId>` 中執行獨立的代理人回合。

關鍵行為：

- 提示詞會加上 `[cron:<jobId> <任務名稱>]` 前綴，以便追溯。
- 每次執行皆使用 **全新的對談 ID**（不會承接先前的對話歷史）。
- 預設行為：若省略 `delivery` 設定，隔離任務會宣告摘要 (`delivery.mode = "announce"`)。
- `delivery.mode`（僅限隔離任務）決定後續動作：
  - `announce`: 將摘要遞送至目標頻道，並在主會話中發佈一段簡短摘要。
  - `none`: 僅在內部執行（不遞送訊息，不在主會話發佈摘要）。
- `wakeMode` 控制主會話摘要發佈的時間：
  - `now`: 立即觸發心跳。
  - `next-heartbeat`: 等待下一次預定的心跳。

針對頻繁、雜訊多或不應干擾主聊天紀錄的「背景雜務」，建議使用隔離任務。

### 負載結構 (Payload shapes)

支援兩種負載種類：

- `systemEvent`: 僅限主會話，透過心跳提示詞進行路由。
- `agentTurn`: 僅限隔離會話，執行獨立的代理人回合。

常見的 `agentTurn` 欄位：

- `message`: 必要的文字提示詞。
- `model` / `thinking`: 選用的覆寫設定（詳見下文）。
- `timeoutSeconds`: 選用的逾時覆寫。

遞送組態 (僅限隔離任務)：

- `delivery.mode`: `none` | `announce`。
- `delivery.channel`: `last` (最後通訊頻道) 或特定頻道名稱。
- `delivery.to`: 頻道專屬的目標（電話/聊天 ID/頻道 ID）。
- `delivery.bestEffort`: 即使宣告遞送失敗，也不將該任務標記為失敗。

「宣告式遞送 (Announce delivery)」會抑制該次執行中的訊息工具發送動作；請使用 `delivery.channel`/`delivery.to` 來指定聊天目標。當 `delivery.mode = "none"` 時，不會在主會話發佈任何摘要。

若隔離任務省略了 `delivery` 設定，OpenClaw 預設使用 `announce`。

#### 宣告式遞送流程

當 `delivery.mode = "announce"` 時，Cron 會透過外傳頻道適配器直接遞送。系統不會喚醒主代理人來撰寫或轉發訊息。

行為細節：

- 內容：遞送使用隔離執行的外傳負載（文字/媒體），並採用一般的切分與頻道格式化。
- 僅含心跳的回應（`HEARTBEAT_OK` 且無實質內容）不會被遞送。
- 若隔離執行已透過訊息工具向同一個目標發送過訊息，則會跳過遞送以避免重複。
- 若遞送目標缺失或無效，除非 `delivery.bestEffort = true`，否則任務會失敗。
- 僅在 `delivery.mode = "announce"` 時，才會在主會話發佈簡短摘要。
- 主會話摘要遵循 `wakeMode`：`now` 立即觸發心跳，`next-heartbeat` 則等待下一次心跳。

### 模型與思考等級覆寫

隔離任務 (`agentTurn`) 可以覆寫使用的模型與思考等級：

- `model`: 提供者/模型字串（例如：`anthropic/claude-sonnet-4-20250514`）或別名（例如：`opus`）。
- `thinking`: 思考等級 (`off`, `minimal`, `low`, `medium`, `high`, `xhigh`；僅適用於 GPT-5.2 + Codex 模型)。

注意：您也可以在主會話任務中設定 `model`，但這會改變共享的主會話模型。我們建議僅在隔離任務中使用模型覆寫，以避免非預期的上下文偏移。

解析優先順序：

1. 任務負載覆寫 (最高)
2. 鉤子專屬預設值 (例如：`hooks.gmail.model`)
3. 代理人組態預設值

### 遞送 (頻道 + 目標)

隔離任務可以透過頂層的 `delivery` 組態將輸出結果遞送至頻道：

- `delivery.mode`: `announce` (遞送摘要) 或 `none`。
- `delivery.channel`: `whatsapp` / `telegram` / `discord` / `slack` / `mattermost` (外掛) / `signal` / `imessage` / `last`。
- `delivery.to`: 頻道專屬的收件者目標。

遞送組態僅對隔離任務有效 (`sessionTarget: "isolated"`)。

若省略 `delivery.channel` 或 `delivery.to`，Cron 會回退使用主會話的「最後路徑 (last route)」（即代理人上次回覆的位置）。

目標格式提醒：

- Slack/Discord/Mattermost (外掛) 的目標應使用明確的前綴（例如 `channel:<id>`, `user:<id>`）以避免歧義。
- Telegram 主題應使用 `:topic:` 格式（見下文）。

#### Telegram 遞送目標 (主題 / 論壇執行緒)

Telegram 透過 `message_thread_id` 支援論壇主題。針對 Cron 遞送，您可以在 `to` 欄位中編碼主題資訊：

- `-1001234567890` (僅聊天 ID)
- `-1001234567890:topic:123` (建議方式：明確的主題標記)
- `-1001234567890:123` (簡寫：數字後綴)

同樣接受帶有前綴的目標，如 `telegram:...` / `telegram:group:...`：

- `telegram:group:-1001234567890:topic:123`

## 工具調用的 JSON 架構 (Schema)

當直接調用閘道器 `cron.*` 工具（代理人工具調用或 RPC）時，請使用下列結構。CLI 旗標接受如 `20m` 的易讀時間長度，但工具調用應針對 `schedule.at` 使用 ISO 8601 字串，針對 `schedule.everyMs` 使用毫秒。

### cron.add 參數

單次執行的主會話任務 (系統事件)：

```json
{
  "name": "提醒",
  "schedule": { "kind": "at", "at": "2026-02-01T16:00:00Z" },
  "sessionTarget": "main",
  "wakeMode": "now",
  "payload": { "kind": "systemEvent", "text": "提醒文字內容" },
  "deleteAfterRun": true
}
```

週期性執行的遞送隔離任務：

```json
{
  "name": "晨間簡報",
  "schedule": { "kind": "cron", "expr": "0 7 * * *", "tz": "Asia/Taipei" },
  "sessionTarget": "isolated",
  "wakeMode": "next-heartbeat",
  "payload": {
    "kind": "agentTurn",
    "message": "摘要昨晚的更新內容。"
  },
  "delivery": {
    "mode": "announce",
    "channel": "slack",
    "to": "channel:C1234567890",
    "bestEffort": true
  }
}
```

注意事項：

- `schedule.kind`: `at` (`at`), `every` (`everyMs`), 或 `cron` (`expr`, 選填 `tz`)。
- `schedule.at` 接受 ISO 8601 格式（時區選填；省略時視為 UTC）。
- `everyMs` 單位為毫秒。
- `sessionTarget` 必須為 `"main"` 或 `"isolated"`，且必須與 `payload.kind` 相符。
- 選填欄位：`agentId`, `description`, `enabled`, `deleteAfterRun` (針對 `at` 預設為 true), `delivery`。
- 若省略 `wakeMode`，預設為 `"now"`。

### cron.update 參數

```json
{
  "jobId": "job-123",
  "patch": {
    "enabled": false,
    "schedule": { "kind": "every", "everyMs": 3600000 }
  }
}
```

注意事項：

- `jobId` 是規範欄位；`id` 為相容性而接受。
- 在修補程式中設定 `agentId: null` 可清除代理人綁定。

### cron.run 與 cron.remove 參數

```json
{ "jobId": "job-123", "mode": "force" }
```

```json
{ "jobId": "job-123" }
```

## 儲存與歷史紀錄

- 任務存儲：`~/.openclaw/cron/jobs.json`（由閘道器管理的 JSON）。
- 執行歷史：`~/.openclaw/cron/runs/<jobId>.jsonl`（JSONL 格式，會自動修剪）。
- 覆寫儲存路徑：組態中的 `cron.store`。

## 組態設定

```json5
{
  cron: {
    enabled: true, // 預設為 true
    store: "~/.openclaw/cron/jobs.json",
    maxConcurrentRuns: 1, // 預設為 1
  },
}
```

完全停用 Cron：

- `cron.enabled: false` (組態)
- `OPENCLAW_SKIP_CRON=1` (環境變數)

## CLI 快速上手

單次提醒（UTC ISO，成功後自動刪除）：

```bash
openclaw cron add 
  --name "發送提醒" 
  --at "2026-01-12T18:00:00Z" 
  --session main 
  --system-event "提醒：提交報帳單。" 
  --wake now 
  --delete-after-run
```

單次提醒（主會話，立即喚醒）：

```bash
openclaw cron add 
  --name "行事曆檢查" 
  --at "20m" 
  --session main 
  --system-event "下次心跳：檢查行事曆。" 
  --wake now
```

週期性隔離任務（宣告至 WhatsApp）：

```bash
openclaw cron add 
  --name "晨間狀態" 
  --cron "0 7 * * *" 
  --tz "Asia/Taipei" 
  --session isolated 
  --message "摘要今天的收件匣與行事曆。" 
  --announce 
  --channel whatsapp 
  --to "+15551234567"
```

週期性隔離任務（遞送至 Telegram 主題）：

```bash
openclaw cron add 
  --name "夜間摘要 (主題)" 
  --cron "0 22 * * *" 
  --tz "Asia/Taipei" 
  --session isolated 
  --message "摘要今天的工作；發送至夜間主題。" 
  --announce 
  --channel telegram 
  --to "-1001234567890:topic:123"
```

具備模型與思考等級覆寫的隔離任務：

```bash
openclaw cron add 
  --name "深度分析" 
  --cron "0 6 * * 1" 
  --tz "Asia/Taipei" 
  --session isolated 
  --message "每週對專案進度進行深度分析。" 
  --model "opus" 
  --thinking high 
  --announce 
  --channel whatsapp 
  --to "+15551234567"
```

代理人選擇（多代理人環境）：

```bash
# 將任務固定至代理人 "ops"（若該代理人缺失則回退至預設值）
openclaw cron add --name "維運掃描" --cron "0 6 * * *" --session isolated --message "檢查維運佇列" --agent ops

# 切換或清除現有任務的代理人
openclaw cron edit <任務ID> --agent ops
openclaw cron edit <任務ID> --clear-agent
```

手動執行（預設為強制執行，使用 `--due` 則僅在到期時執行）：

```bash
openclaw cron run <任務ID>
openclaw cron run <任務ID> --due
```

編輯現有任務（修補欄位）：

```bash
openclaw cron edit <任務ID> 
  --message "更新後的提示詞" 
  --model "opus" 
  --thinking low
```

執行歷史紀錄：

```bash
openclaw cron runs --id <任務ID> --limit 50
```

不建立任務直接觸發即時系統事件：

```bash
openclaw system event --mode now --text "下次心跳：檢查電池電量。"
```

## 閘道器 API 介面

- `cron.list`, `cron.status`, `cron.add`, `cron.update`, `cron.remove`
- `cron.run` (強制或到期), `cron.runs`
  若需不經任務直接發送即時系統事件，請使用 [`openclaw system event`](/cli/system_zh_TW)。

## 故障排除

### 「任務完全不執行」

- 檢查 Cron 是否已啟用：`cron.enabled` 與 `OPENCLAW_SKIP_CRON`。
- 檢查閘道器是否持續執行中（Cron 在閘道器程序內部執行）。
- 針對 `cron` 排程：確認時區 (`--tz`) 設定與主機時區是否一致。

### 週期性任務在失敗後持續延遲

- OpenClaw 會在連續錯誤後，對週期性任務套用指數退避 (Retry backoff)：
  重試間隔分別為 30秒、1分鐘、5分鐘、15分鐘，隨後每次重試間隔 60分鐘。
- 下一次成功執行後，退避計時會自動重設。
- 單次執行 (`at`) 任務在進入終端狀態 (`ok`, `error`, 或 `skipped`) 後會自動停用，且不會重試。

### Telegram 遞送至錯誤位置

- 針對論壇主題，請務必使用 `-100…:topic:<id>` 格式，以確保明確且無歧義。
- 若在日誌或儲存的「最後路徑」目標中看到 `telegram:...` 前綴，這是正常的；Cron 遞送機制接受此格式並能正確解析主題 ID。
