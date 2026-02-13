---
summary: "用於尋找閘道器的節點發現機制與傳輸方式（Bonjour、Tailscale、SSH）"
read_when:
  - 實作或變動 Bonjour 發現/廣播邏輯時
  - 調整遠端連線模式（直接連線 vs SSH）時
  - 為遠端節點設計發現與配對流程時
title: "發現機制與傳輸方式"
---

> 此文件為 [English Version](/gateway/discovery) 的繁體中文版本。

# 發現機制與傳輸方式

OpenClaw 處理兩個表面看似雷同、實則相異的問題：

1. **操作員遠端控制**：macOS 選單列 App 操控執行於他處的閘道器。
2. **節點配對**：iOS/Android（及未來的節點裝置）尋找閘道器並安全地進行配對。

設計目標是將所有的網路發現/廣播功能保留在 **節點閘道器 (Node Gateway)** (`openclaw gateway`) 中，並讓用戶端（Mac App、iOS）作為接收者。

## 術語說明

- **閘道器 (Gateway)**：單一長期執行的程序，擁有系統狀態（對談、配對、節點註冊表）並執行通訊頻道。大多數設定為每個主機一個實例；支援隔離的多閘道器設定。
- **閘道器 WS (控制平面)**：預設位於 `127.0.0.1:18789` 的 WebSocket 端點；可透過 `gateway.bind` 綁定至 LAN/Tailnet。
- **直接 WS 傳輸**：對向 LAN/Tailnet 的閘道器 WS 端點（不經過 SSH）。
- **SSH 傳輸 (備援)**：透過 SSH 轉發 `127.0.0.1:18789` 進行遠端控制。
- **舊版 TCP 橋接 (已棄用/移除)**：舊式的節點傳輸方式（詳見 [橋接通訊協定](/gateway/bridge-protocol_zh_TW)）；不再用於發現廣播。

通訊協定細節：

- [閘道器通訊協定](/gateway/protocol_zh_TW)
- [橋接通訊協定 (舊版)](/gateway/bridge-protocol_zh_TW)

## 為何同時保留「直接連線」與 SSH

- **直接 WS** 在同一個網路或 Tailnet 內具備最佳的使用者體驗：
  - 透過 Bonjour 在區域網路上自動發現。
  - 配對 Token 與 ACL (存取控制列表) 由閘道器擁有。
  - 無需 Shell 存取權；通訊協定的暴露面可保持精簡且可審計。
- **SSH** 仍是通用的備援方案：
  - 只要有 SSH 存取權即可運作（即使跨越不相關的網路）。
  - 能避開多播 (Multicast)/mDNS 的問題。
  - 除 SSH 外無需額外開放傳入連接埠。

## 發現輸入 (用戶端如何得知閘道器位置)

### 1) Bonjour / mDNS (僅限區域網路)

Bonjour 是盡力而為的，無法跨越網路。它僅用於「同區域網路」的便利性。

目標方向：

- **閘道器** 透過 Bonjour 廣播其 WS 端點。
- 用戶端瀏覽並顯示「選擇閘道器」列表，隨後儲存所選端點。

故障排除與訊標細節請見：[Bonjour](/gateway/bonjour_zh_TW)。

#### 服務訊標 (Service beacon) 細節

- 服務類型：
  - `_openclaw-gw._tcp` (閘道器傳輸訊標)
- TXT 鍵值 (非機密)：
  - `role=gateway`
  - `lanHost=<主機名稱>.local`
  - `sshPort=22` (或實際廣播的埠號)
  - `gatewayPort=18789` (Gateway WS + HTTP)
  - `gatewayTls=1` (僅在啟用 TLS 時)
  - `gatewayTlsSha256=<sha256>` (僅在啟用 TLS 且指紋可用時)
  - `canvasPort=18793` (預設 Canvas 宿主埠號；提供 `/__openclaw__/canvas/` 服務)
  - `cliPath=<路徑>` (選填；可執行 `openclaw` 入口點或二進位檔的絕對路徑)
  - `tailnetDns=<magicdns>` (選填提示；偵測到 Tailscale 時自動產生)

停用/覆寫：

- `OPENCLAW_DISABLE_BONJOUR=1` 停用廣播。
- `~/.openclaw/openclaw.json` 中的 `gateway.bind` 控制閘道器綁定模式。
- `OPENCLAW_SSH_PORT` 覆寫 TXT 中廣播的 SSH 連接埠 (預設為 22)。
- `OPENCLAW_TAILNET_DNS` 發佈 `tailnetDns` 提示 (MagicDNS)。
- `OPENCLAW_CLI_PATH` 覆寫廣播的 CLI 路徑。

### 2) Tailnet (跨網路)

對於倫敦/維也納式（跨國）的設定，Bonjour 無法發揮作用。建議的「直接」目標為：

- Tailscale MagicDNS 名稱（偏好方式）或穩定的 Tailnet IP。

若閘道器偵測到正執行於 Tailscale 下，它會發佈 `tailnetDns` 作為用戶端（含廣域訊標）的選用提示。

### 3) 手動 / SSH 目標

當沒有直接路徑（或直接連線被停用）時，用戶端一律可以透過轉發迴路閘道器連接埠的方式，由 SSH 進行連線。

請參閱 [遠端存取](/gateway/remote_zh_TW)。

## 傳輸選擇 (用戶端原則)

建議的用戶端行為：

1. 若已設定且可連線至已配對的「直接端點」，則優先使用。
2. 否則，若 Bonjour 在區域網路上發現閘道器，提供「使用此閘道器」的一鍵選擇，並將其儲存為直接端點。
3. 否則，若有設定 Tailnet DNS/IP，嘗試直接連線。
4. 否則，回退 (Fallback) 至 SSH。

## 配對與驗證 (直接傳輸)

閘道器是節點/用戶端准入 (Admission) 的單一事實來源。

- 配對請求在閘道器中建立/核准/拒絕（參閱 [閘道器配對](/gateway/pairing_zh_TW)）。
- 閘道器強制執行：
  - 驗證 (Token / 密鑰對)
  - 範圍與 ACL (閘道器並非對所有方法的原始代理)
  - 頻率限制 (Rate limits)

## 各組件職責

- **閘道器**：發佈發現訊標、擁有配對決策權，並託管 WS 端點。
- **macOS App**：協助您挑選閘道器、顯示配對提示，且僅將 SSH 作為最後備援。
- **iOS/Android 節點**：搜尋 Bonjour 作為便利功能，並連線至已配對的閘道器 WS。
