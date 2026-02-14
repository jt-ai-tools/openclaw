---
name: tmux
description: 透過發送按鍵指令與擷取窗格輸出，遠端控制 tmux 工作階段，適用於互動式 CLI。
metadata:
  { "openclaw": { "emoji": "🧵", "os": ["darwin", "linux"], "requires": { "bins": ["tmux"] } } }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# tmux 技能 (OpenClaw)

僅在需要互動式 TTY 時使用 tmux。對於長時間執行且非互動式的任務，優先使用 `exec` 工具的背景模式。

## 快速入門 (隔離通訊端, exec 工具)

```bash
SOCKET_DIR="${OPENCLAW_TMUX_SOCKET_DIR:-${CLAWDBOT_TMUX_SOCKET_DIR:-${TMPDIR:-/tmp}/openclaw-tmux-sockets}}"
mkdir -p "$SOCKET_DIR"
SOCKET="$SOCKET_DIR/openclaw.sock"
SESSION=openclaw-python

tmux -S "$SOCKET" new -d -s "$SESSION" -n shell
tmux -S "$SOCKET" send-keys -t "$SESSION":0.0 -- 'PYTHON_BASIC_REPL=1 python3 -q' Enter
tmux -S "$SOCKET" capture-pane -p -J -t "$SESSION":0.0 -S -200
```

啟動工作階段後，請務必印出監控指令：

```
監控方式：
  tmux -S "$SOCKET" attach -t "$SESSION"
  tmux -S "$SOCKET" capture-pane -p -J -t "$SESSION":0.0 -S -200
```

## 通訊端 (Socket) 慣例

- 使用 `OPENCLAW_TMUX_SOCKET_DIR`。
- 預設通訊端路徑：`"$OPENCLAW_TMUX_SOCKET_DIR/openclaw.sock"`。

## 窗格定位與命名

- 目標格式：`session:window.pane`（預設為 `:0.0`）。
- 保持名稱簡短，避免使用空格。
- 檢查方式：`tmux -S "$SOCKET" list-sessions`, `tmux -S "$SOCKET" list-panes -a`。

## 尋找工作階段

- 列出通訊端上的工作階段：`{baseDir}/scripts/find-sessions.sh -S "$SOCKET"`。
- 掃描所有通訊端：`{baseDir}/scripts/find-sessions.sh --all`。

## 安全發送輸入

- 優先使用字面量發送：`tmux -S "$SOCKET" send-keys -t target -l -- "$cmd"`。
- 控制鍵：`tmux -S "$SOCKET" send-keys -t target C-c`。
- 針對 Claude Code/Codex 等互動式 TUI 應用程式，**請勿**在同一條 `send-keys` 指令中附加 `Enter`。這些 App 可能會將快速的「文字+Enter」序列視為貼上/多行輸入而不提交。請將文字與 `Enter` 作為獨立指令發送，並中間加入微小延遲：

```bash
tmux -S "$SOCKET" send-keys -t target -l -- "$cmd" && sleep 0.1 && tmux -S "$SOCKET" send-keys -t target Enter
```

## 監控輸出

- 擷取最近歷史：`tmux -S "$SOCKET" capture-pane -p -J -t target -S -200`。
- 等待提示詞：`{baseDir}/scripts/wait-for-text.sh -t session:0.0 -p '正規表示式'`。
- 允許掛載 (Attach)，使用 `Ctrl+b d` 卸載。

## 啟動程序

- 針對 Python REPL，請設定 `PYTHON_BASIC_REPL=1`（非基本 REPL 會破壞 send-keys 流程）。

## Windows / WSL

- tmux 支援於 macOS/Linux。在 Windows 上，請使用 WSL 並在 WSL 內安裝 tmux。
- 此技能受限於 `darwin`/`linux` 平台，且需要 PATH 中存在 `tmux`。

## 編排程式碼代理人 (Codex, Claude Code)

tmux 非常適合並行執行多個程式碼代理人：

```bash
SOCKET="${TMPDIR:-/tmp}/codex-army.sock"

# 建立多個工作階段
for i in 1 2 3 4 5; do
  tmux -S "$SOCKET" new-session -d -s "agent-$i"
done

# 在不同的工作目錄啟動代理人
tmux -S "$SOCKET" send-keys -t agent-1 "cd /tmp/project1 && codex --yolo '修復 Bug X'" Enter
tmux -S "$SOCKET" send-keys -t agent-2 "cd /tmp/project2 && codex --yolo '修復 Bug Y'" Enter

# 輪詢是否完成（檢查提示詞是否回傳）
for sess in agent-1 agent-2; do
  if tmux -S "$SOCKET" capture-pane -p -t "$sess" -S -3 | grep -q "❯"; then
    echo "$sess: 完成 (DONE)"
  else
    echo "$sess: 執行中..."
  fi
done
```

## 輔助腳本：wait-for-text.sh

`{baseDir}/scripts/wait-for-text.sh` 會在超時時間內對窗格內容進行正規表示式（或固定字串）輪詢。

- `-t`/`--target`: 窗格目標 (必填)。
- `-p`/`--pattern`: 匹配模式 (必填)；加上 `-F` 使用固定字串。
- `-T`: 超時秒數 (整數, 預設 15)。
- `-i`: 輪詢間隔 (預設 0.5)。
- `-l`: 搜尋歷史行數 (整數, 預設 1000)。
