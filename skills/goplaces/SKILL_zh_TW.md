---
name: goplaces
description: 透過 goplaces CLI 查詢 Google Places API (新版)，支援文字搜尋、地點詳情、位置解析與評論。適用於人類友好的地點查找或腳本使用的 JSON 輸出。
homepage: https://github.com/steipete/goplaces
metadata:
  {
    "openclaw":
      {
        "emoji": "📍",
        "requires": { "bins": ["goplaces"], "env": ["GOOGLE_PLACES_API_KEY"] },
        "primaryEnv": "GOOGLE_PLACES_API_KEY",
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "steipete/tap/goplaces",
              "bins": ["goplaces"],
              "label": "安裝 goplaces (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# goplaces

現代化的 Google Places API (新版) CLI 工具。預設為人類可讀輸出，腳本處理請使用 `--json`。

## 設定

- 需要 `GOOGLE_PLACES_API_KEY` 環境變數。

## 常見指令

- 搜尋：`goplaces search "咖啡" --open-now --min-rating 4 --limit 5`。
- 位置偏好：`goplaces search "披薩" --lat 25.03 --lng 121.56 --radius-m 3000`。
- 分頁：`goplaces search "披薩" --page-token "下一頁權杖"`。
- 解析位置：`goplaces resolve "台北市信義區" --limit 5`。
- 地點詳情：`goplaces details <地點ID> --reviews`。

## 注意事項

- 價格等級：0..4（免費 → 非常昂貴）。
- 類型過濾僅會發送第一個 `--type` 數值（API 限制僅能接受一個）。
