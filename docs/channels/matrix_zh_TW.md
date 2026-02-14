---
summary: "Matrix 支援狀態、能力與組態設定說明"
read_when:
  - 處理 Matrix 頻道功能時
title: "Matrix"
---

> 此文件為 [English Version](/channels/matrix_zh_TW) 的繁體中文版本。

# Matrix (外掛程式)

Matrix 是一個開放且去中心化的通訊協定。OpenClaw 會以 Matrix **使用者** 身分連線至任何 Homeserver。您可以直接傳送私訊 (DM) 給機器人，或是將其邀請至房間 (Rooms)。

目前狀態：透過外掛程式支援。支援私訊、房間、執行緒、多媒體、回應表情、投票、地理位置以及端到端加密 (E2EE)。

## 外掛程式需求
Matrix 功能是以外掛程式形式提供的。
- 安裝指令：`openclaw plugins install @openclaw/matrix`。

## 設定步驟

1. **安裝外掛程式**。
2. **獲取存取權杖 (Access Token)**：
   - 透過 Matrix 登入 API 獲取，或在組態中設定 `userId` 與 `password` 由 OpenClaw 自動登入。
3. **配置組態**：
```json5
{
  channels: {
    matrix: {
      enabled: true,
      homeserver: "https://matrix.org",
      accessToken: "您的存取權杖",
      encryption: true, // 建議啟用加密
      dm: { policy: "pairing" },
    },
  },
}
```
4. **重啟閘道器**。

## 加密功能 (E2EE)
OpenClaw 支援透過 Rust crypto SDK 進行端到端加密。
- **裝置驗證**：啟用加密後，機器人在啟動時會要求裝置驗證。請在另一個客戶端（如 Element）中核准驗證請求以建立信任。
- **加密房間**：驗證成功後，機器人即可解密並閱讀加密房間內的訊息。

## 存取控制
- **私訊政策**：預設為 `pairing`。未知傳送者需獲核准。
- **房間原則**：預設為 `allowlist` 且預設要求標記機器人。

## 疑難排解
- **房間訊息不回覆**：請確認房間已加入允許清單，且機器人已被標記。
- **加密房間失敗**：請確認已成功完成裝置驗證，且 crypto 模組已正確載入。
