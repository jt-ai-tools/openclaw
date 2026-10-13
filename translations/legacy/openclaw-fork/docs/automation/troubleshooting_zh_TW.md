---
summary: "排程任務與心跳偵測的排程及遞送問題疑難排解"
read_when:
  - Cron 任務沒有執行時
  - Cron 任務已執行但沒有遞送訊息時
  - 心跳偵測似乎沈默或被跳過時
title: "自動化疑難排解"
---

> 此文件為 [English Version](/automation/troubleshooting_zh_TW) 的繁體中文版本。

# 自動化疑難排解 (Automation troubleshooting)

針對排程器 (`cron`) 與心跳偵測 (`heartbeat`) 的問題，請參考本頁面。

## 檢查指令階梯

```bash
openclaw status
openclaw gateway status
openclaw logs --follow
openclaw doctor
openclaw channels status --probe
```

隨後執行自動化專屬檢查：
```bash
openclaw cron status (檢查排程器狀態)
openclaw cron list (列出任務)
openclaw system heartbeat last (查看上次心跳結果)
```

## 常見問題與特徵

### Cron 沒有觸發
- **特徵**：`scheduler disabled` 代表組態或環境變數關閉了 Cron 功能。
- **特徵**：`reason: not-due` 代表手動執行時未加 `--force` 且時間未到。

### Cron 已執行但沒有訊息遞送
- **特徵**：執行狀態為 `ok` 但遞送模式為 `none`。
- **特徵**：頻道探針回報未連線或權限不足（`unauthorized`）。

### 心跳偵測被跳過
- **特徵**：`reason=quiet-hours` 代表目前處於非活動時段。
- **特徵**：`requests-in-flight` 代表主通道正忙，心跳已延後。
- **特徵**：`empty-heartbeat-file` 代表 `HEARTBEAT.md` 內容為空或無效。

## 時區與活動時段陷阱
- **時區未設定**：若未設定 `agents.defaults.userTimezone`，心跳會回退至使用主機時區。
- **ISO 時間**：Cron 的 `--at` 參數若未指定時區，一律視為 **UTC**。
