---
summary: "將 TypeBox Schema 作為閘道器協定的唯一準則說明"
read_when:
  - 更新協定 Schema 或程式碼產生時
title: "TypeBox"
---

> 此文件為 [English Version](/concepts/typebox_zh_TW) 的繁體中文版本。

# 將 TypeBox 作為協定唯一準則

OpenClaw 使用 TypeBox（一個以 TypeScript 為主的 Schema 函式庫）來定義 **閘道器 WebSocket 協定**（包含握手、請求/回應與伺服器事件）。這些 Schema 驅動了 **執行時期驗證**、**JSON Schema 匯出** 以及 macOS App 的 **Swift 程式碼產生**。

## 核心心智模型

閘道器的所有 WS 訊息皆為以下三種訊框 (Frames) 之一：

- **Request (請求)**：`{ type: "req", id, method, params }`
- **Response (回應)**：`{ type: "res", id, ok, payload | error }`
- **Event (事件)**：`{ type: "event", event, payload, ... }`

連線時第一條訊息 **必須** 是 `connect` 請求。隨後，客戶端可以呼叫方法（如 `health`, `send`）並訂閱事件（如 `presence`, `agent`）。

## Schema 儲存位置與管線

- **原始碼**：`src/gateway/protocol/schema.ts`。
- **程式碼產生指令**：
  - `pnpm protocol:gen`：產生 JSON Schema (draft-07)。
  - `pnpm protocol:gen:swift`：為 macOS App 產生 Swift 閘道器模型。
  - `pnpm protocol:check`：執行並驗證兩者之輸出。

## 執行時期應用

- **伺服器端**：所有傳入訊框皆透過 AJV 進行驗證。握手階段僅接受符合 `ConnectParams` 的請求。
- **功能宣告**：閘道器會在 `hello-ok` 回應中宣告其支援的 `methods` 與 `events` 清單。

## 版本控管與相容性

- `PROTOCOL_VERSION` 定義於 Schema 檔案中。
- 客戶端需發送 `minProtocol` 與 `maxProtocol`；若與伺服器不符將被拒絕。
- Swift 模型會保留未知的訊框類型，以確保向前相容性。

## 如何新增協定方法 (End-to-end)

1. 在 `schema.ts` 中定義參數與結果的 Schema。
2. 在 `ProtocolSchemas` 中註冊並導出靜態類型。
3. 在 `src/gateway/protocol/index.ts` 導出 AJV 驗證器。
4. 在伺服器端實作處理常式 (Handler)。
5. 執行 `pnpm protocol:check` 重新產生所有產出物。
6. 新增測試案例。
