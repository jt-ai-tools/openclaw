---
summary: "透過閘道器與 CLI 發送投票功能說明"
read_when:
  - 新增或修改投票支援功能時
  - 偵錯 CLI 或閘道器的投票發送流程時
title: "投票"
---

> 此文件為 [English Version](/automation/poll_zh_TW) 的繁體中文版本。

# 投票 (Polls)

## 支援頻道
- WhatsApp
- Discord
- MS Teams（透過 Adaptive Cards）

## CLI 指令範例

```bash
# WhatsApp 私訊投票
openclaw message poll --target +15555550123 \
  --poll-question "今天午餐？" --poll-option "是" --poll-option "否"

# Discord 頻道投票（設定時長）
openclaw message poll --channel discord --target channel:123456 \
  --poll-question "點心？" --poll-option "披薩" --poll-option "壽司" --poll-duration-hours 48

# MS Teams 投票
openclaw message poll --channel msteams --target conversation:19:abc \
  --poll-question "要開會嗎？" --poll-option "要" --poll-option "不要"
```

## 選項說明
- `--poll-multi`：允許選擇多個選項。
- `--poll-duration-hours`：僅限 Discord（預設 24 小時）。

## 頻道差異
- **WhatsApp**：支援 2-12 個選項，不支援設定時長。
- **Discord**：支援 2-10 個選項，時長限制為 1-768 小時。
- **MS Teams**：使用 Adaptive Cards 模擬投票。由於 Teams 無原生投票 API，閘道器必須保持在線才能在 `msteams-polls.json` 中記錄投票結果。
