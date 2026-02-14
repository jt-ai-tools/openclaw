# MiniMax OAuth (OpenClaw 外掛程式)

針對 **MiniMax** (OAuth) 的 OAuth 提供者外掛程式。

## 啟用

內建外掛程式預設為停用。啟用此功能：

```bash
openclaw plugins enable minimax-portal-auth
```

啟用後請重啟閘道器 (Gateway)：

```bash
openclaw gateway restart
```

## 驗證

```bash
openclaw models auth login --provider minimax-portal --set-default
```

系統會提示您選擇端點 (Endpoint)：

- **Global** - 國際使用者，針對海外存取進行優化 (`api.minimax.io`)
- **China** - 針對中國使用者進行優化 (`api.minimaxi.com`)

## 注意事項

- MiniMax OAuth 使用使用者代碼 (User-code) 登入流程。
- 目前 OAuth 登入僅支援程式碼方案 (Coding plan)。
