---
title: 形式驗證 (安全性模型)
summary: 針對 OpenClaw 高風險路徑進行機器查核的安全性模型。
permalink: /security/formal-verification/
---

> 此文件為 [English Version](/security/formal-verification_zh_TW) 的繁體中文版本。

# 形式驗證 (安全性模型)

本頁面追蹤 OpenClaw 的 **形式安全性模型 (Formal security models)**（目前使用 TLA+/TLC；視需要增加更多方式）。

> 注意：部分舊連結可能會提及本專案的舊名稱。

**目標 (北極星)：** 在明確的假設下，提供經過機器查核的論證，證明 OpenClaw 確實執行了預期的安全性原則（包含授權、對談隔離、工具門控以及組態錯誤的安全性）。

**現階段定位：** 一個可執行且由攻擊者驅動的 **安全性迴歸測試套件**：

- 每個宣告 (Claim) 皆具備在有限狀態空間上執行的可執行模型檢查。
- 許多宣告皆配有一個 **負向模型 (Negative model)**，用於為真實存在的錯誤類別產生反例追蹤 (Counterexample trace)。

**目前的侷限：** 這並非「OpenClaw 在各方面都絕對安全」的證明，也不是對完整的 TypeScript 實作正確性的證明。

## 模型存放位置

模型維護於獨立的儲存庫：[vignesh07/openclaw-formal-models](https://github.com/vignesh07/openclaw-formal-models)。

## 重要注意事項

- 這些是 **模型**，而非完整的 TypeScript 實作。模型與實際程式碼之間可能存在偏離 (Drift)。
- 結果受限於 TLC 探索的狀態空間；「通過 (Green)」並不代表在模型假設與邊界之外的絕對安全。
- 部分宣告依賴於明確的環境假設（例如：正確的部署方式、正確的組態輸入）。

## 重現結果

目前透過本地複製模型儲存庫並執行 TLC 來重現結果（見下文）。未來的版本可能會提供：

- 具備公開成品（反例追蹤、執行日誌）的 CI 執行模型。
- 針對小型、具邊界的檢查提供託管式的「執行此模型」工作流。

開始使用：

```bash
git clone https://github.com/vignesh07/openclaw-formal-models
cd openclaw-formal-models

# 需要 Java 11+ (TLC 執行於 JVM)。
# 儲存庫內建了固定的 `tla2tools.jar` (TLA+ 工具) 並提供 `bin/tlc` 與 Make 目標。

make <target>
```

### 閘道器曝光與開放式閘道器組態錯誤

**宣告：** 在沒有驗證的情況下綁定迴路位址 (Loopback) 以外的位址，可能會導致遠端入侵 / 增加曝光風險；Token/密碼可阻擋未經授權的攻擊者（根據模型假設）。

- 通過執行 (Green runs)：
  - `make gateway-exposure-v2`
  - `make gateway-exposure-v2-protected`
- 失敗執行（預期內）：
  - `make gateway-exposure-v2-negative`

另請參閱：模型儲存庫中的 `docs/gateway-exposure-matrix.md`。

### Nodes.run 管線 (最高風險能力)

**宣告：** `nodes.run` 要求 (a) 節點指令允許清單及已宣告的指令，以及 (b) 設定後的即時核准；核准過程經過 Token 化以防止重放攻擊 (Replay)（於模型中）。

- 通過執行 (Green runs)：
  - `make nodes-pipeline`
  - `make approvals-token`
- 失敗執行（預期內）：
  - `make nodes-pipeline-negative`
  - `make approvals-token-negative`

### 配對存儲區 (私訊門控)

**宣告：** 配對請求遵循 TTL（生存時間）與待處理請求上限。

- 通過執行 (Green runs)：
  - `make pairing`
  - `make pairing-cap`
- 失敗執行（預期內）：
  - `make pairing-negative`
  - `make pairing-cap-negative`

### 入站門控 (提及 + 控制指令繞過)

**宣告：** 在要求提及 (Mention) 的群組上下文中，未經授權的「控制指令」無法繞過提及門檻。

- 通過 (Green)：
  - `make ingress-gating`
- 失敗 (預期內)：
  - `make ingress-gating-negative`

### 路由/對談金鑰隔離

**宣告：** 除非有明確連結或設定，否則來自不同對象的私訊不會歸併到同一個會話中。

- 通過 (Green)：
  - `make routing-isolation`
- 失敗 (預期內)：
  - `make routing-isolation-negative`

## v1++: 額外的具邊界模型 (並行、重試、追蹤正確性)

這些是後續加入的模型，旨在提升對真實世界故障模式（非原子性更新、重試及訊息扇出）的擬真度。

### 配對存儲區並行 / 冪等性

**宣告：** 配對存儲區即使在交錯執行 (Interleavings) 下也應強制執行 `MaxPending` 與冪等性（即「先檢查再寫入」必須是原子性的或具備鎖定機制；重新整理不應建立重複項）。

代表意義：

- 在並發請求下，不能超過該頻道的 `MaxPending` 上限。
- 對於同一個 `(頻道, 傳送者)` 的重複請求/重新整理，不應建立重複的待處理資料列。

- 通過執行 (Green runs)：
  - `make pairing-race` (原子性/具鎖定的上限檢查)
  - `make pairing-idempotency`
  - `make pairing-refresh`
  - `make pairing-refresh-race`
- 失敗執行（預期內）：
  - `make pairing-race-negative` (非原子性的開始/提交導致上限競爭)
  - `make pairing-idempotency-negative`
  - `make pairing-refresh-negative`
  - `make pairing-refresh-race-negative`

### 入站追蹤關聯性 / 冪等性

**宣告：** 入站處理應在扇出 (Fan-out) 過程中保留追蹤關聯性 (Trace correlation)，且在提供者重試時具備冪等性。

代表意義：

- 當一個外部事件轉化為多個內部訊息時，每個部分都保留相同的追蹤/事件身分。
- 重試不會導致重複處理。
- 若缺失提供者事件 ID，重複刪除機制會回退至安全金鑰（例如追蹤 ID），以避免捨棄不相關的事件。

- 通過 (Green)：
  - `make ingress-trace`
  - `make ingress-trace2`
  - `make ingress-idempotency`
  - `make ingress-dedupe-fallback`
- 失敗 (預期內)：
  - `make ingress-trace-negative`
  - `make ingress-trace2-negative`
  - `make ingress-idempotency-negative`
  - `make ingress-dedupe-fallback-negative`

### 路由 dmScope 優先順序 + identityLinks

**宣告：** 路由機制預設必須保持私訊對談隔離，僅在明確配置時（頻道優先順序 + 身分連結）才進行會話歸併。

代表意義：

- 頻道專屬的 `dmScope` 覆寫必須優於全域預設值。
- `identityLinks` 應僅在明確連結的群組內進行歸併，而不應跨越無關的同儕對象。

- 通過 (Green)：
  - `make routing-precedence`
  - `make routing-identitylinks`
- 失敗 (預期內)：
  - `make routing-precedence-negative`
  - `make routing-identitylinks-negative`
