---
summary: "從閘道器公開相容於 OpenResponses 的 /v1/responses HTTP 端點"
read_when:
  - 整合使用 OpenResponses API 的用戶端時
  - 您需要基於項目的輸入、用戶端工具調用或 SSE 事件時
title: "OpenResponses API"
---

> 此文件為 [English Version](/gateway/openresponses-http-api) 的繁體中文版本。

# OpenResponses API (HTTP)

OpenClaw 的閘道器 (Gateway) 可提供相容於 OpenResponses 的 `POST /v1/responses` 端點。

此端點 **預設為停用**。請先在組態設定中啟用它。

- `POST /v1/responses`
- 使用與閘道器相同的連接埠（WS + HTTP 多路複用）：`http://<gateway-host>:<port>/v1/responses`

在底層機制上，請求會作為一般的閘道器代理人回合執行（與 `openclaw agent` 使用相同的程式碼路徑），因此路由、權限與組態設定皆與您的閘道器一致。

## 驗證 (Authentication)

使用閘道器的驗證組態。請傳送持有人金鑰 (Bearer token)：

- `Authorization: Bearer <token>`

注意事項：

- 當 `gateway.auth.mode="token"` 時，請使用 `gateway.auth.token`（或環境變數 `OPENCLAW_GATEWAY_TOKEN`）。
- 當 `gateway.auth.mode="password"` 時，請使用 `gateway.auth.password`（或環境變數 `OPENCLAW_GATEWAY_PASSWORD`）。

## 選擇代理人

無需自訂標頭：可將代理人 ID 編碼在 OpenResponses 的 `model` 欄位中：

- `model: "openclaw:<agentId>"` (例如：`"openclaw:main"`, `"openclaw:beta"`)
- `model: "agent:<agentId>"` (別名)

或者透過標頭指定特定的 OpenClaw 代理人：

- `x-openclaw-agent-id: <agentId>` (預設值為 `main`)

進階用法：

- 使用 `x-openclaw-session-key: <sessionKey>` 來完全控制對談路由。

## 啟用端點

將 `gateway.http.endpoints.responses.enabled` 設定為 `true`：

```json5
{
  gateway: {
    http: {
      endpoints: {
        responses: { enabled: true },
      },
    },
  },
}
```

## 停用端點

將 `gateway.http.endpoints.responses.enabled` 設定為 `false`：

```json5
{
  gateway: {
    http: {
      endpoints: {
        responses: { enabled: false },
      },
    },
  },
}
```

## 對談行為

預設情況下，此端點對 **每次請求皆為無狀態 (stateless per request)**（每次調用都會產生新的對談金鑰）。

如果請求中包含 OpenResponses 的 `user` 字串，閘道器會據此衍生一個穩定的對談金鑰，使重複的調用能共享同一個代理人會話。

## 請求結構 (支援項目)

請求遵循帶有項目化輸入的 OpenResponses API。目前支援：

- `input`: 字串或項目物件陣列。
- `instructions`: 會併入系統提示詞中。
- `tools`: 用戶端工具定義（函式工具）。
- `tool_choice`: 過濾或強制執行用戶端工具。
- `stream`: 啟用 SSE 串流。
- `max_output_tokens`: 盡力而為的輸出限制（取決於提供者）。
- `user`: 穩定的對談路由。

目前已被接受但 **暫時忽略** 的欄位：

- `max_tool_calls`
- `reasoning`
- `metadata`
- `store`
- `previous_response_id`
- `truncation`

## 項目 (Items，輸入)

### `message`

角色 (Roles)：`system`, `developer`, `user`, `assistant`。

- `system` 與 `developer` 會被附加至系統提示詞。
- 最近一個 `user` 或 `function_call_output` 項目會成為「目前訊息」。
- 之前的 user/assistant 訊息將作為歷史背景包含在內。

### `function_call_output` (回合制工具)

將工具執行結果回傳給模型：

```json
{
  "type": "function_call_output",
  "call_id": "call_123",
  "output": "{"temperature": "72F"}"
}
```

### `reasoning` 與 `item_reference`

為保持架構相容性而接受，但在建置提示詞時會被忽略。

## 工具 (用戶端函式工具)

透過 `tools: [{ type: "function", function: { name, description?, parameters? } }]` 提供工具。

若代理人決定調用工具，回應將傳回一個 `function_call` 輸出項目。您接著需發送包含 `function_call_output` 的後續請求以繼續該回合。

## 影像 (`input_image`)

支援 Base64 或 URL 來源：

```json
{
  "type": "input_image",
  "source": { "type": "url", "url": "https://example.com/image.png" }
}
```

允許的 MIME 類型（目前）：`image/jpeg`, `image/png`, `image/gif`, `image/webp`。
大小上限（目前）：10MB。

## 檔案 (`input_file`)

支援 Base64 或 URL 來源：

```json
{
  "type": "input_file",
  "source": {
    "type": "base64",
    "media_type": "text/plain",
    "data": "SGVsbG8gV29ybGQh",
    "filename": "hello.txt"
  }
}
```

允許的 MIME 類型（目前）：`text/plain`, `text/markdown`, `text/html`, `text/csv`, `application/json`, `application/pdf`。

大小上限（目前）：5MB。

目前行為：

- 檔案內容會被解碼並加入 **系統提示詞 (system prompt)** 而非使用者訊息，因此它具有暫時性 (ephemeral)（不會持久化於會話歷史中）。
- PDF 檔案會被解析為文字。若找不到足夠的文字內容，前幾頁會被點陣化 (rasterized) 為影像傳遞給模型。

PDF 解析使用的是適合 Node 環境的 `pdfjs-dist` 舊版建置（不含 worker）。現代版的 PDF.js 需要瀏覽器 worker/DOM 全域變數，因此不在此閘道器中使用。

URL 抓取預設值：

- `files.allowUrl`: `true`
- `images.allowUrl`: `true`
- `maxUrlParts`: `8`（每次請求中基於 URL 的 `input_file` + `input_image` 項目總數）
- 請求受到保護（DNS 解析檢查、私有 IP 阻擋、跳轉次數上限、逾時設定）。
- 支援針對輸入類型設定選用的主機名稱允許清單 (`files.urlAllowlist`, `images.urlAllowlist`)。
  - 精確主機：`"cdn.example.com"`
  - 萬用字元子網域：`"*.assets.example.com"` (不包含頂級網域)

## 檔案與影像限制 (組態設定)

預設值可在 `gateway.http.endpoints.responses` 下調整：

```json5
{
  gateway: {
    http: {
      endpoints: {
        responses: {
          enabled: true,
          maxBodyBytes: 20000000,
          maxUrlParts: 8,
          files: {
            allowUrl: true,
            urlAllowlist: ["cdn.example.com", "*.assets.example.com"],
            allowedMimes: [
              "text/plain",
              "text/markdown",
              "text/html",
              "text/csv",
              "application/json",
              "application/pdf",
            ],
            maxBytes: 5242880,
            maxChars: 200000,
            maxRedirects: 3,
            timeoutMs: 10000,
            pdf: {
              maxPages: 4,
              maxPixels: 4000000,
              minTextChars: 200,
            },
          },
          images: {
            allowUrl: true,
            urlAllowlist: ["images.example.com"],
            allowedMimes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
            maxBytes: 10485760,
            maxRedirects: 3,
            timeoutMs: 10000,
          },
        },
      },
    },
  },
}
```

省略時的預設值：

- `maxBodyBytes`: 20MB
- `maxUrlParts`: 8
- `files.maxBytes`: 5MB
- `files.maxChars`: 20萬字
- `files.maxRedirects`: 3
- `files.timeoutMs`: 10秒
- `files.pdf.maxPages`: 4頁
- `files.pdf.maxPixels`: 4,000,000像素
- `files.pdf.minTextChars`: 200字
- `images.maxBytes`: 10MB
- `images.maxRedirects`: 3
- `images.timeoutMs`: 10秒

安全性注意事項：

- URL 允許清單會在抓取前以及每次跳轉 (redirect hops) 時強制執行。
- 將主機名稱列入允許清單並不會繞過私有/內部 IP 的阻擋。
- 對於暴露於網際網路的閘道器，除了應用程式層級的保護外，建議同時套用網路出站控制 (Egress controls)。請參閱 [安全性](/gateway/security_zh_TW)。

## 串流 (SSE)

設定 `stream: true` 以接收伺服器傳送事件 (Server-Sent Events, SSE)：

- `Content-Type: text/event-stream`
- 每個事件行包含 `event: <type>` 與 `data: <json>`
- 串流以 `data: [DONE]` 結尾

目前發出的事件類型：

- `response.created`
- `response.in_progress`
- `response.output_item.added`
- `response.content_part.added`
- `response.output_text.delta`
- `response.output_text.done`
- `response.content_part.done`
- `response.output_item.done`
- `response.completed`
- `response.failed` (發生錯誤時)

## 用量 (Usage)

當底層提供者回報 Token 計數時，會填充 `usage` 欄位。

## 錯誤處理

錯誤訊息使用如下的 JSON 物件：

```json
{ "error": { "message": "...", "type": "invalid_request_error" } }
```

常見情況：

- `401`: 缺失或無效的驗證資訊
- `400`: 無效的請求主體
- `405`: 錯誤的方法

## 範例

非串流模式：

```bash
curl -sS http://127.0.0.1:18789/v1/responses 
  -H 'Authorization: Bearer YOUR_TOKEN' 
  -H 'Content-Type: application/json' 
  -H 'x-openclaw-agent-id: main' 
  -d '{
    "model": "openclaw",
    "input": "您好"
  }'
```

串流模式：

```bash
curl -N http://127.0.0.1:18789/v1/responses 
  -H 'Authorization: Bearer YOUR_TOKEN' 
  -H 'Content-Type: application/json' 
  -H 'x-openclaw-agent-id: main' 
  -d '{
    "model": "openclaw",
    "stream": true,
    "input": "您好"
  }'
```
