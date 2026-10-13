---
summary: "透過 NIP-04 加密訊息實現 Nostr 私訊 (DM) 頻道"
read_when:
  - 您想要讓 OpenClaw 透過 Nostr 接收私訊時
  - 您正在設定去中心化通訊功能時
title: "Nostr"
---

> 此文件為 [English Version](/channels/nostr_zh_TW) 的繁體中文版本。

# Nostr

**目前狀態**：選用的外掛程式（預設停用）。

Nostr 是一個去中心化的社交網路協定。此頻道讓 OpenClaw 能透過 NIP-04 協定接收並回覆加密的私訊 (DMs)。

## 安裝方式

### 引導設定（推薦）
在執行 `openclaw onboard` 或 `openclaw channels add` 時，清單會列出可選的頻道外掛程式。選擇 Nostr 即可觸發按需求安裝。

### 手動安裝
```bash
openclaw plugins install @openclaw/nostr
```
安裝或啟用外掛程式後，請務必重啟閘道器 (Gateway)。

## 快速設定

1. **產生金鑰對**（若尚未擁有）。
2. **加入組態**：
```json
{
  "channels": {
    "nostr": {
      "privateKey": "${NOSTR_PRIVATE_KEY}"
    }
  }
}
```
3. **設定環境變數**：`export NOSTR_PRIVATE_KEY="nsec1..."`。
4. **重啟閘道器**。

## 存取控制 (DM Policies)
- **pairing** (預設)：未知傳送者會收到配對碼。
- **allowlist**：僅允許 `allowFrom` 中的公鑰 (Pubkeys) 進行私訊。
- **open**：公開私訊（需設定 `allowFrom: ["*"]`）。

## 組態參考
- `privateKey`：`nsec` 或 16 進位格式的私鑰。
- `relays`：中繼站 URL 列表（預設包含 Damus 與 nos.lol）。
- `profile`：NIP-01 個人檔案詮釋資料（名稱、顯示名稱、頭像等）。

## 協定支援度
- **NIP-01**：基本事件格式與個人檔案。
- **NIP-04**：加密私訊 (`kind:4`)。
- **NIP-17/NIP-44**：規劃中。

## 疑難排解
- **收不到訊息**：請檢查私鑰有效性、中繼站連線狀態以及 `enabled` 開關。
- **重複回覆**：使用多個中繼站時是正常的。OpenClaw 會根據事件 ID 進行去重，僅針對第一次抵達的訊息回覆。
