---
summary: "透過 gogcli 將 Gmail Pub/Sub 推送串接至 OpenClaw Webhook 的設定指引"
read_when:
  - 將 Gmail 收件匣觸發器串接至 OpenClaw 時
  - 為代理人喚醒設定 Pub/Sub 推送時
title: "Gmail PubSub"
---

> 此文件為 [English Version](/automation/gmail-pubsub_zh_TW) 的繁體中文版本。

# Gmail Pub/Sub -> OpenClaw

目標：實現 Gmail 監聽 -> Pub/Sub 推送 -> `gog gmail watch serve` -> OpenClaw Webhook 的自動化流程。

## 事前準備

- 已安裝並登入 `gcloud`。
- 已安裝 `gog` (gogcli) 並授權 Gmail 帳號。
- 已啟用 OpenClaw 勾子 (Hooks)（參閱 [Webhooks](/automation/webhook_zh_TW)）。
- 已登入 `tailscale`（支援使用 Tailscale Funnel 作為公網 HTTPS 端點）。

## 引導精靈（推薦方式）

使用 OpenClaw 輔助指令來自動串接所有環節（macOS 下會透過 Brew 安裝相依項）：

```bash
openclaw webhooks gmail setup --account 您的信箱@gmail.com
```

**預設行為：**
- 使用 Tailscale Funnel 作為公網推送端點。
- 寫入 `hooks.gmail` 組態並啟用 Gmail 預設映射。

## 閘道器自動啟動

當 `hooks.enabled=true` 且設定了 `hooks.gmail.account` 時，閘道器會在啟動時自動執行 `gog gmail watch serve` 並自動更新監聽。若要取消此行為，請設定環境變數 `OPENCLAW_SKIP_GMAIL_WATCHER=1`。

## 手動執行背景程式

```bash
openclaw webhooks gmail run
```

## 注意事項與安全性
- **專案一致性**：Gmail 監聽要求 Pub/Sub 主題 (Topic) 必須位於與 OAuth 客戶端相同的 GCP 專案中。
- **權限設定**：必須允許 Gmail 推送服務帳號具備發布權限 (`roles/pubsub.publisher`)。
- **安全封裝**：Gmail 勾子內容預設會被視為外部不可信內容並進行安全封裝。
