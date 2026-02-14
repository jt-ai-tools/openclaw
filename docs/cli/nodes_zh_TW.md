---
summary: "`openclaw nodes` (列出、狀態、核准與調用，包含相機、畫布、螢幕) 的 CLI 參考資料"
read_when:
  - 您正在管理已配對的節點（相機、螢幕、畫布）時
  - 您需要核准請求或調用節點指令時
title: "nodes"
---

> 此文件為 [English Version](/cli/nodes_zh_TW) 的繁體中文版本。

# `openclaw nodes`

管理已配對的節點 (Devices) 並調用節點功能。

## 相關資訊：
- 節點概觀：[節點 (Nodes)](/nodes_zh_TW)
- 相機功能：[相機節點 (Camera nodes)](/nodes/camera_zh_TW)
- 圖片功能：[圖片節點 (Image nodes)](/nodes/images_zh_TW)

## 常用指令

```bash
openclaw nodes list (列出所有節點)
openclaw nodes list --connected (僅列出目前連線中的節點)
openclaw nodes list --last-connected 24h (過濾最近 24 小時內有連線的節點)
openclaw nodes pending (列出待核准的配對請求)
openclaw nodes approve <請求ID> (核准配對請求)
openclaw nodes status (顯示節點狀態)
```

`nodes list` 會印出待處理與已配對的表格。已配對的列會包含最近連線的時間（Last Connect）。

## 調用與執行 (Invoke / run)

```bash
# 調用特定指令
openclaw nodes invoke --node <ID|名稱|IP> --command <指令名稱> --params <JSON參數>

# 執行系統指令 (類似 exec 工具)
openclaw nodes run --node <ID|名稱|IP> <指令...>
openclaw nodes run --raw "git status"
```

### 執行模式預設行為 (Exec-style defaults)

`nodes run` 模擬了模型的 `exec` 工具行為（包含預設值與核准機制）：
- 讀取 `tools.exec.*` 組態（包含代理人專屬的覆寫）。
- 在調用 `system.run` 前，會先進行執行核准 (`exec.approval.request`)。
- 若已設定 `tools.exec.node`，則可省略 `--node` 參數。
- 需要具備 `system.run` 能力的節點（macOS 配套 App 或無頭節點主機）。

## 常用旗標 (Flags)

- `--cwd <path>`：工作目錄。
- `--env <key=val>`：環境變數覆寫（可重複使用）。
- `--raw <command>`：執行 Shell 字串指令。
- `--agent <id>`：使用特定代理人的核准/允許清單規則（預設為配置的代理人）。
