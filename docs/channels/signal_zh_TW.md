---
summary: "透過 signal-cli (JSON-RPC + SSE) 支援 Signal 頻道、設定流程與帳號模型說明"
read_when:
  - 設定 Signal 支援功能時
  - 偵錯 Signal 訊息傳收時
title: "Signal"
---

> 此文件為 [English Version](/channels/signal_zh_TW) 的繁體中文版本。

# Signal (signal-cli)

狀態：透過外部 CLI 整合。閘道器透過 HTTP JSON-RPC + SSE 與 `signal-cli` 進行通訊。

## 快速設定 (新手適用)

1. 建議為機器人使用 **獨立的 Signal 門號**。
2. 安裝 `signal-cli`（環境需要安裝 Java）。
3. 連結機器人裝置並啟動守護行程：
   - `signal-cli link -n "OpenClaw"`
4. 配置 OpenClaw 並啟動閘道器。

最簡組態範例：

```json5
{
  channels: {
    signal: {
      enabled: true,
      account: "+15551234567",
      cliPath: "signal-cli",
      dmPolicy: "pairing",
      allowFrom: ["+15557654321"],
    },
  },
}
```

## 功能特性

- 透過 `signal-cli` 實現 Signal 頻道（非使用內嵌的 libsignal）。
- 確定性路由：回覆訊息一律傳回至 Signal。
- 私訊共享代理人的主會話；群組會話則各自隔離 (`agent:<agentId>:signal:group:<groupId>`)。

## 組態寫入

預設情況下，Signal 允許透過 `/config set|unset` 觸發組態更新（需設定 `commands.config: true`）。

停用方式：

```json5
{
  channels: { signal: { configWrites: false } },
}
```

## 帳號模型 (重要)

- 閘道器連線至一個 **Signal 裝置**（即 `signal-cli` 帳號）。
- 如果您將機器人執行在 **您的個人 Signal 帳號** 上，它會忽略您自己發出的訊息（迴圈保護機制）。
- 若要實現「我傳訊給機器人，它回覆我」的功能，請使用 **獨立的機器人門號**。

## 設定流程 (快速路徑)

1. 安裝 `signal-cli`（需要 Java）。
2. 連結機器人帳號：
   - 執行 `signal-cli link -n "OpenClaw"`，然後使用手機 Signal 掃描產生的 QR Code。
3. 配置 Signal 並啟動閘道器。

範例：

```json5
{
  channels: {
    signal: {
      enabled: true,
      account: "+15551234567",
      cliPath: "signal-cli",
      dmPolicy: "pairing",
      allowFrom: ["+15557654321"],
    },
  },
}
```

多帳號支援：使用 `channels.signal.accounts` 進行各帳號獨立組態，並可選用 `name` 欄位。詳情請參閱 [`閘道器組態`](/gateway/configuration_zh_TW#telegramaccounts--discordaccounts--slackaccounts--signalaccounts--imessageaccounts) 中的共用模式。

## 外部守護行程模式 (httpUrl)

如果您想自行管理 `signal-cli`（例如解決 JVM 冷啟動緩慢、容器初始化或共用 CPU 資源等問題），請獨立執行該守護行程並將 OpenClaw 指向它：

```json5
{
  channels: {
    signal: {
      httpUrl: "http://127.0.0.1:8080",
      autoStart: false,
    },
  },
}
```

這會跳過 OpenClaw 內部的自動啟動 (auto-spawn) 與啟動等待。若自動啟動時載入較慢，可設定 `channels.signal.startupTimeoutMs`。

## 存取控制 (私訊 + 群組)

私訊 (DMs)：

- 預設值：`channels.signal.dmPolicy = "pairing"`。
- 未知傳送者會收到配對碼；訊息在核准前會被忽略（配對碼 1 小時後過期）。
- 核准方式：
  - `openclaw pairing list signal`
  - `openclaw pairing approve signal <配對碼>`
- 「配對」是 Signal 私訊預設的 Token 交換方式。詳情請見：[配對](/channels/pairing_zh_TW)。
- 僅有 UUID 的傳送者（來自 `sourceUuid`）會以 `uuid:<id>` 格式儲存於 `channels.signal.allowFrom`。

群組：

- `channels.signal.groupPolicy = open | allowlist | disabled`。
- 當設定為 `allowlist` 時，`channels.signal.groupAllowFrom` 用於控制誰能觸發群組會話。

## 運作行為

- `signal-cli` 以守護行程執行；閘道器透過 SSE 讀取事件。
- 傳入訊息會規範化為共享的頻道封裝 (Envelope)。
- 回覆一律路由回相同的號碼或群組。

## 媒體與限制

- 傳出文字會根據 `channels.signal.textChunkLimit`（預設 4000）進行分塊。
- 選用的換行分塊：設定 `channels.signal.chunkMode="newline"` 可在長度分塊前，先依據空白行（段落邊界）進行切分。
- 支援附件（從 `signal-cli` 抓取的 Base64 數據）。
- 預設媒體大小上限：`channels.signal.mediaMaxMb`（預設 8）。
- 使用 `channels.signal.ignoreAttachments` 可跳過下載媒體檔案。
- 群組歷史上下文使用 `channels.signal.historyLimit`（或各帳號的 `historyLimit`），備援為 `messages.groupChat.historyLimit`。設為 `0` 可停用（預設為 50）。

## 正在輸入狀態與已讀標記

- **正在輸入指示器 (Typing indicators)**：OpenClaw 透過 `signal-cli sendTyping` 發送輸入信號，並在代理人處理回覆期間持續更新。
- **已讀標記 (Read receipts)**：當 `channels.signal.sendReadReceipts` 為 true 時，OpenClaw 會為被允許的私訊轉發已讀標記。
- `signal-cli` 目前不支援群組的已讀標記功能。

## 心情回應 (訊息工具)

- 使用 `message` 工具，動作設定為 `action=react`，頻道設定為 `channel=signal`。
- 目標對象：傳送者的 E.164 號碼或 UUID（使用配對輸出中的 `uuid:<id>`；單純的 UUID 亦可）。
- `messageId` 為您要回應之訊息的 Signal 時間戳記。
- 群組心情回應需要指定 `targetAuthor` 或 `targetAuthorUuid`。

範例：

```
message action=react channel=signal target=uuid:123e4567-e89b-12d3-a456-426614174000 messageId=1737630212345 emoji=🔥
message action=react channel=signal target=+15551234567 messageId=1737630212345 emoji=🔥 remove=true
message action=react channel=signal target=signal:group:<groupId> targetAuthor=uuid:<sender-uuid> messageId=1737630212345 emoji=✅
```

相關組態：

- `channels.signal.actions.reactions`：啟用/停用心情回應動作（預設為 true）。
- `channels.signal.reactionLevel`：`off | ack | minimal | extensive`。
  - `off`/`ack` 會停用代理人的心情回應（訊息工具的 `react` 會報錯）。
  - `minimal`/`extensive` 啟用代理人心情回應並設定引導等級。
- 個別帳號覆寫：`channels.signal.accounts.<id>.actions.reactions`, `channels.signal.accounts.<id>.reactionLevel`。

## 傳遞目標 (CLI/Cron)

- 私訊：`signal:+15551234567` (或純 E.164 號碼)。
- UUID 私訊：`uuid:<id>` (或純 UUID)。
- 群組：`signal:group:<groupId>`。
- 使用者名稱：`username:<名稱>`（若您的 Signal 帳號支援此功能）。

## 故障排除

請先依照此階梯進行檢查：

```bash
openclaw status
openclaw gateway status
openclaw logs --follow
openclaw doctor
openclaw channels status --probe
```

如有需要，請確認私訊配對狀態：

```bash
openclaw pairing list signal
```

常見故障原因：

- 守護行程可達但無回覆：驗證帳號/守護行程設定 (`httpUrl`, `account`) 與接收模式。
- 私訊被忽略：傳送者尚待配對核准。
- 群組訊息被忽略：群組傳送者/提及門控機制阻擋了遞送。

詳細分流流程請見：[/channels/troubleshooting](/channels/troubleshooting_zh_TW)。

## Signal 組態參考

完整組態說明：[組態設定](/gateway/configuration_zh_TW)

提供者選項：

- `channels.signal.enabled`：啟用/停用頻道啟動。
- `channels.signal.account`：機器人帳號的 E.164 號碼。
- `channels.signal.cliPath`：`signal-cli` 的執行路徑。
- `channels.signal.httpUrl`：守護行程的完整 URL（會覆寫主機/連接埠設定）。
- `channels.signal.httpHost`, `channels.signal.httpPort`：守護行程綁定位置（預設 127.0.0.1:8080）。
- `channels.signal.autoStart`：自動啟動守護行程（若未設定 `httpUrl` 則預設為 true）。
- `channels.signal.startupTimeoutMs`：啟動等待逾時 (ms)，上限 120000。
- `channels.signal.receiveMode`：`on-start | manual`。
- `channels.signal.ignoreAttachments`：跳過附件下載。
- `channels.signal.ignoreStories`：忽略來自守護行程的限時動態。
- `channels.signal.sendReadReceipts`：轉發已讀標記。
- `channels.signal.dmPolicy`：`pairing | allowlist | open | disabled` (預設：pairing)。
- `channels.signal.allowFrom`：私訊允許清單（E.164 或 `uuid:<id>`）。`open` 模式需要包含 `"*"`。Signal 不支援使用者名稱；請使用電話或 UUID。
- `channels.signal.groupPolicy`：`open | allowlist | disabled` (預設：allowlist)。
- `channels.signal.groupAllowFrom`：群組傳送者允許清單。
- `channels.signal.historyLimit`：作為上下文包含的群組訊息最大數量（0 為停用）。
- `channels.signal.dmHistoryLimit`：以使用者回合為單位的私訊歷史限制。個別使用者覆寫：`channels.signal.dms["<號碼或UUID>"].historyLimit`。
- `channels.signal.textChunkLimit`：傳出訊息的分塊大小（字元數）。
- `channels.signal.chunkMode`：`length` (預設) 或 `newline`（在長度切分前先依據段落邊界切分）。
- `channels.signal.mediaMaxMb`：傳入/傳出媒體的大小上限 (MB)。

相關的全域選項：

- `agents.list[].groupChat.mentionPatterns`（Signal 不支援原生提及）。
- `messages.groupChat.mentionPatterns`（全域備援）。
- `messages.responsePrefix`。
