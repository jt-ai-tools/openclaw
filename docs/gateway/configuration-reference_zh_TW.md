---
title: "組態參考"
description: "~/.openclaw/openclaw.json 的完整逐欄位參考指南"
---

> 此文件為 [English Version](/gateway/configuration-reference_zh_TW) 的繁體中文版本。

# 組態參考

本頁面列出 `~/.openclaw/openclaw.json` 中可用的所有欄位。若要查看任務導向的概觀，請參閱 [組態設定](/gateway/configuration_zh_TW)。

組態格式為 **JSON5**（支援註解與結尾逗號）。所有欄位皆為選填 —— 若省略，OpenClaw 將使用安全的預設值。

---

## 頻道 (Channels)

只要對應的組態區段存在（且未設定 `enabled: false`），各頻道即會自動啟動。

### 私訊與群組存取

所有頻道皆支援私訊原則 (DM policies) 與群組原則：

| 私訊原則 (DM policy) | 行為 |
| ------------------- | --------------------------------------------------------------- |
| `pairing` (預設) | 未知傳送者會收到單次配對碼；擁有者必須核准 |
| `allowlist` | 僅允許 `allowFrom`（或已配對的允許存儲區）中的傳送者 |
| `open` | 允許所有傳入私訊（需要設定 `allowFrom: ["*"]`） |
| `disabled` | 忽略所有傳入私訊 |

| 群組原則 (Group policy) | 行為 |
| --------------------- | ------------------------------------------------------ |
| `allowlist` (預設) | 僅允許符合所設定之允許清單的群組 |
| `open` | 繞過群組允許清單（提及門檻機制仍適用） |
| `disabled` | 阻擋所有群組/房間訊息 |

<Note>
`channels.defaults.groupPolicy` 可設定當提供者未指定 `groupPolicy` 時的預設值。
配對碼會在 1 小時後過期。每個頻道待處理的私訊配對請求上限為 **3 個**。
Slack/Discord 有特殊的備援機制：如果其提供者區段完全缺失，執行階段的群組原則可能會解析為 `open`（並顯示啟動警告）。
</Note>

### WhatsApp

WhatsApp 透過閘道器的網頁頻道 (Baileys Web) 執行。只要存在已連結的對談工作階段，它就會自動啟動。

```json5
{
  channels: {
    whatsapp: {
      dmPolicy: "pairing", // pairing | allowlist | open | disabled
      allowFrom: ["+15555550123", "+447700900123"],
      textChunkLimit: 4000,
      chunkMode: "length", // length (長度) | newline (換行)
      mediaMaxMb: 50,
      sendReadReceipts: true, // 藍色勾勾（在自我對話模式中為 false）
      groups: {
        "*": { requireMention: true },
      },
      groupPolicy: "allowlist",
      groupAllowFrom: ["+15551234567"],
    },
  },
  web: {
    enabled: true,
    heartbeatSeconds: 60,
    reconnect: {
      initialMs: 2000,
      maxMs: 120000,
      factor: 1.4,
      jitter: 0.2,
      maxAttempts: 0,
    },
  },
}
```

<Accordion title="多帳號 WhatsApp">

```json5
{
  channels: {
    whatsapp: {
      accounts: {
        default: {},
        personal: {},
        biz: {
          // authDir: "~/.openclaw/credentials/whatsapp/biz",
        },
      },
    },
  },
}
```

- 傳出指令預設使用 `default` 帳號（若存在）；否則使用第一個設定的帳號 ID（依名稱排序）。
- 舊版單帳號 Baileys 驗證目錄會由 `openclaw doctor` 遷移至 `whatsapp/default`。
- 針對個別帳號的覆寫：`channels.whatsapp.accounts.<id>.sendReadReceipts`。

</Accordion>

### Telegram

```json5
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "您的機器人-Token",
      dmPolicy: "pairing",
      allowFrom: ["tg:123456789"],
      groups: {
        "*": { requireMention: true },
        "-1001234567890": {
          allowFrom: ["@admin"],
          systemPrompt: "回答請保持簡短。",
          topics: {
            "99": {
              requireMention: false,
              skills: ["search"],
              systemPrompt: "請保持在該主題內。",
            },
          },
        },
      },
      customCommands: [
        { command: "backup", description: "Git 備份" },
        { command: "generate", description: "建立影像" },
      ],
      historyLimit: 50,
      replyToMode: "first", // off | first | all
      linkPreview: true,
      streamMode: "partial", // off | partial | block
      draftChunk: {
        minChars: 200,
        maxChars: 800,
        breakPreference: "paragraph", // paragraph (段落) | newline (換行) | sentence (句子)
      },
      actions: { reactions: true, sendMessage: true },
      reactionNotifications: "own", // off | own | all
      mediaMaxMb: 5,
      retry: {
        attempts: 3,
        minDelayMs: 400,
        maxDelayMs: 30000,
        jitter: 0.1,
      },
      network: { autoSelectFamily: false },
      proxy: "socks5://localhost:9050",
      webhookUrl: "https://example.com/telegram-webhook",
      webhookSecret: "secret",
      webhookPath: "/telegram-webhook",
    },
  },
}
```

- 機器人 Token：`channels.telegram.botToken` 或 `channels.telegram.tokenFile`，針對預設帳號可由環境變數 `TELEGRAM_BOT_TOKEN` 提供備援。
- `configWrites: false` 可阻擋由 Telegram 發起的組態寫入（超級群組 ID 遷移、`/config set|unset`）。
- 草稿串流 (Draft streaming) 使用 Telegram 的 `sendMessageDraft`（需要私訊主題功能）。
- 重試原則：請參閱 [重試原則](/concepts/retry_zh_TW)。

### Discord

```json5
{
  channels: {
    discord: {
      enabled: true,
      token: "您的機器人-Token",
      mediaMaxMb: 8,
      allowBots: false,
      actions: {
        reactions: true,
        stickers: true,
        polls: true,
        permissions: true,
        messages: true,
        threads: true,
        pins: true,
        search: true,
        memberInfo: true,
        roleInfo: true,
        roles: false,
        channelInfo: true,
        voiceStatus: true,
        events: true,
        moderation: false,
      },
      replyToMode: "off", // off | first | all
      dm: {
        enabled: true,
        policy: "pairing",
        allowFrom: ["1234567890", "steipete"],
        groupEnabled: false,
        groupChannels: ["openclaw-dm"],
      },
      guilds: {
        "123456789012345678": {
          slug: "friends-of-openclaw",
          requireMention: false,
          reactionNotifications: "own",
          users: ["987654321098765432"],
          channels: {
            general: { allow: true },
            help: {
              allow: true,
              requireMention: true,
              users: ["987654321098765432"],
              skills: ["docs"],
              systemPrompt: "僅限簡短回答。",
            },
          },
        },
      },
      historyLimit: 20,
      textChunkLimit: 2000,
      chunkMode: "length", // length | newline
      maxLinesPerMessage: 17,
      retry: {
        attempts: 3,
        minDelayMs: 500,
        maxDelayMs: 30000,
        jitter: 0.1,
      },
    },
  },
}
```

- Token：`channels.discord.token`，針對預設帳號可由環境變數 `DISCORD_BOT_TOKEN` 提供備援。
- 傳遞目標請使用 `user:<id>` (私訊) 或 `channel:<id>` (伺服器頻道)；僅填寫數字 ID 會被拒絕。
- 伺服器代稱 (Guild slugs) 為小寫並將空格替換為 `-`；頻道鍵名使用代稱化名稱（不含 `#`）。建議使用伺服器 ID。
- 預設忽略機器人發送的訊息。`allowBots: true` 可啟用此項（機器人自身的訊息仍會被過濾）。
- `maxLinesPerMessage`（預設 17）即使在 2000 字元內，也會切分過長的訊息。

**心情回應通知模式 (Reaction notification modes):** `off` (不通知), `own` (機器人的訊息，預設值), `all` (所有訊息), `allowlist` (僅通知來自 `guilds.<id>.users` 針對所有訊息的心情回應)。

### Google Chat

```json5
{
  channels: {
    googlechat: {
      enabled: true,
      serviceAccountFile: "/path/to/service-account.json",
      audienceType: "app-url", // app-url | project-number
      audience: "https://gateway.example.com/googlechat",
      webhookPath: "/googlechat",
      botUser: "users/1234567890",
      dm: {
        enabled: true,
        policy: "pairing",
        allowFrom: ["users/1234567890"],
      },
      groupPolicy: "allowlist",
      groups: {
        "spaces/AAAA": { allow: true, requireMention: true },
      },
      actions: { reactions: true },
      typingIndicator: "message",
      mediaMaxMb: 20,
    },
  },
}
```

- 服務帳號 JSON：內聯方式 (`serviceAccount`) 或檔案方式 (`serviceAccountFile`)。
- 環境變數備援：`GOOGLE_CHAT_SERVICE_ACCOUNT` 或 `GOOGLE_CHAT_SERVICE_ACCOUNT_FILE`。
- 傳遞目標請使用 `spaces/<spaceId>` 或 `users/<userId|email>`。

### Slack

```json5
{
  channels: {
    slack: {
      enabled: true,
      botToken: "xoxb-...",
      appToken: "xapp-...",
      dm: {
        enabled: true,
        policy: "pairing",
        allowFrom: ["U123", "U456", "*"],
        groupEnabled: false,
        groupChannels: ["G123"],
      },
      channels: {
        C123: { allow: true, requireMention: true, allowBots: false },
        "#general": {
          allow: true,
          requireMention: true,
          allowBots: false,
          users: ["U123"],
          skills: ["docs"],
          systemPrompt: "僅限簡短回答。",
        },
      },
      historyLimit: 50,
      allowBots: false,
      reactionNotifications: "own",
      reactionAllowlist: ["U123"],
      replyToMode: "off", // off | first | all
      thread: {
        historyScope: "thread", // thread (討論串) | channel (頻道)
        inheritParent: false,
      },
      actions: {
        reactions: true,
        messages: true,
        pins: true,
        memberInfo: true,
        emojiList: true,
      },
      slashCommand: {
        enabled: true,
        name: "openclaw",
        sessionPrefix: "slack:slash",
        ephemeral: true,
      },
      textChunkLimit: 4000,
      chunkMode: "length",
      mediaMaxMb: 20,
    },
  },
}
```

- **Socket 模式** 需要同時提供 `botToken` 與 `appToken`（預設帳號可由環境變數 `SLACK_BOT_TOKEN` + `SLACK_APP_TOKEN` 備援）。
- **HTTP 模式** 需要 `botToken` 加上 `signingSecret`（位於根目錄或個別帳號）。
- `configWrites: false` 可阻擋由 Slack 發起的組態寫入。
- 傳遞目標請使用 `user:<id>` (私訊) 或 `channel:<id>`。

**心情回應通知模式：** `off`, `own` (預設值), `all`, `allowlist` (來自 `reactionAllowlist`)。

**討論串會話隔離：** `thread.historyScope` 為各討論串獨立 (預設) 或跨頻道共享。`thread.inheritParent` 會將父頻道的轉錄記錄複製到新討論串。

| 動作群組 | 預設值 | 備註 |
| ------------ | ------- | ---------------------- |
| reactions | enabled | 回應 + 列出回應 |
| messages | enabled | 讀取/傳送/編輯/刪除 |
| pins | enabled | 置頂/取消置頂/列出 |
| memberInfo | enabled | 成員資訊 |
| emojiList | enabled | 自訂 Emoji 清單 |

### Mattermost

Mattermost 以外掛程式形式提供：`openclaw plugins install @openclaw/mattermost`。

```json5
{
  channels: {
    mattermost: {
      enabled: true,
      botToken: "mm-token",
      baseUrl: "https://chat.example.com",
      dmPolicy: "pairing",
      chatmode: "oncall", // oncall | onmessage | onchar
      oncharPrefixes: [">", "!"],
      textChunkLimit: 4000,
      chunkMode: "length",
    },
  },
}
```

聊天模式：`oncall` (在被 @-提及時回應，預設值), `onmessage` (每則訊息皆回應), `onchar` (僅回應以觸發前綴開頭的訊息)。

### Signal

```json5
{
  channels: {
    signal: {
      reactionNotifications: "own", // off | own | all | allowlist
      reactionAllowlist: ["+15551234567", "uuid:123e4567-e89b-12d3-a456-426614174000"],
      historyLimit: 50,
    },
  },
}
```

**心情回應通知模式：** `off`, `own` (預設值), `all`, `allowlist` (來自 `reactionAllowlist`)。

### iMessage

OpenClaw 會啟動 `imsg rpc` (透過 stdio 的 JSON-RPC)。無需守護行程或連接埠。

```json5
{
  channels: {
    imessage: {
      enabled: true,
      cliPath: "imsg",
      dbPath: "~/Library/Messages/chat.db",
      remoteHost: "user@gateway-host",
      dmPolicy: "pairing",
      allowFrom: ["+15555550123", "user@example.com", "chat_id:123"],
      historyLimit: 50,
      includeAttachments: false,
      mediaMaxMb: 16,
      service: "auto",
      region: "US",
    },
  },
}
```

- 需要對訊息資料庫 (Messages DB) 的「完整磁碟存取權限」。
- 建議使用 `chat_id:<id>` 作為目標。執行 `imsg chats --limit 20` 可列出聊天。
- `cliPath` 可指向 SSH 封裝程式；設定 `remoteHost` 以便進行 SCP 附件抓取。

<Accordion title="iMessage SSH 封裝範例">

```bash
#!/usr/bin/env bash
exec ssh -T gateway-host imsg "$@"
```

</Accordion>

### 多帳號 (所有頻道皆適用)

為每個頻道執行多個帳號（各自擁有獨立的 `accountId`）：

```json5
{
  channels: {
    telegram: {
      accounts: {
        default: {
          name: "主要機器人",
          botToken: "123456:ABC...",
        },
        alerts: {
          name: "警報機器人",
          botToken: "987654:XYZ...",
        },
      },
    },
  },
}
```

- 若省略 `accountId`，則預設使用 `default` (CLI + 路由)。
- 環境變數 Token 僅適用於 **預設** 帳號。
- 基礎頻道設定適用於所有帳號，除非被帳號層級覆寫。
- 使用 `bindings[].match.accountId` 將各帳號路由至不同的代理人。

### 群組聊天提及門檻 (Mention Gating)

群組訊息預設 **需要提及 (require mention)**（透過元數據提及或正規表示式）。適用於 WhatsApp、Telegram、Discord、Google Chat 以及 iMessage 群組。

**提及類型：**

- **元數據提及**：各平台原生的 @-提及。在 WhatsApp 自我對話模式中會被忽略。
- **文字模式**：位於 `agents.list[].groupChat.mentionPatterns` 的正規表示式。一律會進行檢查。
- 僅在可偵測時（原生提及或至少存在一個模式）才會強制執行提及門檻。

```json5
{
  messages: {
    groupChat: { historyLimit: 50 },
  },
  agents: {
    list: [{ id: "main", groupChat: { mentionPatterns: ["@openclaw", "openclaw"] } }],
  },
}
```

`messages.groupChat.historyLimit` 設定全域預設值。各頻道可透過 `channels.<channel>.historyLimit`（或帳號層級）進行覆寫。設為 `0` 以停用。

#### 私訊歷史紀錄限制

```json5
{
  channels: {
    telegram: {
      dmHistoryLimit: 30,
      dms: {
        "123456789": { historyLimit: 50 },
      },
    },
  },
}
```

解析順序：個別私訊覆寫 → 提供者預設值 → 無限制（全數保留）。

支援頻道：`telegram`, `whatsapp`, `discord`, `slack`, `signal`, `imessage`, `msteams`。

#### 自我對話模式 (Self-chat mode)

在 `allowFrom` 中包含您自己的號碼即可啟用自我對話模式（忽略原生 @-提及，僅回應文字模式）：

```json5
{
  channels: {
    whatsapp: {
      allowFrom: ["+15555550123"],
      groups: { "*": { requireMention: true } },
    },
  },
  agents: {
    list: [
      {
        id: "main",
        groupChat: { mentionPatterns: ["回覆我", "@openclaw"] },
      },
    ],
  },
}
```

### 指令 (聊天指令處理)

```json5
{
  commands: {
    native: "auto", // 支援時註冊原生指令
    text: true, // 解析聊天訊息中的 /commands
    bash: false, // 允許 ! (別名: /bash)
    bashForegroundMs: 2000,
    config: false, // 允許 /config
    debug: false, // 允許 /debug
    restart: false, // 允許 /restart + 閘道器重啟工具
    allowFrom: {
      "*": ["user1"],
      discord: ["user:123"],
    },
    useAccessGroups: true,
  },
}
```

<Accordion title="指令細節">

- 文字指令必須是前置 `/` 的 **獨立** 訊息。
- `native: "auto"` 會為 Discord/Telegram 開啟原生指令，Slack 保持關閉。
- 各頻道覆寫：`channels.discord.commands.native`（布林值或 `"auto"`）。`false` 會清除先前註冊的指令。
- `channels.telegram.customCommands` 可新增額外的 Telegram 機器人選單項目。
- `bash: true` 可針對宿主 Shell 啟用 `! <指令>`。需要啟用 `tools.elevated.enabled` 且傳送者需位於 `tools.elevated.allowFrom.<channel>`。
- `config: true` 可啟用 `/config`（讀取/寫入 `openclaw.json`）。
- `channels.<provider>.configWrites` 可控管各頻道的組態變更權限（預設為 true）。
- `allowFrom` 是基於提供者的。設定後，它將成為 **唯一的** 授權來源（頻道允許清單/配對以及 `useAccessGroups` 會被忽略）。
- `useAccessGroups: false` 當未設定 `allowFrom` 時，允許指令繞過存取群組策略。

</Accordion>

---

## 代理人預設值 (Agent defaults)

### `agents.defaults.workspace`

預設值：`~/.openclaw/workspace`。

```json5
{
  agents: { defaults: { workspace: "~/.openclaw/workspace" } },
}
```

### `agents.defaults.repoRoot`

選用的儲存庫根目錄，顯示在系統提示詞的 Runtime 行中。若未設定，OpenClaw 會從工作區向上搜尋自動偵測。

```json5
{
  agents: { defaults: { repoRoot: "~/Projects/openclaw" } },
}
```

### `agents.defaults.skipBootstrap`

停用自動建立工作區引導檔案 (`AGENTS.md`, `SOUL.md`, `TOOLS.md`, `IDENTITY.md`, `USER.md`, `HEARTBEAT.md`, `BOOTSTRAP.md`)。

```json5
{
  agents: { defaults: { skipBootstrap: true } },
}
```

### `agents.defaults.bootstrapMaxChars`

每個工作區引導檔案被截斷前的最大字元數。預設值：`20000`。

```json5
{
  agents: { defaults: { bootstrapMaxChars: 20000 } },
}
```

### `agents.defaults.userTimezone`

用於系統提示詞上下文的時區（非訊息時間戳記）。預設為宿主機時區。

```json5
{
  agents: { defaults: { userTimezone: "Asia/Taipei" } },
}
```

### `agents.defaults.timeFormat`

系統提示詞中的時間格式。預設值：`auto` (作業系統偏好)。

```json5
{
  agents: { defaults: { timeFormat: "auto" } }, // auto | 12 | 24
}
```

### `agents.defaults.model`

```json5
{
  agents: {
    defaults: {
      models: {
        "anthropic/claude-opus-4-6": { alias: "opus" },
        "minimax/MiniMax-M2.1": { alias: "minimax" },
      },
      model: {
        primary: "anthropic/claude-opus-4-6",
        fallbacks: ["minimax/MiniMax-M2.1"],
      },
      imageModel: {
        primary: "openrouter/qwen/qwen-2.5-vl-72b-instruct:free",
        fallbacks: ["openrouter/google/gemini-2.0-flash-vision:free"],
      },
      thinkingDefault: "low",
      verboseDefault: "off",
      elevatedDefault: "on",
      timeoutSeconds: 600,
      mediaMaxMb: 5,
      contextTokens: 200000,
      maxConcurrent: 3,
    },
  },
}
```

- `model.primary`：格式為 `提供者/模型` (例如 `anthropic/claude-opus-4-6`)。如果省略提供者，OpenClaw 會預設為 `anthropic`（不建議使用）。
- `models`：已設定的模型型錄以及 `/model` 指令的允許清單。每個項目可包含 `alias` (捷徑) 與 `params` (提供者專屬：`temperature`, `maxTokens`)。
- `imageModel`：僅在主要模型不支援影像輸入時使用。
- `maxConcurrent`：跨對談的代理人平行執行最大數量（單個對談仍會序列化執行）。預設值：1。

**內建別名簡寫**（僅在模型位於 `agents.defaults.models` 中時適用）：

| 別名 | 模型 |
| -------------- | ------------------------------- |
| `opus` | `anthropic/claude-opus-4-6` |
| `sonnet` | `anthropic/claude-sonnet-4-5` |
| `gpt` | `openai/gpt-5.2` |
| `gpt-mini` | `openai/gpt-5-mini` |
| `gemini` | `google/gemini-3-pro-preview` |
| `gemini-flash` | `google/gemini-3-flash-preview` |

您自訂的別名優先順序高於預設值。

Z.AI GLM-4.x 模型會自動啟用思考模式，除非您設定 `--thinking off` 或自行在 `agents.defaults.models["zai/<model>"].params.thinking` 中定義。

### `agents.defaults.cliBackends`

選用的 CLI 後端，用於僅限文字的備援執行（不含工具調用）。當 API 提供者故障時可作為備援。

```json5
{
  agents: {
    defaults: {
      cliBackends: {
        "claude-cli": {
          command: "/opt/homebrew/bin/claude",
        },
        "my-cli": {
          command: "my-cli",
          args: ["--json"],
          output: "json",
          modelArg: "--model",
          sessionArg: "--session",
          sessionMode: "existing",
          systemPromptArg: "--system",
          systemPromptWhen: "first",
          imageArg: "--image",
          imageMode: "repeat",
        },
      },
    },
  },
}
```

- CLI 後端僅限文字；工具功能一律停用。
- 當設定了 `sessionArg` 時支援對談功能。
- 當 `imageArg` 接受檔案路徑時支援影像傳遞。

### `agents.defaults.heartbeat`

定期心跳偵測執行。

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m", // 0m 停用
        model: "openai/gpt-5.2-mini",
        includeReasoning: false,
        session: "main",
        to: "+15555550123",
        target: "last", // last (最近一次) | whatsapp | telegram | discord | ... | none
        prompt: "讀取 HEARTBEAT.md 如果它存在的話...",
        ackMaxChars: 300,
      },
    },
  },
}
```

- `every`：時間長度字串 (ms/s/m/h)。預設值：`30m`。
- 各代理人設定：設定 `agents.list[].heartbeat`。當有任何代理人定義了 `heartbeat` 時，**僅有這些代理人**會執行心跳偵測。
- 心跳會執行完整的代理人回合 —— 間隔越短，Token 消耗量越高。

### `agents.defaults.compaction`

```json5
{
  agents: {
    defaults: {
      compaction: {
        mode: "safeguard", // default | safeguard
        reserveTokensFloor: 24000,
        memoryFlush: {
          enabled: true,
          softThresholdTokens: 6000,
          systemPrompt: "會話即將進行壓縮。請現在儲存持久記憶。",
          prompt: "將任何持久筆記寫入 memory/YYYY-MM-DD.md；如果沒有需要儲存的內容，請回覆 NO_REPLY。",
        },
      },
    },
  },
}
```

- `mode`：`default` 或 `safeguard`（針對長歷史紀錄進行分塊摘要）。請參閱 [壓縮 (Compaction)](/concepts/compaction_zh_TW)。
- `memoryFlush`：在自動壓縮前進行無聲的代理人回合，以儲存持久記憶。當工作區為唯讀時會跳過此步驟。

### `agents.defaults.contextPruning`

在傳送給 LLM 之前，從記憶體上下文中修剪 **舊的工具執行結果**。這 **不會** 修改硬碟上的對談歷史紀錄。

```json5
{
  agents: {
    defaults: {
      contextPruning: {
        mode: "cache-ttl", // off | cache-ttl
        ttl: "1h", // 時間長度 (ms/s/m/h)，預設單位：分鐘
        keepLastAssistants: 3,
        softTrimRatio: 0.3,
        hardClearRatio: 0.5,
        minPrunableToolChars: 50000,
        softTrim: { maxChars: 4000, headChars: 1500, tailChars: 1500 },
        hardClear: { enabled: true, placeholder: "[舊的工具執行結果已清除]" },
        tools: { deny: ["browser", "canvas"] },
      },
    },
  },
}
```

<Accordion title="cache-ttl 模式行為">

- `mode: "cache-ttl"` 啟用修剪流程。
- `ttl` 控制修剪再次執行的頻率（自上次快取存取後計算）。
- 修剪會先對過大的工具結果進行軟修剪 (soft-trim)，必要時再硬清除 (hard-clear) 較舊的結果。

**軟修剪 (Soft-trim)** 會保留頭尾並在中間插入 `...`。

**硬清除 (Hard-clear)** 會將整個工具結果替換為佔位符文字。

注意事項：

- 影像區塊絕不會被修剪/清除。
- 比例是基於字元數（近似值），而非精確的 Token 數。
- 如果助理訊息少於 `keepLastAssistants` 個，則會跳過修剪。

</Accordion>

行為細節請見 [會話修剪 (Session Pruning)](/concepts/session-pruning_zh_TW)。

### 區塊串流 (Block streaming)

```json5
{
  agents: {
    defaults: {
      blockStreamingDefault: "off", // on | off
      blockStreamingBreak: "text_end", // text_end | message_end
      blockStreamingChunk: { minChars: 800, maxChars: 1200 },
      blockStreamingCoalesce: { idleMs: 1000 },
      humanDelay: { mode: "natural" }, // off | natural | custom (使用 minMs/maxMs)
    },
  },
}
```

- 非 Telegram 頻道需要明確設定 `*.blockStreaming: true` 才能啟用區塊回覆。
- 頻道覆寫：`channels.<channel>.blockStreamingCoalesce`（及其帳號層級變體）。Signal/Slack/Discord/Google Chat 預設 `minChars: 1500`。
- `humanDelay`：區塊回覆之間的隨機停頓。`natural` = 800–2500ms。各代理人覆寫：`agents.list[].humanDelay`。

行為與分塊細節請見 [串流 (Streaming)](/concepts/streaming_zh_TW)。

### 輸入指示器 (Typing indicators)

```json5
{
  agents: {
    defaults: {
      typingMode: "instant", // never | instant | thinking | message
      typingIntervalSeconds: 6,
    },
  },
}
```

- 預設值：直接對話/提及時為 `instant`，未被提及的群組對話則為 `message`。
- 各會話覆寫：`session.typingMode`, `session.typingIntervalSeconds`。

請參閱 [輸入指示器](/concepts/typing-indicators_zh_TW)。

### `agents.defaults.sandbox`

內嵌代理人的選用 **Docker 沙箱** 功能。完整指南請見 [沙箱 (Sandboxing)](/gateway/sandboxing_zh_TW)。

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main", // off | non-main | all
        scope: "agent", // session | agent | shared
        workspaceAccess: "none", // none | ro | rw
        workspaceRoot: "~/.openclaw/sandboxes",
        docker: {
          image: "openclaw-sandbox:bookworm-slim",
          containerPrefix: "openclaw-sbx-",
          workdir: "/workspace",
          readOnlyRoot: true,
          tmpfs: ["/tmp", "/var/tmp", "/run"],
          network: "none",
          user: "1000:1000",
          capDrop: ["ALL"],
          env: { LANG: "C.UTF-8" },
          setupCommand: "apt-get update && apt-get install -y git curl jq",
          pidsLimit: 256,
          memory: "1g",
          memorySwap: "2g",
          cpus: 1,
          ulimits: {
            nofile: { soft: 1024, hard: 2048 },
            nproc: 256,
          },
          seccompProfile: "/path/to/seccomp.json",
          apparmorProfile: "openclaw-sandbox",
          dns: ["1.1.1.1", "8.8.8.8"],
          extraHosts: ["internal.service:10.0.0.5"],
          binds: ["/home/user/source:/source:rw"],
        },
        browser: {
          enabled: false,
          image: "openclaw-sandbox-browser:bookworm-slim",
          cdpPort: 9222,
          vncPort: 5900,
          noVncPort: 6080,
          headless: false,
          enableNoVnc: true,
          allowHostControl: false,
          autoStart: true,
          autoStartTimeoutMs: 12000,
        },
        prune: {
          idleHours: 24,
          maxAgeDays: 7,
        },
      },
    },
  },
  tools: {
    sandbox: {
      tools: {
        allow: [
          "exec",
          "process",
          "read",
          "write",
          "edit",
          "apply_patch",
          "sessions_list",
          "sessions_history",
          "sessions_send",
          "sessions_spawn",
          "session_status",
        ],
        deny: ["browser", "canvas", "nodes", "cron", "discord", "gateway"],
      },
    },
  },
}
```

<Accordion title="沙箱細節">

**工作區存取權：**

- `none`：位於 `~/.openclaw/sandboxes` 的個別範圍沙箱工作區
- `ro`：沙箱工作區位於 `/workspace`，代理人工作區以唯讀方式掛載於 `/agent`
- `rw`：代理人工作區以讀寫方式掛載於 `/workspace`

**範圍 (Scope)：**

- `session`：每個會話獨立的容器與工作區
- `agent`：每個代理人獨立的容器與工作區 (預設值)
- `shared`：共用的容器與工作區（無跨會話隔離）

**`setupCommand`** 會在容器建立後執行一次（透過 `sh -lc`）。需要網路連線、可寫入的 root 以及 root 使用者權限。

**容器預設為 `network: "none"`** —— 若代理人需要對外連線，請設定為 `"bridge"`。

**傳入的附件** 會被暫存到作用中工作區的 `media/inbound/*` 目錄。

**`docker.binds`** 掛載額外的宿主機目錄；全域與各代理人的掛載設定會進行合併。

**沙箱化瀏覽器** (`sandbox.browser.enabled`)：容器內的 Chromium + CDP。noVNC URL 會注入系統提示詞。不需要在主組態中啟用 `browser.enabled`。

- `allowHostControl: false` (預設) 會阻擋沙箱會話存取宿主機的瀏覽器。

</Accordion>

建置映像檔：

```bash
scripts/sandbox-setup.sh           # 主沙箱映像檔
scripts/sandbox-browser-setup.sh   # 選用的瀏覽器映像檔
```

### `agents.list` (各代理人覆寫)

```json5
{
  agents: {
    list: [
      {
        id: "main",
        default: true,
        name: "主要代理人",
        workspace: "~/.openclaw/workspace",
        agentDir: "~/.openclaw/agents/main/agent",
        model: "anthropic/claude-opus-4-6", // 或 { primary, fallbacks }
        identity: {
          name: "Samantha",
          theme: "樂於助人的樹懶",
          emoji: "🦥",
          avatar: "avatars/samantha.png",
        },
        groupChat: { mentionPatterns: ["@openclaw"] },
        sandbox: { mode: "off" },
        subagents: { allowAgents: ["*"] },
        tools: {
          profile: "coding",
          allow: ["browser"],
          deny: ["canvas"],
          elevated: { enabled: true },
        },
      },
    ],
  },
}
```

- `id`：固定的代理人 ID（必填）。
- `default`：當設定多個時，第一個勝出（會記錄警告）。若未設定，則清單中第一個項目為預設。
- `model`：字串形式僅覆寫 `primary`；物件形式 `{ primary, fallbacks }` 覆寫兩者（`[]` 會停用全域備援）。
- `identity.avatar`：相對於工作區的路徑、`http(s)` URL 或 `data:` URI。
- `identity` 的預設衍生：`ackReaction` 來自 `emoji`，`mentionPatterns` 來自 `name`/`emoji`。
- `subagents.allowAgents`：`sessions_spawn` 允許的代理人 ID 列表（`["*"]` = 任何；預設：僅限同一個代理人）。

---

## 多代理人路由 (Multi-agent routing)

在單個閘道器中執行多個隔離的代理人。請參閱 [多代理人](/concepts/multi-agent_zh_TW)。

```json5
{
  agents: {
    list: [
      { id: "home", default: true, workspace: "~/.openclaw/workspace-home" },
      { id: "work", workspace: "~/.openclaw/workspace-work" },
    ],
  },
  bindings: [
    { agentId: "home", match: { channel: "whatsapp", accountId: "personal" } },
    { agentId: "work", match: { channel: "whatsapp", accountId: "biz" } },
  ],
}
```

### 綁定匹配欄位

- `match.channel` (必填)
- `match.accountId` (選填；`*` = 任何帳號；省略 = 預設帳號)
- `match.peer` (選填；`{ kind: direct|group|channel, id }`)
- `match.guildId` / `match.teamId` (選填；頻道專屬)

**確定性的匹配順序：**

1. `match.peer`
2. `match.guildId`
3. `match.teamId`
4. `match.accountId`（精確匹配，不含同儕/伺服器/團隊）
5. `match.accountId: "*"`（頻道層級）
6. 預設代理人

在每個階層中，第一個匹配到的 `bindings` 項目即勝出。

### 各代理人存取設定檔

<Accordion title="完整存取權 (無沙箱)">

```json5
{
  agents: {
    list: [
      {
        id: "personal",
        workspace: "~/.openclaw/workspace-personal",
        sandbox: { mode: "off" },
      },
    ],
  },
}
```

</Accordion>

<Accordion title="唯讀工具 + 工作區">

```json5
{
  agents: {
    list: [
      {
        id: "family",
        workspace: "~/.openclaw/workspace-family",
        sandbox: { mode: "all", scope: "agent", workspaceAccess: "ro" },
        tools: {
          allow: [
            "read",
            "sessions_list",
            "sessions_history",
            "sessions_send",
            "sessions_spawn",
            "session_status",
          ],
          deny: ["write", "edit", "apply_patch", "exec", "process", "browser"],
        },
      },
    ],
  },
}
```

</Accordion>

<Accordion title="無檔案系統存取權 (僅限通訊)">

```json5
{
  agents: {
    list: [
      {
        id: "public",
        workspace: "~/.openclaw/workspace-public",
        sandbox: { mode: "all", scope: "agent", workspaceAccess: "none" },
        tools: {
          allow: [
            "sessions_list",
            "sessions_history",
            "sessions_send",
            "sessions_spawn",
            "session_status",
            "whatsapp",
            "telegram",
            "slack",
            "discord",
            "gateway",
          ],
          deny: [
            "read",
            "write",
            "edit",
            "apply_patch",
            "exec",
            "process",
            "browser",
            "canvas",
            "nodes",
            "cron",
            "gateway",
            "image",
          ],
        },
      },
    ],
  },
}
```

</Accordion>

詳情請見 [多代理人沙箱與工具](/tools/multi-agent-sandbox-tools_zh_TW) 中的優先順序說明。

---

## 會話 (Session)

```json5
{
  session: {
    scope: "per-sender",
    dmScope: "main", // main | per-peer | per-channel-peer | per-account-channel-peer
    identityLinks: {
      alice: ["telegram:123456789", "discord:987654321012345678"],
    },
    reset: {
      mode: "daily", // daily (每日) | idle (閒置)
      atHour: 4,
      idleMinutes: 60,
    },
    resetByType: {
      thread: { mode: "daily", atHour: 4 },
      direct: { mode: "idle", idleMinutes: 240 },
      group: { mode: "idle", idleMinutes: 120 },
    },
    resetTriggers: ["/new", "/reset"],
    store: "~/.openclaw/agents/{agentId}/sessions/sessions.json",
    maintenance: {
      mode: "warn", // warn (警告) | enforce (強制)
      pruneAfter: "30d",
      maxEntries: 500,
      rotateBytes: "10mb",
    },
    mainKey: "main", // 舊版欄位 (執行階段一律使用 "main")
    agentToAgent: { maxPingPongTurns: 5 },
    sendPolicy: {
      rules: [{ action: "deny", match: { channel: "discord", chatType: "group" } }],
      default: "allow",
    },
  },
}
```

<Accordion title="會話欄位細節">

- **`dmScope`**：私訊如何進行分組。
  - `main`：所有私訊共享主會話。
  - `per-peer`：依據跨頻道的傳送者 ID 隔離。
  - `per-channel-peer`：依據頻道 + 傳送者隔離（多使用者環境的建議值）。
  - `per-account-channel-peer`：依據帳號 + 頻道 + 傳送者隔離（多帳號環境的建議值）。
- **`identityLinks`**：將規範 ID 對應至帶有提供者前綴的同儕，以便跨頻道共享會話。
- **`reset`**：主要的重設原則。`daily` 會在當地時間的 `atHour` 重設；`idle` 則在 `idleMinutes` 之後重設。當兩者皆設定時，先到期者勝出。
- **`resetByType`**：依據類型的覆寫 (`direct`, `group`, `thread`)。舊版的 `dm` 被接受為 `direct` 的別名。
- **`mainKey`**：舊版欄位。執行階段現在一律將 `"main"` 用於主要的直接對話分桶。
- **`sendPolicy`**：依據 `channel`、`chatType` (`direct|group|channel`，含舊版 `dm` 別名) 或 `keyPrefix` 進行匹配。第一個匹配到的 `deny` 勝出。
- **`maintenance`**：`warn` 會在會話被逐出時發出警告；`enforce` 則會套用修剪與輪替。

</Accordion>

---

## 訊息 (Messages)

```json5
{
  messages: {
    responsePrefix: "🦞", // 或 "auto"
    ackReaction: "👀",
    ackReactionScope: "group-mentions", // group-mentions | group-all | direct | all
    removeAckAfterReply: false,
    queue: {
      mode: "collect", // steer | followup | collect | steer-backlog | steer+backlog | queue | interrupt
      debounceMs: 1000,
      cap: 20,
      drop: "summarize", // old | new | summarize
      byChannel: {
        whatsapp: "collect",
        telegram: "collect",
      },
    },
    inbound: {
      debounceMs: 2000, // 0 停用
      byChannel: {
        whatsapp: 5000,
        slack: 1500,
      },
    },
  },
}
```

### 回應前綴 (Response prefix)

各頻道/帳號覆寫：`channels.<channel>.responsePrefix`, `channels.<channel>.accounts.<id>.responsePrefix`。

解析順序（最精確者勝出）：帳號 → 頻道 → 全域。`""` 會停用並終止階層搜尋。`"auto"` 會自動衍生為 `[{identity.name}]`。

**範本變數：**

| 變數 | 說明 | 範例 |
| ----------------- | ---------------------- | --------------------------- |
| `{model}` | 簡短模型名稱 | `claude-opus-4-6` |
| `{modelFull}` | 完整模型識別碼 | `anthropic/claude-opus-4-6` |
| `{provider}` | 提供者名稱 | `anthropic` |
| `{thinkingLevel}` | 目前思考等級 | `high`, `low`, `off` |
| `{identity.name}` | 代理人身分名稱 | (同 `"auto"`) |

變數不區分大小寫。`{think}` 是 `{thinkingLevel}` 的別名。

### 確認心情回應 (Ack reaction)

- 預設為作用中代理人的 `identity.emoji`，否則為 `"👀"`。設為 `""` 以停用。
- 範圍 (Scope)：`group-mentions` (預設), `group-all`, `direct`, `all`。
- `removeAckAfterReply`：回覆後移除確認心情回應（僅限 Slack/Discord/Telegram/Google Chat）。

### 傳入防震 (Inbound debounce)

將來自同一傳送者的連續純文字訊息批次處理為單一代理人回合。媒體/附件會立即發送。控制指令會繞過防震機制。

### TTS (文字轉語音)

```json5
{
  messages: {
    tts: {
      auto: "always", // off | always | inbound | tagged
      mode: "final", // final (最終回覆) | all (所有回覆)
      provider: "elevenlabs",
      summaryModel: "openai/gpt-4.1-mini",
      modelOverrides: { enabled: true },
      maxTextLength: 4000,
      timeoutMs: 30000,
      prefsPath: "~/.openclaw/settings/tts.json",
      elevenlabs: {
        apiKey: "elevenlabs_api_key",
        baseUrl: "https://api.elevenlabs.io",
        voiceId: "voice_id",
        modelId: "eleven_multilingual_v2",
        seed: 42,
        applyTextNormalization: "auto",
        languageCode: "en",
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.75,
          style: 0.0,
          useSpeakerBoost: true,
          speed: 1.0,
        },
      },
      openai: {
        apiKey: "openai_api_key",
        model: "gpt-4o-mini-tts",
        voice: "alloy",
      },
    },
  },
}
```

- `auto` 控制自動 TTS。`/tts off|always|inbound|tagged` 可對各會話進行覆寫。
- `summaryModel` 覆寫 `agents.defaults.model.primary` 用於自動摘要。
- API 密鑰可由環境變數 `ELEVENLABS_API_KEY`/`XI_API_KEY` 與 `OPENAI_API_KEY` 備援。

---

## 交談 (Talk)

交談模式的預設值 (macOS/iOS/Android)。

```json5
{
  talk: {
    voiceId: "elevenlabs_voice_id",
    voiceAliases: {
      Clawd: "EXAVITQu4vr4xnSDxMaL",
      Roger: "CwhRBWXzGAHq8TQ4Fs17",
    },
    modelId: "eleven_v3",
    outputFormat: "mp3_44100_128",
    apiKey: "elevenlabs_api_key",
    interruptOnSpeech: true,
  },
}
```

- 聲音 ID 可由 `ELEVENLABS_VOICE_ID` 或 `SAG_VOICE_ID` 備援。
- `apiKey` 可由 `ELEVENLABS_API_KEY` 備援。
- `voiceAliases` 讓交談指令可以使用易記的名稱。

---

## 工具 (Tools)

### 工具設定檔 (Tool profiles)

`tools.profile` 在套用 `tools.allow`/`tools.deny` 之前設定基礎允許清單：

| 設定檔 | 包含內容 |
| ----------- | ----------------------------------------------------------------------------------------- |
| `minimal` | 僅限 `session_status` |
| `coding` | `group:fs`, `group:runtime`, `group:sessions`, `group:memory`, `image` |
| `messaging` | `group:messaging`, `sessions_list`, `sessions_history`, `sessions_send`, `session_status` |
| `full` | 無限制（與未設定相同） |

### 工具群組 (Tool groups)

| 群組 | 工具 |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `group:runtime` | `exec`, `process` (`bash` 可作為 `exec` 的別名) |
| `group:fs` | `read`, `write`, `edit`, `apply_patch` |
| `group:sessions` | `sessions_list`, `sessions_history`, `sessions_send`, `sessions_spawn`, `session_status` |
| `group:memory` | `memory_search`, `memory_get` |
| `group:web` | `web_search`, `web_fetch` |
| `group:ui` | `browser`, `canvas` |
| `group:automation` | `cron`, `gateway` |
| `group:messaging` | `message` |
| `group:nodes` | `nodes` |
| `group:openclaw` | 所有內建工具（不含提供者外掛程式） |

### `tools.allow` / `tools.deny`

全域工具允許/拒絕原則（拒絕優先）。不分大小寫，支援 `*` 萬用字元。即使 Docker 沙箱關閉時也會套用。

```json5
{
  tools: { deny: ["browser", "canvas"] },
}
```

### `tools.byProvider`

針對特定的提供者或模型進一步限制工具。順序：基礎設定檔 → 提供者設定檔 → 允許/拒絕。

```json5
{
  tools: {
    profile: "coding",
    byProvider: {
      "google-antigravity": { profile: "minimal" },
      "openai/gpt-5.2": { allow: ["group:fs", "sessions_list"] },
    },
  },
}
```

### `tools.elevated`

控制提升權限（宿主機）執行存取：

```json5
{
  tools: {
    elevated: {
      enabled: true,
      allowFrom: {
        whatsapp: ["+15555550123"],
        discord: ["steipete", "1234567890123"],
      },
    },
  },
}
```

- 各代理人覆寫 (`agents.list[].tools.elevated`) 僅能進一步限制權限。
- `/elevated on|off|ask|full` 會儲存各會話的狀態；訊息內的行內指令僅適用於單次訊息。
- 提升權限的 `exec` 在宿主機執行，繞過沙箱限制。

### `tools.exec`

```json5
{
  tools: {
    exec: {
      backgroundMs: 10000,
      timeoutSec: 1800,
      cleanupMs: 1800000,
      notifyOnExit: true,
      applyPatch: {
        enabled: false,
        allowModels: ["gpt-5.2"],
      },
    },
  },
}
```

### `tools.web`

```json5
{
  tools: {
    web: {
      search: {
        enabled: true,
        apiKey: "brave_api_key", // 或環境變數 BRAVE_API_KEY
        maxResults: 5,
        timeoutSeconds: 30,
        cacheTtlMinutes: 15,
      },
      fetch: {
        enabled: true,
        maxChars: 50000,
        maxCharsCap: 50000,
        timeoutSeconds: 30,
        cacheTtlMinutes: 15,
        userAgent: "custom-ua",
      },
    },
  },
}
```

### `tools.media`

配置傳入媒體理解功能（影像/音訊/影片）：

```json5
{
  tools: {
    media: {
      concurrency: 2,
      audio: {
        enabled: true,
        maxBytes: 20971520,
        scope: {
          default: "deny",
          rules: [{ action: "allow", match: { chatType: "direct" } }],
        },
        models: [
          { provider: "openai", model: "gpt-4o-mini-transcribe" },
          { type: "cli", command: "whisper", args: ["--model", "base", "{{MediaPath}}"] },
        ],
      },
      video: {
        enabled: true,
        maxBytes: 52428800,
        models: [{ provider: "google", model: "gemini-3-flash-preview" }],
      },
    },
  },
}
```

<Accordion title="媒體模型項目欄位">

**提供者項目 (Provider entry)** (`type: "provider"` 或省略)：

- `provider`：API 提供者 ID (`openai`, `anthropic`, `google`/`gemini`, `groq` 等)
- `model`：模型 ID 覆寫
- `profile` / `preferredProfile`：驗證設定檔選擇

**CLI 項目 (CLI entry)** (`type: "cli"`)：

- `command`：執行的可執行檔名稱
- `args`：帶範本的引數（支援 `{{MediaPath}}`, `{{Prompt}}`, `{{MaxChars}}` 等）

**共通欄位：**

- `capabilities`：選用的能力列表 (`image`, `audio`, `video`)。預設值：`openai`/`anthropic`/`minimax` → image，`google` → image+audio+video，`groq` → audio。
- `prompt`, `maxChars`, `maxBytes`, `timeoutSeconds`, `language`：各項目覆寫。
- 失敗時會依序嘗試下一個項目。

提供者驗證遵循標準順序：驗證設定檔 → 環境變數 → `models.providers.*.apiKey`。

</Accordion>

### `tools.agentToAgent`

```json5
{
  tools: {
    agentToAgent: {
      enabled: false,
      allow: ["home", "work"],
    },
  },
}
```

### `tools.subagents`

```json5
{
  agents: {
    defaults: {
      subagents: {
        model: "minimax/MiniMax-M2.1",
        maxConcurrent: 1,
        archiveAfterMinutes: 60,
      },
    },
  },
}
```

- `model`：衍生子代理人的預設模型。若省略，子代理人將繼承呼叫者的模型。
- 各子代理人工具原則：`tools.subagents.tools.allow` / `tools.subagents.tools.deny`。

---

## 自訂提供者與基礎 URL

OpenClaw 使用 pi-coding-agent 模型型錄。可透過組態中的 `models.providers` 或 `~/.openclaw/agents/<agentId>/agent/models.json` 新增自訂提供者。

```json5
{
  models: {
    mode: "merge", // merge (合併，預設) | replace (替換)
    providers: {
      "custom-proxy": {
        baseUrl: "http://localhost:4000/v1",
        apiKey: "LITELLM_KEY",
        api: "openai-completions", // openai-completions | openai-responses | anthropic-messages | google-generative-ai
        models: [
          {
            id: "llama-3.1-8b",
            name: "Llama 3.1 8B",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 128000,
            maxTokens: 32000,
          },
        ],
      },
    },
  },
}
```

- 針對自訂驗證需求，可使用 `authHeader: true` + `headers`。
- 可透過 `OPENCLAW_AGENT_DIR` (或 `PI_CODING_AGENT_DIR`) 覆寫代理人組態根目錄。

### 提供者範例

<Accordion title="Cerebras (GLM 4.6 / 4.7)">

```json5
{
  env: { CEREBRAS_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: {
        primary: "cerebras/zai-glm-4.7",
        fallbacks: ["cerebras/zai-glm-4.6"],
      },
      models: {
        "cerebras/zai-glm-4.7": { alias: "GLM 4.7 (Cerebras)" },
        "cerebras/zai-glm-4.6": { alias: "GLM 4.6 (Cerebras)" },
      },
    },
  },
  models: {
    mode: "merge",
    providers: {
      cerebras: {
        baseUrl: "https://api.cerebras.ai/v1",
        apiKey: "${CEREBRAS_API_KEY}",
        api: "openai-completions",
        models: [
          { id: "zai-glm-4.7", name: "GLM 4.7 (Cerebras)" },
          { id: "zai-glm-4.6", name: "GLM 4.6 (Cerebras)" },
        ],
      },
    },
  },
}
```

使用 `cerebras/zai-glm-4.7` 指定 Cerebras 提供者；`zai/glm-4.7` 則直接指定 Z.AI。

</Accordion>

<Accordion title="OpenCode Zen">

```json5
{
  agents: {
    defaults: {
      model: { primary: "opencode/claude-opus-4-6" },
      models: { "opencode/claude-opus-4-6": { alias: "Opus" } },
    },
  },
}
```

請設定 `OPENCODE_API_KEY` (或 `OPENCODE_ZEN_API_KEY`)。捷徑：`openclaw onboard --auth-choice opencode-zen`。

</Accordion>

<Accordion title="Z.AI (GLM-4.7)">

```json5
{
  agents: {
    defaults: {
      model: { primary: "zai/glm-4.7" },
      models: { "zai/glm-4.7": {} },
    },
  },
}
```

請設定 `ZAI_API_KEY`。`z.ai/*` 和 `z-ai/*` 也是可接受的別名。捷徑：`openclaw onboard --auth-choice zai-api-key`。

- 一般端點：`https://api.z.ai/api/paas/v4`
- 編碼端點 (預設)：`https://api.z.ai/api/coding/paas/v4`
- 針對一般端點，請定義自訂提供者並覆寫基礎 URL。

</Accordion>

<Accordion title="Moonshot AI (Kimi)">

```json5
{
  env: { MOONSHOT_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: { primary: "moonshot/kimi-k2.5" },
      models: { "moonshot/kimi-k2.5": { alias: "Kimi K2.5" } },
    },
  },
  models: {
    mode: "merge",
    providers: {
      moonshot: {
        baseUrl: "https://api.moonshot.ai/v1",
        apiKey: "${MOONSHOT_API_KEY}",
        api: "openai-completions",
        models: [
          {
            id: "kimi-k2.5",
            name: "Kimi K2.5",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 256000,
            maxTokens: 8192,
          },
        ],
      },
    },
  },
}
```

針對中國區端點：`baseUrl: "https://api.moonshot.cn/v1"` 或使用 `openclaw onboard --auth-choice moonshot-api-key-cn`。

</Accordion>

<Accordion title="Kimi Coding">

```json5
{
  env: { KIMI_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: { primary: "kimi-coding/k2p5" },
      models: { "kimi-coding/k2p5": { alias: "Kimi K2.5" } },
    },
  },
}
```

與 Anthropic 相容的內建提供者。捷徑：`openclaw onboard --auth-choice kimi-code-api-key`。

</Accordion>

<Accordion title="Synthetic (與 Anthropic 相容)">

```json5
{
  env: { SYNTHETIC_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: { primary: "synthetic/hf:MiniMaxAI/MiniMax-M2.1" },
      models: { "synthetic/hf:MiniMaxAI/MiniMax-M2.1": { alias: "MiniMax M2.1" } },
    },
  },
  models: {
    mode: "merge",
    providers: {
      synthetic: {
        baseUrl: "https://api.synthetic.new/anthropic",
        apiKey: "${SYNTHETIC_API_KEY}",
        api: "anthropic-messages",
        models: [
          {
            id: "hf:MiniMaxAI/MiniMax-M2.1",
            name: "MiniMax M2.1",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 192000,
            maxTokens: 65536,
          },
        ],
      },
    },
  },
}
```

基礎 URL 應省略 `/v1`（Anthropic 用戶端會自動附加）。捷徑：`openclaw onboard --auth-choice synthetic-api-key`。

</Accordion>

<Accordion title="MiniMax M2.1 (直接連線)">

```json5
{
  agents: {
    defaults: {
      model: { primary: "minimax/MiniMax-M2.1" },
      models: {
        "minimax/MiniMax-M2.1": { alias: "Minimax" },
      },
    },
  },
  models: {
    mode: "merge",
    providers: {
      minimax: {
        baseUrl: "https://api.minimax.io/anthropic",
        apiKey: "${MINIMAX_API_KEY}",
        api: "anthropic-messages",
        models: [
          {
            id: "MiniMax-M2.1",
            name: "MiniMax M2.1",
            reasoning: false,
            input: ["text"],
            cost: { input: 15, output: 60, cacheRead: 2, cacheWrite: 10 },
            contextWindow: 200000,
            maxTokens: 8192,
          },
        ],
      },
    },
  },
}
```

請設定 `MINIMAX_API_KEY`。捷徑：`openclaw onboard --auth-choice minimax-api`。

</Accordion>

<Accordion title="本地模型 (LM Studio)">

請參閱 [本地模型](/gateway/local-models_zh_TW)。重點：在高效能硬體上透過 LM Studio Responses API 執行 MiniMax M2.1；保留託管模型作為備援。

</Accordion>

---

## 技能 (Skills)

```json5
{
  skills: {
    allowBundled: ["gemini", "peekaboo"],
    load: {
      extraDirs: ["~/Projects/agent-scripts/skills"],
    },
    install: {
      preferBrew: true,
      nodeManager: "npm", // npm | pnpm | yarn
    },
    entries: {
      "nano-banana-pro": {
        apiKey: "在此填入_GEMINI_KEY",
        env: { GEMINI_API_KEY: "在此填入_GEMINI_KEY" },
      },
      peekaboo: { enabled: true },
      sag: { enabled: false },
    },
  },
}
```

- `allowBundled`：選用的允許清單，僅限內建技能（不影響託管/工作區技能）。
- `entries.<skillKey>.enabled: false` 即使該技能已內建或安裝也會將其停用。
- `entries.<skillKey>.apiKey`：方便讓宣告主要環境變數的技能使用。

---

## 外掛程式 (Plugins)

```json5
{
  plugins: {
    enabled: true,
    allow: ["voice-call"],
    deny: [],
    load: {
      paths: ["~/Projects/oss/voice-call-extension"],
    },
    entries: {
      "voice-call": {
        enabled: true,
        config: { provider: "twilio" },
      },
    },
  },
}
```

- 從 `~/.openclaw/extensions`、`<workspace>/.openclaw/extensions` 以及 `plugins.load.paths` 載入。
- **組態變更後需要重啟閘道器。**
- `allow`：選用的允許清單（僅載入列出的外掛）。`deny` 優先權較高。

請參閱 [外掛程式](/tools/plugin_zh_TW)。

---

## 瀏覽器 (Browser)

```json5
{
  browser: {
    enabled: true,
    evaluateEnabled: true,
    defaultProfile: "chrome",
    profiles: {
      openclaw: { cdpPort: 18800, color: "#FF4500" },
      work: { cdpPort: 18801, color: "#0066CC" },
      remote: { cdpUrl: "http://10.0.0.42:9222", color: "#00AA00" },
    },
    color: "#FF4500",
    // headless: false,
    // noSandbox: false,
    // executablePath: "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    // attachOnly: false,
  },
}
```

- `evaluateEnabled: false` 會停用 `act:evaluate` 與 `wait --fn`。
- 遠端設定檔僅限附加 (attach-only)，不支援啟動/停止/重設。
- 自動偵測順序：若是基於 Chromium 的預設瀏覽器 → Chrome → Brave → Edge → Chromium → Chrome Canary。
- 控制服務：僅限迴路位址 (Loopback)（連接埠衍生自 `gateway.port`，預設為 `18791`）。

---

## UI 介面

```json5
{
  ui: {
    seamColor: "#FF4500",
    assistant: {
      name: "OpenClaw",
      avatar: "CB", // emoji, 簡短文字, 影像 URL, 或 data URI
    },
  },
}
```

- `seamColor`：原生 App UI 的強調色（交談模式氣泡顏色等）。
- `assistant`：控制 UI 的身分覆寫。預設會沿用作用中的代理人身分。

---

## 閘道器 (Gateway)

```json5
{
  gateway: {
    mode: "local", // local (本地) | remote (遠端)
    port: 18789,
    bind: "loopback",
    auth: {
      mode: "token", // token (金鑰) | password (密碼)
      token: "您的-token",
      // password: "您的-密碼", // 或環境變數 OPENCLAW_GATEWAY_PASSWORD
      allowTailscale: true,
    },
    tailscale: {
      mode: "off", // off | serve | funnel
      resetOnExit: false,
    },
    controlUi: {
      enabled: true,
      basePath: "/openclaw",
      // root: "dist/control-ui",
      // allowInsecureAuth: false,
      // dangerouslyDisableDeviceAuth: false,
    },
    remote: {
      url: "ws://gateway.tailnet:18789",
      transport: "ssh", // ssh | direct
      token: "您的-token",
      // password: "您的-密碼",
    },
    trustedProxies: ["10.0.0.1"],
  },
}
```

<Accordion title="閘道器欄位細節">

- `mode`：`local` (執行閘道器) 或 `remote` (連線至遠端閘道器)。閘道器必須設定為 `local` 才能啟動。
- `port`：WS + HTTP 的單一多路複用連接埠。優先順序：`--port` > `OPENCLAW_GATEWAY_PORT` > `gateway.port` > `18789`。
- `bind`：`auto`, `loopback` (預設), `lan` (`0.0.0.0`), `tailnet` (僅限 Tailscale IP) 或 `custom`。
- **驗證 (Auth)**：預設為必填。非迴路位址綁定必須設定共用的 Token 或密碼。引導精靈預設會產生一個 Token。
- `auth.allowTailscale`：當為 `true` 時，Tailscale Serve 的識別標頭可滿足驗證（透過 `tailscale whois` 驗證）。當 `tailscale.mode = "serve"` 時預設為 `true`。
- `tailscale.mode`：`serve`（僅限 tailnet，迴路位址綁定）或 `funnel`（公開，需要驗證）。
- `remote.transport`：`ssh` (預設) 或 `direct` (ws/wss)。若選擇 `direct`，`remote.url` 必須是 `ws://` 或 `wss://`。
- `gateway.remote.token` 僅供遠端 CLI 調用使用，不會啟用本地閘道器驗證。
- `trustedProxies`：終止 TLS 的反向代理伺服器 IP。請僅列出由您控制的代理伺服器。

</Accordion>

### 相容於 OpenAI 的端點

- Chat Completions (對話補全)：預設停用。啟用方式：`gateway.http.endpoints.chatCompletions.enabled: true`。
- Responses API：`gateway.http.endpoints.responses.enabled`。
- Responses URL 輸入強化：
  - `gateway.http.endpoints.responses.maxUrlParts`
  - `gateway.http.endpoints.responses.files.urlAllowlist`
  - `gateway.http.endpoints.responses.images.urlAllowlist`

### 多實例隔離

在同一主機上執行多個具有獨立連接埠與狀態目錄的閘道器：

```bash
OPENCLAW_CONFIG_PATH=~/.openclaw/a.json 
OPENCLAW_STATE_DIR=~/.openclaw-a 
openclaw gateway --port 19001
```

便利標籤：`--dev`（使用 `~/.openclaw-dev` + 連接埠 `19001`）、`--profile <名稱>`（使用 `~/.openclaw-<名稱>`）。

請參閱 [多個閘道器](/gateway/multiple-gateways_zh_TW)。

---

## 鉤子 (Hooks)

```json5
{
  hooks: {
    enabled: true,
    token: "共享秘密",
    path: "/hooks",
    maxBodyBytes: 262144,
    defaultSessionKey: "hook:ingress",
    allowRequestSessionKey: false,
    allowedSessionKeyPrefixes: ["hook:"],
    allowedAgentIds: ["hooks", "main"],
    presets: ["gmail"],
    transformsDir: "~/.openclaw/hooks",
    mappings: [
      {
        match: { path: "gmail" },
        action: "agent",
        agentId: "hooks",
        wakeMode: "now",
        name: "Gmail",
        sessionKey: "hook:gmail:{{messages[0].id}}",
        messageTemplate: "來自: {{messages[0].from}}
主旨: {{messages[0].subject}}
{{messages[0].snippet}}",
        deliver: true,
        channel: "last",
        model: "openai/gpt-5.2-mini",
      },
    ],
  },
}
```

驗證：使用 `Authorization: Bearer <token>` 或 `x-openclaw-token: <token>`。

**端點：**

- `POST /hooks/wake` → `{ text, mode?: "now"|"next-heartbeat" }`
- `POST /hooks/agent` → `{ message, name?, agentId?, sessionKey?, wakeMode?, deliver?, channel?, to?, model?, thinking?, timeoutSeconds? }`
  - 僅當 `hooks.allowRequestSessionKey=true` 時（預設為 `false`），才會接受請求負載中的 `sessionKey`。
- `POST /hooks/<名稱>` → 透過 `hooks.mappings` 進行解析。

<Accordion title="映射 (Mapping) 細節">

- `match.path` 匹配 `/hooks` 之後的子路徑（例如 `/hooks/gmail` → `gmail`）。
- `match.source` 針對通用路徑匹配負載欄位。
- 範本如 `{{messages[0].subject}}` 會從負載中讀取。
- `transform` 可指向一個回傳鉤子動作的 JS/TS 模組。
- `agentId` 路由至特定代理人；未知的 ID 會回退至預設代理人。
- `allowedAgentIds`：限制顯式路由（`*` 或省略 = 允許所有, `[]` = 拒絕所有）。
- `defaultSessionKey`：選用的固定對談金鑰，用於未指定 `sessionKey` 的鉤子代理人執行。
- `allowRequestSessionKey`：允許 `/hooks/agent` 呼叫者設定 `sessionKey`（預設為 `false`）。
- `allowedSessionKeyPrefixes`：選用的顯式 `sessionKey` 值前綴允許清單（請求 + 映射），例如 `["hook:"]`。
- `deliver: true` 將最終回覆傳送到頻道；`channel` 預設為 `last` (最後一次通訊的頻道)。
- `model` 覆寫此鉤子執行所使用的 LLM（如果已設定模型型錄，則必須是允許的模型）。

</Accordion>

### Gmail 整合

```json5
{
  hooks: {
    gmail: {
      account: "openclaw@gmail.com",
      topic: "projects/<專案ID>/topics/gog-gmail-watch",
      subscription: "gog-gmail-watch-push",
      pushToken: "共享的推送token",
      hookUrl: "http://127.0.0.1:18789/hooks/gmail",
      includeBody: true,
      maxBytes: 20000,
      renewEveryMinutes: 720,
      serve: { bind: "127.0.0.1", port: 8788, path: "/" },
      tailscale: { mode: "funnel", path: "/gmail-pubsub" },
      model: "openrouter/meta-llama/llama-3.3-70b-instruct:free",
      thinking: "off",
    },
  },
}
```

- 設定後，閘道器會在啟動時自動執行 `gog gmail watch serve`。設定 `OPENCLAW_SKIP_GMAIL_WATCHER=1` 可停用。
- 請勿在閘道器執行時另外執行獨立的 `gog gmail watch serve`。

---

## Canvas 宿主 (Canvas host)

```json5
{
  canvasHost: {
    root: "~/.openclaw/workspace/canvas",
    port: 18793,
    liveReload: true,
    // enabled: false, // 或設定環境變數 OPENCLAW_SKIP_CANVAS_HOST=1
  },
}
```

- 透過 HTTP 為 iOS/Android 節點提供 HTML/CSS/JS 服務。
- 在提供的 HTML 中注入熱重載 (live-reload) 用戶端。
- 當目錄為空時自動建立入門級 `index.html`。
- 同時在 `/__openclaw__/a2ui/` 提供 A2UI 服務。
- 變更設定後需要重啟閘道器。
- 針對大型目錄或發生 `EMFILE` 錯誤時，請停用熱重載。

---

## 發現機制 (Discovery)

### mDNS (Bonjour)

```json5
{
  discovery: {
    mdns: {
      mode: "minimal", // minimal (極簡) | full (完整) | off (關閉)
    },
  },
}
```

- `minimal` (預設)：從 TXT 紀錄中省略 `cliPath` 與 `sshPort`。
- `full`：包含 `cliPath` 與 `sshPort`。
- 主機名稱預設為 `openclaw`。可透過 `OPENCLAW_MDNS_HOSTNAME` 覆寫。

### 廣域發現 (Wide-area DNS-SD)

```json5
{
  discovery: {
    wideArea: { enabled: true },
  },
}
```

在 `~/.openclaw/dns/` 下寫入單播 (unicast) DNS-SD 區域檔案。若要進行跨網路發現，請搭配 DNS 伺服器（建議使用 CoreDNS）與 Tailscale 分離式 DNS。

設定指令：`openclaw dns setup --apply`。

---

## 環境 (Environment)

### `env` (內聯環境變數)

```json5
{
  env: {
    OPENROUTER_API_KEY: "sk-or-...",
    vars: {
      GROQ_API_KEY: "gsk-...",
    },
    shellEnv: {
      enabled: true,
      timeoutMs: 15000,
    },
  },
}
```

- 僅在系統環境變數缺失該鍵名時，才會套用內聯環境變數。
- `.env` 檔案：目前目錄的 `.env` + `~/.openclaw/.env`（兩者皆不會覆寫現有變數）。
- `shellEnv`：從您的登入 Shell 設定檔匯入缺失的預期鍵名。
- 完整優先順序請見 [環境](/help/environment_zh_TW)。

### 環境變數代換

在任何組態字串中使用 `${VAR_NAME}` 引用環境變數：

```json5
{
  gateway: {
    auth: { token: "${OPENCLAW_GATEWAY_TOKEN}" },
  },
}
```

- 僅匹配全大寫名稱：`[A-Z_][A-Z0-9_]*`。
- 若變數缺失或為空，會在組態載入時拋出錯誤。
- 使用 `$${VAR}` 進行轉義以輸出字面值 `${VAR}`。
- 在 `$include` 檔案中同樣有效。

---

## 驗證儲存 (Auth storage)

```json5
{
  auth: {
    profiles: {
      "anthropic:me@example.com": { provider: "anthropic", mode: "oauth", email: "me@example.com" },
      "anthropic:work": { provider: "anthropic", mode: "api_key" },
    },
    order: {
      anthropic: ["anthropic:me@example.com", "anthropic:work"],
    },
  },
}
```

- 每個代理人的驗證設定檔儲存於 `<agentDir>/auth-profiles.json`。
- 舊版 OAuth 匯入自 `~/.openclaw/credentials/oauth.json`。
- 請參閱 [OAuth](/concepts/oauth_zh_TW)。

---

## 記錄 (Logging)

```json5
{
  logging: {
    level: "info",
    file: "/tmp/openclaw/openclaw.log",
    consoleLevel: "info",
    consoleStyle: "pretty", // pretty | compact | json
    redactSensitive: "tools", // off | tools
    redactPatterns: ["\bTOKEN\b\s*[=:]\s*(["']?)([^\s"']+)\1"],
  },
}
```

- 預設紀錄檔：`/tmp/openclaw/openclaw-YYYY-MM-DD.log`。
- 設定 `logging.file` 以使用固定路徑。
- 使用 `--verbose` 時，`consoleLevel` 會提升至 `debug`。

---

## 精靈 (Wizard)

由 CLI 精靈（`onboard`, `configure`, `doctor`）寫入的元數據：

```json5
{
  wizard: {
    lastRunAt: "2026-01-01T00:00:00.000Z",
    lastRunVersion: "2026.1.4",
    lastRunCommit: "abc1234",
    lastRunCommand: "configure",
    lastRunMode: "local",
  },
}
```

---

## 身分識別 (Identity)

```json5
{
  agents: {
    list: [
      {
        id: "main",
        identity: {
          name: "Samantha",
          theme: "樂於助人的樹懶",
          emoji: "🦥",
          avatar: "avatars/samantha.png",
        },
      },
    ],
  },
}
```

由 macOS 引導助理寫入。自動衍生預設值：

- `messages.ackReaction` 來自 `identity.emoji`（備援為 👀）
- `mentionPatterns` 來自 `identity.name`/`identity.emoji`
- `avatar` 接受：相對於工作區的路徑、`http(s)` URL 或 `data:` URI

---

## 橋接器 (Bridge) (舊版，已移除)

目前版本已不再包含 TCP 橋接器。節點改透過閘道器 WebSocket 連線。組態架構中不再包含 `bridge.*` 鍵名（若不移除會導致驗證失敗；`openclaw doctor --fix` 可以清除未知的鍵名）。

<Accordion title="舊版橋接器組態 (歷史參考)">

```json
{
  "bridge": {
    "enabled": true,
    "port": 18790,
    "bind": "tailnet",
    "tls": {
      "enabled": true,
      "autoGenerate": true
    }
  }
}
```

</Accordion>

---

## 排程任務 (Cron)

```json5
{
  cron: {
    enabled: true,
    maxConcurrentRuns: 2,
    sessionRetention: "24h", // 時間長度字串或 false
  },
}
```

- `sessionRetention`：已完成的排程會話在修剪前保留多久。預設值：`24h`。

請參閱 [排程任務](/automation/cron-jobs_zh_TW)。

---

## 媒體模型範本變數

在 `tools.media.*.models[].args` 中擴充的範本佔位符：

| 變數 | 說明 |
| ------------------ | ------------------------------------------------- |
| `{{Body}}` | 完整傳入訊息內容 |
| `{{RawBody}}` | 原始內容（不含歷史/傳送者封裝） |
| `{{BodyStripped}}` | 已清除群組提及標記的內容 |
| `{{From}}` | 傳送者識別碼 |
| `{{To}}` | 目的地識別碼 |
| `{{MessageSid}}` | 頻道訊息 ID |
| `{{SessionId}}` | 目前對談的 UUID |
| `{{IsNewSession}}` | 建立新對談時為 `"true"` |
| `{{MediaUrl}}` | 傳入媒體的偽 URL |
| `{{MediaPath}}` | 本地媒體路徑 |
| `{{MediaType}}` | 媒體類型 (image/audio/document/…) |
| `{{Transcript}}` | 音訊逐字稿 |
| `{{Prompt}}` | 解析後的 CLI 項目媒體提示詞 |
| `{{MaxChars}}` | 解析後的 CLI 項目最大輸出字元數 |
| `{{ChatType}}` | `"direct"` (私訊) 或 `"group"` (群組) |
| `{{GroupSubject}}` | 群組主旨（盡力而為） |
| `{{GroupMembers}}` | 群組成員預覽（盡力而為） |
| `{{SenderName}}` | 傳送者顯示名稱（盡力而為） |
| `{{SenderE164}}` | 傳送者電話號碼（盡力而為） |
| `{{Provider}}` | 提供者提示 (whatsapp, telegram, discord 等) |

---

## 組態包含功能 (`$include`)

將組態分割為多個檔案：

```json5
// ~/.openclaw/openclaw.json
{
  gateway: { port: 18789 },
  agents: { $include: "./agents.json5" },
  broadcast: {
    $include: ["./clients/mueller.json5", "./clients/schmidt.json5"],
  },
}
```

**合併行為：**

- 單一檔案：取代所屬物件。
- 檔案陣列：依序深層合併（後者覆蓋前者）。
- 同級鍵名：在包含 (include) 之後合併（覆蓋包含的值）。
- 巢狀包含：支援多達 10 層深度。
- 路徑：支援相對路徑（相對於執行包含的檔案）、絕對路徑或 `../` 父目錄引用。
- 錯誤處理：針對缺失檔案、解析錯誤與循環包含提供清晰的錯誤訊息。

---

*相關內容：[組態設定](/gateway/configuration_zh_TW) · [組態範例](/gateway/configuration-examples_zh_TW) · [Doctor 指令](/gateway/doctor_zh_TW)*
