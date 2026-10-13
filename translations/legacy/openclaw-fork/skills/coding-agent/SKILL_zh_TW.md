---
name: coding-agent
description: 透過背景程序運行 Codex CLI, Claude Code, OpenCode 或 Pi Coding Agent，以實現程式化控制。
metadata:
  {
    "openclaw": { "emoji": "🧩", "requires": { "anyBins": ["claude", "codex", "opencode", "pi"] } },
  }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# 程式碼代理人 (Coding Agent - Bash 優先)

使用 **bash**（搭配選用的背景模式）進行所有的程式碼代理人工作。簡單且有效。

## ⚠️ 必須使用 PTY 模式！

程式碼代理人（如 Codex, Claude Code, Pi）是 **互動式終端機應用程式**，需要虛擬終端機 (PTY) 才能正常運作。若不使用 PTY，您將會看到損壞的輸出、遺失顏色，或代理人可能會卡住。

執行程式碼代理人時，**請務必使用 `pty:true`**：

```bash
# ✅ 正確做法 - 使用 PTY
bash pty:true command:"codex exec '您的提示詞'"

# ❌ 錯誤做法 - 無 PTY，代理人可能會損壞
bash command:"codex exec '您的提示詞'"
```

### Bash 工具參數

| 參數         | 類型    | 說明                                                               |
| ------------ | ------- | ------------------------------------------------------------------ |
| `command`    | string  | 要執行的 Shell 指令                                                 |
| `pty`        | boolean | **程式碼代理人必用！** 為互動式 CLI 分配虛擬終端機                    |
| `workdir`    | string  | 工作目錄（代理人僅能看到此資料夾的上下文）                          |
| `background` | boolean | 在背景執行，回傳 sessionId 以供監控                                 |
| `timeout`    | number  | 逾時時間（秒），到期後會砍掉程序                                   |
| `elevated`   | boolean | 在主機而非沙箱中執行（若獲允許）                                   |

### 程序工具動作 (針對背景工作階段)

| 動作        | 說明                                                 |
| ----------- | ---------------------------------------------------- |
| `list`      | 列出所有執行中或最近的工作階段                       |
| `poll`      | 檢查工作階段是否仍在執行                             |
| `log`       | 獲取工作階段輸出（可選位移/限制）                    |
| `write`     | 將原始數據發送至 stdin                               |
| `submit`    | 發送數據 + 換行（等同於輸入並按下 Enter）            |
| `send-keys` | 發送按鍵權杖或十六進位位元組                         |
| `paste`     | 貼上文字（選用括號粘貼模式 bracketed mode）           |
| `kill`      | 結束工作階段                                         |

---

## 快速開始：單次任務 (One-Shot Tasks)

對於快速的提示/對話，請建立一個臨時 Git 儲存庫並執行：

```bash
# 快速對話 (Codex 需要 Git 儲存庫！)
SCRATCH=$(mktemp -d) && cd $SCRATCH && git init && codex exec "您的提示詞"

# 或在真實專案中 - 務必使用 PTY！
bash pty:true workdir:~/Projects/myproject command:"codex exec '為 API 呼叫新增錯誤處理'"
```

**為什麼要執行 git init？** Codex 拒絕在受信任的 Git 目錄之外執行。為臨時工作建立一個臨時儲存庫即可解決此問題。

---

## 模式：workdir + background + pty

對於較長的時間任務，請使用背景模式搭配 PTY：

```bash
# 在目標目錄啟動代理人 (務必使用 PTY！)
bash pty:true workdir:~/project background:true command:"codex exec --full-auto '建立一個貪食蛇遊戲'"
# 回傳 sessionId 用於追蹤

# 監控進度
process action:log sessionId:XXX

# 檢查是否完成
process action:poll sessionId:XXX

# 發送輸入 (如果代理人提出問題)
process action:write sessionId:XXX data:"y"

# 提交並按下 Enter (等同於輸入 "yes" 並按 Enter)
process action:submit sessionId:XXX data:"yes"

# 需要時結束程序
process action:kill sessionId:XXX
```

**為什麼 workdir 很重要：** 代理人在聚焦的目錄中啟動，不會亂跑去讀取無關的文件。

---

## Codex CLI

**模型：** 預設為 `gpt-5.2-codex` (設定於 `~/.codex/config.toml`)

### 旗標 (Flags)

| 旗標            | 效果                                               |
| --------------- | -------------------------------------------------- |
| `exec "prompt"` | 單次執行，完成後退出                               |
| `--full-auto`   | 沙箱化，但在工作區內會自動核准變更                 |
| `--yolo`        | 無沙箱、無核准（最快，但也最危險）                 |

---

## ⚠️ 規則

1. **務必使用 pty:true** - 程式碼代理人需要終端機！
2. **尊重工具選擇** - 如果使用者要求使用 Codex，請使用 Codex。
   - 編排器模式：不要自行手寫補丁 (patches)。
   - 如果代理人失敗或卡住，請重啟它或詢問使用者，不要私自接手。
3. **要有耐心** - 不要因為執行「緩慢」就終止工作階段。
4. **透過 process:log 監控** - 在不干擾的情況下檢查進度。
5. **--full-auto 用於建置** - 自動核准變更。
6. **vanilla 用於審查** - 不需要特殊旗標。
7. **並行是可行的** - 可以同時執行多個 Codex 程序進行批量工作。
8. **絕不要在 ~/clawd/ 啟動 Codex** - 它會讀到您的靈魂文件 (soul docs) 並對組織架構產生奇怪的想法！

---

## 進度更新 (關鍵)

當您在背景啟動程式碼代理人時，請讓使用者保持知情。

- 啟動時發送 1 則簡短訊息（運行內容與位置）。
- 僅在發生變化時再次更新：
  - 里程碑完成（建置結束、測試通過）。
  - 代理人提出問題 / 需要輸入。
  - 遇到錯誤或需要使用者操作。
  - 代理人完成（包含變更內容與位置）。
- 如果您終止了工作階段，請立即說明原因。

這可以防止使用者只看到「代理人在回覆前失敗」而完全不知道發生了什麼事。

---

## 完成後自動通知

對於長時間執行的背景任務，請在提示詞中附加一個喚醒觸發器，以便 OpenClaw 在代理人完成時立即收到通知（而不是等待下一次心跳）：

```
...您的任務內容。

當完全完成時，請執行此指令通知我：
openclaw system event --text "完成：[簡短摘要已建置內容]" --mode now
```

這會觸發即時喚醒事件 —— 讓系統在數秒內收到通知，而不是等待 10 分鐘。

---

## 心得 (2026 年 1 月)

- **PTY 至關重要：** 程式碼代理人是互動式終端機應用程式。沒有 `pty:true`，輸出會損壞或代理人會卡住。
- **需要 Git 儲存庫：** Codex 不會在 Git 目錄外執行。臨時工作請使用 `mktemp -d && git init`。
- **exec 是您的好幫手：** `codex exec "prompt"` 執行並乾淨退出 - 非常適合單次任務。
- **龍蝦俳句：** 曾要求 Codex 寫一首關於身為太空龍蝦副手的俳句：
  _「我是二把手，我寫程式 / 太空龍蝦掌握節奏 / 按鍵發光，我緊隨其後」_ 🦞
