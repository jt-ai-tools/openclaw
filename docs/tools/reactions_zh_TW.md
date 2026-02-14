---
summary: "跨頻道共用的表情回應 (Reaction) 語義說明"
read_when:
  - 處理任何頻道的表情回應功能時
title: "表情回應"
---

> 此文件為 [English Version](/tools/reactions_zh_TW) 的繁體中文版本。

# 表情回應工具 (Reaction tooling)

跨頻道的表情回應共用語義：

- 新增回應時，`emoji` 參數為必填。
- 當支援時，`emoji=""` 會移除機器人的回應。
- 當支援時，`remove: true` 會移除指定的表情（需要配合 `emoji` 參數）。

## 各頻道注意事項：

- **Discord/Slack**：空 `emoji` 會移除機器人在該訊息上的所有回應；`remove: true` 則僅移除該特定表情。
- **Google Chat**：空 `emoji` 會移除該 App 在訊息上的回應；`remove: true` 則僅移除該特定表情。
- **Telegram**：空 `emoji` 會移除機器人的回應。
- **WhatsApp**：空 `emoji` 會移除機器人的回應；`remove: true` 會映射至空表情。
- **Signal**：當啟用 `channels.signal.reactionNotifications` 時，傳入的回應通知會發送系統事件。
