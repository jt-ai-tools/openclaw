---
name: ordercli
description: 僅限 Foodora 的 CLI 工具，用於檢查過去訂單與目前訂單狀態（Deliveroo 開發中）。
homepage: https://ordercli.sh
metadata:
  {
    "openclaw":
      {
        "emoji": "🛵",
        "requires": { "bins": ["ordercli"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "steipete/tap/ordercli",
              "bins": ["ordercli"],
              "label": "安裝 ordercli (brew)",
            },
            {
              "id": "go",
              "kind": "go",
              "module": "github.com/steipete/ordercli/cmd/ordercli@latest",
              "bins": ["ordercli"],
              "label": "安裝 ordercli (go)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# ordercli

使用 `ordercli` 指令來檢查過去的訂單並追蹤目前的訂單狀態（目前僅支援 Foodora）。

## 快速開始 (Foodora)

- `ordercli foodora countries` (列出支援國家)。
- `ordercli foodora config set --country AT` (設定國家)。
- `ordercli foodora login --email 您的信箱 --password-stdin` (登入)。
- `ordercli foodora history --limit 20` (歷史訂單)。
- `ordercli foodora history show <訂單代碼>` (顯示詳情)。

## 訂單追蹤 (Orders)

- 目前訂單列表（預計到達時間/狀態）：`ordercli foodora orders`。
- 持續監看：`ordercli foodora orders --watch`。
- 目前訂單詳情：`ordercli foodora order <訂單代碼>`。

## 重新訂購 (Reorder)

- 預覽：`ordercli foodora reorder <訂單代碼>`。
- 確認（將項目加入購物車）：`ordercli foodora reorder <訂單代碼> --confirm`。

## 繞過機器人保護 (Bot protection)

- 瀏覽器登入：`ordercli foodora login --email 您的信箱 --password-stdin --browser`。
- 匯入 Chrome Cookie：`ordercli foodora cookies chrome --profile "Default"`。

## 工作階段匯入 (無需密碼)

- `ordercli foodora session chrome --url https://www.foodora.at/ --profile "Default"`。

## 注意事項

- 執行任何重新訂購或更改購物車的動作前，請務必先向使用者確認。
