---
summary: "語音喚醒與一鍵發話模式重疊時的語音懸浮窗生命週期說明"
read_when:
  - 調整語音懸浮窗 (Voice Overlay) 行為時
title: "語音懸浮窗"
---

> 此文件為 [English Version](/platforms/mac/voice-overlay_zh_TW) 的繁體中文版本。

# 語音懸浮窗生命週期 (macOS)

對象：macOS App 貢獻者。目標：確保在語音喚醒 (Wake-word) 與一鍵發話 (Push-to-Talk) 模式重疊時，懸浮窗行為具備可預測性。

## 目前設計意圖

- 如果懸浮窗已因語音喚醒而顯示，且使用者按下熱鍵，則熱鍵工作階段會 **繼承 (Adopt)** 現有文字而非將其重置。
- 語音喚醒仍會在靜默後自動發送；一鍵發話則在放開按鍵後立即發送。

## 已實作內容 (2025 年 12 月 9 日)

- 每次錄音（喚醒或 PTT）現在都會帶有一個權杖 (Token)。當權杖不符時，系統會丟棄舊的回呼，以避免 stale callbacks。
- 一鍵發話會繼承任何可見的懸浮窗文字作為前綴。
- 提示音與懸浮窗日誌會輸出至 `voicewake.overlay`, `voicewake.ptt`, 以及 `voicewake.chime` 分類中。

## 後續步驟

1. **VoiceSessionCoordinator (協調器)**
   - 負責管理唯一活動的 `VoiceSession`。
   - API：`beginWakeCapture`, `beginPushToTalk`, `updatePartial`, `endCapture` 等。
   - 負責丟棄無效權杖的回呼。
2. **VoiceSession (模型)**
   - 欄位包含：`token`, `source`, 文字內容, 定時器, `overlayMode` 等。
3. **懸浮窗繫結**
   - 透過 `VoiceSessionPublisher` 將活動工作階段同步至 SwiftUI。
   - `VoiceWakeOverlayView` 僅透過發布者進行渲染，不直接修改全域單例。
4. **統一發送路徑**
   - 執行 `endCapture` 時：若文字為空則隱藏；否則執行發送並播放提示音。
   - 一鍵發話結束後，對喚醒執行時期套用短暫的冷卻時間 (Cooldown)，以防止立即重複觸發。

## 偵錯檢查清單

- 在重現懸浮窗卡住的問題時，請串流日誌：
  ```bash
  sudo log stream --predicate 'subsystem == "bot.molt" AND category CONTAINS "voicewake"' --level info --style compact
  ```
- 確保只有一個活動中的權杖；舊的回呼應被協調器丟棄。
- 確保放開熱鍵時一律會呼叫 `endCapture`。
