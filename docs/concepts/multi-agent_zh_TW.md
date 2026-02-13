---
summary: "多代理人路由：隔離代理人、頻道帳號以及綁定機制說明"
title: 多代理人路由
read_when: "您想在單一閘道器程序中執行多個隔離的代理人（獨立工作區與驗證）時。"
status: active
---

> 此文件為 [English Version](/concepts/multi-agent) 的繁體中文版本。

# 多代理人路由 (Multi-Agent Routing)

目標：在單一執行的閘道器 (Gateway) 中支援多個 **隔離 (isolated)** 的代理人（具備獨立工作區 + `agentDir` + 對談會話），並支援多個頻道帳號（例如：兩個 WhatsApp 帳號）。系統透過「綁定 (Bindings)」將傳入訊息路由至對應的代理人。

## 什麼是「一個代理人」？

一個 **代理人 (Agent)** 是一個完整隔離的大腦，擁有自己的：

- **工作區 (Workspace)**：包含檔案、`AGENTS.md`/`SOUL.md`/`USER.md`、本地筆記、角色規則。
- **狀態目錄 (`agentDir`)**：儲存驗證設定檔、模型型錄以及代理人專屬組態。
- **對談存儲區**：位於 `~/.openclaw/agents/<agentId>/sessions` 的對話歷史紀錄與路由狀態。

驗證設定檔是 **針對每個代理人獨立** 的。每個代理人會讀取自己的檔案：

```
~/.openclaw/agents/<agentId>/agent/auth-profiles.json
```

主代理人的憑證 **不會** 自動共享。切勿跨代理人重用同一個 `agentDir`（這會導致驗證與會話衝突）。若要共享憑證，請手動將 `auth-profiles.json` 複製到另一個代理人的 `agentDir` 中。

技能 (Skills) 也是各代理人獨立的，存放於各工作區的 `skills/` 資料夾，同時也可使用位於 `~/.openclaw/skills` 的共享技能。請參閱 [技能：代理人專屬 vs 共享](/tools/skills_zh_TW#各代理人專屬-vs-共享技能)。

閘道器可以託管 **一個代理人**（預設）或 **多個代理人** 同時並存。

**工作區注意事項：** 每個代理人的工作區是其 **預設的工作目錄 (cwd)**，而非硬性的沙箱。相對路徑會在工作區內解析，但除非啟用了沙箱模式，否則絕對路徑仍可觸及主機的其他位置。請參閱 [沙箱化 (Sandboxing)](/gateway/sandboxing_zh_TW)。

## 路徑配置對照表

- 組態檔案：`~/.openclaw/openclaw.json` (或透過 `OPENCLAW_CONFIG_PATH` 指定)
- 狀態總目錄：`~/.openclaw` (或透過 `OPENCLAW_STATE_DIR` 指定)
- 工作區：`~/.openclaw/workspace` (或 `~/.openclaw/workspace-<agentId>`)
- 代理人狀態目錄：`~/.openclaw/agents/<agentId>/agent` (或透過 `agents.list[].agentDir` 指定)
- 對談會話目錄：`~/.openclaw/agents/<agentId>/sessions`

### 單代理人模式 (預設)

若您不做任何額外設定，OpenClaw 將執行單一代理人：

- `agentId` 預設為 **`main`**。
- 會話金鑰格式為 `agent:main:<mainKey>`。
- 工作區預設為 `~/.openclaw/workspace`（若設定了 `OPENCLAW_PROFILE`，則為 `~/.openclaw/workspace-<設定檔名稱>`）。
- 狀態目錄預設為 `~/.openclaw/agents/main/agent`。

## 代理人輔助指令

使用代理人精靈新增一個隔離的代理人：

```bash
openclaw agents add work
```

接著新增「綁定 (bindings)」（或讓精靈代勞）來路由傳入的訊息。

透過此指令驗證：

```bash
openclaw agents list --bindings
```

## 多個代理人 = 多重身分、多重個性

在 **多代理人 (Multiple agents)** 模式下，每個 `agentId` 都成為一個 **完全隔離的角色 (Persona)**：

- **不同的電話號碼/帳號**（針對每個頻道的 `accountId`）。
- **不同的個性**（各代理人擁有獨立的工作區檔案，如 `AGENTS.md` 與 `SOUL.md`）。
- **獨立的驗證與會話**（除非明確啟用，否則不會產生交叉干擾）。

這能讓 **多個人** 共享同一個閘道器伺服器，同時保持各自 AI 「大腦」與數據的隔離性。

## 一個 WhatsApp 號碼，多個人（私訊分流）

您可以將 **同一個 WhatsApp 帳號中不同的私訊 (DMs)** 路由至不同的代理人。透過設定 `peer.kind: "direct"` 並匹配傳送者的 E.164 號碼（例如 `+15551234567`）來實現。回覆仍會從同一個 WhatsApp 號碼送出（目前不支援各代理人獨立的傳送者身分）。

重要細節：直接對話會歸併至代理人的 **主對談金鑰 (main session key)**，因此若要達成真正的隔離，必須 **每人分配一個代理人**。

範例：

```json5
{
  agents: {
    list: [
      { id: "alex", workspace: "~/.openclaw/workspace-alex" },
      { id: "mia", workspace: "~/.openclaw/workspace-mia" },
    ],
  },
  bindings: [
    {
      agentId: "alex",
      match: { channel: "whatsapp", peer: { kind: "direct", id: "+15551230001" } },
    },
    {
      agentId: "mia",
      match: { channel: "whatsapp", peer: { kind: "direct", id: "+15551230002" } },
    },
  ],
  channels: {
    whatsapp: {
      dmPolicy: "allowlist",
      allowFrom: ["+15551230001", "+15551230002"],
    },
  },
}
```

注意事項：

- 私訊存取控制是針對 **每個 WhatsApp 帳號全域生效** 的（配對/允許清單），而非針對單一代理人。
- 對於共享群組，請將該群組綁定至單一代理人，或使用 [廣播群組](/channels/broadcast-groups_zh_TW)。

## 路由規則（訊息如何選擇代理人）

綁定是 **確定性的 (Deterministic)**，且遵循 **最精確匹配者勝出 (Most-specific wins)** 原則：

1. `peer` 匹配（精確匹配私訊/群組/頻道 ID）
2. `guildId` 匹配 (Discord)
3. `teamId` 匹配 (Slack)
4. 特定頻道的 `accountId` 匹配
5. 頻道層級匹配 (`accountId: "*"`)
6. 回退至預設代理人 (`agents.list[].default`，若無則為清單中第一個，預設：`main`)

## 多個帳號 / 電話號碼

支援 **多帳號** 的頻道（如 WhatsApp）使用 `accountId` 來識別每次登入。每個 `accountId` 都可以路由至不同的代理人，因此單一伺服器可以託管多個門號，且不會混淆對談。

## 概念說明

- `agentId`: 一個「大腦」（包含工作區、各代理人獨立驗證、各代理人對談存儲）。
- `accountId`: 一個頻道帳號實例（例如：WhatsApp 帳號 `"personal"` vs `"biz"`）。
- `binding`: 根據 `(頻道, 帳號ID, 同儕)` 以及選用的伺服器/團隊 ID，將傳入訊息路由至特定 `agentId`。
- 直接對話會歸併至 `agent:<agentId>:<mainKey>`（即各代理人的「主會話」；參考 `session.mainKey`）。

## 範例：兩個 WhatsApp 帳號 → 兩個代理人

`~/.openclaw/openclaw.json` (JSON5):

```js
{
  agents: {
    list: [
      {
        id: "home",
        default: true,
        name: "家庭",
        workspace: "~/.openclaw/workspace-home",
        agentDir: "~/.openclaw/agents/home/agent",
      },
      {
        id: "work",
        name: "工作",
        workspace: "~/.openclaw/workspace-work",
        agentDir: "~/.openclaw/agents/work/agent",
      },
    ],
  },

  // 確定性路由：第一個匹配到的規則勝出（越精確越優先）。
  bindings: [
    { agentId: "home", match: { channel: "whatsapp", accountId: "personal" } },
    { agentId: "work", match: { channel: "whatsapp", accountId: "biz" } },

    // 選用的個別同儕覆寫（例如：將特定的群組傳送給工作代理人）。
    {
      agentId: "work",
      match: {
        channel: "whatsapp",
        accountId: "personal",
        peer: { kind: "group", id: "1203630...@g.us" },
      },
    },
  ],

  // 預設關閉：代理人間通訊必須明確啟用並加入允許清單。
  tools: {
    agentToAgent: {
      enabled: false,
      allow: ["home", "work"],
    },
  },

  channels: {
    whatsapp: {
      accounts: {
        personal: {
          // 選用的覆寫。預設：~/.openclaw/credentials/whatsapp/personal
          // authDir: "~/.openclaw/credentials/whatsapp/personal",
        },
        biz: {
          // 選用的覆寫。預設：~/.openclaw/credentials/whatsapp/biz
          // authDir: "~/.openclaw/credentials/whatsapp/biz",
        },
      },
    },
  },
}
```

## 範例：WhatsApp 日常聊天 + Telegram 深度工作

依頻道區分：將 WhatsApp 路由至快速的日常代理人，將 Telegram 路由至 Opus 代理人。

```json5
{
  agents: {
    list: [
      {
        id: "chat",
        name: "日常對談",
        workspace: "~/.openclaw/workspace-chat",
        model: "anthropic/claude-sonnet-4-5",
      },
      {
        id: "opus",
        name: "深度工作",
        workspace: "~/.openclaw/workspace-opus",
        model: "anthropic/claude-opus-4-6",
      },
    ],
  },
  bindings: [
    { agentId: "chat", match: { channel: "whatsapp" } },
    { agentId: "opus", match: { channel: "telegram" } },
  ],
}
```

注意事項：

- 如果一個頻道有多個帳號，請在綁定中加入 `accountId`（例如：`{ channel: "whatsapp", accountId: "personal" }`）。
- 若要將特定的私訊/群組路由至 Opus，同時保持其他內容由日常代理人處理，請為該對象新增一個 `match.peer` 綁定；同儕匹配永遠優先於頻道層級規則。

## 範例：同一個頻道，單一同儕路由至 Opus

保持 WhatsApp 運作於快速代理人，但將其中一個私訊路由至 Opus：

```json5
{
  agents: {
    list: [
      {
        id: "chat",
        name: "日常對談",
        workspace: "~/.openclaw/workspace-chat",
        model: "anthropic/claude-sonnet-4-5",
      },
      {
        id: "opus",
        name: "深度工作",
        workspace: "~/.openclaw/workspace-opus",
        model: "anthropic/claude-opus-4-6",
      },
    ],
  },
  bindings: [
    {
      agentId: "opus",
      match: { channel: "whatsapp", peer: { kind: "direct", id: "+15551234567" } },
    },
    { agentId: "chat", match: { channel: "whatsapp" } },
  ],
}
```

同儕綁定規則優先權最高，因此請將其放在頻道廣域規則上方。

## 綁定至 WhatsApp 群組的家庭代理人

將專用的家庭代理人綁定至單一 WhatsApp 群組，並設定提及門檻與更嚴格的工具原則：

```json5
{
  agents: {
    list: [
      {
        id: "family",
        name: "家庭",
        workspace: "~/.openclaw/workspace-family",
        identity: { name: "家庭機器人" },
        groupChat: {
          mentionPatterns: ["@family", "@familybot", "@家庭機器人"],
        },
        sandbox: {
          mode: "all",
          scope: "agent",
        },
        tools: {
          allow: [
            "exec",
            "read",
            "sessions_list",
            "sessions_history",
            "sessions_send",
            "sessions_spawn",
            "session_status",
          ],
          deny: ["write", "edit", "apply_patch", "browser", "canvas", "nodes", "cron"],
        },
      },
    ],
  },
  bindings: [
    {
      agentId: "family",
      match: {
        channel: "whatsapp",
        peer: { kind: "group", id: "120363999999999999@g.us" },
      },
    },
  ],
}
```

注意事項：

- 工具的允許/拒絕清單針對的是 **工具 (Tools)**，而非技能 (Skills)。若技能需要執行二進位檔案，請確保 `exec` 已被允許且該二進位檔存在於沙箱中。
- 為了更嚴格的控管，請設定 `agents.list[].groupChat.mentionPatterns` 並保持頻道的群組允許清單功能開啟。

## 各代理人獨立的沙箱與工具配置

自 v2026.1.6 起，每個代理人都可以擁有獨立的沙箱與工具限制：

```js
{
  agents: {
    list: [
      {
        id: "personal",
        workspace: "~/.openclaw/workspace-personal",
        sandbox: {
          mode: "off",  // 個人代理人不使用沙箱
        },
        // 無工具限制 - 所有工具皆可用
      },
      {
        id: "family",
        workspace: "~/.openclaw/workspace-family",
        sandbox: {
          mode: "all",     // 始終使用沙箱
          scope: "agent",  // 每個代理人一個容器
          docker: {
            // 容器建立後的選用單次設定
            setupCommand: "apt-get update && apt-get install -y git curl",
          },
        },
        tools: {
          allow: ["read"],                    // 僅允許 read 工具
          deny: ["exec", "write", "edit", "apply_patch"],    // 拒絕其他工具
        },
      },
    ],
  },
}
```

注意：`setupCommand` 位於 `sandbox.docker` 下，僅在容器建立時執行一次。若解析後的範圍為 `"shared"`，則會忽略個別代理人的 `sandbox.docker.*` 覆寫設定。

**優點：**

- **安全性隔離**：限制不可信代理人的工具權限。
- **資源控制**：針對特定代理人進行沙箱化，同時讓其他代理人維持在宿主機執行。
- **彈性的原則**：為每個代理人設定不同的權限等級。

注意：`tools.elevated` 是 **全域性** 且基於傳送者的；它無法針對單一代理人進行配置。如果您需要代理人層級的邊界，請使用 `agents.list[].tools` 來拒絕 `exec`。針對群組定位，請設定 `agents.list[].groupChat.mentionPatterns`，使 @提及能準確對應至預期的代理人。

詳細範例請參閱 [多代理人沙箱與工具](/tools/multi-agent-sandbox-tools_zh_TW)。
