# 畫布技能 (Canvas Skill)

在連線的 OpenClaw 節點（Mac App, iOS, Android）上顯示 HTML 內容。

## 概觀

畫布工具讓您可以在任何連線節點的畫布視圖中呈現網頁內容。非常適合：

- 顯示遊戲、可視化圖表、儀表板。
- 顯示生成的 HTML 內容。
- 互動式展示。

## 工作原理

### 架構圖

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  畫布主機        │────▶│   節點橋接器      │────▶│  節點 App    │
│  (HTTP 伺服器)   │     │  (TCP 伺服器)    │     │ (Mac/iOS/   │
│  連接埠 18793    │     │  連接埠 18790    │     │  Android)   │
└─────────────────┘     └──────────────────┘     └─────────────┘
```

1. **畫布主機伺服器 (Canvas Host Server)**：從 `canvasHost.root` 目錄提供靜態 HTML/CSS/JS 檔案。
2. **節點橋接器 (Node Bridge)**：將畫布 URL 傳遞給連線的節點。
3. **節點 App**：在 WebView 中渲染內容。

### Tailscale 整合

畫布主機伺服器的繫結位址取決於 `gateway.bind` 設定：

| 繫結模式 (Bind) | 伺服器繫結至         | 畫布 URL 使用的位址        |
| --------------- | ------------------- | -------------------------- |
| `loopback`      | 127.0.0.1           | localhost（僅限本地）      |
| `lan`           | 區域網路介面         | 區域網路 IP 位址           |
| `tailnet`       | Tailscale 介面      | Tailscale 主機名稱         |
| `auto`          | 最佳可用位址         | Tailscale > LAN > loopback |

**關鍵見解：** 節點接收到的 URL 會根據橋接器的位址產生。若繫結至 Tailscale，節點會收到如下的 URL：
`http://<tailscale-主機名稱>:18793/__openclaw__/canvas/<檔案>.html`
這就是為什麼 localhost URL 無法運作的原因 —— 節點是透過橋接器接收來自 Tailscale 的主機名稱！

## 動作 (Actions)

| 動作       | 說明                                 |
| ---------- | ------------------------------------ |
| `present`  | 顯示畫布，可帶入選用的目標 URL        |
| `hide`     | 隱藏畫布                             |
| `navigate` | 導覽至新的 URL                       |
| `eval`     | 在畫布中執行 JavaScript              |
| `snapshot` | 擷取畫布截圖                         |

## 組態設定 (Configuration)

在 `~/.openclaw/openclaw.json` 中：

```json
{
  "canvasHost": {
    "enabled": true,
    "port": 18793,
    "root": "/Users/您/clawd/canvas",
    "liveReload": true
  },
  "gateway": {
    "bind": "auto"
  }
}
```

### 自動重新整理 (Live Reload)

當 `liveReload: true`（預設值）時，畫布主機會：
- 監看根目錄的變更。
- 向 HTML 檔案注入 WebSocket 客戶端。
- 當檔案變更時自動重新整理連線的畫布。

## 工作流程

### 1. 建立 HTML 內容
將檔案放入畫布根目錄（預設為 `~/clawd/canvas/`）。

### 2. 尋找您的畫布主機 URL
檢查您的閘道器繫結方式：
`cat ~/.openclaw/openclaw.json | jq '.gateway.bind'`

然後建構 URL：
- **loopback**: `http://127.0.0.1:18793/__openclaw__/canvas/<檔案>.html`
- **lan/tailnet/auto**: `http://<主機名稱>:18793/__openclaw__/canvas/<檔案>.html`

### 3. 尋找連線的節點
執行 `openclaw nodes list` 尋找具備畫布功能的節點。

### 4. 呈現內容 (Present)
指令範例：
`canvas action:present node:<節點ID> target:<完整URL>`

## 疑難排解 (Debugging)

### 白屏 / 內容未載入
**原因：** 伺服器繫結位址與節點預期不符。
**檢查步驟：**
1. 檢查 `gateway.bind` 設定。
2. 檢查畫布連接埠：`lsof -i :18793`。
3. 直接測試 URL：`curl http://<主機名稱>:18793/__openclaw__/canvas/<檔案>.html`。
**解決方案：** 使用符合您繫結模式的完整主機名稱，而非 localhost。

## URL 路徑結構
畫布主機提供以 `/__openclaw__/canvas/` 為前綴的服務：
`http://<host>:18793/__openclaw__/canvas/index.html` → 對應至 `~/clawd/canvas/index.html`
