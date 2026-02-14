---
summary: "`openclaw logs` (透過 RPC 追蹤閘道器日誌) 的 CLI 參考資料"
read_when:
  - 您需要遠端追蹤閘道器日誌時（無需 SSH）
  - 您需要 JSON 格式日誌以供其它工具使用時
title: "logs"
---

> 此文件為 [English Version](/cli/logs_zh_TW) 的繁體中文版本。

# `openclaw logs`

透過 RPC 追蹤閘道器的檔案日誌（適用於遠端模式）。

相關資訊：
- 日誌機制概觀：[記錄機制 (Logging)](/logging_zh_TW)

## 範例

```bash
openclaw logs
openclaw logs --follow (持續追蹤)
openclaw logs --json (JSON 格式)
openclaw logs --limit 500 (限制行數)
openclaw logs --local-time (顯示本地時間)
openclaw logs --follow --local-time
```

使用 `--local-time` 旗標將時間戳記轉換為您的本地時區進行顯示。
