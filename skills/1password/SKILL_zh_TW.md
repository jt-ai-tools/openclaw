---
name: 1password
description: 設定並使用 1Password CLI (op)。當需要安裝 CLI、啟用桌面 App 整合、登入（單帳號或多帳號）或透過 op 讀取/注入/執行秘密時使用。
homepage: https://developer.1password.com/docs/cli/get-started/
metadata:
  {
    "openclaw":
      {
        "emoji": "🔐",
        "requires": { "bins": ["op"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "1password-cli",
              "bins": ["op"],
              "label": "安裝 1Password CLI (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# 1Password CLI

請遵循官方 CLI 入門步驟。不要隨意猜測安裝指令。

## 參考文件 (References)

- `references/get-started.md`（安裝 + App 整合 + 登入流程）
- `references/cli-examples.md`（實際的 `op` 指令範例）

## 工作流程

1. 檢查作業系統與 Shell。
2. 驗證 CLI 是否存在：`op --version`。
3. 確認已啟用桌面 App 整合（依照入門指南）且 App 已解鎖。
4. **必要操作**：為所有 `op` 指令建立一個全新的 tmux 工作階段（不可在 tmux 之外直接呼叫 `op`）。
5. 在 tmux 內登入/授權：`op signin`（預期會出現 App 彈窗）。
6. 在 tmux 內驗證存取權：`op whoami`（讀取任何秘密前必須先成功執行此項）。
7. 若有多個帳號：使用 `--account` 或 `OP_ACCOUNT` 環境變數。

## 必要之 tmux 工作階段 (T-Max)

Shell 工具為每個指令使用全新的 TTY。為了避免重複提示與失敗，請務必在專用的 tmux 工作階段中執行 `op`，並使用全新的通訊端 (Socket)/工作階段名稱。

範例（請參閱 `tmux` 技能了解通訊端慣例，不要重複使用舊的工作階段名稱）：

```bash
SOCKET_DIR="${OPENCLAW_TMUX_SOCKET_DIR:-${CLAWDBOT_TMUX_SOCKET_DIR:-${TMPDIR:-/tmp}/openclaw-tmux-sockets}}"
mkdir -p "$SOCKET_DIR"
SOCKET="$SOCKET_DIR/openclaw-op.sock"
SESSION="op-auth-$(date +%Y%m%d-%H%M%S)"

tmux -S "$SOCKET" new -d -s "$SESSION" -n shell
tmux -S "$SOCKET" send-keys -t "$SESSION":0.0 -- "op signin --account my.1password.com" Enter
tmux -S "$SOCKET" send-keys -t "$SESSION":0.0 -- "op whoami" Enter
tmux -S "$SOCKET" send-keys -t "$SESSION":0.0 -- "op vault list" Enter
tmux -S "$SOCKET" capture-pane -p -J -t "$SESSION":0.0 -S -200
tmux -S "$SOCKET" kill-session -t "$SESSION"
```

## 安全防護欄 (Guardrails)

- 絕不將秘密貼入日誌、聊天內容或程式碼中。
- 優先使用 `op run` / `op inject`，而非將秘密寫入磁碟。
- 如果需要不透過 App 整合登入，請使用 `op account add`。
- 如果指令回傳 "account is not signed in"，請在 tmux 內重新執行 `op signin` 並在 App 中授權。
- **不要在 tmux 之外執行 `op`**；如果無法使用 tmux，請停止操作並詢問使用者。
