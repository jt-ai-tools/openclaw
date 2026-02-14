---
summary: "macOS App 透過 SSH 控制遠端 OpenClaw 閘道器的流程說明"
read_when:
  - 設定或偵錯遠端 Mac 控制功能時
title: "遠端控制"
---

> 此文件為 [English Version](/platforms/mac/remote_zh_TW) 的繁體中文版本。

# 遠端 OpenClaw (macOS ⇄ 遠端主機)

此流程讓 macOS App 充當執行於另一台主機（如桌機或伺服器）上的 OpenClaw 閘道器 (Gateway) 的完整遠端控制器。這項功能在 App 中稱為 **Remote over SSH**。所有功能 —— 包含健康檢查、語音喚醒轉發以及 Web Chat —— 都會重用在「設定」中配置的遠端連線資訊。

## 運作模式

- **本地 (Local)**：所有項目皆在筆電上執行，不涉及 SSH。
- **Remote over SSH (預設)**：透過 SSH 隧道轉發閘道器連接埠至 localhost。閘道器會看到節點 IP 為 `127.0.0.1`。
- **Remote direct (ws/wss)**：不使用 SSH 隧道，直接連線至閘道器 URL（例如透過 Tailscale Serve 或 HTTPS 反向代理）。

## 遠端主機事前準備

1. 安裝 Node + pnpm 並完成 OpenClaw CLI 的安裝。
2. 確保 `openclaw` 指令位於非互動式 Shell 的 `PATH` 中（建議建立符號連結至 `/usr/local/bin`）。
3. 啟用 SSH 並使用金鑰驗證。建議使用 **Tailscale** IP 以獲得穩定的跨網域連線。

## macOS App 設定

1. 開啟 **設定 → 一般 (General)**。
2. 在 **OpenClaw runs** 下選擇 **Remote over SSH** 並設定：
   - **Transport**：選擇 **SSH tunnel** 或 **Direct (ws/wss)**。
   - **SSH target**：輸入 `user@host`。若在同區域網路中，可直接從探索列表中挑選。
   - **Gateway URL** (僅限 Direct)：例如 `wss://gateway.example.ts.net`。
   - **Identity file**：您的私鑰路徑。
3. 點擊 **Test remote**。若回傳 `exit 127` 通常代表遠端找不到 CLI 指令。

## 疑難排解

- **exit 127 / 找不到指令**：`openclaw` 不在 PATH 中。請將其加入 `/etc/paths` 或建立符號連結。
- **健康檢查失敗**：檢查 SSH 是否可通，以及 Baileys 是否已登入。
- **節點 IP 顯示為 127.0.0.1**：這是使用 SSH 隧道的正常現象。若需顯示真實 IP，請切換至 **Direct (ws/wss)** 傳輸模式。
- **語音喚醒**：在遠端模式下，觸發詞會自動轉發，無需額外設定。
