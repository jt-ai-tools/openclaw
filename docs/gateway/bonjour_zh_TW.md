---
summary: "Bonjour/mDNS 發現機制與偵錯（閘道器訊標、用戶端與常見故障模式）"
read_when:
  - 偵錯 macOS/iOS 上的 Bonjour 發現問題時
  - 更改 mDNS 服務類型、TXT 紀錄或發現流程體驗時
title: "Bonjour 發現機制"
---

> 此文件為 [English Version](/gateway/bonjour) 的繁體中文版本。

# Bonjour / mDNS 發現機制

OpenClaw 使用 Bonjour (mDNS / DNS‑SD) 作為 **僅限區域網路 (LAN) 的便利功能**，用於自動搜尋活動中的閘道器 (WebSocket 端點)。這是一項盡力而為 (best‑effort) 的功能，**不能** 取代 SSH 或基於 Tailnet 的連線方式。

## 透過 Tailscale 進行廣域 Bonjour (單播 DNS‑SD)

若節點與閘道器位於不同網路，多播 (Multicast) mDNS 將無法跨越網路邊界。您可以透過 Tailscale 切換至 **單播 DNS‑SD (Unicast DNS‑SD)**（即「廣域 Bonjour」），以維持相同的自動發現體驗。

高階步驟：

1. 在閘道器主機上執行 DNS 伺服器（需可透過 Tailnet 存取）。
2. 在專用區域（例如 `openclaw.internal.`）下為 `_openclaw-gw._tcp` 發佈 DNS‑SD 紀錄。
3. 設定 Tailscale **分離式 DNS (Split DNS)**，使您選擇的網域能透過該 DNS 伺服器為用戶端（包括 iOS）進行解析。

OpenClaw 支援任何發現網域；`openclaw.internal.` 僅為範例。iOS/Android 節點會同時搜尋 `local.` 以及您設定的廣域網域。

### 閘道器組態 (建議設定)

```json5
{
  gateway: { bind: "tailnet" }, // 僅限 Tailnet (建議設定)
  discovery: { wideArea: { enabled: true } }, // 啟用廣域 DNS-SD 發佈
}
```

### 單次 DNS 伺服器設定 (閘道器主機)

```bash
openclaw dns setup --apply
```

此指令會安裝 CoreDNS 並將其設定為：

- 僅在閘道器的 Tailscale 介面上監聽連接埠 53。
- 從 `~/.openclaw/dns/<domain>.db` 提供您選擇的網域（例如 `openclaw.internal.`）服務。

從連線至 Tailnet 的機器進行驗證：

```bash
dns-sd -B _openclaw-gw._tcp openclaw.internal.
dig @<TAILNET_IPV4> -p 53 _openclaw-gw._tcp.openclaw.internal PTR +short
```

### Tailscale DNS 設定

在 Tailscale 管理後台：

- 新增一個指向閘道器 Tailnet IP 的名稱伺服器 (UDP/TCP 53)。
- 新增分離式 DNS (Split DNS)，使您的發現網域使用該名稱伺服器。

一旦用戶端接受了 Tailnet DNS，iOS 節點即可在您的發現網域中搜尋 `_openclaw-gw._tcp`，無需依賴多播。

### 閘道器監聽程式安全性 (建議設定)

閘道器 WS 連接埠（預設為 `18789`）預設綁定至 loopback。若需區域網路/Tailnet 存取，請明確指定綁定對象並保持驗證功能啟用。

針對僅限 Tailnet 的設定：

- 在 `~/.openclaw/openclaw.json` 中設定 `gateway.bind: "tailnet"`。
- 重啟閘道器（或重啟 macOS 選單列 App）。

## 哪些組件會發出廣播

僅有 **閘道器** 會廣播 `_openclaw-gw._tcp` 服務。

## 服務類型

- `_openclaw-gw._tcp` — 閘道器傳輸訊標 (Used by macOS/iOS/Android nodes)。

## TXT 鍵值 (非機密提示)

閘道器會廣播小型非機密提示，以方便 UI 流程：

- `role=gateway`
- `displayName=<易記名稱>`
- `lanHost=<主機名稱>.local`
- `gatewayPort=<連接埠>` (Gateway WS + HTTP)
- `gatewayTls=1` (僅在啟用 TLS 時)
- `gatewayTlsSha256=<sha256>` (僅在啟用 TLS 且指紋可用時)
- `canvasPort=<連接埠>` (僅在啟用 Canvas 宿主時；預設為 `18793`)
- `sshPort=<連接埠>` (未覆寫時預設為 22)
- `transport=gateway`
- `cliPath=<路徑>` (選填；可執行 `openclaw` 入口點的絕對路徑)
- `tailnetDns=<magicdns>` (選填；當 Tailnet 可用時的提示)

## 在 macOS 上偵錯

實用的內建工具：

- 瀏覽實例：

  ```bash
  dns-sd -B _openclaw-gw._tcp local.
  ```

- 解析特定實例（請替換 `<instance>`）：

  ```bash
  dns-sd -L "<instance>" _openclaw-gw._tcp local.
  ```

若瀏覽正常但解析失敗，通常是因為區域網路原則或 mDNS 解析器問題所致。

## 在閘道器日誌中偵錯

閘道器會寫入滾動式日誌檔案（啟動時會印出 `gateway log file: ...`）。請尋找包含 `bonjour:` 的行，特別是：

- `bonjour: advertise failed ...` (廣播失敗)
- `bonjour: ... name conflict resolved` / `hostname conflict resolved` (名稱衝突已解決)
- `bonjour: watchdog detected non-announced service ...` (看門狗偵測到未宣告的服務)

## 在 iOS 節點上偵錯

iOS 節點使用 `NWBrowser` 來發現 `_openclaw-gw._tcp`。

若要擷取日誌：

- Settings → Gateway → Advanced → **Discovery Debug Logs**
- Settings → Gateway → Advanced → **Discovery Logs** → 重現問題 → **Copy**

日誌內容包含瀏覽器狀態轉換與結果集變動。

## 常見故障模式

- **Bonjour 無法跨網路**：請改用 Tailnet 或 SSH。
- **多播 (Multicast) 被阻擋**：部分 Wi‑Fi 網路會停用 mDNS。
- **睡眠 / 介面變動 (Churn)**：macOS 可能會暫時遺失 mDNS 結果；請重試。
- **瀏覽正常但解析失敗**：請保持機器名稱簡潔（避免使用 Emoji 或標點符號），然後重啟閘道器。服務實例名稱衍生自主機名稱，過於複雜的名稱可能會干擾部分解析器。

## 轉義後的實例名稱 (`\032`)

Bonjour/DNS‑SD 經常將服務實例名稱中的字節轉義為十進位的 `\DDD` 序列（例如：空格變為 `\032`）。

- 在通訊協定層級這是正常的。
- UI 介面應在顯示前進行解碼（iOS 使用 `BonjourEscapes.decode`）。

## 停用與組態

- `OPENCLAW_DISABLE_BONJOUR=1` 可停用廣播。
- `~/.openclaw/openclaw.json` 中的 `gateway.bind` 控制閘道器綁定模式。
- `OPENCLAW_SSH_PORT` 覆寫 TXT 中廣播的 SSH 連接埠。
- `OPENCLAW_TAILNET_DNS` 在 TXT 中發佈 MagicDNS 提示。
- `OPENCLAW_CLI_PATH` 覆寫廣播的 CLI 路徑。

## 相關文件

- 發現原則與傳輸方式選擇：[發現機制](/gateway/discovery_zh_TW)
- 節點配對與核准：[閘道器配對](/gateway/pairing_zh_TW)
