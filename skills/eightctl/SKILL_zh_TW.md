---
name: eightctl
description: 控制 Eight Sleep 睡眠系統（狀態、溫度、鬧鐘、排程）。
homepage: https://eightctl.sh
metadata:
  {
    "openclaw":
      {
        "emoji": "🎛️",
        "requires": { "bins": ["eightctl"] },
        "install":
          [
            {
              "id": "go",
              "kind": "go",
              "module": "github.com/steipete/eightctl/cmd/eightctl@latest",
              "bins": ["eightctl"],
              "label": "安裝 eightctl (go)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# eightctl

使用 `eightctl` 指令控制 Eight Sleep 睡眠系統。需要身分驗證。

## 驗證

- 組態檔案：`~/.config/eightctl/config.yaml`
- 環境變數：`EIGHTCTL_EMAIL`, `EIGHTCTL_PASSWORD`

## 快速開始

- `eightctl status` (檢查狀態)
- `eightctl on|off` (開啟/關閉)
- `eightctl temp 20` (設定溫度)

## 常用任務

- 鬧鐘：`eightctl alarm list|create|dismiss`
- 排程：`eightctl schedule list|create|update`
- 音訊：`eightctl audio state|play|pause`
- 床底：`eightctl base info|angle`

## 注意事項

- 此 API 為非官方提供且有頻率限制；請避免重複登入。
- 在更改溫度或鬧鐘設定前，請先詢問使用者。
