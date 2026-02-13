---
summary: "背景 Exec 執行與程序管理說明"
read_when:
  - 新增或修改背景 Exec 行為時
  - 偵錯長時間執行的 Exec 任務時
title: "背景 Exec 與程序工具"
---

> 此文件為 [English Version](/gateway/background-process) 的繁體中文版本。

# 背景 Exec 與程序工具 (Process Tool)

OpenClaw 透過 `exec` 工具執行 Shell 指令，並將長時間執行的任務保留在記憶體中。`process` 工具則負責管理這些背景工作階段。

## exec 工具

關鍵參數：

- `command` (必填)
- `yieldMs` (預設 10000)：在此延遲後自動轉入背景執行
- `background` (布林值)：立即轉入背景執行
- `timeout` (秒，預設 1800)：在此逾時後強制終止程序
- `elevated` (布林值)：若啟用了提升權限模式，則在宿主機上執行
- 需要真實的 TTY？設定 `pty: true`。
- `workdir` (工作目錄), `env` (環境變數)

行為模式：

- 前景執行會直接傳回輸出內容。
- 當轉入背景執行時（無論是明確指定或因逾時觸發），工具會傳回 `status: "running"`、`sessionId` 以及一段簡短的尾部輸出。
- 輸出內容會保留在記憶體中，直到對該對談進行輪詢 (poll) 或清除 (clear)。
- 若 `process` 工具被禁用，`exec` 將以同步方式執行，並忽略 `yieldMs` 與 `background` 參數。

## 子程序橋接 (Child process bridging)

當在 exec/process 工具之外啟動長時間執行的子程序時（例如 CLI 重啟或閘道器輔助程式），請掛載子程序橋接輔助程式 (child-process bridge helper)，以便轉發終止信號，並在結束或發生錯誤時分離監聽程式。這能避免在 systemd 上產生孤兒程序 (orphaned processes)，並保持各平台間關閉行為的一致性。

環境變數覆寫：

- `PI_BASH_YIELD_MS`：預設讓出時間 (ms)
- `PI_BASH_MAX_OUTPUT_CHARS`：記憶體內輸出的上限（字元數）
- `OPENCLAW_BASH_PENDING_MAX_OUTPUT_CHARS`：每個串流待處理 stdout/stderr 的上限（字元數）
- `PI_BASH_JOB_TTL_MS`：已完成會話的生存時間 (TTL)（ms，限制在 1 分鐘至 3 小時之間）

組態設定（建議方式）：

- `tools.exec.backgroundMs` (預設 10000)
- `tools.exec.timeoutSec` (預設 1800)
- `tools.exec.cleanupMs` (預設 1800000)
- `tools.exec.notifyOnExit` (預設 true)：當背景執行的 exec 結束時，將系統事件排入佇列並請求心跳偵測。

## process 工具

動作項目 (Actions)：

- `list`：列出執行中與已結束的會話
- `poll`：獲取會話的新輸出內容（並回報結束狀態）
- `log`：讀取聚合後的完整輸出內容（支援 `offset` 與 `limit`）
- `write`：傳送標準輸入 stdin (`data`，選填 `eof`)
- `kill`：強制終止背景會話
- `clear`：從記憶體中移除已結束的會話
- `remove`：若在執行中則強制終止，若已結束則清除

注意事項：

- 僅有轉入背景的會話會被列出或保留在記憶體中。
- 當程序重啟時，會話資訊會遺失（不具備磁碟持久性）。
- 會話日誌僅在您執行 `process poll/log` 且工具執行結果被記錄時，才會儲存到聊天歷史紀錄中。
- `process` 的作用範圍僅限於個別代理人；它僅能看見由該代理人啟動的會話。
- `process list` 包含衍生的 `name`（指令動詞 + 目標），方便快速掃描。
- `process log` 使用基於行號的 `offset`/`limit`（省略 `offset` 則抓取最後 N 行）。

## 範例

執行長時間任務並於稍後輪詢：

```json
{ "tool": "exec", "command": "sleep 5 && echo done", "yieldMs": 1000 }
```

```json
{ "tool": "process", "action": "poll", "sessionId": "<id>" }
```

立即在背景啟動：

```json
{ "tool": "exec", "command": "npm run build", "background": true }
```

傳送標準輸入 (stdin)：

```json
{ "tool": "process", "action": "write", "sessionId": "<id>", "data": "y
" }
```
