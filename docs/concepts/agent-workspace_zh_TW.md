---
summary: "代理人工作區：位置、佈局與備份策略說明"
read_when:
  - 您需要解釋代理人工作區或其檔案佈局時
  - 您想要備份或遷移代理人工作區時
title: "代理人工作區"
---

> 此文件為 [English Version](/concepts/agent-workspace) 的繁體中文版本。

# 代理人工作區 (Agent workspace)

工作區是代理人的家。它是檔案工具使用的唯一工作目錄，也是工作區上下文的來源。請保持其私密性，並將其視為代理人的記憶體。

這與儲存組態、憑證與對談紀錄的 `~/.openclaw/` 是分開的。

**重要提示：** 工作區是 **預設的工作目錄 (cwd)**，而非強制的硬性沙箱。工具會根據工作區解析相對路徑，但除非啟用了沙箱模式，否則絕對路徑仍可觸及主機上的其他位置。若您需要隔離環境，請使用 [`agents.defaults.sandbox`](/gateway/sandboxing_zh_TW)（或針對特定代理人設定沙箱組態）。當啟用了沙箱且 `workspaceAccess` 並非 `"rw"` 時，工具會在 `~/.openclaw/sandboxes` 下的沙箱工作區內運作，而非您的主機工作區。

## 預設位置

- 預設路徑：`~/.openclaw/workspace`
- 若設定了 `OPENCLAW_PROFILE` 且非 `"default"`，預設路徑會變為 `~/.openclaw/workspace-<設定檔名稱>`。
- 可在 `~/.openclaw/openclaw.json` 中覆寫：

```json5
{
  agent: {
    workspace: "~/.openclaw/workspace",
  },
}
```

執行 `openclaw onboard`、`openclaw configure` 或 `openclaw setup` 會在工作區缺失時自動建立並初始生成 (seed) 引導檔案。

如果您已自行管理工作區檔案，可以停用引導檔案的自動建立功能：

```json5
{ agent: { skipBootstrap: true } }
```

## 額外的工作區資料夾

舊版安裝可能會建立 `~/openclaw` 目錄。保留多個工作區目錄可能會導致驗證或狀態偏離的困擾，因為一次僅有一個工作區會處於活動狀態。

**建議做法：** 僅保留單一個活動中的工作區。如果您不再使用額外的資料夾，請將其封存或移至垃圾桶（例如：`trash ~/openclaw`）。如果您刻意保留多個工作區，請確保 `agents.defaults.workspace` 指向目前使用的那一個。

`openclaw doctor` 會在偵測到多個工作區目錄時發出警告。

## 工作區檔案配置圖 (各檔案用途)

以下是 OpenClaw 預期在工作區內看到的標準檔案：

- `AGENTS.md`
  - 代理人的運作指令以及如何使用記憶體的說明。
  - 在每個對談開始時載入。
  - 適合存放規則、優先順序以及「如何表現」等細節。

- `SOUL.md`
  - 角色個性、語氣與行為邊界。
  - 每個對談開始時載入。

- `USER.md`
  - 使用者是誰以及偏好的稱呼方式。
  - 每個對談開始時載入。

- `IDENTITY.md`
  - 代理人的名稱、氛圍與 Emoji。
  - 在啟動儀式 (Bootstrap ritual) 期間建立或更新。

- `TOOLS.md`
  - 關於本地工具用法與慣例的註記。
  - 並非用來控制工具可用性，僅作為指引。

- `HEARTBEAT.md`
  - 心跳偵測執行時的選用微型檢查清單。
  - 請保持簡短以避免 Token 消耗。

- `BOOT.md`
  - 啟用內部鉤子 (Internal hooks) 時，在閘道器重啟後執行的選用啟動檢查清單。
  - 請保持簡短；發送傳出訊息請使用 `message` 工具。

- `BOOTSTRAP.md`
  - 僅限一次的首次執行儀式。
  - 僅為全新的工作區建立。
  - 儀式完成後請將其刪除。

- `memory/YYYY-MM-DD.md`
  - 每日記憶日誌（一天一個檔案）。
  - 建議在對談開始時讀取今日與昨日的日誌。

- `MEMORY.md`（選填）
  - 經過整理的長期記憶。
  - 僅在主會話或私人會話中載入（不包含共享/群組上下文）。

關於工作流與自動記憶體清除 (Flush) 的說明，請參閱 [記憶 (Memory)](/concepts/memory_zh_TW)。

- `skills/`（選填）
  - 工作區專屬技能。
  - 若名稱衝突，會覆寫託管或內建技能。

- `canvas/`（選填）
  - 用於節點顯示的 Canvas UI 檔案（例如 `canvas/index.html`）。

若缺失任何引導檔案，OpenClaw 會在對談中注入一個「檔案缺失」標記並繼續。大型引導檔案在注入時會被截斷；可透過 `agents.defaults.bootstrapMaxChars`（預設：20000）調整限制。`openclaw setup` 可以在不覆寫現有檔案的情況下，重新建立缺失的預設檔案。

## 哪些內容「不屬於」工作區

以下內容存放在 `~/.openclaw/` 下，**不應** 提交至工作區的 Git 儲存庫：

- `~/.openclaw/openclaw.json` (組態)
- `~/.openclaw/credentials/` (OAuth Token, API 密鑰)
- `~/.openclaw/agents/<agentId>/sessions/` (對談轉錄紀錄 + 元數據)
- `~/.openclaw/skills/` (託管技能)

如果您需要遷移對談或組態，請分開複製，並確保它們不受版本控制。

## Git 備份 (建議使用，設為私有)

請將工作區視為私人記憶。將其存放在 **私有 (private)** 的 Git 儲存庫中，以便進行備份與復原。

請在執行閘道器的機器（即工作區所在地）上執行以下步驟。

### 1) 初始化儲存庫

若已安裝 Git，全新的工作區會自動進行初始化。若工作區尚未建立儲存庫，請執行：

```bash
cd ~/.openclaw/workspace
git init
git add AGENTS.md SOUL.md USER.md IDENTITY.md TOOLS.md HEARTBEAT.md memory/
git commit -m "Add agent workspace"
```

### 2) 加入私有遠端儲存庫 (新手友善選項)

選項 A：GitHub 網頁介面

1. 在 GitHub 上建立一個新的 **私有 (Private)** 儲存庫。
2. 不要勾選初始化 README（以避免合併衝突）。
3. 複製 HTTPS 遠端 URL。
4. 加入遠端並推送：

```bash
git branch -M main
git remote add origin <HTTPS-URL>
git push -u origin main
```

選項 B：GitHub CLI (`gh`)

```bash
gh auth login
gh repo create openclaw-workspace --private --source . --remote origin --push
```

選項 C：GitLab 網頁介面

1. 在 GitLab 上建立一個新的 **私有 (Private)** 儲存庫。
2. 不要勾選初始化 README。
3. 複製 HTTPS 遠端 URL。
4. 加入遠端並推送：

```bash
git branch -M main
git remote add origin <HTTPS-URL>
git push -u origin main
```

### 3) 持續更新

```bash
git status
git add .
git commit -m "Update memory"
git push
```

## 請勿提交機密資訊

即便是在私有儲存庫中，也請避免在工作區儲存機密資訊：

- API 密鑰、OAuth Token、密碼或私有憑證。
- `~/.openclaw/` 下的任何內容。
- 原始的聊天內容傾倒 (Dumps) 或敏感附件。

如果您必須儲存敏感參考資訊，請使用佔位符，並將真實機密存放在他處（如密碼管理員、環境變數或 `~/.openclaw/`）。

建議的 `.gitignore` 起始設定：

```gitignore
.DS_Store
.env
**/*.key
**/*.pem
**/secrets*
```

## 將工作區搬移至新機器

1. 將儲存庫複製 (Clone) 到目標路徑（預設為 `~/.openclaw/workspace`）。
2. 在 `~/.openclaw/openclaw.json` 中將 `agents.defaults.workspace` 指向該路徑。
3. 執行 `openclaw setup --workspace <路徑>` 以初始生成任何缺失的檔案。
4. 如果您需要對談紀錄，請分開從舊機器複製 `~/.openclaw/agents/<agentId>/sessions/`。

## 進階說明

- 多代理人路由可針對每個代理人使用不同的工作區。路由配置請參閱 [頻道路由](/channels/channel-routing_zh_TW)。
- 若啟用了 `agents.defaults.sandbox`，非主會話可以使用 `agents.defaults.sandbox.workspaceRoot` 下的各會話獨立沙箱工作區。
