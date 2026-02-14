---
name: session-memory
description: "執行 /new 指令時，自動將工作階段上下文存入記憶體"
homepage: https://docs.openclaw.ai/hooks#session-memory
metadata:
  {
    "openclaw":
      {
        "emoji": "💾",
        "events": ["command:new"],
        "requires": { "config": ["workspace.dir"] },
        "install": [{ "id": "bundled", "kind": "bundled", "label": "隨 OpenClaw 附帶" }],
      },
  }
---

# 工作階段記憶勾子 (Session Memory Hook)

當您下達 `/new` 指令開啟新工作階段時，此勾子會自動將先前的對話上下文存入您的工作區記憶體中。

## 功能說明

1. **尋找前次對話**：定位重置前的逐字稿內容。
2. **擷取對話內容**：讀取最後 N 則訊息（預設 15 則）。
3. **產生描述性檔名**：使用 LLM 根據對話內容產生具有意義的檔名（如 `vendor-pitch`）。
4. **存入記憶體**：在 `<工作區>/memory/YYYY-MM-DD-slug.md` 建立新檔案。
5. **發送確認**：通知您檔案已儲存的路徑。

## 檔名範例
- `2026-01-16-vendor-pitch.md`：關於廠商提案的討論。
- `2026-01-16-api-design.md`：API 架構規劃。

## 組態設定
支援選用配置，例如調整擷取的訊息數量：
```json
{
  "hooks": {
    "internal": {
      "entries": {
        "session-memory": { "enabled": true, "messages": 25 }
      }
    }
  }
}
```
