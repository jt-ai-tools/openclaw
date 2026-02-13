---
title: "參與威脅模型貢獻"
summary: "如何參與 OpenClaw 威脅模型的維護與改進"
---

> 此文件為 [English Version](/security/CONTRIBUTING-THREAT-MODEL) 的繁體中文版本。

# 參與 OpenClaw 威脅模型貢獻

感謝您協助讓 OpenClaw 變得更安全。此威脅模型是一份動態文件，我們歡迎任何人的貢獻 —— 您不需要是資安專家也能參與。

## 貢獻方式

### 新增威脅項目 (Add a Threat)

發現了我們尚未涵蓋的攻擊向量或風險嗎？請在 [openclaw/trust](https://github.com/openclaw/trust/issues) 開啟一個 Issue，並用您自己的語言描述它。您不需要瞭解任何資安框架或填寫所有欄位 —— 只要描述該情境即可。

**建議包含的資訊（非必填）：**

- 攻擊情境及其可能的利用方式
- 受影響的 OpenClaw 組件（CLI、閘道器、頻道、ClawHub、MCP 伺服器等）
- 您認為的嚴重程度（低 / 中 / 高 / 極高）
- 任何相關研究、CVE 或真實案例的連結

我們會在審核期間處理 ATLAS 框架的映射、威脅 ID 與風險評估。如果您想提供這些細節也很好，但並非必要。

> **注意：此處僅用於充實威脅模型，而非報告現有的漏洞。** 如果您發現了可被利用的漏洞，請參閱我們的 [信任頁面 (Trust page)](https://trust.openclaw.ai) 瞭解負責任的披露程序。

### 建議緩解措施 (Suggest a Mitigation)

對於如何解決現有的威脅有想法嗎？請開啟 Issue 或 PR 並引用該威脅。有效的緩解措施應具備具體性與可執行性 —— 例如，「在閘道器端對每個傳送者限制每分鐘 10 則訊息」比「實作頻率限制」更好。

### 提議攻擊鏈 (Propose an Attack Chain)

攻擊鏈展示了多個威脅如何結合成一個真實的攻擊情境。如果您看到某種危險的組合，請描述其步驟以及攻擊者如何將它們串聯起來。一段關於攻擊如何實際展開的簡短情境敘述，比正式的範本更有價值。

### 修正或改進現有內容

歡迎提交 PR 來修正錯字、釐清說明、更新過時資訊或提供更好的範例，無需事先開啟 Issue。

## 我們使用的工具

### MITRE ATLAS

本威脅模型建立於 [MITRE ATLAS](https://atlas.mitre.org/) 之上，這是一個專為 AI/ML 威脅（如提示詞注入、工具誤用與代理人漏洞利用）設計的框架。您不需要瞭解 ATLAS 也能貢獻 —— 我們會在審核時將您的提案映射至該框架。

### 威脅 ID (Threat IDs)

每個威脅都會獲得一個如 `T-EXEC-003` 的 ID。分類如下：

| 代碼 | 分類 | 說明 |
| ------- | ------------------------------------------ | ---------------------------------------- |
| RECON | Reconnaissance | 偵查 - 資訊蒐集 |
| ACCESS | Initial access | 初始存取 - 獲取進入權限 |
| EXEC | Execution | 執行 - 執行惡意動作 |
| PERSIST | Persistence | 持久化 - 維持存取權限 |
| EVADE | Defense evasion | 規避防禦 - 避免被偵測 |
| DISC | Discovery | 發現 - 瞭解環境資訊 |
| EXFIL | Exfiltration | 竊取/外洩 - 竊取數據 |
| IMPACT | Impact | 影響 - 破壞或中斷服務 |

ID 會由維護者在審核期間分配，您不需要自行挑選。

### 風險等級 (Risk Levels)

| 等級 | 意義 |
| ------------ | ----------------------------------------------------------------- |
| **極高 (Critical)** | 整個系統遭入侵，或發生可能性極高 + 影響極大 |
| **高 (High)** | 可能造成重大損害，或發生可能性中等 + 影響極大 |
| **中 (Medium)** | 中度風險，或發生可能性低 + 影響大 |
| **低 (Low)** | 發生可能性低且影響有限 |

如果您不確定風險等級，只需描述其影響，我們會進行評估。

## 審核流程

1. **分流 (Triage)** — 我們會在 48 小時內審閱新的提案。
2. **評估 (Assessment)** — 驗證可行性、分配 ATLAS 映射與威脅 ID，並確認風險等級。
3. **文件化 (Documentation)** — 確保格式正確且資訊完整。
4. **合併 (Merge)** — 加入威脅模型與視覺化圖表中。

## 相關資源

- [ATLAS 官方網站](https://atlas.mitre.org/)
- [ATLAS 技術列表](https://atlas.mitre.org/techniques/)
- [ATLAS 個案研究](https://atlas.mitre.org/studies/)
- [OpenClaw 威脅模型](./THREAT-MODEL-ATLAS_zh_TW.md)

## 聯絡方式

- **安全性漏洞：** 請參閱我們的 [信任頁面](https://trust.openclaw.ai) 以獲取報告說明。
- **威脅模型疑問：** 在 [openclaw/trust](https://github.com/openclaw/trust/issues) 開啟 Issue。
- **一般討論：** Discord #security 頻道。

## 貢獻致謝

威脅模型的貢獻者將會在致謝清單、發佈說明中獲得表彰；重大貢獻者將列入 OpenClaw 安全性名人堂 (Hall of Fame)。
