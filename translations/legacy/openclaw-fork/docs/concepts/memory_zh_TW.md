---
title: "記憶 (Memory)"
summary: "OpenClaw 記憶運作原理說明（工作區檔案 + 自動記憶寫入）"
read_when:
  - 您想要了解記憶檔案佈局與工作流時
  - 您想要調整自動壓縮前的記憶寫入提示時
---

> 此文件為 [English Version](/concepts/memory_zh_TW) 的繁體中文版本。

# 記憶 (Memory)

OpenClaw 的記憶是 **代理人工作區中的純 Markdown 檔案**。這些檔案是唯一的準則；模型只會「記得」那些被寫入磁碟的內容。

## 記憶檔案 (Markdown)

預設的工作區佈局使用兩層記憶結構：

- `memory/YYYY-MM-DD.md`
  - 每日日誌（僅限追加內容）。
  - 在工作階段開始時，代理人會讀取「今天」與「昨天」的內容。
- `MEMORY.md` (選用)
  - 經過整理的長期記憶。
  - **僅在主工作階段中載入**（絕不在群組對話中載入）。

## 何時寫入記憶

- 決策、偏好設定與持久性的事實應寫入 `MEMORY.md`。
- 日常筆記與執行中的上下文應寫入 `memory/YYYY-MM-DD.md`。
- **提示**：如果您希望助理牢記某件事，請直接 **要求助理將其寫入記憶**。

## 自動記憶寫入 (Automatic memory flush)

當工作階段 **接近自動壓縮 (Auto-compaction) 閾值** 時，OpenClaw 會觸發一個 **沈默的代理人回合**，提醒模型在內容被壓縮 **之前** 將持久性記憶寫入磁碟。這能確保重要的背景資訊不會因為對話過長而被遺忘。

## 向量記憶搜尋 (Vector memory search)

OpenClaw 可以針對 `MEMORY.md` 與 `memory/*.md` 建立小型向量索引，即使措辭不同，也能透過語義查詢找到相關筆記。

- **預設行為**：自動監看檔案變更並更新索引。
- **嵌入模型 (Embeddings)**：支援本地端 (Llama-cpp) 或雲端 (Gemini, OpenAI, Voyage)。
- **混合搜尋 (Hybrid search)**：結合 **向量相似度** 與 **BM25 關鍵字相關性**（例如 ID、環境變數、程式碼符號），提供更精確的搜尋結果。

## QMD 後端 (實驗性)
您可以將 `memory.backend` 設為 `"qmd"`，使用 [QMD](https://github.com/tobi/qmd) 作為搜尋側掛程式。它具備更強大的混合搜尋與重排序能力。

## 相關工具
- `memory_search`：執行語義搜尋，回傳包含檔案與行號範圍的片段。
- `memory_get`：根據路徑讀取特定記憶檔案內容。
