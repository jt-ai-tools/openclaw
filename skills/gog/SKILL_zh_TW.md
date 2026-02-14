---
name: gog
description: 用於 Gmail, 日曆, 雲端硬碟, 聯絡人, 試算表與文件的 Google Workspace CLI。
homepage: https://gogcli.sh
metadata:
  {
    "openclaw":
      {
        "emoji": "🎮",
        "requires": { "bins": ["gog"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "steipete/tap/gogcli",
              "bins": ["gog"],
              "label": "安裝 gog (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# gog (Google Workspace CLI)

使用 `gog` 操作 Gmail、日曆、雲端硬碟、聯絡人、試算表與文件。需要進行 OAuth 設定。

## 設定步驟（僅需一次）

- `gog auth credentials /路徑/到/client_secret.json`
- `gog auth add 您的信箱@gmail.com --services gmail,calendar,drive,contacts,docs,sheets`
- `gog auth list`

## 常用指令

### Gmail
- 搜尋：`gog gmail search 'newer_than:7d' --max 10`
- 搜尋單封郵件（忽略執行緒）：`gog gmail messages search "in:inbox from:someone.com" --max 20`
- 傳送郵件（純文字）：`gog gmail send --to a@b.com --subject "主旨" --body "內容"`
- 傳送郵件（多行內容）：`gog gmail send --to a@b.com --subject "主旨" --body-file ./message.txt`
- 傳送郵件（HTML）：`gog gmail send --to a@b.com --subject "主旨" --body-html "<p>內容</p>"`
- 建立草稿：`gog gmail drafts create --to a@b.com --subject "主旨" --body-file ./message.txt`
- 傳送草稿：`gog gmail drafts send <草稿ID>`
- 回覆郵件：`gog gmail send --to a@b.com --subject "Re: 主旨" --body "內容" --reply-to-message-id <訊息ID>`

### 日曆 (Calendar)
- 列出活動：`gog calendar events <日曆ID> --from <ISO日期> --to <ISO日期>`
- 建立活動：`gog calendar create <日曆ID> --summary "活動標題" --from <ISO日期> --to <ISO日期>`
- 設定活動顏色：`gog calendar create ... --event-color 7`
- 顯示顏色代碼：`gog calendar colors`

### 雲端硬碟與聯絡人
- 搜尋硬碟：`gog drive search "查詢字串" --max 10`
- 聯絡人列表：`gog contacts list --max 20`

### 試算表 (Sheets)
- 讀取資料：`gog sheets get <試算表ID> "分頁!A1:D10" --json`
- 更新資料：`gog sheets update <試算表ID> "分頁!A1:B2" --values-json '[["A","B"],["1","2"]]' --input USER_ENTERED`
- 附加資料：`gog sheets append <試算表ID> "分頁!A:C" --values-json '[["x","y","z"]]' --insert INSERT_ROWS`
- 清除資料：`gog sheets clear <試算表ID> "分頁!A2:Z"`

### 文件 (Docs)
- 匯出：`gog docs export <文件ID> --format txt --out /tmp/doc.txt`
- 讀取內容：`gog docs cat <文件ID>`

## 電子郵件格式化

- 優先使用純文字。多行訊息建議使用 `--body-file`。
- `--body` 不會自動轉義 `
`。若需換行，請使用 heredoc。
- 僅在需要富文本格式時使用 `--body-html`。
- 範例（透過標準輸入傳送純文字）：

  ```bash
  gog gmail send --to recipient@example.com 
    --subject "會議後續跟進" 
    --body-file - <<'EOF'
  您好,

  感謝今天的會議。後續步驟如下：
  - 第一項
  - 第二項

  祝 平安,
  您的名稱
  EOF
  ```

## 注意事項

- 設定 `GOG_ACCOUNT=您的信箱@gmail.com` 環境變數可省略每次傳遞 `--account`。
- 對於腳本自動化，建議使用 `--json` 與 `--no-input` 參數。
- `gog gmail search` 每一個執行緒 (Thread) 回傳一列；若需處理個別單封郵件，請使用 `gog gmail messages search`。
- 在傳送郵件或建立日曆活動前，請務必先向使用者確認。
