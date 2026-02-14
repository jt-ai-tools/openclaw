---
summary: Node + tsx "__name is not a function" 崩潰紀錄與解決方案說明
read_when:
  - 偵錯僅限 Node 的開發腳本或監看模式失敗時
  - 研究 OpenClaw 中的 tsx/esbuild 載入器崩潰問題時
title: "Node + tsx 崩潰"
---

> 此文件為 [English Version](/debug/node-issue_zh_TW) 的繁體中文版本。

# Node + tsx "\_\_name is not a function" 崩潰紀錄

## 問題摘要

使用 `tsx` 執行 OpenClaw 會在啟動時失敗並報錯：
`TypeError: __name is not a function`

此問題發生在將開發腳本從 Bun 切換至 `tsx` 之後。相同的執行路徑在 Bun 之下運作正常。

## 環境資訊
- **Node**: v25.x (已知於 v25.3.0 發生)
- **tsx**: 4.21.0
- **作業系統**: macOS (其它平台亦可能重現)

## 原因分析
- `tsx` 使用 esbuild 轉換 TS/ESM。esbuild 的 `keepNames` 功能會產生一個 `__name` 輔助函數。
- 崩潰訊息顯示 `__name` 在執行時期存在但不是函數，暗示輔助函數在 Node 25 的載入路徑中遺失或被覆寫。

## 臨時解決方案
- **使用 Bun** 執行開發腳本（目前已暫時還原此設定）。
- **使用 Node + tsc watch**，然後執行編譯後的產出物：
  ```bash
  pnpm exec tsc --watch
  node --watch openclaw.mjs status
  ```
- 已確認 `pnpm exec tsc` 編譯後的版本在 Node 25 上運作正常。

## 後續步驟
- 在 Node 22/24 LTS 上測試以確認是否為 Node 25 專屬問題。
- 若 LTS 版本亦發生此問題，將向上游提交最簡重現案例 (Minimal repro)。
