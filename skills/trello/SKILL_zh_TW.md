---
name: trello
description: 透過 Trello REST API 管理 Trello 看板、列表與卡片。
homepage: https://developer.atlassian.com/cloud/trello/rest/
metadata:
  {
    "openclaw":
      { "emoji": "📋", "requires": { "bins": ["jq"], "env": ["TRELLO_API_KEY", "TRELLO_TOKEN"] } },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# Trello 技能

直接從 OpenClaw 管理 Trello 看板、列表與卡片。

## 設定步驟

1. 獲取您的 API 密鑰：https://trello.com/app-key
2. 產生權杖 (Token)（點擊該頁面上的 "Token" 連結）。
3. 設定環境變數：
   ```bash
   export TRELLO_API_KEY="您的_API_密鑰"
   export TRELLO_TOKEN="您的_權杖"
   ```

## 用法

所有指令皆使用 curl 呼叫 Trello REST API。

### 列出看板 (Boards)

```bash
curl -s "https://api.trello.com/1/members/me/boards?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN" | jq '.[] | {name, id}'
```

### 列出看板中的列表 (Lists)

```bash
curl -s "https://api.trello.com/1/boards/{boardId}/lists?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN" | jq '.[] | {name, id}'
```

### 列出列表中的卡片 (Cards)

```bash
curl -s "https://api.trello.com/1/lists/{listId}/cards?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN" | jq '.[] | {name, id, desc}'
```

### 建立卡片

```bash
curl -s -X POST "https://api.trello.com/1/cards?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN" 
  -d "idList={listId}" 
  -d "name=卡片標題" 
  -d "desc=卡片描述"
```

### 將卡片移動至另一個列表

```bash
curl -s -X PUT "https://api.trello.com/1/cards/{cardId}?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN" 
  -d "idList={newListId}"
```

### 新增評論至卡片

```bash
curl -s -X POST "https://api.trello.com/1/cards/{cardId}/actions/comments?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN" 
  -d "text=您的評論內容"
```

### 封存卡片 (Archive)

```bash
curl -s -X PUT "https://api.trello.com/1/cards/{cardId}?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN" 
  -d "closed=true"
```

## 注意事項

- 看板/列表/卡片 ID 可在 Trello URL 中找到，或透過列表指令獲取。
- API 密鑰與權杖提供對您 Trello 帳號的完整存取權 —— 請務必保密！
- 速率限制：每 10 秒 300 個請求 (API Key)；每 10 秒 100 個請求 (Token)；`/1/members` 端點限制為每 900 秒 100 個請求。

## 範例

```bash
# 尋找名稱中包含 "Work" 的看板
curl -s "https://api.trello.com/1/members/me/boards?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN" | jq '.[] | select(.name | contains("Work"))'

# 獲取看板上的所有卡片
curl -s "https://api.trello.com/1/boards/{boardId}/cards?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN" | jq '.[] | {name, list: .idList}'
```
