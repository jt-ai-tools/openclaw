# ClawDock —— Docker 輔助工具

別再手打 `docker-compose` 了。只需輸入 `clawdock-start`。

## 快速入門

**安裝：**
```bash
mkdir -p ~/.clawdock && curl -sL https://raw.githubusercontent.com/openclaw/openclaw/main/scripts/shell-helpers/clawdock-helpers.sh -o ~/.clawdock/clawdock-helpers.sh
```
將其加入您的 Shell 設定檔：
```bash
echo 'source ~/.clawdock/clawdock-helpers.sh' >> ~/.zshrc && source ~/.zshrc
```

**第一次設定：**
```bash
clawdock-start (啟動)
clawdock-fix-token (修復權杖)
clawdock-dashboard (開啟儀表板)
```

## 可用指令

### 基礎操作
- `clawdock-start`：啟動閘道器。
- `clawdock-stop`：停止閘道器。
- `clawdock-restart`：重啟閘道器。
- `clawdock-status`：檢查容器狀態。
- `clawdock-logs`：查看即時日誌。

### 容器存取
- `clawdock-shell`：進入閘道器容器的互動式 Shell。
- `clawdock-cli <指令>`：執行 OpenClaw CLI 指令。

### 網頁 UI 與裝置
- `clawdock-dashboard`：開啟具備驗證資訊的瀏覽器 UI。
- `clawdock-devices`：列出裝置配對請求。
- `clawdock-approve <ID>`：核准配對請求。

## 常見工作流

**設定 WhatsApp 機器人：**
1. 進入容器：`clawdock-shell`。
2. 執行登入：`openclaw channels login --channel whatsapp`。
3. 掃描 QR Code。

**修復權杖不符問題：**
若看到權杖錯誤，請執行 `clawdock-fix-token`。它會從 `.env` 讀取權杖並自動配置。
