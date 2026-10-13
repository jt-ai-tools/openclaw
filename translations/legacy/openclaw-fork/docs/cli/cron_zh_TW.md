---
summary: "`openclaw cron` (排程與執行背景任務) 的 CLI 參考資料"
read_when:
  - 您想要設定預約任務與自動喚醒時
  - 您正在偵錯 Cron 執行過程與日誌時
title: "cron"
---

> 此文件為 [English Version](/cli/cron_zh_TW) 的繁體中文版本。

# `openclaw cron`

管理閘道器排程器 (Gateway scheduler) 的 Cron 任務。

## 相關資訊：
- 排程任務說明：[排程任務 (Cron jobs)](/automation/cron-jobs_zh_TW)

**提示**：執行 `openclaw cron --help` 可查看完整的指令介面。

**注意**：隔離的 `cron add` 任務預設使用 `--announce` (宣告) 方式遞送。使用 `--no-deliver` 可將輸出保留在內部。

**注意**：單次執行的 (`--at`) 任務在執行成功後預設會自動刪除。若要保留，請使用 `--keep-after-run`。

**注意**：週期性任務在發生連續錯誤後，現在會使用指數退避 (Exponential backoff) 重試機制（30秒 → 1分 → 5分 → 15分 → 60分），並在下一次成功執行後恢復原定排程。

## 常用編輯操作

**更新遞送設定（而不更改訊息）：**
```bash
openclaw cron edit <任務ID> --announce --channel telegram --to "123456789"
```

**停用隔離任務的遞送：**
```bash
openclaw cron edit <任務ID> --no-deliver
```

**宣告至特定頻道：**
```bash
openclaw cron edit <任務ID> --announce --channel slack --to "channel:C1234567890"
```
