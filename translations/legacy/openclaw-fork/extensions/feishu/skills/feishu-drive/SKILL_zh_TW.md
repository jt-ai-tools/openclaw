---
name: feishu-drive
description: |
  飛書雲端硬碟檔案管理。當使用者提到雲端空間、資料夾、硬碟時激活。
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# 飛書雲端硬碟工具 (Feishu Drive Tool)

單一工具 `feishu_drive` 用於雲端儲存操作。

## 權杖 (Token) 擷取

從 URL `https://xxx.feishu.cn/drive/folder/ABC123` 擷取 → `folder_token` = `ABC123`

## 動作 (Actions)

### 列出資料夾內容

```json
{ "action": "list" }
```

根目錄（不帶 folder_token）。

```json
{ "action": "list", "folder_token": "fldcnXXX" }
```

回傳：包含權杖、名稱、類型、URL 與時間戳記的檔案列表。

### 獲取檔案資訊 (Info)

```json
{ "action": "info", "file_token": "ABC123", "type": "docx" }
```

### 建立資料夾

```json
{ "action": "create_folder", "name": "新資料夾" }
```

### 移動檔案

```json
{ "action": "move", "file_token": "ABC123", "type": "docx", "folder_token": "fldcnXXX" }
```

### 刪除檔案

```json
{ "action": "delete", "file_token": "ABC123", "type": "docx" }
```

## 檔案類型 (File Types)

| 類型       | 說明                    |
| ---------- | ----------------------- |
| `doc`      | 舊版文件                |
| `docx`     | 新版文件                |
| `sheet`    | 試算表                  |
| `bitable`  | 多維表格                |
| `folder`   | 資料夾                  |
| `file`     | 上傳的檔案              |
| `mindnote` | 心智圖                  |
| `shortcut` | 捷徑                    |

## 權限

- `drive:drive` - 完整存取權（建立、移動、刪除）。
- `drive:drive:readonly` - 唯讀（列出、資訊）。

## 已知限制

- **機器人沒有根資料夾**：飛書機器人使用 `tenant_access_token`，沒有自己的「我的空間」。
  - 在不指定 `folder_token` 的情況下執行 `create_folder` 會失敗。
  - 機器人僅能存取 **已分享給它** 的檔案或資料夾。
  - **解決方案**：使用者需手動建立資料夾並分享給機器人，之後機器人即可在其中建立子資料夾。
