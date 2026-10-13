---
summary: "`openclaw reset` (重置本地狀態與組態) 的 CLI 參考資料"
read_when:
  - 您想要清除本地狀態但保留 CLI 工具時
  - 您想要預覽將被移除的內容 (Dry-run) 時
title: "reset"
---

> 此文件為 [English Version](/cli/reset_zh_TW) 的繁體中文版本。

# `openclaw reset`

重置本地組態與狀態（CLI 工具本身將會保留）。

```bash
openclaw reset
openclaw reset --dry-run (模擬執行)
openclaw reset --scope config+creds+sessions --yes --non-interactive (非互動式執行)
```
