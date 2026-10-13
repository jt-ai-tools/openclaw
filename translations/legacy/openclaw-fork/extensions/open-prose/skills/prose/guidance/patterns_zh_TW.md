---
role: best-practices
summary: "設計穩健、高效且易於維護的 OpenProse 程式的設計模式說明。"
read_when:
  - 撰寫新程式或審查現有程式時
---

> 此文件為 [English Version](../patterns) 的繁體中文版本。

# OpenProse 設計模式 (Design Patterns)

本文件編錄了編排 AI 代理人的成熟模式。每個模式都針對特定需求：穩健性、成本效益、速度或自我改進能力。

---

## 結構化模式 (Structural Patterns)

#### 並行獨立工作 (parallel-independent-work)
當任務之間沒有數據依賴關係時，同時執行它們以最大化吞吐量。

#### 分散-彙整 (fan-out-fan-in)
處理集合數據時，分散至多個並行工作者，最後再收集結果。

#### 代理人專業化 (agent-specialization)
定義具備專業領域知識的代理人（如安全審查員、效能工程師），其結果優於通用提示詞。

---

## 穩健性模式 (Robustness Patterns)

#### 有界迭代 (bounded-iteration)
一律使用 `max:` 限制迴圈次數，防止無限執行。

#### 錯誤上下文擷取 (error-context-capture)
擷取錯誤上下文以進行智慧修復或診斷。

#### 防禦性檢查 (defensive-context)
在執行昂貴操作前，先驗證前提條件（如 API 密鑰、權限）。

---

## 成本效益模式 (Cost Efficiency Patterns)

#### 模型分層 (model-tiering)
根據任務複雜度匹配模型能力：
- **Sonnet 4.5**：編排、路由、結構化分析。
- **Opus 4.5**：艱巨的推理、策略決策、創新解決問題。
- **Haiku**：簡單的格式化、分類、摘要。

#### 上下文最小化 (context-minimization)
僅傳遞必要的上下文，減少 Token 消耗並提升處理速度。

---

## 自我改進模式 (Self-Improvement Patterns)

#### 提示詞內建自我驗證 (self-verification-in-prompt)
在提示詞末尾加入驗證步驟，減少往返次數同時保持嚴謹。

#### 多維度審查 (multi-perspective-review)
在彙整結果前，先從不同角度（如使用者、技術、商業）獲取回饋。

---

## 維護性模式 (Maintainability Patterns)

#### 具備描述性的代理人名稱 (descriptive-agent-names)
根據角色命名（如 `code-reviewer`），而非實作方式（如 `opus-agent`）。

#### 職責分離 (separation-of-concerns)
每個工作階段應專注於做好一件事。透過組合簡單的工作階段來完成複雜任務。
