---
name: obsidian
description: 處理 Obsidian 儲存庫（純 Markdown 筆記）並透過 obsidian-cli 進行自動化。
homepage: https://help.obsidian.md
metadata:
  {
    "openclaw":
      {
        "emoji": "💎",
        "requires": { "bins": ["obsidian-cli"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "yakitrak/yakitrak/obsidian-cli",
              "bins": ["obsidian-cli"],
              "label": "安裝 obsidian-cli (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# Obsidian

Obsidian 儲存庫 (Vault) = 磁碟上的一個普通資料夾。

## 儲存庫結構（典型）

- **筆記**：`*.md`（純文字 Markdown；可用任何編輯器編輯）。
- **組態**：`.obsidian/`（工作區與外掛程式設定；腳本通常不應更動）。
- **畫布**：`*.canvas` (JSON)。
- **附件**：您在 Obsidian 設定中選擇的任何資料夾（圖片/PDF 等）。

## 尋找活動中的儲存庫

Obsidian 桌面版在此處追蹤儲存庫（單一事實來源）：

- `~/Library/Application Support/obsidian/obsidian.json`

`obsidian-cli` 會從該檔案解析儲存庫；儲存庫名稱通常是 **資料夾名稱**（路徑後綴）。

快速確認「哪個儲存庫正處於活動狀態 / 筆記在哪裡？」：

- 如果您已經設定了預設值：`obsidian-cli print-default --path-only`
- 否則，讀取 `~/Library/Application Support/obsidian/obsidian.json` 並使用 `"open": true` 的項目。

## 注意事項

- 使用者通常擁有多個儲存庫（iCloud vs `~/Documents`、工作 vs 個人等）。請勿猜測，請讀取組態。
- 避免在腳本中寫死儲存庫路徑；建議讀取組態或使用 `print-default`。

## obsidian-cli 快速入門

### 設定預設儲存庫（僅需一次）：

- `obsidian-cli set-default "<儲存庫資料夾名稱>"`
- `obsidian-cli print-default` / `obsidian-cli print-default --path-only`

### 搜尋 (Search)

- `obsidian-cli search "查詢字串"`（搜尋筆記名稱）。
- `obsidian-cli search-content "查詢字串"`（搜尋筆記內容；顯示片段與行號）。

### 建立 (Create)

- `obsidian-cli create "資料夾/新筆記" --content "..." --open`
- 需要 Obsidian URI 處理程式 (`obsidian://…`) 正常運作（需安裝 Obsidian）。
- 避免透過 URI 在隱藏資料夾（例如 `.something/...`）下建立筆記；Obsidian 可能會拒絕。

### 移動/重命名 (安全重構)

- `obsidian-cli move "舊路徑/筆記" "新路徑/筆記"`
- 會自動更新整個儲存庫中的 `[[wikilinks]]` 與常見的 Markdown 連結（這是相對於 `mv` 的主要優勢）。

### 刪除 (Delete)

- `obsidian-cli delete "路徑/筆記"`

**建議做法：** 在適當的情況下直接編輯 `.md` 檔案，Obsidian 會自動偵測到變更。
