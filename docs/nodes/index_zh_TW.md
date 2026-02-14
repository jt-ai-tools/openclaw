---
summary: "節點：配對、能力、權限以及用於畫布/相機/螢幕/系統的 CLI 輔助工具說明"
read_when:
  - 將 iOS/Android 節點配對至閘道器時
  - 使用節點畫布/相機為代理人提供背景資訊時
  - 新增節點指令或 CLI 輔助工具時
title: "節點概觀"
---

> 此文件為 [English Version](/nodes/index_zh_TW) 的繁體中文版本。

# 節點 (Nodes)

**節點** 是連線至 OpenClaw 閘道器 (Gateway) 的配套裝置（macOS/iOS/Android/無頭主機）。它們透過 WebSocket 以 `role: "node"` 身分連線，並透過 `node.invoke` 公開指令介面（如 `canvas.*`, `camera.*`, `system.*`）。

## 配對與狀態

節點連線時會出示裝置身分，閘道器會建立一個配對請求。您必須核准後才能使用該節點。

常用指令：
```bash
openclaw devices list (查看配對請求)
openclaw devices approve <請求ID> (核准)
openclaw nodes status (查看節點連線狀態)
```

## 遠端節點主機 (system.run)

當您的閘道器執行於 A 機器，但希望指令在 B 機器執行時，請在 B 機器啟動 **節點主機 (node host)**。

啟動指令：
```bash
openclaw node run --host <閘道器主機> --port 18789 --display-name "建置節點"
```

## 指令調用與功能

### 畫布 (Canvas)
節點可以呈現一個 WebView 畫布，支援 HTML/CSS/JS 以及 A2UI。
- `canvas.snapshot`：擷取畫布快照（回傳 base64 圖片）。
- `canvas.present`：顯示特定網址或本地路徑。

### 相機與影片
- `camera.snap`：拍攝照片 (`jpg`)。
- `camera.clip`：錄製短片 (`mp4`)。
**注意**：節點 App 必須處於 **前台執行** 狀態才能調用相機。

### 螢幕錄製
- `screen.record`：錄製螢幕畫面。

### 地理位置
- `location.get`：獲取經緯度與精確度資訊。

### 系統指令
- `system.run`：執行 Shell 指令（受到節點端 **執行核准** 檔案的門控保護）。
- `system.notify`：在節點裝置上顯示原生通知。

## 無頭節點主機 (Headless node host)
適用於 Linux/Windows 或伺服器環境，僅公開 `system.run` 與 `system.which` 能力。
```bash
openclaw node run --host <閘道器主機>
```
