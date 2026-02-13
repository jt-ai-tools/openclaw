---
summary: "OpenClaw 在線狀態 (Presence) 條目的產生、合併與顯示機制說明"
read_when:
  - 偵錯「實例 (Instances)」分頁時
  - 調查重複或過時的實例資料列時
  - 更改閘道器 WS 連線或系統事件訊標 (Beacons) 時
title: "在線狀態"
---

> 此文件為 [English Version](/concepts/presence) 的繁體中文版本。

# 在線狀態 (Presence)

OpenClaw 的「在線狀態」是一個輕量級、盡力而為 (best‑effort) 的檢視畫面，包含：

- **閘道器 (Gateway)** 本身，以及
- **已連線至閘道器的用戶端**（macOS App、WebChat、CLI 等）。

在線狀態主要用於渲染 macOS App 的 **實例 (Instances)** 分頁，並為操作員提供快速的可見度。

## 在線狀態欄位 (顯示內容)

在線狀態條目是具備下列欄位的結構化物件：

- `instanceId`（選填，但強烈建議）：穩定的用戶端身分（通常為 `connect.client.instanceId`）。
- `host`：易讀的主機名稱。
- `ip`：盡力偵測到的 IP 位址。
- `version`：用戶端版本字串。
- `deviceFamily` / `modelIdentifier`：硬體提示資訊。
- `mode`：`ui`, `webchat`, `cli`, `backend`, `probe`, `test`, `node`, ...
- `lastInputSeconds`：「距離上次使用者輸入的秒數」（若已知）。
- `reason`：產生原因，如 `self`, `connect`, `node-connected`, `periodic`, ...
- `ts`：最後更新時間戳記（Unix 時間戳記，單位：毫秒）。

## 產生來源 (在線狀態從何而來)

在線狀態條目由多個來源產生並進行 **合併 (Merged)**。

### 1) 閘道器自我條目 (Gateway self entry)

閘道器在啟動時一律會初始生成一個「自我 (self)」條目，以便在任何用戶端連線前，UI 介面就能顯示閘道器主機。

### 2) WebSocket 連線

每個 WS 用戶端皆從一個 `connect` 請求開始。交握成功後，閘道器會為該連線執行更新或插入 (upsert) 在線狀態條目。

#### 為何一次性的 CLI 指令不會顯示

CLI 經常連線以執行短暫、一次性的指令。為了避免實例列表過於雜亂，`client.mode === "cli"` 的連線 **不會** 被轉化為在線狀態條目。

### 3) `system-event` 訊標 (Beacons)

用戶端可以透過 `system-event` 方法發送包含更豐富資訊的定期訊標。macOS App 會利用此機制回報主機名稱、IP 以及 `lastInputSeconds`。

### 4) 節點連線 (role: node)

當節點以 `role: node` 透過閘道器 WebSocket 連線時，閘道器會為該節點執行更新或插入在線狀態條目（流程與其他 WS 用戶端相同）。

## 合併與重複刪除規則 (為何 `instanceId` 至關重要)

在線狀態條目儲存在單一的記憶體對照表 (Map) 中：

- 條目以 **在線狀態金鑰 (presence key)** 作為鍵值。
- 最佳金鑰是穩定的 `instanceId`（取自 `connect.client.instanceId`），它在重啟後仍能保持一致。
- 金鑰不區分大小寫。

若用戶端在重新連線時未提供穩定的 `instanceId`，系統可能會顯示為 **重複** 的資料列。

## TTL 與容量限制

在線狀態設計上是暫時性 (ephemeral) 的：

- **生存時間 (TTL)：** 超過 5 分鐘未更新的條目會被修剪。
- **最大條目數：** 200 個（達到上限時會優先捨棄最舊的項目）。

這能保持列表的新鮮度，並避免記憶體無限制增長。

## 遠端/隧道注意事項 (迴路 IP)

當用戶端透過 SSH 隧道或本地連接埠轉發連線時，閘道器看到的遠端位址可能是 `127.0.0.1`。為了避免覆寫由用戶端回報的正確 IP，系統會忽略來自 loopback 的遠端位址。

## 接收端

### macOS 實例 (Instances) 分頁

macOS App 會渲染 `system-presence` 的輸出，並根據最後更新的效期 (age) 標示小型的狀態指示燈（活動中 Active / 閒置 Idle / 過期 Stale）。

## 偵錯小提示

- 若要查看原始列表，請對閘道器調用 `system-presence`。
- 如果看見重複項：
  - 確認用戶端在交握時發送了穩定的 `client.instanceId`。
  - 確認定期訊標使用了相同的 `instanceId`。
  - 檢查基於連線衍生的條目是否缺失 `instanceId`（缺失時出現重複是預期行為）。
