---
summary: "組態設定概觀：常見任務、快速設定，以及完整參考文件的連結"
read_when:
  - 首次設定 OpenClaw 時
  - 尋找常見的組態模式時
  - 導覽至特定組態區段時
title: "組態設定"
---

> 此文件為 [English Version](/gateway/configuration_zh_TW) 的繁體中文版本。

# 組態設定 (Configuration)

OpenClaw 從 `~/.openclaw/openclaw.json` 讀取選用的 <Tooltip tip="JSON5 支援註解與結尾逗號">**JSON5**</Tooltip> 組態檔案。

如果該檔案不存在，OpenClaw 將使用安全的預設值。手動新增組態的常見原因包括：

- 連接頻道並控制誰可以傳送訊息給助理
- 設定模型、工具、沙箱或自動化（排程任務、鉤子）
- 調整會話、媒體、網路或 UI 介面

請參閱 [完整參考指南](/gateway/configuration-reference_zh_TW) 以了解所有可用欄位。

<Tip>
**剛接觸組態設定？** 請從執行 `openclaw onboard` 進行互動式設定開始，或查看 [組態範例](/gateway/configuration-examples_zh_TW) 指南以獲取完整的複製貼上組態。
</Tip>

## 最簡組態

```json5
// ~/.openclaw/openclaw.json
{
  agents: { defaults: { workspace: "~/.openclaw/workspace" } },
  channels: { whatsapp: { allowFrom: ["+15555550123"] } },
}
```

## 編輯組態

<Tabs>
  <Tab title="互動式精靈">
    ```bash
    openclaw onboard       # 完整設定精靈
    openclaw configure     # 組態設定精靈
    ```
  </Tab>
  <Tab title="CLI 指令">
    ```bash
    openclaw config get agents.defaults.workspace
    openclaw config set agents.defaults.heartbeat.every "2h"
    openclaw config unset tools.web.search.apiKey
    ```
  </Tab>
  <Tab title="控制 UI">
    開啟 [http://127.0.0.1:18789](http://127.0.0.1:18789) 並切換至 **Config** 分頁。
    控制 UI 會根據組態架構渲染出表單，並提供 **Raw JSON** 編輯器作為備用逃生口。
  </Tab>
  <Tab title="直接編輯">
    直接編輯 `~/.openclaw/openclaw.json`。閘道器會監控檔案變動並自動套用（請參閱 [熱重新載入](#組態熱重新載入)）。
  </Tab>
</Tabs>

## 嚴格驗證

<Warning>
OpenClaw 僅接受完全符合架構的組態。未知的鍵名、錯誤的型別或無效的值都會導致閘道器 **拒絕啟動**。
</Warning>

當驗證失敗時：

- 閘道器不會啟動
- 僅診斷指令可運作 (`openclaw doctor`, `openclaw logs`, `openclaw health`, `openclaw status`)
- 執行 `openclaw doctor` 以查看確切問題
- 執行 `openclaw doctor --fix` (或 `--yes`) 以套用修復

## 常見任務

<AccordionGroup>
  <Accordion title="設定頻道 (WhatsApp, Telegram, Discord 等)">
    每個頻道在 `channels.<provider>` 下都有自己的組態區段。請參閱各頻道的專屬頁面以獲取設定步驟：

    - [WhatsApp](/channels/whatsapp_zh_TW) — `channels.whatsapp`
    - [Telegram](/channels/telegram_zh_TW) — `channels.telegram`
    - [Discord](/channels/discord_zh_TW) — `channels.discord`
    - [Slack](/channels/slack_zh_TW) — `channels.slack`
    - [Signal](/channels/signal_zh_TW) — `channels.signal`
    - [iMessage](/channels/imessage_zh_TW) — `channels.imessage`
    - [Google Chat](/channels/googlechat_zh_TW) — `channels.googlechat`
    - [Mattermost](/channels/mattermost_zh_TW) — `channels.mattermost`
    - [MS Teams](/channels/msteams_zh_TW) — `channels.msteams`

    所有頻道都遵循相同的私訊策略 (DM policy) 模式：

    ```json5
    {
      channels: {
        telegram: {
          enabled: true,
          botToken: "123:abc",
          dmPolicy: "pairing",   // pairing (配對) | allowlist (允許清單) | open (公開) | disabled (停用)
          allowFrom: ["tg:123"], // 僅適用於 allowlist/open
        },
      },
    }
    ```

  </Accordion>

  <Accordion title="選擇與配置模型">
    設定主要模型與選用的備援模型：

    ```json5
    {
      agents: {
        defaults: {
          model: {
            primary: "anthropic/claude-sonnet-4-5",
            fallbacks: ["openai/gpt-5.2"],
          },
          models: {
            "anthropic/claude-sonnet-4-5": { alias: "Sonnet" },
            "openai/gpt-5.2": { alias: "GPT" },
          },
        },
      },
    }
    ```

    - `agents.defaults.models` 定義了模型型錄，並作為 `/model` 指令的允許清單。
    - 模型參考使用 `provider/model` 格式（例如：`anthropic/claude-opus-4-6`）。
    - 請參閱 [模型 CLI](/concepts/models_zh_TW) 以了解如何在聊天中切換模型，並參閱 [模型容錯移轉](/concepts/model-failover_zh_TW) 以了解驗證輪替與備援行為。
    - 對於自訂/自代管提供者，請參閱參考文件中的 [自訂提供者與基礎 URL](/gateway/configuration-reference_zh_TW#自訂提供者與基礎-URL)。

  </Accordion>

  <Accordion title="控制誰可以傳送訊息給助理">
    每個頻道的私訊存取權透過 `dmPolicy` 控制：

    - `"pairing"` (預設)：未知的傳送者會收到單次配對碼以待核准。
    - `"allowlist"`：僅允許 `allowFrom`（或已配對的允許存儲區）中的傳送者。
    - `"open"`：允許所有傳入私訊（需要 `allowFrom: ["*"]`）。
    - `"disabled"`：忽略所有私訊。

    針對群組，請使用 `groupPolicy` + `groupAllowFrom` 或頻道專屬的允許清單。

    詳情請參閱 [完整參考指南](/gateway/configuration-reference_zh_TW#私訊與群組存取)。

  </Accordion>

  <Accordion title="設定群組聊天提及門檻 (Mention Gating)">
    群組訊息預設為 **需要提及 (require mention)**。請為每個代理人設定模式：

    ```json5
    {
      agents: {
        list: [
          {
            id: "main",
            groupChat: {
              mentionPatterns: ["@openclaw", "openclaw"],
            },
          },
        ],
      },
      channels: {
        whatsapp: {
          groups: { "*": { requireMention: true } },
        },
      },
    }
    ```

    - **元數據提及**：原生 @-提及（WhatsApp 的點選提及、Telegram 的 @bot 等）。
    - **文字模式**：`mentionPatterns` 中的正規表示式 (Regex)。
    - 請參閱 [完整參考指南](/gateway/configuration-reference_zh_TW#群組聊天提及門檻) 以了解各頻道覆寫與自我對話模式。

  </Accordion>

  <Accordion title="配置對談會話與重設">
    會話 (Sessions) 控制對話的連續性與隔離：

    ```json5
    {
      session: {
        dmScope: "per-channel-peer",  // 多使用者環境的建議值
        reset: {
          mode: "daily",
          atHour: 4,
          idleMinutes: 120,
        },
      },
    }
    ```

    - `dmScope`: `main` (共用) | `per-peer` | `per-channel-peer` | `per-account-channel-peer`
    - 請參閱 [會話管理](/concepts/session_zh_TW) 以了解範圍、身分連結與發送原則。
    - 請參閱 [完整參考指南](/gateway/configuration-reference_zh_TW#會話) 以了解所有欄位。

  </Accordion>

  <Accordion title="啟用沙箱 (Sandboxing)">
    在隔離的 Docker 容器中執行代理人會話：

    ```json5
    {
      agents: {
        defaults: {
          sandbox: {
            mode: "non-main",  // off | non-main | all
            scope: "agent",    // session | agent | shared
          },
        },
      },
    }
    ```

    需先建置映像檔：`scripts/sandbox-setup.sh`

    請參閱 [沙箱指南](/gateway/sandboxing_zh_TW) 以了解完整說明，並參閱 [完整參考指南](/gateway/configuration-reference_zh_TW#沙箱) 以了解所有選項。

  </Accordion>

  <Accordion title="設定心跳 (Heartbeat，定期檢查)">
    ```json5
    {
      agents: {
        defaults: {
          heartbeat: {
            every: "30m",
            target: "last",
          },
        },
      },
    }
    ```

    - `every`: 時間長度字串（`30m`, `2h`）。設為 `0m` 以停用。
    - `target`: `last` | `whatsapp` | `telegram` | `discord` | `none`
    - 請參閱 [心跳指南](/gateway/heartbeat_zh_TW) 以了解完整說明。

  </Accordion>

  <Accordion title="配置排程任務 (Cron jobs)">
    ```json5
    {
      cron: {
        enabled: true,
        maxConcurrentRuns: 2,
        sessionRetention: "24h",
      },
    }
    ```

    請參閱 [排程任務](/automation/cron-jobs_zh_TW) 以了解功能概觀與 CLI 範例。

  </Accordion>

  <Accordion title="設定 Webhook (Hooks)">
    在閘道器上啟用 HTTP Webhook 端點：

    ```json5
    {
      hooks: {
        enabled: true,
        token: "shared-secret",
        path: "/hooks",
        defaultSessionKey: "hook:ingress",
        allowRequestSessionKey: false,
        allowedSessionKeyPrefixes: ["hook:"],
        mappings: [
          {
            match: { path: "gmail" },
            action: "agent",
            agentId: "main",
            deliver: true,
          },
        ],
      },
    }
    ```

    請參閱 [完整參考指南](/gateway/configuration-reference_zh_TW#鉤子) 以了解所有對應選項與 Gmail 整合。

  </Accordion>

  <Accordion title="配置多代理人路由">
    執行多個具備獨立工作區與會話的隔離代理人：

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

    請參閱 [多代理人](/concepts/multi-agent_zh_TW) 與 [完整參考指南](/gateway/configuration-reference_zh_TW#多代理人路由) 以了解綁定規則與各代理人存取設定。

  </Accordion>

  <Accordion title="將組態分割為多個檔案 ($include)">
    使用 `$include` 整理大型組態：

    ```json5
    // ~/.openclaw/openclaw.json
    {
      gateway: { port: 18789 },
      agents: { $include: "./agents.json5" },
      broadcast: {
        $include: ["./clients/a.json5", "./clients/b.json5"],
      },
    }
    ```

    - **單一檔案**：取代所屬物件。
    - **檔案陣列**：依序進行深層合併（後者覆蓋前者）。
    - **同級鍵名**：在 include 之後合併（覆蓋 included 的值）。
    - **巢狀 include**：支援深達 10 層。
    - **相對路徑**：相對於執行 include 的檔案進行解析。
    - **錯誤處理**：針對缺失檔案、解析錯誤與循環 include 提供清晰的錯誤提示。

  </Accordion>
</AccordionGroup>

## 組態熱重新載入

閘道器會監控 `~/.openclaw/openclaw.json` 並自動套用變更 —— 大多數設定無需手動重啟。

### 重新載入模式

| 模式 | 行為 |
| ---------------------- | --------------------------------------------------------------------------------------- |
| **`hybrid`** (預設) | 立即套用安全變更。針對關鍵變更自動重啟。 |
| **`hot`** | 僅套用安全變更。當需要重啟時記錄警告 —— 由您手動處理。 |
| **`restart`** | 偵測到任何組態變更即重啟閘道器，不論是否安全。 |
| **`off`** | 停用檔案監控。變更將在下次手動重啟時生效。 |

```json5
{
  gateway: {
    reload: { mode: "hybrid", debounceMs: 300 },
  },
}
```

### 哪些支援熱載入，哪些需要重啟

大多數欄位都支援無停機時間的熱載入。在 `hybrid` 模式下，需要重啟的變更會由系統自動處理。

| 類別 | 欄位 | 是否需要重啟？ |
| ------------------- | -------------------------------------------------------------------- | --------------- |
| 頻道 | `channels.*`, `web` (WhatsApp) — 所有內建與擴充頻道 | 否 |
| 代理人與模型 | `agent`, `agents`, `models`, `routing` | 否 |
| 自動化 | `hooks`, `cron`, `agent.heartbeat` | 否 |
| 會話與訊息 | `session`, `messages` | 否 |
| 工具與媒體 | `tools`, `browser`, `skills`, `audio`, `talk` | 否 |
| UI 與雜項 | `ui`, `logging`, `identity`, `bindings` | 否 |
| 閘道器伺服器 | `gateway.*` (port, bind, auth, tailscale, TLS, HTTP) | **是** |
| 基礎設施 | `discovery`, `canvasHost`, `plugins` | **是** |

<Note>
`gateway.reload` 與 `gateway.remote` 是例外 —— 變動這些設定 **不會** 觸發重啟。
</Note>

## 組態 RPC (程式化更新)

<AccordionGroup>
  <Accordion title="config.apply (全量取代)">
    驗證並寫入完整組態，並在一個步驟內重啟閘道器。

    <Warning>
    `config.apply` 會取代 **整個組態**。部分更新請使用 `config.patch`，單一鍵名請使用 `openclaw config set`。
    </Warning>

    參數：

    - `raw` (字串) — 整個組態的 JSON5 負載
    - `baseHash` (選填) — 來自 `config.get` 的組態雜湊（組態存在時必填）
    - `sessionKey` (選填) — 重啟後喚醒通知的會話金鑰
    - `note` (選填) — 給重啟哨兵 (sentinel) 的註記
    - `restartDelayMs` (選填) — 重啟前的延遲時間（預設 2000）

    ```bash
    openclaw gateway call config.get --params '{}'  # 取得 payload.hash
    openclaw gateway call config.apply --params '{
      "raw": "{ agents: { defaults: { workspace: "~/.openclaw/workspace" } } }",
      "baseHash": "<hash>",
      "sessionKey": "agent:main:whatsapp:dm:+15555550123"
    }'
    ```

  </Accordion>

  <Accordion title="config.patch (部分更新)">
    將部分更新合併至現有組態（符合 JSON 合併修補語意）：

    - 物件遞迴合併
    - `null` 刪除該鍵名
    - 陣列直接取代

    參數：

    - `raw` (字串) — 僅包含欲更動鍵名的 JSON5
    - `baseHash` (必填) — 來自 `config.get` 的組態雜湊
    - `sessionKey`, `note`, `restartDelayMs` — 與 `config.apply` 相同

    ```bash
    openclaw gateway call config.patch --params '{
      "raw": "{ channels: { telegram: { groups: { "*": { requireMention: false } } } } }",
      "baseHash": "<hash>"
    }'
    ```

  </Accordion>
</AccordionGroup>

## 環境變數

OpenClaw 從父程序讀取環境變數，此外還包含：

- 目前工作目錄中的 `.env`（若存在）
- `~/.openclaw/.env`（全域備援）

這兩個檔案都不會覆寫現有的環境變數。您也可以在組態中內聯設定環境變數：

```json5
{
  env: {
    OPENROUTER_API_KEY: "sk-or-...",
    vars: { GROQ_API_KEY: "gsk-..." },
  },
}
```

<Accordion title="Shell 環境匯入 (選用)">
  若啟用且預期鍵名未設定，OpenClaw 會執行您的登入 Shell 並僅匯入缺失的鍵名：

```json5
{
  env: {
    shellEnv: { enabled: true, timeoutMs: 15000 },
  },
}
```

環境變數等效設定：`OPENCLAW_LOAD_SHELL_ENV=1`
</Accordion>

<Accordion title="組態值中的環境變數代換">
  在任何組態字串值中使用 `${VAR_NAME}` 引用環境變數：

```json5
{
  gateway: { auth: { token: "${OPENCLAW_GATEWAY_TOKEN}" } },
  models: { providers: { custom: { apiKey: "${CUSTOM_API_KEY}" } } },
}
```

規則：

- 僅比對全大寫名稱：`[A-Z_][A-Z0-9_]*`
- 缺失或變數為空將在載入時拋出錯誤
- 使用 `$${VAR}` 轉義以輸出字面值
- 在 `$include` 檔案中同樣有效
- 行內代換：`"${BASE}/v1"` → `"https://api.example.com/v1"`

</Accordion>

完整優先順序與來源請見 [環境變數](/help/environment_zh_TW)。

## 完整參考指南

關於所有欄位的詳細說明，請參閱 **[組態參考](/gateway/configuration-reference_zh_TW)**。

---

*相關內容：[組態範例](/gateway/configuration-examples_zh_TW) · [組態參考](/gateway/configuration-reference_zh_TW) · [Doctor 指令](/gateway/doctor_zh_TW)*
