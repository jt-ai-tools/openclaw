---
summary: "Telegram 機器人支援狀態、能力與組態設定說明"
read_when:
  - 處理 Telegram 功能或 Webhook 設定時
title: "Telegram"
---

> 此文件為 [English Version](/channels/telegram) 的繁體中文版本。

# Telegram (機器人 API)

狀態：透過 grammY 達成 **生產就緒 (production-ready)**，支援機器人私訊與群組。預設使用長輪詢 (Long polling) 模式；亦可選用 Webhook 模式。

<CardGroup cols={3}>
  <Card title="配對 (Pairing)" icon="link" href="/channels/pairing_zh_TW">
    Telegram 的預設私訊原則為「配對」。
  </Card>
  <Card title="頻道故障排除" icon="wrench" href="/channels/troubleshooting_zh_TW">
    跨頻道的診斷與修復指南。
  </Card>
  <Card title="閘道器組態" icon="settings" href="/gateway/configuration_zh_TW">
    完整的頻道組態模式與範例。
  </Card>
</CardGroup>

## 快速設定

<Steps>
  <Step title="在 BotFather 建立機器人 Token">
    開啟 Telegram 並與 **@BotFather** 對話（請確認其 Handle 確實為 `@BotFather`）。

    執行 `/newbot` 指令，按照引導完成設定並儲存取得的 Token。

  </Step>

  <Step title="配置 Token 與私訊原則">

```json5
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "123:abc",
      dmPolicy: "pairing",
      groups: { "*": { requireMention: true } },
    },
  },
}
```

    環境變數備援：`TELEGRAM_BOT_TOKEN=...`（僅適用於預設帳號）。

  </Step>

  <Step title="啟動閘道器並核准首次私訊">

```bash
openclaw gateway
openclaw pairing list telegram
openclaw pairing approve telegram <配對碼>
```

    配對碼會在 1 小時後過期。

  </Step>

  <Step title="將機器人加入群組">
    將機器人加入您的群組，然後根據您的存取模型設定 `channels.telegram.groups` 與 `groupPolicy`。
  </Step>
</Steps>

<Note>
Token 解析順序具備帳號感知能力。實務上，組態檔案中的值優先於環境變數，且 `TELEGRAM_BOT_TOKEN` 僅適用於預設帳號。
</Note>

## Telegram 側的設定

<AccordionGroup>
  <Accordion title="隱私模式與群組可見度">
    Telegram 機器人預設啟用 **隱私模式 (Privacy Mode)**，這會限制其接收群組訊息的範圍。

    若機器人需要看見所有群組訊息，請執行以下任一操作：

    - 透過 `/setprivacy` 停用隱私模式，或
    - 將機器人設為群組管理員。

    切換隱私模式設定後，請將機器人從各群組移除並重新加入，Telegram 才會套用變更。

  </Accordion>

  <Accordion title="群組權限">
    管理員身分在 Telegram 群組設定中控制。

    具備管理員權限的機器人可接收所有群組訊息，這對於需要「永遠在線」行為的群組非常有用。

  </Accordion>

  <Accordion title="實用的 BotFather 指令">

    - `/setjoingroups` 用於允許/禁止將機器人加入群組。
    - `/setprivacy` 用於設定群組訊息的可見度行為。

  </Accordion>
</AccordionGroup>

## 存取控制與啟用

<Tabs>
  <Tab title="私訊原則">
    `channels.telegram.dmPolicy` 控制直接訊息的存取權：

    - `pairing` (預設)
    - `allowlist`
    - `open` (需要 `allowFrom` 包含 `"*"` )
    - `disabled`

    `channels.telegram.allowFrom` 接受數字 ID 與使用者名稱。支援 `telegram:` / `tg:` 前綴，且會自動規範化。

    ### 尋找您的 Telegram 使用者 ID

    更安全的方式（無需第三方機器人）：

    1. 傳送私訊給您的機器人。
    2. 執行 `openclaw logs --follow`。
    3. 查看日誌中的 `from.id`。

    官方機器人 API 方式：

```bash
curl "https://api.telegram.org/bot<機器人Token>/getUpdates"
```

    第三方方式（隱私較低）：`@userinfobot` 或 `@getidsbot`。

  </Tab>

  <Tab title="群組原則與允許清單">
    具備兩項獨立控制：

    1. **允許哪些群組** (`channels.telegram.groups`)
       - 若無此組態：允許所有群組。
       - 已設定此組態：作為允許清單使用（明確 ID 或 `"*"`）。

    2. **群組中允許哪些傳送者** (`channels.telegram.groupPolicy`)
       - `open`
       - `allowlist` (預設)
       - `disabled`

    `groupAllowFrom` 用於過濾群組傳送者。若未設定，Telegram 會回退使用 `allowFrom`。

    範例：允許特定群組中的任何成員對話：

```json5
{
  channels: {
    telegram: {
      groups: {
        "-1001234567890": {
          groupPolicy: "open",
          requireMention: false,
        },
      },
    },
  },
}
```

  </Tab>

  <Tab title="提及 (Mention) 行為">
    群組回覆預設需要被提及。

    提及的判定來源：

    - 原生的 `@botusername` 標註，或
    - 下列位置中的提及模式：
      - `agents.list[].groupChat.mentionPatterns`
      - `messages.groupChat.mentionPatterns`

    對談層級的指令開關：

    - `/activation always`
    - `/activation mention`

    這些指令僅更新會話狀態。若要持久化，請修改組態檔案。

    持久化組態範例：

```json5
{
  channels: {
    telegram: {
      groups: {
        "*": { requireMention: false },
      },
    },
  },
}
```

    取得群組聊天 ID 的方法：

    - 將群組訊息轉發至 `@userinfobot` / `@getidsbot`。
    - 或從 `openclaw logs --follow` 讀取 `chat.id`。
    - 或檢視機器人 API 的 `getUpdates` 結果。

  </Tab>
</Tabs>

## 執行階段行為

- Telegram 頻道由閘道器程序擁有。
- 路由是確定性的：Telegram 傳入的訊息一律由 Telegram 回覆（模型不會自行挑選頻道）。
- 傳入訊息會規範化為帶有回覆元數據與媒體佔位符的共享頻道封裝。
- 群組會話根據群組 ID 進行隔離。論壇主題 (Forum topics) 會附加 `:topic:<threadId>` 以保持主題間的隔離。
- 私訊可包含 `message_thread_id`；OpenClaw 會以主題感知 (thread-aware) 的對談金鑰進行路由，並在回覆時保留主題 ID。
- 長輪詢使用具備「每個聊天/主題排序」功能的 grammY runner。整體 runner 接收端的並發數遵循 `agents.defaults.maxConcurrent` 設定。
- Telegram 機器人 API 不支援已讀標記（`sendReadReceipts` 不適用）。

## 功能參考

<AccordionGroup>
  <Accordion title="Telegram 私訊中的草稿串流">
    OpenClaw 可以透過 Telegram 的草稿氣泡 (`sendMessageDraft`) 串流傳輸部分回覆內容。

    前置要求：

    - `channels.telegram.streamMode` 不為 `"off"` (預設值：`"partial"`)。
    - 必須是私訊。
    - 傳入的更新包含 `message_thread_id`。
    - 機器人已啟用主題功能 (`getMe().has_topics_enabled`)。

    模式：

    - `off`: 不使用草稿串流。
    - `partial`: 根據部分文字頻繁更新草稿。
    - `block`: 使用 `channels.telegram.draftChunk` 進行分塊式的草稿更新。

    `block` 模式的 `draftChunk` 預設值：

    - `minChars: 200`
    - `maxChars: 800`
    - `breakPreference: "paragraph"`

    `maxChars` 會受 `channels.telegram.textChunkLimit` 限制。

    草稿串流僅限於私訊；群組與頻道不使用草稿氣泡。

    如果您希望提早發送真實的 Telegram 訊息而非草稿更新，請使用區塊串流 (`channels.telegram.blockStreaming: true`)。

    Telegram 專屬推理過程串流：

    - `/reasoning stream` 在生成過程中將推理過程傳送至草稿氣泡。
    - 最終答案發送時不含推理文字。

  </Accordion>

  <Accordion title="格式化與 HTML 備援">
    傳出文字使用 Telegram 的 `parse_mode: "HTML"`。

    - 類 Markdown 文字會被渲染為 Telegram 安全的 HTML。
    - 模型輸出的原始 HTML 會經過轉義，以減少 Telegram 的解析失敗。
    - 若 Telegram 拒絕解析後的 HTML，OpenClaw 會以純文字重試。

    連結預覽預設為啟用，可透過 `channels.telegram.linkPreview: false` 停用。

  </Accordion>

  <Accordion title="原生指令與自訂指令">
    Telegram 指令選單註冊在啟動時透過 `setMyCommands` 處理。

    原生指令預設值：

    - `commands.native: "auto"` 為 Telegram 啟用原生指令。

    新增自訂指令選單項目：

```json5
{
  channels: {
    telegram: {
      customCommands: [
        { command: "backup", description: "Git 備份" },
        { command: "generate", description: "建立影像" },
      ],
    },
  },
}
```

    規則：

    - 名稱會被規範化（移除開頭的 `/`，轉為小寫）。
    - 有效格式：`a-z`, `0-9`, `_`，長度為 `1..32`。
    - 自訂指令不能覆寫原生指令。
    - 衝突或重複的項目會被跳過並記錄日誌。

    注意事項：

    - 自訂指令僅為選單項目；它們不會自動實作行為。
    - 外掛或技能指令在手動輸入時仍可運作，即使未顯示在 Telegram 選單中。

    若停用原生指令，內建指令會被移除。自訂/外掛指令若有配置則仍會註冊。

    常見設定失敗原因：

    - `setMyCommands failed` 通常代表連向 `api.telegram.org` 的 DNS 或 HTTPS 被阻擋。

    ### 裝置配對指令 (`device-pair` 外掛)

    安裝 `device-pair` 外掛後：

    1. `/pair` 產生設定碼。
    2. 在 iOS App 中貼上設定碼。
    3. `/pair approve` 核准最新的待處理請求。

    詳情請見：[配對](/channels/pairing_zh_TW#透過-Telegram-配對-iOS-裝置建議方式)。

  </Accordion>

  <Accordion title="內聯按鈕 (Inline buttons)">
    配置內聯鍵盤的範圍：

```json5
{
  channels: {
    telegram: {
      capabilities: {
        inlineButtons: "allowlist",
      },
    },
  },
}
```

    針對個別帳號覆寫：

```json5
{
  channels: {
    telegram: {
      accounts: {
        main: {
          capabilities: {
            inlineButtons: "allowlist",
          },
        },
      },
    },
  },
}
```

    可用範圍：

    - `off`
    - `dm` (僅限私訊)
    - `group` (僅限群組)
    - `all`
    - `allowlist` (預設值)

    舊版的 `capabilities: ["inlineButtons"]` 會對應至 `inlineButtons: "all"`。

    訊息動作範例：

```json5
{
  action: "send",
  channel: "telegram",
  to: "123456789",
  message: "請選擇選項：",
  buttons: [
    [
      { text: "是", callback_data: "yes" },
      { text: "否", callback_data: "no" },
    ],
    [{ text: "取消", callback_data: "cancel" }],
  ],
}
```

    點擊回呼數據 (Callback click) 會以文字形式傳遞給代理人：
    `callback_data: <數值>`

  </Accordion>

  <Accordion title="代理人與自動化適用的 Telegram 訊息動作">
    Telegram 工具動作包含：

    - `sendMessage` (`to`, `content`, 選填 `mediaUrl`, `replyToMessageId`, `messageThreadId`)
    - `react` (`chatId`, `messageId`, `emoji`)
    - `deleteMessage` (`chatId`, `messageId`)
    - `editMessage` (`chatId`, `messageId`, `content`)

    頻道訊息動作提供符合直覺的別名 (`send`, `react`, `delete`, `edit`, `sticker`, `sticker-search`)。

    門控控制：

    - `channels.telegram.actions.sendMessage`
    - `channels.telegram.actions.editMessage`
    - `channels.telegram.actions.deleteMessage`
    - `channels.telegram.actions.reactions`
    - `channels.telegram.actions.sticker` (預設為停用)

    心情回應移除語意：[/tools/reactions](/tools/reactions_zh_TW)

  </Accordion>

  <Accordion title="回覆執行緒標籤 (Reply threading tags)">
    Telegram 支援在產出的輸出內容中使用明確的回覆執行緒標籤：

    - `[[reply_to_current]]` 回覆觸發本次回合的訊息。
    - `[[reply_to:<id>]]` 回覆特定的 Telegram 訊息 ID。

    `channels.telegram.replyToMode` 控制處理方式：

    - `first` (預設值)
    - `all`
    - `off`

  </Accordion>

  <Accordion title="論壇主題與執行緒行為">
    論壇超級群組 (Forum supergroups)：

    - 主題會話金鑰會附加 `:topic:<threadId>`。
    - 回覆與正在輸入狀態皆以該主題執行緒為目標。
    - 主題組態路徑：
      `channels.telegram.groups.<chatId>.topics.<threadId>`

    一般主題 (`threadId=1`) 的特殊情況：

    - 發送訊息時會省略 `message_thread_id`（Telegram 拒絕針對 thread_id=1 使用 `sendMessage`）。
    - 正在輸入狀態仍會包含 `message_thread_id`。

    主題繼承：主題項目會繼承群組設定，除非被覆寫 (`requireMention`, `allowFrom`, `skills`, `systemPrompt`, `enabled`, `groupPolicy`)。

    範本上下文包含：

    - `MessageThreadId`
    - `IsForum`

    私訊執行緒行為：

    - 帶有 `message_thread_id` 的私訊會保持私訊路由，但使用主題感知 (thread-aware) 的會話金鑰/回覆目標。

  </Accordion>

  <Accordion title="音訊、影片與貼圖">
    ### 音訊訊息

    Telegram 分為語音訊息 (Voice notes) 與音訊檔案。

    - 預設：音訊檔案行為。
    - 在代理人回覆中使用標籤 `[[audio_as_voice]]` 可強制發送為語音訊息。

    訊息動作範例：

```json5
{
  action: "send",
  channel: "telegram",
  to: "123456789",
  media: "https://example.com/voice.ogg",
  asVoice: true,
}
```

    ### 影片訊息

    Telegram 分為影片檔案與影片訊息 (Video notes)。

    訊息動作範例：

```json5
{
  action: "send",
  channel: "telegram",
  to: "123456789",
  media: "https://example.com/video.mp4",
  asVideoNote: true,
}
```

    影片訊息不支援說明文字 (Captions)；提供的訊息文字會分開傳送。

    ### 貼圖 (Stickers)

    傳入貼圖處理：

    - 靜態 WEBP：下載並處理（佔位符 `<media:sticker>`）。
    - 動態 TGS：跳過。
    - 影片 WEBM：跳過。

    貼圖上下文欄位：

    - `Sticker.emoji`
    - `Sticker.setName`
    - `Sticker.fileId`
    - `Sticker.fileUniqueId`
    - `Sticker.cachedDescription`

    貼圖快取檔案：

    - `~/.openclaw/telegram/sticker-cache.json`

    貼圖在可能的情況下僅描述一次並快取，以減少重複的視覺模型調用。

    啟用貼圖動作：

```json5
{
  channels: {
    telegram: {
      actions: {
        sticker: true,
      },
    },
  },
}
```

    發送貼圖動作：

```json5
{
  action: "sticker",
  channel: "telegram",
  to: "123456789",
  fileId: "CAACAgIAAxkBAAI...",
}
```

    搜尋快取的貼圖：

```json5
{
  action: "sticker-search",
  channel: "telegram",
  query: "cat waving",
  limit: 5,
}
```

  </Accordion>

  <Accordion title="心情回應通知 (Reaction notifications)">
    Telegram 心情回應會以 `message_reaction` 更新形式抵達（與訊息負載分開）。

    啟用後，OpenClaw 會將系統事件排入佇列，例如：

    - `Telegram reaction added: 👍 by Alice (@alice) on msg 42`

    組態項：

    - `channels.telegram.reactionNotifications`: `off | own | all` (預設值：`own`)
    - `channels.telegram.reactionLevel`: `off | ack | minimal | extensive` (預設值：`minimal`)

    注意事項：

    - `own` 代表僅通知對機器人發送之訊息的使用者心情回應（透過傳出訊息快取盡力而為）。
    - Telegram 的心情回應更新中不提供主題 ID (Thread ID)。
      - 非論壇群組會路由至群組聊天會話。
      - 論壇群組會路由至群組的一般主題會話 (`:topic:1`)，而非原始的具體主題。

    長輪詢/Webhook 的 `allowed_updates` 會自動包含 `message_reaction`。

  </Accordion>

  <Accordion title="來自 Telegram 事件與指令的組態寫入">
    頻道組態寫入預設為啟用 (`configWrites !== false`)。

    由 Telegram 觸發的寫入包含：

    - 群組遷移事件 (`migrate_to_chat_id`) 以更新 `channels.telegram.groups`。
    - `/config set` 與 `/config unset` 指令（需要啟用指令功能）。

    停用方式：

```json5
{
  channels: {
    telegram: {
      configWrites: false,
    },
  },
}
```

  </Accordion>

  <Accordion title="長輪詢 vs Webhook">
    預設：長輪詢 (Long polling)。

    Webhook 模式：

    - 設定 `channels.telegram.webhookUrl`。
    - 設定 `channels.telegram.webhookSecret` (當設定了 Webhook URL 時為必填)。
    - 選填 `channels.telegram.webhookPath` (預設為 `/telegram-webhook`)。

    Webhook 模式的預設本地監聽程式會綁定至 `0.0.0.0:8787`。

    如果您的公開端點不同，請在前方放置反向代理伺服器，並將 `webhookUrl` 指向該公開 URL。

  </Accordion>

  <Accordion title="限制、重試與 CLI 目標">
    - `channels.telegram.textChunkLimit` 預設為 4000。
    - `channels.telegram.chunkMode="newline"` 在進行長度切分前，優先考慮段落邊界（空白行）。
    - `channels.telegram.mediaMaxMb` (預設 5) 限制 Telegram 傳入媒體的下載/處理大小。
    - `channels.telegram.timeoutSeconds` 覆寫 Telegram API 用戶端的逾時設定（若未設定，則沿用 grammY 預設值）。
    - 群組上下文歷史紀錄使用 `channels.telegram.historyLimit` 或 `messages.groupChat.historyLimit` (預設 50)；設定為 `0` 可停用。
    - 私訊歷史紀錄控制項：
      - `channels.telegram.dmHistoryLimit`
      - `channels.telegram.dms["<user_id>"].historyLimit`
    - 傳出的 Telegram API 重試機制可透過 `channels.telegram.retry` 進行配置。

    CLI 發送目標可以是數字聊天 ID 或使用者名稱：

```bash
openclaw message send --channel telegram --target 123456789 --message "您好"
openclaw message send --channel telegram --target @name --message "您好"
```

  </Accordion>
</AccordionGroup>

## 故障排除

<AccordionGroup>
  <Accordion title="機器人不回應未提及的群組訊息">

    - 若 `requireMention=false`，Telegram 隱私模式必須允許完整可見度。
      - 向 BotFather 發送：`/setprivacy` -> 選擇 Disable。
      - 接著將機器人從群組移除並重新加入。
    - `openclaw channels status` 會在組態預期接收未提及訊息但設定不符時發出警告。
    - `openclaw channels status --probe` 可以檢查明確的數字群組 ID；萬用字元 `"*"` 無法進行成員資格探測。
    - 快速會話測試：使用 `/activation always` 指令。

  </Accordion>

  <Accordion title="機器人完全看不見群組訊息">

    - 當 `channels.telegram.groups` 存在時，該群組必須被列入（或包含 `"*"`）。
    - 驗證機器人是否確實為群組成員。
    - 查看日誌：執行 `openclaw logs --follow` 檢查跳過訊息的原因。

  </Accordion>

  <Accordion title="指令部分生效或完全無效">

    - 授權您的傳送者身分（配對 或/與 加入 `allowFrom`）。
    - 指令授權機制即使在群組原則為 `open` 時仍會套用。
    - `setMyCommands failed` 通常表示連向 `api.telegram.org` 的 DNS 或 HTTPS 可達性有問題。

  </Accordion>

  <Accordion title="輪詢或網路不穩定">

    - Node 22+ 搭配自訂 fetch/代理可能會在 AbortSignal 型別不符時觸發立即終止行為。
    - 部分主機會優先將 `api.telegram.org` 解析為 IPv6；若 IPv6 出站連線異常，會導致間歇性的 Telegram API 失敗。
    - 驗證 DNS 解析：

```bash
dig +short api.telegram.org A
dig +short api.telegram.org AAAA
```

  </Accordion>
</AccordionGroup>

更多說明：[頻道故障排除](/channels/troubleshooting_zh_TW)。

## Telegram 組態參考捷徑

主要參考：

- [組態參考 - Telegram](/gateway/configuration-reference_zh_TW#telegram)

Telegram 專屬的重要欄位：

- 啟動/驗證：`enabled`, `botToken`, `tokenFile`, `accounts.*`
- 存取控制：`dmPolicy`, `allowFrom`, `groupPolicy`, `groupAllowFrom`, `groups`, `groups.*.topics.*`
- 指令/選單：`commands.native`, `customCommands`
- 執行緒/回覆：`replyToMode`
- 串流：`streamMode`, `draftChunk`, `blockStreaming`
- 格式/遞送：`textChunkLimit`, `chunkMode`, `linkPreview`, `responsePrefix`
- 媒體/網路：`mediaMaxMb`, `timeoutSeconds`, `retry`, `network.autoSelectFamily`, `proxy`
- Webhook：`webhookUrl`, `webhookSecret`, `webhookPath`
- 動作/能力：`capabilities.inlineButtons`, `actions.sendMessage|editMessage|deleteMessage|reactions|sticker`
- 心情回應：`reactionNotifications`, `reactionLevel`
- 寫入/歷史：`configWrites`, `historyLimit`, `dmHistoryLimit`, `dms.*.historyLimit`

## 相關內容

- [配對](/channels/pairing_zh_TW)
- [頻道路由](/channels/channel-routing_zh_TW)
- [故障排除](/channels/troubleshooting_zh_TW)
