# @openclaw/nostr

針對 OpenClaw 的 Nostr 私訊 (DM) 頻道外掛程式，使用 NIP-04 加密私訊技術。

## 概觀

此擴充功能將 Nostr 新增為 OpenClaw 的通訊頻道。它能讓您的機器人：

- 接收來自 Nostr 使用者的加密私訊 (DMs)
- 傳送加密回應
- 與任何支援 NIP-04 的 Nostr 客戶端（如 Damus, Amethyst 等）協同運作

## 安裝

```bash
openclaw plugins install @openclaw/nostr
```

## 快速設定

1. 產生 Nostr 金鑰對（如果您還沒有）：

   ```bash
   # 使用 nak CLI
   nak key generate

   # 或使用任何 Nostr 金鑰產生器
   ```

2. 新增至您的組態：

   ```json
   {
     "channels": {
       "nostr": {
         "privateKey": "${NOSTR_PRIVATE_KEY}",
         "relays": ["wss://relay.damus.io", "wss://nos.lol"]
       }
     }
   }
   ```

3. 設定環境變數：

   ```bash
   export NOSTR_PRIVATE_KEY="nsec1..."  # 或十六進位格式
   ```

4. 重啟閘道器 (Gateway)

## 組態參數

| 鍵名 (Key)   | 類型     | 預設值                                      | 說明                                                       |
| ------------ | -------- | ------------------------------------------- | ---------------------------------------------------------- |
| `privateKey` | string   | 必填                                        | 機器人的私鑰 (nsec 或十六進位格式)                          |
| `relays`     | string[] | `["wss://relay.damus.io", "wss://nos.lol"]` | WebSocket 中繼站 (Relay) URL                               |
| `dmPolicy`   | string   | `"pairing"`                                 | 存取控制：`pairing`, `allowlist`, `open`, `disabled`       |
| `allowFrom`  | string[] | `[]`                                        | 允許的傳送者公鑰 (npub 或十六進位)                          |
| `enabled`    | boolean  | `true`                                      | 啟用/停用此頻道                                            |
| `name`       | string   | -                                           | 帳號顯示名稱                                               |

## 存取控制

### 私訊策略 (DM Policies)

- **pairing**（預設）：不明傳送者會收到配對碼以請求存取權限。
- **allowlist**：僅限 `allowFrom` 中的公鑰可以傳送訊息給機器人。
- **open**：任何人都可以傳送訊息給機器人（請謹慎使用）。
- **disabled**：停用私訊功能。

### 範例：允許清單模式 (Allowlist Mode)

```json
{
  "channels": {
    "nostr": {
      "privateKey": "${NOSTR_PRIVATE_KEY}",
      "dmPolicy": "allowlist",
      "allowFrom": ["npub1abc...", "0123456789abcdef..."]
    }
  }
}
```

## 測試

### 本地中繼站 (建議)

```bash
# 使用 strfry
docker run -p 7777:7777 ghcr.io/hoytech/strfry

# 配置 openclaw 使用本地中繼站
"relays": ["ws://localhost:7777"]
```

### 手動測試

1. 啟動已配置 Nostr 的閘道器。
2. 開啟 Damus, Amethyst 或其它 Nostr 客戶端。
3. 發送私訊給您機器人的 npub。
4. 確認機器人是否回應。

## 協定支援

| NIP    | 狀態      | 備註                   |
| ------ | --------- | ---------------------- |
| NIP-01 | 支援      | 基本事件結構           |
| NIP-04 | 支援      | 加密私訊 (kind:4)      |
| NIP-17 | 規劃中    | 禮物包裝私訊 (v2)      |

## 安全注意事項

- 私鑰絕不會被記錄在 log 中。
- 事件簽章 (Signatures) 在處理前會先經過驗證。
- 請針對金鑰使用環境變數，切勿將其直接提交至組態檔案中。
- 生產環境中建議考慮使用 `allowlist` 模式。

## 疑難排解

### 機器人未接收訊息

1. 驗證私鑰配置是否正確。
2. 檢查中繼站連線狀態。
3. 確保 `enabled` 未被設定為 `false`。
4. 檢查機器人的公鑰是否與您發送對象相符。

### 訊息未送達

1. 檢查中繼站 URL 是否正確（必須使用 `wss://`）。
2. 驗證中繼站是否在線並接受連線。
3. 檢查是否存在速率限制 (Rate limiting)（減少發送頻率）。

## 授權條款

MIT
