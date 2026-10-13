---
summary: "Twitch 聊天機器人組態與設定說明"
read_when:
  - 為 OpenClaw 設定 Twitch 聊天整合功能時
title: "Twitch"
---

> 此文件為 [English Version](/channels/twitch_zh_TW) 的繁體中文版本。

# Twitch (外掛程式)

透過 IRC 連線支援 Twitch 聊天功能。OpenClaw 會以 Twitch 使用者（機器人帳號）的身分連線，在頻道中接收並發送訊息。

## 外掛程式需求
Twitch 功能是以外掛程式形式提供的。
- 安裝指令：`openclaw plugins install @openclaw/twitch`。

## 快速設定

1. **建立帳號**：為機器人建立一個專用的 Twitch 帳號。
2. **產生憑證**：使用 [Twitch Token Generator](https://twitchtokengenerator.com/)。
   - 選擇 **Bot Token**。
   - 勾選 `chat:read` 與 `chat:write` 權限。
   - 複製 **Client ID** 與 **Access Token**。
3. **查詢使用者 ID**：使用線上工具將 Twitch 使用者名稱轉換為數值 ID。
4. **配置組態**：
```json5
{
  channels: {
    twitch: {
      enabled: true,
      username: "機器人帳號",
      accessToken: "oauth:abc...",
      clientId: "xyz...",
      channel: "目標頻道",
      allowFrom: ["您的使用者ID"], // 建議設定以限制存取
    },
  },
}
```
5. **啟動閘道器**。

## 存取控制 (建議設定)
- **allowlist (允許清單)**：使用數值使用者 ID。因為使用者名稱可變，但 ID 是永久不變的。
- **角色限制**：可透過 `allowedRoles` 限制只有 `"moderator"`, `"owner"`, `"vip"` 等角色能觸發機器人。

## 功能特性
- **自動切分訊息**：Twitch 每則訊息上限 500 字元，OpenClaw 會自動在單字邊界處切分。
- **自動重新整理權杖**：若配置了 `clientSecret` 與 `refreshToken`，機器人會自動更新權杖。

## 疑難排解
- **機器人不回覆**：請檢查 `allowFrom` 設定，並確認機器人已成功加入指定頻道。
- **連線失敗**：確認 `accessToken` 包含 `oauth:` 前綴，且權限範圍正確。
