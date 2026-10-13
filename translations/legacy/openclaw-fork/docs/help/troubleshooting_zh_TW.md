---
summary: "OpenClaw 故障排除中心：以現象為主的快速修復指南"
read_when:
  - OpenClaw 無法運作且您需要最快路徑尋找修復方案時
  - 您在深入研究手冊前需要一個分診流程時
title: "故障排除"
---

> 此文件為 [English Version](/help/troubleshooting_zh_TW) 的繁體中文版本。

# 故障排除 (Troubleshooting)

如果您只有兩分鐘，請將此頁面作為問題診斷的第一站。

## 診斷指令階梯

請依序執行以下指令：
```bash
openclaw status
openclaw gateway status
openclaw doctor
openclaw channels status --probe
openclaw logs --follow
```

**良好狀態的特徵：**
- `status`：配置的頻道皆正常顯示，無明顯驗證錯誤。
- `gateway status`：顯示 `Runtime: running` 且 `RPC probe: ok`。
- `doctor`：無封鎖性的組態或服務錯誤。
- `channels status --probe`：頻道回報 `connected` 或 `ready`。

## 問題決策樹

根據您的問題現象，展開下方對應的章節：

- **完全沒有回覆**：檢查頻道探針與允許清單（`openclaw pairing list`）。
- **儀表板無法連線**：檢查閘道器權杖與驗證模式。
- **閘道器無法啟動**：確認 `gateway.mode` 設為 `local` 且連接埠未被占用。
- **排程任務未執行**：檢查 `cron status` 與時區設定。
- **節點工具失敗（相機/螢幕）**：確認權限已授予，且 App 處於前台執行。
- **瀏覽器工具失敗**：檢查執行檔路徑或擴充功能是否已附加。
