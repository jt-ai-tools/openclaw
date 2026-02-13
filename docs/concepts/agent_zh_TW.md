---
summary: "代理人執行環境 (內嵌 pi-mono)、工作區規範以及對談引導啟動"
read_when:
  - 更改代理人執行環境、工作區引導啟動或對談行為時
title: "代理人執行環境"
---

> 此文件為 [English Version](/concepts/agent) 的繁體中文版本。

# 代理人執行環境 (Agent Runtime) 🤖

OpenClaw 執行一個衍生自 **pi-mono** 的單一內嵌代理人執行環境。

## 工作區 (Workspace，必填)

OpenClaw 使用單一代理人工作區目錄 (`agents.defaults.workspace`) 作為代理人處理工具與上下文的 **唯一** 工作目錄 (`cwd`)。

建議方式：若遺失組態，請使用 `openclaw setup` 建立 `~/.openclaw/openclaw.json` 並初始化工作區檔案。

完整工作區佈局與備份指南：[代理人工作區](/concepts/agent-workspace_zh_TW)

如果啟用了 `agents.defaults.sandbox`，非主要 (non-main) 對談可以透過 `agents.defaults.sandbox.workspaceRoot` 下的各對談獨立工作區來覆寫此設定（請參閱 [閘道器組態](/gateway/configuration_zh_TW)）。

## 引導檔案 (Bootstrap files，自動注入)

在 `agents.defaults.workspace` 中，OpenClaw 預期會有以下可供使用者編輯的檔案：

- `AGENTS.md` — 運作指令 + 「記憶」
- `SOUL.md` — 角色個性、邊界、語氣
- `TOOLS.md` — 使用者維護的工具註記（例如 `imsg`、`sag`、慣例）
- `BOOTSTRAP.md` — 首次執行的單次儀式流程（完成後會刪除）
- `IDENTITY.md` — 代理人名稱/氛圍/Emoji
- `USER.md` — 使用者描述檔 + 偏好的稱呼方式

在每個新對談的第一回合，OpenClaw 會將這些檔案的內容直接注入代理人的上下文中。

空白檔案會被跳過。大型檔案會被修剪並加上標記，以保持提示詞 (Prompts) 精簡（可讀取原檔案以獲取完整內容）。

如果檔案缺失，OpenClaw 會注入一行「檔案缺失」標記（而 `openclaw setup` 會建立一個安全的預設範本）。

`BOOTSTRAP.md` 僅會為 **全新的工作區**（不存在其他引導檔案時）建立。如果您在完成儀式流程後將其刪除，後續重新啟動時不應再重新建立。

若要完全停用引導檔案的建立（適用於預先植入內容的工作區），請設定：

```json5
{ agent: { skipBootstrap: true } }
```

## 內建工具

核心工具（讀取/執行/編輯/寫入及相關系統工具）始終可用，但須受工具策略約束。`apply_patch` 為選用項目，並由 `tools.exec.applyPatch` 控制。`TOOLS.md` **並非** 用來控制哪些工具存在，而是作為 *您* 希望如何使用這些工具的指引。

## 技能 (Skills)

OpenClaw 會從三個位置載入技能（若名稱衝突，以工作區為準）：

- 內建 (Bundled，隨安裝程式提供)
- 託管/本地：`~/.openclaw/skills`
- 工作區：`<workspace>/skills`

技能可以透過組態/環境變數進行門控（請參閱 [閘道器組態](/gateway/configuration_zh_TW) 中的 `skills` 區段）。

## pi-mono 整合

OpenClaw 重用了 pi-mono 程式碼庫的部分內容（模型/工具），但 **會話管理、發現 (discovery) 與工具連接是由 OpenClaw 自行擁有的**。

- 無 pi-coding 代理人執行環境。
- 不會參考 `~/.pi/agent` 或 `<workspace>/.pi` 的設定。

## 對談會話 (Sessions)

對談轉錄記錄以 JSONL 格式儲存於：

- `~/.openclaw/agents/<agentId>/sessions/<SessionId>.jsonl`

對談 ID 是穩定的，並由 OpenClaw 選擇。
不會讀取舊版的 Pi/Tau 對談資料夾。

## 串流時的引導控制 (Steering)

當佇列模式設定為 `steer` 時，接收到的訊息會注入目前的執行程序中。
佇列會在 **每次工具調用後** 進行檢查；如果存在待處理訊息，目前助理訊息中剩餘的工具調用將被跳過（工具執行結果顯示為 "Skipped due to queued user message."），接著在下一次助理回應前注入排隊的使用者訊息。

當佇列模式為 `followup` 或 `collect` 時，接收到的訊息會被保留直到目前回合結束，然後以佇列中的內容開啟新的代理人回合。有關模式 + 防震 (debounce)/上限行為，請參閱 [佇列](/concepts/queue_zh_TW)。

區塊串流 (Block streaming) 會在助理區塊完成後立即發送；此功能 **預設關閉** (`agents.defaults.blockStreamingDefault: "off"`)。
可透過 `agents.defaults.blockStreamingBreak` 調整邊界（`text_end` vs `message_end`；預設為 text_end）。
透過 `agents.defaults.blockStreamingChunk` 控制軟區塊分段（預設為 800–1200 字元；優先考慮段落斷句，其次是換行符，最後是句子）。
使用 `agents.defaults.blockStreamingCoalesce` 合併串流片段，以減少單行洗版（發送前基於空閒時間進行合併）。非 Telegram 頻道需要明確設定 `*.blockStreaming: true` 才能啟用區塊回覆。
詳細的工具摘要會在工具啟動時發出（不設防震）；控制 UI 會在可用時透過代理人事件串流傳輸工具輸出。
更多細節：[串流與分塊](/concepts/streaming_zh_TW)。

## 模型參考 (Model refs)

組態中的模型參考（例如 `agents.defaults.model` 和 `agents.defaults.models`）會透過第一個 `/` 進行拆分解析。

- 設定模型時請使用 `provider/model` 格式。
- 如果模型 ID 本身包含 `/`（如 OpenRouter 風格），請包含提供者前綴（例如：`openrouter/moonshotai/kimi-k2`）。
- 如果省略提供者，OpenClaw 會將輸入視為 **預設提供者** 的別名或模型（僅在模型 ID 中沒有 `/` 時有效）。

## 組態設定 (最簡要求)

最少需設定：

- `agents.defaults.workspace`
- `channels.whatsapp.allowFrom` (強烈建議)

---

*下一節：[群組聊天](/channels/group-messages_zh_TW)* 🦞
