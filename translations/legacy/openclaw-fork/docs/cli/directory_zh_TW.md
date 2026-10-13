---
summary: "`openclaw directory` (本人、聯絡人、群組) 的 CLI 參考資料"
read_when:
  - 您想要查詢特定頻道的聯絡人/群組/本人 ID 時
  - 您正在開發頻道目錄適配器 (Directory adapter) 時
title: "directory"
---

> 此文件為 [English Version](/cli/directory_zh_TW) 的繁體中文版本。

# `openclaw directory`

針對支援此功能的頻道執行目錄查詢（聯絡人/同儕、群組以及「本人」資訊）。

## 常用旗標

- `--channel <名稱>`：頻道 ID 或別名（若配置多個頻道則為必填）。
- `--account <ID>`：帳號 ID（預設為頻道預設值）。
- `--json`：以 JSON 格式輸出。

## 注意事項

- `directory` 指令旨在幫助您找到可貼入其它指令的 ID（特別是 `openclaw message send --target ...`）。
- 對於許多頻道而言，結果是基於組態內容（如允許清單或已配置群組），而非即時的電信商/服務商目錄。
- 預設輸出為 `id` (有時包含 `name`)，以 Tab 分隔；腳本處理請使用 `--json`。

## 配合 `message send` 使用

```bash
# 尋找使用者
openclaw directory peers list --channel slack --query "小明"

# 傳送訊息
openclaw message send --channel slack --target user:U012ABCDEF --message "哈囉"
```

## ID 格式說明 (依頻道分類)

- **WhatsApp**：`+15551234567` (私訊), `1234567890-1234567890@g.us` (群組)。
- **Telegram**：`@使用者名稱` 或 數字聊天 ID。
- **Slack**：`user:U…` 與 `channel:C…`。
- **Discord**：`user:<id>` 與 `channel:<id>`。
- **iMessage**：門號/信箱識別碼、`chat_id:<id>`。

## 查詢本人 (“me”)

```bash
openclaw directory self --channel zalouser
```

## 查詢聯絡人 (Peers)

```bash
openclaw directory peers list --channel zalouser --query "名稱"
```

## 查詢群組 (Groups)

```bash
openclaw directory groups list --channel zalouser --query "工作"
openclaw directory groups members --channel zalouser --group-id <群組ID>
```
