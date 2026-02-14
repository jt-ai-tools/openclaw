---
summary: "`openclaw health` (透過 RPC 獲取閘道器健康狀態) 的 CLI 參考資料"
read_when:
  - 您想要快速檢查執行中的閘道器健康狀況時
title: "health"
---

> 此文件為 [English Version](/cli/health_zh_TW) 的繁體中文版本。

# `openclaw health`

從執行中的閘道器 (Gateway) 獲取健康狀態。

```bash
openclaw health
openclaw health --json (以 JSON 格式輸出)
openclaw health --verbose (詳細模式)
```

## 注意事項：

- `--verbose` 會執行即時探針檢查，並在配置多帳號時印出各個帳號的耗時資訊。
- 當配置了多個代理人時，輸出內容會包含每個代理人的工作階段存儲狀態。
