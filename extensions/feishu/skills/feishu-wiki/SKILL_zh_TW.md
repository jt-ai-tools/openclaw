---
name: feishu-wiki
description: |
  飛書知識庫導覽。當使用者提到知識庫、維基 (Wiki) 或維基連結時激活。
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# 飛書維基工具 (Feishu Wiki Tool)

單一工具 `feishu_wiki` 用於知識庫操作。

## 權杖 (Token) 擷取

從 URL `https://xxx.feishu.cn/wiki/ABC123def` 擷取 → `token` = `ABC123def`

## 動作 (Actions)

### 列出知識空間

```json
{ "action": "spaces" }
```

回傳所有可存取的維基空間。

### 列出節點 (Nodes)

```json
{ "action": "nodes", "space_id": "7xxx" }
```

具備父節點：

```json
{ "action": "nodes", "space_id": "7xxx", "parent_node_token": "wikcnXXX" }
```

### 獲取節點詳情

```json
{ "action": "get", "token": "ABC123def" }
```

回傳：`node_token`, `obj_token`, `obj_type` 等。使用 `obj_token` 配合 `feishu_doc` 工具來讀取或寫入文件。

### 建立節點

```json
{ "action": "create", "space_id": "7xxx", "title": "新頁面" }
```

指定型別與父節點：

```json
{
  "action": "create",
  "space_id": "7xxx",
  "title": "試算表",
  "obj_type": "sheet",
  "parent_node_token": "wikcnXXX"
}
```

`obj_type` 支援：`docx` (預設), `sheet`, `bitable`, `mindnote`, `file`, `doc`, `slides`。

### 移動節點

```json
{ "action": "move", "space_id": "7xxx", "node_token": "wikcnXXX" }
```

### 重新命名節點

```json
{ "action": "rename", "space_id": "7xxx", "node_token": "wikcnXXX", "title": "新標題" }
```

## 維基-文件工作流 (Wiki-Doc Workflow)

若要編輯維基頁面：

1. **獲取節點**：`{ "action": "get", "token": "wiki_token" }` → 獲取 `obj_token`。
2. **讀取文件**：`feishu_doc { "action": "read", "doc_token": "obj_token" }`。
3. **寫入文件**：`feishu_doc { "action": "write", "doc_token": "obj_token", "content": "..." }`。

## 依賴關係

此工具需要啟用 `feishu_doc`。維基頁面實質上就是文件 —— 使用 `feishu_wiki` 導覽，然後使用 `feishu_doc` 讀取/編輯內容。
