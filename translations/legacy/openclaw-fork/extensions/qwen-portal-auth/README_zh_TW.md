# Qwen OAuth (OpenClaw 外掛程式)

針對 **Qwen** (免費版 OAuth) 的 OAuth 提供者外掛程式。

## 啟用

內建外掛程式預設為停用。啟用此功能：

```bash
openclaw plugins enable qwen-portal-auth
```

啟用後請重啟閘道器 (Gateway)。

## 驗證

```bash
openclaw models auth login --provider qwen-portal --set-default
```

## 注意事項

- Qwen OAuth 使用裝置代碼 (Device-code) 登入流程。
- 權杖 (Tokens) 會自動重新整理；若重新整理失敗或存取權限被撤銷，請重新執行登入。
