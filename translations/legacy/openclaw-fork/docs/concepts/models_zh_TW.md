---
summary: "模型 CLI：列出、設定、別名、備援、掃描與狀態檢查"
read_when:
  - 新增或修改模型 CLI 功能（清單/設定/掃描/別名/備援）時
  - 更改模型備援行為或選擇介面體驗時
  - 更新模型掃描探測（工具/影像）時
title: "模型 CLI"
---

> 此文件為 [English Version](/concepts/models_zh_TW) 的繁體中文版本。

# 模型 CLI (Models CLI)

關於驗證設定檔輪替、冷卻期以及它們與備援機制的互動方式，請參閱 [/concepts/model-failover](/concepts/model-failover_zh_TW)。
關於提供者概觀與範例，請參閱 [/concepts/model-providers](/concepts/model-providers_zh_TW)。

## 模型選擇機制

OpenClaw 依序按以下順序選擇模型：

1. **主要 (Primary)** 模型 (`agents.defaults.model.primary` 或 `agents.defaults.model`)。
2. **備援 (Fallbacks)** 清單中的模型（依據 `agents.defaults.model.fallbacks` 順序）。
3. **提供者驗證容錯移轉** 會在切換到下一個模型前，先在該提供者內部進行。

相關說明：

- `agents.defaults.models` 是 OpenClaw 可使用的模型允許清單/型錄（包含別名）。
- `agents.defaults.imageModel` 僅在主要模型不支援影像輸入時使用。
- 每個代理人的預設值可透過 `agents.list[].model` 與綁定設定覆寫 `agents.defaults.model`（請參閱 [/concepts/multi-agent](/concepts/multi-agent_zh_TW)）。

## 快速挑選建議 (經驗談)

- **GLM**: 在程式碼編寫與工具調用方面表現較佳。
- **MiniMax**: 在創意寫作與氛圍表現方面表現較佳。

## 設定精靈 (建議方式)

如果您不想手動編輯組態檔案，請執行引導精靈：

```bash
openclaw onboard
```

它可以協助您設定常見提供者的模型與驗證，包含 **OpenAI Code (Codex) 訂閱版** (OAuth) 以及 **Anthropic**（建議使用 API 密鑰；同樣支援 `claude setup-token`）。

## 組態鍵名 (概觀)

- `agents.defaults.model.primary` 與 `agents.defaults.model.fallbacks`
- `agents.defaults.imageModel.primary` 與 `agents.defaults.imageModel.fallbacks`
- `agents.defaults.models` (允許清單 + 別名 + 提供者參數)
- `models.providers` (寫入 `models.json` 的自訂提供者)

模型參考名稱會規範化為小寫。提供者別名如 `z.ai/*` 會自動轉為 `zai/*`。

提供者組態範例（包含 OpenCode Zen）請見 [/gateway/configuration](/gateway/configuration_zh_TW#opencode-zen-multi-model-proxy)。

## 「模型不被允許」 (以及回覆中斷的原因)

如果設定了 `agents.defaults.models`，它會成為 `/model` 指令與對談覆寫的 **允許清單**。當使用者選擇的模型不在該清單中時，OpenClaw 會傳回：

```
Model "provider/model" is not allowed. Use /model to list available models.
```

這會發生在產生正常回覆 **之前**，因此訊息看起來會像是「沒有回應」。修復方法為：

- 將該模型加入 `agents.defaults.models`，或者
- 清除允許清單（移除 `agents.defaults.models`），或者
- 從 `/model list` 中挑選一個模型。

允許清單範例：

```json5
{
  agent: {
    model: { primary: "anthropic/claude-sonnet-4-5" },
    models: {
      "anthropic/claude-sonnet-4-5": { alias: "Sonnet" },
      "anthropic/claude-opus-4-6": { alias: "Opus" },
    },
  },
}
```

## 在對談中切換模型 (`/model`)

您可以在不重啟的情況下切換目前會話的模型：

```
/model
/model list
/model 3
/model openai/gpt-5.2
/model status
```

注意事項：

- `/model`（與 `/model list`）是一個精簡的數字選擇器（顯示模型系列 + 可用提供者）。
- `/model <編號>` 透過該選擇器進行選取。
- `/model status` 顯示詳細資訊（包含驗證候選清單，若有配置則顯示提供者端點 `baseUrl` + `api` 模式）。
- 模型參考會依據第一個 `/` 進行拆分解析。輸入 `/model <ref>` 時請使用 `provider/model` 格式。
- 若模型 ID 本身包含 `/`（如 OpenRouter 格式），您必須包含提供者前綴（例如：`/model openrouter/moonshotai/kimi-k2`）。
- 若省略提供者，OpenClaw 會將輸入視為 **預設提供者** 的別名或模型（僅在模型 ID 中沒有 `/` 時有效）。

完整的指令行為與組態請見：[斜線指令](/tools/slash-commands_zh_TW)。

## CLI 指令

```bash
openclaw models list
openclaw models status
openclaw models set <provider/model>
openclaw models set-image <provider/model>

openclaw models aliases list
openclaw models aliases add <別名> <provider/model>
openclaw models aliases remove <別名>

openclaw models fallbacks list
openclaw models fallbacks add <provider/model>
openclaw models fallbacks remove <provider/model>
openclaw models fallbacks clear

openclaw models image-fallbacks list
openclaw models image-fallbacks add <provider/model>
openclaw models image-fallbacks remove <provider/model>
openclaw models image-fallbacks clear
```

直接執行 `openclaw models`（不加子指令）是 `models status` 的捷徑。

### `models list`

預設顯示已配置的模型。實用旗標：

- `--all`: 顯示完整型錄
- `--local`: 僅顯示本地提供者
- `--provider <名稱>`: 依提供者篩選
- `--plain`: 每行顯示一個模型
- `--json`: 機器可讀的輸出格式

### `models status`

顯示解析後的解析的主要模型、備援模型、影像模型，以及已配置提供者的驗證概觀。它還會顯示驗證存儲區中 OAuth 設定檔的到期狀態（預設在 24 小時內發出警告）。`--plain` 僅印出解析後的主要模型。
OAuth 狀態一律會顯示（並包含在 `--json` 輸出中）。若已配置的提供者缺失憑證，`models status` 會印出 **Missing auth** 區段。
JSON 輸出包含 `auth.oauth`（警告窗口 + 設定檔）與 `auth.providers`（各提供者的實際驗證方式）。
自動化流程可使用 `--check`（缺失/過期傳回 `1`，即將過期傳回 `2`）。

建議的 Anthropic 驗證方式是使用 Claude Code CLI 的 setup-token（可在任何地方執行；必要時貼至閘道器主機）：

```bash
claude setup-token
openclaw models status
```

## 掃描功能 (OpenRouter 免費模型)

`openclaw models scan` 指令會檢查 OpenRouter 的 **免費模型型錄**，並可選用模型探測功能來檢查工具與影像支援。

關鍵旗標：

- `--no-probe`: 跳過實地探測（僅顯示元數據）
- `--min-params <b>`: 最小參數規模（單位：十億，Billions）
- `--max-age-days <天數>`: 跳過過舊的模型
- `--provider <名稱>`: 提供者前綴篩選
- `--max-candidates <n>`: 備援清單大小
- `--set-default`: 將第一個選中的模型設為 `agents.defaults.model.primary`
- `--set-image`: 將第一個選中的影像模型設為 `agents.defaults.imageModel.primary`

探測功能需要 OpenRouter API 密鑰（取自驗證設定檔或環境變數 `OPENROUTER_API_KEY`）。若無密鑰，請使用 `--no-probe` 僅列出候選清單。

掃描結果排名依據：

1. 影像支援能力
2. 工具調用延遲 (Latency)
3. 上下文大小
4. 參數數量

輸入來源：

- OpenRouter `/models` 列表（篩選條件為 `:free`）
- 需要來自驗證設定檔或 `OPENROUTER_API_KEY` 的 OpenRouter API 密鑰（參閱 [/environment](/help/environment_zh_TW)）
- 選用篩選器：`--max-age-days`, `--min-params`, `--provider`, `--max-candidates`
- 探測控制項：`--timeout`, `--concurrency`

在 TTY 環境下執行時，您可以互動式地選擇備援模型。在非互動模式下，請傳遞 `--yes` 以接受預設值。

## 模型註冊表 (`models.json`)

組態中 `models.providers` 的自訂提供者會寫入代理人目錄下的 `models.json`（預設為 `~/.openclaw/agents/<agentId>/models.json`）。除非 `models.mode` 設為 `replace`，否則此檔案預設會進行合併。
