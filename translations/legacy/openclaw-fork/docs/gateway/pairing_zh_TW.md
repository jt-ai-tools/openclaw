---
summary: "iOS 與其他遠端節點的閘道器擁有配對功能（選項 B）"
read_when:
  - 在沒有 macOS UI 的情況下實作節點配對核准時
  - 新增用於核准遠端節點的 CLI 流程時
  - 擴充帶有節點管理功能的閘道器通訊協定時
title: "閘道器擁有的配對"
---

> 此文件為 [English Version](/gateway/pairing_zh_TW) 的繁體中文版本。

# 閘道器擁有的配對 (選項 B)

在「閘道器擁有的配對 (Gateway-owned pairing)」模式下，**閘道器** 是決定哪些節點 (Nodes) 允許加入的單一事實來源。使用者介面（macOS App 或未來的用戶端）僅作為核准或拒絕待處理請求的前端。

**重要提示：** WS 節點在 `connect` 期間使用 **裝置配對 (device pairing)**（角色為 `node`）。`node.pair.*` 是一個獨立的配對存儲區，並且 **不會** 門控 WS 的交握 (Handshake) 過程。僅有明確調用 `node.pair.*` 的用戶端會使用此流程。

## 概念

- **待處理請求 (Pending request)**：節點要求加入；需要核准。
- **已配對節點 (Paired node)**：已核准並獲發驗證 Token 的節點。
- **傳輸 (Transport)**：閘道器 WS 端點僅負責轉發請求，但不決定成員資格 (Membership)。（舊版的 TCP 橋接支援已被棄用/移除。）

## 配對運作原理

1. 節點連線至閘道器 WS 並請求配對。
2. 閘道器儲存一個 **待處理請求** 並發出 `node.pair.requested` 事件。
3. 您可以透過 CLI 或 UI 核准或拒絕該請求。
4. 核准後，閘道器會發放一個 **新的 Token**（重新配對時 Token 會輪替）。
5. 節點使用該 Token 重新連線，現在狀態為「已配對」。

待處理請求會在 **5 分鐘** 後自動過期。

## CLI 工作流 (適用於無頭模式)

```bash
openclaw nodes pending
openclaw nodes approve <requestId>
openclaw nodes reject <requestId>
openclaw nodes status
openclaw nodes rename --node <id|name|ip> --name "客廳 iPad"
```

`nodes status` 會顯示已配對/已連線的節點及其能力。

## API 介面 (閘道器通訊協定)

事件：

- `node.pair.requested` — 建立新的待處理請求時發出。
- `node.pair.resolved` — 請求被核准/拒絕/過期時發出。

方法：

- `node.pair.request` — 建立或重用待處理請求。
- `node.pair.list` — 列出待處理與已配對的節點。
- `node.pair.approve` — 核准待處理請求（發放 Token）。
- `node.pair.reject` — 拒絕待處理請求。
- `node.pair.verify` — 驗證 `{ nodeId, token }`。

注意事項：

- `node.pair.request` 對於每個節點是冪等 (Idempotent) 的：重複調用會傳回同一個待處理請求。
- 核准 **一律** 會產生新的 Token；`node.pair.request` 絕不會傳回 Token。
- 請求可能包含 `silent: true` 作為自動核准流程的提示。

## 自動核准 (macOS App)

macOS App 可以在滿足以下條件時嘗試 **靜默核准 (silent approval)**：

- 該請求標記為 `silent`，且
- App 可以驗證使用同一位使用者身分對閘道器主機進行 SSH 連線。

若靜默核准失敗，則會回退到一般的「核准/拒絕」提示。

## 儲存位置 (本地，私密)

配對狀態儲存在閘道器狀態目錄下（預設為 `~/.openclaw`）：

- `~/.openclaw/nodes/paired.json`
- `~/.openclaw/nodes/pending.json`

如果您覆寫了 `OPENCLAW_STATE_DIR`，`nodes/` 資料夾也會隨之移動。

安全性注意事項：

- Token 為機密資訊；請將 `paired.json` 視為敏感資料。
- 輪替 Token 需要重新核准（或刪除該節點項目）。

## 傳輸行為

- 傳輸層是 **無狀態 (Stateless)** 的；它不儲構成員資訊。
- 若閘道器離線或配對功能停用，節點將無法進行配對。
- 若閘道器處於遠端模式，配對仍會針對遠端閘道器的存儲區進行。
