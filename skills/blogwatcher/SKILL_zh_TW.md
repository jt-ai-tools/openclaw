---
name: blogwatcher
description: 使用 blogwatcher CLI 監控部落格與 RSS/Atom 訂閱源的更新。
homepage: https://github.com/Hyaxia/blogwatcher
metadata:
  {
    "openclaw":
      {
        "emoji": "📰",
        "requires": { "bins": ["blogwatcher"] },
        "install":
          [
            {
              "id": "go",
              "kind": "go",
              "module": "github.com/Hyaxia/blogwatcher/cmd/blogwatcher@latest",
              "bins": ["blogwatcher"],
              "label": "安裝 blogwatcher (go)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# blogwatcher

使用 `blogwatcher` CLI 追蹤部落格與 RSS/Atom 訂閱源的更新。

## 快速開始

- `blogwatcher --help` (顯示說明)。

## 常見指令

- 新增部落格：`blogwatcher add "部落格名稱" https://example.com`。
- 列出部落格：`blogwatcher blogs`。
- 掃描更新：`blogwatcher scan`。
- 列出文章：`blogwatcher articles`。
- 標記為已讀：`blogwatcher read <文章編號>`。
- 移除部落格：`blogwatcher remove "部落格名稱"`。

## 注意事項

- 使用 `blogwatcher <指令> --help` 可查看更多旗標與選項。
