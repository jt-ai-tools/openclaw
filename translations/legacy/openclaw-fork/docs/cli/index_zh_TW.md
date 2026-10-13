---
summary: "OpenClaw CLI `openclaw` 指令、子指令與選項的完整參考"
read_when:
  - 新增或修改 CLI 指令或選項時
  - 為新的指令介面撰寫文件時
title: "CLI 參考"
---

> 此文件為 [English Version](/cli/index_zh_TW) 的繁體中文版本。

# CLI 參考 (CLI reference)

本頁面描述了目前的 CLI 行為。如果指令有所變更，請務必更新此文件。

## 指令分頁

- [`setup`](/cli/setup_zh_TW) - 設定
- [`onboard`](/cli/onboard_zh_TW) - 引導設定
- [`configure`](/cli/configure_zh_TW) - 指令式配置
- [`config`](/cli/config_zh_TW) - 組態讀寫
- [`doctor`](/cli/doctor_zh_TW) - 診斷修復
- [`status`](/cli/status_zh_TW) - 狀態檢查
- [`health`](/cli/health_zh_TW) - 健康狀態
- [`gateway`](/cli/gateway_zh_TW) - 閘道器管理
- [`logs`](/cli/logs_zh_TW) - 日誌追蹤
- [`models`](/cli/models_zh_TW) - 模型管理
- [`channels`](/cli/channels_zh_TW) - 頻道管理
- [`plugins`](/cli/plugins_zh_TW) - 外掛程式管理
- [`cron`](/cli/cron_zh_TW) - 排程管理
- [`node`](/cli/node_zh_TW) - 節點主機管理
- [`nodes`](/cli/nodes_zh_TW) - 已連線節點操作
- [`browser`](/cli/browser_zh_TW) - 瀏覽器控制
- [`tui`](/cli/tui_zh_TW) - 終端機 UI

## 全域旗標 (Global flags)

- `--dev`：將狀態隔離於 `~/.openclaw-dev` 並偏移預設連接埠。
- `--profile <名稱>`：將狀態隔離於 `~/.openclaw-<名稱>`。
- `--no-color`：停用 ANSI 顏色。
- `--update`：`openclaw update` 的簡寫（僅適用於原始碼安裝）。
- `-V`, `--version`, `-v`：顯示版本資訊並退出。

## 輸出樣式

- ANSI 顏色與進度指示器僅在 TTY 工作階段中渲染。
- OSC-8 超連結在支援的終端機中會顯示為可點擊連結；否則回退至純文字 URL。
- `--json` (以及在支援處的 `--plain`) 會停用樣式以獲得乾淨的輸出。
- 耗時較長的指令會顯示進度指示器。

## 配色方案 (Color palette)

OpenClaw 使用「龍蝦配色 (Lobster palette)」進行 CLI 輸出：

- `accent` (#FF5A2D)：標題、標籤、主要強調。
- `accentBright` (#FF7A3D)：指令名稱。
- `accentDim` (#D14A22)：次要強調文字。
- `info` (#FF8A5B)：資訊數值。
- `success` (#2FBF71)：成功狀態。
- `warn` (#FFB020)：警告、備援、注意。
- `error` (#E23D2D)：錯誤、失敗。
- `muted` (#8B7F77)：去強調、詮釋資料。

## 指令樹 (Command tree)

```
openclaw [--dev] [--profile <名稱>] <指令>
  setup (設定)
  onboard (引導設定)
  configure (互動式配置)
  config (組態操作)
    get / set / unset
  doctor (診斷修復)
  security (安全性)
    audit (審計)
  channels (頻道)
    list / status / logs / add / remove / login / logout
  skills (技能)
    list / info / check
  plugins (外掛程式)
    list / info / install / enable / disable / doctor
  memory (記憶)
    status / index / search
  message (訊息傳送)
  agent (單次執行)
  agents (多代理人管理)
    list / add / delete
  status (狀態概觀)
  health (閘道器健康)
  sessions (工作階段列表)
  gateway (閘道器控制)
    health / status / probe / discover / install / start / stop / restart / run
  logs (日誌追蹤)
  system (系統事件)
    event / heartbeat / presence
  models (模型)
    list / status / set / scan / auth
  cron (排程任務)
    status / list / add / edit / rm / enable / disable / runs / run
  nodes (已連線節點)
  devices (裝置)
  node (節點主機)
    run / status / install / uninstall / start / stop / restart
  approvals (核准管理)
    get / set / allowlist
  browser (瀏覽器控制)
    status / start / stop / tabs / open / focus / screenshot / navigate / click / type
  hooks (勾子管理)
  pairing (配對核准)
  docs (文件搜尋)
  tui (終端機 UI)
```

## 安全性

- `openclaw security audit` — 審計組態與本地狀態以發現常見安全隱患。
- `openclaw security audit --deep` — 盡力而為的即時閘道器探針檢查。
- `openclaw security audit --fix` — 加強安全預設值並調整檔案權限。

## 記憶 (Memory)

針對 `MEMORY.md` 與 `memory/*.md` 進行向量搜尋：

- `openclaw memory status` — 顯示索引統計。
- `openclaw memory index` — 重新建立記憶檔案索引。
- `openclaw memory search "<查詢>"` — 針對記憶進行語義搜尋。

## 引導設定與基礎設定

### `setup`
初始化組態與工作區。

### `onboard`
設定閘道器、工作區與技能的互動式精靈。支援 `--reset`、`--flow`（快速開始/進階/手動）以及多種驗證選項。

### `configure`
互動式組態精靈（模型、頻道、技能、閘道器）。

### `config`
非互動式的組態輔助工具（get/set/unset）。若不帶子指令執行則啟動精靈。

### `doctor`
健康檢查與快速修復（組態 + 閘道器 + 舊版服務）。

## 頻道輔助工具

### `channels`
管理通訊頻道帳號。支援 WhatsApp, Telegram, Discord, Slack, Signal, iMessage, Teams 等。
- `channels status`：檢查閘道器可達性與頻道健康度。
- `channels logs`：顯示來自閘道器的最近頻道日誌。

## 訊息與代理人

### `message`
統一的傳出訊息與頻道動作。支援發送、回應表情、編輯、刪除、釘選、執行緒管理等。

### `agent`
透過閘道器執行一次性的代理人回合。需使用 `--message` 參數。

### `agents`
管理隔離的代理人實例（獨立的工作區、驗證與路由）。

## 閘道器 (Gateway)

### `gateway service`
管理閘道器服務（如 launchd, systemd）。支援 `status`, `install`, `uninstall`, `start`, `stop`, `restart`。

### `logs`
透過 RPC 即時追蹤閘道器記錄檔。TTY 工作階段會渲染上色的結構化視圖。

## 模型 (Models)

- `models list`：列出可用模型。
- `models status`：檢查驗證狀態與 OAuth 過期情況。使用 `--probe` 可執行即時探針測試。
- `models set <model>`：設定主要的預設模型。
- `models scan`：自動掃描並探索提供者支援的新模型。

## 節點與瀏覽器

- `nodes`：與已配對的節點通訊。支援相機、畫布、位置獲取與指令執行。
- `browser`：控制專用的 Chrome/Chromium 瀏覽器。支援導覽、截圖、點擊、輸入、上傳檔案等自動化操作。
