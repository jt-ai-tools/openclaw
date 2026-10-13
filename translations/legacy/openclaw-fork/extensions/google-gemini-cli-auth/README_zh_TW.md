# Google Gemini CLI 驗證 (OpenClaw 外掛程式)

針對 **Gemini CLI** (Google Code Assist) 的 OAuth 提供者外掛程式。

## 啟用

內建外掛程式預設為停用。啟用此功能：

```bash
openclaw plugins enable google-gemini-cli-auth
```

啟用後請重啟閘道器 (Gateway)。

## 驗證

```bash
openclaw models auth login --provider google-gemini-cli --set-default
```

## 要求 (Requirements)

需要安裝 Gemini CLI（憑證將會被自動擷取）：

```bash
brew install gemini-cli
# 或：npm install -g @google/gemini-cli
```

## 環境變數 (選填)

使用以下變數覆寫自動偵測到的憑證：

- `OPENCLAW_GEMINI_OAUTH_CLIENT_ID` / `GEMINI_CLI_OAUTH_CLIENT_ID`
- `OPENCLAW_GEMINI_OAUTH_CLIENT_SECRET` / `GEMINI_CLI_OAUTH_CLIENT_SECRET`
