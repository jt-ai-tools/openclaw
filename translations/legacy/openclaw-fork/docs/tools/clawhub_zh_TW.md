---
summary: "ClawHub 指南：公共技能註冊表與 CLI 工作流說明"
read_when:
  - 向新使用者介紹 ClawHub 時
  - 安裝、搜尋或發佈技能時
  - 解釋 ClawHub CLI 旗標與同步行為時
title: "ClawHub"
---

> 此文件為 [English Version](/tools/clawhub_zh_TW) 的繁體中文版本。

# ClawHub

ClawHub 是 **OpenClaw 的公共技能註冊表**。這是一項免費服務：所有技能都是公開且可供所有人分享與重用的。一個技能就是一個包含 `SKILL.md` 檔案（以及支援文字檔）的資料夾。您可以在網頁應用程式中瀏覽技能，或使用 CLI 進行搜尋、安裝、更新與發佈。

官方網站：[clawhub.ai](https://clawhub.ai)

## ClawHub 是什麼

- OpenClaw 技能的公共註冊表。
- 具備版本控管的技能包與元數據存儲庫。
- 提供搜尋、標籤與用量訊號的發現介面。

## 針對初學者的說明

如果您想要為 OpenClaw 代理人新增能力，ClawHub 是尋找與安裝技能最簡單的方法。您不需要了解後端運作原理即可執行以下操作：
- 使用自然語言搜尋技能。
- 將技能安裝至您的工作區。
- 透過單一指令更新技能。
- 透過發佈功能備份您自己的技能。

## 快速開始

1. 安裝 CLI 工具（詳見下一節）。
2. 搜尋您需要的內容：
   - `clawhub search "calendar"`
3. 安裝技能：
   - `clawhub install <技能名稱>`
4. 啟動新的 OpenClaw 工作階段，系統將自動載入新技能。

## 安裝 CLI

擇一執行：

```bash
npm i -g clawhub
# 或
pnpm add -g clawhub
```

## 與 OpenClaw 的整合

預設情況下，CLI 會將技能安裝至目前工作目錄下的 `./skills`。若配置了 OpenClaw 工作區，`clawhub` 會自動使用該工作區。OpenClaw 會從 `<workspace>/skills` 載入技能，並在 **下一次** 工作階段中生效。

詳細的載入、分享與門控規則請參閱 [技能 (Skills)](/tools/skills_zh_TW)。

## 安全性與審核

ClawHub 預設是開放的。任何人都可以上傳技能，但 GitHub 帳號必須註冊滿一週才能發佈，以減少濫用。

**檢舉與審核：**
- 任何登入使用者皆可檢舉技能。
- 檢舉必須提供理由。
- 若技能收到超過 3 次不重複的使用者檢舉，預設會自動隱藏。
- 審核員可以查看、恢復隱藏內容，或封鎖使用者。

## CLI 指令與參數

**常用選項：**
- `--workdir <dir>`：工作目錄（預設為目前目錄，會回退至 OpenClaw 工作區）。
- `--dir <dir>`：相對於工作目錄的技能路徑（預設為 `skills`）。
- `--no-input`：停用提示（非互動模式）。

**身分驗證：**
- `clawhub login`：瀏覽器登入流程。
- `clawhub whoami`：檢查目前身分。

**管理指令：**
- `search`：搜尋技能。
- `install`：安裝指定技能。
- `update --all`：更新所有已安裝技能。
- `publish`：發佈新技能或新版本。
- `sync`：掃描本地技能並發佈更新。

## 進階技術細節

### 版本控管與標籤
- 每次發佈都會建立一個新的 **SemVer** `SkillVersion`。
- 標籤（如 `latest`）指向特定版本；移動標籤可用於版本回滾。

### 本地變更與註冊表版本比對
更新時會使用內容雜湊值 (Content hash) 比對本地與註冊表版本。若本地檔案與任何已發佈版本皆不符，CLI 會在覆寫前詢問。

### 遙測資訊 (Telemetry)
當您在登入狀態執行 `clawhub sync` 時，CLI 會發送極小量的快照資訊以計算安裝次數。您可以停用此功能：
`export CLAWHUB_DISABLE_TELEMETRY=1`
