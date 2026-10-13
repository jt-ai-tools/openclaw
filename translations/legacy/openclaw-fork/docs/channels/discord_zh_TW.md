---
summary: "Discord 機器人支援狀態、能力與組態設定說明"
read_when:
  - 處理 Discord 頻道功能時
title: "Discord"
---

> 此文件為 [English Version](/channels/discord_zh_TW) 的繁體中文版本。

# Discord (機器人 API)

狀態：支援透過 Discord 官方閘道器進行私訊 (DMs) 與伺服器頻道通訊。

<CardGroup cols={3}>
  <Card title="配對 (Pairing)" icon="link" href="/channels/pairing_zh_TW">
    Discord 私訊預設為配對模式。
  </Card>
  <Card title="斜線指令" icon="terminal" href="/tools/slash-commands_zh_TW">
    原生指令行為與指令型錄。
  </Card>
  <Card title="頻道故障排除" icon="wrench" href="/channels/troubleshooting_zh_TW">
    跨頻道的診斷與修復流程。
  </Card>
</CardGroup>

## 快速設定

<Steps>
  <Step title="建立 Discord 機器人並啟用 Intents">
    在 Discord Developer Portal 中建立一個應用程式 (Application)，新增機器人 (Bot)，然後啟用：

    - **Message Content Intent** (訊息內容意圖)
    - **Server Members Intent** (伺服器成員意圖，執行身分組允許清單與路由時必填；建議開啟以便進行名稱與 ID 的允許清單比對)

  </Step>

  <Step title="配置 Token">

```json5
{
  channels: {
    discord: {
      enabled: true,
      token: "您的_BOT_TOKEN",
    },
  },
}
```

    針對預設帳號的環境變數備援：

```bash
DISCORD_BOT_TOKEN=...
```

  </Step>

  <Step title="邀請機器人並啟動閘道器">
    將機器人邀請至您的伺服器，並授予傳送訊息等必要權限。

```bash
openclaw gateway
```

  </Step>

  <Step title="核准首次私訊配對">

```bash
openclaw pairing list discord
openclaw pairing approve discord <配對碼>
```

    配對碼會在 1 小時後過期。

  </Step>
</Steps>

<Note>
Token 解析具備帳號感知能力。組態檔案中的 Token 值優先於環境變數。`DISCORD_BOT_TOKEN` 僅用於預設帳號。
</Note>

## 執行模型

- 閘道器擁有 Discord 連線。
- 回覆路由是確定性的：Discord 傳入的訊息一律由 Discord 回覆。
- 預設情況下 (`session.dmScope=main`)，私訊會共享代理人的主會話 (`agent:main:main`)。
- 伺服器頻道 (Guild channels) 具有隔離的對談金鑰 (`agent:<agentId>:discord:channel:<channelId>`)。
- 預設會忽略群組私訊 (`channels.discord.dm.groupEnabled=false`)。
- 原生斜線指令在隔離的指令會話中執行 (`agent:<agentId>:discord:slash:<userId>`)，同時仍會將 `CommandTargetSessionKey` 帶入路由後的對話會話。

## 存取控制與路由

<Tabs>
  <Tab title="私訊原則">
    `channels.discord.dm.policy` 控制私訊存取權：

    - `pairing` (預設)
    - `allowlist`
    - `open` (需要 `channels.discord.dm.allowFrom` 包含 `"*"` )
    - `disabled`

    若私訊原則非公開，未知的傳送者會被阻擋（或在 `pairing` 模式下提示進行配對）。

    訊息傳遞的目標格式：

    - `user:<id>`
    - `<@id>` 提及

    單純的數字 ID 容易產生歧義，除非明確提供使用者/頻道類型，否則會被拒絕。

  </Tab>

  <Tab title="伺服器原則">
    伺服器 (Guild) 處理方式由 `channels.discord.groupPolicy` 控制：

    - `open`
    - `allowlist`
    - `disabled`

    當 `channels.discord` 存在時，安全的基準設定為 `allowlist`。

    `allowlist` 行為說明：

    - 伺服器必須符合 `channels.discord.guilds` 中的設定（建議使用 ID，也接受代稱 Slug）。
    - 選用的傳送者允許清單：`users` (ID 或名稱) 與 `roles` (僅限身分組 ID)；若有設定，傳送者只要符合 `users` 或 `roles` 其中之一即可。
    - 若伺服器有設定 `channels` 映射，則未列出的頻道將被拒絕。
    - 若伺服器沒有 `channels` 設定區塊，則該伺服器內的所有頻道皆被允許。

    範例：

```json5
{
  channels: {
    discord: {
      groupPolicy: "allowlist",
      guilds: {
        "123456789012345678": {
          requireMention: true,
          users: ["987654321098765432"],
          roles: ["123456789012345678"],
          channels: {
            general: { allow: true },
            help: { allow: true, requireMention: true },
          },
        },
      },
    },
  },
}
```

    如果您僅設定 `DISCORD_BOT_TOKEN` 而未建立 `channels.discord` 區塊，執行階段將回退至 `groupPolicy="open"`（並在日誌中發出警告）。

  </Tab>

  <Tab title="提及與群組私訊">
    伺服器訊息預設受提及門檻 (mention-gated) 控管。

    提及偵測包含：

    - 對機器人的明確提及
    - 設定的提及模式 (`agents.list[].groupChat.mentionPatterns`, 備援為 `messages.groupChat.mentionPatterns`)
    - 在支援的情況下，隱式的「回覆機器人」行為

    `requireMention` 可針對各個伺服器/頻道進行配置 (`channels.discord.guilds...`)。

    群組私訊 (Group DMs)：

    - 預設值：忽略 (`dm.groupEnabled=false`)。
    - 選用的允許清單：透過 `dm.groupChannels` 設定（頻道 ID 或代稱）。

  </Tab>
</Tabs>

### 基於身分組 (Role) 的代理人路由

使用 `bindings[].match.roles` 根據身分組 ID 將 Discord 成員路由至不同的代理人。基於身分組的綁定僅接受 ID，其評估順序位於同儕 (Peer) 綁定之後、純伺服器 (Guild-only) 綁定之前。

```json5
{
  bindings: [
    {
      agentId: "opus",
      match: {
        channel: "discord",
        guildId: "123456789012345678",
        roles: ["111111111111111111"],
      },
    },
    {
      agentId: "sonnet",
      match: {
        channel: "discord",
        guildId: "123456789012345678",
      },
    },
  ],
}
```

## Developer Portal 設定步驟

<AccordionGroup>
  <Accordion title="建立應用程式與機器人">

    1. 前往 Discord Developer Portal -> **Applications** -> **New Application**
    2. 點選 **Bot** -> **Add Bot**
    3. 複製機器人 Token

  </Accordion>

  <Accordion title="特權意圖 (Privileged Intents)">
    在 **Bot -> Privileged Gateway Intents** 中啟用：

    - Message Content Intent (訊息內容意圖)
    - Server Members Intent (伺服器成員意圖，建議啟用)

    在線狀態 (Presence) 意圖是選用的，僅在您需要接收成員在線狀態更新時才需開啟。設定機器人自身的在線狀態 (`setPresence`) 不需要啟用成員的在線狀態更新。

  </Accordion>

  <Accordion title="OAuth 範圍與基礎權限">
    OAuth URL 產生器：

    - 範圍 (Scopes)：`bot`, `applications.commands`

    典型的基礎權限：

    - View Channels (查看頻道)
    - Send Messages (傳送訊息)
    - Read Message History (讀取訊息歷史紀錄)
    - Embed Links (嵌入連結)
    - Attach Files (附加檔案)
    - Add Reactions (新增回應，選填)

    除非有明確需求，否則請避免授予 `Administrator` (管理員) 權限。

  </Accordion>

  <Accordion title="複製相關 ID">
    開啟 Discord 的開發者模式 (Developer Mode)，然後複製：

    - 伺服器 ID (Server ID)
    - 頻道 ID (Channel ID)
    - 使用者 ID (User ID)

    在 OpenClaw 組態中建議使用數字 ID，以確保審計與探測的可靠性。

  </Accordion>
</AccordionGroup>

## 原生指令與指令授權

- `commands.native` 預設為 `"auto"` 且對 Discord 啟用。
- 頻道專屬覆寫：`channels.discord.commands.native`。
- `commands.native=false` 會明確清除先前註冊的 Discord 原生指令。
- 原生指令授權遵循與一般訊息處理相同的 Discord 允許清單/原則。
- 未經授權的使用者仍可能在 Discord UI 中看見指令；但在執行時會觸發 OpenClaw 授權檢查並傳回「未經授權」的訊息。

請參閱 [斜線指令](/tools/slash-commands_zh_TW) 以獲取指令型錄與行為說明。

## 功能細節

<AccordionGroup>
  <Accordion title="回覆標籤與原生回覆">
    Discord 支援代理人輸出內容中的回覆標籤：

    - `[[reply_to_current]]`
    - `[[reply_to:<id>]]`

    由 `channels.discord.replyToMode` 控制：

    - `off` (預設值)
    - `first`
    - `all`

    訊息 ID 會顯示在上下文/歷史紀錄中，以便代理人指定回覆特定的訊息。

  </Accordion>

  <Accordion title="歷史紀錄、上下文與討論串行為">
    伺服器歷史紀錄上下文：

    - `channels.discord.historyLimit` 預設值為 `20`。
    - 備援設定：`messages.groupChat.historyLimit`。
    - 設定為 `0` 即可停用。

    私訊歷史紀錄控制項：

    - `channels.discord.dmHistoryLimit`
    - `channels.discord.dms["<user_id>"].historyLimit`

    討論串 (Threads) 行為：

    - Discord 討論串會被路由為頻道會話。
    - 父討論串元數據可用於連結父會話。
    - 討論串會繼承父頻道的組態，除非存在討論串專屬的項目。

    頻道主題 (Channel topics) 會作為 **不可信** 的上下文注入（而非作為系統提示詞）。

  </Accordion>

  <Accordion title="心情回應通知 (Reaction notifications)">
    各伺服器獨立的心情回應通知模式：

    - `off`
    - `own` (預設值)
    - `all`
    - `allowlist` (使用 `guilds.<id>.users` 定義的列表)

    心情回應事件會被轉化為系統事件，並附加至路由後的 Discord 會話中。

  </Accordion>

  <Accordion title="組態寫入">
    由頻道發起的組態寫入預設為啟用。

    這會影響 `/config set|unset` 的工作流（當啟用了指令功能時）。

    停用方式：

```json5
{
  channels: {
    discord: {
      configWrites: false,
    },
  },
}
```

  </Accordion>

  <Accordion title="PluralKit 支援">
    啟用 PluralKit 解析功能，將代理訊息對應至系統成員身分：

```json5
{
  channels: {
    discord: {
      pluralkit: {
        enabled: true,
        token: "pk_live_...", // 選填；私有系統需要
      },
    },
  },
}
```

    注意事項：

    - 允許清單可以使用 `pk:<memberId>` 格式。
    - 成員顯示名稱會透過名稱/代稱進行比對。
    - 查詢使用原始訊息 ID，並受時間窗口限制。
    - 若查詢失敗，代理訊息將被視為機器人訊息；除非 `allowBots=true` 否則會被捨棄。

  </Accordion>

  <Accordion title="Discord 中的執行核准">
    Discord 支援在私訊中透過按鈕進行執行核准 (Exec approvals)。

    組態路徑：

    - `channels.discord.execApprovals.enabled`
    - `channels.discord.execApprovals.approvers`
    - `agentFilter`, `sessionFilter`, `cleanupAfterResolve`

    若核准失敗並提示未知的核准 ID，請驗證核准者列表與功能是否已啟用。

    相關文件：[執行核准](/tools/exec-approvals_zh_TW)

  </Accordion>
</AccordionGroup>

## 工具與動作門控

Discord 訊息動作包含通訊、頻道管理、管理員功能、在線狀態以及元數據操作。

核心範例：

- 通訊：`sendMessage`, `readMessages`, `editMessage`, `deleteMessage`, `threadReply`
- 心情回應：`react`, `reactions`, `emojiList`
- 管理員動作：`timeout` (停權), `kick` (踢出), `ban` (封鎖)
- 在線狀態：`setPresence`

動作門控位於 `channels.discord.actions.*` 下。

預設門控行為：

| 動作群組 | 預設狀態 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| reactions, messages, threads, pins, polls, search, memberInfo, roleInfo, channelInfo, channels, voiceStatus, events, stickers, emojiUploads, stickerUploads, permissions | 已啟用 |
| roles | 已停用 |
| moderation | 已停用 |
| presence | 已停用 |

## 故障排除

<AccordionGroup>
  <Accordion title="使用了未核准的 Intents 或機器人看不見伺服器訊息">

    - 啟用 Message Content Intent (訊息內容意圖)。
    - 若依賴使用者/成員解析，請啟用 Server Members Intent (伺服器成員意圖)。
    - 變更 Intents 後請重啟閘道器。

  </Accordion>

  <Accordion title="伺服器訊息意外被阻擋">

    - 驗證 `groupPolicy` 設定。
    - 驗證 `channels.discord.guilds` 下的伺服器允許清單。
    - 若伺服器已設定 `channels` 映射，則僅有列表中的頻道被允許。
    - 驗證 `requireMention` 行為與提及模式設定。

    實用的檢查指令：

```bash
openclaw doctor
openclaw channels status --probe
openclaw logs --follow
```

  </Accordion>

  <Accordion title="Require mention 已設為 false 但仍被阻擋">
    常見原因：

    - `groupPolicy="allowlist"` 但缺少匹配的伺服器/頻道允許清單。
    - `requireMention` 設定在錯誤的位置（必須位於 `channels.discord.guilds` 或頻道項目下）。
    - 傳送者被伺服器/頻道的 `users` 允許清單阻擋。

  </Accordion>

  <Accordion title="權限審計不符">
    `channels status --probe` 的權限檢查僅支援數字格式的頻道 ID。

    如果您使用代稱 (Slug) 鍵名，執行階段的比對仍可運作，但探測指令無法完全驗證其權限。

  </Accordion>

  <Accordion title="私訊與配對問題">

    - 私訊功能已停用：`channels.discord.dm.enabled=false`
    - 私訊原則已停用：`channels.discord.dm.policy="disabled"`
    - 在 `pairing` 模式下等待配對核准中。

  </Accordion>

  <Accordion title="機器人間的無限迴圈">
    預設情況下會忽略由機器人發出的訊息。

    如果您設定了 `channels.discord.allowBots=true`，請使用嚴格的提及與允許清單規則以避免產生迴圈行為。

  </Accordion>
</AccordionGroup>

## Discord 組態參考捷徑

主要參考：

- [組態參考 - Discord](/gateway/configuration-reference_zh_TW#discord)

重要 Discord 欄位：

- 啟動/驗證：`enabled`, `token`, `accounts.*`, `allowBots`
- 原則設定：`groupPolicy`, `dm.*`, `guilds.*`, `guilds.*.channels.*`
- 指令功能：`commands.native`, `commands.useAccessGroups`, `configWrites`
- 回覆/歷史：`replyToMode`, `historyLimit`, `dmHistoryLimit`, `dms.*.historyLimit`
- 訊息遞送：`textChunkLimit`, `chunkMode`, `maxLinesPerMessage`
- 媒體/重試：`mediaMaxMb`, `retry`
- 工具動作：`actions.*`
- 特色功能：`pluralkit`, `execApprovals`, `intents`, `agentComponents`, `heartbeat`, `responsePrefix`

## 安全性與維運

- 請將機器人 Token 視為機密資訊（在受監控的環境中建議使用 `DISCORD_BOT_TOKEN`）。
- 授予 Discord 最低必要的權限。
- 若指令部署或狀態已過時，請重啟閘道器並透過 `openclaw channels status --probe` 重新檢查。

## 相關內容

- [配對](/channels/pairing_zh_TW)
- [頻道路由](/channels/channel-routing_zh_TW)
- [故障排除](/channels/troubleshooting_zh_TW)
- [斜線指令](/tools/slash-commands_zh_TW)
