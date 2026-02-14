---
summary: "為閘道器儀表板整合 Tailscale Serve/Funnel 功能"
read_when:
  - 在 localhost 之外公開閘道器控制 UI 時
  - 自動化 Tailnet 或公開儀表板存取時
title: "Tailscale"
---

> 此文件為 [English Version](/gateway/tailscale_zh_TW) 的繁體中文版本。

# Tailscale (閘道器儀表板)

OpenClaw 可以為閘道器 (Gateway) 儀表板與 WebSocket 連接埠自動設定 Tailscale **Serve** (Tailnet 內部) 或 **Funnel** (公開)。這能讓閘道器保持綁定在迴路位址 (loopback)，同時由 Tailscale 提供 HTTPS、路由以及（針對 Serve 模式）識別標頭 (identity headers)。

## 模式 (Modes)

- `serve`：透過 `tailscale serve` 提供的僅限 Tailnet 內部存取。閘道器仍維持在 `127.0.0.1`。
- `funnel`：透過 `tailscale funnel` 提供的公開 HTTPS。OpenClaw 要求必須設定共享密碼。
- `off`：預設值（不使用 Tailscale 自動化）。

## 驗證 (Auth)

設定 `gateway.auth.mode` 來控制連線交握：

- `token`（當設定 `OPENCLAW_GATEWAY_TOKEN` 時的預設值）
- `password`（透過 `OPENCLAW_GATEWAY_PASSWORD` 或組態設定的共享秘密）

當 `tailscale.mode = "serve"` 且 `gateway.auth.allowTailscale` 為 `true` 時，有效的 Serve 代理請求可以透過 Tailscale 識別標頭 (`tailscale-user-login`) 進行驗證，而無需提供 Token 或密碼。OpenClaw 會透過本地 Tailscale 守護行程 (`tailscale whois`) 解析 `x-forwarded-for` 位址來驗證身分，並在接受請求前與標頭進行比對。OpenClaw 僅在請求來自 loopback 且包含 Tailscale 注入的 `x-forwarded-for`, `x-forwarded-proto`, 與 `x-forwarded-host` 標頭時，才會將其視為 Serve 請求。
若要要求明確的憑證，請將 `gateway.auth.allowTailscale` 設為 `false` 或強制設定 `gateway.auth.mode: "password"`。

## 組態範例

### 僅限 Tailnet 內部 (Serve)

```json5
{
  gateway: {
    bind: "loopback",
    tailscale: { mode: "serve" },
  },
}
```

開啟網址：`https://<magicdns>/`（或您設定的 `gateway.controlUi.basePath`）

### 僅限 Tailnet 內部 (直接綁定至 Tailnet IP)

當您希望閘道器直接監聽 Tailnet IP（不使用 Serve/Funnel）時，請使用此方式。

```json5
{
  gateway: {
    bind: "tailnet",
    auth: { mode: "token", token: "您的-token" },
  },
}
```

從另一個 Tailnet 裝置連線：

- 控制 UI：`http://<tailscale-ip>:18789/`
- WebSocket：`ws://<tailscale-ip>:18789`

注意：在此模式下，迴路位址 (`http://127.0.0.1:18789`) 將 **無法** 運作。

### 公開網際網路 (Funnel + 共享密碼)

```json5
{
  gateway: {
    bind: "loopback",
    tailscale: { mode: "funnel" },
    auth: { mode: "password", password: "請替換我" },
  },
}
```

建議使用 `OPENCLAW_GATEWAY_PASSWORD` 環境變數，而非將密碼寫入磁碟檔案。

## CLI 範例

```bash
openclaw gateway --tailscale serve
openclaw gateway --tailscale funnel --auth password
```

## 注意事項

- 使用 Tailscale Serve/Funnel 需要先安裝 `tailscale` CLI 並完成登入。
- `tailscale.mode: "funnel"` 除非驗證模式為 `password` 否則拒絕啟動，以避免不必要的公開曝露。
- 如果您希望 OpenClaw 在關閉時撤銷 `tailscale serve` 或 `tailscale funnel` 設定，請設定 `gateway.tailscale.resetOnExit`。
- `gateway.bind: "tailnet"` 是直接綁定 Tailnet IP（無 HTTPS，不使用 Serve/Funnel）。
- `gateway.bind: "auto"` 優先使用 loopback；如果您僅想要 Tailnet 存取，請明確使用 `tailnet`。
- Serve/Funnel 僅公開 **閘道器控制 UI + WS**。節點 (Nodes) 是透過同一個閘道器 WS 端點連線，因此 Serve 模式也適用於節點存取。

## 瀏覽器控制 (遠端閘道器 + 本地瀏覽器)

如果您在一台機器上執行閘道器，但想操作另一台機器上的瀏覽器，請在瀏覽器所在的機器執行 **節點主機 (node host)**，並確保兩者皆位於同一個 Tailnet 中。閘道器會將瀏覽器動作代理至該節點；無需額外的控制伺服器或 Serve URL。

請避免使用 Funnel 進行瀏覽器控制；應將節點配對視同操作員級別的存取權限。

## Tailscale 前置要求與限制

- Serve 模式需要為您的 Tailnet 啟用 HTTPS；若未啟用，CLI 會發出提示。
- Serve 模式會注入 Tailscale 識別標頭；Funnel 則不會。
- Funnel 需要 Tailscale v1.38.3+、MagicDNS、啟用 HTTPS 以及 funnel 節點屬性。
- Funnel 在 TLS 上僅支援連接埠 `443`、`8443` 與 `10000`。
- macOS 上的 Funnel 功能需要安裝開源版的 Tailscale App。

## 瞭解更多

- Tailscale Serve 概觀：[https://tailscale.com/kb/1312/serve](https://tailscale.com/kb/1312/serve)
- `tailscale serve` 指令說明：[https://tailscale.com/kb/1242/tailscale-serve](https://tailscale.com/kb/1242/tailscale-serve)
- Tailscale Funnel 概觀：[https://tailscale.com/kb/1223/tailscale-funnel](https://tailscale.com/kb/1223/tailscale-funnel)
- `tailscale funnel` 指令說明：[https://tailscale.com/kb/1311/tailscale-funnel](https://tailscale.com/kb/1311/tailscale-funnel)
