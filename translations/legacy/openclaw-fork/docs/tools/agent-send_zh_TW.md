---
summary: "直接透過 `openclaw agent` CLI 執行代理人（可選用遞送功能）"
read_when:
  - 新增或修改代理人 CLI 入口點時
title: "代理人發送"
---

> 此文件為 [English Version](/tools/agent-send_zh_TW) 的繁體中文版本。

# `openclaw agent` (直接執行代理人)

`openclaw agent` 讓您可以在不依賴傳入聊天訊息的情況下，直接執行單次的代理人回合。預設情況下，此指令會 **透過閘道器 (Gateway)** 執行；加上 `--local` 可強制在目前機器上使用內嵌執行時期。

## 行為說明

- **必填參數**：`--message <文字>`。
- **工作階段選擇**：
  - `--to <目標>`：衍生工作階段金鑰（群組/頻道目標會保持隔離；私訊則歸入 `main`）。
  - `--session-id <ID>`：重用現有的特定工作階段 ID。
  - `--agent <ID>`：直接鎖定已配置的代理人（使用該代理人的 `main` 金鑰）。
- 執行與一般傳入訊息相同的內嵌代理人執行時期。
- `thinking` (推理等級) 與 `verbose` (詳細程度) 標記會被持久化存入工作階段儲存中。
- **輸出方式**：
  - 預設：印出回覆文字。
  - `--json`：印出結構化酬載與詮釋資料。
- **遞送功能**：可搭配 `--deliver` 與 `--channel` 將回覆發送回指定頻道。
- 若閘道器無法連線，CLI 會 **自動回退 (Fall back)** 至本地內嵌執行模式。

## 範例

```bash
# 對特定號碼執行並獲取回覆
openclaw agent --to +15555550123 --message "狀態更新"

# 針對特定代理人 ID 執行
openclaw agent --agent ops --message "摘要記錄檔"

# 指定工作階段並遞送至 Slack 頻道
openclaw agent --agent ops --message "產生報告" --deliver --reply-channel slack --reply-to "#reports"
```

## 旗標說明

- `--local`：在本地執行（需要在您的 Shell 環境中提供模型 API 密鑰）。
- `--deliver`：將回覆發送至選定的頻道。
- `--thinking`：持久化推理等級（僅限 GPT-5.2 與 Codex 模型）。
- `--json`：輸出結構化 JSON。
