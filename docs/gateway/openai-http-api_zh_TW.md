---
summary: "從閘道器公開相容於 OpenAI 的 /v1/chat/completions HTTP 端點"
read_when:
  - 整合需要 OpenAI 對話補全 (Chat Completions) 介面的工具時
title: "OpenAI 對話補全 API"
---

> 此文件為 [English Version](/gateway/openai-http-api) 的繁體中文版本。

# OpenAI 對話補全 API (HTTP)

OpenClaw 的閘道器 (Gateway) 可提供一個相容於 OpenAI 的小型對話補全 (Chat Completions) 端點。

此端點 **預設為停用**。請先在組態設定中啟用它。

- `POST /v1/chat/completions`
- 使用與閘道器相同的連接埠（WS + HTTP 多路複用）：`http://<gateway-host>:<port>/v1/chat/completions`

在底層機制上，請求會作為一般的閘道器代理人回合執行（與 `openclaw agent` 使用相同的程式碼路徑），因此路由、權限與組態設定皆與您的閘道器一致。

## 驗證 (Authentication)

使用閘道器的驗證組態。請傳送持有人金鑰 (Bearer token)：

- `Authorization: Bearer <token>`

注意事項：

- 當 `gateway.auth.mode="token"` 時，請使用 `gateway.auth.token`（或環境變數 `OPENCLAW_GATEWAY_TOKEN`）。
- 當 `gateway.auth.mode="password"` 時，請使用 `gateway.auth.password`（或環境變數 `OPENCLAW_GATEWAY_PASSWORD`）。

## 選擇代理人

無需自訂標頭：可將代理人 ID 編碼在 OpenAI 的 `model` 欄位中：

- `model: "openclaw:<agentId>"` (例如：`"openclaw:main"`, `"openclaw:beta"`)
- `model: "agent:<agentId>"` (別名)

或者透過標頭指定特定的 OpenClaw 代理人：

- `x-openclaw-agent-id: <agentId>` (預設值為 `main`)

進階用法：

- 使用 `x-openclaw-session-key: <sessionKey>` 來完全控制對談路由。

## 啟用端點

將 `gateway.http.endpoints.chatCompletions.enabled` 設定為 `true`：

```json5
{
  gateway: {
    http: {
      endpoints: {
        chatCompletions: { enabled: true },
      },
    },
  },
}
```

## 停用端點

將 `gateway.http.endpoints.chatCompletions.enabled` 設定為 `false`：

```json5
{
  gateway: {
    http: {
      endpoints: {
        chatCompletions: { enabled: false },
      },
    },
  },
}
```

## 對談行為

預設情況下，此端點對 **每次請求皆為無狀態 (stateless per request)**（每次調用都會產生新的對談金鑰）。

如果請求中包含 OpenAI 的 `user` 字串，閘道器會據此衍生一個穩定的對談金鑰，使重複的調用能共享同一個代理人會話。

## 串流 (SSE)

設定 `stream: true` 以接收伺服器傳送事件 (Server-Sent Events, SSE)：

- `Content-Type: text/event-stream`
- 每個事件行格式為 `data: <json>`
- 串流以 `data: [DONE]` 結尾

## 範例

非串流模式：

```bash
curl -sS http://127.0.0.1:18789/v1/chat/completions 
  -H 'Authorization: Bearer YOUR_TOKEN' 
  -H 'Content-Type: application/json' 
  -H 'x-openclaw-agent-id: main' 
  -d '{
    "model": "openclaw",
    "messages": [{"role":"user","content":"您好"}]
  }'
```

串流模式：

```bash
curl -N http://127.0.0.1:18789/v1/chat/completions 
  -H 'Authorization: Bearer YOUR_TOKEN' 
  -H 'Content-Type: application/json' 
  -H 'x-openclaw-agent-id: main' 
  -d '{
    "model": "openclaw",
    "stream": true,
    "messages": [{"role":"user","content":"您好"}]
  }'
```
