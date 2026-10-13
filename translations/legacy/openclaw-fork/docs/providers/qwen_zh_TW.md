---
summary: "在 OpenClaw 中使用 Qwen OAuth (免費版)"
read_when:
  - 您想要在 OpenClaw 中使用 Qwen 時
  - 您想要透過免費的 OAuth 方式存取 Qwen Coder 時
title: "Qwen"
---

> 此文件為 [English Version](/providers/qwen_zh_TW) 的繁體中文版本。

# Qwen

Qwen 為 Qwen Coder 與 Qwen Vision 模型提供免費的 OAuth 驗證流程（每日 2,000 次請求，受 Qwen 速率限制約束）。

## 啟用外掛程式

```bash
openclaw plugins enable qwen-portal-auth
```

啟用後請重啟閘道器 (Gateway)。

## 進行驗證

```bash
openclaw models auth login --provider qwen-portal --set-default
```

這會執行 Qwen 裝置代碼 (Device-code) OAuth 流程，並將提供者資訊寫入您的 `models.json`（同時建立一個用於快速切換的 `qwen` 別名）。

## 模型 ID

- `qwen-portal/coder-model`
- `qwen-portal/vision-model`

使用以下指令切換模型：

```bash
openclaw models set qwen-portal/coder-model
```

## 重用 Qwen Code CLI 登入資訊

如果您已經登入過 Qwen Code CLI，OpenClaw 在載入驗證儲存庫時會自動從 `~/.qwen/oauth_creds.json` 同步憑證。您仍需在 `models.providers.qwen-portal` 中建立項目（使用上方的登入指令即可建立）。

## 注意事項

- 權杖 (Tokens) 會自動重新整理；若重新整理失敗或存取權限被撤銷，請重新執行登入指令。
- 預設基礎 URL：`https://portal.qwen.ai/v1`。
- 關於提供者的全域規則，請參閱 [模型提供者概念](/concepts/model-providers_zh_TW)。
