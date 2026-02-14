---
summary: "記錄機制概觀：檔案記錄、控制台輸出、CLI 即時追蹤與控制介面說明"
read_when:
  - 您需要對記錄機制進行入門級概觀時
  - 您想要配置記錄層級或格式時
  - 您正在進行疑難排解並需要快速找到記錄時
title: "記錄機制 (Logging)"
---

> 此文件為 [English Version](/logging) 的繁體中文版本。

# 記錄機制 (Logging)

OpenClaw 的記錄會輸出至兩個地方：

- **檔案記錄** (JSON lines)：由閘道器 (Gateway) 寫入。
- **控制台輸出**：顯示在終端機與控制介面 (Control UI) 中。

本頁面說明記錄檔的存放位置、如何讀取它們，以及如何配置記錄層級與格式。

## 記錄檔存放位置

預設情況下，閘道器會將輪替記錄檔 (Rolling log file) 寫入：

`/tmp/openclaw/openclaw-YYYY-MM-DD.log`

日期使用閘道器主機的本地時區。

您可以在 `~/.openclaw/openclaw.json` 中覆寫此路徑：

```json
{
  "logging": {
    "file": "/path/to/openclaw.log"
  }
}
```

## 如何讀取記錄

### CLI：即時追蹤 (建議方式)

使用 CLI 透過 RPC 即時追蹤 (Tail) 閘道器的記錄檔：

```bash
openclaw logs --follow
```

輸出模式：

- **TTY 工作階段**：美化、上色且結構化的記錄行。
- **非 TTY 工作階段**：純文字。
- `--json`：每行一則 JSON 物件 (Line-delimited JSON)。
- `--plain`：在 TTY 工作階段中強制使用純文字。
- `--no-color`：停用 ANSI 顏色。

在 JSON 模式下，CLI 會發出帶有 `type` 標籤的物件：

- `meta`：串流詮釋資料 (檔案、游標、大小)
- `log`：已解析的記錄項目
- `notice`：截斷 / 輪替提示
- `raw`：未經解析的原始記錄行

如果無法連接至閘道器，CLI 會印出簡短提示，建議執行：

```bash
openclaw doctor
```

### 控制介面 (Web)

控制介面的 **Logs** 分頁會使用 `logs.tail` 追蹤相同的檔案。
關於如何開啟控制介面，請參閱 [/web/control-ui](/web/control-ui_zh_TW)。

### 僅限頻道的記錄

若要過濾特定頻道（如 WhatsApp/Telegram 等）的活動，請使用：

```bash
openclaw channels logs --channel whatsapp
```

## 記錄格式

### 檔案記錄 (JSONL)

記錄檔中的每一行都是一個 JSON 物件。CLI 與控制介面會解析這些項目以呈現結構化輸出（時間、層級、子系統、訊息）。

### 控制台輸出 (Console output)

控制台記錄具備 **TTY 感知** 能力，且格式化為易於閱讀的形式：

- 子系統前綴（例如 `gateway/channels/whatsapp`）
- 層級顏色（info/warn/error）
- 選用精簡或 JSON 模式

控制台格式化由 `logging.consoleStyle` 控制。

## 配置記錄機制

所有記錄組態皆位於 `~/.openclaw/openclaw.json` 中的 `logging` 區段。

```json
{
  "logging": {
    "level": "info",
    "file": "/tmp/openclaw/openclaw-YYYY-MM-DD.log",
    "consoleLevel": "info",
    "consoleStyle": "pretty",
    "redactSensitive": "tools",
    "redactPatterns": ["sk-.*"]
  }
}
```

### 記錄層級

- `logging.level`：**檔案記錄** (JSONL) 的層級。
- `logging.consoleLevel`：**控制台** 輸出的詳細程度層級。

`--verbose` 僅影響控制台輸出，不會更改檔案記錄層級。

### 控制台樣式 (Console styles)

`logging.consoleStyle`：

- `pretty`：人類友好、帶顏色且包含時間戳記。
- `compact`：更精簡的輸出（適合長時間對談）。
- `json`：每行一個 JSON（適合記錄處理器）。

### 遮蔽 (Redaction)

工具摘要可以在顯示於控制台之前遮蔽 (Redact) 敏感權杖：

- `logging.redactSensitive`：`off` | `tools`（預設為 `tools`）
- `logging.redactPatterns`：用於覆寫預設集合的正規表示式清單。

遮蔽 **僅影響控制台輸出**，不會修改檔案記錄。

## 診斷與 OpenTelemetry

診斷 (Diagnostics) 是針對模型執行 **以及** 訊息流程遙測（Webhook、佇列、工作階段狀態）所設計的結構化、機器可讀事件。它們 **不會** 取代記錄；它們的存在是為了提供指標 (Metrics)、追蹤 (Traces) 與其他匯出器所需的數據。

診斷事件在程序內發出，但僅在啟用診斷功能與匯出器外掛程式時，匯出器才會掛載。

### OpenTelemetry vs OTLP

- **OpenTelemetry (OTel)**：追蹤、指標與記錄的數據模型及 SDK。
- **OTLP**：用於將 OTel 數據匯出至收集器/後端的有線傳輸協定。
- OpenClaw 目前透過 **OTLP/HTTP (protobuf)** 進行匯出。

### 匯出的信號 (Signals)

- **指標 (Metrics)**：計數器 (Counters) + 直方圖 (Histograms)（Token 使用量、訊息流、佇列處理）。
- **追蹤 (Traces)**：模型使用以及 Webhook/訊息處理的 Spans（追蹤區段）。
- **記錄 (Logs)**：啟用 `diagnostics.otel.logs` 時透過 OTLP 匯出。記錄量可能很大，請留意 `logging.level` 與匯出器過濾器。

### 診斷事件類別

模型使用：

- `model.usage`：Tokens、成本、持續時間、上下文、提供者/模型/頻道、工作階段 ID。

訊息流程：

- `webhook.received`：每個頻道的 Webhook 進入點。
- `webhook.processed`：Webhook 已處理及持續時間。
- `webhook.error`：Webhook 處理器錯誤。
- `message.queued`：訊息進入處理佇列。
- `message.processed`：結果、持續時間及選填的錯誤資訊。

佇列與工作階段：

- `queue.lane.enqueue`：指令佇列通道入隊及深度。
- `queue.lane.dequeue`：指令佇列通道出隊及等待時間。
- `session.state`：工作階段狀態轉換及原因。
- `session.stuck`：工作階段卡住警告及時間長度。
- `run.attempt`：執行重試/嘗試的詮釋資料。
- `diagnostic.heartbeat`：彙總計數器（Webhooks/佇列/工作階段）。

### 僅啟用診斷（無匯出器）

如果您希望診斷事件可供外掛程式或自訂接收端 (Sinks) 使用，請設定：

```json
{
  "diagnostics": {
    "enabled": true
  }
}
```

### 診斷標記（針對性記錄）

使用標記 (Flags) 來開啟額外的針對性偵錯記錄，而無需提高 `logging.level`。標記不分大小寫，且支援萬用字元（例如 `telegram.*` 或 `*`）。

```json
{
  "diagnostics": {
    "flags": ["telegram.http"]
  }
}
```

環境變數覆寫（單次使用）：

```
OPENCLAW_DIAGNOSTICS=telegram.http,telegram.payload
```

注意事項：

- 標記記錄會輸出至標準記錄檔（同 `logging.file`）。
- 輸出內容仍會根據 `logging.redactSensitive` 進行遮蔽。
- 完整指南：[/diagnostics/flags](/diagnostics/flags_zh_TW)。

### 匯出至 OpenTelemetry

診斷數據可透過 `diagnostics-otel` 外掛程式 (OTLP/HTTP) 匯出。這適用於任何接受 OTLP/HTTP 的 OpenTelemetry 收集器/後端。

```json
{
  "plugins": {
    "allow": ["diagnostics-otel"],
    "entries": {
      "diagnostics-otel": {
        "enabled": true
      }
    }
  },
  "diagnostics": {
    "enabled": true,
    "otel": {
      "enabled": true,
      "endpoint": "http://otel-collector:4318",
      "protocol": "http/protobuf",
      "serviceName": "openclaw-gateway",
      "traces": true,
      "metrics": true,
      "logs": true,
      "sampleRate": 0.2,
      "flushIntervalMs": 60000
    }
  }
}
```

注意事項：

- 您也可以使用 `openclaw plugins enable diagnostics-otel` 啟用外掛程式。
- `protocol` 目前僅支援 `http/protobuf`。`grpc` 將被忽略。
- 指標包含 Token 使用量、成本、上下文大小、執行持續時間，以及訊息流計數器/直方圖（Webhooks、佇列、工作階段狀態、佇列深度/等待時間）。
- 追蹤與指標可透過 `traces` / `metrics` 切換（預設為開啟）。追蹤內容包含模型使用 Spans，以及啟用時的 Webhook/訊息處理 Spans。
- 當您的收集器需要驗證時，請設定 `headers`。
- 支援的環境變數：`OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`, `OTEL_EXPORTER_OTLP_PROTOCOL`。

### 匯出的指標 (名稱與類型)

模型使用：

- `openclaw.tokens` (計數器，屬性：`openclaw.token`, `openclaw.channel`, `openclaw.provider`, `openclaw.model`)
- `openclaw.cost.usd` (計數器，屬性：`openclaw.channel`, `openclaw.provider`, `openclaw.model`)
- `openclaw.run.duration_ms` (直方圖，屬性：`openclaw.channel`, `openclaw.provider`, `openclaw.model`)
- `openclaw.context.tokens` (直方圖，屬性：`openclaw.context`, `openclaw.channel`, `openclaw.provider`, `openclaw.model`)

訊息流程：

- `openclaw.webhook.received` (計數器，屬性：`openclaw.channel`, `openclaw.webhook`)
- `openclaw.webhook.error` (計數器，屬性：`openclaw.channel`, `openclaw.webhook`)
- `openclaw.webhook.duration_ms` (直方圖，屬性：`openclaw.channel`, `openclaw.webhook`)
- `openclaw.message.queued` (計數器，屬性：`openclaw.channel`, `openclaw.source`)
- `openclaw.message.processed` (計數器，屬性：`openclaw.channel`, `openclaw.outcome`)
- `openclaw.message.duration_ms` (直方圖，屬性：`openclaw.channel`, `openclaw.outcome`)

佇列與工作階段：

- `openclaw.queue.lane.enqueue` (計數器，屬性：`openclaw.lane`)
- `openclaw.queue.lane.dequeue` (計數器，屬性：`openclaw.lane`)
- `openclaw.queue.depth` (直方圖，屬性：`openclaw.lane` 或 `openclaw.channel=heartbeat`)
- `openclaw.queue.wait_ms` (直方圖，屬性：`openclaw.lane`)
- `openclaw.session.state` (計數器，屬性：`openclaw.state`, `openclaw.reason`)
- `openclaw.session.stuck` (計數器，屬性：`openclaw.state`)
- `openclaw.session.stuck_age_ms` (直方圖，屬性：`openclaw.state`)
- `openclaw.run.attempt` (計數器，屬性：`openclaw.attempt`)

### 匯出的 Spans (名稱與關鍵屬性)

- `openclaw.model.usage`
  - `openclaw.channel`, `openclaw.provider`, `openclaw.model`
  - `openclaw.sessionKey`, `openclaw.sessionId`
  - `openclaw.tokens.*` (input/output/cache_read/cache_write/total)
- `openclaw.webhook.processed`
  - `openclaw.channel`, `openclaw.webhook`, `openclaw.chatId`
- `openclaw.webhook.error`
  - `openclaw.channel`, `openclaw.webhook`, `openclaw.chatId`, `openclaw.error`
- `openclaw.message.processed`
  - `openclaw.channel`, `openclaw.outcome`, `openclaw.chatId`, `openclaw.messageId`, `openclaw.sessionKey`, `openclaw.sessionId`, `openclaw.reason`
- `openclaw.session.stuck`
  - `openclaw.state`, `openclaw.ageMs`, `openclaw.queueDepth`, `openclaw.sessionKey`, `openclaw.sessionId`

### 取樣與刷新 (Sampling + flushing)

- 追蹤取樣：`diagnostics.otel.sampleRate` (0.0–1.0，僅限根 Spans)。
- 指標匯出間隔：`diagnostics.otel.flushIntervalMs` (最小 1000ms)。

### 協定說明

- OTLP/HTTP 端點可透過 `diagnostics.otel.endpoint` 或 `OTEL_EXPORTER_OTLP_ENDPOINT` 設定。
- 如果端點已包含 `/v1/traces` 或 `/v1/metrics`路徑，則會依原樣使用。
- 如果端點已包含 `/v1/logs`，則會依原樣用於記錄匯出。
- `diagnostics.otel.logs` 可針對主記錄器輸出啟用 OTLP 記錄匯出。

### 記錄匯出行為

- OTLP 記錄使用與寫入 `logging.file` 相同的結構化紀錄。
- 遵循 `logging.level`（檔案記錄層級）。控制台遮蔽規則 **不適用** 於 OTLP 記錄。
- 高流量的安裝環境建議優先選用 OTLP 收集器的取樣/過濾功能。

## 疑難排解建議

- **無法連線至閘道器？** 請先執行 `openclaw doctor`。
- **記錄內容為空？** 檢查閘道器是否正在執行，以及是否正在寫入 `logging.file` 指定的路徑。
- **需要更多細節？** 將 `logging.level` 設定為 `debug` 或 `trace` 並重試。
