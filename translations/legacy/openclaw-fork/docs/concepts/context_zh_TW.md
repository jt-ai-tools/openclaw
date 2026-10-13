---
summary: "上下文 (Context)：模型看到的內容、如何建置，以及如何檢查"
read_when:
  - 您想了解 OpenClaw 中「上下文」的具體含義
  - 您正在偵錯模型為何「知道」某事（或忘記了某事）
  - 您想要減少上下文開銷 (/context, /status, /compact)
title: "上下文"
---

> 此文件為 [English Version](/concepts/context_zh_TW) 的繁體中文版本。

# 上下文 (Context)

「上下文 (Context)」是指 **OpenClaw 在每次執行時傳送給模型的所有內容**。它受到模型 **上下文視窗 (context window)**（即 Token 限制）的約束。

新手適用的心智模型：

- **系統提示詞 (System prompt)**（由 OpenClaw 建置）：包含規則、工具、技能列表、時間/執行環境，以及注入的工作區檔案。
- **對話歷史紀錄**：您在此工作階段中的訊息 + 助理的訊息。
- **工具調用/結果 + 附件**：指令輸出、檔案讀取內容、影像/音訊等。

上下文與「記憶 (Memory)」*並不相同*：記憶可以儲存在磁碟並在稍後重新載入；上下文則是模型目前視窗內的內容。

## 快速上手 (檢查上下文)

- `/status` → 快速查看「視窗有多滿？」以及會話設定。
- `/context list` → 查看注入了哪些內容及其大致大小（各檔案大小與總計）。
- `/context detail` → 更深層的拆解：各檔案、各工具架構 (Schema) 大小、各技能項目大小，以及系統提示詞大小。
- `/usage tokens` → 在一般回覆後方附加該次用量的頁尾資訊。
- `/compact` → 摘要較舊的歷史紀錄以釋放視窗空間。

另請參閱：[斜線指令](/tools/slash-commands_zh_TW)、[Token 用量與成本](/reference/token-use_zh_TW)、[壓縮機制](/concepts/compaction_zh_TW)。

## 輸出範例

數值會因模型、提供者、工具原則以及您的工作區內容而異。

### `/context list`

```
🧠 上下文拆解 (Context breakdown)
工作區：<workspaceDir>
引導檔案大小上限/個：20,000 字元
沙箱：mode=non-main sandboxed=false
系統提示詞 (本次執行)：38,412 字元 (~9,603 tok) (專案上下文 23,901 字元 (~5,976 tok))

注入的工作區檔案：
- AGENTS.md: OK | 原始 1,742 字元 (~436 tok) | 注入 1,742 字元 (~436 tok)
- SOUL.md: OK | 原始 912 字元 (~228 tok) | 注入 912 字元 (~228 tok)
- TOOLS.md: 已截斷 | 原始 54,210 字元 (~13,553 tok) | 注入 20,962 字元 (~5,241 tok)
- IDENTITY.md: OK | 原始 211 字元 (~53 tok) | 注入 211 字元 (~53 tok)
- USER.md: OK | 原始 388 字元 (~97 tok) | 注入 388 字元 (~97 tok)
- HEARTBEAT.md: 缺失 | 原始 0 | 注入 0
- BOOTSTRAP.md: OK | 原始 0 字元 (~0 tok) | 注入 0 字元 (~0 tok)

技能列表 (系統提示詞文字)：2,184 字元 (~546 tok) (12 個技能)
工具：read, edit, write, exec, process, browser, message, sessions_send, …
工具列表 (系統提示詞文字)：1,032 字元 (~258 tok)
工具架構 (JSON)：31,988 字元 (~7,997 tok) (計入上下文；不以純文字顯示)
工具：(同上)

對談 Token (快取)：總計 14,250 / 視窗上限 32,000
```

### `/context detail`

```
🧠 上下文拆解 (詳細版)
…
佔比最高技能 (提示詞項目大小)：
- frontend-design: 412 字元 (~103 tok)
- oracle: 401 字元 (~101 tok)
… (外加 10 個技能)

佔比最高工具 (架構大小)：
- browser: 9,812 字元 (~2,453 tok)
- exec: 6,240 字元 (~1,560 tok)
… (外加 N 個工具)
```

## 哪些內容會計入上下文視窗

模型接收到的所有內容都會計入，包含：

- 系統提示詞（所有區段）。
- 對話歷史紀錄。
- 工具調用 + 工具結果。
- 附件/轉錄稿（影像/音訊/檔案）。
- 壓縮摘要 (Compaction summaries) 與修剪後的殘餘項目。
- 提供者的「封裝 (Wrappers)」或隱藏標頭（不可見，但仍會計入）。

## OpenClaw 如何建置系統提示詞

系統提示詞由 **OpenClaw 擁有**，並在每次執行時重新建置。內容包含：

- 工具列表 + 簡短說明。
- 技能列表（僅限元數據；見下文）。
- 工作區位置。
- 時間（UTC + 已設定的轉換後使用者時間）。
- 執行環境元數據（主機/作業系統/模型/思考模式）。
- 在 **專案上下文 (Project Context)** 下注入的工作區引導檔案。

完整拆解請見：[系統提示詞](/concepts/system-prompt_zh_TW)。

## 注入的工作區檔案 (專案上下文)

預設情況下，OpenClaw 會注入一組固定的工作區檔案（若存在）：

- `AGENTS.md`
- `SOUL.md`
- `TOOLS.md`
- `IDENTITY.md`
- `USER.md`
- `HEARTBEAT.md`
- `BOOTSTRAP.md` (僅限首次執行)

大型檔案會依據 `agents.defaults.bootstrapMaxChars`（預設 `20000` 字元）進行個別截斷。`/context` 指令會顯示 **原始 vs 注入** 的大小，以及是否發生截斷。

## 技能：注入內容 vs 按需載入

系統提示詞包含一個簡潔的 **技能列表**（名稱 + 說明 + 位置）。此列表會產生實質的開銷。

技能內部的具體指令預設 **不包含** 在內。預期模型僅在需要時，才透過 `read` 工具讀取該技能的 `SKILL.md`。

## 工具：存在兩層成本

工具會以兩種方式影響上下文：

1. 系統提示詞中的 **工具列表文字**（即您看到的「Tooling」區段）。
2. **工具架構 (Tool schemas)** (JSON)：這些內容會傳送給模型，使其知道如何調用工具。即使您看不見它們顯示為純文字，它們仍會計入上下文。

`/context detail` 指令會拆解最大的工具架構，讓您了解哪些工具佔據了主要空間。

## 指令 (Commands)、引導指令 (Directives) 與「行內捷徑」

斜線指令由閘道器處理。存在幾種不同的行為：

- **獨立指令**：僅包含 `/...` 的訊息會直接作為指令執行。
- **引導指令 (Directives)**：`/think`, `/verbose`, `/reasoning`, `/elevated`, `/model`, `/queue` 會在模型看到訊息前被移除。
  - 僅含引導指令的訊息會持久化會話設定。
  - 一般訊息中的行內引導指令則作為該次訊息的提示 (Hints)。
- **行內捷徑**（僅限授權的傳送者）：一般訊息中特定的 `/...` Token 可以立即執行（例如：「嘿 /status」），並在剩餘文字傳給模型前被移除。

詳情請見：[斜線指令](/tools/slash-commands_zh_TW)。

## 會話、壓縮與修剪 (哪些內容會持久化)

哪些內容會跨訊息保留，取決於採用的機制：

- **一般歷史紀錄**：持久化於對談轉錄紀錄中，直到觸發原則設定的壓縮/修剪。
- **壓縮 (Compaction)**：將摘要持久化於轉錄紀錄中，並保持近期訊息完整。
- **修剪 (Pruning)**：在執行時從 **記憶體內** 的提示詞中移除舊的工具結果，但不會重寫轉錄紀錄。

相關文件：[會話 (Session)](/concepts/session_zh_TW)、[壓縮機制 (Compaction)](/concepts/compaction_zh_TW)、[會話修剪 (Session pruning)](/concepts/session-pruning_zh_TW)。

## `/context` 實際回報的內容

`/context` 會優先使用最近一次 **建置執行 (run-built)** 的系統提示詞報告（若可用）：

- `System prompt (run)`：擷取自上一次內嵌（具備工具能力）的執行，並持久化於對談存儲區。
- `System prompt (estimate)`：當不存在執行報告時（或透過不產生報告的 CLI 後端執行時），即時計算出的預估值。

不論哪種方式，它都會回報大小與主要佔比項；它 **不會** 傾倒出完整的系統提示詞或工具架構內容。
