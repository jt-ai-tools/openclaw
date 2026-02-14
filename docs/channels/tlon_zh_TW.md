---
summary: "Tlon/Urbit 支援狀態、能力與組態設定說明"
read_when:
  - 處理 Tlon/Urbit 頻道功能時
title: "Tlon"
---

> 此文件為 [English Version](/channels/tlon_zh_TW) 的繁體中文版本。

# Tlon (外掛程式)

Tlon 是一款基於 Urbit 構建的去中心化通訊軟體。OpenClaw 可以連接到您的 Urbit Ship，並回覆私訊 (DMs) 與群組訊息。

目前狀態：透過外掛程式支援。支援私訊、群組提及、執行緒回覆以及僅限文字的多媒體備援。不支援回應表情、投票或原生媒體上傳。

## 外掛程式需求
Tlon 功能是以外掛程式形式提供的。
- 安裝指令：`openclaw plugins install @openclaw/tlon`。

## 設定步驟

1. **安裝外掛程式**。
2. **獲取資訊**：收集您的 Ship URL 與登入代碼。
3. **配置組態**：
```json5
{
  channels: {
    tlon: {
      enabled: true,
      ship: "~sampel-palnet",
      url: "https://您的Ship主機",
      code: "您的登入代碼",
    },
  },
}
```
4. **重啟閘道器**。

## 群組頻道
系統預設會開啟自動發現功能。您也可以手動釘選頻道：
```json5
{
  channels: {
    tlon: {
      groupChannels: ["chat/~host-ship/general"],
    },
  },
}
```

## 存取控制
- **私訊允許清單**：可透過 `dmAllowlist` 限制特定 Ship。
- **群組授權**：預設為受限模式，可針對個別頻道設定 `mode: "restricted"` 或 `"open"`。

## 傳送目標格式 (CLI/Cron)
- **私訊**：使用 `~sampel-palnet`。
- **群組**：使用 `chat/~host-ship/channel`。

## 注意事項
- **群組回覆**：需要被標記（例如 `~您的機器人Ship`）才會回應。
- **執行緒**：若傳入訊息位於執行緒中，OpenClaw 會在同一個執行緒中回覆。
