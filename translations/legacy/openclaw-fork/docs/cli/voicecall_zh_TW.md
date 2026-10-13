---
summary: "`openclaw voicecall` (語音通話外掛程式指令) 的 CLI 參考資料"
read_when:
  - 您正在使用語音通話 (voice-call) 外掛程式且需要 CLI 入口點時
  - 您需要 `voicecall call|continue|status|tail|expose` 的快速範例時
title: "voicecall"
---

> 此文件為 [English Version](/cli/voicecall_zh_TW) 的繁體中文版本。

# `openclaw voicecall`

`voicecall` 是由外掛程式提供的指令。僅在安裝並啟動語音通話外掛程式後才會顯示。

## 相關資訊：
- 語音通話外掛程式說明：[語音通話 (Voice Call)](/plugins/voice-call_zh_TW)

## 常用指令

```bash
openclaw voicecall status --call-id <ID> (查看狀態)
openclaw voicecall call --to "+15555550123" --message "您好" --mode notify (撥打電話)
openclaw voicecall continue --call-id <ID> --message "還有問題嗎？" (繼續對話)
openclaw voicecall end --call-id <ID> (結束通話)
```

## 公開 Webhooks (透過 Tailscale)

```bash
openclaw voicecall expose --mode serve
openclaw voicecall expose --mode funnel
openclaw voicecall unexpose (取消公開)
```

**安全性注意**：僅向您信任的網路公開 Webhook 端點。在可能的情況下，優先選擇使用 Tailscale Serve 而非 Funnel。
