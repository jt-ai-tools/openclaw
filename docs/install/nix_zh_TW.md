---
summary: "使用 Nix 宣告式安裝 OpenClaw"
read_when:
  - 您想要可重現、可回滾的安裝方式時
  - 您已經在使用 Nix/NixOS/Home Manager 時
  - 您想要透過宣告式管理所有版本鎖定與組態時
title: "Nix"
---

> 此文件為 [English Version](/install/nix_zh_TW) 的繁體中文版本。

# Nix 安裝指南

在 Nix 上執行 OpenClaw 的推薦方式是透過 **[nix-openclaw](https://github.com/openclaw/nix-openclaw)** —— 一個功能完備的 Home Manager 模組。

## 快速開始

您可以要求您的 AI 代理人執行以下任務：
1. 檢查是否已安裝 Determinate Nix。
2. 根據模板建立一個本地 Flake。
3. 設定必要的秘密資訊（機器人權杖、API 密鑰）。
4. 執行 `home-manager switch` 並驗證服務是否正常啟動。

> **📦 完整指南請參閱：[github.com/openclaw/nix-openclaw](https://github.com/openclaw/nix-openclaw)**

---

## Nix 模式執行行為

當設定了 `OPENCLAW_NIX_MODE=1`（nix-openclaw 會自動設定）時：

OpenClaw 會進入 **Nix 模式**，這會使組態變得確定性，並停用自動安裝流程。

### 組態與狀態路徑
- `OPENCLAW_STATE_DIR`：可變動數據的儲存位置（預設 `~/.openclaw`）。
- `OPENCLAW_CONFIG_PATH`：組態檔案位置（預設為狀態目錄下的 `openclaw.json`）。

在 Nix 環境下，請將這些路徑指向 Nix 管理的目錄，以確保執行時期狀態不會進入不可變的 Nix Store。

### Nix 模式下的特性
- 停用自動安裝與自我變更 (Self-mutation) 流程。
- 若缺少相依性，會顯示針對 Nix 環境的修復建議。
- 使用者介面會顯示唯讀的 Nix 模式橫幅。

## 相關連結
- [nix-openclaw 專案](https://github.com/openclaw/nix-openclaw)
- [引導精靈 (Wizard)](/start/wizard_zh_TW) —— 非 Nix 的 CLI 設定方式。
