---
summary: "透過閘道器 HTTP 端點直接調用單個工具"
read_when:
  - 在不執行完整代理人回合的情況下調用工具時
  - 建置需要強制執行工具原則的自動化流程時
title: "工具調用 API"
---

> 此文件為 [English Version](/gateway/tools-invoke-http-api) 的繁體中文版本。

# 工具調用 API (HTTP)

OpenClaw 的閘道器 (Gateway) 公開了一個簡單的 HTTP 端點，用於直接調用 (Invoke) 單個工具。此端點始終啟用，但受閘道器驗證與工具原則控管。

- `POST /tools/invoke`
- 使用與閘道器相同的連接埠（WS + HTTP 多路複用）：`http://<gateway-host>:<port>/tools/invoke`

預設的最大負載大小為 2 MB。

## 驗證 (Authentication)

使用閘道器的驗證組態。請傳送持有人金鑰 (Bearer token)：

- `Authorization: Bearer <token>`

注意事項：

- 當 `gateway.auth.mode="token"` 時，請使用 `gateway.auth.token`（或環境變數 `OPENCLAW_GATEWAY_TOKEN`）。
- 當 `gateway.auth.mode="password"` 時，請使用 `gateway.auth.password`（或環境變數 `OPENCLAW_GATEWAY_PASSWORD`）。

## 請求主體 (Request body)

```json
{
  "tool": "sessions_list",
  "action": "json",
  "args": {},
  "sessionKey": "main",
  "dryRun": false
}
```

欄位說明：

- `tool` (字串，必填)：要調用的工具名稱。
- `action` (字串，選填)：如果工具架構支援 `action` 且引數負載中省略了它，則會映射至引數中。
- `args` (物件，選填)：工具專屬的引數。
- `sessionKey` (字串，選填)：目標對談金鑰。如果省略或設為 `"main"`，閘道器會使用配置的主會話金鑰（遵循 `session.mainKey` 與預設代理人設定，若在全域範圍則為 `global`）。
- `dryRun` (布林值，選填)：保留供未來使用；目前會被忽略。

## 原則與路由行為

工具的可調用性會經過與閘道器代理人相同的原則鏈 (Policy chain) 過濾：

- `tools.profile` / `tools.byProvider.profile`
- `tools.allow` / `tools.byProvider.allow`
- `agents.<id>.tools.allow` / `agents.<id>.tools.byProvider.allow`
- 群組原則（若對談金鑰對應至群組或頻道）
- 子代理人原則（當使用子代理人對談金鑰調用時）

如果工具被原則禁止，端點將傳回 **404**。

為了協助群組原則解析上下文，您可以選用以下標頭：

- `x-openclaw-message-channel: <頻道>` (例如：`slack`, `telegram`)
- `x-openclaw-account-id: <帳號ID>` (當存在多個帳號時)

## 回應 (Responses)

- `200` → `{ ok: true, result }`
- `400` → `{ ok: false, error: { type, message } }` (無效請求或工具執行錯誤)
- `401` → 未經授權 (Unauthorized)
- `404` → 工具不可用（找不到或不在允許清單中）
- `405` → 方法不被允許 (Method not allowed)

## 範例

```bash
curl -sS http://127.0.0.1:18789/tools/invoke 
  -H 'Authorization: Bearer YOUR_TOKEN' 
  -H 'Content-Type: application/json' 
  -d '{
    "tool": "sessions_list",
    "action": "json",
    "args": {}
  }'
```
