---
title: "Node.js"
summary: "為 OpenClaw 安裝與配置 Node.js —— 版本要求、安裝選項以及 PATH 疑難排解"
read_when:
  - "在安裝 OpenClaw 前需要安裝 Node.js 時"
  - "已安裝 OpenClaw 但出現 command not found 錯誤時"
  - "npm install -g 執行失敗出現權限或 PATH 問題時"
---

> 此文件為 [English Version](/install/node_zh_TW) 的繁體中文版本。

# Node.js

OpenClaw 需要 **Node 22 或更高版本**。雖然 [安裝腳本](/install_zh_TW#安裝方法) 會自動偵測並安裝 Node，但本頁面將指導您如何自行設定 Node，並確保一切配置正確。

## 檢查版本

```bash
node -v
```

如果輸出的版本為 `v22.x.x` 或更高，則符合要求。

## 安裝 Node

<Tabs>
  <Tab title="macOS">
    **Homebrew** (推薦方式)：
    ```bash
    brew install node
    ```
  </Tab>
  <Tab title="Linux">
    **Ubuntu / Debian：**
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
  </Tab>
  <Tab title="Windows">
    **winget** (推薦方式)：
    ```powershell
    winget install OpenJS.NodeJS.LTS
    ```
  </Tab>
</Tabs>

## 疑難排解

### `openclaw: command not found`
這幾乎總是代表 npm 的全域二進位檔目錄 (Global bin) 尚未加入您的 PATH 環境變數。

1. **尋找 npm 全域前綴路徑**：
   ```bash
   npm prefix -g
   ```
2. **將路徑加入 Shell 設定檔**：
   - **macOS / Linux**：
     將以下內容加入 `~/.zshrc` 或 `~/.bashrc`：
     ```bash
     export PATH="$(npm prefix -g)/bin:$PATH"
     ```
     然後開啟新終端機（或執行 `rehash`）。

### Linux 下執行 `npm install -g` 出現權限錯誤
如果出現 `EACCES` 錯誤，請將 npm 的全域前綴切換至使用者具備寫入權限的目錄：

```bash
mkdir -p "$HOME/.npm-global"
npm config set prefix "$HOME/.npm-global"
export PATH="$HOME/.npm-global/bin:$PATH"
```
建議將此路徑永久加入您的 Shell 設定檔中。
