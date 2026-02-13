---
summary: "心跳偵測 (Heartbeat) 輪詢訊息與通知規則說明"
read_when:
  - 調整心跳頻率或訊息內容時
  - 在心跳偵測與排程任務 (Cron) 之間做選擇時
title: "心跳偵測"
---

> 此文件為 [English Version](/gateway/heartbeat) 的繁體中文版本。

# 心跳偵測 (Heartbeat - 閘道器)

> **心跳偵測 vs 排程任務 (Cron)？** 請參閱 [排程任務 vs 心跳偵測](/automation/cron-vs-heartbeat_zh_TW) 以了解兩者的使用時機。

心跳偵測會在主會話中執行 **定期的代理人回合**，讓模型能主動回報需要注意的事項，而不會對您造成過度干擾。

故障排除：[/automation/troubleshooting](/automation/troubleshooting_zh_TW)

## 快速上手 (新手適用)

1. 保持心跳偵測啟用（預設為 `30m`，若偵測到 Anthropic OAuth/setup-token 則為 `1h`），或者設定您自己的頻率。
2. 在代理人工作區中建立一個簡單的 `HEARTBEAT.md` 檢查清單（選填但強烈建議）。
3. 決定心跳訊息的發送目標（預設為 `target: "last"`）。
4. 選填：啟用心跳推理 (reasoning) 遞送，以提升透明度。
5. 選填：限制心跳偵測僅在活躍時段（當地時間）執行。

組態範例：

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "last",
        // activeHours: { start: "08:00", end: "24:00" },
        // includeReasoning: true, // 選填：同時傳送獨立的 `Reasoning:` 訊息
      },
    },
  },
}
```

## 預設值

- 間隔時間：`30m`（偵測到 Anthropic OAuth/setup-token 驗證模式時為 `1h`）。可透過 `agents.defaults.heartbeat.every` 或各代理人的 `agents.list[].heartbeat.every` 設定；設為 `0m` 即可停用。
- 提示詞內容（可透過 `agents.defaults.heartbeat.prompt` 自訂）：
  `Read HEARTBEAT.md if it exists (workspace context). Follow it strictly. Do not infer or repeat old tasks from prior chats. If nothing needs attention, reply HEARTBEAT_OK.`
- 心跳提示詞會 **逐字地** 作為使用者訊息傳送。系統提示詞包含一個「Heartbeat」區段，且該回合會在內部標記。
- 活躍時段 (`heartbeat.activeHours`) 會根據設定的時區進行檢查。在該時段之外，心跳偵測會被跳過，直到進入下一個時段窗口。

## 心跳提示詞的用途

預設提示詞的設計刻意保持寬泛：

- **背景任務**：「考慮待處理任務 (Consider outstanding tasks)」會引導代理人檢閱後續事項（收件匣、行事曆、提醒事項、排隊的工作），並回報任何緊急事項。
- **使用者關懷**：「白天偶爾檢查一下您的使用者 (Checkup sometimes on your human during day time)」會引導代理人偶爾發送輕量級的「有什麼需要幫忙的嗎？」訊息，並透過您設定的本地時區避免在深夜造成干擾（請參閱 [/concepts/timezone](/concepts/timezone_zh_TW)）。

如果您希望心跳偵測執行非常具體的操作（例如「檢查 Gmail PubSub 統計數據」或「驗證閘道器健康度」），請將 `agents.defaults.heartbeat.prompt`（或 `agents.list[].heartbeat.prompt`）設定為自訂內容（將逐字發送）。

## 回應規範

- 如果沒有需要注意的事項，代理人應回覆 **`HEARTBEAT_OK`**。
- 在心跳執行期間，OpenClaw 會將出現在回覆 **開頭或結尾** 的 `HEARTBEAT_OK` 視為確認 (ack)。該字串會被移除，若其餘內容長度 **≤ `ackMaxChars`**（預設：300），則該回覆會被捨棄而不發送。
- 如果 `HEARTBEAT_OK` 出現在回覆的 **中間**，則不會被特殊處理。
- 對於警報/通知，**請勿** 包含 `HEARTBEAT_OK`；僅需傳回警報文字。

在心跳偵測之外，訊息開頭/結尾若出現孤立的 `HEARTBEAT_OK` 會被移除並記錄；若訊息內容僅有 `HEARTBEAT_OK` 則會被捨棄。

## 組態設定

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m", // 預設：30m (0m 停用)
        model: "anthropic/claude-opus-4-6",
        includeReasoning: false, // 預設：false (可用時傳送獨立的 Reasoning: 訊息)
        target: "last", // last | none | <頻道 ID> (內建或外掛，例如 "bluebubbles")
        to: "+15551234567", // 選填的頻道專屬覆寫
        accountId: "ops-bot", // 選填的多帳號頻道 ID
        prompt: "Read HEARTBEAT.md if it exists (workspace context). Follow it strictly. Do not infer or repeat old tasks from prior chats. If nothing needs attention, reply HEARTBEAT_OK.",
        ackMaxChars: 300, // HEARTBEAT_OK 之後允許的最大字元數
      },
    },
  },
}
```

### 範圍與優先順序

- `agents.defaults.heartbeat` 設定全域的心跳行為。
- `agents.list[].heartbeat` 會覆蓋全域設定；若有任何代理人定義了 `heartbeat` 區段，則 **僅有這些代理人** 會執行心跳偵測。
- `channels.defaults.heartbeat` 設定所有頻道的預設可見度。
- `channels.<channel>.heartbeat` 覆寫頻道的預設值。
- `channels.<channel>.accounts.<id>.heartbeat` (多帳號頻道) 覆寫各頻道的設定。

### 個別代理人的心跳偵測

若任何 `agents.list[]` 項目包含 `heartbeat` 區段，則 **僅有這些代理人** 會執行心跳偵測。各代理人的設定會覆蓋 `agents.defaults.heartbeat` 的設定（因此您可以先設定一次共用的預設值，再針對個別代理人進行覆寫）。

範例：有兩個代理人，僅第二個代理人執行心跳偵測。

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "last",
      },
    },
    list: [
      { id: "main", default: true },
      {
        id: "ops",
        heartbeat: {
          every: "1h",
          target: "whatsapp",
          to: "+15551234567",
          prompt: "Read HEARTBEAT.md if it exists (workspace context). Follow it strictly. Do not infer or repeat old tasks from prior chats. If nothing needs attention, reply HEARTBEAT_OK.",
        },
      },
    ],
  },
}
```

### 活躍時段範例

將心跳偵測限制在特定時區的工作時間內：

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "last",
        activeHours: {
          start: "09:00",
          end: "22:00",
          timezone: "Asia/Taipei", // 選填；若有設定則使用您的 userTimezone，否則使用主機時區
        },
      },
    },
  },
}
```

在此時段外（台北時間上午 9 點前或晚上 10 點後），心跳偵測會被跳過。進入時段後的下一個預定計時點將正常執行。

### 多帳號範例

使用 `accountId` 針對多帳號頻道（如 Telegram）中的特定帳號：

```json5
{
  agents: {
    list: [
      {
        id: "ops",
        heartbeat: {
          every: "1h",
          target: "telegram",
          to: "12345678",
          accountId: "ops-bot",
        },
      },
    ],
  },
  channels: {
    telegram: {
      accounts: {
        "ops-bot": { botToken: "您的_TELEGRAM_BOT_TOKEN" },
      },
    },
  },
}
```

### 欄位說明

- `every`：心跳間隔（時間長度字串；預設單位為分鐘）。
- `model`：選用的心跳執行模型覆寫 (`provider/model`)。
- `includeReasoning`：啟用後，當可用時會額外傳送獨立的 `Reasoning:` 訊息（格式與 `/reasoning on` 相同）。
- `session`：選用的心跳執行對談金鑰。
  - `main` (預設)：代理人的主會話。
  - 明確的對談金鑰（可從 `openclaw sessions --json` 或 [會話 CLI](/cli/sessions_zh_TW) 複製）。
  - 對談金鑰格式：請參閱 [會話](/concepts/session_zh_TW) 與 [群組](/channels/groups_zh_TW)。
- `target`：
  - `last` (預設)：傳遞至最後使用的外部頻道。
  - 明確頻道：`whatsapp` / `telegram` / `discord` / `googlechat` / `slack` / `msteams` / `signal` / `imessage`。
  - `none`：執行心跳偵測但 **不對外傳遞** 訊息。
- `to`：選用的收件者覆寫（頻道專屬 ID，例如 WhatsApp 的 E.164 格式或 Telegram 的聊天 ID）。
- `accountId`：選用的多帳號頻道帳號 ID。當 `target: "last"` 時，帳號 ID 僅在解析出的最後頻道支援帳號功能時生效，否則會被忽略。若帳號 ID 與解析出的頻道組態不符，則會跳過傳遞。
- `prompt`：覆寫預設的提示詞內容（非合併方式）。
- `ackMaxChars`：在傳遞前，`HEARTBEAT_OK` 之後允許的最大字元數。
- `activeHours`：將心跳執行限制在特定時間窗口。包含 `start` (HH:MM，包含), `end` (HH:MM，不包含；`24:00` 表示到當天結束)，以及選用的 `timezone`。
  - 省略或 `"user"`：使用您的 `agents.defaults.userTimezone`（若有設定），否則回退到主機系統時區。
  - `"local"`：一律使用主機系統時區。
  - 任何 IANA 識別碼（如 `Asia/Taipei`）：直接使用；若無效則回退至上述的 `"user"` 行為。
  - 在活躍窗口外，心跳偵測會被跳過，直到進入下一個時段窗口。

## 傳遞行為

- 預設情況下，心跳偵測在代理人的主會話中執行 (`agent:<id>:<mainKey>`)，或者當 `session.scope = "global"` 時在 `global` 中執行。可設定 `session` 覆寫為特定的頻道會話 (Discord/WhatsApp 等)。
- `session` 僅影響執行的上下文；傳遞則由 `target` 與 `to` 控制。
- 若要傳遞給特定的頻道/收件者，請設定 `target` + `to`。若使用 `target: "last"`，則會使用該會話最後使用的外部頻道。
- 如果主佇列繁忙，心跳偵測會被跳過並在稍後重試。
- 如果 `target` 解析為無外部目的地，執行仍會發生但不會發送外傳訊息。
- 僅含心跳回應的內容 **不會** 延長會話的活躍時間；系統會還原最後的 `updatedAt` 時間，使閒置過期行為保持正常。

## 可見度控制

預設情況下，`HEARTBEAT_OK` 的確認訊息會被隱藏，僅傳遞警報內容。您可以針對各頻道或各帳號進行調整：

```yaml
channels:
  defaults:
    heartbeat:
      showOk: false # 隱藏 HEARTBEAT_OK (預設)
      showAlerts: true # 顯示警報訊息 (預設)
      useIndicator: true # 發出指示器事件 (預設)
  telegram:
    heartbeat:
      showOk: true # 在 Telegram 上顯示 OK 確認訊息
  whatsapp:
    accounts:
      work:
        heartbeat:
          showAlerts: false # 抑制此帳號的警報傳遞
```

優先順序：個別帳號 → 個別頻道 → 頻道預設值 → 內建預設值。

### 各項旗標的功能

- `showOk`：當模型傳回僅含 OK 的回覆時，發送 `HEARTBEAT_OK` 確認訊息。
- `showAlerts`：當模型傳回非 OK 的回覆時，發送警報內容。
- `useIndicator`：為 UI 狀態介面發出指示器 (indicator) 事件。

如果 **三項皆為 false**，OpenClaw 會完全跳過該次心跳偵測執行（不調用模型）。

### 個別頻道 vs 個別帳號範例

```yaml
channels:
  defaults:
    heartbeat:
      showOk: false
      showAlerts: true
      useIndicator: true
  slack:
    heartbeat:
      showOk: true # 所有 Slack 帳號
    accounts:
      ops:
        heartbeat:
          showAlerts: false # 僅抑制 ops 帳號的警報
  telegram:
    heartbeat:
      showOk: true
```

### 常見模式

| 目標 | 組態設定 |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| 預設行為 (無聲 OK, 警報開啟) | *(無需設定)* |
| 完全靜音 (無訊息, 無指示器) | `channels.defaults.heartbeat: { showOk: false, showAlerts: false, useIndicator: false }` |
| 僅顯示指示器 (無訊息) | `channels.defaults.heartbeat: { showOk: false, showAlerts: false, useIndicator: true }` |
| 僅在單一頻道顯示 OK | `channels.telegram.heartbeat: { showOk: true }` |

## HEARTBEAT.md (選填)

如果工作區中存在 `HEARTBEAT.md` 檔案，預設提示詞會引導代理人讀取它。您可以將其視為「心跳檢查清單」：內容簡短、穩定且每 30 分鐘包含一次是安全的。

如果 `HEARTBEAT.md` 存在但內容實際上為空（僅有空白行或如 `# Heading` 的 Markdown 標題），OpenClaw 會跳過該次執行以節省 API 調用成本。如果檔案缺失，心跳偵測仍會執行，並由模型決定該做什麼。

請保持內容極簡（短清單或提醒），以避免提示詞膨脹 (bloat)。

`HEARTBEAT.md` 範例：

```md
# 心跳檢查清單

- 快速掃描：收件匣中是否有緊急事項？
- 若現在是白天且無待處理事項，進行簡單的問候。
- 若任務受阻，記下「缺失內容」並在下次 Peter 上線時詢問。
```

### 代理人可以更新 HEARTBEAT.md 嗎？

可以 —— 只要您要求它這麼做。

`HEARTBEAT.md` 只是代理人工作區中的一個普通檔案，因此您可以在一般對談中告訴代理人：

- 「更新 `HEARTBEAT.md`，加入每日行事曆檢查。」
- 「重寫 `HEARTBEAT.md`，讓它更精簡並專注於收件匣後續處理。」

如果您希望這能自動發生，也可以在心跳提示詞中加入明確的指令，例如：「如果檢查清單已過時，請用更好的內容更新 HEARTBEAT.md。」

安全性提示：請勿將機密資訊（API 密鑰、電話號碼、私密 Token）放入 `HEARTBEAT.md` —— 它會成為提示詞上下文的一部分。

## 手動喚醒 (隨選)

您可以將系統事件排入佇列，並透過以下指令立即觸發心跳偵測：

```bash
openclaw system event --text "檢查緊急後續事項" --mode now
```

如果有多個代理人設定了 `heartbeat`，手動喚醒會立即執行每個代理人的心跳偵測。

使用 `--mode next-heartbeat` 則會等待下一個預定的計時點。

## 推理遞送 (選用)

預設情況下，心跳偵測僅傳遞最終的「答案」負載。

如果您希望提升透明度，請啟用：

- `agents.defaults.heartbeat.includeReasoning: true`

啟用後，心跳偵測會額外傳送一則前綴為 `Reasoning:` 的訊息（格式與 `/reasoning on` 相同）。當代理人管理多個會話/程式碼庫且您想知道它為什麼決定聯絡您時，這非常有用 —— 但這也可能洩漏比您預期更多的內部細節。建議在群組聊天中保持關閉。

## 成本意識

心跳偵測會執行完整的代理人回合。較短的間隔會消耗更多 Token。請保持 `HEARTBEAT.md` 簡短，並考慮使用更便宜的 `model`，或在僅需內部狀態更新時設定 `target: "none"`。
