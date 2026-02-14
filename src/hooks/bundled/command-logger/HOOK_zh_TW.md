---
name: command-logger
description: "將所有指令事件記錄至集中的稽核檔案"
homepage: https://docs.openclaw.ai/hooks#command-logger
metadata:
  {
    "openclaw":
      {
        "emoji": "📝",
        "events": ["command"],
        "install": [{ "id": "bundled", "kind": "bundled", "label": "隨 OpenClaw 附帶" }],
      },
  }
---

# 指令記錄勾子 (Command Logger Hook)

將所有指令事件（如 `/new`, `/reset`, `/stop` 等）記錄至集中的稽核日誌檔案，用於偵錯與監控。

## 功能說明

每當您向代理人下達指令時：
1. **擷取事件詳情**：包含動作、時間戳記、工作階段金鑰、傳送者 ID 與來源。
2. **寫入日誌檔案**：將一列 JSON 寫入 `~/.openclaw/logs/commands.log`。
3. **靜默執行**：在背景執行，不會干擾使用者。

## 輸出格式

日誌以 JSONL 格式記錄：
`{"timestamp":"...","action":"new","sessionKey":"...","senderId":"...","source":"telegram"}`

## 日誌檔案位置
`~/.openclaw/logs/commands.log`

## 查看日誌
查看最近的指令：
```bash
tail -n 20 ~/.openclaw/logs/commands.log
```

使用 jq 進行排版：
```bash
cat ~/.openclaw/logs/commands.log | jq .
```
