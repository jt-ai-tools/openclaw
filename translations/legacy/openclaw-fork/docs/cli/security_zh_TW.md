---
summary: "`openclaw security` (審計並修復常見安全隱患) 的 CLI 參考資料"
read_when:
  - 您想要對組態或狀態執行快速安全性審計時
  - 您想要套用安全的「修復」建議（如 chmod 或收緊預設值）時
title: "security"
---

> 此文件為 [English Version](/cli/security_zh_TW) 的繁體中文版本。

# `openclaw security`

安全性工具（包含審計與選用的修復功能）。

## 相關資訊：
- 安全性指南：[安全性 (Security)](/gateway/security_zh_TW)

## 安全性審計 (Audit)

```bash
openclaw security audit (快速審計)
openclaw security audit --deep (深度探測)
openclaw security audit --fix (套用安全性修復)
```

安全性審計會在以下情況發出警告：
- 當多個私訊 (DM) 傳送者共用同一個主工作階段時，會建議開啟 **安全私訊模式**：針對共享收件匣設定 `session.dmScope="per-channel-peer"`。
- 當使用小型模型 (`<=300B`) 且在啟用網頁/瀏覽器工具的情況下未使用沙箱時。
- 針對 Webhook 進入點，當 `hooks.defaultSessionKey` 未設定，或是啟用了請求 `sessionKey` 覆寫但未設定前綴限制時。
