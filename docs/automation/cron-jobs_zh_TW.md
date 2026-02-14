---
summary: "閘道器排程器的排程任務與自動喚醒功能說明"
read_when:
  - 設定背景任務或自動喚醒時
  - 串接應隨同或在心跳偵測旁執行的自動化流程時
  - 在心跳機制與排程任務間做選擇時
title: "排程任務"
---

> 此文件為 [English Version](/automation/cron-jobs_zh_TW) 的繁體中文版本。

# 排程任務 (Cron jobs - 閘道器排程器)

> **Cron 還是 Heartbeat？** 請參閱 [Cron vs Heartbeat](/automation/cron-vs-heartbeat_zh_TW) 指引。

Cron 是閘道器內建的排程器。它會持久化儲存任務，在正確的時間喚醒代理人，並可選擇將結果發送回聊天頻道。如果您想要「每天早上執行」或「20 分鐘後提醒代理人」，Cron 就是您需要的機制。

## 核心概念

- **執行位置**：Cron 執行於 **閘道器內部**（而非模型內部）。
- **持久化**：任務儲存於 `~/.openclaw/cron/`，重啟後不會遺失。
- **兩種執行樣式**：
  - **主工作階段 (Main session)**：排入系統事件，在下一次心跳偵測時執行。
  - **隔離工作階段 (Isolated)**：在獨立的工作階段中執行代理人回合，並可選用宣告 (Announce) 模式遞送結果。

## 快速開始 (CLI)

建立一個單次的提醒，並要求立即喚醒：
```bash
openclaw cron add \
  --name "提醒事項" \
  --at "2026-02-01T16:00:00Z" \
  --session main \
  --system-event "提醒：檢查排程任務草稿" \
  --wake now \
  --delete-after-run
```

設定一個週期性的隔離任務並發送至 Slack：
```bash
openclaw cron add \
  --name "早報" \
  --cron "0 7 * * *" \
  --tz "Asia/Taipei" \
  --session isolated \
  --message "摘要昨晚的所有更新。" \
  --announce \
  --channel slack \
  --to "channel:C1234567890"
```

## 執行樣式細節

### 主工作階段任務 (系統事件)
適用於您希望在主對話背景中獲得資訊的情境。
- 必須使用 `payload.kind = "systemEvent"`。
- `wakeMode: "now"` (預設)：事件會立即觸發一次心跳執行。

### 隔離工作階段任務
適用於高頻率或吵雜的後台瑣事，不希望洗版您的主聊天紀錄。
- 在 `cron:<jobId>` 獨立工作階段中執行。
- 每次執行都是 **全新的工作階段 ID**。
- `delivery.mode = "announce"` (預設)：將摘要發送至目標頻道，並在主對話貼出簡短報告。

## 模型與推理等級覆寫
隔離任務可以自訂模型與推理等級 (Thinking level)：
- `model`：例如 `anthropic/claude-sonnet-4-5`。
- `thinking`：例如 `high`。

## 疑難排解
- **任務沒執行**：確認 `cron.enabled` 為 true，且閘道器程序正在持續執行。
- **重試機制**：週期性任務若執行失敗，會進入指數退避 (Exponential backoff) 模式（30s -> 1m -> ... -> 60m）。
- **Telegram 路由**：針對論壇主題 (Topics)，建議明確使用 `-100…:topic:<id>` 格式。
