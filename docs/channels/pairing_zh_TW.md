---
summary: "配對概觀：核准誰可以傳送私訊給您，以及哪些節點可以加入網路"
read_when:
  - 設定私訊存取控制時
  - 配對新的 iOS/Android 節點時
  - 檢視 OpenClaw 的安全態勢時
title: "配對"
---

> 此文件為 [English Version](/channels/pairing_zh_TW) 的繁體中文版本。

# 配對 (Pairing)

「配對」是 OpenClaw 明確的 **擁有者核准** 步驟。
它用於兩個地方：

1. **私訊 (DM) 配對**（決定誰被允許與機器人對話）
2. **節點配對**（決定哪些裝置/節點被允許加入閘道器網路）

安全性上下文請見：[安全性](/gateway/security_zh_TW)

## 1) 私訊配對 (傳入聊天存取)

當頻道的私訊原則 (DM policy) 設定為 `pairing` 時，未知的傳送者會收到一組簡短的配對碼，在您核准之前，他們的訊息 **不會被處理**。

預設的私訊原則記錄於：[安全性](/gateway/security_zh_TW)

配對碼規則：

- 8 位字元，全大寫，排除易混淆字元 (`0O1I`)。
- **1 小時後過期**。機器人僅在建立新請求時發送配對訊息（針對每位傳送者大約每小時發送一次）。
- 預設每個頻道待處理的私訊配對請求上限為 **3 個**；超過此上限的請求將被忽略，直到有舊請求過期或被核准。

### 核准傳送者

```bash
openclaw pairing list telegram
openclaw pairing approve telegram <配對碼>
```

支援的頻道：`telegram`, `whatsapp`, `signal`, `imessage`, `discord`, `slack`。

### 狀態儲存位置

儲存於 `~/.openclaw/credentials/` 目錄下：

- 待處理請求：`<channel>-pairing.json`
- 已核准的允許清單：`<channel>-allowFrom.json`

請將這些檔案視為敏感資料（它們掌控了存取您助理的權限）。

## 2) 節點裝置配對 (iOS/Android/macOS/無頭節點)

節點以 `role: node` 的 **裝置** 身分連線至閘道器。閘道器會建立一個必須經過核准的裝置配對請求。

### 透過 Telegram 配對 (建議 iOS 使用)

如果您使用了 `device-pair` 外掛程式，您可以完全在 Telegram 中完成首次的裝置配對：

1. 在 Telegram 中，傳送訊息給您的機器人：`/pair`
2. 機器人會回傳兩則訊息：一則是操作說明，另一則是獨立的 **設定碼 (setup code)** 訊息（方便在 Telegram 中複製貼上）。
3. 在您的手機上，開啟 OpenClaw iOS App → Settings → Gateway。
4. 貼上設定碼並連線。
5. 回到 Telegram 傳送：`/pair approve`

設定碼是經過 Base64 編碼的 JSON 負載，包含：

- `url`: 閘道器 WebSocket URL (`ws://...` 或 `wss://...`)
- `token`: 一個短期的配對 Token

在有效期間內，請將設定碼視同密碼保管。

### 核准節點裝置

```bash
openclaw devices list
openclaw devices approve <請求ID>
openclaw devices reject <請求ID>
```

### 節點配對狀態儲存位置

儲存於 `~/.openclaw/devices/` 目錄下：

- `pending.json` (短期；待處理請求會過期)
- `paired.json` (已配對裝置 + Token)

### 注意事項

- 舊版的 `node.pair.*` API (CLI: `openclaw nodes pending/approve`) 是一個獨立的、由閘道器擁有的配對存儲區。WS 節點仍需要進行裝置配對。

## 相關文件

- 安全模型 + 提示詞注入：[安全性](/gateway/security_zh_TW)
- 安全更新 (執行 Doctor)：[更新](/install/updating_zh_TW)
- 頻道組態設定：
  - Telegram: [Telegram](/channels/telegram_zh_TW)
  - WhatsApp: [WhatsApp](/channels/whatsapp_zh_TW)
  - Signal: [Signal](/channels/signal_zh_TW)
  - BlueBubbles (iMessage): [BlueBubbles](/channels/bluebubbles_zh_TW)
  - iMessage (舊版): [iMessage](/channels/imessage_zh_TW)
  - Discord: [Discord](/channels/discord_zh_TW)
  - Slack: [Slack](/channels/slack_zh_TW)
