---
summary: "OpenClaw 閘道器 CLI (`openclaw gateway`) —— 執行、查詢與探索閘道器"
read_when:
  - 透過 CLI 執行閘道器時（開發環境或伺服器）
  - 偵錯閘道器驗證、繫結模式與連線問題時
  - 透過 Bonjour 探索區域網路或 Tailnet 中的閘道器時
title: "gateway"
---

> 此文件為 [English Version](/cli/gateway_zh_TW) 的繁體中文版本。

# 閘道器 CLI (Gateway CLI)

閘道器是 OpenClaw 的 WebSocket 伺服器，負責管理頻道、節點、工作階段與勾子。

本頁面中的子指令皆位於 `openclaw gateway …` 之下。

## 相關資訊：
- [/gateway/bonjour](/gateway/bonjour_zh_TW)
- [/gateway/discovery](/gateway/discovery_zh_TW)
- [/gateway/configuration](/gateway/configuration_zh_TW)

## 執行閘道器

執行本地閘道器程序：

```bash
openclaw gateway
```

或使用別名：

```bash
openclaw gateway run
```

## 常用選項

- `--port <port>`：WebSocket 連接埠（預設為 `18789`）。
- `--bind <loopback|lan|tailnet|auto|custom>`：監聽繫結模式。
- `--auth <token|password>`：驗證模式覆寫。
- `--token <token>`：權杖覆寫（同時會為該程序設定 `OPENCLAW_GATEWAY_TOKEN`）。
- `--tailscale <off|serve|funnel>`：透過 Tailscale 公開閘道器。
- `--allow-unconfigured`：允許在組態未設定 `gateway.mode=local` 的情況下啟動。
- `--force`：啟動前先砍掉占用該連接埠的現有監聽程序。

## 查詢執行中的閘道器

所有查詢指令皆透過 WebSocket RPC 執行。

### `gateway health`
檢查閘道器健康狀態。

```bash
openclaw gateway health --url ws://127.0.0.1:18789
```

### `gateway status`
顯示閘道器服務（如 launchd/systemd）狀態，並可選擇執行 RPC 探針。

```bash
openclaw gateway status
openclaw gateway status --json
```

### `gateway probe`
「偵測所有內容」的指令。它一律會偵測：
1. 您配置的遠端閘道器（若有設定）。
2. 本地主機 (localhost)。

#### 透過 SSH 進行遠端連接
macOS App 的「Remote over SSH」模式會建立本地連接埠轉發。CLI 等效指令為：

```bash
openclaw gateway probe --ssh user@gateway-host
```

### `gateway call <method>`
低階 RPC 輔助指令。

```bash
openclaw gateway call status
```

## 管理閘道器服務

```bash
openclaw gateway install (安裝服務)
openclaw gateway start (啟動)
openclaw gateway stop (停止)
openclaw gateway restart (重啟)
openclaw gateway uninstall (解除安裝)
```

## 探索閘道器 (Bonjour)

`gateway discover` 會掃描閘道器信標 (`_openclaw-gw._tcp`)。

```bash
openclaw gateway discover
openclaw gateway discover --timeout 4000
openclaw gateway discover --json | jq '.beacons[].wsUrl'
```
