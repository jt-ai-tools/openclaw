---
summary: "WhatsApp 頻道支援、存取控制、遞送行為與維運說明"
read_when:
  - 處理 WhatsApp/網頁頻道行為或收件匣路由時
title: "WhatsApp"
---

> 此文件為 [English Version](/channels/whatsapp) 的繁體中文版本。

# WhatsApp (網頁頻道)

狀態：透過 WhatsApp Web (Baileys) 達成 **生產就緒 (production-ready)**。閘道器擁有已連結的對談會話。

<CardGroup cols={3}>
  <Card title="配對 (Pairing)" icon="link" href="/channels/pairing_zh_TW">
    針對未知傳送者的預設私訊原則為「配對」。
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
  <Step title="配置 WhatsApp 存取原則">

```json5
{
  channels: {
    whatsapp: {
      dmPolicy: "pairing",
      allowFrom: ["+15551234567"],
      groupPolicy: "allowlist",
      groupAllowFrom: ["+15551234567"],
    },
  },
}
```

  </Step>

  <Step title="連結 WhatsApp (掃描 QR Code)">

```bash
openclaw channels login --channel whatsapp
```

    針對特定帳號：

```bash
openclaw channels login --channel whatsapp --account work
```

  </Step>

  <Step title="啟動閘道器">

```bash
openclaw gateway
```

  </Step>

  <Step title="核准首次配對請求 (若使用配對模式)">

```bash
openclaw pairing list whatsapp
openclaw pairing approve whatsapp <配對碼>
```

    配對請求會在 1 小時後過期。每個頻道的待處理請求上限為 3 個。

  </Step>
</Steps>

<Note>
OpenClaw 建議盡可能為 WhatsApp 使用 **獨立的門號**。（頻道的元數據與引導流程已針對此設定進行優化，但也支援使用個人門號。）
</Note>

## 部署模式

<AccordionGroup>
  <Accordion title="專用號碼 (建議方式)">
    這是最乾淨的維運模式：

    - 為 OpenClaw 提供獨立的 WhatsApp 身分。
    - 具備更清晰的私訊允許清單與路由邊界。
    - 降低自我對話產生混淆的機率。

    最簡原則模式：

    ```json5
    {
      channels: {
        whatsapp: {
          dmPolicy: "allowlist",
          allowFrom: ["+15551234567"],
        },
      },
    }
    ```

  </Accordion>

  <Accordion title="個人號碼備援模式">
    引導流程支援個人號碼模式，並會自動寫入適合自我對話的基礎設定：

    - `dmPolicy: "allowlist"`
    - `allowFrom` 包含您的個人號碼
    - `selfChatMode: true`

    在執行階段，自我對話保護機制會根據已連結的自有門號與 `allowFrom` 進行觸發。

  </Accordion>

  <Accordion title="WhatsApp Web 專屬頻道範圍">
    在目前的 OpenClaw 頻道架構中，此通訊平台頻道是基於 WhatsApp Web (`Baileys`)。

    內建的通訊頻道註冊表中沒有獨立的 Twilio WhatsApp 頻道。

  </Accordion>
</AccordionGroup>

## 執行模型

- 閘道器擁有 WhatsApp 通訊端 (Socket) 與重新連線迴圈。
- 傳出訊息需要對應帳號具備活動中的 WhatsApp 監聽程式。
- 系統會忽略狀態 (Status) 與廣播 (Broadcast) 聊天 (`@status`, `@broadcast`)。
- 直接訊息 (Direct chats) 遵循私訊會話規則 (`session.dmScope`；預設為 `main`，會將所有私訊歸併至代理人的主會話)。
- 群組會話是隔離的 (`agent:<agentId>:whatsapp:group:<jid>`)。

## 存取控制與啟用

<Tabs>
  <Tab title="私訊原則">
    `channels.whatsapp.dmPolicy` 控制直接訊息的存取權：

    - `pairing` (預設)
    - `allowlist`
    - `open` (需要 `allowFrom` 包含 `"*"` )
    - `disabled`

    `allowFrom` 接受 E.164 格式的號碼（內部會進行規範化）。

    執行階段行為細節：

    - 配對資訊會持久化於頻道的允許存儲區中，並與組態中的 `allowFrom` 合併。
    - 若未設定允許清單，預設會允許已連結的自有門號。
    - 傳出的 `fromMe` 私訊絕不會觸發自動配對。

  </Tab>

  <Tab title="群組原則與允許清單">
    群組存取具備兩層控制：

    1. **群組成員允許清單** (`channels.whatsapp.groups`)
       - 若省略 `groups`，則所有群組皆符合資格。
       - 若設定了 `groups`，它將作為群組允許清單（可用 `"*"` 允許所有）。

    2. **群組傳送者原則** (`channels.whatsapp.groupPolicy` + `groupAllowFrom`)
       - `open`: 繞過傳送者允許清單。
       - `allowlist`: 傳送者必須符合 `groupAllowFrom` (或 `*`)。
       - `disabled`: 阻擋所有群組傳入訊息。

    傳送者允許清單備援：

    - 若未設定 `groupAllowFrom`，執行階段在可用時會回退使用 `allowFrom`。

    注意：若完全沒有 `channels.whatsapp` 設定區塊，執行階段的群組原則實際上會是 `open`。

  </Tab>

  <Tab title="提及與 /activation 指令">
    群組回覆預設需要被提及 (Mention)。

    提及偵測包含：

    - 對機器人身分的明確 WhatsApp @-提及。
    - 配置的提及正規表示式模式 (`agents.list[].groupChat.mentionPatterns`, 備援為 `messages.groupChat.mentionPatterns`)。
    - 隱式的「回覆機器人」偵測（回覆對象的傳送者與機器人身分相符）。

    會話層級的啟用指令：

    - `/activation mention`
    - `/activation always`

    `activation` 指令會更新會話狀態（而非全域組態），且僅限擁有者調用。

  </Tab>
</Tabs>

## 個人號碼與自我對話行為

當已連結的自有門號也出現在 `allowFrom` 中時，WhatsApp 自我對話保護機制會啟動：

- 跳過自我對話回合的已讀標記。
- 忽略原本會導致自己標記自己的提及 JID 自動觸發行為。
- 若未設定 `messages.responsePrefix`，自我對話回覆預設為 `[{identity.name}]` 或 `[openclaw]`。

## 訊息規範化與上下文

<AccordionGroup>
  <Accordion title="傳入封裝與回覆上下文">
    傳入的 WhatsApp 訊息會被包裝在共享的傳入封裝 (Inbound envelope) 中。

    若存在引用回覆 (Quoted reply)，上下文會以下列形式附加：

    ```text
    [Replying to <sender> id:<stanzaId>]
    <引用文字或媒體佔位符>
    [/Replying]
    ```

    回覆的元數據欄位在可用時也會被填充（`ReplyToId`, `ReplyToBody`, `ReplyToSender`, 傳送者 JID/E.164）。

  </Accordion>

  <Accordion title="媒體佔位符與位置/聯絡人提取">
    僅含媒體的傳入訊息會被規範化為佔位符，例如：

    - `<media:image>`
    - `<media:video>`
    - `<media:audio>`
    - `<media:document>`
    - `<media:sticker>`

    地理位置與聯絡人資訊在路由前會被規範化為文字上下文。

  </Accordion>

  <Accordion title="待處理群組歷史紀錄注入">
    針對群組，尚未處理的訊息可以被緩衝，並在機器人最終被觸發時作為上下文注入。

    - 預設上限：`50`
    - 組態項目：`channels.whatsapp.historyLimit`
    - 備援項目：`messages.groupChat.historyLimit`
    - 設定為 `0` 可停用。

    注入標記：

    - `[Chat messages since your last reply - for context]` (自您上次回覆後的聊天訊息 - 供參考)
    - `[Current message - respond to this]` (目前訊息 - 請針對此則回覆)

  </Accordion>

  <Accordion title="已讀標記">
    對於已接受的傳入 WhatsApp 訊息，預設會發送已讀標記 (Read receipts)。

    全域停用方式：

    ```json5
    {
      channels: {
        whatsapp: {
          sendReadReceipts: false,
        },
      },
    }
    ```

    針對個別帳號覆寫：

    ```json5
    {
      channels: {
        whatsapp: {
          accounts: {
            work: {
              sendReadReceipts: false,
            },
          },
        },
      },
    }
    ```

    即使全域已啟用，自我對話回合仍會跳過發送已讀標記。

  </Accordion>
</AccordionGroup>

## 遞送、分塊與媒體處理

<AccordionGroup>
  <Accordion title="文字分塊 (Chunking)">
    - 預設分塊上限：`channels.whatsapp.textChunkLimit = 4000`
    - `channels.whatsapp.chunkMode = "length" | "newline"`
    - `newline` 模式會優先考慮段落邊界（空白行），然後再回退到長度安全分塊。
  </Accordion>

  <Accordion title="傳出媒體行為">
    - 支援影像、影片、音訊（PTT 語音訊息）與文件負載。
    - `audio/ogg` 會被重寫為 `audio/ogg; codecs=opus` 以確保語音訊息相容性。
    - 動態 GIF 播放支援在影片發送時設定 `gifPlayback: true`。
    - 發送多媒體回覆負載時，說明文字 (Captions) 會套用於第一個媒體項目。
    - 媒體來源可以是 HTTP(S), `file://` 或本地路徑。
  </Accordion>

  <Accordion title="媒體大小限制與備援行為">
    - 傳入媒體儲存上限：`channels.whatsapp.mediaMaxMb`（預設 `50`）
    - 自動回覆的傳出媒體上限：`agents.defaults.mediaMaxMb`（預設 `5MB`）
    - 影像會自動優化（調整尺寸/品質優化）以符合限制。
    - 若媒體發送失敗，第一個項目的備援機制會發送文字警告，而非無聲地捨棄回應。
  </Accordion>
</AccordionGroup>

## 確認心情回應 (Acknowledgment reactions)

WhatsApp 支援在接收傳入訊息時立即發送確認心情回應，設定路徑為 `channels.whatsapp.ackReaction`。

```json5
{
  channels: {
    whatsapp: {
      ackReaction: {
        emoji: "👀",
        direct: true,
        group: "mentions", // always | mentions | never
      },
    },
  },
}
```

行為註記：

- 在傳入訊息被接受後立即發送（於回覆前）。
- 若發送失敗會記錄日誌，但不會阻礙正常回覆的遞送。
- 群組模式 `mentions` 僅在被提及觸發的回合回應；群組啟用設定為 `always` 時會繞過此項檢查。
- WhatsApp 使用 `channels.whatsapp.ackReaction`（此處不使用舊版的 `messages.ackReaction`）。

## 多帳號與憑證管理

<AccordionGroup>
  <Accordion title="帳號選擇與預設值">
    - 帳號 ID 取自 `channels.whatsapp.accounts`。
    - 預設帳號選擇：若存在 `default` 則優先使用，否則使用第一個設定的帳號 ID（依名稱排序）。
    - 帳號 ID 會在內部進行規範化以供查詢。
  </Accordion>

  <Accordion title="憑證路徑與舊版相容性">
    - 目前驗證路徑：`~/.openclaw/credentials/whatsapp/<accountId>/creds.json`
    - 備份檔案：`creds.json.bak`
    - 舊版位於 `~/.openclaw/credentials/` 的預設驗證檔案仍會被識別並遷移至預設帳號流程中。
  </Accordion>

  <Accordion title="登出行為">
    `openclaw channels logout --channel whatsapp [--account <id>]` 會清除該帳號的 WhatsApp 驗證狀態。

    在舊版驗證目錄中，`oauth.json` 會被保留，而 Baileys 驗證檔案則會被移除。

  </Accordion>
</AccordionGroup>

## 工具、動作與組態寫入

- 代理人工具支援包含 WhatsApp 心情回應動作 (`react`)。
- 動作門控：
  - `channels.whatsapp.actions.reactions`
  - `channels.whatsapp.actions.polls`
- 頻道發起的組態寫入預設為啟用（可透過 `channels.whatsapp.configWrites=false` 停用）。

## 故障排除

<AccordionGroup>
  <Accordion title="未連結 (需要 QR Code)">
    徵兆：頻道狀態回報為未連結。

    修復方式：

    ```bash
    openclaw channels login --channel whatsapp
    openclaw channels status
    ```

  </Accordion>

  <Accordion title="已連結但斷線 / 重連迴圈">
    徵兆：已連結的帳號重複斷線或嘗試重新連線。

    修復方式：

    ```bash
    openclaw doctor
    openclaw logs --follow
    ```

    如有需要，請使用 `channels login` 重新連結。

  </Accordion>

  <Accordion title="發送時無活動中的監聽程式">
    若目標帳號在閘道器中沒有活動中的監聽程式，傳出訊息會快速失敗。

    請確保閘道器正在執行且該帳號已連結。

  </Accordion>

  <Accordion title="群組訊息意外被忽略">
    請依此順序檢查：

    - `groupPolicy`
    - `groupAllowFrom` / `allowFrom`
    - `groups` 允許清單項目
    - 提及門檻 (`requireMention` + 提及模式)

  </Accordion>

  <Accordion title="Bun 執行環境警告">
    WhatsApp 閘道器執行環境應使用 Node。Bun 已被標記為不相容，無法穩定執行 WhatsApp/Telegram 閘道器操作。
  </Accordion>
</AccordionGroup>

## 組態參考捷徑

主要參考：

- [組態參考 - WhatsApp](/gateway/configuration-reference_zh_TW#whatsapp)

重要的 WhatsApp 欄位：

- 存取權：`dmPolicy`, `allowFrom`, `groupPolicy`, `groupAllowFrom`, `groups`
- 遞送：`textChunkLimit`, `chunkMode`, `mediaMaxMb`, `sendReadReceipts`, `ackReaction`
- 多帳號：`accounts.<id>.enabled`, `accounts.<id>.authDir`, 帳號層級覆寫
- 維運：`configWrites`, `debounceMs`, `web.enabled`, `web.heartbeatSeconds`, `web.reconnect.*`
- 會話行為：`session.dmScope`, `historyLimit`, `dmHistoryLimit`, `dms.<id>.historyLimit`

## 相關內容

- [配對](/channels/pairing_zh_TW)
- [頻道路由](/channels/channel-routing_zh_TW)
- [故障排除](/channels/troubleshooting_zh_TW)
