# @openclaw/zalouser

針對 OpenClaw 的擴充功能，透過 [zca-cli](https://zca-cli.dev) 實現 Zalo 個人帳號訊息功能。

> **警告：** 使用 Zalo 自動化可能會導致帳號被停權或封鎖。請自行承擔使用風險。這是一個非官方的整合功能。

## 功能特色

- **頻道外掛程式整合**：出現在引導設定精靈中，支援 QR Code 登入。
- **閘道器整合**：透過閘道器進行即時訊息監聽。
- **多帳號支援**：管理多個 Zalo 個人帳號。
- **CLI 指令**：提供完整的命令列介面用於傳送訊息。
- **代理人工具**：整合 AI 代理人以實現自動化訊息功能。

## 事前準備

安裝 `zca` CLI 並確保它已加入您的 PATH：

**macOS / Linux:**

```bash
curl -fsSL https://get.zca-cli.dev/install.sh | bash

# 或指定安裝目錄
ZCA_INSTALL_DIR=~/.local/bin curl -fsSL https://get.zca-cli.dev/install.sh | bash

# 安裝特定版本
curl -fsSL https://get.zca-cli.dev/install.sh | bash -s v1.0.0

# 移除安裝
curl -fsSL https://get.zca-cli.dev/install.sh | bash -s uninstall
```

**Windows (PowerShell):**

```powershell
irm https://get.zca-cli.dev/install.ps1 | iex

# 或指定安裝目錄
$env:ZCA_INSTALL_DIR = "C:\Tools\zca"; irm https://get.zca-cli.dev/install.ps1 | iex

# 安裝特定版本
iex "& { $(irm https://get.zca-cli.dev/install.ps1) } -Version v1.0.0"

# 移除安裝
iex "& { $(irm https://get.zca-cli.dev/install.ps1) } -Uninstall"
```

### 手動下載

直接下載二進位檔：

**macOS / Linux:**

```bash
curl -fsSL https://get.zca-cli.dev/latest/zca-darwin-arm64 -o zca && chmod +x zca
```

**Windows (PowerShell):**

```powershell
Invoke-WebRequest -Uri https://get.zca-cli.dev/latest/zca-windows-x64.exe -OutFile zca.exe
```

可用的二進位檔：

- `zca-darwin-arm64` - macOS Apple Silicon
- `zca-darwin-x64` - macOS Intel
- `zca-linux-arm64` - Linux ARM64
- `zca-linux-x64` - Linux x86_64
- `zca-windows-x64.exe` - Windows

請參閱 [zca-cli](https://zca-cli.dev) 進行手動下載（提供 macOS/Linux/Windows 二進位檔）或從原始碼建置。

## 快速開始

### 選項 1：引導設定精靈 (建議方式)

```bash
openclaw onboard
# 從頻道清單中選擇 "Zalo Personal"
# 遵循 QR Code 登入流程
```

### 選項 2：登入（在閘道器機器上進行 QR Code 登入）

```bash
openclaw channels login --channel zalouser
# 使用 Zalo App 掃描 QR Code
```

### 傳送訊息

```bash
openclaw message send --channel zalouser --target <threadId> --message "Hello from OpenClaw!"
```

## 組態設定 (Configuration)

完成引導設定後，您的組態將包含：

```yaml
channels:
  zalouser:
    enabled: true
    dmPolicy: pairing # pairing | allowlist | open | disabled
```

多帳號設定範例：

```yaml
channels:
  zalouser:
    enabled: true
    defaultAccount: default
    accounts:
      default:
        enabled: true
        profile: default
      work:
        enabled: true
        profile: work
```

## 指令集

### 身分驗證

```bash
openclaw channels login --channel zalouser              # 透過 QR Code 登入
openclaw channels login --channel zalouser --account work
openclaw channels status --probe
openclaw channels logout --channel zalouser
```

### 目錄 (ID, 聯絡人, 群組)

```bash
openclaw directory self --channel zalouser
openclaw directory peers list --channel zalouser --query "name"
openclaw directory groups list --channel zalouser --query "work"
openclaw directory groups members --channel zalouser --group-id <id>
```

### 帳號管理

```bash
zca account list      # 列出所有設定檔 (Profiles)
zca account current   # 顯示目前的設定檔
zca account switch <profile>
zca account remove <profile>
zca account label <profile> "工作帳號"
```

### 傳送訊息

```bash
# 文字訊息
openclaw message send --channel zalouser --target <threadId> --message "訊息內容"

# 媒體訊息 (URL)
openclaw message send --channel zalouser --target <threadId> --message "說明文字" --media-url "https://example.com/img.jpg"
```

### 監聽器 (Listener)

當頻道啟用時，監聽器會執行於閘道器內部。如需進行偵錯，請使用 `openclaw channels logs --channel zalouser` 或直接執行 `zca listen`。

### 資料存取

```bash
# 好友
zca friend list
zca friend list -j    # JSON 輸出
zca friend find "名稱"
zca friend online

# 群組
zca group list
zca group info <groupId>
zca group members <groupId>

# 個人檔案
zca me info
zca me id
```

## 多帳號支援

使用 `--profile` 或 `-p` 參數切換帳號：

```bash
openclaw channels login --channel zalouser --account work
openclaw message send --channel zalouser --account work --target <id> --message "Hello"
ZCA_PROFILE=work zca listen
```

設定檔解析順序：`--profile` 旗標 > `ZCA_PROFILE` 環境變數 > 預設值

## 代理人工具

此擴充功能為 AI 代理人註冊了 `zalouser` 工具：

```json
{
  "action": "send",
  "threadId": "123456",
  "message": "Hello from AI!",
  "isGroup": false,
  "profile": "default"
}
```

可用的動作：`send`, `image`, `link`, `friends`, `groups`, `me`, `status`

## 疑難排解

- **登入問題**：執行 `zca auth logout` 後再次執行 `zca auth login`。
- **API 錯誤**：嘗試 `zca auth cache-refresh` 或重新登入。
- **檔案上傳**：檢查檔案大小（上限 100MB）與路徑存取權限。

## 致謝

基於 [zca-cli](https://zca-cli.dev) 構建，該專案使用 [zca-js](https://github.com/RFS-ADRENO/zca-js)。
