---
summary: "將 OpenClaw 安裝從一台機器搬移（遷移）至另一台機器"
read_when:
  - 您要將 OpenClaw 搬移至新筆電或伺服器時
  - 您想要保留工作階段、驗證資訊與頻道登入狀態（如 WhatsApp）時
title: "遷移指南"
---

> 此文件為 [English Version](/install/migrating_zh_TW) 的繁體中文版本。

# 遷移 OpenClaw 至新機器

本指南說明如何將 OpenClaw 閘道器從一台機器遷移至另一台機器，而 **無需重新執行引導設定**。

遷移的概念非常簡單：
- 複製 **狀態目錄** (`$OPENCLAW_STATE_DIR`，預設為 `~/.openclaw/`) —— 包含組態、驗證資訊、工作階段與頻道狀態。
- 複製 **工作區** (預設為 `~/.openclaw/workspace/`) —— 包含您的代理人檔案（記憶、提示詞等）。

## 開始之前

### 1) 確認您的狀態目錄
大多數安裝使用預設路徑：`~/.openclaw/`。
若不確定，請在 **舊機器** 上執行：
```bash
openclaw status
```
在輸出中尋找 `OPENCLAW_STATE_DIR` 或設定檔 (Profile) 的路徑。

### 2) 確認您的工作區
預設通常為 `~/.openclaw/workspace/`。這是存放 `MEMORY.md` 與 `USER.md` 等檔案的地方。

### 3) 了解會保留哪些內容
若同時複製狀態目錄與工作區，您將保留：
- 閘道器組態 (`openclaw.json`)。
- 驗證設定檔 / API 密鑰 / OAuth 權杖。
- 工作階段歷史與代理人狀態。
- 頻道狀態（例如 WhatsApp 的登入工作階段）。
- 工作區檔案（記憶、技能筆記等）。

## 遷移步驟（推薦）

### 步驟 0 — 進行備份（舊機器）
在 **舊機器** 上，先停止閘道器：
```bash
openclaw gateway stop
```
（建議）將目錄打包：
```bash
cd ~
tar -czf openclaw-state.tgz .openclaw
tar -czf openclaw-workspace.tgz .openclaw/workspace
```

### 步驟 1 — 在新機器上安裝 OpenClaw
在新機器上安裝 CLI 工具：請參閱 [安裝指南](/install_zh_TW)。

### 步驟 2 — 將備份複製到新機器
複製並解壓縮 **狀態目錄** 與 **工作區**。請確保隱藏目錄（點開頭）也有包含在內，且檔案擁有者正確。

### 步驟 3 — 執行 Doctor（遷移與服務修復）
在 **新機器** 上執行：
```bash
openclaw doctor
```
Doctor 會修復服務、套用組態遷移，並檢查不匹配的情況。

隨後執行：
```bash
openclaw gateway restart
openclaw status
```

## 常見陷阱

- **僅複製 `openclaw.json`**：這是不夠的。許多模型提供者將狀態儲存在 `credentials/` 與 `agents/` 子目錄下。請務必遷移整個 `$OPENCLAW_STATE_DIR` 資料夾。
- **權限與擁有者**：若以 root 身分複製，閘道器可能無法讀取。請確保目錄擁有者為執行閘道器的使用者。
- **備份中的秘密**：狀態目錄包含敏感的 API 密鑰與權杖。請妥善保護備份檔案。
