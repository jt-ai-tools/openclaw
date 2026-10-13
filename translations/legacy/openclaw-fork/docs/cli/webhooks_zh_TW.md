---
summary: "`openclaw webhooks` (Webhook 輔助工具與 Gmail Pub/Sub) 的 CLI 參考資料"
read_when:
  - 您想要將 Gmail Pub/Sub 事件串接至 OpenClaw 時
  - 您需要 Webhook 相關的輔助指令時
title: "webhooks"
---

> 此文件為 [English Version](/cli/webhooks_zh_TW) 的繁體中文版本。

# `openclaw webhooks`

Webhook 輔助工具與整合功能（包含 Gmail Pub/Sub 整合）。

## 相關資訊：
- Webhook 說明：[Webhook](/automation/webhook_zh_TW)
- Gmail Pub/Sub 說明：[Gmail Pub/Sub](/automation/gmail-pubsub_zh_TW)

## Gmail 整合

```bash
# 設定 Gmail 帳號
openclaw webhooks gmail setup --account 您的信箱@example.com

# 執行 Gmail 監聽
openclaw webhooks gmail run
```

詳情請參閱 [Gmail Pub/Sub 說明文件](/automation/gmail-pubsub_zh_TW)。
