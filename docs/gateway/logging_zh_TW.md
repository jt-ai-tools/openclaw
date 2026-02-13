---
summary: "記錄介面、檔案日誌、WS 記錄樣式與主控台格式化說明"
read_when:
  - 更改記錄輸出或格式時
  - 偵錯 CLI 或閘道器輸出時
title: "記錄"
---

> 此文件為 [English Version](/gateway/logging) 的繁體中文版本。

# 記錄 (Logging)

關於面向使用者的概觀（CLI + 控制 UI + 組態設定），請參閱 [/logging](/logging_zh_TW)。

OpenClaw 具有兩個記錄「介面 (surfaces)」：

- **主控台輸出 (Console output)**：您在終端機或偵錯 UI 中看到的內容。
- **檔案日誌 (File logs)**：由閘道器記錄器寫入的 JSON 行 (JSONL)。

## 基於檔案的記錄器

- 預設的滾動式日誌檔案位於 `/tmp/openclaw/`（每天一個檔案）：`openclaw-YYYY-MM-DD.log`
  - 日期使用閘道器主機的本地時區。
- 日誌檔案路徑與等級可透過 `~/.openclaw/openclaw.json` 進行配置：
  - `logging.file`
  - `logging.level`

檔案格式為每行一個 JSON 物件。

控制 UI 的 **Logs** 分頁會透過閘道器 (`logs.tail`) 即時追蹤 (tail) 此檔案。
CLI 也可以執行相同操作：

```bash
openclaw logs --follow
```

**詳細模式 (Verbose) vs. 日誌等級**

- **檔案日誌** 的等級完全由 `logging.level` 控制。
- `--verbose` 旗標僅影響 **主控台的詳細程度**（以及 WS 記錄樣式）；它 **不會** 提升檔案日誌的等級。
- 若要在檔案日誌中擷取僅限詳細模式的細節，請將 `logging.level` 設定為 `debug` 或 `trace`。

## 主控台擷取 (Console capture)

CLI 會擷取 `console.log/info/warn/error/debug/trace` 並將其寫入檔案日誌，同時仍將其列印至 stdout/stderr。

您可以獨立調整主控台的詳細程度：

- `logging.consoleLevel`（預設為 `info`）
- `logging.consoleStyle`（`pretty` | `compact` | `json`）

## 工具摘要遮蔽 (Redaction)

詳細的工具摘要（例如 `🛠️ Exec: ...`）在進入主控台串流之前，可以先遮蔽敏感的 Token。此功能 **僅限工具摘要**，不會改動檔案日誌。

- `logging.redactSensitive`: `off` | `tools` (預設值：`tools`)
- `logging.redactPatterns`: 正規表示式字串陣列（會覆寫預設值）
  - 使用原始正規表示式字串（自動套用 `gi`），或使用 `/pattern/flags` 若您需要自訂旗標。
  - 匹配內容將被遮蔽：長度 >= 18 則保留前 6 位 + 後 4 位字元，否則顯示 `***`。
  - 預設模式涵蓋常見的密鑰賦值、CLI 旗標、JSON 欄位、持有人標頭 (bearer headers)、PEM 區塊以及熱門的 Token 前綴。

## 閘道器 WebSocket 記錄

閘道器以兩種模式列印 WebSocket 通訊協定日誌：

- **一般模式（無 `--verbose`）**：僅列印「值得注意」的 RPC 結果：
  - 錯誤 (`ok=false`)
  - 慢速調用（預設門檻：`>= 50ms`）
  - 解析錯誤
- **詳細模式 (`--verbose`)**：列印所有的 WS 請求/回應流量。

### WS 記錄樣式

`openclaw gateway` 支援各閘道器獨立的樣式切換：

- `--ws-log auto` (預設值)：一般模式經過優化；詳細模式使用精簡輸出。
- `--ws-log compact`: 詳細模式下使用精簡輸出（請求/回應成對顯示）。
- `--ws-log full`: 詳細模式下顯示完整的逐框架 (per-frame) 輸出。
- `--compact`: `--ws-log compact` 的別名。

範例：

```bash
# 優化後的輸出（僅顯示錯誤/慢速調用）
openclaw gateway

# 顯示所有 WS 流量（成對顯示）
openclaw gateway --verbose --ws-log compact

# 顯示所有 WS 流量（完整元數據）
openclaw gateway --verbose --ws-log full
```

## 主控台格式化 (子系統記錄)

主控台格式化程式具備 **TTY 感知能力**，並會列印帶有前綴且一致的行。子系統記錄器能保持輸出分組且易於掃描。

行為特性：

- **子系統前綴** 出現在每一行（例如 `[gateway]`, `[canvas]`, `[tailscale]`）。
- **子系統顏色**（每個子系統固定顏色）加上等級著色。
- **支援色彩輸出**：當輸出對象為 TTY 或環境看起來像進階終端機時（檢查 `TERM`/`COLORTERM`/`TERM_PROGRAM`），並尊重 `NO_COLOR` 設定。
- **縮短的子系統前綴**：捨棄開頭的 `gateway/` 與 `channels/`，保留最後兩段（例如 `whatsapp/outbound`）。
- **依子系統建立子記錄器**（自動加上前綴與結構化欄位 `{ subsystem }`）。
- **`logRaw()`** 用於 QR Code 或 UX 專屬輸出（不加前綴，不進行格式化）。
- **主控台樣式**（例如 `pretty` | `compact` | `json`）。
- **主控台日誌等級** 與檔案日誌等級分開（當 `logging.level` 設為 `debug`/`trace` 時，檔案會保留完整細節）。
- **WhatsApp 訊息內容** 以 `debug` 等級記錄（需使用 `--verbose` 才能看見）。

這能在保持現有檔案日誌穩定的同時，讓互動式輸出更易於閱讀掃描。
