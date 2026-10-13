---
summary: "使用 apply_patch 工具套用跨檔案的結構化補丁"
read_when:
  - 您需要對多個檔案進行結構化編輯時
  - 您想要說明或偵錯基於補丁 (Patch) 的編輯操作時
title: "apply_patch 工具"
---

> 此文件為 [English Version](/tools/apply-patch_zh_TW) 的繁體中文版本。

# apply_patch 工具 (apply_patch tool)

使用結構化補丁格式套用檔案變更。這對於涉及多個檔案或單一檔案內多處修改的編輯操作非常理想，比起多次呼叫 `edit` 工具更為穩定。

此工具接受單一 `input` 字串，其中封裝了一個或多個檔案操作：

```
*** Begin Patch
*** Add File: path/to/file.txt
+第一行內容
+第二行內容
*** Update File: src/app.ts
@@
-舊程式碼行
+新程式碼行
*** Delete File: obsolete.txt
*** End Patch
```

## 參數說明

- `input` (必填)：完整的補丁內容，包含 `*** Begin Patch` 與 `*** End Patch`。

## 注意事項

- 路徑是相對於工作區根目錄解析的。
- 在 `*** Update File:` 區塊中使用 `*** Move to:` 可重新命名檔案。
- 此工具目前為實驗性質，預設為停用。請透過 `tools.exec.applyPatch.enabled` 啟用。
- **僅限 OpenAI 模型**（包含 OpenAI Codex）使用。可選用 `tools.exec.applyPatch.allowModels` 來限制適用的模型。
- 組態設定位於 `tools.exec` 之下。
