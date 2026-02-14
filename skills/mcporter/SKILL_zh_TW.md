---
name: mcporter
description: 使用 mcporter CLI 列出、配置、驗證與直接呼叫 MCP (Model Context Protocol) 伺服器/工具（透過 HTTP 或 stdio），包含臨時伺服器、組態編輯以及 CLI/型別產生。
homepage: http://mcporter.dev
metadata:
  {
    "openclaw":
      {
        "emoji": "📦",
        "requires": { "bins": ["mcporter"] },
        "install":
          [
            {
              "id": "node",
              "kind": "node",
              "package": "mcporter",
              "bins": ["mcporter"],
              "label": "安裝 mcporter (node)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# mcporter

使用 `mcporter` 指令直接操作 MCP 伺服器。

## 快速開始

- `mcporter list` (列出伺服器)。
- `mcporter list <伺服器名稱> --schema` (查看 Schema)。
- `mcporter call <伺服器.工具> 鍵=值` (呼叫工具)。

## 呼叫工具 (Call tools)

- 選擇器語法：`mcporter call linear.list_issues team=ENG limit:5`。
- 函式語法：`mcporter call "linear.create_issue(title: "Bug")"`。
- StdIO 模式：`mcporter call --stdio "bun run ./server.ts" scrape url=https://example.com`。
- JSON 酬載：`mcporter call <伺服器.工具> --args '{"limit":5}'`。

## 驗證與組態

- OAuth 驗證：`mcporter auth <伺服器 | URL>`。
- 組態管理：`mcporter config list|get|add|remove|import`。

## 守護程序 (Daemon)

- `mcporter daemon start|status|stop|restart`。

## 程式碼產生 (Codegen)

- 產生 CLI：`mcporter generate-cli --server <名稱>`。
- 產生 TypeScript：`mcporter emit-ts <伺服器> --mode client|types`。

## 注意事項

- 預設組態：`./config/mcporter.json`。
- 機器讀取結果建議使用 `--output json`。
