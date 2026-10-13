# Copilot Proxy (OpenClaw 外掛程式)

針對 **Copilot Proxy** VS Code 擴充功能的提供者外掛程式。

## 啟用

內建外掛程式預設為停用。啟用此功能：

```bash
openclaw plugins enable copilot-proxy
```

啟用後請重啟閘道器 (Gateway)。

## 驗證

```bash
openclaw models auth login --provider copilot-proxy --set-default
```

## 注意事項

- Copilot Proxy 必須正在 VS Code 中執行。
- 基礎 URL (Base URL) 必須包含 `/v1`。
