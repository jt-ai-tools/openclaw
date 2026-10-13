---
name: feishu-doc
description: |
  飛書文件讀寫操作。當使用者提到飛書文件、雲端文件或 docx 連結時激活。
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# 飛書文件工具 (Feishu Document Tool)

單一工具 `feishu_doc` 透過動作參數執行所有文件操作。

## 權杖 (Token) 擷取

從 URL `https://xxx.feishu.cn/docx/ABC123def` 擷取 → `doc_token` = `ABC123def`

## 動作 (Actions)

### 讀取文件 (Read)

```json
{ "action": "read", "doc_token": "ABC123def" }
```

回傳：標題、純文字內容、區塊統計。請檢查 `hint` 欄位 —— 若存在，則表示有表格或圖片等結構化內容，需使用 `list_blocks` 讀取。

### 寫入文件 (Write - 全量替換)

```json
{ "action": "write", "doc_token": "ABC123def", "content": "# 標題

Markdown 內容..." }
```

使用 Markdown 內容替換整個文件。支援：標題、列表、程式碼區塊、引用、連結、圖片（自動上傳）、粗體/斜體/刪除線。

**限制：不支援 Markdown 表格。**

### 附加內容 (Append)

```json
{ "action": "append", "doc_token": "ABC123def", "content": "額外內容" }
```

### 建立文件 (Create)

```json
{ "action": "create", "title": "新文件" }
```

### 列出區塊 (List Blocks)

```json
{ "action": "list_blocks", "doc_token": "ABC123def" }
```

回傳完整的區塊數據，包含表格與圖片。

### 更新區塊文字

```json
{
  "action": "update_block",
  "doc_token": "ABC123def",
  "block_id": "doxcnXXX",
  "content": "新文字"
}
```

## 讀取工作流建議

1. 先執行 `action: "read"`：獲取純文字與統計資訊。
2. 檢查回傳中的 `block_types`（如 Table, Image, Code 等）。
3. 若存在結構化內容，再執行 `action: "list_blocks"` 獲取完整數據。

## 注意事項

`feishu_wiki` 依賴於此工具 —— 維基頁面的內文是透過 `feishu_doc` 讀寫的。
