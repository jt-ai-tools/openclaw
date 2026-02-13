---
summary: "透過 gogcli 將 Gmail Pub/Sub 推送串接至 OpenClaw Webhook 的設定指南"
read_when:
  - 將 Gmail 收件匣觸發器串接至 OpenClaw 時
  - 設定用於代理人喚醒的 Pub/Sub 推送功能時
title: "Gmail PubSub"
---

> 此文件為 [English Version](/automation/gmail-pubsub) 的繁體中文版本。

# Gmail Pub/Sub -> OpenClaw

目標：Gmail 監控 (Watch) -> Pub/Sub 推送 -> `gog gmail watch serve` -> OpenClaw Webhook。

## 前置要求

- 已安裝 `gcloud` 並完成登入（[安裝指南](https://docs.cloud.google.com/sdk/docs/install-sdk)）。
- 已安裝 `gog` (gogcli) 並針對 Gmail 帳號完成授權（[gogcli.sh](https://gogcli.sh/)）。
- 已啟用 OpenClaw 鉤子 (Hooks) 功能（請參閱 [Webhooks](/automation/webhook_zh_TW)）。
- 已登入 `tailscale`（[tailscale.com](https://tailscale.com/)）。官方支援的設定使用 Tailscale Funnel 作為公開的 HTTPS 端點。
  雖然其他隧道服務也可能運作，但屬於自行設定 (DIY) 且不在官方支援範圍內，需要手動串接。
  目前我們主要支援 Tailscale。

Webhook 組態範例（啟用 Gmail 預設映射）：

```json5
{
  hooks: {
    enabled: true,
    token: "OPENCLAW_HOOK_TOKEN",
    path: "/hooks",
    presets: ["gmail"],
  },
}
```

若要將 Gmail 摘要傳送至聊天介面，請透過映射覆寫預設設定，並設定 `deliver` 以及選用的 `channel`/`to`：

```json5
{
  hooks: {
    enabled: true,
    token: "OPENCLAW_HOOK_TOKEN",
    presets: ["gmail"],
    mappings: [
      {
        match: { path: "gmail" },
        action: "agent",
        wakeMode: "now",
        name: "Gmail",
        sessionKey: "hook:gmail:{{messages[0].id}}",
        messageTemplate: "來自 {{messages[0].from}} 的新郵件
主旨：{{messages[0].subject}}
{{messages[0].snippet}}
{{messages[0].body}}",
        model: "openai/gpt-5.2-mini",
        deliver: true,
        channel: "last",
        // to: "+15551234567"
      },
    ],
  },
}
```

如果您希望固定使用特定頻道，請設定 `channel` 與 `to`。否則 `channel: "last"` 會使用最後一次的遞送路徑（若無則回退至 WhatsApp）。

若要強制在執行 Gmail 任務時使用較便宜的模型，請在映射中設定 `model`（提供者/模型或別名）。如果您強制執行了 `agents.defaults.models` 限制，請確保該模型包含在內。

若要專門為 Gmail 鉤子設定預設的模型與思考等級，請在組態中加入 `hooks.gmail.model` / `hooks.gmail.thinking`：

```json5
{
  hooks: {
    gmail: {
      model: "openrouter/meta-llama/llama-3.3-70b-instruct:free",
      thinking: "off",
    },
  },
}
```

注意事項：

- 映射中個別 Hook 的 `model`/`thinking` 設定仍會覆寫上述預設值。
- 備援順序：`hooks.gmail.model` → `agents.defaults.model.fallbacks` → 主要模型（驗證/頻率限制/逾時）。
- 若設定了 `agents.defaults.models`，Gmail 模型必須位於允許清單中。
- Gmail 鉤子內容預設會被包裝在外部內容安全邊界中。若要停用（具危險性），請設定 `hooks.gmail.allowUnsafeExternalContent: true`。

若要進一步自訂負載處理，請新增 `hooks.mappings` 或在 `hooks.transformsDir` 下放置 JS/TS 轉換模組（參見 [Webhooks](/automation/webhook_zh_TW)）。

## 引導精靈 (建議方式)

使用 OpenClaw 輔助工具將所有功能串接在一起（macOS 上會透過 Brew 自動安裝依賴項）：

```bash
openclaw webhooks gmail setup 
  --account openclaw@gmail.com
```

預設行為：

- 使用 Tailscale Funnel 作為公開的推送端點。
- 為 `openclaw webhooks gmail run` 寫入 `hooks.gmail` 組態。
- 啟用 Gmail 鉤子預設設定 (`hooks.presets: ["gmail"]`)。

路徑說明：當啟用了 `tailscale.mode`，OpenClaw 會自動將 `hooks.gmail.serve.path` 設為 `/`，並將公開路徑保持為 `hooks.gmail.tailscale.path`（預設為 `/gmail-pubsub`），因為 Tailscale 在代理前會移除 set-path 前綴。
如果您需要後端接收包含前綴的路徑，請將 `hooks.gmail.tailscale.target` (或 `--tailscale-target`) 設定為完整的 URL（例如 `http://127.0.0.1:8788/gmail-pubsub`）並與 `hooks.gmail.serve.path` 相符。

想要自訂端點？請使用 `--push-endpoint <URL>` 或 `--tailscale off`。

平台說明：在 macOS 上，精靈會透過 Homebrew 安裝 `gcloud`, `gogcli` 與 `tailscale`；在 Linux 上請先手動安裝。

閘道器自動啟動（建議方式）：

- 當 `hooks.enabled=true` 且設定了 `hooks.gmail.account` 時，閘道器會在啟動時自動執行 `gog gmail watch serve` 並自動續期監控。
- 設定 `OPENCLAW_SKIP_GMAIL_WATCHER=1` 可取消此功能（若您打算自行執行守護行程）。
- 請勿同時手動執行守護行程，否則會遇到 `listen tcp 127.0.0.1:8788: bind: address already in use` 錯誤。

手動啟動守護行程（啟動 `gog gmail watch serve` + 自動續期）：

```bash
openclaw webhooks gmail run
```

## 單次性設定步驟

1. 選擇擁有 `gog` 所使用之 OAuth 用戶端的 GCP 專案。

```bash
gcloud auth login
gcloud config set project <專案ID>
```

注意：Gmail 監控要求 Pub/Sub 主題必須與 OAuth 用戶端位於同一個專案。

2. 啟用 API：

```bash
gcloud services enable gmail.googleapis.com pubsub.googleapis.com
```

3. 建立主題 (Topic)：

```bash
gcloud pubsub topics create gog-gmail-watch
```

4. 允許 Gmail 推送功能發佈訊息：

```bash
gcloud pubsub topics add-iam-policy-binding gog-gmail-watch 
  --member=serviceAccount:gmail-api-push@system.gserviceaccount.com 
  --role=roles/pubsub.publisher
```

## 開始監控 (Start the watch)

```bash
gog gmail watch start 
  --account openclaw@gmail.com 
  --label INBOX 
  --topic projects/<專案ID>/topics/gog-gmail-watch
```

請儲存輸出內容中的 `history_id`（供偵錯使用）。

## 執行推送處理程式 (Push handler)

本地範例（使用共享 Token 驗證）：

```bash
gog gmail watch serve 
  --account openclaw@gmail.com 
  --bind 127.0.0.1 
  --port 8788 
  --path /gmail-pubsub 
  --token <共享金鑰> 
  --hook-url http://127.0.0.1:18789/hooks/gmail 
  --hook-token OPENCLAW_HOOK_TOKEN 
  --include-body 
  --max-bytes 20000
```

注意事項：

- `--token` 用於保護推送端點（支援 `x-gog-token` 標頭或 `?token=` 參數）。
- `--hook-url` 指向 OpenClaw 的 `/hooks/gmail`（映射路徑；執行隔離回合 + 發送摘要至主會話）。
- `--include-body` 與 `--max-bytes` 控制傳送至 OpenClaw 的郵件主體摘要長度。

建議方式：`openclaw webhooks gmail run` 指令封裝了上述流程並會自動續期監控。

## 公開處理程式（進階用法，非官方支援）

如果您需要使用非 Tailscale 的隧道，請手動串接並在推送訂閱中使用公開 URL（無防護指引）：

```bash
cloudflared tunnel --url http://127.0.0.1:8788 --no-autoupdate
```

使用產生的 URL 作為推送端點：

```bash
gcloud pubsub subscriptions create gog-gmail-watch-push 
  --topic gog-gmail-watch 
  --push-endpoint "https://<公開URL>/gmail-pubsub?token=<共享金鑰>"
```

生產環境：請使用穩定的 HTTPS 端點並配置 Pub/Sub OIDC JWT，然後執行：

```bash
gog gmail watch serve --verify-oidc --oidc-email <服務帳號@...>
```

## 測試

傳送一封訊息至受監控的收件匣：

```bash
gog gmail send 
  --account openclaw@gmail.com 
  --to openclaw@gmail.com 
  --subject "監控測試" 
  --body "ping"
```

檢查監控狀態與歷史紀錄：

```bash
gog gmail watch status --account openclaw@gmail.com
gog gmail history --account openclaw@gmail.com --since <historyId>
```

## 故障排除

- `Invalid topicName`：專案不符（主題不在 OAuth 用戶端所屬的專案中）。
- `User not authorized`：主題上缺少 `roles/pubsub.publisher` 權限。
- 訊息內容為空：Gmail 推送僅提供 `historyId`；內容需透過 `gog gmail history` 抓取。

## 清除設定

```bash
gog gmail watch stop --account openclaw@gmail.com
gcloud pubsub subscriptions delete gog-gmail-watch-push
gcloud pubsub topics delete gog-gmail-watch
```
