---
summary: "安裝腳本 (install.sh, install-cli.sh, install.ps1) 的工作原理、旗標與自動化說明"
read_when:
  - 您想要了解 `openclaw.ai/install.sh` 的運作邏輯時
  - 您想要自動化安裝（CI / 無頭模式）時
  - 您想要從 GitHub 簽出版安裝時
title: "安裝腳本原理"
---

> 此文件為 [English Version](/install/installer_zh_TW) 的繁體中文版本。

# 安裝腳本原理 (Installer internals)

OpenClaw 提供三個安裝腳本，託管於 `openclaw.ai`。

| 腳本名稱           | 適用平台             | 功能說明                                                                                     |
| ------------------ | -------------------- | -------------------------------------------------------------------------------------------- |
| `install.sh`       | macOS / Linux / WSL  | 必要時安裝 Node，透過 npm (預設) 或 Git 安裝 OpenClaw，並可執行引導設定。                     |
| `install-cli.sh`   | macOS / Linux / WSL  | 將 Node + OpenClaw 安裝至本地前綴目錄 (`~/.openclaw`)。無需 root 權限。                      |
| `install.ps1`      | Windows (PowerShell) | 必要時安裝 Node，透過 npm (預設) 或 Git 安裝 OpenClaw，並可執行引導設定。                     |

## 快速指令

- **macOS / Linux / WSL**:
  ```bash
  curl -fsSL https://openclaw.ai/install.sh | bash
  ```
- **Windows (PowerShell)**:
  ```powershell
  iwr -useb https://openclaw.ai/install.ps1 | iex
  ```

---

## install.sh 細節

### 執行流程
1. **偵測作業系統**：支援 macOS 與 Linux（包含 WSL）。macOS 若缺少 Homebrew 會自動安裝。
2. **確保 Node.js 22+**：檢查版本，必要時安裝 Node 22。
3. **確保 Git**：若缺少則安裝 Git。
4. **安裝 OpenClaw**：
   - `npm` 模式（預設）：全域 npm 安裝。
   - `git` 模式：複製/更新儲存庫，使用 pnpm 安裝依賴並建置。
5. **後置任務**：執行 `openclaw doctor`，並在 TTY 可用時啟動引導設定。

### 常用旗標 (Flags)
- `--install-method npm|git`：選擇安裝方法。
- `--no-onboard`：跳過引導設定。
- `--dry-run`：僅列印動作而不實際執行。

---

## install-cli.sh 細節
專為希望將所有內容放在本地目錄（預設 `~/.openclaw`）且不依賴系統 Node 的環境設計。

### 執行流程
1. **安裝本地 Node 執行環境**：下載 Node 壓縮檔並驗證。
2. **確保 Git**：必要時安裝。
3. **在目錄下安裝 OpenClaw**：使用 npm 安裝至指定目錄，並建立封裝腳本。

---

## CI 與自動化
針對自動化環境，請使用非互動式旗標或環境變數。

- **非互動式 npm 安裝 (Linux)**:
  ```bash
  curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-prompt --no-onboard
  ```
- **非互動式 Git 安裝 (Linux)**:
  ```bash
  OPENCLAW_INSTALL_METHOD=git OPENCLAW_NO_PROMPT=1 
    curl -fsSL https://openclaw.ai/install.sh | bash
  ```

---

## 疑難排解
- **為什麼需要 Git？**：除了 `git` 安裝模式外，`npm` 安裝時若相依性使用 Git URL 也需要它。
- **安裝後找不到 `openclaw`**：通常是 PATH 環境變數問題。請參閱 [Node.js 疑難排解](/install/node_zh_TW#疑難排解)。
