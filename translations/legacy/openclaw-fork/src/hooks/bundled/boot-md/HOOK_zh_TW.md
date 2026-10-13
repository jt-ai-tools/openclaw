---
name: boot-md
description: "在閘道器啟動時執行 BOOT.md"
homepage: https://docs.openclaw.ai/hooks#boot-md
metadata:
  {
    "openclaw":
      {
        "emoji": "🚀",
        "events": ["gateway:startup"],
        "requires": { "config": ["workspace.dir"] },
        "install": [{ "id": "bundled", "kind": "bundled", "label": "隨 OpenClaw 附帶" }],
      },
  }
---

# 啟動檢查清單勾子 (Boot Checklist Hook)

每當閘道器啟動時，若工作區內存在 `BOOT.md` 檔案，此勾子會自動執行其中的內容。
