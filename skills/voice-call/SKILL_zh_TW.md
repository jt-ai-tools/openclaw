---
name: voice-call
description: 透過 OpenClaw voice-call 外掛程式啟動語音通話。
metadata:
  {
    "openclaw":
      {
        "emoji": "📞",
        "skillKey": "voice-call",
        "requires": { "config": ["plugins.entries.voice-call.enabled"] },
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# 語音通話 (Voice Call)

使用 voice-call 外掛程式來啟動或檢查通話（支援 Twilio, Telnyx, Plivo 或 mock）。

## CLI 指令

```bash
openclaw voicecall call --to "+15555550123" --message "來自 OpenClaw 的問候"
openclaw voicecall status --call-id <id>
```

## 工具 (Tool)

針對代理人啟動的通話，請使用 `voice_call`。

動作 (Actions)：

- `initiate_call` (message, to?, mode?)：啟動通話。
- `continue_call` (callId, message)：繼續通話。
- `speak_to_user` (callId, message)：對使用者說話。
- `end_call` (callId)：結束通話。
- `get_status` (callId)：獲取狀態。

注意事項：

- 需要啟用 voice-call 外掛程式。
- 外掛程式組態位於 `plugins.entries.voice-call.config`。
- Twilio 設定：`provider: "twilio"` + `twilio.accountSid/authToken` + `fromNumber`。
- Telnyx 設定：`provider: "telnyx"` + `telnyx.apiKey/connectionId` + `fromNumber`。
- Plivo 設定：`provider: "plivo"` + `plivo.authId/authToken` + `fromNumber`。
- 開發用備援：`provider: "mock"`（不進行網路呼叫）。
