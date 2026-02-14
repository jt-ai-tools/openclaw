---
summary: "模型驗證方式說明：OAuth、API 密鑰與 setup-token"
read_when:
  - 偵錯模型驗證或 OAuth 到期問題時
  - 記錄驗證方式或憑證儲存位置時
title: "驗證"
---

> 此文件為 [English Version](/gateway/authentication_zh_TW) 的繁體中文版本。

# 驗證 (Authentication)

OpenClaw 支援模型提供者的 OAuth 與 API 密鑰驗證。對於 Anthropic 帳號，我們建議使用 **API 密鑰 (API key)**。若要使用 Claude 訂閱版權限，請使用透過 `claude setup-token` 產生的長期效期 Token。

完整 OAuth 流程與儲存佈局請參閱 [/concepts/oauth](/concepts/oauth_zh_TW)。

## 建議的 Anthropic 設定 (使用 API 密鑰)

如果您直接使用 Anthropic 的服務，建議使用 API 密鑰。

1. 在 Anthropic Console 中建立 API 密鑰。
2. 將密鑰放在 **閘道器主機**（執行 `openclaw gateway` 的機器）上。

```bash
export ANTHROPIC_API_KEY="..."
openclaw models status
```

3. 如果閘道器以 systemd/launchd 服務執行，建議將密鑰存放在 `~/.openclaw/.env` 中，以便守護行程讀取：

```bash
cat >> ~/.openclaw/.env <<'EOF'
ANTHROPIC_API_KEY=...
EOF
```

接著重啟守護行程（或重啟您的閘道器程序）並再次檢查：

```bash
openclaw models status
openclaw doctor
```

如果您不想手動管理環境變數，引導精靈可以代為儲存供守護行程使用的 API 密鑰：`openclaw onboard`。

關於環境變數繼承的細節（`env.shellEnv`, `~/.openclaw/.env`, systemd/launchd），請參閱 [說明](/help_zh_TW)。

## Anthropic：setup-token (訂閱版驗證)

對於 Anthropic，建議的路徑是 **API 密鑰**。如果您使用的是 Claude 訂閱版，系統也支援 setup-token 流程。請在 **閘道器主機** 上執行：

```bash
claude setup-token
```

接著將其貼入 OpenClaw：

```bash
openclaw models auth setup-token --provider anthropic
```

如果 Token 是在另一台機器上建立的，請手動貼上：

```bash
openclaw models auth paste-token --provider anthropic
```

如果您看到如下的 Anthropic 錯誤：

```
This credential is only authorized for use with Claude Code and cannot be used for other API requests.
```

…請改用 Anthropic API 密鑰。

手動輸入 Token（適用於任何提供者；會寫入 `auth-profiles.json` 並更新組態）：

```bash
openclaw models auth paste-token --provider anthropic
openclaw models auth paste-token --provider openrouter
```

適用於自動化流程的檢查（若過期/缺失則結束代碼為 `1`，即將過期則為 `2`）：

```bash
openclaw models status --check
```

選用的維運指令稿（systemd/Termux）記錄於此：
[/automation/auth-monitoring](/automation/auth-monitoring_zh_TW)

> `claude setup-token` 需要互動式 TTY 環境。

## 檢查模型驗證狀態

```bash
openclaw models status
openclaw doctor
```

## 控制使用的憑證

### 針對單次對談 (聊天指令)

使用 `/model <別名或ID>@<設定檔ID>` 為目前會話固定使用特定的提供者憑證（例如設定檔 ID：`anthropic:default`, `anthropic:work`）。

使用 `/model`（或 `/model list`）開啟精簡的選擇器；使用 `/model status` 查看完整資訊（包含候選清單、下一個驗證設定檔，以及已配置的提供者端點細節）。

### 針對個別代理人 (CLI 覆寫)

為特定代理人設定明確的驗證設定檔順序（儲存在該代理人的 `auth-profiles.json` 中）：

```bash
openclaw models auth order get --provider anthropic
openclaw models auth order set --provider anthropic anthropic:default
openclaw models auth order clear --provider anthropic
```

使用 `--agent <id>` 指定特定代理人；若省略則使用設定的預設代理人。

## 故障排除

### 「找不到憑證 (No credentials found)」

如果缺失 Anthropic Token 設定檔，請在 **閘道器主機** 上執行 `claude setup-token`，然後再次檢查：

```bash
openclaw models status
```

### Token 即將過期或已過期

執行 `openclaw models status` 確認哪個設定檔即將過期。如果設定檔遺失，請重新執行 `claude setup-token` 並再次貼上 Token。

## 前置要求

- Claude Max 或 Pro 訂閱版（用於 `claude setup-token`）
- 已安裝 Claude Code CLI（可執行 `claude` 指令）
