---
summary: "上下文視窗與壓縮機制：OpenClaw 如何將對談維持在模型限制範圍內"
read_when:
  - 您想要了解自動壓縮功能與 /compact 指令時
  - 正在偵錯因對談過長而觸發上下文限制的問題時
title: "壓縮機制"
---

> 此文件為 [English Version](/concepts/compaction) 的繁體中文版本。

# 上下文視窗與壓縮機制 (Compaction)

每個模型都有其 **上下文視窗 (context window)**（即模型能一次看見的最大 Token 數量）。長時間執行的對話會累積大量訊息與工具執行結果；一旦視窗空間快滿了，OpenClaw 就會對舊有的歷史紀錄進行 **壓縮 (Compaction)**，以維持在限制範圍內。

## 什麼是壓縮 (Compaction)

壓縮會將 **較舊的對話內容摘要** 成一個精簡的摘要項目，並保持近期訊息完整不變。該摘要會儲存在對談歷史紀錄中，因此未來的請求會使用：

- 壓縮後的摘要內容
- 壓縮點之後的近期訊息

壓縮結果會 **持久化 (persists)** 於對談的 JSONL 歷史檔案中。

## 組態設定

請參閱 `agents.defaults.compaction` 的相關設定。

## 自動壓縮 (預設開啟)

當會話接近或超過模型的上下文視窗時，OpenClaw 會觸發自動壓縮，並可能使用壓縮後的上下文重新嘗試原始請求。

您會看到：

- 詳細模式 (Verbose) 下顯示 `🧹 Auto-compaction complete`
- `/status` 指令顯示 `🧹 Compactions: <次數>`

在進行壓縮之前，OpenClaw 可以執行一次 **無聲的記憶體清除 (silent memory flush)** 回合，將持久性筆記儲存至磁碟。詳情與設定請參閱 [記憶 (Memory)](/concepts/memory_zh_TW)。

## 手動壓縮

使用 `/compact` 指令（可選填指令說明）來強制執行一次壓縮處理：

```
/compact 重點放在已做出的決定與未解決的問題
```

## 上下文視窗來源

上下文視窗的大小取決於特定模型。OpenClaw 使用配置的提供者型錄中的模型定義來決定其上限。

## 壓縮 (Compaction) vs 修剪 (Pruning)

- **壓縮 (Compaction)**：進行摘要並 **持久化** 存入 JSONL。
- **會話修剪 (Session pruning)**：每次請求時在 **記憶體中** 僅針對舊的 **工具執行結果** 進行裁切。

關於修剪的細節請參閱 [/concepts/session-pruning](/concepts/session-pruning_zh_TW)。

## 小提示

- 當會話內容顯得過時或上下文過於臃腫時，請使用 `/compact`。
- 大型工具輸出內容預設會被截斷；修剪功能可進一步減少工具結果的累積。
- 如果您需要完全重新開始，可以使用 `/new` 或 `/reset` 來啟動一個新的會話 ID。
