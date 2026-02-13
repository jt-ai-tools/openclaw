---
summary: "橋接通訊協定（舊版節點）：TCP JSONL、配對、受限範圍的 RPC"
read_when:
  - 建置或偵錯節點用戶端（iOS/Android/macOS 節點模式）時
  - 調查配對或橋接驗證失敗時
  - 審計閘道器公開的節點介面時
title: "橋接通訊協定 (舊版)"
---

> 此文件為 [English Version](/gateway/bridge-protocol) 的繁體中文版本。

# 橋接通訊協定 (舊版節點傳輸)

橋接通訊協定 (Bridge protocol) 是一項 **舊版 (Legacy)** 的節點傳輸機制 (TCP JSONL)。新的節點用戶端應改為使用統一的 [閘道器通訊協定 (Gateway WebSocket protocol)](/gateway/protocol_zh_TW)。

如果您正在開發操作員或節點用戶端，請參閱 [閘道器通訊協定](/gateway/protocol_zh_TW)。

**注意：** 目前版本的 OpenClaw 已不再提供 TCP 橋接監聽程式；本文件僅供歷史參考。舊版的 `bridge.*` 組態鍵名已不再屬於組態架構的一部分。

## 為何同時存在兩種通訊協定

- **安全性邊界**：橋接通訊協定僅公開一小部分允許清單，而非整個閘道器 API。
- **配對與節點識別**：節點准入 (Node admission) 由閘道器管理，並與每個節點專屬的 Token 綁定。
- **發現機制的使用者體驗 (Discovery UX)**：節點可透過區域網路上的 Bonjour 發現閘道器，或直接透過 Tailnet 連線。
- **迴路 WebSocket (Loopback WS)**：完整的 WS 控制平面保持在本地，除非透過 SSH 建立隧道。

## 傳輸方式

- TCP，每行一個 JSON 物件 (JSONL)。
- 選用的 TLS（當 `bridge.tls.enabled` 為 true 時）。
- 舊版預設監聽連接埠為 `18790`（目前版本不會啟動 TCP 橋接）。

啟用 TLS 時，發現機制產生的 TXT 紀錄會包含 `bridgeTls=1` 與 `bridgeTlsSha256`，以便節點能固定 (pin) 憑證。

## 交握與配對 (Handshake + pairing)

1. 用戶端傳送 `hello` 以及節點元數據與 Token（若已配對）。
2. 若未配對，閘道器傳回 `error` (`NOT_PAIRED`/`UNAUTHORIZED`)。
3. 用戶端傳送 `pair-request`。
4. 閘道器等待核准，隨後傳送 `pair-ok` 與 `hello-ok`。

`hello-ok` 會傳回 `serverName` 並可能包含 `canvasHostUrl`。

## 框架結構 (Frames)

用戶端 → 閘道器：

- `req` / `res`：受限範圍的閘道器 RPC (聊天, 對談, 組態, 健康度, 語音喚醒, 技能列表)
- `event`：節點訊號 (語音逐字稿, 代理人請求, 聊天訂閱, 執行生命週期)

閘道器 → 用戶端：

- `invoke` / `invoke-res`：節點指令 (`canvas.*`, `camera.*`, `screen.record`, `location.get`, `sms.send`)
- `event`：所訂閱會話的聊天更新
- `ping` / `pong`：保持連線 (keepalive)

舊版的允許清單強制執行邏輯原先位於 `src/gateway/server-bridge.ts`（已移除）。

## 執行生命週期事件 (Exec lifecycle)

節點可以發出 `exec.finished` 或 `exec.denied` 事件以呈現 `system.run` 的活動狀態。這些事件會對應到閘道器內的系統事件。（舊版節點可能仍會發出 `exec.started`。）

負載欄位（除特別註明外皆為選填）：

- `sessionKey` (必填)：接收該系統事件的代理人會話。
- `runId`：用於分組的唯一執行 ID。
- `command`：原始或格式化後的指令字串。
- `exitCode`, `timedOut`, `success`, `output`：執行完成細節（僅限 finished）。
- `reason`：拒絕原因（僅限 denied）。

## Tailnet 使用

- 將橋接器綁定至 Tailnet IP：在 `~/.openclaw/openclaw.json` 中設定 `bridge.bind: "tailnet"`。
- 用戶端透過 MagicDNS 名稱或 Tailnet IP 進行連線。
- Bonjour **無法** 跨越網路；需要時請使用手動指定主機/連接埠或廣域 DNS-SD。

## 版本管理

橋接通訊協定目前為 **隱式 v1**（無最小/最大版本協商）。預期會維持向後相容；在進行任何破壞性變更前，將會加入通訊協定版本欄位。
