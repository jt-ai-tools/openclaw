---
summary: "`openclaw update` (原始碼安全更新與閘道器自動重啟) 的 CLI 參考資料"
read_when:
  - 您想要安全地更新原始碼簽出版本時
  - 您需要了解 `--update` 簡寫行為時
title: "update"
---

> 此文件為 [English Version](/cli/update_zh_TW) 的繁體中文版本。

# `openclaw update`

安全地更新 OpenClaw 並在 stable/beta/dev 頻道間進行切換。

如果您是透過 **npm/pnpm** 安裝（全域安裝，無 Git 詮釋資料），請參考 [更新指南](/install/updating_zh_TW) 中的套件管理員流程。

## 用法

```bash
openclaw update
openclaw update status (狀態)
openclaw update wizard (精靈模式)
openclaw update --channel beta
openclaw update --channel dev
openclaw update --no-restart (不自動重啟)
openclaw update --json
openclaw --update (簡寫)
```

## 選項

- `--no-restart`：更新成功後跳過重啟閘道器服務。
- `--channel <stable|beta|dev>`：設定更新頻道（Git + npm；會持久化儲存在組態中）。
- `--tag <dist-tag|版本>`：僅針對此次更新覆寫 npm 標籤或版本。
- `--json`：印出機器可讀的更新結果 JSON。
- `--timeout <秒數>`：每個步驟的逾時時間（預設為 1200 秒）。

**注意**：降級版本需要確認，因為舊版本可能會導致現有組態損壞。

## `update status`

顯示目前的更新頻道、Git 標籤/分支/SHA，以及更新可用性。

```bash
openclaw update status
openclaw update status --json
```

## `update wizard`

互動式流程，引導您挑選更新頻道，並確認更新後是否重啟閘道器。如果您在沒有 Git 簽出的情況下選擇 `dev` 頻道，精靈會提議為您建立一個。

## 工作原理

當您明確切換頻道時，OpenClaw 會保持安裝方法的一致性：

- `dev` → 確保存在 Git 簽出（預設：`~/openclaw`），更新該簽出，並從該位置安裝全域 CLI。
- `stable`/`beta` → 使用對應的標籤從 npm 安裝。

## Git 簽出流程

高層級邏輯：
1. 要求工作區保持乾淨（無未提交的變更）。
2. 切換至選定的頻道。
3. Dev 頻道專屬：在臨時工作區進行前置 Lint 與 TypeScript 建置檢查。若最新提交建置失敗，會向後尋找最多 10 個提交以找出最新的乾淨建置。
4. 執行 Rebase (僅限 Dev)。
5. 安裝依賴項（優先使用 pnpm）。
6. 建置核心功能與控制介面 (Control UI)。
7. 執行 `openclaw doctor` 作為最後的安全檢查。
8. 將外掛程式同步至目前的頻道。

## `--update` 簡寫

`openclaw --update` 會被改寫為 `openclaw update`，適用於 Shell 或啟動腳本。

## 相關連結

- `openclaw doctor`
- [開發頻道 (Development channels)](/install/development-channels_zh_TW)
- [更新指南 (Updating)](/install/updating_zh_TW)
