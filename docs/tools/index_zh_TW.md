---
summary: "OpenClaw 的代理人工具介面（包含瀏覽器、畫布、節點、訊息、Cron），取代舊有的 `openclaw-*` 技能"
read_when:
  - 新增或修改代理人工具時
  - 停用或更改 `openclaw-*` 技能時
title: "工具"
---

> 此文件為 [English Version](/tools/index_zh_TW) 的繁體中文版本。

# 工具 (Tools - OpenClaw)

OpenClaw 公開了 **一等代理人工具 (First-class agent tools)**，用於瀏覽器、畫布、節點與排程 (Cron)。這些工具取代了舊有的 `openclaw-*` 技能：工具是具備類型的 (Typed)，不再需要透過 Shell 呼叫，代理人應直接依賴它們。

## 停用工具

您可以在 `openclaw.json` 中透過 `tools.allow` / `tools.deny` 全域性地允許或拒絕工具（拒絕優先權較高）。這可以防止不被允許的工具被發送給模型提供者。

```json5
{
  tools: { deny: ["browser"] },
}
```

注意事項：
- 匹配不分大小寫。
- 支援 `*` 萬用字元（`"*"` 代表所有工具）。

## 工具設定檔 (Tool profiles)

`tools.profile` 在 `tools.allow`/`tools.deny` 之前設定一個 **基礎工具允許清單**。

設定檔類型：
- `minimal`：僅限 `session_status`。
- `coding`：`group:fs`, `group:runtime`, `group:sessions`, `group:memory`, `image`。
- `messaging`：`group:messaging`, `sessions_list`, `sessions_history`, `sessions_send`, `session_status`。
- `full`：無限制（與未設定相同）。

## 針對提供者的工具策略

使用 `tools.byProvider` 可針對特定提供者（或單一 `提供者/模型`）進一步限制工具，而無需更改您的全域預設值。

## 工具群組 (Shorthands)

工具策略支援 `group:*` 項目，可展開為多個工具：

- `group:runtime`：`exec`, `bash`, `process`
- `group:fs`：`read`, `write`, `edit`, `apply_patch`
- `group:sessions`：`sessions_list`, `sessions_history`, `sessions_send`, `sessions_spawn`, `session_status`
- `group:memory`：`memory_search`, `memory_get`
- `group:web`：`web_search`, `web_fetch`
- `group:ui`：`browser`, `canvas`
- `group:automation`：`cron`, `gateway`
- `group:messaging`：`message`
- `group:nodes`：`nodes`
- `group:openclaw`：所有內建的 OpenClaw 工具。

## 工具清單 (Tool inventory)

### `exec`
在工作區執行 Shell 指令。支援背景執行、逾時設定、權限提升 (`elevated`) 以及針對特定節點 (`host=node`) 執行。

### `process`
管理背景執行的工作階段。支援 `list`, `poll`, `log`, `write`, `kill` 等動作。

### `web_search`
使用 Brave Search API 進行網頁搜尋。需要 `BRAVE_API_KEY`。

### `web_fetch`
從 URL 獲取並擷取可讀內容（HTML 轉為 Markdown/純文字）。

### `browser`
控制 OpenClaw 管理的專用瀏覽器。支援分頁管理、快照 (Snapshot)、螢幕截圖以及 UI 自動化動作（點擊、輸入等）。

### `canvas`
操作節點畫布。支援呈現網頁內容、執行 JavaScript、擷取截圖以及 A2UI 推送。

### `nodes`
探索與操作已配對的節點。支援發送通知、執行系統指令、相機擷取、螢幕錄製與獲取位置。

### `image`
使用配置的圖片模型分析圖片。

### `message`
跨多個通訊頻道發送訊息與執行動作（Discord, Slack, Telegram, WhatsApp 等）。

### `cron`
管理閘道器的 Cron 任務與喚醒觸發。

### `gateway`
重啟或套用更新至執行中的閘道器程序。

### `sessions_*` / `session_status`
列出工作階段、檢查歷史逐字稿、發送訊息至其它工作階段或啟動子代理人任務。

## 推薦的代理人工作流

**瀏覽器自動化：**
1. `browser` → `status` / `start`
2. `snapshot` (ai 或 aria)
3. `act` (點擊/輸入/按鍵)
4. 若需要視覺確認，執行 `screenshot`

**畫布渲染：**
1. `canvas` → `present`
2. `a2ui_push` (選用)
3. `snapshot`

**鎖定節點：**
1. `nodes` → `status`
2. 對選定節點執行 `describe`
3. 執行 `notify` / `run` / `camera_snap` 等。
