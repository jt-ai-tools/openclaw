---
summary: "用於喚醒與隔離代理人執行的 Webhook 進入點說明"
read_when:
  - 新增或修改 Webhook 端點時
  - 將外部系統串接至 OpenClaw 時
title: "Webhooks"
---

> 此文件為 [English Version](/automation/webhook_zh_TW) 的繁體中文版本。

# Webhooks

閘道器 (Gateway) 可以公開一個小型 HTTP Webhook 端點，用於接收外部觸發。

## 啟用方式

```json5
{
  hooks: {
    enabled: true,
    token: "共享秘密金鑰",
    path: "/hooks",
    allowedAgentIds: ["hooks", "main"], // 限制可選用的代理人 ID
  },
}
```

## 驗證方式 (Auth)
每個請求必須包含 Hook 權杖。推薦使用 Header：
- `Authorization: Bearer <權杖>`
- `x-openclaw-token: <權杖>`

## 端點說明

### `POST /hooks/wake` (喚醒)
- **作用**：在 **主 (main)** 工作階段中排入一個系統事件。
- **參數**：
  - `text` (必填)：事件描述（例如：「收到新郵件」）。
  - `mode` (選填)：`now` (立即觸發心跳偵測) 或 `next-heartbeat` (等待下次檢查)。

### `POST /hooks/agent` (獨立回合)
- **作用**：執行一個 **隔離** 的代理人回合（擁有獨立的工作階段金鑰），並在主工作階段貼出摘要。
- **參數**：
  - `message` (必填)：代理人應處理的提示詞。
  - `name`：顯示於摘要中的來源名稱（如：「GitHub」）。
  - `model` / `thinking`：模型與推理等級覆寫。
  - `deliver`：若為 true，則將回覆發送至通訊頻道。

## 安全性建議
- 保持 Hook 端點僅限本地 (Loopback)、Tailnet 或受信任的反向代理存取。
- 使用專用的 Hook 權杖，不要重用閘道器驗證權杖。
- 為了安全性，Hook 酬載預設被視為不可信內容並會被封裝處理。
