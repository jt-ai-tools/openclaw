---
summary: "飛書 (Feishu) 機器人概觀、功能與組態設定說明"
read_when:
  - 您想要連接飛書/Lark 機器人時
  - 您正在配置飛書頻道時
title: "飛書 (Feishu)"
---

> 此文件為 [English Version](/channels/feishu_zh_TW) 的繁體中文版本。

# 飛書 (Feishu) 機器人

飛書 (Feishu/Lark) 是一款用於團隊溝通與協作的平台。此外掛程式透過平台的 **長連接 (WebSocket)** 事件訂閱將 OpenClaw 連接至飛書機器人，因此無需公開 Webhook 網址即可接收訊息。

## 外掛程式需求
飛書功能是以外掛程式形式提供的。
- 安裝指令：`openclaw plugins install @openclaw/feishu`。

## 快速開始

### 1. 建立飛書應用程式
1. 登入 [飛書開放平台](https://open.feishu.cn/app)。
2. 建立企業自建應用程式。
3. 在「憑證與基礎資訊」中獲取 **App ID** 與 **App Secret**。
4. **設定權限**：批量匯入文件中的權限清單。
5. **啟用機器人能力**。
6. **設定事件訂閱**：選擇「使用長連接接收事件」，並新增 `im.message.receive_v1` 事件。**注意：設定時閘道器必須處於執行狀態。**
7. 發佈應用程式並等待審核。

### 2. 配置 OpenClaw
在 `openclaw.json` 中配置：
```json5
{
  channels: {
    feishu: {
      enabled: true,
      accounts: {
        main: {
          appId: "cli_xxx",
          appSecret: "xxx",
        },
      },
    },
  },
}
```

## 功能特性
- **長連接 (WebSocket)**：無需公網 IP 即可接收事件。
- **串流回覆 (Streaming)**：支援透過互動式卡片實現串流回覆輸出。
- **私訊政策**：預設為 `pairing`。
- **群組原則**：預設為 `open`，且預設要求標記 (@mention) 機器人。

## 疑難排解
- **機器人不回覆**：請確認機器人已加入群組、已被標記，且 `groupPolicy` 未設為 `disabled`。
- **收不到訊息**：請確認長連接已啟用、權限已授權且應用程式已發佈。
- **傳送失敗**：確認應用程式具備 `im:message:send_as_bot` 權限。
