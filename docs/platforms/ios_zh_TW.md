---
summary: "iOS 節點 App：連接閘道器、配對流程、畫布功能與疑難排解"
read_when:
  - 配對或重新連線 iOS 節點時
  - 偵錯閘道器探索或畫布指令時
title: "iOS App"
---

> 此文件為 [English Version](/platforms/ios_zh_TW) 的繁體中文版本。

# iOS App (節點)

目前狀態：內部預覽版。iOS App 尚未公開發佈。

## 功能特色

- 透過 WebSocket 連接至閘道器 (LAN 或 Tailnet)。
- 提供節點能力：畫布 (Canvas)、螢幕快照、相機擷取、位置獲取、對話模式、語音喚醒。
- 接收 `node.invoke` 指令並回報狀態事件。

## 快速開始（配對與連線）

1. **啟動閘道器 (Gateway)**：
```bash
openclaw gateway --port 18789
```

2. 在 iOS App 中開啟「設定 (Settings)」，挑選已發現的閘道器（或啟用「手動主機 Manual Host」並輸入位址）。

3. 在閘道器主機上核准配對請求：
```bash
openclaw nodes pending
openclaw nodes approve <請求ID>
```

4. 驗證連線：
```bash
openclaw nodes status
```

## 畫布與 A2UI

iOS 節點會渲染一個 WKWebView 畫布。使用 `node.invoke` 進行驅動。

指令範例：
```bash
openclaw nodes invoke --node "iOS Node" --command canvas.navigate --params '{"url":"http://<閘道器主機>:18793/__openclaw__/canvas/"}'
```

## 語音功能

- 「語音喚醒」與「對話模式」可在設定中開啟。
- iOS 可能會暫停背景音訊；當 App 不在活動狀態時，請將語音功能視為「盡力而為」。

## 常見錯誤

- `NODE_BACKGROUND_UNAVAILABLE`：請將 iOS App 切換至前台（畫布、相機、螢幕指令需要前台執行）。
- `A2UI_HOST_NOT_CONFIGURED`：閘道器未宣告畫布主機 URL。
- 配對提示未出現：請執行 `openclaw nodes pending` 手動核准。
