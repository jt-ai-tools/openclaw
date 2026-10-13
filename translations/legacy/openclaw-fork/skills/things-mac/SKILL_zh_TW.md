---
name: things-mac
description: 透過 macOS 上的 `things` CLI 管理 Things 3（透過 URL 語法新增/更新專案與待辦事項；從本地 Things 資料庫讀取/搜尋/列出）。當使用者要求 OpenClaw 向 Things 新增任務、列出收件匣/今天/即將到來、搜尋任務或檢查專案/區域/標籤時使用。
homepage: https://github.com/ossianhempel/things3-cli
metadata:
  {
    "openclaw":
      {
        "emoji": "✅",
        "os": ["darwin"],
        "requires": { "bins": ["things"] },
        "install":
          [
            {
              "id": "go",
              "kind": "go",
              "module": "github.com/ossianhempel/things3-cli/cmd/things@latest",
              "bins": ["things"],
              "label": "安裝 things3-cli (go)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# Things 3 CLI

使用 `things` 讀取您的本地 Things 資料庫（收件匣、今天、搜尋、專案、區域、標籤），並透過 Things URL 語法 (URL scheme) 新增或更新待辦事項。

## 安裝與設定

- 安裝（建議 Apple Silicon 使用者）：`GOBIN=/opt/homebrew/bin go install github.com/ossianhempel/things3-cli/cmd/things@latest`
- 如果讀取資料庫失敗：請授予呼叫端 App「全域磁碟存取權」（手動執行時為「終端機」；透過閘道器執行時為 `OpenClaw.app`）。
- 選用：設定 `THINGSDB`（或傳遞 `--db`）指向您的 `ThingsData-*` 資料夾。
- 選用：設定 `THINGS_AUTH_TOKEN` 以避免在更新操作時重複傳遞 `--auth-token`。

## 唯讀操作 (DB)

- `things inbox --limit 50` (收件匣)
- `things today` (今天)
- `things upcoming` (即將到來)
- `things search "查詢字串"` (搜尋)
- `things projects` / `things areas` / `things tags` (專案/區域/標籤)

## 寫入操作 (URL scheme)

- 優先使用安全預覽：`things --dry-run add "標題"`
- 新增：`things add "標題" --notes "備註..." --when today --deadline 2026-01-02`
- 將 Things 置於最上層：`things --foreground add "標題"`

### 範例：新增待辦事項

- 基本：`things add "買牛奶"`
- 帶備註：`things add "買牛奶" --notes "全脂 + 香蕉"`
- 加入專案/區域：`things add "訂機票" --list "旅遊"`
- 加入專案標題下：`things add "帶充電器" --list "旅遊" --heading "出發前"`
- 帶標籤：`things add "看牙醫" --tags "健康,電話"`
- 檢查表 (Checklist)：`things add "旅行準備" --checklist-item "護照" --checklist-item "門票"`

### 範例：修改待辦事項（需要授權權杖）

- 第一步：獲取 ID（UUID 欄位）：`things search "牛奶" --limit 5`
- 授權：設定 `THINGS_AUTH_TOKEN` 或傳遞 `--auth-token <TOKEN>`
- 標題：`things update --id <UUID> --auth-token <TOKEN> "新標題"`
- 備註替換：`things update --id <UUID> --auth-token <TOKEN> --notes "新備註"`
- 移動清單：`things update --id <UUID> --auth-token <TOKEN> --list "旅遊" --heading "出發前"`
- 完成/取消：`things update --id <UUID> --auth-token <TOKEN> --completed` / `--canceled`

## 刪除待辦事項？

- 目前 `things3-cli` 不支援刪除操作（無「刪除/移至垃圾桶」的寫入指令；`things trash` 僅供唯讀列出）。
- 替代方案：使用 Things UI 手動刪除，或透過 `things update` 標記為 `--completed` (已完成) 或 `--canceled` (已取消)。

## 注意事項

- 僅限 macOS。
- `--dry-run` 會印出產生的 URL 而不會實際開啟 Things。
