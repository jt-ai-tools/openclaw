---
summary: "Zalo 機器人支援狀態、能力與組態設定說明"
read_when:
  - 處理 Zalo 功能或 Webhooks 時
title: "Zalo"
---

> 此文件為 [English Version](/channels/zalo_zh_TW) 的繁體中文版本。

# Zalo (機器人 API)

目前狀態：實驗性 (Experimental)。僅支援私訊 (Direct messages)；群組功能待 Zalo 官方更新後推出。

## 外掛程式需求
Zalo 功能是以外掛程式形式提供的，不包含在核心安裝中。
- 安裝指令：`openclaw plugins install @openclaw/zalo`。
- 詳情請參閱：[外掛程式 (Plugins)](/tools/plugin_zh_TW)。

## 快速設定

1. **安裝外掛程式**。
2. **設定權杖 (Token)**：
   - 可以在 [Zalo Bot Platform](https://bot.zaloplatforms.com) 獲取。
   - 格式：`12345689:abc-xyz`。
3. **配置組態**：
```json5
{
  channels: {
    zalo: {
      enabled: true,
      botToken: "您的機器人權杖",
      dmPolicy: "pairing",
    },
  },
}
```
4. **重啟閘道器**。首次傳訊時，請在閘道器端核准配對碼。

## 功能特性

- **確定性路由**：回覆一律發送回來源頻道。
- **私訊政策**：預設使用 `pairing` (配對) 模式。未知傳送者需獲核准。
- **訊息限制**：傳出文字會被切分為每段 2000 字元（Zalo API 限制）。
- **多媒體**：支援圖片下載與發送。

## 長輪詢 (Long-polling) vs Webhook
- 預設使用 **長輪詢**（無需公網網址）。
- 若要使用 **Webhook** 模式：
  - 需設定 `webhookUrl` (必須是 HTTPS) 與 `webhookSecret`。
  - Zalo API 規定 `getUpdates` (輪詢) 與 Webhook 是互斥的。

## 疑難排解
- **機器人不回覆**：請執行 `openclaw channels status --probe` 檢查權杖有效性，並確認傳送者是否已核准。
- **Webhook 接收不到事件**：確認網址正確且使用了 HTTPS，並檢查閘道器日誌。
