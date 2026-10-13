---
summary: "CLI 後端：透過本地端 AI CLI 工具實現僅限文字的備援機制"
read_when:
  - 當 API 提供者故障時，您需要一個可靠的備援方案
  - 您正在執行 Claude Code CLI 或其他本地 AI CLI，並希望重用它們
  - 您需要一個不含工具調用的純文字路徑，但仍支援對談與影像功能
title: "CLI 後端"
---

> 此文件為 [English Version](/gateway/cli-backends_zh_TW) 的繁體中文版本。

# CLI 後端 (備援執行環境)

當 API 提供者斷線、觸發頻率限制或暫時異常時，OpenClaw 可以執行 **本地端 AI CLI** 作為 **僅限文字的備援方案**。此功能的設計刻意保持保守：

- **停用工具功能**（不進行工具調用）。
- **文字輸入 → 文字輸出**（具備高可靠性）。
- **支援對談工作階段**（讓後續對話能保持連貫）。
- **支援影像傳遞**（若該 CLI 接受影像檔案路徑）。

這被設計為一個 **安全網 (Safety net)** 而非主要路徑。當您希望在不依賴外部 API 的情況下獲得「保證成功」的文字回應時，請使用此功能。

## 新手快速上手

您可以 **無需任何組態** 直接使用 Claude Code CLI（OpenClaw 已內建預設值）：

```bash
openclaw agent --message "hi" --model claude-cli/opus-4.6
```

Codex CLI 同樣內建支援：

```bash
openclaw agent --message "hi" --model codex-cli/gpt-5.3-codex
```

如果您的閘道器執行於 launchd/systemd 且 `PATH` 環境變數極簡，請僅新增指令路徑：

```json5
{
  agents: {
    defaults: {
      cliBackends: {
        "claude-cli": {
          command: "/opt/homebrew/bin/claude",
        },
      },
    },
  },
}
```

就這麼簡單。除了 CLI 本身之外，無需金鑰或額外的驗證組態。

## 將其作為備援方案

將 CLI 後端加入您的備援清單，使其僅在主要模型失敗時執行：

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-opus-4-6",
        fallbacks: ["claude-cli/opus-4.6", "claude-cli/opus-4.5"],
      },
      models: {
        "anthropic/claude-opus-4-6": { alias: "Opus" },
        "claude-cli/opus-4.6": {},
        "claude-cli/opus-4.5": {},
      },
    },
  },
}
```

注意事項：

- 如果您使用了 `agents.defaults.models`（允許清單），則必須包含 `claude-cli/...`。
- 如果主要提供者失敗（驗證錯誤、頻率限制、逾時），OpenClaw 將接著嘗試 CLI 後端。

## 組態設定概觀

所有 CLI 後端皆定義於：

```
agents.defaults.cliBackends
```

每個項目皆以 **提供者 ID** 為鍵值（例如 `claude-cli`, `my-cli`）。
該提供者 ID 會成為模型參考的左側部分：

```
<提供者>/<模型>
```

### 組態範例

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
          input: "arg",
          modelArg: "--model",
          modelAliases: {
            "claude-opus-4-6": "opus",
            "claude-opus-4-5": "opus",
            "claude-sonnet-4-5": "sonnet",
          },
          sessionArg: "--session",
          sessionMode: "existing",
          sessionIdFields: ["session_id", "conversation_id"],
          systemPromptArg: "--system",
          systemPromptWhen: "first",
          imageArg: "--image",
          imageMode: "repeat",
          serialize: true,
        },
      },
    },
  },
}
```

## 運作原理

1. **選擇後端**：根據提供者前綴（如 `claude-cli/...`）進行選擇。
2. **建立系統提示詞**：使用與 OpenClaw 相同的提示詞 + 工作區上下文。
3. **執行 CLI**：帶入會話 ID（若支援），以確保歷史紀錄的一致性。
4. **解析輸出**：解析 JSON 或純文字，並傳回最終文字內容。
5. **持久化會話 ID**：針對每個後端紀錄會話 ID，讓後續對話能重用同一個 CLI 會話。

## 對談工作階段 (Sessions)

- 若 CLI 支援會話，請設定 `sessionArg`（如 `--session-id`）；若 ID 需插入多個旗標，請使用 `sessionArgs`（佔位符為 `{sessionId}`）。
- 若 CLI 使用不同的旗標作為 **恢復子指令 (resume subcommand)**，請設定 `resumeArgs`（恢復時會取代 `args`），並視需要設定 `resumeOutput`（用於非 JSON 格式的恢復輸出）。
- `sessionMode`：
  - `always`：一律傳送會話 ID（若無儲存紀錄則產生新的 UUID）。
  - `existing`：僅在先前有儲存紀錄時傳送會話 ID。
  - `none`：從不傳送會話 ID。

## 影像傳遞 (Pass-through)

如果您的 CLI 接受影像路徑，請設定 `imageArg`：

```json5
imageArg: "--image",
imageMode: "repeat"
```

OpenClaw 會將 Base64 影像寫入暫存檔。若設定了 `imageArg`，這些路徑會作為 CLI 引數傳遞。若缺失 `imageArg`，OpenClaw 會將檔案路徑附加至提示詞末尾（路徑注入），這對於會自動從純路徑載入本地檔案的 CLI（如 Claude Code CLI 的行為）已足夠。

## 輸入與輸出

- `output: "json"` (預設值)：嘗試解析 JSON 並提取文字與會話 ID。
- `output: "jsonl"`：解析 JSONL 串流（Codex CLI `--json`）並提取最後一則代理人訊息，以及 `thread_id`（若存在）。
- `output: "text"`：將標準輸出 (stdout) 視為最終回應。

輸入模式：

- `input: "arg"` (預設值)：將提示詞作為最後一個 CLI 引數傳遞。
- `input: "stdin"`：透過標準輸入 (stdin) 傳送提示詞。
- 若提示詞極長且設定了 `maxPromptArgChars`，則會自動改用 stdin。

## 內建預設值

OpenClaw 內建了 `claude-cli` 的預設設定：

- `command: "claude"`
- `args: ["-p", "--output-format", "json", "--dangerously-skip-permissions"]`
- `resumeArgs: ["-p", "--output-format", "json", "--dangerously-skip-permissions", "--resume", "{sessionId}"]`
- `modelArg: "--model"`
- `systemPromptArg: "--append-system-prompt"`
- `sessionArg: "--session-id"`
- `systemPromptWhen: "first"`
- `sessionMode: "always"`

OpenClaw 同樣內建了 `codex-cli` 的預設設定：

- `command: "codex"`
- `args: ["exec","--json","--color","never","--sandbox","read-only","--skip-git-repo-check"]`
- `resumeArgs: ["exec","resume","{sessionId}","--color","never","--sandbox","read-only","--skip-git-repo-check"]`
- `output: "jsonl"`
- `resumeOutput: "text"`
- `modelArg: "--model"`
- `imageArg: "--image"`
- `sessionMode: "existing"`

僅在需要時才進行覆寫（常見情況是設定絕對的 `command` 路徑）。

## 限制

- **不含 OpenClaw 工具**：CLI 後端絕不會接收到工具調用請求。部分 CLI 可能仍會執行其自有的代理人工具。
- **不支援串流**：CLI 輸出會被全數蒐集後才一次傳回。
- **結構化輸出**：取決於該 CLI 的 JSON 格式。
- **Codex CLI 會話**：恢復會話時是透過文字輸出（非 JSONL），其結構化程度低於初始的 `--json` 執行。OpenClaw 的對談功能仍會正常運作。

## 故障排除

- **找不到 CLI**：將 `command` 設定為完整路徑。
- **模型名稱錯誤**：使用 `modelAliases` 將 `provider/model` 對應至 CLI 模型。
- **對談不連續**：確保已設定 `sessionArg` 且 `sessionMode` 非 `none`（目前的 Codex CLI 無法在 JSON 輸出模式下恢復會話）。
- **影像被忽略**：設定 `imageArg`（並確認該 CLI 支援檔案路徑）。
