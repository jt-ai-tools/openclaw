---
summary: "OpenProse：OpenClaw 中的 .prose 工作流、斜線指令與狀態說明"
read_when:
  - 您想要執行或編寫 .prose 工作流時
  - 您想要啟用 OpenProse 外掛程式時
  - 您需要了解狀態儲存機制時
title: "OpenProse"
---

> 此文件為 [English Version](/prose_zh_TW) 的繁體中文版本。

# OpenProse

OpenProse 是一種可移植、Markdown 優先的工作流格式，用於編排 AI 對談。在 OpenClaw 中，它以外掛程式形式提供，包含 OpenProse 技能包 (Skill pack) 與 `/prose` 斜線指令。程式存放於 `.prose` 檔案中，並可透過明確的控制流啟動多個子代理人 (Sub-agents)。

官方網站：[https://www.prose.md](https://www.prose.md)

## 功能特色

- 具備明確並行處理能力的「多代理人研究與綜合彙整」。
- 可重複且核准安全的工作流（程式碼審查、事件分類、內容管線）。
- 可在支援的代理人執行環境中重複使用的 `.prose` 程式。

## 安裝與啟用

內建外掛程式預設為停用。啟用 OpenProse：

```bash
openclaw plugins enable open-prose
```

啟用外掛程式後請重啟閘道器 (Gateway)。

開發/本地檢出 (Checkout)：`openclaw plugins install ./extensions/open-prose`

相關文件：[外掛程式 (Plugins)](/tools/plugin_zh_TW), [外掛程式清單 (Plugin manifest)](/plugins/manifest_zh_TW), [技能 (Skills)](/tools/skills_zh_TW)。

## 斜線指令

OpenProse 將 `/prose` 註冊為使用者可呼叫的技能指令。它會路由至 OpenProse VM 指令，並在底層使用 OpenClaw 工具。

常見指令：

```
/prose help
/prose run <file.prose>
/prose run <handle/slug>
/prose run <https://example.com/file.prose>
/prose compile <file.prose>
/prose examples
/prose update
```

## 範例：簡單的 `.prose` 檔案

```prose
# 使用兩個並行執行的代理人進行研究與彙整。

input topic: "我們應該研究什麼？"

agent researcher:
  model: sonnet
  prompt: "你會進行深入研究並引用來源。"

agent writer:
  model: opus
  prompt: "你會撰寫簡潔的摘要。"

parallel:
  findings = session: researcher
    prompt: "研究 {topic}。"
  draft = session: writer
    prompt: "摘要 {topic}。"

session "將研究結果與草稿合併為最終答案。"
context: { findings, draft }
```

## 檔案位置

OpenProse 將狀態儲存在工作區的 `.prose/` 目錄下：

```
.prose/
├── .env
├── runs/
│   └── {YYYYMMDD}-{HHMMSS}-{random}/
│       ├── program.prose
│       ├── state.md
│       ├── bindings/
│       └── agents/
└── agents/
```

使用者層級的持久化代理人位於：

```
~/.prose/agents/
```

## 狀態模式 (State modes)

OpenProse 支援多種狀態後端：

- **filesystem**（預設）：`.prose/runs/...`
- **in-context**：瞬時性，適用於小型程式。
- **sqlite**（實驗性）：需要 `sqlite3` 二進位檔。
- **postgres**（實驗性）：需要 `psql` 與連線字串。

注意事項：

- sqlite/postgres 為選用且處於實驗階段。
- postgres 憑證會流向子代理人記錄；請使用專用且權限最小化的資料庫。

## 遠端程式

`/prose run <handle/slug>` 會解析為 `https://p.prose.md/<handle>/<slug>`。
直接 URL 則依原樣獲取。這會使用 `web_fetch` 工具（或使用 `exec` 進行 POST）。

## OpenClaw 執行環境映射

OpenProse 程式會映射至 OpenClaw 的基本原語：

| OpenProse 概念            | OpenClaw 工具    |
| ------------------------- | ---------------- |
| 啟動工作階段 / 任務工具      | `sessions_spawn` |
| 檔案 讀取/寫入              | `read` / `write` |
| 網頁獲取 (Web fetch)       | `web_fetch`      |

如果您的工具允許清單封鎖了這些工具，OpenProse 程式將會執行失敗。請參閱 [技能組態 (Skills config)](/tools/skills-config_zh_TW)。

## 安全性與核准

請將 `.prose` 檔案視同程式碼處理。執行前請務必審查。使用 OpenClaw 工具允許清單與核准閘道來控制副作用。

對於確定性且具備核准閘道的工作流，請與 [Lobster](/tools/lobster_zh_TW) 進行比較。
