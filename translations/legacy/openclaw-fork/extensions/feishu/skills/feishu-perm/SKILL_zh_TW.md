---
name: feishu-perm
description: |
  飛書文件與檔案權限管理。當使用者提到分享、權限、協作者時激活。
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# 飛書權限工具 (Feishu Permission Tool)

單一工具 `feishu_perm` 用於管理檔案與文件的權限。

## 動作 (Actions)

### 列出協作者

```json
{ "action": "list", "token": "ABC123", "type": "docx" }
```

回傳：成員列表，包含成員型別、ID、權限等級與名稱。

### 新增協作者

```json
{
  "action": "add",
  "token": "ABC123",
  "type": "docx",
  "member_type": "email",
  "member_id": "user@example.com",
  "perm": "edit"
}
```

### 移除協作者

```json
{
  "action": "remove",
  "token": "ABC123",
  "type": "docx",
  "member_type": "email",
  "member_id": "user@example.com"
}
```

## 權杖型別 (Token Types)

與 `feishu_drive` 與 `feishu_doc` 支援的型別一致，包含 `doc`, `docx`, `sheet`, `bitable`, `folder`, `file`, `wiki`, `mindnote`。

## 成員型別 (Member Types)

支援 `email`, `openid`, `userid`, `unionid`, `openchat`（群組）, `opendepartmentid`（部門）。

## 權限等級 (Permission Levels)

| 權限代碼      | 說明                                 |
| ------------- | ------------------------------------ |
| `view`        | 僅限閱讀                             |
| `edit`        | 可編輯                               |
| `full_access` | 管理權限（可管理權限設定）           |

## 注意事項

此工具預設為 **停用**，因為權限管理屬於敏感操作。若有需要請在組態中明確啟用。
