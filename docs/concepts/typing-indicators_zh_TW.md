---
summary: "OpenClaw 何時顯示輸入指示器以及如何調整它們"
read_when:
  - 更改輸入指示器行為或預設值時
title: "輸入指示器"
---

> 此文件為 [English Version](/concepts/typing-indicators_zh_TW) 的繁體中文版本。

# 輸入指示器 (Typing indicators)

當執行 (Run) 處於活動狀態時，輸入指示器會被發送至通訊頻道。使用 `agents.defaults.typingMode` 來控制 **何時** 開始顯示正在輸入，並使用 `typingIntervalSeconds` 來控制重新整理的 **頻率**。

## 預設行為

當 `agents.defaults.typingMode` **未設定** 時，OpenClaw 會保持舊有行為：

- **私訊 (Direct chats)**：一旦模型迴圈 (Model loop) 開始，立即顯示正在輸入。
- **提及標記的群組對談 (Group chats with a mention)**：立即顯示正在輸入。
- **無提及標記的群組對談 (Group chats without a mention)**：僅在訊息文字開始串流時才顯示正在輸入。
- **心跳執行 (Heartbeat runs)**：停用輸入指示器。

## 模式

將 `agents.defaults.typingMode` 設定為以下之一：

- `never` — 永不顯示輸入指示器。
- `instant` — **一旦模型迴圈開始** 立即顯示正在輸入，即使稍後執行僅回傳靜默回應權杖 (Silent reply token)。
- `thinking` — 在 **第一個推理增量 (Reasoning delta)** 出現時開始顯示正在輸入（執行需設定 `reasoningLevel: "stream"`）。
- `message` — 在 **第一個非靜默文字增量** 出現時開始顯示正在輸入（忽略 `NO_REPLY` 靜默權杖）。

「觸發時機早晚」排序：
`never` → `message` → `thinking` → `instant`

## 組態設定

```json5
{
  agent: {
    typingMode: "thinking",
    typingIntervalSeconds: 6,
  },
}
```

您可以針對每個工作階段 (Session) 覆寫模式或步調：

```json5
{
  session: {
    typingMode: "message",
    typingIntervalSeconds: 4,
  },
}
```

## 注意事項

- `message` 模式不會針對僅有靜默回應的請求顯示正在輸入（例如用於抑制輸出的 `NO_REPLY` 權杖）。
- `thinking` 僅在執行串流推理時觸發（`reasoningLevel: "stream"`）。如果模型沒有發出推理增量，則不會開始顯示正在輸入。
- 無論處於何種模式，心跳執行 (Heartbeats) 都不會顯示正在輸入。
- `typingIntervalSeconds` 控制的是 **重新整理頻率**，而非開始時間。預設值為 6 秒。
