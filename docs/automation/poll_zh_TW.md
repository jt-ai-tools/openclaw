---
summary: "透過閘道器與 CLI 發送投票功能說明"
read_when:
  - 新增或修改投票支援功能時
  - 偵錯來自 CLI 或閘道器的投票發送動作時
title: "投票"
---

> 此文件為 [English Version](/automation/poll) 的繁體中文版本。

# 投票 (Polls)

## 支援的頻道

- WhatsApp (網頁頻道)
- Discord
- MS Teams (使用 Adaptive Cards)

## CLI 指令用法

```bash
# WhatsApp
openclaw message poll --target +15555550123 
  --poll-question "今天要一起吃午餐嗎？" --poll-option "好" --poll-option "不方便" --poll-option "再看看"
openclaw message poll --target 123456789@g.us 
  --poll-question "會議時間？" --poll-option "10am" --poll-option "2pm" --poll-option "4pm" --poll-multi

# Discord
openclaw message poll --channel discord --target channel:123456789 
  --poll-question "點心想吃什麼？" --poll-option "披薩" --poll-option "壽司"
openclaw message poll --channel discord --target channel:123456789 
  --poll-question "採用哪個方案？" --poll-option "方案 A" --poll-option "方案 B" --poll-duration-hours 48

# MS Teams
openclaw message poll --channel msteams --target conversation:19:abc@thread.tacv2 
  --poll-question "午餐？" --poll-option "披薩" --poll-option "壽司"
```

選項說明：

- `--channel`: `whatsapp` (預設), `discord`, 或 `msteams`
- `--poll-multi`: 允許選擇多個選項
- `--poll-duration-hours`: 僅限 Discord (若省略則預設為 24 小時)

## 閘道器 RPC

方法：`poll`

參數：

- `to` (字串, 必填)：收件者識別碼。
- `question` (字串, 必填)：投票問題。
- `options` (字串陣列, 必填)：選項列表。
- `maxSelections` (數字, 選填)：最大選擇數量。
- `durationHours` (數字, 選填)：持續時間（小時）。
- `channel` (字串, 選填, 預設為 `whatsapp`)。
- `idempotencyKey` (字串, 必填)：冪等性金鑰。

## 頻道差異

- **WhatsApp**：支援 2-12 個選項，`maxSelections` 必須在選項總數內，忽略 `durationHours`。
- **Discord**：支援 2-10 個選項，`durationHours` 限制在 1-768 小時之間（預設 24）。若 `maxSelections > 1` 則啟動多選功能；Discord 不支援強制的精確選擇數量。
- **MS Teams**：使用 Adaptive Card 投票（由 OpenClaw 管理）。由於無原生投票 API，系統會忽略 `durationHours`。

## 代理人工具 (Message)

使用 `message` 工具搭配 `poll` 動作 (參數包含 `to`, `pollQuestion`, `pollOption`，選填 `pollMulti`, `pollDurationHours`, `channel`)。

注意：Discord 不支援「精確挑選 N 個項目」的模式；`pollMulti` 會直接對應至多選模式。
Teams 的投票是以 Adaptive Cards 形式呈現，需要閘道器保持在線，以便將投票結果記錄在 `~/.openclaw/msteams-polls.json` 中。
