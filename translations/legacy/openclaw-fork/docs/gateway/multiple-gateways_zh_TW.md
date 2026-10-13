---
summary: "在單一主機上執行多個 OpenClaw 閘道器（隔離、連接埠與設定檔）"
read_when:
  - 在同一台機器上執行多個閘道器時
  - 您需要為每個閘道器設定獨立的組態/狀態/連接埠時
title: "多個閘道器"
---

> 此文件為 [English Version](/gateway/multiple-gateways_zh_TW) 的繁體中文版本。

# 多個閘道器 (單一主機)

大多數的環境應僅使用一個閘道器 (Gateway)，因為單個閘道器即可處理多個通訊連線與代理人。如果您需要更強的隔離性或備援性（例如：救援機器人），請使用隔離的設定檔 (Profiles) 與連接埠執行獨立的閘道器。

## 隔離檢查清單 (必填)

- `OPENCLAW_CONFIG_PATH` — 每個實例專屬的組態檔案
- `OPENCLAW_STATE_DIR` — 每個實例專屬的對談、憑證、快取
- `agents.defaults.workspace` — 每個實例專屬的工作區根目錄
- `gateway.port` (或 `--port`) — 每個實例唯一的連接埠
- 衍生連接埠 (瀏覽器/Canvas) 不可重疊

若共用上述項目，您將會遇到組態競態 (Config races) 與連接埠衝突。

## 建議方式：設定檔 (`--profile`)

使用設定檔功能會自動界定 `OPENCLAW_STATE_DIR` 與 `OPENCLAW_CONFIG_PATH` 的範圍，並為服務名稱加上後綴。

```bash
# 主要 (main)
openclaw --profile main setup
openclaw --profile main gateway --port 18789

# 救援 (rescue)
openclaw --profile rescue setup
openclaw --profile rescue gateway --port 19001
```

各設定檔專屬的服務：

```bash
openclaw --profile main gateway install
openclaw --profile rescue gateway install
```

## 救援機器人指南

在同一台主機上執行第二個閘道器，並具備獨立的：

- 設定檔/組態
- 狀態目錄
- 工作區
- 基礎連接埠（以及衍生連接埠）

這能讓救援機器人與主要機器人隔離，當主要機器人斷線時，救援機器人仍可用於偵錯或套用組態變更。

連接埠間隔：基礎連接埠之間請至少保留 20 個連接埠的間距，以確保衍生的瀏覽器/Canvas/CDP 連接埠不會發生衝突。

### 如何安裝救援機器人

```bash
# 主要機器人 (現有的或全新的，不使用 --profile 參數)
# 執行於連接埠 18789 + Chrome CDC/Canvas/... 等連接埠
openclaw onboard
openclaw gateway install

# 救援機器人 (隔離的設定檔與連接埠)
openclaw --profile rescue onboard
# 注意事項：
# - 工作區名稱預設會加上 -rescue 後綴
# - 連接埠建議至少設為 18789 + 20，
#   最好選擇完全不同的基礎連接埠，例如 19789
# - 其餘引導流程與一般安裝相同

# 安裝服務 (若引導過程中未自動完成)
openclaw --profile rescue gateway install
```

## 連接埠對應 (衍生)

基礎連接埠 = `gateway.port` (或 `OPENCLAW_GATEWAY_PORT` / `--port`)。

- 瀏覽器控制服務連接埠 = 基礎連接埠 + 2 (僅限 loopback)
- `canvasHost.port` = 基礎連接埠 + 4
- 瀏覽器設定檔 CDP 連接埠會從 `browser.controlPort + 9` 到 `+ 108` 之間自動分配

如果您在組態或環境變數中覆寫了上述任何設定，請務必確保每個實例皆為唯一。

## 瀏覽器/CDP 注意事項 (常見的易誤用點)

- **請勿** 在多個實例上將 `browser.cdpUrl` 固定為相同的值。
- 每個實例都需要自己的瀏覽器控制連接埠與 CDP 範圍（衍生自其閘道器連接埠）。
- 若您需要明確指定 CDP 連接埠，請在各實例中設定 `browser.profiles.<名稱>.cdpPort`。
- 遠端 Chrome：針對各實例中的每個設定檔使用 `browser.profiles.<名稱>.cdpUrl`。

## 手動設定環境變數範例

```bash
OPENCLAW_CONFIG_PATH=~/.openclaw/main.json 
OPENCLAW_STATE_DIR=~/.openclaw-main 
openclaw gateway --port 18789

OPENCLAW_CONFIG_PATH=~/.openclaw/rescue.json 
OPENCLAW_STATE_DIR=~/.openclaw-rescue 
openclaw gateway --port 19001
```

## 快速檢查

```bash
openclaw --profile main status
openclaw --profile rescue status
openclaw --profile rescue browser status
```
