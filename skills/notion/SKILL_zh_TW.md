---
name: notion
description: 用於建立與管理 Notion 頁面、資料庫與區塊的 Notion API。
homepage: https://developers.notion.com
metadata:
  {
    "openclaw":
      { "emoji": "📝", "requires": { "env": ["NOTION_API_KEY"] }, "primaryEnv": "NOTION_API_KEY" },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# notion

使用 Notion API 建立、讀取、更新頁面、資料來源 (資料庫) 以及區塊。

## 設定步驟

1. 至 https://notion.so/my-integrations 建立一個「整合 (Integration)」。
2. 複製 API 密鑰（以 `ntn_` 或 `secret_` 開頭）。
3. 儲存密鑰：

```bash
mkdir -p ~/.config/notion
echo "在此填入_ntn_密鑰" > ~/.config/notion/api_key
```

4. 將目標頁面/資料庫共用給您的「整合」（點擊 "..." → "Connect to" → 選擇您的整合名稱）。

## API 基礎

所有請求皆需要：

```bash
NOTION_KEY=$(cat ~/.config/notion/api_key)
curl -X GET "https://api.notion.com/v1/..." 
  -H "Authorization: Bearer $NOTION_KEY" 
  -H "Notion-Version: 2025-09-03" 
  -H "Content-Type: application/json"
```

> **注意：** 必須包含 `Notion-Version` 標頭。此技能使用 `2025-09-03` 版本（最新版）。在此版本中，資料庫 (Databases) 在 API 中被稱為「資料來源 (Data sources)」。

## 常見操作

### 搜尋頁面與資料來源：

```bash
curl -X POST "https://api.notion.com/v1/search" 
  -H "Authorization: Bearer $NOTION_KEY" 
  -H "Notion-Version: 2025-09-03" 
  -H "Content-Type: application/json" 
  -d '{"query": "頁面標題"}'
```

### 獲取頁面內容 (區塊)：

```bash
curl "https://api.notion.com/v1/blocks/{page_id}/children" 
  -H "Authorization: Bearer $NOTION_KEY" 
  -H "Notion-Version: 2025-09-03"
```

### 在資料來源中建立頁面：

```bash
curl -X POST "https://api.notion.com/v1/pages" 
  -H "Authorization: Bearer $NOTION_KEY" 
  -H "Notion-Version: 2025-09-03" 
  -H "Content-Type: application/json" 
  -d '{
    "parent": {"database_id": "xxx"},
    "properties": {
      "Name": {"title": [{"text": {"content": "新項目"}}]},
      "Status": {"select": {"name": "待辦"}}
    }
  }'
```

### 查詢資料來源 (資料庫)：

```bash
curl -X POST "https://api.notion.com/v1/data_sources/{data_source_id}/query" 
  -H "Authorization: Bearer $NOTION_KEY" 
  -H "Notion-Version: 2025-09-03" 
  -H "Content-Type: application/json" 
  -d '{
    "filter": {"property": "Status", "select": {"equals": "進行中"}},
    "sorts": [{"property": "Date", "direction": "descending"}]
  }'
```

## 屬性型別 (Property Types)

資料庫項目的常用屬性格式：

- **標題 (Title)：** `{"title": [{"text": {"content": "..."}}]}`
- **富文本 (Rich text)：** `{"rich_text": [{"text": {"content": "..."}}]}`
- **選項 (Select)：** `{"select": {"name": "選項名稱"}}`
- **多選 (Multi-select)：** `{"multi_select": [{"name": "A"}, {"name": "B"}]}`
- **日期 (Date)：** `{"date": {"start": "2024-01-15", "end": "2024-01-16"}}`
- **勾選框 (Checkbox)：** `{"checkbox": true}`
- **數字 (Number)：** `{"number": 42}`
- **關聯 (Relation)：** `{"relation": [{"id": "page_id"}]}`

## 2025-09-03 版本的主要差異

- **Databases → Data Sources**：針對查詢與檢索請使用 `/data_sources/` 端點。
- **雙重 ID**：每個資料庫現在同時擁有 `database_id` 與 `data_source_id`。
  - 建立頁面時使用 `database_id` (`parent: {"database_id": "..."}`)。
  - 查詢時使用 `data_source_id` (`POST /v1/data_sources/{id}/query`)。
- **搜尋結果**：資料庫回傳為 `"object": "data_source"` 並包含其 `data_source_id`。

## 注意事項

- 頁面/資料庫 ID 為 UUID 格式（有無連字號皆可）。
- API 無法設定資料庫的視圖過濾器 (View filters) —— 該功能僅限 UI 操作。
- 速率限制：平均每秒約 3 個請求。
- 建立資料來源時使用 `is_inline: true` 可將其內嵌於頁面中。
