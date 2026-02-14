---
summary: "安裝 OpenClaw —— 安裝腳本、npm/pnpm、原始碼建置、Docker 等多種方式"
read_when:
  - 您需要快速入門以外的安裝方法時
  - 您想要部署至雲端平台時
  - 您需要更新、遷移或解除安裝時
title: "安裝"
---

> 此文件為 [English Version](/install/index_zh_TW) 的繁體中文版本。

# 安裝 (Install)

已經完成 [開始使用 (Getting started)](/start/getting-started_zh_TW) 了嗎？如果您都設定好了，本頁面將提供其它的安裝方法、平台專屬指令以及維護說明。

## 系統要求

- **[Node 22+](/install/node_zh_TW)**（若系統缺少，[安裝腳本](#安裝方法) 會自動為您安裝）。
- macOS, Linux, 或 Windows。
- 僅在您從原始碼建置時需要 `pnpm`。

<Note>
在 Windows 上，我們強烈建議在 [WSL2](https://learn.microsoft.com/zh-tw/windows/wsl/install) 內執行 OpenClaw。
</Note>

## 安裝方法

<Tip>
**安裝腳本** 是安裝 OpenClaw 的推薦方式。它能一併處理 Node 偵測、安裝與引導設定。
</Tip>

### 1. 安裝腳本
下載 CLI，透過 npm 全域安裝，並啟動引導設定精靈。

- **macOS / Linux / WSL2**:
  ```bash
  curl -fsSL https://openclaw.ai/install.sh | bash
  ```
- **Windows (PowerShell)**:
  ```powershell
  iwr -useb https://openclaw.ai/install.ps1 | iex
  ```

### 2. npm / pnpm
如果您已有 Node 22+ 且偏好自行管理安裝：

- **npm**:
  ```bash
  npm install -g openclaw@latest
  openclaw onboard --install-daemon
  ```
- **pnpm**:
  ```bash
  pnpm add -g openclaw@latest
  pnpm approve-builds -g
  openclaw onboard --install-daemon
  ```

### 3. 從原始碼建置 (From source)
適用於貢獻者或想要執行開發版本的使用者。

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
pnpm link --global
openclaw onboard --install-daemon
```

## 安裝後檢查

驗證一切是否運作正常：
```bash
openclaw doctor    # 檢查組態問題
openclaw status    # 閘道器狀態
openclaw dashboard # 開啟瀏覽器介面
```

## 更新與解除安裝

- [更新 (Updating)](/install/updating_zh_TW)
- [遷移 (Migrating)](/install/migrating_zh_TW)
- [解除安裝 (Uninstall)](/install/uninstall_zh_TW)
