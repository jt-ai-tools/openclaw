---
summary: "`openclaw channels` (帳號、狀態、登入/登出、日誌) 的 CLI 參考資料"
read_when:
  - 您想要新增或移除通訊頻道帳號時（包含 WhatsApp, Telegram, Discord, Google Chat, Slack, Signal, iMessage 等）
  - 您想要檢查頻道狀態或追蹤頻道日誌時
title: "channels"
---

> 此文件為 [English Version](/cli/channels_zh_TW) 的繁體中文版本。

# `openclaw channels`

管理閘道器 (Gateway) 上的通訊頻道帳號及其執行狀態。

## 相關資訊：
- 頻道指南：[頻道 (Channels)](/channels/index_zh_TW)
- 閘道器組態：[組態設定 (Configuration)](/gateway/configuration_zh_TW)

## 常用指令

```bash
openclaw channels list (列出配置的頻道)
openclaw channels status (檢查連線狀態)
openclaw channels capabilities (檢查頻道能力)
openclaw channels resolve --channel slack "#general" (將名稱解析為 ID)
openclaw channels logs --channel all (查看頻道專屬日誌)
```

## 新增與移除帳號

```bash
# 新增 Telegram 帳號
openclaw channels add --channel telegram --token <機器人權杖>

# 移除 Telegram 帳號並刪除配置
openclaw channels remove --channel telegram --delete
```

**提示**：執行 `openclaw channels add --help` 可查看各個頻道專屬的參數（如權杖、App Token、路徑等）。

## 登入與登出 (互動模式)

目前主要適用於 WhatsApp Web。

```bash
openclaw channels login --channel whatsapp
openclaw channels logout --channel whatsapp
```

## 能力探針 (Capabilities probe)

獲取提供者的能力提示（如 Intents 或 Scopes）以及靜態的功能支援狀況：

```bash
openclaw channels capabilities
openclaw channels capabilities --channel discord --target channel:123
```

## 名稱解析 (Resolve)

使用提供者的目錄將頻道或使用者名稱解析為 ID：

```bash
openclaw channels resolve --channel slack "#general" "@jane"
openclaw channels resolve --channel discord "我的伺服器/#支援" "@某人"
```
