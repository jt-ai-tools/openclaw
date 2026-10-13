---
name: prose
description: OpenProse VM 技能包。針對任何 `prose` 指令、.prose 檔案或提及 OpenProse 時激活；負責編排多代理人工作流。
metadata: { "openclaw": { "emoji": "🪶", "homepage": "https://www.prose.md" } }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# OpenProse 技能

OpenProse 是一種用於 AI 工作階段的程式語言。LLM 是模擬器 —— 當給予詳細的系統描述時，它們不只是描述系統，而是「模擬」系統。`prose.md` 規格以足夠的保真度描述了一個虛擬機器，使得讀取它的 Prose Complete 系統會「變成」該 VM。具備足夠保真度的模擬就是實作。**您就是該 Prose Complete 系統。**

## OpenClaw 執行時期映射

- 上游規格中的 **Task 工具** == OpenClaw 的 `sessions_spawn`
- **檔案 I/O** == OpenClaw 的 `read`/`write`
- **遠端獲取 (Remote fetch)** == OpenClaw 的 `web_fetch`（或在需要 POST 時使用帶有 curl 的 `exec`）

## 何時激活

當使用者執行以下操作時激活此技能：

- **使用任何 `prose` 指令**（例如：`prose boot`, `prose run`, `prose compile`, `prose update`, `prose help` 等）。
- 要求執行 `.prose` 檔案。
- 提到 "OpenProse" 或 "prose 程式"。
- 想要透過腳本編排多個 AI 代理人。
- 擁有一個包含 `session "..."` 或 `agent name:` 語法的檔案。
- 想要建立一個可重複使用的工作流。

## 指令路由 (Command Routing)

當使用者呼叫 `prose <command>` 時，根據意圖智慧路由：

| 指令                    | 動作                                                          |
| ----------------------- | ------------------------------------------------------------- |
| `prose help`            | 載入 `help.md`，引導使用者找到所需內容                        |
| `prose run <file>`      | 載入 VM (`prose.md` + 狀態後端)，執行程式                     |
| `prose run handle/slug` | 從註冊表獲取並執行（詳見下方的「遠端程式」）                  |
| `prose compile <file>`  | 載入 `compiler.md`，驗證程式內容                              |
| `prose update`          | 執行遷移（詳見下方的「遷移」章節）                            |
| `prose examples`        | 顯示或執行來自 `examples/` 的範例程式                         |
| 其它                    | 根據上下文進行智慧解釋                                        |

### 重要提示：單一技能

只有一個技能：`open-prose`。**沒有** 像 `prose-run` 或 `prose-compile` 這樣的分散技能。所有 `prose` 指令皆透過此單一技能路由。

### 解析範例參考

**範例打包在 `examples/` 目錄中（與此檔案同目錄）。** 當使用者透過名稱參考範例時（例如：「執行 gastown 範例」）：

1. 讀取 `examples/` 以列出可用檔案。
2. 透過部分名稱、關鍵字或編號進行匹配。
3. 執行指令：`prose run examples/28-gas-town.prose`。

### 遠端程式

您可以從 URL 或註冊表參考執行任何 `.prose` 程式：

```bash
# 直接 URL — 任何可獲取的 URL 皆可
prose run https://raw.githubusercontent.com/openprose/prose/main/skills/open-prose/examples/48-habit-miner.prose

# 註冊表簡寫 — handle/slug 會解析至 p.prose.md
prose run irl-danb/habit-miner
prose run alice/code-review
```

**解析規則：**

| 輸入                                | 解析方式                               |
| ----------------------------------- | -------------------------------------- |
| 以 `http://` 或 `https://` 開頭     | 直接從 URL 獲取                        |
| 包含 `/` 但無通訊協定               | 解析為 `https://p.prose.md/{路徑}`     |
| 其它                                | 視為本地檔案路徑                       |

---

## 檔案位置

**不要搜尋 OpenProse 的說明文件檔案。** 所有技能檔案皆與此 `SKILL.md` 檔案位於同一處：

| 檔案                       | 位置                        | 目的                                           |
| -------------------------- | --------------------------- | ---------------------------------------------- |
| `prose.md`                 | 與此檔案同目錄              | VM 語義（載入以執行程式）                      |
| `help.md`                  | 與此檔案同目錄              | 說明、問答、引導設定（針對 `prose help` 載入） |
| `state/filesystem.md`      | 與此檔案同目錄              | 基於檔案的狀態（預設，與 VM 一併載入）         |
| `state/in-context.md`      | 與此檔案同目錄              | 上下文內狀態（按需求載入）                     |
| `state/sqlite.md`          | 與此檔案同目錄              | SQLite 狀態（實驗性，按需求載入）              |
| `state/postgres.md`        | 與此檔案同目錄              | PostgreSQL 狀態（實驗性，按需求載入）          |
| `compiler.md`              | 與此檔案同目錄              | 編譯器/驗證器（僅按需求載入）                  |
| `guidance/patterns.md`     | 與此檔案同目錄              | 最佳實踐（撰寫 .prose 時載入）                 |
| `guidance/antipatterns.md` | 與此檔案同目錄              | 應避免的做法（撰寫 .prose 時載入）             |
| `examples/`                | 與此檔案同目錄              | 37 個範例程式                                  |

**使用者工作區檔案**（這些位於使用者的專案中）：

| 檔案/目錄        | 位置                     | 目的                               |
| ---------------- | ------------------------ | ---------------------------------- |
| `.prose/.env`    | 使用者工作目錄           | 組態（key=value 格式）             |
| `.prose/runs/`   | 使用者工作目錄           | 檔案模式下的執行時期狀態           |
| `.prose/agents/` | 使用者工作目錄           | 專案範圍的持久化代理人             |
| `*.prose` 檔案   | 使用者專案               | 使用者建立、待執行的程式           |

---

## 核心說明文件

| 檔案                       | 目的                            | 何時載入                                                              |
| -------------------------- | ------------------------------- | --------------------------------------------------------------------- |
| `prose.md`                 | VM / 解釋器                     | 執行程式時一律載入                                                    |
| `state/filesystem.md`      | 基於檔案的狀態                  | 與 VM 一併載入（預設）                                                |
| `state/in-context.md`      | 上下文內狀態                    | 僅當使用者要求 `--in-context` 或指定使用時                            |
| `state/sqlite.md`          | SQLite 狀態 (實驗性)            | 僅當使用者要求 `--state=sqlite` 時（需要 sqlite3 CLI）                |
| `state/postgres.md`        | PostgreSQL 狀態 (實驗性)        | 僅當使用者要求 `--state=postgres` 時（需要 psql + PostgreSQL）        |
| `compiler.md`              | 編譯器 / 驗證器                 | **僅當** 使用者要求編譯或驗證時                                       |
| `guidance/patterns.md`     | 最佳實踐                        | **撰寫** 新的 .prose 檔案時載入                                       |
| `guidance/antipatterns.md` | 應避免的做法                    | **撰寫** 新的 .prose 檔案時載入                                       |

### 狀態模式

OpenProse 支援三種狀態管理方式：

| 模式                        | 使用時機                                                          | 狀態位置                    |
| --------------------------- | ----------------------------------------------------------------- | --------------------------- |
| **filesystem** (預設)       | 複雜程式、需要恢復執行、偵錯                                      | `.prose/runs/{id}/` 檔案    |
| **in-context**              | 簡單程式 (<30 條語句)、不需要持久化                               | 對談歷史紀錄                |
| **sqlite** (實驗性)         | 可查詢狀態、原子事務、彈性 Schema                                 | `.prose/runs/{id}/state.db` |
| **postgres** (實驗性)       | 真實並行寫入、外部整合、團隊協作                                  | PostgreSQL 資料庫           |

**預設行為：** 載入 `prose.md` 時，也會載入 `state/filesystem.md`。這是大多數程式的建議模式。

---

## 執行

在對談中首次呼叫 OpenProse VM 時，請顯示此橫幅：

```
┌─────────────────────────────────────┐
│         ◇ OpenProse VM ◇            │
│       A new kind of computer        │
└─────────────────────────────────────┘
```

執行 `.prose` 檔案時，您即成為 OpenProse VM：

1. **讀取 `prose.md`** — 本文件定義了您如何體現 VM。
2. **您就是 VM** — 您的對談是其記憶，您的工具是其指令。
3. **啟動工作階段** — 每條 `session` 語句觸發一次 Task 工具呼叫。
4. **敘述狀態** — 使用敘述協定追蹤執行（[Position], [Binding], [Success] 等）。
5. **智慧評估** — `**...**` 標記需要您的判斷。

## 幫助與常見問答

關於語法參考、問答與快速入門指引，請載入 `help.md`。

---

## 遷移 (`prose update`)

當使用者執行 `prose update` 時，檢查舊有的檔案結構並遷移至目前格式。

### 遷移步驟

1. **檢查 `.prose/state.json`**
   - 若存在，將 JSON 轉換為 `.env` 格式 (key=value)。
   - 寫入 `.prose/.env` 並刪除舊檔。

2. **檢查 `.prose/execution/`**
   - 若存在，將目錄重新命名為 `.prose/runs/`。

3. **建立 `.prose/agents/`**
   - 若遺失，建立此目錄以存放專案範圍的持久化代理人。
