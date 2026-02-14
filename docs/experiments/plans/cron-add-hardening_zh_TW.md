---
summary: "強化 cron.add 輸入處理、對齊 Schema 並改進 Cron UI 與代理人工具說明"
title: "Cron Add 強化計畫"
---

> 此文件為 [English Version](/experiments/plans/cron-add-hardening_zh_TW) 的繁體中文版本。

# Cron Add 強化與 Schema 對齊計畫

## 背景資訊
最近的閘道器日誌顯示，`cron.add` 頻繁因為參數無效（缺少必要欄位或格式錯誤）而失敗。這顯示客戶端（特別是代理人工具呼叫路徑）正在發送封裝不當或不完整的任務酬載。此外，TypeScript 定義、閘道器 Schema、CLI 旗標與 UI 表單之間的列舉值存在不一致的情況。

## 核心目標
- **減少無效請求**：透過標準化封裝酬載與推導缺少的 `kind` 欄位，停止 `cron.add` 的錯誤洗版。
- **對齊供應商清單**：統一各個介面中的通訊頻道供應商列表。
- **明確工具 Schema**：讓代理人工具的 Schema 更加明確，引導 LLM 產生正確的任務酬載。
- **修復 UI 顯示**：修正控制介面中 Cron 狀態的任務計數顯示。

## 執行成果
- `cron.add` 與 `cron.update` 現在會自動拆解常見的封裝格式，並推導缺少的類型欄位。
- 代理人 Cron 工具的 Schema 已與閘道器同步，大幅減少了無效酬載。
- 各介面間的頻道列舉值已達成一致。
- 控制介面現在能正確顯示任務總數。

## 相關連結
- [排程任務 (Cron jobs)](/automation/cron-jobs_zh_TW)
