---
summary: "閘道器 WebSocket 通訊協定：交握、框架、版本管理"
read_when:
  - 實作或更新閘道器 WS 用戶端時
  - 偵錯通訊協定不符或連線失敗時
  - 重新產生通訊協定架構/模型時
title: "閘道器通訊協定"
---

> 此文件為 [English Version](/gateway/protocol_zh_TW) 的繁體中文版本。

# 閘道器通訊協定 (WebSocket)

閘道器 WS 通訊協定是 OpenClaw 的 **單一控制平面 + 節點傳輸** 機制。所有用戶端（CLI、網頁 UI、macOS App、iOS/Android 節點、無頭節點）皆透過 WebSocket 連線，並在交握 (Handshake) 時宣告其 **角色 (Role)** 與 **範圍 (Scope)**。

## 傳輸方式

- WebSocket，文字框架 (Text frames) 搭配 JSON 負載。
- 第一個框架 **必須** 是 `connect` 請求。

## 交握 (connect)

閘道器 → 用戶端（連線前挑戰）：

```json
{
  "type": "event",
  "event": "connect.challenge",
  "payload": { "nonce": "…", "ts": 1737264000000 }
}
```

用戶端 → 閘道器：

```json
{
  "type": "req",
  "id": "…",
  "method": "connect",
  "params": {
    "minProtocol": 3,
    "maxProtocol": 3,
    "client": {
      "id": "cli",
      "version": "1.2.3",
      "platform": "macos",
      "mode": "operator"
    },
    "role": "operator",
    "scopes": ["operator.read", "operator.write"],
    "caps": [],
    "commands": [],
    "permissions": {},
    "auth": { "token": "…" },
    "locale": "zh-TW",
    "userAgent": "openclaw-cli/1.2.3",
    "device": {
      "id": "裝置指紋",
      "publicKey": "…",
      "signature": "…",
      "signedAt": 1737264000000,
      "nonce": "…"
    }
  }
}
```

閘道器 → 用戶端：

```json
{
  "type": "res",
  "id": "…",
  "ok": true,
  "payload": { "type": "hello-ok", "protocol": 3, "policy": { "tickIntervalMs": 15000 } }
}
```

當發放裝置 Token 時，`hello-ok` 也會包含：

```json
{
  "auth": {
    "deviceToken": "…",
    "role": "operator",
    "scopes": ["operator.read", "operator.write"]
  }
}
```

### 節點範例 (Node example)

```json
{
  "type": "req",
  "id": "…",
  "method": "connect",
  "params": {
    "minProtocol": 3,
    "maxProtocol": 3,
    "client": {
      "id": "ios-node",
      "version": "1.2.3",
      "platform": "ios",
      "mode": "node"
    },
    "role": "node",
    "scopes": [],
    "caps": ["camera", "canvas", "screen", "location", "voice"],
    "commands": ["camera.snap", "canvas.navigate", "screen.record", "location.get"],
    "permissions": { "camera.capture": true, "screen.record": false },
    "auth": { "token": "…" },
    "locale": "zh-TW",
    "userAgent": "openclaw-ios/1.2.3",
    "device": {
      "id": "裝置指紋",
      "publicKey": "…",
      "signature": "…",
      "signedAt": 1737264000000,
      "nonce": "…"
    }
  }
}
```

## 框架結構 (Framing)

- **請求 (Request)**：`{type:"req", id, method, params}`
- **回應 (Response)**：`{type:"res", id, ok, payload|error}`
- **事件 (Event)**：`{type:"event", event, payload, seq?, stateVersion?}`

具副作用的方法需要提供 **冪等性金鑰 (idempotency keys)**（詳見架構定義）。

## 角色與範圍

### 角色 (Roles)

- `operator` = 控制平面用戶端 (CLI/UI/自動化)。
- `node` = 能力宿主 (相機/螢幕/Canvas/system.run)。

### 範圍 (Scopes，針對操作員)

常見範圍：

- `operator.read`
- `operator.write`
- `operator.admin`
- `operator.approvals`
- `operator.pairing`

### 能力/指令/權限 (Caps/commands/permissions，針對節點)

節點在連線時宣告其能力聲明：

- `caps`: 高階能力類別。
- `commands`: 供調用的指令允許清單。
- `permissions`: 細粒度的開關（例如 `screen.record`、`camera.capture`）。

閘道器將這些視為 **宣告 (claims)**，並在伺服器端執行允許清單強制控管。

## 在線狀態 (Presence)

- `system-presence` 傳回以裝置識別為鍵值的項目。
- 在線狀態項目包含 `deviceId`、`roles` 與 `scopes`，以便 UI 介面為同一個裝置顯示單一列，即使該裝置同時以 **操作員** 與 **節點** 身分連線。

### 節點輔助方法

- 節點可以調用 `skills.bins` 來獲取目前的技能執行檔列表，以便進行自動允許檢查。

## 執行核准 (Exec approvals)

- 當執行請求需要核准時，閘道器會廣播 `exec.approval.requested`。
- 操作員用戶端透過調用 `exec.approval.resolve` 來解決請求（需要 `operator.approvals` 範圍）。

## 版本管理

- `PROTOCOL_VERSION` 定義於 `src/gateway/protocol/schema.ts`。
- 用戶端傳送 `minProtocol` + `maxProtocol`；伺服器會拒絕不相符的版本。
- 架構與模型由 TypeBox 定義產生：
  - `pnpm protocol:gen`
  - `pnpm protocol:gen:swift`
  - `pnpm protocol:check`

## 驗證 (Auth)

- 如果設定了 `OPENCLAW_GATEWAY_TOKEN` (或 `--token`)，`connect.params.auth.token` 必須相符，否則通訊端會被關閉。
- 配對成功後，閘道器會發放一個受限於連線角色與範圍的 **裝置 Token**。它會包含在 `hello-ok.auth.deviceToken` 中傳回，用戶端應將其持久化 (persisted) 以供未來連線使用。
- 裝置 Token 可透過 `device.token.rotate` 與 `device.token.revoke` 進行輪替或撤銷（需要 `operator.pairing` 範圍）。

## 裝置識別與配對

- 節點應包含一個衍生自密鑰對指紋的穩定 **裝置識別 (`device.id`)**。
- 閘道器針對每個「裝置 + 角色」發放 Token。
- 新的裝置 ID 需要配對核准，除非啟用了本地自動核准。
- **本地 (Local)** 連線包含迴路位址 (loopback) 與閘道器主機本身的 tailnet 位址（因此同主機的 tailnet 綁定仍可自動核准）。
- 所有 WS 用戶端（操作員 + 節點）在 `connect` 時必須包含 `device` 識別資訊。控制 UI 僅在啟用 `gateway.controlUi.allowInsecureAuth`（或緊急避難用的 `gateway.controlUi.dangerouslyDisableDeviceAuth`）時方可省略。
- 非本地連線必須簽署伺服器提供的 `connect.challenge` 隨機數。

## TLS 與憑證固定 (Pinning)

- WS 連線支援 TLS。
- 用戶端可選擇性地固定閘道器憑證指紋（參見 `gateway.tls` 組態，以及 `gateway.remote.tlsFingerprint` 或 CLI 的 `--tls-fingerprint`）。

## 範圍 (Scope)

此通訊協定公開了 **完整的閘道器 API**（包含狀態、頻道、模型、聊天、代理人、對談、節點、核准等）。確切的介面定義請參考 `src/gateway/protocol/schema.ts` 中的 TypeBox 架構。
