---
name: blucli
description: BluOS CLI (blu) 工具，用於裝置探索、播放控制、分組與音量調整。
homepage: https://blucli.sh
metadata:
  {
    "openclaw":
      {
        "emoji": "🫐",
        "requires": { "bins": ["blu"] },
        "install":
          [
            {
              "id": "go",
              "kind": "go",
              "module": "github.com/steipete/blucli/cmd/blu@latest",
              "bins": ["blu"],
              "label": "安裝 blucli (go)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# blucli (blu)

使用 `blu` 指令控制 Bluesound/NAD 播放器。

## 快速開始

- `blu devices` (尋找裝置)。
- `blu --device <ID> status` (檢查狀態)。
- `blu play|pause|stop` (播放控制)。
- `blu volume set 15` (設定音量)。

## 目標裝置選擇（優先順序）

1. `--device <ID|名稱|別名>`。
2. `BLU_DEVICE` 環境變數。
3. 組態預設值。

## 常用任務

- 分組：`blu group status|add|remove`。
- TuneIn 搜尋與播放：`blu tunein search "查詢字串"`, `blu tunein play "查詢字串"`。

## 注意事項

- 指令腳本建議加上 `--json` 參數。
- 在更改播放狀態前，請先確認目標裝置。
