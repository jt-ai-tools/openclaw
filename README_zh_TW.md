> 此文件為 [English Version](README_zh_TW.md) 的繁體中文版本。

# 🦞 OpenClaw — 個人 AI 助理

<p align="center">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text-dark.png">
        <img src="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text.png" alt="OpenClaw" width="500">
    </picture>
</p>

<p align="center">
  <strong>EXFOLIATE! EXFOLIATE!</strong>
</p>

<p align="center">
  <a href="https://github.com/openclaw/openclaw/actions/workflows/ci.yml?branch=main"><img src="https://img.shields.io/github/actions/workflow/status/openclaw/openclaw/ci.yml?branch=main&style=for-the-badge" alt="CI status"></a>
  <a href="https://github.com/openclaw/openclaw/releases"><img src="https://img.shields.io/github/v/release/openclaw/openclaw?include_prereleases&style=for-the-badge" alt="GitHub release"></a>
  <a href="https://discord.gg/clawd"><img src="https://img.shields.io/discord/1456350064065904867?label=Discord&logo=discord&logoColor=white&color=5865F2&style=for-the-badge" alt="Discord"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License"></a>
</p>

**OpenClaw** 是一款您可以執行在自己裝置上的 *個人 AI 助理*。
它會在您已使用的頻道上回覆您（WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage、Microsoft Teams、WebChat），此外還支援 BlueBubbles、Matrix、Zalo 和 Zalo Personal 等擴充頻道。它可以在 macOS/iOS/Android 上進行語音聽說，並能渲染由您控制的即時 Canvas。閘道器 (Gateway) 只是控制平面 —— 產品本身就是該助理。

如果您想要一個感覺像在本地端、快速且永遠在線的個人單使用者助理，這就是您的首選。

[官方網站](https://openclaw.ai) · [文件](docs/index_zh_TW.md) · [DeepWiki](https://deepwiki.com/openclaw/openclaw) · [新手入門](docs/start/getting-started_zh_TW.md) · [更新指南](docs/install/updating_zh_TW.md) · [成果展示](docs/start/showcase_zh_TW.md) · [常見問題](docs/start/faq_zh_TW.md) · [設定精靈](docs/start/wizard_zh_TW.md) · [Nix](https://github.com/openclaw/nix-openclaw) · [Docker](docs/install/docker_zh_TW.md) · [Discord](https://discord.gg/clawd)

建議設定：在您的終端機執行引導精靈 (`openclaw onboard`)。
精靈將引導您逐步設定閘道器、工作區 (Workspace)、頻道和技能 (Skills)。CLI 精靈是建議的路徑，且適用於 **macOS、Linux 和 Windows (強烈建議透過 WSL2 使用)**。
支援 npm、pnpm 或 bun。
全新安裝？請從這裡開始：[新手入門](docs/start/getting-started_zh_TW.md)

**訂閱項目 (OAuth)：**

- **[Anthropic](https://www.anthropic.com/)** (Claude Pro/Max)
- **[OpenAI](https://openai.com/)** (ChatGPT/Codex)

模型建議：雖然支援任何模型，但我強烈建議使用 **Anthropic Pro/Max (100/200) + Opus 4.6**，以獲得強大的長上下文能力和更好的指令注入抗性。請參閱 [引導設定](docs/start/onboarding_zh_TW.md)。

## 模型 (選擇 + 驗證)

- 模型組態 + CLI：[模型](docs/concepts/models_zh_TW.md)
- 驗證設定檔輪替 (OAuth vs API keys) + 備援：[模型容錯移轉](docs/concepts/model-failover_zh_TW.md)

## 安裝 (建議方式)

執行環境：**Node ≥22**。

```bash
npm install -g openclaw@latest
# 或使用：pnpm add -g openclaw@latest

openclaw onboard --install-daemon
```

精靈會安裝閘道器守護行程 (launchd/systemd 使用者服務)，使其保持執行狀態。

## 快速上手 (重點摘要)

執行環境：**Node ≥22**。

完整新手指南（驗證、配對、頻道）：[新手入門](docs/start/getting-started_zh_TW.md)

```bash
openclaw onboard --install-daemon

openclaw gateway --port 18789 --verbose

# 傳送訊息
openclaw message send --to +1234567890 --message "Hello from OpenClaw"

# 與助理對話（可選擇傳送回任何已連線的頻道：WhatsApp/Telegram/Slack/Discord/Google Chat/Signal/iMessage/BlueBubbles/Microsoft Teams/Matrix/Zalo/Zalo Personal/WebChat）
openclaw agent --message "Ship checklist" --thinking high
```

正在升級？請參閱 [更新指南](docs/install/updating_zh_TW.md)（並執行 `openclaw doctor`）。

## 開發頻道 (Development channels)

- **stable**: 標記發行版 (`vYYYY.M.D` 或 `vYYYY.M.D-<patch>`)，npm dist-tag 為 `latest`。
- **beta**: 預發行版標記 (`vYYYY.M.D-beta.N`)，npm dist-tag 為 `beta`（可能缺少 macOS 應用程式）。
- **dev**: `main` 分支的最新狀態，npm dist-tag 為 `dev`（發佈時）。

切換頻道 (git + npm)：`openclaw update --channel stable|beta|dev`。
詳細資訊：[開發頻道](docs/install/development-channels_zh_TW.md)。

## 從原始碼建置 (開發者)

從原始碼建置建議使用 `pnpm`。Bun 可用於直接執行 TypeScript（選用）。

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw

pnpm install
pnpm ui:build # 首次執行時會自動安裝 UI 依賴項目
pnpm build

pnpm openclaw onboard --install-daemon

# 開發迴圈 (TS 變更時自動重新載入)
pnpm gateway:watch
```

注意：`pnpm openclaw ...` 會直接執行 TypeScript（透過 `tsx`）。`pnpm build` 會產生 `dist/` 目錄，以便透過 Node 或封裝好的 `openclaw` 二進位檔執行。

## 安全性預設值 (私訊存取權)

OpenClaw 會連線到真實的通訊平台。請將接收到的私訊 (DM) 視為 **不可信的輸入**。

完整安全性指南：[安全性](docs/gateway/security_zh_TW.md)

Telegram/WhatsApp/Signal/iMessage/Microsoft Teams/Discord/Google Chat/Slack 的預設行為：

- **私訊配對** (`dmPolicy="pairing"` / `channels.discord.dm.policy="pairing"` / `channels.slack.dm.policy="pairing"`)：未知的傳送者會收到一個簡短的配對碼，助理不會處理他們的訊息。
- 透過此指令核准：`openclaw pairing approve <channel> <code>`（核准後，傳送者會被加入本地端的允許清單）。
- 公開私訊需要明確加入：設定 `dmPolicy="open"` 並在頻道允許清單中包含 `"*"` (`allowFrom` / `channels.discord.dm.allowFrom` / `channels.slack.dm.allowFrom`)。

執行 `openclaw doctor` 以檢查具風險或組態錯誤的私訊策略。

## 功能亮點

- **[本地優先的閘道器](docs/gateway/index_zh_TW.md)** — 用於對談、頻道、工具與事件的單一控制平面。
- **[多頻道收件匣](docs/channels/index_zh_TW.md)** — WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, BlueBubbles (iMessage), iMessage (舊版), Microsoft Teams, Matrix, Zalo, Zalo Personal, WebChat, macOS, iOS/Android。
- **[多代理人路由](docs/gateway/configuration_zh_TW.md)** — 將接收到的頻道/帳號/同儕路由到隔離的代理人（工作區 + 每個代理人的對談會話）。
- **[語音喚醒 (Voice Wake)](docs/nodes/voicewake_zh_TW.md) + [交談模式 (Talk Mode)](docs/nodes/talk_zh_TW.md)** — 透過 ElevenLabs 為 macOS/iOS/Android 提供永遠在線的語音功能。
- **[即時 Canvas](docs/platforms/mac/canvas_zh_TW.md)** — 由代理人驅動的可視化工作空間，配備 [A2UI](docs/platforms/mac/canvas_zh_TW.md#canvas-a2ui)。
- **[一流的工具](docs/tools/index_zh_TW.md)** — 瀏覽器、Canvas、節點、排程任務 (Cron)、對談會話，以及 Discord/Slack 動作。
- **[配套應用程式](docs/platforms/macos_zh_TW.md)** — macOS 選單列應用程式 + iOS/Android [節點 (nodes)](docs/nodes/index_zh_TW.md)。
- **[引導設定](docs/start/wizard_zh_TW.md) + [技能](docs/tools/skills_zh_TW.md)** — 由精靈驅動的設定，包含內建/託管/工作區技能。

## 專案目錄索引

為了方便導覽，每個子目錄現在都包含一個繁體中文的 `README.md` 索引文件：

- [文件 (Docs)](docs/README.md) — 完整的產品文件。
- [擴充功能 (Extensions)](extensions/README.md) — 支援各種頻道的插件。
- [原始碼 (Source)](src/README.md) — 核心邏輯與閘道器實作。
- [套件 (Packages)](packages/README.md) — 內部使用的套件。
- [腳本 (Scripts)](scripts/README.md) — 開發與部署工具。
- [應用程式 (Apps)](apps/README.md) — macOS, iOS, Android 應用程式。
- [使用者介面 (UI)](ui/README.md) — 網頁儀表板原始碼。
- [測試 (Test)](test/README.md) — 測試套件與模擬資料。
- [資產 (Assets)](assets/README.md) — 靜態資源與圖示。

## 星星歷史 (Star History)

[![Star History Chart](https://api.star-history.com/svg?repos=openclaw/openclaw&type=date&legend=top-left)](https://www.star-history.com/#openclaw/openclaw&type=date&legend=top-left)

## 目前為止的所有建置成果

### 核心平台

- [閘道器 WS 控制平面](docs/gateway/index_zh_TW.md)：包含對談、在線狀態、組態、排程任務、Webhook、[控制 UI (Control UI)](docs/web/control-ui_zh_TW.md) 和 [Canvas 宿主](docs/platforms/mac/canvas_zh_TW.md#canvas-a2ui)。
- [CLI 介面](docs/tools/agent-send_zh_TW.md)：gateway, agent, send, [引導精靈 (wizard)](docs/start/wizard_zh_TW.md) 和 [doctor](docs/gateway/doctor_zh_TW.md)。
- [Pi 代理人執行環境](docs/concepts/agent_zh_TW.md)：採用 RPC 模式，支援工具串流與區塊串流。
- [對談模型 (Session model)](docs/concepts/sessions_zh_TW.md)：`main` 用於直接對話、群組隔離、啟用模式、佇列模式、回覆。群組規則請見：[群組](docs/concepts/groups_zh_TW.md)。
- [媒體管線](docs/nodes/images_zh_TW.md)：影像/音訊/影片、逐字稿鉤子 (transcription hooks)、大小限制、暫存檔生命週期。音訊細節：[音訊](docs/nodes/audio_zh_TW.md)。

### 頻道 (Channels)

- [頻道](docs/channels/index_zh_TW.md)：[WhatsApp](docs/channels/whatsapp_zh_TW.md) (Baileys), [Telegram](docs/channels/telegram_zh_TW.md) (grammY), [Slack](docs/channels/slack_zh_TW.md) (Bolt), [Discord](docs/channels/discord_zh_TW.md) (discord.js), [Google Chat](docs/channels/googlechat_zh_TW.md) (Chat API), [Signal](docs/channels/signal_zh_TW.md) (signal-cli), [BlueBubbles](docs/channels/bluebubbles_zh_TW.md) (iMessage, 建議方式), [iMessage](docs/channels/imessage_zh_TW.md) (舊版 imsg), [Microsoft Teams](docs/channels/msteams_zh_TW.md) (擴充功能), [Matrix](docs/channels/matrix_zh_TW.md) (擴充功能), [Zalo](docs/channels/zalo_zh_TW.md) (擴充功能), [Zalo Personal](docs/channels/zalouser_zh_TW.md) (擴充功能), [WebChat](docs/web/webchat_zh_TW.md)。
- [群組路由](docs/concepts/group-messages_zh_TW.md)：提及門檻、回覆標籤、各頻道分塊與路由。頻道規則請見：[頻道](docs/channels/index_zh_TW.md)。

### 應用程式 + 節點 (Nodes)

- [macOS 應用程式](docs/platforms/macos_zh_TW.md)：選單列控制平面、[語音喚醒](docs/nodes/voicewake_zh_TW.md)/PTT、[交談模式](docs/nodes/talk_zh_TW.md)重疊視窗、[WebChat](docs/web/webchat_zh_TW.md)、偵錯工具、[遠端閘道器](docs/gateway/remote_zh_TW.md)控制。
- [iOS 節點](docs/platforms/ios_zh_TW.md)：[Canvas](docs/platforms/mac/canvas_zh_TW.md)、[語音喚醒](docs/nodes/voicewake_zh_TW.md)、[交談模式](docs/nodes/talk_zh_TW.md)、相機、螢幕錄影、Bonjour 配對。
- [Android 節點](docs/platforms/android_zh_TW.md)：[Canvas](docs/platforms/mac/canvas_zh_TW.md)、[交談模式](docs/nodes/talk_zh_TW.md)、相機、螢幕錄影、選用 SMS。
- [macOS 節點模式](docs/nodes/index_zh_TW.md)：system.run/notify + canvas/camera 曝光。

### 工具 + 自動化

- [瀏覽器控制](docs/tools/browser_zh_TW.md)：專用的 openclaw Chrome/Chromium、快照、動作、上傳、設定檔。
- [Canvas](docs/platforms/mac/canvas_zh_TW.md)：[A2UI](docs/platforms/mac/canvas_zh_TW.md#canvas-a2ui) 推送/重設、eval、快照。
- [節點 (Nodes)](docs/nodes/index_zh_TW.md)：相機抓取/剪輯、螢幕錄製、[location.get](docs/nodes/location-command_zh_TW.md)、通知。
- [排程任務 (Cron) + 喚醒](docs/automation/cron-jobs_zh_TW.md)；[Webhook](docs/automation/webhook_zh_TW.md)；[Gmail Pub/Sub](docs/automation/gmail-pubsub_zh_TW.md)。
- [技能平台](docs/tools/skills_zh_TW.md)：內建、託管和工作區技能，包含安裝門檻與 UI。

### 執行環境 + 安全性

- [頻道路由](docs/concepts/channel-routing_zh_TW.md)、[重試策略](docs/concepts/retry_zh_TW.md)以及[串流/分塊](docs/concepts/streaming_zh_TW.md)。
- [在線狀態](docs/concepts/presence_zh_TW.md)、[輸入指示器](docs/concepts/typing-indicators_zh_TW.md)和[用量追蹤](docs/concepts/usage-tracking_zh_TW.md)。
- [模型](docs/concepts/models_zh_TW.md)、[模型容錯移轉](docs/concepts/model-failover_zh_TW.md)和[會話修剪 (session pruning)](docs/concepts/session-pruning_zh_TW.md)。
- [安全性](docs/gateway/security_zh_TW.md)與[故障排除](docs/channels/troubleshooting_zh_TW.md)。

### 維運 + 封裝

- [控制 UI](docs/web/control-ui_zh_TW.md) + [WebChat](docs/web/webchat_zh_TW.md) 直接由閘道器提供服務。
- [Tailscale Serve/Funnel](docs/gateway/tailscale_zh_TW.md) 或 [SSH 隧道](docs/gateway/remote_zh_TW.md)，支援憑證/密碼驗證。
- [Nix 模式](docs/install/nix_zh_TW.md) 用於宣告式組態；基於 [Docker](docs/install/docker_zh_TW.md) 的安裝。
- [Doctor](docs/gateway/doctor_zh_TW.md) 遷移功能、[記錄 (logging)](docs/logging_zh_TW.md)。

## 運作原理 (簡述)

```
WhatsApp / Telegram / Slack / Discord / Google Chat / Signal / iMessage / BlueBubbles / Microsoft Teams / Matrix / Zalo / Zalo Personal / WebChat
               │
               ▼
┌───────────────────────────────┐
│            閘道器             │
│          (控制平面)           │
│     ws://127.0.0.1:18789      │
└──────────────┬────────────────┘
               │
               ├─ Pi 代理人 (RPC)
               ├─ CLI (openclaw …)
               ├─ WebChat UI
               ├─ macOS 應用程式
               └─ iOS / Android 節點
```

## 關鍵子系統

- **[閘道器 WebSocket 網路](docs/concepts/architecture_zh_TW.md)** — 用於用戶端、工具和事件的單一 WS 控制平面（另請參閱維運：[閘道器運作手冊](docs/gateway/index_zh_TW.md)）。
- **[Tailscale 曝光](docs/gateway/tailscale_zh_TW.md)** — 為閘道器儀表板 + WS 提供 Serve/Funnel 功能（遠端存取：[遠端](docs/gateway/remote_zh_TW.md)）。
- **[瀏覽器控制](docs/tools/browser_zh_TW.md)** — 由 openclaw 管理且支援 CDP 控制的 Chrome/Chromium。
- **[Canvas + A2UI](docs/platforms/mac/canvas_zh_TW.md)** — 代理人驅動的可視化工作區 (A2UI 宿主：[Canvas/A2UI](docs/platforms/mac/canvas_zh_TW.md#canvas-a2ui))。
- **[語音喚醒](docs/nodes/voicewake_zh_TW.md) + [交談模式](docs/nodes/talk_zh_TW.md)** — 永遠在線的語音與連續對話功能。
- **[節點 (Nodes)](docs/nodes/index_zh_TW.md)** — Canvas、相機抓取/剪輯、螢幕錄製、`location.get`、通知，以及僅限 macOS 的 `system.run`/`system.notify`。

## Tailscale 存取 (閘道器儀表板)

OpenClaw 可以自動設定 Tailscale **Serve**（僅限 tailnet）或 **Funnel**（公開），同時保持閘道器綁定到 loopback。請設定 `gateway.tailscale.mode`：

- `off`: 無 Tailscale 自動化（預設）。
- `serve`: 透過 `tailscale serve` 提供的僅限 tailnet 的 HTTPS（預設使用 Tailscale 識別標頭）。
- `funnel`: 透過 `tailscale funnel` 提供的公開 HTTPS（需要共用密碼驗證）。

注意事項：

- 當啟用 Serve/Funnel 時，`gateway.bind` 必須保持為 `loopback`（OpenClaw 會強制執行此項）。
- 可以透過設定 `gateway.auth.mode: "password"` 或 `gateway.auth.allowTailscale: false` 來強制 Serve 使用密碼。
- 除非設定了 `gateway.auth.mode: "password"`，否則 Funnel 拒絕啟動。
- 選填：`gateway.tailscale.resetOnExit` 以在關閉時還原 Serve/Funnel 設定。

詳細資訊：[Tailscale 指南](docs/gateway/tailscale_zh_TW.md) · [網頁介面](docs/web/index_zh_TW.md)

## 遠端閘道器 (Linux 非常適合)

將閘道器執行在小型 Linux 實例上是非常理想的。用戶端（macOS 應用程式、CLI、WebChat）可以透過 **Tailscale Serve/Funnel** 或 **SSH 隧道** 進行連線，您仍然可以配對裝置節點（macOS/iOS/Android），以便在需要時執行裝置端動作。

- **閘道器宿主 (Gateway host)** 預設執行執行工具 (exec tool) 和頻道連線。
- **裝置節點 (Device nodes)** 透過 `node.invoke` 執行裝置端動作 (`system.run`, 相機, 螢幕錄影, 通知)。
  簡而言之：執行功能 (exec) 在閘道器所在地執行；裝置動作在裝置所在地執行。

詳細資訊：[遠端存取](docs/gateway/remote_zh_TW.md) · [節點](docs/nodes/index_zh_TW.md) · [安全性](docs/gateway/security_zh_TW.md)

## 透過閘道器通訊協定的 macOS 權限

macOS 應用程式可以執行在 **節點模式 (node mode)**，並透過閘道器 WebSocket 宣告其能力與權限圖 (`node.list` / `node.describe`)。用戶端接著可以透過 `node.invoke` 執行本地動作：

- `system.run` 執行本地指令並傳回 stdout/stderr/結束代碼；設定 `needsScreenRecording: true` 以要求螢幕錄製權限（否則您會收到 `PERMISSION_MISSING`）。
- `system.notify` 發佈使用者通知，如果通知權限被拒絕則會失敗。
- `canvas.*`、`camera.*`、`screen.record` 和 `location.get` 也會透過 `node.invoke` 進行路由，並遵循 TCC 權限狀態。

提升的 Bash（宿主權限）與 macOS TCC 是分開的：

- 使用 `/elevated on|off` 來為每個對談切換提升的存取權限（需先啟用並加入允許清單）。
- 閘道器會透過 `sessions.patch`（WS 方法）連同 `thinkingLevel`、`verboseLevel`、`model`、`sendPolicy` 和 `groupActivation` 一併持久化每個對談的切換狀態。

詳細資訊：[節點](docs/nodes/index_zh_TW.md) · [macOS 應用程式](docs/platforms/macos_zh_TW.md) · [閘道器通訊協定](docs/concepts/architecture_zh_TW.md)

## 代理人對代理人 (sessions\_\* 工具)

- 使用這些工具來協調整個會話之間的工作，而無需在對談介面之間跳轉。
- `sessions_list` — 發現活動中的對談會話（代理人）及其元數據。
- `sessions_history` — 獲取會話的轉錄記錄。
- `sessions_send` — 傳送訊息給另一個會話；選用的回覆 ping-pong + 宣告步驟 (`REPLY_SKIP`, `ANNOUNCE_SKIP`)。

詳細資訊：[對談工具](docs/concepts/session-tool_zh_TW.md)

## 技能註冊表 (ClawHub)

ClawHub 是一個極簡的技能註冊表。啟用 ClawHub 後，助理可以自動搜尋技能並根據需要引入新技能。

[ClawHub](https://clawhub.com)

## 聊天指令

在 WhatsApp/Telegram/Slack/Google Chat/Microsoft Teams/WebChat 中傳送這些指令（群組指令僅限擁有者使用）：

- `/status` — 簡要的會話狀態（模型 + Token，可用時顯示成本）
- `/new` 或 `/reset` — 重設會話
- `/compact` — 壓縮會話上下文（摘要）
- `/think <level>` — off|minimal|low|medium|high|xhigh（僅限 GPT-5.2 + Codex 模型）
- `/verbose on|off`
- `/usage off|tokens|full` — 每條回覆下方的用量資訊
- `/restart` — 重新啟動閘道器（群組中僅限擁有者）
- `/activation mention|always` — 群組啟用切換（僅限群組）

## 應用程式 (選用)

單獨使用閘道器即可獲得優異的體驗。所有應用程式都是選用的，並提供額外功能。

如果您計劃建置/執行配套應用程式，請遵循下方的平台執行手冊。

### macOS (OpenClaw.app) (選用)

- 用於閘道器與健康狀態的選單列控制。
- 語音喚醒 + 一鍵發話 (push-to-talk) 重疊視窗。
- WebChat + 偵錯工具。
- 透過 SSH 控制遠端閘道器。

注意：需要經過簽署的建置版本，macOS 權限才能在重新建置後持續生效（請參閱 `docs/platforms/mac/permissions_zh_TW.md`）。

### iOS 節點 (選用)

- 透過 Bridge 配對為節點。
- 語音觸發轉發 + Canvas 介面。
- 透過 `openclaw nodes …` 控制。

執行手冊：[iOS 連線](docs/platforms/ios_zh_TW.md)。

### Android 節點 (選用)

- 透過與 iOS 相同的 Bridge + 配對流程進行配對。
- 公開 Canvas、相機與螢幕擷取指令。
- 執行手冊：[Android 連線](docs/platforms/android_zh_TW.md)。

## 代理人工作區 + 技能

- 工作區根目錄：`~/.openclaw/workspace`（可透過 `agents.defaults.workspace` 設定）。
- 注入的提示詞文件：`AGENTS.md`、`SOUL.md`、`TOOLS.md`。
- 技能目錄：`~/.openclaw/workspace/skills/<skill>/SKILL.md`。

## 組態設定

最簡 `~/.openclaw/openclaw.json`（模型 + 預設值）：

```json5
{
  agent: {
    model: "anthropic/claude-opus-4-6",
  },
}
```

[完整組態參考（所有鍵名 + 範例）。](docs/gateway/configuration_zh_TW.md)

## 安全模型 (重要)

- **預設：** 工具在 **main** 會話的宿主上執行，因此當只有您自己使用時，助理具有完整存取權限。
- **群組/頻道安全性：** 設定 `agents.defaults.sandbox.mode: "non-main"` 以在每個會話的 Docker 沙箱內執行 **非 main 會話**（群組/頻道）；此時 Bash 會在 Docker 中執行。
- **沙箱預設值：** 允許清單包含 `bash`, `process`, `read`, `write`, `edit`, `sessions_list`, `sessions_history`, `sessions_send`, `sessions_spawn`；拒絕清單包含 `browser`, `canvas`, `nodes`, `cron`, `discord`, `gateway`。

詳細資訊：[安全性指南](docs/gateway/security_zh_TW.md) · [Docker + 沙箱](docs/install/docker_zh_TW.md) · [沙箱組態](docs/gateway/configuration_zh_TW.md)

### [WhatsApp](docs/channels/whatsapp_zh_TW.md)

- 連結裝置：`pnpm openclaw channels login`（憑證儲存於 `~/.openclaw/credentials`）。
- 透過 `channels.whatsapp.allowFrom` 設定誰可以與助理對話。
- 如果設定了 `channels.whatsapp.groups`，它將成為群組允許清單；加入 `"*"` 以允許所有群組。

### [Telegram](docs/channels/telegram_zh_TW.md)

- 設定 `TELEGRAM_BOT_TOKEN` 或 `channels.telegram.botToken`（環境變數優先）。
- 選填：設定 `channels.telegram.groups`（配合 `channels.telegram.groups."*".requireMention`）；設定後即為群組允許清單（加入 `"*"` 以允許所有）。視需要設定 `channels.telegram.allowFrom` 或 `channels.telegram.webhookUrl` + `channels.telegram.webhookSecret`。

```json5
{
  channels: {
    telegram: {
      botToken: "123456:ABCDEF",
    },
  },
}
```

### [Slack](docs/channels/slack_zh_TW.md)

- 設定 `SLACK_BOT_TOKEN` + `SLACK_APP_TOKEN`（或 `channels.slack.botToken` + `channels.slack.appToken`）。

### [Discord](docs/channels/discord_zh_TW.md)

- 設定 `DISCORD_BOT_TOKEN` 或 `channels.discord.token`（環境變數優先）。
- 選填：視需要設定 `commands.native`、`commands.text` 或 `commands.useAccessGroups`，以及 `channels.discord.dm.allowFrom`、`channels.discord.guilds` 或 `channels.discord.mediaMaxMb`。

```json5
{
  channels: {
    discord: {
      token: "1234abcd",
    },
  },
}
```

### [Signal](docs/channels/signal_zh_TW.md)

- 需要 `signal-cli` 並在組態中加入 `channels.signal` 區段。

### [BlueBubbles (iMessage)](docs/channels/bluebubbles_zh_TW.md)

- **建議使用** 的 iMessage 整合方式。
- 設定 `channels.bluebubbles.serverUrl` + `channels.bluebubbles.password` 以及 Webhook (`channels.bluebubbles.webhookPath`)。
- BlueBubbles 伺服器執行於 macOS；閘道器可執行於 macOS 或其他地方。

### [iMessage (舊版)](docs/channels/imessage_zh_TW.md)

- 透過 `imsg` 提供僅限 macOS 的舊版整合（訊息應用程式必須已登入）。
- 如果設定了 `channels.imessage.groups`，它將成為群組允許清單；加入 `"*"` 以允許所有群組。

### [Microsoft Teams](docs/channels/msteams_zh_TW.md)

- 設定 Teams 應用程式 + Bot Framework，然後加入 `msteams` 組態區段。
- 透過 `msteams.allowFrom` 設定誰可以對話；透過 `msteams.groupAllowFrom` 或 `msteams.groupPolicy: "open"` 設定群組存取權。

### [WebChat](docs/web/webchat_zh_TW.md)

- 使用閘道器 WebSocket；無需額外的 WebChat 連接埠/組態。

瀏覽器控制（選用）：

```json5
{
  browser: {
    enabled: true,
    color: "#FF4500",
  },
}
```

## 文件 (Docs)

當您完成引導設定並希望深入瞭解參考資訊時，請使用這些文件。

- [從文件索引開始，了解導覽與內容分布。](docs/index_zh_TW.md)
- [閱讀架構概觀，瞭解閘道器 + 通訊協定模型。](docs/concepts/architecture_zh_TW.md)
- [當需要所有鍵名與範例時，請使用完整組態參考。](docs/gateway/configuration_zh_TW.md)
- [根據維運執行手冊規範執行閘道器。](docs/gateway/index_zh_TW.md)
- [瞭解控制 UI/網頁介面如何運作，以及如何安全地對外曝光。](docs/web/index_zh_TW.md)
- [瞭解如何透過 SSH 隧道或 tailnets 進行遠端存取。](docs/gateway/remote_zh_TW.md)
- [遵循引導精靈流程進行引導式設定。](docs/start/wizard_zh_TW.md)
- [透過 Webhook 介面連接外部觸發器。](docs/automation/webhook_zh_TW.md)
- [設定 Gmail Pub/Sub 觸發器。](docs/automation/gmail-pubsub_zh_TW.md)
- [瞭解 macOS 選單列配套應用程式的細節。](docs/platforms/mac/menu-bar_zh_TW.md)
- [平台指南：Windows (WSL2)](docs/platforms/windows_zh_TW.md), [Linux](docs/platforms/linux_zh_TW.md), [macOS](docs/platforms/macos_zh_TW.md), [iOS](docs/platforms/ios_zh_TW.md), [Android](docs/platforms/android_zh_TW.md)
- [使用故障排除指南偵錯常見錯誤。](docs/channels/troubleshooting_zh_TW.md)
- [在對外曝光任何內容前，請先檢閱安全性建議。](docs/gateway/security_zh_TW.md)

## 進階文件 (發現與控制)

- [發現與傳輸方式](docs/gateway/discovery_zh_TW.md)
- [Bonjour/mDNS](docs/gateway/bonjour_zh_TW.md)
- [閘道器配對](docs/gateway/pairing_zh_TW.md)
- [遠端閘道器 README](docs/gateway/remote-gateway-readme_zh_TW.md)
- [控制 UI](docs/web/control-ui_zh_TW.md)
- [儀表板 (Dashboard)](docs/web/dashboard_zh_TW.md)

## 維運與故障排除

- [健康檢查](docs/gateway/health_zh_TW.md)
- [閘道器鎖定 (Gateway lock)](docs/gateway/gateway-lock_zh_TW.md)
- [後台程序 (Background process)](docs/gateway/background-process_zh_TW.md)
- [瀏覽器故障排除 (Linux)](docs/tools/browser-linux-troubleshooting_zh_TW.md)
- [記錄 (Logging)](docs/logging_zh_TW.md)

## 深入探討

- [代理人迴圈 (Agent loop)](docs/concepts/agent-loop_zh_TW.md)
- [在線狀態 (Presence)](docs/concepts/presence_zh_TW.md)
- [TypeBox 架構 (Schemas)](docs/concepts/typebox_zh_TW.md)
- [RPC 轉接器](docs/reference/rpc_zh_TW.md)
- [佇列 (Queue)](docs/concepts/queue_zh_TW.md)

## 工作區與技能

- [技能組態](docs/tools/skills-config_zh_TW.md)
- [預設 AGENTS](docs/reference/AGENTS.default_zh_TW.md)
- [範本：AGENTS](docs/reference/templates/AGENTS_zh_TW.md)
- [範本：BOOTSTRAP](docs/reference/templates/BOOTSTRAP_zh_TW.md)
- [範本：IDENTITY](docs/reference/templates/IDENTITY.dev_zh_TW.md)
- [範本：SOUL](docs/reference/templates/SOUL_zh_TW.md)
- [範本：TOOLS](docs/reference/templates/TOOLS_zh_TW.md)
- [範本：USER](docs/reference/templates/USER.dev_zh_TW.md)

## 平台內部機制

- [macOS 開發設定](docs/platforms/mac/dev-setup_zh_TW.md)
- [macOS 選單列](docs/platforms/mac/menu-bar_zh_TW.md)
- [macOS 語音喚醒](docs/platforms/mac/voicewake_zh_TW.md)
- [iOS 節點](docs/platforms/ios_zh_TW.md)
- [Android 節點](docs/platforms/android_zh_TW.md)
- [Windows (WSL2)](docs/platforms/windows_zh_TW.md)
- [Linux 應用程式](docs/platforms/linux_zh_TW.md)

## 電子郵件鉤子 (Gmail)

- [docs.openclaw.ai/gmail-pubsub](docs/automation/gmail-pubsub_zh_TW.md)

## Molty

OpenClaw 是為了 **Molty** 所建置的，Molty 是一隻太空龍蝦 AI 助理。 🦞
由 Peter Steinberger 與社群共同開發。

- [openclaw.ai](https://openclaw.ai)
- [soul.md](https://soul.md)
- [steipete.me](https://steipete.me)
- [@openclaw](https://x.com/openclaw)

## 社群

請參閱 [CONTRIBUTING_zh_TW.md](CONTRIBUTING_zh_TW.md) 以瞭解參與準則、維護者資訊以及如何提交 PR。
歡迎 AI/氛圍編碼 (vibe-coded) 的 PR！ 🤖

特別感謝 [Mario Zechner](https://mariozechner.at/) 的支持以及
[pi-mono](https://github.com/badlogic/pi-mono)。
特別感謝 Adam Doppelt 開發了 lobster.bot。

感謝所有 clawtributors（參與貢獻者）：

<p align="left">
  <!-- (貢獻者頭像部分保留原文格式) -->
  <a href="https://github.com/steipete"><img src="https://avatars.githubusercontent.com/u/58493?v=4&s=48" width="48" height="48" alt="steipete" title="steipete"/></a> <a href="https://github.com/joshp123"><img src="https://avatars.githubusercontent.com/u/1497361?v=4&s=48" width="48" height="48" alt="joshp123" title="joshp123"/></a> <a href="https://github.com/cpojer"><img src="https://avatars.githubusercontent.com/u/13352?v=4&s=48" width="48" height="48" alt="cpojer" title="cpojer"/></a> <a href="https://github.com/mbelinky"><img src="https://avatars.githubusercontent.com/u/132747814?v=4&s=48" width="48" height="48" alt="Mariano Belinky" title="Mariano Belinky"/></a> <a href="https://github.com/sebslight"><img src="https://avatars.githubusercontent.com/u/19554889?v=4&s=48" width="48" height="48" alt="sebslight" title="sebslight"/></a> <a href="https://github.com/Takhoffman"><img src="https://avatars.githubusercontent.com/u/781889?v=4&s=48" width="48" height="48" alt="Takhoffman" title="Takhoffman"/></a> <a href="https://github.com/quotentiroler"><img src="https://avatars.githubusercontent.com/u/40643627?v=4&s=48" width="48" height="48" alt="quotentiroler" title="quotentiroler"/></a> <a href="https://github.com/bohdanpodvirnyi"><img src="https://avatars.githubusercontent.com/u/31819391?v=4&s=48" width="48" height="48" alt="bohdanpodvirnyi" title="bohdanpodvirnyi"/></a> <a href="https://github.com/tyler6204"><img src="https://avatars.githubusercontent.com/u/64381258?v=4&s=48" width="48" height="48" alt="tyler6204" title="tyler6204"/></a> <a href="https://github.com/iHildy"><img src="https://avatars.githubusercontent.com/u/25069719?v=4&s=48" width="48" height="48" alt="iHildy" title="iHildy"/></a>
  <!-- ... 其餘頭像保留 ... -->
</p>
