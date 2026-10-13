---
summary: "`openclaw tui` (連接至閘道器的終端機 UI) 的 CLI 參考資料"
read_when:
  - 您想要一個用於閘道器的終端機 UI 時（支援遠端）
  - 您想要透過腳本傳遞 URL/權杖/工作階段時
title: "tui"
---

> 此文件為 [English Version](/cli/tui_zh_TW) 的繁體中文版本。

# `openclaw tui`

開啟連接至閘道器 (Gateway) 的終端機 UI (Terminal UI)。

## 相關資訊：
- TUI 使用指南：[TUI](/web/tui_zh_TW)

## 範例

```bash
openclaw tui (開啟預設 TUI)
openclaw tui --url ws://127.0.0.1:18789 --token <權杖> (連接至指定閘道器)
openclaw tui --session main --deliver (開啟特定工作階段並遞送回覆)
```
