---
name: nano-pdf
description: 使用自然語言指令透過 nano-pdf CLI 編輯 PDF 檔案。
homepage: https://pypi.org/project/nano-pdf/
metadata:
  {
    "openclaw":
      {
        "emoji": "📄",
        "requires": { "bins": ["nano-pdf"] },
        "install":
          [
            {
              "id": "uv",
              "kind": "uv",
              "package": "nano-pdf",
              "bins": ["nano-pdf"],
              "label": "安裝 nano-pdf (uv)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# nano-pdf

使用 `nano-pdf` 指令，透過自然語言指令對 PDF 的特定頁面進行編輯。

## 快速開始

```bash
nano-pdf edit 投影片.pdf 1 "將標題改為 'Q3 結果報告' 並修正副標題中的錯字"
```

## 注意事項

- 頁碼可能是從 0 或從 1 開始，取決於工具版本與組態；若結果偏移了一頁，請嘗試切換頁碼計算方式。
- 在對外發送產出的 PDF 前，請務必先進行內容檢查。
