---
name: himalaya
description: "透過 IMAP/SMTP 管理電子郵件的 CLI。使用 `himalaya` 在終端機列出、讀取、撰寫、回覆、轉寄、搜尋與組織電子郵件。支援多帳號與使用 MML (MIME Meta Language) 撰寫訊息。"
homepage: https://github.com/pimalaya/himalaya
metadata:
  {
    "openclaw":
      {
        "emoji": "📧",
        "requires": { "bins": ["himalaya"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "himalaya",
              "bins": ["himalaya"],
              "label": "安裝 Himalaya (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# Himalaya 電子郵件 CLI

Himalaya 是一款 CLI 電子郵件客戶端，讓您能在終端機透過 IMAP, SMTP, Notmuch 或 Sendmail 後端管理郵件。

## 參考文件 (References)

- `references/configuration.md`（組態檔案設定 + IMAP/SMTP 驗證）
- `references/message-composition.md`（撰寫郵件的 MML 語法）

## 事前準備

1. 安裝 Himalaya CLI（執行 `himalaya --version` 驗證）。
2. 在 `~/.config/himalaya/config.toml` 建立組態檔案。
3. 配置 IMAP/SMTP 憑證（建議安全地儲存密碼）。

## 組態設定 (Configuration Setup)

執行互動式精靈來設定帳號：

```bash
himalaya account configure
```

或手動建立 `~/.config/himalaya/config.toml`：

```toml
[accounts.personal]
email = "you@example.com"
display-name = "您的名稱"
default = true

backend.type = "imap"
backend.host = "imap.example.com"
backend.port = 993
backend.encryption.type = "tls"
backend.login = "you@example.com"
backend.auth.type = "password"
backend.auth.cmd = "pass show email/imap"  # 或使用系統金鑰圈

message.send.backend.type = "smtp"
message.send.backend.host = "smtp.example.com"
message.send.backend.port = 587
message.send.backend.encryption.type = "start-tls"
message.send.backend.login = "you@example.com"
message.send.backend.auth.type = "password"
message.send.backend.auth.cmd = "pass show email/smtp"
```

## 常用操作

### 列出資料夾 (Folders)

```bash
himalaya folder list
```

### 列出郵件 (Emails)

列出收件匣 (INBOX) 的郵件（預設）：

```bash
himalaya envelope list
```

列出特定資料夾的郵件：

```bash
himalaya envelope list --folder "Sent"
```

### 搜尋郵件 (Search Emails)

```bash
himalaya envelope list from john@example.com subject meeting
```

### 讀取郵件 (Read)

依 ID 讀取（顯示純文字）：

```bash
himalaya message read 42
```

匯出原始格式 (Raw MIME)：

```bash
himalaya message export 42 --full
```

### 回覆郵件 (Reply)

互動式回覆（開啟 $EDITOR）：

```bash
himalaya message reply 42
```

### 撰寫新郵件 (Write)

直接使用模板發送：

```bash
cat << 'EOF' | himalaya template send
From: you@example.com
To: recipient@example.com
Subject: 測試郵件

來自 Himalaya 的問候！
EOF
```

或使用標頭 (Headers) 旗標：

```bash
himalaya message write -H "To:recipient@example.com" -H "Subject:測試" "郵件內文在此"
```

### 刪除郵件 (Delete)

```bash
himalaya message delete 42
```

## 多帳號支援 (Multiple Accounts)

列出所有帳號：

```bash
himalaya account list
```

指定特定帳號：

```bash
himalaya --account work envelope list
```

## 附件 (Attachments)

下載附件：

```bash
himalaya attachment download 42 --dir ~/Downloads
```

## 輸出格式

多數指令支援 `--output`：

```bash
himalaya envelope list --output json
```

## 小撇步

- 郵件 ID 是相對於目前資料夾的；資料夾變更後請重新列出。
- 撰寫帶有附件的富文本郵件時，請使用 MML 語法。
- 使用 `pass`、系統金鑰圈或會輸出密碼的指令來安全地管理密碼。
