---
name: apple-reminders
description: 透過 macOS 上的 `remindctl` CLI 管理 Apple 提醒事項（列出、新增、編輯、完成、刪除）。支援清單、日期過濾器以及 JSON/純文字輸出。
homepage: https://github.com/steipete/remindctl
metadata:
  {
    "openclaw":
      {
        "emoji": "⏰",
        "os": ["darwin"],
        "requires": { "bins": ["remindctl"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "steipete/tap/remindctl",
              "bins": ["remindctl"],
              "label": "透過 Homebrew 安裝 remindctl",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# Apple 提醒事項 CLI (remindctl)

使用 `remindctl` 直接從終端機管理 Apple 提醒事項。它支援清單過濾、基於日期的視圖以及用於腳本處理的輸出格式。

## 安裝與設定

- 安裝 (Homebrew)：`brew install steipete/tap/remindctl`
- 從原始碼建置：`pnpm install && pnpm build`（二進位檔位於 `./bin/remindctl`）
- 僅限 macOS 使用；請在提示時授予「提醒事項」存取權限。

## 權限 (Permissions)

- 檢查狀態：`remindctl status`
- 請求授權：`remindctl authorize`

## 查看提醒事項

- 預設（今天）：`remindctl`
- 今天：`remindctl today`
- 明天：`remindctl tomorrow`
- 本週：`remindctl week`
- 已過期：`remindctl overdue`
- 即將到來：`remindctl upcoming`
- 已完成：`remindctl completed`
- 全部：`remindctl all`
- 特定日期：`remindctl 2026-01-04`

## 管理清單 (Manage Lists)

- 列出所有清單：`remindctl list`
- 顯示特定清單：`remindctl list 工作`
- 建立清單：`remindctl list 專案 --create`
- 重新命名清單：`remindctl list 工作 --rename 辦公室`
- 刪除清單：`remindctl list 工作 --delete`

## 建立提醒事項

- 快速新增：`remindctl add "買牛奶"`
- 指定清單與到期日：`remindctl add --title "打電話給媽媽" --list 個人 --due tomorrow`

## 編輯提醒事項

- 編輯標題/到期日：`remindctl edit 1 --title "新標題" --due 2026-01-04`

## 完成提醒事項

- 依 ID 完成：`remindctl complete 1 2 3`

## 刪除提醒事項

- 依 ID 刪除：`remindctl delete 4A83 --force`

## 輸出格式

- JSON（用於腳本）：`remindctl today --json`
- 純文字 TSV：`remindctl today --plain`
- 僅顯示數量：`remindctl today --quiet`

## 日期格式
`--due` 參數與日期過濾器接受以下格式：

- `today`, `tomorrow`, `yesterday`
- `YYYY-MM-DD`
- `YYYY-MM-DD HH:mm`
- ISO 8601 (`2026-01-04T12:34:56Z`)

## 注意事項

- 僅限 macOS。
- 如果存取被拒絕，請至「系統設定」→「隱私權與安全性」→「提醒事項」中啟用終端機或 remindctl 的存取權。
- 如果透過 SSH 執行，請在執行指令的 Mac 本機上授予存取權限。
