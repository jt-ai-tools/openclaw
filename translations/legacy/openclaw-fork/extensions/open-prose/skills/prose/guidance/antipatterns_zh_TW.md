---
role: antipatterns
summary: "在 OpenProse 程式中應避免的常見錯誤與模式說明。"
---

> 此文件為 [English Version](../antipatterns) 的繁體中文版本。

# OpenProse 反模式 (Antipatterns)

本文件編錄了會導致程式脆弱、昂貴、緩慢或難以維護的模式。

---

## 結構化反模式 (Structural Antipatterns)

#### 萬能工作階段 (god-session)
單一工作階段嘗試處理過多任務。這會導致偵錯困難且結果不一致。
**修復方式**：將其拆分為多個職責明確的工作階段。

#### 應並行卻循序 (sequential-when-parallel)
將可以同時執行的獨立操作改為循序執行，浪費處理時間。
**修復方式**：使用 `parallel:` 區塊執行獨立任務。

#### 義大利麵式上下文 (spaghetti-context)
雜亂無章地傳遞上下文，導致數據流不明確。
**修復方式**：僅傳遞該步驟真正需要的依賴項。

---

## 穩健性反模式 (Robustness Antipatterns)

#### 無界迴圈 (unbounded-loop)
沒有設定最大迭代次數的迴圈。若條件始終無法滿足，程式會無止盡執行。
**修復方式**：一律指定 `max:` 參數。

#### 樂觀執行 (optimistic-execution)
假設所有操作都會成功，而沒有對可能失敗的操作進行錯誤處理。
**修復方式**：明確處理失敗情況（如 `try/catch`）。

---

## 成本反模式 (Cost Antipatterns)

#### 凡事皆用 Opus (opus-for-everything)
針對瑣碎任務（如簡單分類）也使用最昂貴的模型。
**修復方式**：根據任務複雜度匹配模型（如簡單任務使用 Haiku）。

#### 上下文膨脹 (context-bloat)
傳遞了工作階段不需要的過多上下文資訊。
**修復方式**：僅傳遞最小限度的相關上下文。

---

## 維護性反模式 (Maintainability Antipatterns)

#### 隱含依賴 (implicit-dependencies)
依賴對話歷史而非明確傳遞上下文。
**修復方式**：透過變數明確傳遞狀態。

#### 職責混雜的代理人 (mixed-concerns-agent)
提示詞涵蓋了過多職責的代理人。
**修復方式**：建立專門化的代理人（如 `security-expert`, `technical-writer`）。
