---
summary: "Microsoft Teams 機器人支援狀態、能力與組態設定說明"
read_when:
  - 處理 MS Teams 頻道功能時
title: "Microsoft Teams"
---

> 此文件為 [English Version](/channels/msteams_zh_TW) 的繁體中文版本。

# Microsoft Teams (外掛程式)

Updated: 2026-01-21

目前狀態：支援文字與私訊附件；頻道/群組中的檔案傳送需要設定 `sharePointSiteId` 與 Graph 權限。投票功能透過 Adaptive Cards 實現。

## 外掛程式需求
Microsoft Teams 功能是以外掛程式形式提供的。
- 安裝指令：`openclaw plugins install @openclaw/msteams`。

## 快速設定

1. **建立 Azure Bot**：獲取 App ID、客戶端密碼 (Client Secret) 與租戶 ID (Tenant ID)。
2. **公開端點**：將 `/api/messages`（預設 3978 埠）透過公網 URL 或隧道（如 ngrok/Tailscale Funnel）公開。
3. **配置 OpenClaw**：
```json5
{
  channels: {
    msteams: {
      enabled: true,
      appId: "您的_APP_ID",
      appPassword: "您的_APP_PASSWORD",
      tenantId: "您的_TENANT_ID",
      webhook: { port: 3978, path: "/api/messages" },
    },
  },
}
```
4. **安裝 Teams 應用程式包**：建立 `manifest.json` 並上傳至 Teams。

## 存取控制 (DMs + 群組)
- **私訊政策**：預設為 `pairing`。未知傳送者需獲核准。
- **群組政策**：預設為 `allowlist`。需設定 `groupAllowFrom` 或將 `groupPolicy` 設為 `open`。
- **提及門控**：在頻道或群組中預設要求標記 (@mention) 機器人。

## 檔案傳送機制
- **私訊 (DMs)**：內建支援，無需額外設定。
- **群組與頻道**：由於機器人沒有個人 OneDrive 空間，**必須** 配置 `sharePointSiteId` 並授予 `Sites.ReadWrite.All` 的 Graph API 權限，機器人會將檔案上傳至 SharePoint 並分享連結。

## 回覆樣式：執行緒 vs 貼文
Teams 頻道有兩種類型，若回覆位置顯示異常，請調整 `replyStyle`：
- **Posts (傳統)**：訊息以卡片形式呈現，回覆位於下方。建議 `replyStyle: "thread"` (預設)。
- **Threads (類似 Slack)**：訊息線性流動。建議 `replyStyle: "top-level"`。

## 疑難排解
- **頻道中不回覆**：預設要求標記機器人。請確認標記正確或將 `requireMention` 設為 `false`。
- **圖片不顯示**：頻道圖片需要 Graph API 權限與管理員同意。
- **URL 錯誤**：請注意 Teams URL 中的 `groupId` **不是** 團隊 ID。請從 URL 路徑中提取編碼過的 ID（以 `19:` 開頭）。
