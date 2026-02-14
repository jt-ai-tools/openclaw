---
summary: "用於 macOS UI 自動化的 PeekabooBridge 整合說明"
read_when:
  - 在 OpenClaw.app 中託管 PeekabooBridge 時
  - 透過 Swift Package Manager 整合 Peekaboo 時
  - 更改 PeekabooBridge 協定或路徑時
title: "Peekaboo 橋接器"
---

> 此文件為 [English Version](/platforms/mac/peekaboo_zh_TW) 的繁體中文版本。

# Peekaboo Bridge (macOS UI 自動化)

OpenClaw 可以託管 **PeekabooBridge**，作為一個本地端、具備權限感知能力的 UI 自動化經紀人。這讓 `peekaboo` CLI 可以驅動 UI 自動化，同時重用 macOS App 已獲得的 TCC 權限。

## 這是什麼 (與不是什麼)

- **主機 (Host)**：OpenClaw.app 可以充當 PeekabooBridge 的主機。
- **客戶端 (Client)**：使用 `peekaboo` CLI 指令。
- **UI**：視覺化懸浮窗功能保留在原生的 Peekaboo.app 中；OpenClaw 僅作為一個輕量級的經紀人主機。

## 啟用橋接器

在 macOS App 中：
- **設定** → **Enable Peekaboo Bridge**。

啟用後，OpenClaw 會啟動一個本地端的 UNIX Socket 伺服器。若停用，主機將停止運作，`peekaboo` 將回退至其它可用主機。

## 安全性與權限

- 橋接器會驗證 **呼叫者的代碼簽署**；系統會強制執行 TeamID 允許清單。
- 請求逾時時間約為 10 秒。
- 若缺少必要權限，橋接器會回傳明確的錯誤訊息，而不會直接跳出系統設定。

## 疑難排解

- 若 `peekaboo` 回報「bridge client is not authorized」，請確保客戶端指令已正確簽署，或在 **偵錯模式** 下使用 `PEEKABOO_ALLOW_UNSIGNED_SOCKET_CLIENTS=1` 執行主機。
- 若找不到主機，請開啟 Peekaboo.app 或 OpenClaw.app 並確認權限已授予。
