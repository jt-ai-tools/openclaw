---
summary: "快速進行頻道層級的故障排除，包含各頻道的錯誤特徵與修復方式"
read_when:
  - 頻道傳輸顯示已連線但回覆失敗時
  - 在查閱深入的提供者文件前，需要進行頻道專屬檢查時
title: "頻道故障排除"
---

> 此文件為 [English Version](/channels/troubleshooting_zh_TW) 的繁體中文版本。

# 頻道故障排除

當頻道已連線但行為異常時，請使用本頁面進行排查。

## 指令診斷階梯

請先依序執行以下指令：

```bash
openclaw status
openclaw gateway status
openclaw logs --follow
openclaw doctor
openclaw channels status --probe
```

健康的基準訊號：

- `Runtime: running` (執行中)
- `RPC probe: ok` (RPC 探測正常)
- 頻道探測顯示為已連線/就緒

## WhatsApp

### WhatsApp 錯誤特徵

| 徵兆 | 最快檢查方式 | 修復方式 |
| ------------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| 已連線但無私訊回覆 | `openclaw pairing list whatsapp` | 核准傳送者或調整私訊原則/允許清單。 |
| 群組訊息被忽略 | 檢查組態中的 `requireMention` 與提及模式 | 標註機器人或放寬該群組的提及原則。 |
| 隨機斷線或重複登入迴圈 | `openclaw channels status --probe` + 日誌 | 重新登入並驗證憑證目錄是否健康。 |

完整故障排除：[/channels/whatsapp_zh_TW#故障排除](/channels/whatsapp_zh_TW#故障排除)

## Telegram

### Telegram 錯誤特徵

| 徵兆 | 最快檢查方式 | 修復方式 |
| --------------------------------- | ----------------------------------------------- | --------------------------------------------------------- |
| 已執行 `/start` 但無回覆流程 | `openclaw pairing list telegram` | 核准配對或更改私訊原則。 |
| 機器人在線但群組保持沈默 | 驗證提及要求與機器人隱私模式 | 停用隱私模式以開放群組可見度，或標註機器人。 |
| 發送失敗並出現網路錯誤 | 檢查日誌中的 Telegram API 調用失敗記錄 | 修復連向 `api.telegram.org` 的 DNS/IPv6/代理路由。 |

完整故障排除：[/channels/telegram_zh_TW#故障排除](/channels/telegram_zh_TW#故障排除)

## Discord

### Discord 錯誤特徵

| 徵兆 | 最快檢查方式 | 修復方式 |
| ------------------------------- | ----------------------------------- | --------------------------------------------------------- |
| 機器人在線但無伺服器頻道回覆 | `openclaw channels status --probe` | 允許該伺服器/頻道，並驗證「訊息內容意圖」。 |
| 群組訊息被忽略 | 檢查日誌中因提及門檻而捨棄的記錄 | 標註機器人或將伺服器/頻道設為 `requireMention: false`。 |
| 缺失私訊回覆 | `openclaw pairing list discord` | 核准私訊配對或調整私訊原則。 |

完整故障排除：[/channels/discord_zh_TW#故障排除](/channels/discord_zh_TW#故障排除)

## Slack

### Slack 錯誤特徵

| 徵兆 | 最快檢查方式 | 修復方式 |
| -------------------------------------- | ----------------------------------------- | ------------------------------------------------- |
| Socket 模式已連線但無回應 | `openclaw channels status --probe` | 驗證 App Token + Bot Token 與所需的 Scopes。 |
| 私訊被阻擋 | `openclaw pairing list slack` | 核准配對或放寬私訊原則。 |
| 頻道訊息被忽略 | 檢查 `groupPolicy` 與頻道允許清單 | 允許該頻道或將原則切換為 `open`。 |

完整故障排除：[/channels/slack_zh_TW#故障排除](/channels/slack_zh_TW#故障排除)

## iMessage 與 BlueBubbles

### iMessage 與 BlueBubbles 錯誤特徵

| 徵兆 | 最快檢查方式 | 修復方式 |
| -------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------- |
| 無傳入事件 | 驗證 Webhook/伺服器可達性與 App 權限 | 修復 Webhook URL 或 BlueBubbles 伺服器狀態。 |
| macOS 可發送但無法接收 | 檢查 macOS 對「訊息」自動化的隱私權限 | 重新授予 TCC 權限並重啟頻道程序。 |
| 私訊傳送者被阻擋 | `openclaw pairing list imessage` 或 `openclaw pairing list bluebubbles` | 核准配對或更新允許清單。 |

完整故障排除：

- [/channels/imessage_zh_TW#故障排除](/channels/imessage_zh_TW#故障排除)
- [/channels/bluebubbles_zh_TW#故障排除](/channels/bluebubbles_zh_TW#故障排除)

## Signal

### Signal 錯誤特徵

| 徵兆 | 最快檢查方式 | 修復方式 |
| ------------------------------- | ------------------------------------------ | -------------------------------------------------------- |
| 守護行程可達但機器人沈默 | `openclaw channels status --probe` | 驗證 `signal-cli` 守護行程 URL/帳號與接收模式。 |
| 私訊被阻擋 | `openclaw pairing list signal` | 核准傳送者或調整私訊原則。 |
| 群組回覆未觸發 | 檢查群組允許清單與提及模式 | 新增傳送者/群組，或放寬門檻限制。 |

完整故障排除：[/channels/signal_zh_TW#故障排除](/channels/signal_zh_TW#故障排除)

## Matrix

### Matrix 錯誤特徵

| 徵兆 | 最快檢查方式 | 修復方式 |
| ----------------------------------- | -------------------------------------------- | ----------------------------------------------- |
| 已登入但忽略房間訊息 | `openclaw channels status --probe` | 檢查 `groupPolicy` 與房間允許清單。 |
| 私訊未被處理 | `openclaw pairing list matrix` | 核准傳送者或調整私訊原則。 |
| 加密房間失效 | 驗證加密模組與加密設定 | 啟用加密支援並重新加入/同步房間。 |

完整故障排除：[/channels/matrix_zh_TW#故障排除](/channels/matrix_zh_TW#故障排除)
