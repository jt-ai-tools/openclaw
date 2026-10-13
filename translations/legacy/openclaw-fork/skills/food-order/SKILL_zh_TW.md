---
name: food-order
description: 使用 ordercli 重新訂購 Foodora 訂單並追蹤預計到達時間 (ETA)/狀態。未經使用者明確核准，絕不確認訂單。觸發詞：訂餐、重新訂購、追蹤進度。
homepage: https://ordercli.sh
metadata: {"openclaw":{"emoji":"🥡","requires":{"bins":["ordercli"]},"install":[{"id":"go","kind":"go","module":"github.com/steipete/ordercli/cmd/ordercli@latest","bins":["ordercli"],"label":"安裝 ordercli (go)"}]}}
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# 訂餐技能 (Foodora 透過 ordercli)

目標：安全地重新訂購之前的 Foodora 訂單（先預覽；僅在使用者明確表示「是/確認/下單」時才執行）。

## 硬性安全規則 (Hard safety rules)

- **除非使用者明確確認下單，否則絕不可執行 `ordercli foodora reorder ... --confirm`。**
- 優先執行「僅預覽」步驟；向使用者展示將會發生什麼事；詢問核准。
- 如果使用者不確定：停留在預覽階段並提出疑問。

## 設定步驟（僅需一次）

- 設定國家：`ordercli foodora config set --country AT` (例如 AT 為奧地利)。
- 登入（無需密碼，建議方式）：`ordercli foodora session chrome --url https://www.foodora.at/ --profile "Default"`。

## 尋找要重新訂購的項目

- 最近訂單：`ordercli foodora history --limit 10`。
- 顯示詳情：`ordercli foodora history show <訂單代碼>`。

## 預覽重新訂購（不更改購物車）

- `ordercli foodora reorder <訂單代碼>`

## 執行重新訂購（會更改購物車；需要明確核准）

- 先獲取確認，然後執行：`ordercli foodora reorder <訂單代碼> --confirm`。
- 若有多個地址：詢問使用者正確的 `--address-id` 並執行：
  - `ordercli foodora reorder <訂單代碼> --confirm --address-id <ID>`

## 追蹤訂單

- 到達時間/狀態：`ordercli foodora orders`。
- 即時更新：`ordercli foodora orders --watch`。
- 單一訂單詳情：`ordercli foodora order <訂單代碼>`。
