---
summary: "使用 WebSocket 監聽程式綁定實現的閘道器單一實例守護"
read_when:
  - 執行或偵錯閘道器程序時
  - 調查單一實例強制執行機制時
title: "閘道器鎖定"
---

> 此文件為 [English Version](/gateway/gateway-lock_zh_TW) 的繁體中文版本。

# 閘道器鎖定 (Gateway lock)

最後更新日期：2025-12-11

## 為何需要

- 確保同一個主機上，每個基礎連接埠僅執行一個閘道器實例；額外的閘道器必須使用隔離的設定檔 (Profile) 與唯一的連接埠。
- 在發生崩潰或收到 `SIGKILL` 信號後仍能正常運作，且不會留下過時的鎖定檔案 (Lock files)。
- 當控制連接埠已被佔用時，提供清晰的錯誤訊息並快速失敗 (Fail fast)。

## 機制

- 閘道器在啟動時會立即透過排他性的 TCP 監聽程式，綁定 WebSocket 監聽程式（預設為 `ws://127.0.0.1:18789`）。
- 若綁定失敗且錯誤碼為 `EADDRINUSE`，啟動過程會拋出 `GatewayLockError("another gateway instance is already listening on ws://127.0.0.1:<port>")`。
- 作業系統會在任何程序結束（包括崩潰與 `SIGKILL`）時自動釋放監聽程式 —— 無需額外的鎖定檔案或清除步驟。
- 關閉時，閘道器會關閉 WebSocket 伺服器與底層的 HTTP 伺服器，以迅速釋放連接埠。

## 錯誤提示

- 若有其他程序佔用了連接埠，啟動時會拋出 `GatewayLockError("another gateway instance is already listening on ws://127.0.0.1:<port>")`。
- 其他綁定失敗則會顯示為 `GatewayLockError("failed to bind gateway socket on ws://127.0.0.1:<port>: …")`。

## 維運筆記

- 如果連接埠是被 *其他* 程式佔用，錯誤訊息是一樣的；請釋放該連接埠，或使用 `openclaw gateway --port <port>` 選擇另一個連接埠。
- macOS App 在啟動閘道器前仍會維持自有的輕量級 PID 守護機制；而執行階段的鎖定則是由 WebSocket 綁定來強制執行的。
