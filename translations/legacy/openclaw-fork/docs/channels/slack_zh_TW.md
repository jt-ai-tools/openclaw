---
summary: "Slack 設定與執行階段行為說明 (Socket 模式 + HTTP 事件 API)"
read_when:
  - 設定 Slack 或偵錯 Slack Socket/HTTP 模式時
title: "Slack"
---

> 此文件為 [English Version](/channels/slack_zh_TW) 的繁體中文版本。

# Slack

狀態：透過 Slack 應用程式整合達成 **生產就緒 (production-ready)**，支援私訊 (DMs) 與頻道通訊。預設使用 Socket 模式；同樣支援 HTTP 事件 API (HTTP Events API) 模式。

<CardGroup cols={3}>
  <Card title="配對 (Pairing)" icon="link" href="/channels/pairing_zh_TW">
    Slack 私訊預設為配對模式。
  </Card>
  <Card title="斜線指令" icon="terminal" href="/tools/slash-commands_zh_TW">
    原生指令行為與指令型錄。
  </Card>
  <Card title="頻道故障排除" icon="wrench" href="/channels/troubleshooting_zh_TW">
    跨頻道的診斷與修復指南。
  </Card>
</CardGroup>

## 快速設定

<Tabs>
  <Tab title="Socket 模式 (預設)">
    <Steps>
      <Step title="建立 Slack 應用程式與 Token">
        在 Slack 應用程式設定中：

        - 啟用 **Socket Mode**
        - 建立具備 `connections:write` 權限的 **App Token** (`xapp-...`)
        - 安裝應用程式並複製 **Bot Token** (`xoxb-...`)
      </Step>

      <Step title="配置 OpenClaw">

```json5
{
  channels: {
    slack: {
      enabled: true,
      mode: "socket",
      appToken: "xapp-...",
      botToken: "xoxb-...",
    },
  },
}
```

        針對預設帳號的環境變數備援：

```bash
SLACK_APP_TOKEN=xapp-...
SLACK_BOT_TOKEN=xoxb-...
```

      </Step>

      <Step title="訂閱應用程式事件">
        為機器人訂閱以下事件：

        - `app_mention`
        - `message.channels`, `message.groups`, `message.im`, `message.mpim`
        - `reaction_added`, `reaction_removed`
        - `member_joined_channel`, `member_left_channel`
        - `channel_rename`
        - `pin_added`, `pin_removed`

        此外，請在 App Home 中啟用 **Messages Tab** 以支援私訊功能。
      </Step>

      <Step title="啟動閘道器">

```bash
openclaw gateway
```

      </Step>
    </Steps>

  </Tab>

  <Tab title="HTTP 事件 API 模式">
    <Steps>
      <Step title="配置 Slack 應用程式為 HTTP 模式">

        - 將模式設為 HTTP (`channels.slack.mode="http"`)
        - 複製 Slack 的 **Signing Secret** (簽署秘密)
        - 將 Event Subscriptions + Interactivity + Slash command 的 Request URL 設定為同一個 Webhook 路徑（預設為 `/slack/events`）

      </Step>

      <Step title="配置 OpenClaw HTTP 模式">

```json5
{
  channels: {
    slack: {
      enabled: true,
      mode: "http",
      botToken: "xoxb-...",
      signingSecret: "您的簽署秘密",
      webhookPath: "/slack/events",
    },
  },
}
```

      </Step>

      <Step title="多帳號 HTTP 模式請使用唯一路徑">
        支援多帳號的 HTTP 模式。

        請為每個帳號提供不同的 `webhookPath`，以避免註冊衝突。
      </Step>
    </Steps>

  </Tab>
</Tabs>

## Token 模型

- Socket 模式需要 `botToken` 與 `appToken`。
- HTTP 模式需要 `botToken` 與 `signingSecret`。
- 組態中的 Token 值優先於環境變數。
- 環境變數 `SLACK_BOT_TOKEN` / `SLACK_APP_TOKEN` 僅適用於預設帳號。
- `userToken` (`xoxp-...`) 僅能透過組態設定（無環境變數備援），且預設為唯讀行為 (`userTokenReadOnly: true`)。

<Tip>
對於執行動作或讀取目錄資訊，若有配置使用者 Token (User Token)，系統會優先使用。對於寫入操作，仍優先使用機器人 Token (Bot Token)；僅在 `userTokenReadOnly: false` 且機器人 Token 不可用時，才允許使用使用者 Token 進行寫入。
</Tip>

## 存取控制與路由

<Tabs>
  <Tab title="私訊原則">
    `channels.slack.dm.policy` 控制私訊存取權：

    - `pairing` (預設)
    - `allowlist`
    - `open` (需要 `dm.allowFrom` 包含 `"*"` )
    - `disabled`

    私訊相關旗標：

    - `dm.enabled` (預設為 true)
    - `dm.allowFrom`
    - `dm.groupEnabled` (群組私訊預設為 false)
    - `dm.groupChannels` (選用的 MPIM 允許清單)

    私訊配對核准請執行 `openclaw pairing approve slack <配對碼>`。

  </Tab>

  <Tab title="頻道原則">
    `channels.slack.groupPolicy` 控制頻道處理方式：

    - `open`
    - `allowlist`
    - `disabled`

    頻道允許清單定義於 `channels.slack.channels`。

    執行階段註記：若完全缺失 `channels.slack` 區塊（僅透過環境變數設定）且未設定 `channels.defaults.groupPolicy`，執行階段將回退至 `groupPolicy="open"` 並記錄警告。

    名稱/ID 解析：

    - 頻道與私訊允許清單項目會在啟動時，若 Token 權限允許則自動進行解析。
    - 無法解析的項目將保持原組態設定。

  </Tab>

  <Tab title="提及與頻道使用者">
    頻道訊息預設受提及門檻 (mention-gated) 控管。

    提及來源：

    - 明確的應用程式提及 (`<@botId>`)
    - 提及正規表示式模式 (`agents.list[].groupChat.mentionPatterns`，備援為 `messages.groupChat.mentionPatterns`)
    - 在支援的情況下，隱式的「回覆機器人」討論串行為

    各頻道獨立控制項 (`channels.slack.channels.<id|名稱>`):

    - `requireMention`
    - `users` (允許清單)
    - `allowBots`
    - `skills`
    - `systemPrompt`
    - `tools`, `toolsBySender`

  </Tab>
</Tabs>

## 指令與斜線行為

- Slack 的原生指令自動模式為 **關閉** (`commands.native: "auto"` 不會啟用 Slack 原生指令)。
- 透過 `channels.slack.commands.native: true`（或全域 `commands.native: true`）啟用 Slack 原生指令處理程式。
- 啟用原生指令後，請在 Slack 中註冊對應的斜線指令 (`/<command>` 名稱)。
- 若未啟用原生指令，您仍可透過 `channels.slack.slashCommand` 執行單個已配置的斜線指令。

預設斜線指令設定：

- `enabled: false`
- `name: "openclaw"`
- `sessionPrefix: "slack:slash"`
- `ephemeral: true` (暫時性訊息)

斜線指令會話使用隔離的金鑰：

- `agent:<agentId>:slack:slash:<userId>`

並且仍會針對目標對話會話執行指令 (`CommandTargetSessionKey`)。

## 討論串、會話與回覆標籤

- 私訊路由為 `direct`；頻道路由為 `channel`；多人私訊 (MPIM) 路由為 `group`。
- 在預設的 `session.dmScope=main` 設定下，Slack 私訊會歸併至代理人的主會話。
- 頻道會話格式：`agent:<agentId>:slack:channel:<channelId>`。
- 討論串回覆在適用時會建立討論串會話後綴 (`:thread:<threadTs>`)。
- `channels.slack.thread.historyScope` 預設為 `thread`；`thread.inheritParent` 預設為 `false`。

回覆執行緒控制項：

- `channels.slack.replyToMode`: `off|first|all` (預設為 `off`)
- `channels.slack.replyToModeByChatType`: 針對 `direct|group|channel` 分別設定
- 私訊的舊版備援項：`channels.slack.dm.replyToMode`

支援手動回覆標籤：

- `[[reply_to_current]]` (回覆目前訊息)
- `[[reply_to:<id>]]` (回覆特定 ID 訊息)

## 媒體、分塊與遞送

<AccordionGroup>
  <Accordion title="傳入附件">
    Slack 檔案附件會從 Slack 託管的私有 URL 下載（使用 Token 驗證請求流程），並在抓取成功且符合大小限制的情況下寫入媒體存儲區。

    執行階段的傳入大小限制預設為 `20MB`，除非透過 `channels.slack.mediaMaxMb` 覆寫。

  </Accordion>

  <Accordion title="傳出文字與檔案">
    - 文字分塊遵循 `channels.slack.textChunkLimit`（預設 4000）。
    - `channels.slack.chunkMode="newline"` 啟用段落優先切分。
    - 發送檔案使用 Slack 上傳 API，並可包含討論串回覆 (`thread_ts`)。
    - 傳出媒體上限遵循 `channels.slack.mediaMaxMb` 配置；否則使用媒體管線的 MIME 預設值。
  </Accordion>

  <Accordion title="遞送目標">
    建議使用明確的目標格式：

    - `user:<id>` 用於私訊
    - `channel:<id>` 用於頻道

    發送給使用者目標時，系統會透過 Slack conversation API 開啟私訊。

  </Accordion>
</AccordionGroup>

## 動作與門控 (Actions and Gates)

Slack 動作由 `channels.slack.actions.*` 控制。

目前 Slack 工具中可用的動作群組：

| 群組 | 預設狀態 |
| ---------- | ------- |
| messages | 已啟用 |
| reactions | 已啟用 |
| pins | 已啟用 |
| memberInfo | 已啟用 |
| emojiList | 已啟用 |

## 事件與維運行為

- 訊息編輯/刪除/討論串廣播會對應至系統事件。
- 心情回應的新增/移除事件會對應至系統事件。
- 成員加入/離開、頻道建立/重新命名，以及置頂新增/移除等事件皆會對應至系統事件。
- 當啟用了 `configWrites` 時，`channel_id_changed` 事件可自動遷移頻道組態鍵名。
- 頻道主題 (Topic) 與用途 (Purpose) 元數據被視為不可信上下文，並可注入至路由上下文中。

## 資訊清單 (Manifest) 與範圍檢查表

<AccordionGroup>
  <Accordion title="Slack 應用程式 Manifest 範例">

```json
{
  "display_information": {
    "name": "OpenClaw",
    "description": "OpenClaw 的 Slack 連接器"
  },
  "features": {
    "bot_user": {
      "display_name": "OpenClaw",
      "always_online": false
    },
    "app_home": {
      "messages_tab_enabled": true,
      "messages_tab_read_only_enabled": false
    },
    "slash_commands": [
      {
        "command": "/openclaw",
        "description": "傳送訊息給 OpenClaw",
        "should_escape": false
      }
    ]
  },
  "oauth_config": {
    "scopes": {
      "bot": [
        "chat:write",
        "channels:history",
        "channels:read",
        "groups:history",
        "im:history",
        "mpim:history",
        "users:read",
        "app_mentions:read",
        "reactions:read",
        "reactions:write",
        "pins:read",
        "pins:write",
        "emoji:read",
        "commands",
        "files:read",
        "files:write"
      ]
    }
  },
  "settings": {
    "socket_mode_enabled": true,
    "event_subscriptions": {
      "bot_events": [
        "app_mention",
        "message.channels",
        "message.groups",
        "message.im",
        "message.mpim",
        "reaction_added",
        "reaction_removed",
        "member_joined_channel",
        "member_left_channel",
        "channel_rename",
        "pin_added",
        "pin_removed"
      ]
    }
  }
}
```

  </Accordion>

  <Accordion title="選用的使用者 Token 範圍 (讀取操作)">
    如果您配置了 `channels.slack.userToken`，典型的讀取範圍包含：

    - `channels:history`, `groups:history`, `im:history`, `mpim:history`
    - `channels:read`, `groups:read`, `im:read`, `mpim:read`
    - `users:read`
    - `reactions:read`
    - `pins:read`
    - `emoji:read`
    - `search:read` (如果您依賴 Slack 搜尋功能)

  </Accordion>
</AccordionGroup>

## 故障排除

<AccordionGroup>
  <Accordion title="頻道中沒有回覆">
    請依序檢查：

    - `groupPolicy` 設定
    - 頻道允許清單 (`channels.slack.channels`)
    - `requireMention` 設定
    - 各頻道獨立的 `users` 允許清單

    實用指令：

```bash
openclaw channels status --probe
openclaw logs --follow
openclaw doctor
```

  </Accordion>

  <Accordion title="私訊被忽略">
    請檢查：

    - `channels.slack.dm.enabled` 是否為 true
    - `channels.slack.dm.policy` 原則設定
    - 配對核准狀態 / 允許清單項目

```bash
openclaw pairing list slack
```

  </Accordion>

  <Accordion title="Socket 模式無法連線">
    驗證 Bot 與 App Token，並確認 Slack 應用程式設定中的 Socket Mode 已啟用。
  </Accordion>

  <Accordion title="HTTP 模式未接收到事件">
    請驗證：

    - 簽署秘密 (Signing secret)
    - Webhook 路徑
    - Slack Request URL (Events + Interactivity + Slash Commands)
    - 每個 HTTP 帳號具備唯一的 `webhookPath`

  </Accordion>

  <Accordion title="原生/斜線指令未觸發">
    確認您的設定意圖：

    - 是原生指令模式 (`channels.slack.commands.native: true`) 並已在 Slack 註冊對應指令
    - 還是單一斜線指令模式 (`channels.slack.slashCommand.enabled: true`)

    同時檢查 `commands.useAccessGroups` 與頻道/使用者允許清單。

  </Accordion>
</AccordionGroup>

## Slack 組態參考捷徑

主要參考：

- [組態參考 - Slack](/gateway/configuration-reference_zh_TW#slack)

重要的 Slack 欄位：

- 模式/驗證：`mode`, `botToken`, `appToken`, `signingSecret`, `webhookPath`, `accounts.*`
- 私訊存取：`dm.enabled`, `dm.policy`, `dm.allowFrom`, `dm.groupEnabled`, `dm.groupChannels`
- 頻道存取：`groupPolicy`, `channels.*`, `channels.*.users`, `channels.*.requireMention`
- 執行緒/歷史：`replyToMode`, `replyToModeByChatType`, `thread.*`, `historyLimit`, `dmHistoryLimit`, `dms.*.historyLimit`
- 訊息遞送：`textChunkLimit`, `chunkMode`, `mediaMaxMb`
- 維運/功能：`configWrites`, `commands.native`, `slashCommand.*`, `actions.*`, `userToken`, `userTokenReadOnly`

## 相關內容

- [配對](/channels/pairing_zh_TW)
- [頻道路由](/channels/channel-routing_zh_TW)
- [故障排除](/channels/troubleshooting_zh_TW)
- [組態設定](/gateway/configuration_zh_TW)
- [斜線指令](/tools/slash-commands_zh_TW)
