---
summary: "跨平台群組聊天行為說明 (WhatsApp/Telegram/Discord/Slack/Signal/iMessage/Microsoft Teams)"
read_when:
  - 更改群組聊天行為或提及門檻設定時
title: "群組"
---

> 此文件為 [English Version](/channels/groups_zh_TW) 的繁體中文版本。

# 群組 (Groups)

OpenClaw 在各平台（WhatsApp, Telegram, Discord, Slack, Signal, iMessage, Microsoft Teams）上對群組聊天的處理方式保持一致。

## 新手入門 (2 分鐘簡介)

OpenClaw 「居住」在您自己的通訊帳號中。並沒有獨立的 WhatsApp 機器人使用者。
若 **您** 在某個群組中，OpenClaw 就能看見該群組並在其中做出回應。

預設行為：

- 群組存取受限（`groupPolicy: "allowlist"`）。
- 回覆需要被標註（提及），除非您明確停用提及門檻 (Mention gating)。

白話來說：只有在允許清單中的傳送者可以透過 @提及機器人來觸發 OpenClaw。

> **重點摘要**
>
> - **私訊存取** 由 `*.allowFrom` 控制。
> - **群組存取** 由 `*.groupPolicy` + 允許清單 (`*.groups`, `*.groupAllowFrom`) 控制。
> - **回覆觸發** 由提及門檻 (`requireMention`, `/activation`) 控制。

快速流程（群組訊息處理邏輯）：

```
groupPolicy 是否為 disabled? 是 -> 捨棄
groupPolicy 是否為 allowlist? 
  -> 該群組是否在允許名單? 否 -> 捨棄
requireMention 是否為 yes? 
  -> 是否被提及? 否 -> 僅儲存供上下文參考
否則 -> 進行回覆
```

![群組訊息流程](/images/groups-flow_zh_TW.svg)

如果您想要...

| 目標 | 該如何設定 |
| -------------------------------------------- | ---------------------------------------------------------- |
| 允許所有群組，但僅在被 @提及時才回覆 | `groups: { "*": { requireMention: true } }` |
| 停用所有群組回覆功能 | `groupPolicy: "disabled"` |
| 僅限特定群組 | `groups: { "<群組ID>": { ... } }` (不要設定 `"*"` 鍵名) |
| 群組中僅有您能觸發機器人 | `groupPolicy: "allowlist"`, `groupAllowFrom: ["+1555..."]` |

## 對談金鑰 (Session keys)

- 群組會話使用 `agent:<agentId>:<channel>:group:<id>` 格式的金鑰（房間/頻道則使用 `agent:<agentId>:<channel>:channel:<id>`）。
- Telegram 論壇主題會在群組 ID 後附加 `:topic:<threadId>`，使每個主題擁有獨立的會話。
- 直接訊息 (DMs) 使用主會話（或依據組態設定為每個傳送者獨立）。
- 群組會話會跳過心跳偵測 (Heartbeats)。

## 應用模式：個人私訊 + 公開群組 (單一代理人)

這是一個非常實用的模式：將「個人」流量設定為 **私訊**，而「公開」流量則設定為 **群組**。

原理：在單代理人模式下，私訊通常會進入 **主對談金鑰 (main session key)** (`agent:main:main`)，而群組則一律使用 **非主對談金鑰** (`agent:main:<channel>:group:<id>`)。若您啟用沙箱模式並設為 `mode: "non-main"`，這些群組會話將在 Docker 中執行，而您的主私訊會話則維持在宿主機執行。

這讓您擁有同一個代理人「大腦」（共享工作區與記憶），但具備兩種執行態勢 (Postures)：

- **私訊**：可使用完整工具（執行於宿主機）
- **群組**：沙箱化 + 受限工具（執行於 Docker）

> 若您需要完全獨立的工作區/角色設定（「個人」與「公開」內容絕對不可混用），請使用第二個代理人並進行綁定。請參閱 [多代理人路由](/concepts/multi-agent_zh_TW)。

範例（私訊在宿主機，群組在沙箱且僅限通訊工具）：

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main", // 群組/頻道為非主會話 -> 進入沙箱
        scope: "session", // 最強隔離度 (每個群組/頻道一個容器)
        workspaceAccess: "none",
      },
    },
  },
  tools: {
    sandbox: {
      tools: {
        // 若 allow 不為空，則其餘工具皆被阻擋 (deny 仍優先勝出)。
        allow: ["group:messaging", "group:sessions"],
        deny: ["group:runtime", "group:fs", "group:ui", "nodes", "cron", "gateway"],
      },
    },
  },
}
```

想要「群組僅能看見資料夾 X」而非「完全禁止存取宿主」？請保持 `workspaceAccess: "none"` 並僅將允許的路徑掛載至沙箱：

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",
        scope: "session",
        workspaceAccess: "none",
        docker: {
          binds: [
            // 宿主路徑:容器路徑:模式
            "~/FriendsShared:/data:ro",
          ],
        },
      },
    },
  },
}
```

相關內容：

- 組態鍵名與預設值：[閘道器組態](/gateway/configuration_zh_TW#agentsdefaults-sandbox)
- 偵錯工具被阻擋的原因：[沙箱 vs 工具原則 vs 提升權限](/gateway/sandbox-vs-tool-policy-vs-elevated_zh_TW)
- 掛載細節：[沙箱化](/gateway/sandboxing_zh_TW#自訂掛載-Custom-bind-mounts)

## 顯示標籤

- UI 標籤在可用時使用 `displayName`，格式為 `<channel>:<token>`。
- `#room` 預留給房間/頻道使用；群組聊天使用 `g-<代稱>`（小寫，空格轉換為 `-`，保留字元 `#@+._-`）。

## 群組原則 (Group policy)

控制各頻道如何處理群組/房間訊息：

```json5
{
  channels: {
    whatsapp: {
      groupPolicy: "disabled", // "open" | "disabled" | "allowlist"
      groupAllowFrom: ["+15551234567"],
    },
    telegram: {
      groupPolicy: "disabled",
      groupAllowFrom: ["123456789", "@username"],
    },
    signal: {
      groupPolicy: "disabled",
      groupAllowFrom: ["+15551234567"],
    },
    imessage: {
      groupPolicy: "disabled",
      groupAllowFrom: ["chat_id:123"],
    },
    msteams: {
      groupPolicy: "disabled",
      groupAllowFrom: ["user@org.com"],
    },
    discord: {
      groupPolicy: "allowlist",
      guilds: {
        伺服器ID: { channels: { help: { allow: true } } },
      },
    },
    slack: {
      groupPolicy: "allowlist",
      channels: { "#general": { allow: true } },
    },
    matrix: {
      groupPolicy: "allowlist",
      groupAllowFrom: ["@owner:example.org"],
      groups: {
        "!roomId:example.org": { allow: true },
        "#alias:example.org": { allow: true },
      },
    },
  },
}
```

| 原則 (Policy) | 行為說明 |
| ------------- | ------------------------------------------------------------ |
| `"open"` | 群組會繞過允許清單；但提及門檻設定仍適用。 |
| `"disabled"` | 完全阻擋所有群組訊息。 |
| `"allowlist"` | 僅允許符合配置之允許清單的群組/房間。 |

注意事項：

- `groupPolicy` 與提及門檻（要求 @提及）是分開的機制。
- WhatsApp/Telegram/Signal/iMessage/Microsoft Teams：使用 `groupAllowFrom`（備援為明確的 `allowFrom`）。
- Discord：允許清單使用 `channels.discord.guilds.<id>.channels`。
- Slack：允許清單使用 `channels.slack.channels`。
- Matrix：允許清單使用 `channels.matrix.groups`（房間 ID、別名或名稱）。使用 `channels.matrix.groupAllowFrom` 限制傳送者；同樣支援針對個別房間的 `users` 允許清單。
- 群組私訊受獨立控管 (`channels.discord.dm.*`, `channels.slack.dm.*`)。
- Telegram 允許清單可匹配使用者 ID (`"123456789"`, `"telegram:123456789"`, `"tg:123456789"`) 或使用者名稱 (`"@alice"` 或 `"alice"`)；前綴不區分大小寫。
- 預設值為 `groupPolicy: "allowlist"`；若您的群組允許清單為空，群組訊息將被封鎖。

快速心智模型（群組訊息評估順序）：

1. `groupPolicy` (open/disabled/allowlist)
2. 群組允許清單 (`*.groups`, `*.groupAllowFrom`, 頻道專屬允許清單)
3. 提及門檻 (`requireMention`, `/activation`)

## 提及門檻 (預設行為)

群組訊息預設需要被提及，除非針對個別群組進行覆寫。預設值位於各子系統的 `*.groups."*"` 下。

回覆機器人的訊息會被視為隱式提及（當頻道支援回覆元數據時）。此規則適用於 Telegram, WhatsApp, Slack, Discord 與 Microsoft Teams。

```json5
{
  channels: {
    whatsapp: {
      groups: {
        "*": { requireMention: true },
        "123@g.us": { requireMention: false },
      },
    },
    telegram: {
      groups: {
        "*": { requireMention: true },
        "123456789": { requireMention: false },
      },
    },
    imessage: {
      groups: {
        "*": { requireMention: true },
        "123": { requireMention: false },
      },
    },
  },
  agents: {
    list: [
      {
        id: "main",
        groupChat: {
          mentionPatterns: ["@openclaw", "openclaw", "\+15555550123"],
          historyLimit: 50,
        },
      },
    ],
  },
}
```

注意事項：

- `mentionPatterns` 為不區分大小寫的正規表示式。
- 提供明確提及功能的平台仍會通過檢查；正則模式是作為備援。
- 個別代理人覆寫：`agents.list[].groupChat.mentionPatterns`（當多個代理人共用一個群組時非常有用）。
- 僅在可偵測提及時（原生提及或已配置 `mentionPatterns`），才會強制執行提及門檻。
- Discord 預設值位於 `channels.discord.guilds."*"`（可針對伺服器/頻道進行覆寫）。
- 群組歷史上下文在各平台間統一封裝，且僅包含 **待處理訊息**（因提及門檻而被跳過的訊息）；使用 `messages.groupChat.historyLimit` 設定全域預設值，使用 `channels.<channel>.historyLimit` 進行覆寫。設定為 `0` 可停用。

## 群組/頻道工具限制 (選用)

部分頻道組態支援限制 **特定群組/房間/頻道內** 可用的工具。

- `tools`：允許/拒絕整個群組的工具。
- `toolsBySender`：群組內針對各傳送者的覆寫（鍵名為傳送者 ID/使用者名稱/電子郵件/電話號碼，視頻道而定）。使用 `"*"` 作為萬用字元。

解析順序（最精確者勝出）：

1. 符合群組/頻道的 `toolsBySender`
2. 群組/頻道的 `tools` 設定
3. 符合預設 (`"*"`) 的 `toolsBySender`
4. 預設 (`"*"`) 的 `tools` 設定

範例 (Telegram)：

```json5
{
  channels: {
    telegram: {
      groups: {
        "*": { tools: { deny: ["exec"] } },
        "-1001234567890": {
          tools: { deny: ["exec", "read", "write"] },
          toolsBySender: {
            "123456789": { alsoAllow: ["exec"] },
          },
        },
      },
    },
  },
}
```

注意事項：

- 群組/頻道工具限制是在全域/代理人工具原則基礎上額外套用的（拒絕設定仍優先勝出）。
- 不同頻道使用不同的層級結構（例如 Discord 為 `guilds.*.channels.*`，Slack 為 `channels.*`，MS Teams 為 `teams.*.channels.*`）。

## 群組允許清單

當配置了 `channels.whatsapp.groups`, `channels.telegram.groups` 或 `channels.imessage.groups` 時，該鍵名即充當群組允許清單。使用 `"*"` 可允許所有群組，同時仍能設定預設的提及行為。

常見意圖範例 (可直接複製貼上)：

1. 停用所有群組回覆

```json5
{
  channels: { whatsapp: { groupPolicy: "disabled" } },
}
```

2. 僅允許特定的 WhatsApp 群組

```json5
{
  channels: {
    whatsapp: {
      groups: {
        "123@g.us": { requireMention: true },
        "456@g.us": { requireMention: false },
      },
    },
  },
}
```

3. 允許所有群組但明確要求提及

```json5
{
  channels: {
    whatsapp: {
      groups: { "*": { requireMention: true } },
    },
  },
}
```

4. 僅限擁有者能在 WhatsApp 群組中觸發機器人

```json5
{
  channels: {
    whatsapp: {
      groupPolicy: "allowlist",
      groupAllowFrom: ["+15551234567"],
      groups: { "*": { requireMention: true } },
    },
  },
}
```

## 啟用狀態 (僅限擁有者)

群組擁有者可以切換各群組的啟用狀態：

- `/activation mention`
- `/activation always`

擁有者身分由 `channels.whatsapp.allowFrom` 決定（若未設定則為機器人本身的 E.164 號碼）。請將該指令作為 **獨立訊息** 發送。目前其他平台會忽略 `/activation` 指令。

## 上下文欄位

群組傳入的負載會設定以下欄位：

- `ChatType=group`
- `GroupSubject`（若已知）
- `GroupMembers`（若已知）
- `WasMentioned`（提及門檻判定結果）
- Telegram 論壇主題還會包含 `MessageThreadId` 與 `IsForum`。

在新的群組會話首回合，代理人系統提示詞會包含一段群組簡介。它會提醒模型要像人類一樣回應、避免使用 Markdown 表格，並避免輸入字面上的 `
` 序列。

## iMessage 專屬說明

- 進行路由或設定允許清單時，建議優先使用 `chat_id:<id>`。
- 列出聊天：執行 `imsg chats --limit 20`。
- 群組回覆一律會發送回同一個 `chat_id`。

## WhatsApp 專屬說明

關於 WhatsApp 特有的行為（如歷史紀錄注入、提及處理細節），請參閱 [群組訊息](/channels/group-messages_zh_TW)。
