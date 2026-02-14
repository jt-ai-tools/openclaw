---
summary: "Doctor 指令：健康檢查、組態遷移與修復步驟說明"
read_when:
  - 新增或修改 Doctor 遷移邏輯時
  - 引入具破壞性的組態變更時
title: "Doctor 指令"
---

> 此文件為 [English Version](/gateway/doctor_zh_TW) 的繁體中文版本。

# Doctor 指令

`openclaw doctor` 是 OpenClaw 的修復與遷移工具。它能修正過時的組態與狀態、檢查系統健康度，並提供可執行的修復步驟。

## 快速上手

```bash
openclaw doctor
```

### 無頭模式 / 自動化

```bash
openclaw doctor --yes
```

不經提示直接接受預設值（包含重啟、服務與沙箱修復步驟，若適用）。

```bash
openclaw doctor --repair
```

不經提示直接套用建議的修復（在安全情況下進行修復與重啟）。

```bash
openclaw doctor --repair --force
```

套用強制修復（會覆寫自訂的服務監控組態）。

```bash
openclaw doctor --non-interactive
```

以非互動模式執行，僅套用安全的遷移（組態規範化與磁碟狀態路徑移動）。跳過需要人工確認的重啟、服務或沙箱動作。偵測到舊版狀態遷移時會自動執行。

```bash
openclaw doctor --deep
```

掃描系統服務中的其他閘道器安裝實例（launchd/systemd/schtasks）。

如果您想在寫入前檢閱變更，請先開啟組態檔案：

```bash
cat ~/.openclaw/openclaw.json
```

## 功能摘要

- 針對從 Git 安裝的版本提供選用的執行前更新（僅限互動模式）。
- UI 通訊協定更新狀態檢查（當通訊協定架構較新時，重新建置控制 UI）。
- 健康檢查與重啟提示。
- 技能 (Skills) 狀態摘要（符合資格/缺失/被阻擋）。
- 舊版組態值的規範化。
- OpenCode Zen 提供者覆寫警告 (`models.providers.opencode`)。
- 舊版磁碟狀態遷移（對談/代理人目錄/WhatsApp 驗證）。
- 狀態完整性與權限檢查（對談、轉錄紀錄、狀態目錄）。
- 本地執行時的組態檔案權限檢查 (chmod 600)。
- 模型驗證健康度：檢查 OAuth 過期、重新整理即將過期的 Token，並回報驗證設定檔的冷卻 (cooldown)/停用狀態。
- 額外工作區目錄偵測 (`~/openclaw`)。
- 啟用沙箱時的沙箱映像檔修復。
- 舊版服務遷移與額外閘道器偵測。
- 閘道器執行階段檢查（服務已安裝但未執行；已快取的 launchd 標籤）。
- 頻道狀態警告（從執行中的閘道器進行探測）。
- 服務監控組態審計 (launchd/systemd/schtasks) 與選用的修復。
- 閘道器執行階段最佳實務檢查 (Node vs Bun, 版本管理工具路徑)。
- 閘道器連接埠衝突診斷（預設為 `18789`）。
- 針對公開私訊原則的安全性警告。
- 本地模式下未設定 `gateway.auth.token` 的驗證警告（並提供 Token 產生功能）。
- Linux 上的 systemd linger (停留) 檢查。
- 原始碼安裝檢查 (pnpm workspace 不符, 缺失 UI 資產, 缺失 tsx 二進位檔)。
- 寫入更新後的組態與精靈元數據。

## 詳細行為與原理說明

### 0) 選用更新 (Git 安裝版本)

如果是透過 Git 檢出的版本且 Doctor 以互動模式執行，它會建議在執行檢查前先進行更新（fetch/rebase/build）。

### 1) 組態規範化 (Config normalization)

如果組態包含舊版的資料結構（例如 `messages.ackReaction` 缺少頻道專屬覆寫），Doctor 會將其規範化為目前的架構。

### 2) 舊版組態鍵名遷移

當組態包含已棄用的鍵名時，其他指令會拒絕執行並要求您執行 `openclaw doctor`。

Doctor 會執行以下動作：

- 說明發現了哪些舊版鍵名。
- 顯示套用的遷移內容。
- 以更新後的架構重寫 `~/.openclaw/openclaw.json`。

閘道器在啟動時若偵測到舊版組態格式，也會自動執行遷移，因此過時的組態無需人工干預即可完成修復。

目前的遷移項目：

- `routing.allowFrom` → `channels.whatsapp.allowFrom`
- `routing.groupChat.requireMention` → `channels.whatsapp/telegram/imessage.groups."*".requireMention`
- `routing.groupChat.historyLimit` → `messages.groupChat.historyLimit`
- `routing.groupChat.mentionPatterns` → `messages.groupChat.mentionPatterns`
- `routing.queue` → `messages.queue`
- `routing.bindings` → 頂層 `bindings`
- `routing.agents`/`routing.defaultAgentId` → `agents.list` + `agents.list[].default`
- `routing.agentToAgent` → `tools.agentToAgent`
- `routing.transcribeAudio` → `tools.media.audio.models`
- `bindings[].match.accountID` → `bindings[].match.accountId`
- `identity` → `agents.list[].identity`
- `agent.*` → `agents.defaults` + `tools.*` (tools/elevated/exec/sandbox/subagents)
- `agent.model`/`allowedModels`/`modelAliases`/`modelFallbacks`/`imageModelFallbacks`
  → `agents.defaults.models` + `agents.defaults.model.primary/fallbacks` + `agents.defaults.imageModel.primary/fallbacks`

### 2b) OpenCode Zen 提供者覆寫

如果您手動新增了 `models.providers.opencode` (或 `opencode-zen`)，它會覆寫來自 `@mariozechner/pi-ai` 的內建 OpenCode Zen 型錄。這可能會強迫所有模型使用單一 API 或導致成本歸零。Doctor 會發出警告，建議您移除該覆寫以恢復各模型的 API 路由與成本計算。

### 3) 舊版狀態遷移 (磁碟佈局)

Doctor 可將舊版的磁碟佈局遷移至目前的結構：

- 對談存儲區 + 轉錄紀錄：
  - 從 `~/.openclaw/sessions/` 遷移至 `~/.openclaw/agents/<agentId>/sessions/`
- 代理人目錄：
  - 從 `~/.openclaw/agent/` 遷移至 `~/.openclaw/agents/<agentId>/agent/`
- WhatsApp 驗證狀態 (Baileys)：
  - 從舊版的 `~/.openclaw/credentials/*.json`（`oauth.json` 除外）
  - 遷移至 `~/.openclaw/credentials/whatsapp/<accountId>/...`（預設帳號 ID 為 `default`）

這些遷移是盡力而為且具備冪等性 (idempotent) 的；若 Doctor 保留了任何舊資料夾作為備份，會發出警告。閘道器/CLI 在啟動時也會自動遷移舊版的對談與代理人目錄，使歷史紀錄/驗證/模型能進入各代理人的專屬路徑。WhatsApp 驗證則僅限透過 `openclaw doctor` 進行遷移。

### 4) 狀態完整性檢查 (會話持久化、路由與安全)

狀態目錄 (State directory) 是維運的核心生命線。如果它消失，您將失去會話、憑證、日誌與組態（除非您有其他備份）。

Doctor 檢查項：

- **狀態目錄缺失**：針對災難性的狀態遺失發出警告，提示重新建立目錄，並提醒無法救回缺失的數據。
- **狀態目錄權限**：驗證寫入權限；提供修復權限的功能（若偵測到擁有者/群組不符，會發出 `chown` 提示）。
- **對談目錄缺失**：為了持久化歷史紀錄並避免 `ENOENT` 崩潰，必須存在 `sessions/` 與會話存儲目錄。
- **轉錄紀錄不符**：當最近的對談項目缺失轉錄檔案時發出警告。
- **主會話「單行 JSONL」**：當主轉錄檔案僅有一行時（代表歷史紀錄未累積）進行標示。
- **多個狀態目錄**：當不同家目錄下存在多個 `~/.openclaw` 資料夾，或 `OPENCLAW_STATE_DIR` 指向他處時發出警告（歷史紀錄可能在不同安裝版本間分散）。
- **遠端模式提醒**：若 `gateway.mode=remote`，Doctor 會提醒您應在遠端主機執行檢查（因為狀態存放在該處）。
- **組態檔案權限**：若 `~/.openclaw/openclaw.json` 設定為群組或所有人可讀，則發出警告並建議改為 `600`。

### 5) 模型驗證健康度 (OAuth 過期)

Doctor 檢查驗證存儲區中的 OAuth 設定檔，當 Token 即將過期或已過期時發出警告，並在安全情況下進行重新整理。如果 Anthropic Claude Code 設定檔已過時，會建議執行 `claude setup-token`（或貼上 setup-token）。重新整理的提示僅在互動模式 (TTY) 下顯示；`--non-interactive` 會跳過重新整理嘗試。

Doctor 也會回報因以下原因暫時無法使用的驗證設定檔：

- 短期冷卻期 (Cooldown)（頻率限制/逾時/驗證失敗）
- 長期停用（帳單/額度問題）

### 6) 鉤子 (Hooks) 模型驗證

如果設定了 `hooks.gmail.model`，Doctor 會根據型錄與允許清單驗證該模型參考，並在無法解析或被禁止時發出警告。

### 7) 沙箱映像檔修復

啟用沙箱時，Doctor 會檢查 Docker 映像檔，並在目前的映像檔缺失時建議進行建置或切換至舊版名稱。

### 8) 閘道器服務遷移與清除提示

Doctor 會偵測舊版的閘道器服務 (launchd/systemd/schtasks)，並建議移除後改用目前的連接埠安裝 OpenClaw 服務。它也能掃描其他類似閘道器的服務並列印清除提示。具備設定檔名稱的 OpenClaw 閘道器服務被視為一等公民，不會被標示為「額外」服務。

### 9) 安全性警告

當提供者在沒有允許清單的情況下對外開放私訊，或原則設定存在風險時，Doctor 會發出警告。

### 10) systemd linger (Linux)

若作為 systemd 使用者服務執行，Doctor 會確保啟用了 linger 功能，使閘道器在登出後能繼續執行。

### 11) 技能狀態

Doctor 會為目前的工作區列印符合資格/缺失/被阻擋之技能的快速摘要。

### 12) 閘道器驗證檢查 (本地 Token)

當本地閘道器缺失 `gateway.auth` 設定時發出警告，並提供產生 Token 的功能。在自動化流程中可使用 `openclaw doctor --generate-gateway-token` 強制建立 Token。

### 13) 閘道器健康檢查與重啟

Doctor 會執行健康檢查，並在閘道器看起來異常時建議進行重啟。

### 14) 頻道狀態警告

若閘道器健康，Doctor 會執行頻道狀態探測，並針對警告提供建議的修復方案。

### 15) 服務監控組態審計與修復

Doctor 檢查已安裝的服務監控組態 (launchd/systemd/schtasks) 是否有缺失或過時的預設值（例如：systemd 的網路就緒依賴與重啟延遲）。發現不符時會建議更新，並將服務檔案/任務重寫為目前的預設值。

注意事項：

- `openclaw doctor` 在重寫服務監控組態前會先詢問。
- `openclaw doctor --yes` 會自動接受修復提示。
- `openclaw doctor --repair` 會在不提示的情況下套用建議的修復。
- `openclaw doctor --repair --force` 會覆寫自訂的服務監控組態。
- 您隨時可以透過 `openclaw gateway install --force` 強制執行完整重寫。

### 16) 閘道器執行階段與連接埠診斷

Doctor 檢查服務執行階段資訊 (PID, 最後結束狀態)，並在服務已安裝但未實際執行時發出警告。它也會檢查閘道器連接埠（預設為 `18789`）是否發生衝突，並報告可能的原因（閘道器已在執行中、SSH 隧道）。

### 17) 閘道器執行階段最佳實務

若閘道器服務執行於 Bun 或透過版本管理工具安裝的 Node 路徑 (`nvm`, `fnm`, `volta`, `asdf` 等)，Doctor 會發出警告。WhatsApp 與 Telegram 頻道需要原生 Node 環境，且版本管理工具的路徑可能會在升級後失效（因為服務不會載入您的 Shell 初始化設定）。若系統已安裝 Node (Homebrew/apt/choco)，Doctor 會建議遷移至該路徑。

### 18) 組態寫入與精靈元數據

Doctor 會持久化任何組態變更，並標註精靈元數據以記錄此次執行。

### 19) 工作區小提示 (備份與記憶系統)

若缺失工作區記憶系統，Doctor 會給予建議；若工作區尚未受 Git 控管，則會列印備份提示。

完整的工作區結構與 Git 備份指南（建議使用私有的 GitHub 或 GitLab），請參閱 [/concepts/agent-workspace](/concepts/agent-workspace_zh_TW)。
