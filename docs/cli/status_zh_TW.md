---
summary: "`openclaw status` (診斷、探針與用量快照) 的 CLI 參考資料"
read_when:
  - 您想要快速診斷頻道健康度與最近的工作階段收件者時
  - 您需要一份可供貼上的完整狀態資訊以進行偵錯時
title: "status"
---

> 此文件為 [English Version](/cli/status_zh_TW) 的繁體中文版本。

# `openclaw status`

頻道與工作階段的診斷工具。

```bash
openclaw status
openclaw status --all (完整診斷)
openclaw status --deep (深度探針)
openclaw status --usage (用量統計)
```

## 注意事項：

- `--deep` 會執行即時探針測試（包含 WhatsApp Web, Telegram, Discord, Google Chat, Slack, Signal）。
- 當配置了多個代理人時，輸出內容會包含每個代理人的工作階段存儲資訊。
- 概觀 (Overview) 資訊包含閘道器 (Gateway) 與節點主機 (Node host) 的安裝與執行狀態。
- 概觀資訊包含更新頻道與 Git SHA（針對從原始碼簽出的安裝）。
- 若有可用更新，`status` 會印出執行 `openclaw update` 的提示。
