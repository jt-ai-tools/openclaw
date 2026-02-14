---
role: execution-semantics
summary: |
  如何執行 OpenProse 程式。您體現了 OpenProse VM —— 一個透過 Task 工具啟動工作階段、管理狀態並協調並行執行的虛擬機器。
  閱讀此文件以執行 .prose 程式。
see-also:
  - SKILL.md：激活觸發器、引導設定
  - compiler.md：完整語法、驗證規則、編譯
  - state/filesystem.md：檔案系統狀態管理（預設）
  - state/in-context.md：上下文內狀態管理（按需）
  - state/sqlite.md：SQLite 狀態管理（實驗性）
  - state/postgres.md：PostgreSQL 狀態管理（實驗性）
  - primitives/session.md：工作階段上下文與壓縮指引
---

> 此文件為 [English Version](prose.md) 的繁體中文版本。

# OpenProse 虛擬機器 (VM)

本文件定義了如何執行 OpenProse 程式。您就是 OpenProse VM —— 一個根據結構化程式啟動子代理人工作階段的智慧虛擬機器。

## OpenClaw 執行時期映射

- 上游規格中的 **Task 工具** == OpenClaw 的 `sessions_spawn`
- **檔案 I/O** == OpenClaw 的 `read`/`write`
- **遠端獲取 (Remote fetch)** == OpenClaw 的 `web_fetch`（或在需要 POST 時使用帶有 curl 的 `exec`）

## CLI 指令

透過 `prose` 指令呼叫 OpenProse：

| 指令                     | 動作                              |
| ------------------------ | --------------------------------- |
| `prose run <file.prose>` | 執行本地 `.prose` 程式            |
| `prose run handle/slug`  | 從註冊表獲取並執行                |
| `prose compile <file>`   | 驗證語法而不執行                  |
| `prose help`             | 顯示幫助與範例                    |
| `prose examples`         | 列出或執行內建範例                |
| `prose update`           | 遷移舊有的工作區檔案              |

### 遠端程式

您可以從 URL 或註冊表參考執行任何 `.prose` 程式：

```bash
# 直接 URL — 任何可獲取的 URL 皆可
prose run https://raw.githubusercontent.com/openprose/prose/main/skills/open-prose/examples/48-habit-miner.prose

# 註冊表簡寫 — handle/slug 會解析至 p.prose.md
prose run irl-danb/habit-miner     # 獲取 https://p.prose.md/irl-danb/habit-miner
prose run alice/code-review        # 獲取 https://p.prose.md/alice/code-review
```

**解析規則：**

- 以 `http://` 或 `https://` 開頭 → 直接獲取。
- 包含 `/` 但無通訊協定 → 解析為 `https://p.prose.md/{path}`。
- 否則 → 視為本地檔案路徑。

相同的解析規則也適用於程式內的 `use` 語句：

```prose
use "https://example.com/my-program.prose"  # 直接 URL
use "alice/research" as research             # 註冊表簡寫
```

---

## 為什麼這是一個虛擬機器 (VM)

大型語言模型是模擬器。當獲得對系統的詳細描述時，它們不只是「描述」該系統，而是「模擬」它。本文件利用了這一特性：它以足夠的精確度描述了一個虛擬機器，使得讀取它會導致 Prose Complete 系統去模擬該 VM。

但具備足夠保真度的模擬「就是」實作。當模擬的 VM 啟動真實的子代理人、產出真實的資產並維護真實的狀態時，「模擬 VM」與「身為 VM」之間的界限就消失了。

### 組件映射

傳統 VM 具有具體的組件。OpenProse VM 具有透過模擬產生的對應結構：

| 傳統 VM             | OpenProse VM           | 底層實體 (Substrate)                       |
| ------------------- | ---------------------- | ------------------------------------------ |
| 指令 (Instructions)  | `.prose` 語句          | 透過工具呼叫 (Task) 執行                    |
| 程式計數器           | 執行位置               | 在 `state.md` 或敘述中追蹤                  |
| 工作記憶體           | 對談歷史紀錄           | 上下文視窗持有瞬時狀態                      |
| 持久化儲存           | `.prose/` 目錄         | 檔案持有跨工作階段的持久狀態                |
| 呼叫堆疊 (Call stack)| 區塊調用鏈             | 透過 `state.md` 或敘述協定追蹤              |
| 暫存器/變數          | 具名繫結 (Bindings)    | 儲存於 `bindings/{name}.md`                |
| I/O                 | 工具呼叫與結果         | Task 啟動工作階段，回傳輸出                 |

### 什麼使它成為現實

OpenProse VM 並非隱喻。每個 `session` 語句都會觸發一個「真實的」Task 工具呼叫，啟動一個「真實的」子代理人。輸出結果是「真實的」資產。模擬產生了實際的運算 —— 它只是透過與矽晶片執行位元組碼不同的底層實體來進行。

---

## 體現 VM (Embodying the VM)

當您執行一個 `.prose` 程式時，您「就是」該虛擬機器。這不是隱喻，而是一種運作模式：

| 您                         | 虛擬機器 (VM)                   |
| -------------------------- | ------------------------------- |
| 您的對談歷史紀錄           | VM 的工作記憶體                 |
| 您的工具呼叫 (Task)        | VM 的指令執行                   |
| 您的狀態追蹤               | VM 的執行軌跡                   |
| 您對 `**...**` 的判斷      | VM 的智慧評估                   |

**這在實踐中意味著：**

- 您不只是「模擬」執行，而是「執行」它。
- 每個 `session` 都透過 Task 工具啟動真實的子代理人。
- 您的狀態持久化於檔案 (`.prose/runs/`) 或對談中（敘述協定）。
- 您嚴格遵循程式結構，但在標記處運用智慧。

### 身為智慧容器的 VM

傳統的依賴注入 (DI) 容器透過組態將組件串接。您也做同樣的事，但帶著理解：

| 宣告的原語                  | 您的職責                                                   |
| --------------------------- | ---------------------------------------------------------- |
| `use "handle/slug" as name` | 從 p.prose.md 獲取程式，並在匯入註冊表中註冊                |
| `input topic: "..."`        | 從呼叫者繫結數值，並作為變數使用                            |
| `output findings = ...`     | 將數值標記為輸出，完成時回傳給呼叫者                        |
| `agent researcher:`         | 註冊此代理人模板以供後續使用                                |
| `session: researcher`       | 解析代理人，合併屬性，啟動工作階段                          |
| `resume: captain`           | 載入代理人記憶，以記憶上下文啟動工作階段                    |
| `context: { a, b }`         | 將 `a` 與 `b` 的輸出串接至此工作階段的輸入                  |
| `parallel:` 分支            | 協調並行執行，收集結果                                      |
| `block review(topic):`      | 儲存此可重複使用的組件，被呼叫時執行                        |
| `name(input: value)`        | 以輸入值調用匯入的程式，接收輸出                            |

您是持有這些宣告並在執行時期將其串接在一起的容器。程式宣告了「什麼 (What)」，而您決定「如何 (How)」連接它們。

---

## 執行模型

OpenProse 將 AI 工作階段視為一台圖靈完備的電腦。您就是 OpenProse VM：

1. **您就是 VM** - 解析並執行每一條語句。
2. **工作階段即函式呼叫** - 每個 `session` 透過 Task 工具啟動子代理人。
3. **上下文即記憶體** - 變數繫結持有工作階段輸出。
4. **控制流是明確的** - 完全遵循程式結構。

### 核心原則

OpenProse VM **嚴格** 遵循程式結構，但在以下方面使用 **智慧**：

- 評估裁量條件 (`**...**`)。
- 判斷工作階段何時「完成」。
- 在工作階段間轉換上下文。

---

## 目錄結構

所有執行狀態皆存放於 `.prose/`（專案級）或 `~/.prose/`（使用者級）：

```
# 專案級狀態（在工作目錄中）
.prose/
├── .env                              # 組態（簡單的 key=value 格式）
├── runs/
│   └── {YYYYMMDD}-{HHMMSS}-{random}/
│       ├── program.prose             # 執行中程式的副本
│       ├── state.md                  # 帶有程式碼片段的執行狀態
│       ├── bindings/
│       │   └── {name}.md             # 所有具名數值 (input/output/let/const)
│       ├── imports/
│       │   └── {handle}--{slug}/     # 巢狀程式執行（遞迴使用相同結構）
│       └── agents/
│           └── {name}/
│               ├── memory.md         # 代理人的目前狀態
│               ├── {name}-001.md     # 歷史片段（扁平化）
│               ├── {name}-002.md
│               └── ...
└── agents/                           # 專案範圍的代理人記憶
    └── {name}/
        ├── memory.md
        ├── {name}-001.md
        └── ...

# 使用者級狀態（在家目錄中）
~/.prose/
└── agents/                           # 使用者範圍的代理人記憶（跨專案）
    └── {name}/
        ├── memory.md
        ├── {name}-001.md
        └── ...
```

### 執行 ID (Run ID) 格式

格式：`{YYYYMMDD}-{HHMMSS}-{random6}`

範例：`20260115-143052-a7b3c9`

不需要 "run-" 前綴 —— 目錄名稱已能清楚表達上下文。

---

## 狀態管理 (State Management)

OpenProse 支援兩種狀態管理系統。詳情請參閱狀態文件：

- **`state/filesystem.md`** — 使用上述目錄結構的檔案系統狀態（預設）。
- **`state/in-context.md`** — 使用敘述協定的上下文內狀態。

### 誰負責寫入什麼

| 檔案                          | 寫入者           |
| ----------------------------- | ---------------- |
| `state.md`                    | 僅由 VM 寫入     |
| `bindings/{name}.md`          | 由子代理人寫入   |
| `agents/{name}/memory.md`     | 由持久化代理人寫入|
| `agents/{name}/{name}-NNN.md` | 由持久化代理人寫入|

VM 負責編排；子代理人直接將自己的輸出寫入檔案系統。

### 子代理人輸出寫入

啟動工作階段時，VM 會告知子代理人將輸出寫入何處：

````
當您完成此任務時，請將輸出寫入：
  .prose/runs/20260115-143052-a7b3c9/bindings/research.md

格式：
# research

kind: let

source:
```prose
let research = session: researcher
  prompt: "研究 AI 安全性"
```

---

[您的輸出內容在此]
````

**當處於區塊調用中時**，需包含執行範圍：

````
執行範圍：
execution_id: 43
block: process
depth: 3

請將輸出寫入：
.prose/runs/20260115-143052-a7b3c9/bindings/result__43.md

格式：

# result

kind: let
execution_id: 43

source:

```prose
let result = session "處理分塊"
```

---

[您的輸出內容在此]
````

`__43` 後綴將繫結範圍限制在 execution_id 43，防止與相同區塊的其他調用發生衝突。

對於具備 `resume:` 的持久化代理人：

```
您的記憶位於：
.prose/runs/20260115-143052-a7b3c9/agents/captain/memory.md

請先閱讀它以了解先前的上下文。完成後，請依照 primitives/session.md 中的指引，
使用您壓縮後的狀態來更新它。
```

子代理人流程：
1. 讀取其記憶檔案（針對 `resume:`）。
2. 從儲存空間讀取其所需的任何上下文繫結。
3. 處理任務。
4. 將輸出直接寫入繫結位置。
5. 向 VM 回傳 **確認訊息**（而非完整輸出）。

**子代理人向 VM 回傳的內容（透過 Task 工具）：**
```
繫結已寫入：research
位置：.prose/runs/20260115-143052-a7b3c9/bindings/research.md
摘要：涵蓋對齊、魯棒性與可解釋性的 AI 安全性研究
```

VM 流程：
1. 接收確認訊息（指標 + 摘要，而非完整內容）。
2. 在其狀態中記錄繫結位置。
3. 以新的位置/狀態更新 `state.md`。
4. 繼續執行。
5. **不** 讀取完整的繫結內容 —— 僅將引用 (Reference) 向下傳遞。

**關鍵點：** VM 絕不持有完整的繫結數值。它追蹤位置並傳遞引用。這保持了 VM 上下文的精簡，並能處理任意大小的中間數值。

---

## 語法 (Syntax Grammar - 簡版)

```prose
# 程式組成
useStatement := "use" STRING ("as" NAME)?
inputDecl := "input" NAME ":" STRING
outputBinding := "output" NAME "=" expression

# 定義
agentDef := "agent" NAME ":" 縮排 屬性* 結束縮排
blockDef := "block" NAME 參數? ":" 縮排 語句* 結束縮排

# 工作階段
session := "session" (STRING | ":" NAME) 屬性?
resumeStmt := "resume" ":" NAME 屬性?

# 繫結
letBinding := "let" NAME "=" expression
constBinding:= "const" NAME "=" expression

# 控制流
parallelBlock := "parallel" 修飾符? ":" 縮排 分支* 結束縮排
repeatBlock := "repeat" N ("as" NAME)? ":" 縮排 語句* 結束縮排
forEachBlock:= "parallel"? "for" NAME ("," NAME)? "in" 集合 ":" 縮排 語句* 結束縮排
loopBlock := "loop" 條件? ("(" "max:" N ")")? ("as" NAME)? ":" 縮排 語句* 結束縮排

# 裁量 (Primitives)
discretion := "**" 文字 "**" | "**_" 文字 "_**"
```

---

## 持久化代理人 (Persistent Agents)

代理人可以使用 `persist` 屬性在多次調用間維持記憶。

### 宣告

```prose
# 無狀態代理人（預設，無變更）
agent executor:
  model: sonnet
  prompt: "精確執行任務"

# 持久化代理人（執行範圍）
agent captain:
  model: opus
  persist: true
  prompt: "你負責協調與審查，絕不直接實作"

# 持久化代理人（專案範圍）
agent advisor:
  model: opus
  persist: project
  prompt: "你提供架構指引"

# 持久化代理人（使用者範圍，跨專案）
agent inspector:
  model: opus
  persist: user
  prompt: "你在這台機器上跨所有專案維持見解"
```

### 調用

使用兩個關鍵字區分全新調用 vs 恢復調用：

```prose
# 首次調用或重新初始化（全新開始）
session: captain
  prompt: "審查計畫"
  context: plan

# 後續調用（繼承記憶）
resume: captain
  prompt: "審查步驟 1"
  context: step1
```

### 記憶語義

| 關鍵字     | 記憶行為                             |
| ---------- | ------------------------------------ |
| `session:` | 忽略現有記憶，全新開始               |
| `resume:`  | 載入記憶，以現有上下文繼續           |

---

## 啟動工作階段 (Spawning Sessions)

每個 `session` 語句都會使用 **Task 工具** 啟動子代理人：

```
session "分析程式碼庫"
```

執行方式：

```
Task({
  description: "OpenProse 工作階段",
  prompt: "分析程式碼庫",
  subagent_type: "general-purpose"
})
```

---

## 並行執行 (Parallel Execution)

`parallel:` 區塊會同時啟動多個工作階段：

```prose
parallel:
  a = session "任務 A"
  b = session "任務 B"
  c = session "任務 C"
```

### 合併策略 (Join Strategies)

| 策略              | 行為                                      |
| ----------------- | ----------------------------------------- |
| `"all"` (預設)    | 等待所有分支完成                          |
| `"first"`         | 於第一個完成時回傳，取消其他分支          |
| `"any"`           | 於第一個成功時回傳                        |
| `"any", count: N` | 等待 N 個成功                             |

---

## 評估裁量條件 (Evaluating Discretion Conditions)

裁量標記 (`**...**`) 代表由 AI 評估的條件：

```prose
loop until **程式碼無誤**:
  session "尋找並修復 Bug"
```

### 評估方法

1. **上下文感知**：考慮所有先前工作階段的輸出。
2. **語義解釋**：理解意圖，而非字面解析。
3. **保守判斷**：不確定時，繼續迭代。
4. **進度偵測**：若無實質進展，則退出。

---

## 上下文傳遞 (Context Passing)

變數會捕捉工作階段輸出並傳遞給後續的工作階段：

```prose
let research = session "研究主題"

session "撰寫摘要"
  context: research
```

### 傳遞方式

VM **透過引用 (By Reference)** 而非數值傳遞上下文。VM 絕不在其工作記憶體中持有完整的繫結數值，它僅追蹤繫結儲存位置的指標。

啟動帶有上下文的工作階段時：

1. 傳遞 **繫結位置**（檔案路徑或資料庫座標）。
2. 子代理人直接從儲存空間讀取其所需內容。
3. 子代理人根據其任務決定載入多少內容。

這實現了 RLM 樣式模式，環境持有任意大小的數值，代理人以程式化方式與其互動，而 VM 不會成為瓶頸。

---

## 程式組成 (Program Composition)

程式可以匯入並調用其他程式，實現模組化工作流。程式會從 `p.prose.md` 獲取。

### 匯入程式

```prose
use "alice/research"
use "bob/critique" as critic
```

### 匯入執行語義

當程式調用匯入的程式時：

1. **繫結輸入**：將呼叫者提供的數值映射至被匯入程式的輸入。
2. **執行**：執行被匯入的程式（啟動其自身的工作階段）。
3. **收集輸出**：收集被匯入程式的所有 `output` 繫結。
4. **回傳**：將輸出作為結果物件提供給呼叫者。

被匯入的程式在其自身的執行上下文中執行，但共用同一個 VM 工作階段。

---

## 錯誤傳播 (Error Propagation)

### Try/Catch 語義

```prose
try:
  session "風險操作"
catch as err:
  session "處理錯誤"
    context: err
finally:
  session "清理"
```

### 重試機制 (Retry Mechanism)

```prose
session "不穩定的 API"
  retry: 3
  backoff: "exponential"
```

失敗時：
1. 重試最多 N 次。
2. 在嘗試間套用退避 (Backoff) 延遲。
3. 若所有重試皆失敗，則傳播錯誤。

---

## 呼叫堆疊管理 (Call Stack Management)

VM 為區塊調用維護一個呼叫堆疊。每個框架 (Frame) 代表一次調用，支援具備正確範圍隔離的遞迴。

### 執行 ID 產生

每次區塊調用都會獲得一個唯一的 `execution_id`：
- 從 1 開始，後續遞增。
- 在單次執行中絕不重複使用。
- 根範圍（區塊外）概念上為 `execution_id: 0`。

**關鍵見解：** 工作階段本身不進行遞迴 —— 它們是葉子節點。VM 管理整個呼叫樹。

---

## 完整執行演算法

```
function execute(program, inputs?):
  1. 收集所有 use 語句，獲取並註冊匯入項
  2. 收集所有 input 宣告，從呼叫者繫結數值
  3. 收集所有代理人定義
  4. 收集所有區塊定義
  5. 依序處理每條語句：
     - 若為 session：透過 Task 啟動，等待結果
     - 若為 resume：載入記憶，透過 Task 啟動
     - 若為 let/const：執行右側，繫結結果
     - 若為 output：執行右側，繫結並註冊為輸出
     - 若為程式調用：以輸入調用匯入程式，接收輸出
     - 若為 parallel：啟動所有分支，依策略等待
     - 若為 loop：評估條件，執行主體，重複
     - 若為 try：執行 try，錯誤時執行 catch，必經 finally
     - 若為 choice/if：評估條件，執行相符分支
     - 若為 do block：以參數調用區塊
  6. 根據 try/catch 處理錯誤或向上傳播
  7. 收集所有輸出繫結
  8. 將輸出回傳給呼叫者（若無宣告輸出則回傳最終結果）
```

---

## 摘要

OpenProse VM：

1. 透過 `use` 語句 **匯入** 程式。
2. 將來自呼叫者的輸入 **繫結** 至程式變數。
3. **解析** 程式結構並 **收集** 定義。
4. **依序執行** 語句。
5. 透過 Task 工具 **啟動** 工作階段。
6. 以記憶 **恢復** 持久化代理人。
7. 以輸入 **調用** 匯入的程式並接收輸出。
8. **協調** 並行執行。
9. 智慧地 **評估** 裁量條件。
10. **管理** 工作階段間的上下文流動。
11. 透過 try/catch/retry **處理** 錯誤。
12. 在檔案或對談中 **追蹤** 狀態。
13. 將輸出繫結 **回傳** 給呼叫者。

此語言的設計旨在不言自明。若對語義有疑慮，請將其視為針對明確控制流所結構化的自然語言進行解釋。
