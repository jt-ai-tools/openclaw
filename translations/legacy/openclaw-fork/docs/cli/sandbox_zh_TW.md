---
title: 沙箱 CLI (Sandbox CLI)
summary: "管理沙箱容器並檢查有效的沙箱策略"
read_when: "您正在管理沙箱容器或偵錯沙箱/工具策略行為時。"
---

> 此文件為 [English Version](/cli/sandbox_zh_TW) 的繁體中文版本。

# 沙箱 CLI (Sandbox CLI)

管理用於隔離代理人執行環境的 Docker 沙箱容器。

## 概觀

OpenClaw 為了安全性，可以在隔離的 Docker 容器中執行代理人。`sandbox` 指令可協助您管理這些容器，特別是在更新或修改組態之後。

## 指令集

### `openclaw sandbox explain`
檢查 **有效 (Effective)** 的沙箱模式、範圍、工作區存取權限、沙箱工具策略以及提升權限門控（並提供對應的組態修復路徑）。

```bash
openclaw sandbox explain
openclaw sandbox explain --agent work
openclaw sandbox explain --json
```

### `openclaw sandbox list`
列出所有沙箱容器及其狀態與組態。

```bash
openclaw sandbox list
openclaw sandbox list --browser (僅列出瀏覽器容器)
openclaw sandbox list --json
```

**輸出內容包含：**
- 容器名稱與狀態（執行中/已停止）。
- Docker 映像檔是否符合目前的組態。
- 建立時長與閒置時間。
- 關聯的工作階段/代理人。

### `openclaw sandbox recreate`
移除沙箱容器，以強制使用更新後的映像檔或組態進行重新建立。

```bash
openclaw sandbox recreate --all (重新建立所有容器)
openclaw sandbox recreate --agent mybot (針對特定代理人)
openclaw sandbox recreate --force (跳過核准提示)
```

**重要事項**：當代理人下次被使用時，容器會自動重新建立。

## 為什麼需要這個？

**問題**：當您更新沙箱 Docker 映像檔或組態時：
- 現有的容器會繼續以舊的設定執行。
- 容器僅在閒置 24 小時後才會被修整 (Pruned)。
- 經常使用的代理人會使舊容器無限期地執行下去。

**解決方案**：使用 `openclaw sandbox recreate` 強制移除舊容器。下次需要時，系統會以目前最新的設定自動重新建立容器。

## 相關資訊：
- 沙箱說明文件：[沙箱 (Sandboxing)](/gateway/sandboxing_zh_TW)
- 代理人組態：[代理人工作區 (Agent workspace)](/concepts/agent-workspace_zh_TW)
- 診斷指令：[診斷工具 (Doctor)](/gateway/doctor_zh_TW) —— 檢查沙箱設定。
