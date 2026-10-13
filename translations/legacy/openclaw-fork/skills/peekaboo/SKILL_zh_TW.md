---
name: peekaboo
description: 使用 Peekaboo CLI 擷取並自動化操作 macOS 使用者介面 (UI)。
homepage: https://peekaboo.boo
metadata:
  {
    "openclaw":
      {
        "emoji": "👀",
        "os": ["darwin"],
        "requires": { "bins": ["peekaboo"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "steipete/tap/peekaboo",
              "bins": ["peekaboo"],
              "label": "安裝 Peekaboo (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# Peekaboo

Peekaboo 是一個完整的 macOS UI 自動化 CLI 工具：支援擷取/檢查螢幕、鎖定 UI 元件、驅動輸入，以及管理應用程式/視窗/選單。所有指令共用快照快取，並支援 `--json` 格式以便進行腳本處理。

## 功能特色 (CLI 能力)

### 核心功能 (Core)
- `bridge`：檢查 Peekaboo Bridge 主機連線狀態。
- `capture`：即時擷取或影片匯入 + 影格擷取。
- `clean`：清理快照快取與暫存檔。
- `config`：初始化/顯示/編輯組態、提供者、模型與憑證。
- `image`：擷取螢幕截圖（全螢幕/視窗/選單列區域）。
- `learn`：印出完整的代理人指南與工具型錄。
- `list`：列出 App、視窗、螢幕、選單列、權限。
- `permissions`：檢查「螢幕錄製」與「輔助使用」狀態。
- `run`：執行 `.peekaboo.json` 腳本。
- `see`：產生帶註釋的 UI 地圖、快照 ID，以及選用的 AI 分析。

### 互動功能 (Interaction)
- `click`：依 ID/查詢文字/座標點擊，具備智慧等待。
- `drag`：跨元件/座標/Dock 進行拖放。
- `hotkey`：組合鍵，如 `cmd,shift,t`。
- `move`：移動游標，可選用平滑移動。
- `paste`：設定剪貼簿 -> 貼上 -> 還原。
- `press`：特殊按鍵序列。
- `scroll`：方向性捲動（精確定位 + 平滑捲動）。
- `type`：輸入文字與控制鍵。

### 系統管理 (System)
- `app`：啟動/退出/切換/列出 App。
- `clipboard`：讀取/寫入剪貼簿（文字/圖片/檔案）。
- `dialog`：操作/列出系統對話框。
- `dock`：啟動/右鍵點擊/列出 Dock 項目。
- `menu`：點擊/列出應用程式選單。
- `window`：關閉/縮小/放大/移動/縮放/聚焦視窗。

## 快速開始 (推薦流程)

```bash
peekaboo permissions
peekaboo list apps --json
peekaboo see --annotate --path /tmp/peekaboo-see.png
peekaboo click --on B1
peekaboo type "哈囉" --return
```

## 常見鎖定參數 (Targeting)

- **App/視窗**：`--app`, `--pid`, `--window-title`, `--window-id`。
- **快照鎖定**：`--snapshot`（由 `see` 產生的 ID；預設為最新）。
- **元件/座標**：`--on`/`--id`（元件 ID）, `--coords x,y`。
- **聚焦控制**：`--no-auto-focus`, `--space-switch`（切換桌面）。

## 範例

### 查看 -> 點擊 -> 輸入 (最穩定的流程)

```bash
peekaboo see --app Safari --window-title "登入" --annotate --path /tmp/see.png
peekaboo click --on B3 --app Safari
peekaboo type "user@example.com" --app Safari
peekaboo press tab --app Safari
peekaboo type "超級秘密" --app Safari --return
```

### 擷取截圖並分析

```bash
peekaboo image --mode screen --screen-index 0 --retina --path /tmp/screen.png
peekaboo image --app Safari --window-title "儀表板" --analyze "摘要關鍵指標"
```

### App 與視窗管理

```bash
peekaboo app launch "Safari" --open https://example.com
peekaboo window focus --app Safari --window-title "範例"
peekaboo window set-bounds --app Safari --x 50 --y 50 --width 1200 --height 800
```

### 選單、選單列與 Dock

```bash
peekaboo menu click --app Safari --item "新視窗"
peekaboo menu click --app TextEdit --path "格式 > 字體 > 顯示字體"
peekaboo dock launch Safari
```

## 注意事項

- 需要「螢幕錄製」與「輔助使用」權限。
- 在點擊前，建議先執行 `peekaboo see --annotate` 以識別目標元件 ID。
