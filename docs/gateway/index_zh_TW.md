---
summary: "閘道器 (Gateway) 服務執行手冊、生命週期與維運說明"
read_when:
  - 執行或偵錯閘道器程序時
title: "閘道器執行手冊"
---

> 此文件為 [English Version](/gateway/index) 的繁體中文版本。

# 閘道器執行手冊

本頁面用於指導閘道器服務的初始啟動與後續維運。

<CardGroup cols={2}>
  <Card title="進階故障排除" icon="siren" href="/gateway/troubleshooting_zh_TW">
    以徵兆為導向的診斷，提供精確的指令步驟與日誌特徵。
  </Card>
  <Card title="組態設定" icon="sliders" href="/gateway/configuration_zh_TW">
    任務導向的設定指南 + 完整的組態參考。
  </Card>
</CardGroup>

## 5 分鐘本地啟動

<Steps>
  <Step title="啟動閘道器">

```bash
openclaw gateway --port 18789
# 將偵錯/追蹤資訊鏡像輸出至 stdio
openclaw gateway --port 18789 --verbose
# 強制結束所選連接埠的監聽程式，然後啟動
openclaw gateway --force
```

  </Step>

  <Step title="驗證服務健康狀態">

```bash
openclaw gateway status
openclaw status
openclaw logs --follow
```

健康的基準：`Runtime: running` 且 `RPC probe: ok`。

  </Step>

  <Step title="確認頻道就緒">

```bash
openclaw channels status --probe
```

  </Step>
</Steps>

<Note>
閘道器組態重新載入功能會監控作用中的組態檔案路徑（解析自設定檔/狀態預設值，或設定好的 `OPENCLAW_CONFIG_PATH`）。
預設模式為 `gateway.reload.mode="hybrid"`。
</Note>

## 執行模型

- 單一永遠在線的程序，負責路由、控制平面與頻道連線。
- 單一多路複用 (multiplexed) 連接埠，用於：
  - WebSocket 控制/RPC
  - HTTP API (相容於 OpenAI、Responses、工具調用)
  - 控制 UI 與鉤子 (Hooks)
- 預設綁定模式：`loopback` (迴路位址)。
- 預設需要驗證 (`gateway.auth.token` / `gateway.auth.password`，或 `OPENCLAW_GATEWAY_TOKEN` / `OPENCLAW_GATEWAY_PASSWORD`)。

### 連接埠與綁定優先順序

| 設定項 | 解析順序 |
| ------------ | ------------------------------------------------------------- |
| 閘道器連接埠 | `--port` → `OPENCLAW_GATEWAY_PORT` → `gateway.port` → `18789` |
| 綁定模式 | CLI/覆寫 → `gateway.bind` → `loopback` |

### 熱重新載入 (Hot reload) 模式

| `gateway.reload.mode` | 行為 |
| --------------------- | ------------------------------------------ |
| `off` | 不重新載入組態 |
| `hot` | 僅套用支援熱載入的變更 |
| `restart` | 遇需重新載入的變更時自動重啟 |
| `hybrid` (預設) | 安全時熱載入，必要時重啟 |

## 維運指令集

```bash
openclaw gateway status
openclaw gateway status --deep
openclaw gateway status --json
openclaw gateway install
openclaw gateway restart
openclaw gateway stop
openclaw logs --follow
openclaw doctor
```

## 遠端存取

偏好方式：Tailscale/VPN。
備援方式：SSH 隧道。

```bash
ssh -N -L 18789:127.0.0.1:18789 user@host
```

接著在本地連線至 `ws://127.0.0.1:18789`。

<Warning>
如果已設定閘道器驗證，即使透過 SSH 隧道，用戶端仍須發送驗證資訊 (`token`/`password`)。
</Warning>

請參閱：[遠端閘道器](/gateway/remote_zh_TW)、[驗證](/gateway/authentication_zh_TW)、[Tailscale](/gateway/tailscale_zh_TW)。

## 服務監控與生命週期

針對生產環境等級的可靠性，請使用受監控的執行方式。

<Tabs>
  <Tab title="macOS (launchd)">

```bash
openclaw gateway install
openclaw gateway status
openclaw gateway restart
openclaw gateway stop
```

LaunchAgent 的標籤為 `ai.openclaw.gateway` (預設) 或 `ai.openclaw.<profile>` (具名設定檔)。`openclaw doctor` 可審計並修復服務組態的偏離 (drift)。

  </Tab>

  <Tab title="Linux (systemd user)">

```bash
openclaw gateway install
systemctl --user enable --now openclaw-gateway[-<profile>].service
openclaw gateway status
```

若要在登出後保持執行，請啟用停留 (lingering)：

```bash
sudo loginctl enable-linger <user>
```

  </Tab>

  <Tab title="Linux (系統服務)">

針對多使用者/永遠在線的主機，請使用系統單元 (system unit)。

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now openclaw-gateway[-<profile>].service
```

  </Tab>
</Tabs>

## 單一主機執行多個閘道器

大多數設定應僅執行 **一個** 閘道器。
僅在需要嚴格隔離/備援（例如救援設定檔）時才使用多個。

每個實例的檢查表：

- 唯一的 `gateway.port`
- 唯一的 `OPENCLAW_CONFIG_PATH`
- 唯一的 `OPENCLAW_STATE_DIR`
- 唯一的 `agents.defaults.workspace`

範例：

```bash
OPENCLAW_CONFIG_PATH=~/.openclaw/a.json OPENCLAW_STATE_DIR=~/.openclaw-a openclaw gateway --port 19001
OPENCLAW_CONFIG_PATH=~/.openclaw/b.json OPENCLAW_STATE_DIR=~/.openclaw-b openclaw gateway --port 19002
```

請參閱：[多個閘道器](/gateway/multiple-gateways_zh_TW)。

### 開發設定檔快速路徑

```bash
openclaw --dev setup
openclaw --dev gateway --allow-unconfigured
openclaw --dev status
```

預設包含隔離的狀態/組態，以及基礎閘道器連接埠 `19001`。

## 通訊協定快速參考（維運視角）

- 用戶端發出的第一個框架必須是 `connect`。
- 閘道器傳回 `hello-ok` 快照（包含 `presence`, `health`, `stateVersion`, `uptimeMs`, 限制/原則）。
- 請求：`req(method, params)` → `res(ok/payload|error)`。
- 常見事件：`connect.challenge`, `agent`, `chat`, `presence`, `tick`, `health`, `heartbeat`, `shutdown`。

代理人執行分為兩個階段：

1. 立即傳回已接受的確認 (`status:"accepted"`)
2. 最終完成回應 (`status:"ok"|"error"`)，中間會串流傳輸 `agent` 事件。

請參閱完整通訊協定文件：[閘道器通訊協定](/gateway/protocol_zh_TW)。

## 維運檢查

### 存活探測 (Liveness)

- 開啟 WS 並發送 `connect`。
- 預期收到包含快照的 `hello-ok` 回應。

### 就緒探測 (Readiness)

```bash
openclaw gateway status
openclaw channels status --probe
openclaw health
```

### 間隔復原

事件不會重放。若發生序號間隔，請在繼續之前重新整理狀態 (`health`, `system-presence`)。

## 常見錯誤特徵

| 特徵 | 可能原因 |
| -------------------------------------------------------------- | ---------------------------------------- |
| `refusing to bind gateway ... without auth` | 非迴路位址綁定且未設定 Token/密碼 |
| `another gateway instance is already listening` / `EADDRINUSE` | 連接埠衝突 |
| `Gateway start blocked: set gateway.mode=local` | 組態設定為遠端模式 |
| `unauthorized` during connect | 用戶端與閘道器之間的驗證資訊不符 |

關於完整的診斷流程，請使用 [閘道器故障排除](/gateway/troubleshooting_zh_TW)。

## 安全保障

- 當閘道器無法使用時，通訊協定用戶端會快速失敗（不含隱含的直接頻道備援）。
- 無效或非 `connect` 的首個框架將被拒絕並關閉連線。
- 優雅關閉會在通訊端關閉前發出 `shutdown` 事件。

---

相關內容：

- [故障排除](/gateway/troubleshooting_zh_TW)
- [後台程序](/gateway/background-process_zh_TW)
- [組態設定](/gateway/configuration_zh_TW)
- [健康狀態](/gateway/health_zh_TW)
- [Doctor 指令](/gateway/doctor_zh_TW)
- [驗證](/gateway/authentication_zh_TW)
