---
summary: "透過 imsg (stdio 上的 JSON-RPC) 提供的舊版 iMessage 支援。新設定建議使用 BlueBubbles。"
read_when:
  - 設定 iMessage 支援功能時
  - 偵錯 iMessage 訊息傳收時
title: "iMessage"
---

> 此文件為 [English Version](/channels/imessage) 的繁體中文版本。

# iMessage (舊版：imsg)

<Warning>
針對新的 iMessage 部署，建議使用 <a href="/channels/bluebubbles_zh_TW">BlueBubbles</a>。

`imsg` 整合方式屬於舊版機制，可能會在未來的版本中移除。
</Warning>

狀態：舊版外部 CLI 整合。閘道器會啟動 `imsg rpc` 程序，並透過 stdio 進行 JSON-RPC 通訊（無需獨立的守護行程或連接埠）。

<CardGroup cols={3}>
  <Card title="BlueBubbles (建議方式)" icon="message-circle" href="/channels/bluebubbles_zh_TW">
    新設定首選的 iMessage 路徑。
  </Card>
  <Card title="配對 (Pairing)" icon="link" href="/channels/pairing_zh_TW">
    iMessage 私訊預設為配對模式。
  </Card>
  <Card title="組態參考" icon="settings" href="/gateway/configuration-reference_zh_TW#imessage">
    完整的 iMessage 欄位參考。
  </Card>
</CardGroup>

## 快速設定

<Tabs>
  <Tab title="本地 Mac (快速路徑)">
    <Steps>
      <Step title="安裝並驗證 imsg">

```bash
brew install steipete/tap/imsg
imsg rpc --help
```

      </Step>

      <Step title="配置 OpenClaw">

```json5
{
  channels: {
    imessage: {
      enabled: true,
      cliPath: "/usr/local/bin/imsg",
      dbPath: "/Users/<您的使用者名稱>/Library/Messages/chat.db",
    },
  },
}
```

      </Step>

      <Step title="啟動閘道器">

```bash
openclaw gateway
```

      </Step>

      <Step title="核准首次私訊配對 (預設 dmPolicy)">

```bash
openclaw pairing list imessage
openclaw pairing approve imessage <配對碼>
```

        配對碼會在 1 小時後過期。
      </Step>
    </Steps>

  </Tab>

  <Tab title="透過 SSH 遠端連線 Mac">
    OpenClaw 僅需要一個相容於 stdio 的 `cliPath`，因此您可以將 `cliPath` 指向一個封裝指令稿 (wrapper script)，該腳本負責透過 SSH 連線至遠端 Mac 並執行 `imsg`。

```bash
#!/usr/bin/env bash
exec ssh -T gateway-host imsg "$@"
```

    啟用附件功能時的建議組態：

```json5
{
  channels: {
    imessage: {
      enabled: true,
      cliPath: "~/.openclaw/scripts/imsg-ssh",
      remoteHost: "user@gateway-host", // 用於 SCP 附件抓取
      includeAttachments: true,
    },
  },
}
```

    若未設定 `remoteHost`，OpenClaw 會嘗試解析 SSH 封裝指令稿來自動偵測。

  </Tab>
</Tabs>

## 要求與權限 (macOS)

- 執行 `imsg` 的 Mac 必須已登入「訊息」App。
- 執行 OpenClaw/`imsg` 的程序上下文需要具備「完整磁碟存取權限」(Full Disk Access)（以便存取訊息資料庫）。
- 需要「自動化」權限才能透過「訊息」App 傳送訊息。

<Tip>
權限是針對每個程序上下文授予的。若閘道器是以無頭模式（如 LaunchAgent 或 SSH）執行，請在同一個上下文執行一次互動式指令以觸發系統權限提示：

```bash
imsg chats --limit 1
# 或
imsg send <帳號> "測試"
```

</Tip>

## 存取控制與路由

<Tabs>
  <Tab title="私訊原則">
    `channels.imessage.dmPolicy` 控制直接訊息：

    - `pairing` (預設)
    - `allowlist`
    - `open` (需要 `allowFrom` 包含 `"*"` )
    - `disabled`

    允許清單欄位：`channels.imessage.allowFrom`。

    允許清單項目可以是 Handle (帳號) 或聊天目標 (`chat_id:*`, `chat_guid:*`, `chat_identifier:*`)。

  </Tab>

  <Tab title="群組原則與提及">
    `channels.imessage.groupPolicy` 控制群組處理方式：

    - `allowlist` (有設定時的預設值)
    - `open`
    - `disabled`

    群組傳送者允許清單：`channels.imessage.groupAllowFrom`。

    執行階段備援：若未設定 `groupAllowFrom`，執行階段在進行 iMessage 群組傳送者檢查時會回退使用 `allowFrom`。

    群組提及門檻：

    - iMessage 不具備原生的提及元數據。
    - 提及偵測需使用正規表示式模式 (`agents.list[].groupChat.mentionPatterns`，備援為 `messages.groupChat.mentionPatterns`)。
    - 若未配置任何模式，則無法強制執行提及門檻。

    來自授權傳送者的控制指令可以繞過群組中的提及門檻。

  </Tab>

  <Tab title="對談與確定性回覆">
    - 私訊使用直接路由；群組使用群組路由。
    - 在預設的 `session.dmScope=main` 設定下，iMessage 私訊會歸併至代理人的主會話。
    - 群組會話是隔離的 (`agent:<agentId>:imessage:group:<chat_id>`)。
    - 回覆訊息會根據原始頻道與目標元數據路由回 iMessage。

    類群組討論串行為：

    部分包含多位參與者的 iMessage 討論串抵達時可能帶有 `is_group=false` 標記。
    若該 `chat_id` 已明確配置在 `channels.imessage.groups` 中，OpenClaw 會將其視為群組流量（套用群組門控與會話隔離）。

  </Tab>
</Tabs>

## 部署模式

<AccordionGroup>
  <Accordion title="專用的機器人 macOS 使用者 (獨立的 iMessage 身分)">
    使用專用的 Apple ID 與 macOS 使用者，使機器人流量與您的個人訊息設定檔隔離。

    典型流程：

    1. 建立並登入一個專用的 macOS 使用者帳號。
    2. 在該使用者下使用機器人 Apple ID 登入「訊息」App。
    3. 在該使用者下安裝 `imsg`。
    4. 建立 SSH 封裝程式，讓 OpenClaw 能在該使用者上下文中執行 `imsg`。
    5. 將 `channels.imessage.accounts.<id>.cliPath` 與 `.dbPath` 指向該使用者路徑。

    首次執行可能需要在該機器人使用者對談中進行 GUI 核准（自動化與完整磁碟存取權限）。

  </Accordion>

  <Accordion title="透過 Tailscale 連接遠端 Mac (範例)">
    常見的拓樸結構：

    - 閘道器執行於 Linux 或虛擬機。
    - iMessage 與 `imsg` 執行於您 Tailnet 中的一台 Mac。
    - `cliPath` 封裝程式使用 SSH 執行 `imsg`。
    - `remoteHost` 設定允許透過 SCP 抓取附件。

    範例：

```json5
{
  channels: {
    imessage: {
      enabled: true,
      cliPath: "~/.openclaw/scripts/imsg-ssh",
      remoteHost: "bot@mac-mini.tailnet-1234.ts.net",
      includeAttachments: true,
      dbPath: "/Users/bot/Library/Messages/chat.db",
    },
  },
}
```

```bash
#!/usr/bin/env bash
exec ssh -T bot@mac-mini.tailnet-1234.ts.net imsg "$@"
```

    建議使用 SSH 密鑰登入，確保 SSH 與 SCP 皆為非互動式執行。

  </Accordion>

  <Accordion title="多帳號模式">
    iMessage 支援在 `channels.imessage.accounts` 下進行個別帳號的組態設定。

    每個帳號可以覆寫 `cliPath`, `dbPath`, `allowFrom`, `groupPolicy`, `mediaMaxMb` 與歷史紀錄設定等欄位。

  </Accordion>
</AccordionGroup>

## 媒體、分塊與定址格式

<AccordionGroup>
  <Accordion title="附件與媒體">
    - 傳入附件的擷取為選用項目：`channels.imessage.includeAttachments`。
    - 設定 `remoteHost` 後，可透過 SCP 獲取遠端附件路徑。
    - 傳出媒體大小上限使用 `channels.imessage.mediaMaxMb`（預設 16 MB）。
  </Accordion>

  <Accordion title="傳出訊息分塊">
    - 文字分塊上限：`channels.imessage.textChunkLimit`（預設 4000）。
    - 分塊模式：`channels.imessage.chunkMode`。
      - `length` (預設，依長度切分)。
      - `newline` (優先依段落切分)。
  </Accordion>

  <Accordion title="定址格式">
    建議使用明確的目標：

    - `chat_id:123`（建議用於穩定路由）。
    - `chat_guid:...`
    - `chat_identifier:...`

    同樣支援 Handle (帳號) 目標：

    - `imessage:+1555...`
    - `sms:+1555...`
    - `使用者名稱@example.com`

```bash
imsg chats --limit 20
```

  </Accordion>
</AccordionGroup>

## 組態寫入

預設情況下，iMessage 允許由頻道發起的組態寫入（用於當 `commands.config: true` 時執行 `/config set|unset`）。

停用方式：

```json5
{
  channels: {
    imessage: {
      configWrites: false,
    },
  },
}
```

## 故障排除

<AccordionGroup>
  <Accordion title="找不到 imsg 或不支援 RPC">
    驗證二進位檔與 RPC 支援狀態：

```bash
imsg rpc --help
openclaw channels status --probe
```

    若探測回報不支援 RPC，請更新 `imsg`。

  </Accordion>

  <Accordion title="私訊被忽略">
    請檢查：

    - `channels.imessage.dmPolicy`
    - `channels.imessage.allowFrom`
    - 配對核准狀態 (`openclaw pairing list imessage`)

  </Accordion>

  <Accordion title="群組訊息被忽略">
    請檢查：

    - `channels.imessage.groupPolicy`
    - `channels.imessage.groupAllowFrom`
    - `channels.imessage.groups` 的允許清單行為
    - 提及模式組態 (`agents.list[].groupChat.mentionPatterns`)

  </Accordion>

  <Accordion title="遠端附件失效">
    請檢查：

    - `channels.imessage.remoteHost`
    - 來自閘道器主機的 SSH/SCP 密鑰驗證是否正確
    - 執行「訊息」App 的 Mac 上，遠端路徑是否可讀取

  </Accordion>

  <Accordion title="錯過了 macOS 權限提示">
    在同一個使用者/會話內容下，重新於互動式 GUI 終端機中執行指令並核准提示：

```bash
imsg chats --limit 1
imsg send <帳號> "測試"
```

    確認執行 OpenClaw/`imsg` 的程序內容已被授予「完整磁碟存取權限」與「自動化」權限。

  </Accordion>
</AccordionGroup>

## 組態參考捷徑

- [組態參考 - iMessage](/gateway/configuration-reference_zh_TW#imessage)
- [閘道器組態](/gateway/configuration_zh_TW)
- [配對](/channels/pairing_zh_TW)
- [BlueBubbles](/channels/bluebubbles_zh_TW)
