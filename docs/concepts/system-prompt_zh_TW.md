---
summary: "OpenClaw 系統提示詞的內容組成與組裝機制說明"
read_when:
  - 編輯系統提示詞文字、工具列表或時間/心跳偵測區段時
  - 更改工作區引導檔案或技能注入行為時
title: "系統提示詞"
---

> 此文件為 [English Version](/concepts/system-prompt) 的繁體中文版本。

# 系統提示詞 (System Prompt)

OpenClaw 會為每次代理人執行建置自訂的系統提示詞。提示詞由 **OpenClaw 擁有**，且不使用 pi-coding-agent 的預設提示詞。

提示詞由 OpenClaw 組裝並注入至每次代理人執行回合中。

## 結構

提示詞設計上力求精簡，並使用固定的區段：

- **Tooling (工具)**：目前的工具列表與簡短說明。
- **Safety (安全性)**：簡短的護欄提醒，以避免尋求權力的行為 (power-seeking) 或繞過監督。
- **Skills (技能)**（若可用）：告知模型如何按需載入技能指令。
- **OpenClaw Self-Update (自我更新)**：如何執行 `config.apply` 與 `update.run`。
- **Workspace (工作區)**：工作目錄 (`agents.defaults.workspace`)。
- **Documentation (文件)**：OpenClaw 文件的本地路徑（儲存庫或 npm 套件）以及閱讀時機。
- **Workspace Files (注入的工作區檔案)**：標示下方包含引導檔案內容。
- **Sandbox (沙箱)**（若啟用）：標示沙箱執行環境、沙箱路徑，以及是否具備提升權限執行 (Elevated exec) 能力。
- **Current Date & Time (目前日期與時間)**：使用者在地時間、時區與時間格式。
- **Reply Tags (回覆標籤)**：針對支援提供者的選用回覆標籤語法。
- **Heartbeats (心跳偵測)**：心跳提示詞與確認 (Ack) 行為。
- **Runtime (執行環境)**：主機、作業系統、Node 版本、模型、儲存庫根目錄（若偵測到）、思考等級（單行顯示）。
- **Reasoning (推理過程)**：目前的可見度等級與 `/reasoning` 切換提示。

系統提示詞中的安全性護欄僅具 **建議性質 (Advisory)**。它們能引導模型行為，但無法強制執行政策。若要實現 **強制執行 (Hard enforcement)**，請使用工具原則、執行核准機制、沙箱化以及頻道允許清單；操作員可以根據需求關閉這些限制。

## 提示詞模式 (Prompt modes)

OpenClaw 可以為子代理人渲染較小的系統提示詞。執行階段會為每次執行設定一個 `promptMode`（此非使用者端配置）：

- `full` (預設)：包含上述所有區段。
- `minimal`：用於子代理人；省略了 **Skills**, **Memory Recall (記憶回想)**, **OpenClaw Self-Update**, **Model Aliases**, **User Identity**, **Reply Tags**, **Messaging**, **Silent Replies** 以及 **Heartbeats**。但 **Tooling**, **Safety**, **Workspace**, **Sandbox**, **Current Date & Time**（若已知）, **Runtime** 以及注入的上下文仍保持可用。
- `none`：僅傳回基礎身分行。

當 `promptMode=minimal` 時，額外注入的提示詞標籤會改為 **Subagent Context (子代理人上下文)** 而非 **Group Chat Context (群組對話上下文)**。

## 工作區引導檔案注入 (Workspace bootstrap injection)

引導檔案會經過修剪並附加在 **Project Context (專案上下文)** 下，讓模型無需明確讀取即可看到身分與個人描述檔上下文：

- `AGENTS.md`
- `SOUL.md`
- `TOOLS.md`
- `IDENTITY.md`
- `USER.md`
- `HEARTBEAT.md`
- `BOOTSTRAP.md`（僅限全新工作區）
- `MEMORY.md` 或/及 `memory.md`（若工作區中存在；可能注入其中之一或兩者）

所有這些檔案在每一回合都會被 **注入到上下文視窗中**，這意味著它們會消耗 Token。請保持內容精簡 —— 特別是 `MEMORY.md`，它會隨著時間增長，可能導致非預期的高上下文用量以及更頻繁的壓縮 (Compaction)。

> **注意：** `memory/*.md` 每日日誌檔案 **不會** 自動注入。它們是透過 `memory_search` 與 `memory_get` 工具按需存取的，因此除非模型明確讀取，否則不計入上下文視窗。

大型檔案會被截斷並加上標記。每個檔案的最大大小由 `agents.defaults.bootstrapMaxChars` 控制（預設：20000 字元）。缺失的檔案會注入一個簡短的缺失標記。

子代理人對談僅注入 `AGENTS.md` 與 `TOOLS.md`（其他引導檔案會被過濾掉，以保持子代理人上下文精簡）。

內部鉤子 (Internal hooks) 可以透過 `agent:bootstrap` 攔截此步驟，以改動或替換注入的引導檔案（例如將 `SOUL.md` 換成另一個角色設定）。

若要檢查每個注入檔案所佔用的比例（原始 vs 注入大小、截斷情況，以及工具架構的開銷），請使用 `/context list` 或 `/context detail`。請參閱 [上下文](/concepts/context_zh_TW)。

## 時間處理

當使用者時區已知時，系統提示詞會包含一個專用的 **Current Date & Time** 區段。為了保持提示詞的 **快取穩定性 (cache-stable)**，它現在僅包含 **時區 (time zone)**（不含動態時鐘或時間格式）。

當代理人需要知道目前時間時，請使用 `session_status` 工具；狀態卡中包含時間戳記行。

可透過以下參數配置：

- `agents.defaults.userTimezone`
- `agents.defaults.timeFormat` (`auto` | `12` | `24`)

詳細行為請參閱 [日期與時間](/date-time_zh_TW)。

## 技能 (Skills)

當存在符合資格的技能時，OpenClaw 會注入一個精簡的 **可用技能列表** (`formatSkillsForPrompt`)，包含每個技能的 **檔案路徑**。提示詞會引導模型使用 `read` 工具載入對應位置（工作區、託管或內建）的 `SKILL.md`。若無符合資格的技能，則省略 Skills 區段。

```
<available_skills>
  <skill>
    <name>...</name>
    <description>...</description>
    <location>...</location>
  </skill>
</available_skills>
```

這能保持基礎提示詞精簡，同時仍能支援定向 (Targeted) 的技能使用。

## 文件 (Documentation)

可用時，系統提示詞會包含一個 **Documentation** 區段，指向本地的 OpenClaw 文件目錄（儲存庫工作區中的 `docs/` 或內建的 npm 套件文件），並註明公開鏡像、原始碼儲存庫、社群 Discord 以及用於發現技能的 ClawHub ([https://clawhub.com](https://clawhub.com))。提示詞會引導模型在遇到 OpenClaw 行為、指令、組態或架構問題時優先參考本地文件，並在可能的情況下自行執行 `openclaw status`（僅在缺乏存取權限時才詢問使用者）。
