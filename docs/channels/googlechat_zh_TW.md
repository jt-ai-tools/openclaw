---
summary: "Google Chat 應用程式支援狀態、能力與組態設定說明"
read_when:
  - 處理 Google Chat 頻道功能時
title: "Google Chat"
---

> 此文件為 [English Version](/channels/googlechat) 的繁體中文版本。

# Google Chat (Chat API)

狀態：支援透過 Google Chat API Webhook（僅限 HTTP）進行私訊 (DMs) 與空間 (Spaces) 通訊。

## 快速設定 (新手適用)

1. 建立一個 Google Cloud 專案並啟用 **Google Chat API**。
   - 前往：[Google Chat API 憑證頁面](https://console.cloud.google.com/apis/api/chat.googleapis.com/credentials)
   - 若尚未啟用，請先點選啟用該 API。
2. 建立 **服務帳號 (Service Account)**：
   - 點選 **建立憑證** > **服務帳號**。
   - 自訂名稱（例如：`openclaw-chat`）。
   - 權限部分可留空（點選 **繼續**）。
   - 授予存取權限的主體部分可留空（點選 **完成**）。
3. 建立並下載 **JSON 密鑰 (JSON Key)**：
   - 在服務帳號列表中，點選您剛剛建立的帳號。
   - 切換至 **金鑰 (Keys)** 頁籤。
   - 點選 **新增金鑰** > **建立新金鑰**。
   - 選擇 **JSON** 並點選 **建立**。
4. 將下載的 JSON 檔案儲存在您的閘道器主機上（例如：`~/.openclaw/googlechat-service-account.json`）。
5. 在 [Google Cloud Console Chat 設定頁面](https://console.cloud.google.com/apis/api/chat.googleapis.com/hangouts-chat) 建立一個 Google Chat 應用程式：
   - 填寫 **應用程式資訊 (Application info)**：
     - **應用程式名稱**：(例如 `OpenClaw`)
     - **標誌 URL**：(例如 `https://openclaw.ai/logo.png`)
     - **描述**：(例如 `個人 AI 助理`)
   - 啟用 **互動功能 (Interactive features)**。
   - 在 **功能 (Functionality)** 下，勾選 **加入空間與群組對話 (Join spaces and group conversations)**。
   - 在 **連線設定 (Connection settings)** 下，選擇 **HTTP 端點 URL**。
   - 在 **觸發條件 (Triggers)** 下，選擇 **所有觸發條件皆使用共同的 HTTP 端點 URL**，並將其設定為您閘道器的公開 URL 加上 `/googlechat`。
     - *小提示：執行 `openclaw status` 可查看您的閘道器公開 URL。*
   - 在 **公開範圍 (Visibility)** 下，勾選 **將此聊天應用程式提供給 <您的網域> 中的特定人員和群組**。
   - 在文字框中輸入您的電子郵件地址（例如 `user@example.com`）。
   - 點選底部的 **儲存**。
6. **啟用應用程式狀態**：
   - 儲存後，**重新整理頁面**。
   - 尋找 **應用程式狀態 (App status)** 區段（通常位於儲存後的頁面頂端或底部）。
   - 將狀態變更為 **正式上線 - 開放給使用者 (Live - available to users)**。
   - 再次點選 **儲存**。
7. 在 OpenClaw 中配置服務帳號路徑與 Webhook 適用對象 (Audience)：
   - 環境變數：`GOOGLE_CHAT_SERVICE_ACCOUNT_FILE=/路徑/至/service-account.json`
   - 或組態設定：`channels.googlechat.serviceAccountFile: "/路徑/至/service-account.json"`。
8. 設定 Webhook 的適用對象類型與數值（必須與您的 Chat 應用程式設定相符）。
9. 啟動閘道器。Google Chat 將會發送 POST 請求至您的 Webhook 路徑。

## 加入 Google Chat

當閘道器正在執行且您的電子郵件已加入公開範圍清單後：

1. 前往 [Google Chat](https://chat.google.com/)。
2. 點選 **直接訊息** 旁的 **+**（加號）圖示。
3. 在搜尋列中，輸入您在 Google Cloud Console 配置的 **應用程式名稱**。
   - **注意**：由於這是私有應用程式，它 **不會** 出現在「市場 (Marketplace)」瀏覽清單中。您必須透過名稱搜尋。
4. 從結果中選擇您的機器人。
5. 點選 **新增** 或 **聊天** 即可開始 1:1 對話。
6. 傳送「您好」來觸發助理！

## 公開 URL (僅限 Webhook)

Google Chat 的 Webhook 需要一個公開的 HTTPS 端點。基於安全性考量，請 **僅將 `/googlechat` 路徑公開** 至網際網路。請將 OpenClaw 儀表板與其他敏感端點保留在私有網路中。

### 選項 A：Tailscale Funnel (建議方式)

使用 Tailscale Serve 提供私有儀表板，並使用 Funnel 提供公開的 Webhook 路徑。這能讓根路徑 `/` 保持私有，僅公開 `/googlechat`。

1. **檢查您的閘道器綁定位址：**

   ```bash
   ss -tlnp | grep 18789
   ```

   記下 IP 位址（例如：`127.0.0.1`, `0.0.0.0`, 或您的 Tailscale IP 如 `100.x.x.x`）。

2. **僅向 Tailnet 公開儀表板 (連接埠 8443)：**

   ```bash
   # 若綁定於 localhost (127.0.0.1 或 0.0.0.0)：
   tailscale serve --bg --https 8443 http://127.0.0.1:18789

   # 若僅綁定於 Tailscale IP (例如 100.106.161.80)：
   tailscale serve --bg --https 8443 http://100.106.161.80:18789
   ```

3. **公開暴露 Webhook 路徑：**

   ```bash
   # 若綁定於 localhost (127.0.0.1 或 0.0.0.0)：
   tailscale funnel --bg --set-path /googlechat http://127.0.0.1:18789/googlechat

   # 若僅綁定於 Tailscale IP (例如 100.106.161.80)：
   tailscale funnel --bg --set-path /googlechat http://100.106.161.80:18789/googlechat
   ```

4. **授權該節點進行 Funnel 存取：**
   若有提示，請造訪輸出內容中顯示的授權 URL，以便在您的 Tailnet 政策中為該節點啟用 Funnel 功能。

5. **驗證設定：**

   ```bash
   tailscale serve status
   tailscale funnel status
   ```

您的公開 Webhook URL 將會是：
`https://<節點名稱>.<tailnet>.ts.net/googlechat`

您的私有儀表板仍僅限 Tailnet 內部存取：
`https://<節點名稱>.<tailnet>.ts.net:8443/`

在 Google Chat 應用程式設定中使用該公開 URL（不含 `:8443`）。

> 注意：此設定在重啟後依然有效。若日後要移除，請執行 `tailscale funnel reset` 與 `tailscale serve reset`。

### 選項 B：反向代理 (Caddy)

如果您使用 Caddy 等反向代理伺服器，請僅代理特定路徑：

```caddy
your-domain.com {
    reverse_proxy /googlechat* localhost:18789
}
```

透過此組態，任何對 `your-domain.com/` 的請求都會被忽略或傳回 404，而 `your-domain.com/googlechat` 則會安全地路由至 OpenClaw。

### 選項 C：Cloudflare Tunnel

配置您的隧道入站規則 (Ingress rules)，僅路由 Webhook 路徑：

- **路徑**：`/googlechat` -> `http://localhost:18789/googlechat`
- **預設規則**：HTTP 404 (Not Found)

## 運作原理

1. Google Chat 發送 Webhook POST 請求至閘道器。每個請求皆包含 `Authorization: Bearer <token>` 標頭。
2. OpenClaw 會根據配置的 `audienceType` 與 `audience` 驗證 Token：
   - `audienceType: "app-url"` → 適用對象為您的 HTTPS Webhook URL。
   - `audienceType: "project-number"` → 適用對象為 Cloud 專案編號。
3. 訊息依據「空間 (Space)」進行路由：
   - 私訊使用會話金鑰 `agent:<agentId>:googlechat:dm:<spaceId>`。
   - 空間使用會話金鑰 `agent:<agentId>:googlechat:group:<spaceId>`。
4. 私訊存取預設為配對模式。未知的傳送者會收到配對碼；核准指令如下：
   - `openclaw pairing approve googlechat <配對碼>`
5. 群組空間預設需要 @-提及。若提及偵測需要使用應用程式的使用者名稱，請設定 `botUser`。

## 目標格式 (Targets)

在傳遞訊息與允許清單中使用這些識別碼：

- 直接訊息：`users/<userId>` 或 `users/<email>`（接受電子郵件地址）。
- 空間：`spaces/<spaceId>`。

## 組態重點

```json5
{
  channels: {
    googlechat: {
      enabled: true,
      serviceAccountFile: "/路徑/至/service-account.json",
      audienceType: "app-url",
      audience: "https://gateway.example.com/googlechat",
      webhookPath: "/googlechat",
      botUser: "users/1234567890", // 選填；輔助提及偵測
      dm: {
        policy: "pairing",
        allowFrom: ["users/1234567890", "name@example.com"],
      },
      groupPolicy: "allowlist",
      groups: {
        "spaces/AAAA": {
          allow: true,
          requireMention: true,
          users: ["users/1234567890"],
          systemPrompt: "僅限簡短回答。",
        },
      },
      actions: { reactions: true },
      typingIndicator: "message",
      mediaMaxMb: 20,
    },
  },
}
```

注意事項：

- 服務帳號憑證也可以透過 `serviceAccount` 以內聯方式（JSON 字串）傳遞。
- 若未設定 `webhookPath`，預設 Webhook 路徑為 `/googlechat`。
- 當啟用 `actions.reactions` 時，可透過 `reactions` 工具與 `channels action` 使用心情回應功能。
- `typingIndicator` (輸入指示器) 支援 `none` (無)、`message` (訊息，預設) 與 `reaction` (心情回應，後者需要使用者 OAuth)。
- 附件會透過 Chat API 下載並儲存於媒體管線中（大小受 `mediaMaxMb` 限制）。

## 故障排除

### 405 Method Not Allowed

若 Google Cloud Logs Explorer 顯示如下錯誤：

```
status code: 405, reason phrase: HTTP error response: HTTP/1.1 405 Method Not Allowed
```

代表 Webhook 處理常式未註冊。常見原因如下：

1. **頻道未配置**：您的組態中缺少 `channels.googlechat` 區段。請使用此指令驗證：

   ```bash
   openclaw config get channels.googlechat
   ```

   若傳回 "Config path not found"，請新增組態（參閱 [組態重點](#組態重點)）。

2. **外掛程式未啟用**：檢查外掛狀態：

   ```bash
   openclaw plugins list | grep googlechat
   ```

   若顯示 "disabled"，請在組態中加入 `plugins.entries.googlechat.enabled: true`。

3. **閘道器未重啟**：新增組態後，請重啟閘道器：

   ```bash
   openclaw gateway restart
   ```

驗證頻道是否正在執行：

```bash
openclaw channels status
# 應顯示：Google Chat default: enabled, configured, ...
```

### 其他問題

- 檢查 `openclaw channels status --probe` 以查看是否存在驗證錯誤或缺失 Audience 組態。
- 若無訊息抵達，請確認 Chat App 的 Webhook URL 與事件訂閱設定。
- 若提及門檻阻擋了回覆，請將 `botUser` 設定為 App 的使用者資源名稱並驗證 `requireMention` 設定。
- 在發送測試訊息時使用 `openclaw logs --follow` 以觀察請求是否抵達閘道器。

相關文件：

- [閘道器組態](/gateway/configuration_zh_TW)
- [安全性](/gateway/security_zh_TW)
- [心情回應](/tools/reactions_zh_TW)
