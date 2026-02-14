---
summary: "OpenClaw 記錄機制：輪替診斷檔案日誌與統一日誌隱私標籤說明"
read_when:
  - 擷取 macOS 日誌或研究私有數據記錄時
  - 偵錯語音喚醒或工作階段生命週期問題時
title: "macOS 記錄機制"
---

> 此文件為 [English Version](/platforms/mac/logging_zh_TW) 的繁體中文版本。

# 記錄機制 (macOS Logging)

## 輪替診斷檔案日誌 (Debug 面板)

OpenClaw 透過 swift-log（預設使用統一日誌 Unified Logging）路由 macOS App 的日誌，並可選用將日誌寫入磁碟中的輪替檔案。

- **詳細程度**：Debug 面板 → Logs → App logging → Verbosity。
- **啟用方式**：勾選「Write rolling diagnostics log (JSONL)」。
- **路徑**：`~/Library/Logs/OpenClaw/diagnostics.jsonl`（會自動輪替；舊檔案會帶有 `.1`, `.2` 等後綴）。

**注意**：此功能預設為 **關閉**。僅在主動偵錯時啟用。請將此檔案視為敏感資訊。

## macOS 統一日誌中的私有數據

除非子系統選擇加入 `privacy -off`，否則統一日誌會遮蔽大部分酬載。這可以透過 `/Library/Preferences/Logging/Subsystems/` 下對應子系統名稱的 plist 檔案來控制。

### 為 OpenClaw 啟用 (`bot.molt`)

將以下內容寫入臨時檔案，然後以 root 身分安裝：

```bash
cat <<'EOF' >/tmp/bot.molt.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>DEFAULT-OPTIONS</key>
    <dict>
        <key>Enable-Private-Data</key>
        <true/>
    </dict>
</dict>
</plist>
EOF
sudo install -m 644 -o root -g wheel /tmp/bot.molt.plist /Library/Preferences/Logging/Subsystems/bot.molt.plist
```

- 無需重啟；logd 會快速偵測到檔案，但只有新的日誌行會包含私有酬載。
- 使用輔助腳本查看詳細輸出：`./scripts/clawlog.sh --category WebChat --last 5m`。

### 偵錯後停用
移除該檔案：`sudo rm /Library/Preferences/Logging/Subsystems/bot.molt.plist`。
可選用執行 `sudo log config --reload` 以立即生效。
