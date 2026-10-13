---
summary: "`openclaw agent` (透過閘道器執行單次代理人回合) 的 CLI 參考資料"
read_when:
  - 您想要透過腳本執行單次代理人回合時（可選用遞送回覆）
title: "agent"
---

> 此文件為 [English Version](/cli/agent_zh_TW) 的繁體中文版本。

# `openclaw agent`

透過閘道器執行一次代理人回合（若要使用內嵌模式請加上 `--local`）。
使用 `--agent <id>` 可直接指定已配置的代理人。

## 相關資訊：
- 代理人發送工具：[代理人發送 (Agent send)](/tools/agent-send_zh_TW)

## 範例

```bash
# 執行並遞送回覆給特定號碼
openclaw agent --to +15555550123 --message "狀態更新" --deliver

# 指定特定的代理人 ID
openclaw agent --agent ops --message "摘要記錄檔"

# 指定工作階段 ID 並設定推理等級 (Thinking)
openclaw agent --session-id 1234 --message "摘要收件匣" --thinking medium

# 執行並將回覆遞送至 Slack 的特定頻道
openclaw agent --agent ops --message "產生報告" --deliver --reply-channel slack --reply-to "#reports"
```
