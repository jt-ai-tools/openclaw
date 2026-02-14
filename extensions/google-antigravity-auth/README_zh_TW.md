# Google Antigravity 驗證 (OpenClaw 外掛程式)

針對 **Google Antigravity** (Cloud Code Assist) 的 OAuth 提供者外掛程式。

## 啟用

內建外掛程式預設為停用。啟用此功能：

```bash
openclaw plugins enable google-antigravity-auth
```

啟用後請重啟閘道器 (Gateway)。

## 驗證

```bash
openclaw models auth login --provider google-antigravity --set-default
```

## 注意事項

- Antigravity 使用 Google Cloud 專案額度 (Project quotas)。
- 如果請求失敗，請確保已啟用 Gemini for Google Cloud。
