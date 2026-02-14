---
summary: "`openclaw hooks` (代理人勾子) 的 CLI 參考資料"
read_when:
  - 您想要管理代理人勾子時
  - 您想要安裝或更新勾子時
title: "hooks"
---

> 此文件為 [English Version](/cli/hooks_zh_TW) 的繁體中文版本。

# `openclaw hooks`

管理代理人勾子 (Agent hooks) —— 這些是針對 `/new`、`/reset` 指令以及閘道器啟動等事件觸發的自動化功能。

## 相關資訊：
- 勾子系統說明：[勾子 (Hooks)](/automation/hooks_zh_TW)
- 外掛程式勾子：[外掛程式勾子說明](/tools/plugin_zh_TW#plugin-hooks)

## 列出所有勾子

```bash
openclaw hooks list
```

列出所有從工作區、受控目錄及內建目錄中發現的勾子。

**選項說明：**
- `--eligible`：僅顯示符合執行資格（相依性已滿足）的勾子。
- `--json`：以 JSON 格式輸出。
- `-v, --verbose`：顯示詳細資訊，包含缺少的必要條件。

## 獲取勾子資訊

```bash
openclaw hooks info <名稱>
```

顯示特定勾子的詳細資訊。

## 啟用勾子

```bash
openclaw hooks enable <名稱>
```

藉由修改您的組態檔案 (`~/.openclaw/config.json`) 來啟用特定勾子。

**注意**：由外掛程式管理的勾子在 `openclaw hooks list` 中會顯示 `plugin:<ID>`，且無法在此處啟用/停用。請改為啟用/停用該外掛程式。

**啟用後注意事項：**
- 請重啟閘道器以重新載入勾子（macOS 請重啟選單列 App，開發環境請重啟閘道器程序）。

## 停用勾子

```bash
openclaw hooks disable <名稱>
```

## 安裝勾子

```bash
openclaw hooks install <路徑或規範>
```

從本地資料夾、壓縮檔或 npm 安裝勾子包。安裝後會自動將其加入組態並啟用。

## 更新勾子

```bash
openclaw hooks update <ID>
openclaw hooks update --all
```

更新已安裝的勾子包（僅適用於從 npm 安裝的勾子）。

## 內建勾子介紹

### session-memory
當您執行 `/new` 指令時，自動將工作階段上下文儲存至記憶體。
- **儲存路徑**：`~/.openclaw/workspace/memory/YYYY-MM-DD-slug.md`

### command-logger
將所有的指令事件記錄到一個集中的稽核日誌檔案中。
- **儲存路徑**：`~/.openclaw/logs/commands.log`

### boot-md
當閘道器啟動時（在頻道啟動後）自動執行 `BOOT.md` 中的內容。
