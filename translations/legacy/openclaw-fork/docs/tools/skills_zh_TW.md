---
summary: "技能系統：受控技能與工作區技能、門控規則以及組態/環境變數串接說明"
read_when:
  - 新增或修改技能時
  - 更改技能門控或載入規則時
title: "技能"
---

> 此文件為 [English Version](/tools/skills_zh_TW) 的繁體中文版本。

# 技能 (Skills - OpenClaw)

OpenClaw 使用與 **[AgentSkills](https://agentskills.io) 相容** 的技能資料夾來教導代理人如何使用工具。每個技能都是一個資料夾，其中包含一個具備 YAML 前端詮釋資料 (Frontmatter) 與指令說明的 `SKILL.md` 檔案。OpenClaw 會載入 **內建技能 (Bundled skills)** 以及選用的本地覆寫技能，並在載入時根據環境變數、組態與二進位檔是否存在進行過濾。

## 位置與優先順序

技能會從 **三個** 地方載入：

1. **內建技能 (Bundled skills)**：隨安裝程式一併發佈（npm 套件或 OpenClaw.app）。
2. **受控/本地技能 (Managed skills)**：`~/.openclaw/skills`。
3. **工作區技能 (Workspace skills)**：`<工作區路徑>/skills`。

若發生技能名稱衝突，優先順序為：
**工作區技能 (最高)** → **受控/本地技能** → **內建技能 (最低)**。

## 外掛程式與技能

外掛程式可以透過在 `openclaw.plugin.json` 中列出 `skills` 目錄來發佈自己的技能。外掛程式技能在啟用外掛程式時會一併載入，並參與一般的技能優先規則。

## ClawHub (安裝與同步)

ClawHub 是 OpenClaw 的公共技能註冊表。您可以在 [https://clawhub.com](https://clawhub.com) 瀏覽、發現、安裝、更新以及備份技能。

常用流程：
- 從 ClawHub 安裝技能：`clawhub install <技能名稱>`。
- 更新所有已安裝技能：`clawhub update --all`。

## 安全性注意事項

- 請將第三方技能視為 **不可信的程式碼**。啟用前請先閱讀其內容。
- 對於不可信的輸入或具風險的工具，建議優先使用 **沙箱 (Sandboxed)** 模式執行。
- `apiKey` 或 `env` 設定會將秘密資訊注入 **主機** 程序，請確保秘密資訊不會出現在提示詞或日誌中。

## 格式規範 (AgentSkills 與 Pi 相容)

`SKILL.md` 必須至少包含以下內容：

```markdown
---
name: 技能名稱
description: 技能描述文字
---
```

**注意事項：**
- 嵌入式代理人使用的解析器僅支援 **單行** 的前端詮釋資料鍵值。
- 使用 `{baseDir}` 可在指令中參考技能資料夾的路徑。

## 門控規則 (載入時過濾)

OpenClaw 會在載入時使用 `metadata`（單行 JSON）來 **過濾技能**：

```markdown
---
name: nano-banana-pro
description: 透過 Gemini 3 Pro 產生圖片
metadata:
  {
    "openclaw":
      {
        "requires": { "bins": ["uv"], "env": ["GEMINI_API_KEY"] },
        "primaryEnv": "GEMINI_API_KEY",
      },
  }
---
```

**門控欄位說明：**
- `always: true`：一律包含此技能（跳過其它檢查）。
- `os`：適用的平台清單（`darwin`, `linux`, `win32`）。
- `requires.bins`：清單中的二進位檔必須存在於 `PATH` 中。
- `requires.env`：環境變數必須存在或在組態中提供。
- `requires.config`：組態路徑中的值必須為真。
- `install`：提供給 macOS 技能介面使用的安裝規格 (Brew/Node/Go/UV)。

## 環境變數注入 (每次代理人執行)

當代理人回合開始時，OpenClaw 會：
1. 讀取技能詮釋資料。
2. 將組態中的 `env` 或 `apiKey` 套用至 `process.env`。
3. 建置包含 **符合資格** 技能的系統提示詞。
4. 在回合結束後還原原始環境。

這項機制是 **針對代理人執行回合限定的**，不會影響全域的 Shell 環境。

## 技能監看器 (自動重新整理)

預設情況下，OpenClaw 會監看技能資料夾。當 `SKILL.md` 檔案發生變更時，會自動更新技能快照 (Hot reload)，變更將在代理人的下一個回合生效。
