---
summary: "嚴格組態驗證與僅限於 Doctor 的遷移流程說明"
read_when:
  - 設計或實作組態驗證行為時
  - 處理組態遷移或 Doctor 工作流時
  - 處理外掛程式組態 Schema 或載入門控時
title: "嚴格組態驗證"
---

> 此文件為 [English Version](/refactor/strict-config_zh_TW) 的繁體中文版本。

# 嚴格組態驗證 (僅限於 Doctor 的遷移)

## 核心目標
- **拒絕未知的組態鍵值**：不論是根目錄或巢狀結構，一律嚴格匹配。
- **外掛程式 Schema 強制執行**：拒絕載入沒有提供 Schema 的外掛程式組態。
- **移除載入時的自動遷移**：遷移操作僅能透過 `openclaw doctor` 執行。
- **啟動時自動執行 Doctor (模擬)**：若組態無效，則封鎖非診斷類的指令。

## 嚴格驗證規則
- 組態必須在各個層級完全符合 Schema 定義。
- 外掛程式資訊清單 (`openclaw.plugin.json`) 為必填項。
- 外掛程式載入流程：
  1. 讀取清單與 Schema。
  2. 根據 Schema 驗證組態。
  3. 若缺少 Schema 或驗證失敗，則拒絕載入該外掛程式並記錄錯誤。

## Doctor 工作流
- 每次載入組態時皆會自動執行 Doctor 的模擬模式。
- 若組態無效：
  - 印出錯誤摘要與修復建議。
  - 指示執行 `openclaw doctor --fix`。
- `openclaw doctor --fix` 負責套用遷移、移除未知鍵值並寫回更新後的檔案。

## 指令門控 (無效組態時)
僅允許執行診斷類指令：
- `doctor`, `logs`, `health`, `help`, `status`
其餘所有指令皆應報錯並退出。
