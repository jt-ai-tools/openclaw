# Himalaya 組態參考 (Configuration Reference)

組態檔案位置：`~/.config/himalaya/config.toml`

## 最簡 IMAP + SMTP 設定

```toml
[accounts.default]
email = "user@example.com"
display-name = "您的名稱"
default = true

# 用於讀取郵件的 IMAP 後端
backend.type = "imap"
backend.host = "imap.example.com"
backend.port = 993
backend.encryption.type = "tls"
backend.login = "user@example.com"
backend.auth.type = "password"
backend.auth.raw = "您的密碼"

# 用於發送郵件的 SMTP 後端
message.send.backend.type = "smtp"
message.send.backend.host = "smtp.example.com"
message.send.backend.port = 587
message.send.backend.encryption.type = "start-tls"
message.send.backend.login = "user@example.com"
message.send.backend.auth.type = "password"
message.send.backend.auth.raw = "您的密碼"
```

## 密碼選項 (Password Options)

### 明文密碼（僅供測試，不建議使用）

```toml
backend.auth.raw = "您的密碼"
```

### 透過指令獲取密碼（建議方式）

```toml
backend.auth.cmd = "pass show email/imap"
# 或 macOS 金鑰圈：
# backend.auth.cmd = "security find-generic-password -a user@example.com -s imap -w"
```

### 系統金鑰圈

```toml
backend.auth.keyring = "imap-example"
```

接著執行 `himalaya account configure <帳號名稱>` 來儲存密碼。

## Gmail 設定

**注意：** 若啟用了 2FA，Gmail 需要使用「應用程式密碼」。

```toml
[accounts.gmail]
email = "you@gmail.com"
display-name = "您的名稱"
default = true

backend.type = "imap"
backend.host = "imap.gmail.com"
backend.port = 993
backend.encryption.type = "tls"
backend.login = "you@gmail.com"
backend.auth.type = "password"
backend.auth.cmd = "pass show google/app-password"

message.send.backend.type = "smtp"
message.send.backend.host = "smtp.gmail.com"
message.send.backend.port = 587
message.send.backend.encryption.type = "start-tls"
message.send.backend.login = "you@gmail.com"
message.send.backend.auth.type = "password"
message.send.backend.auth.cmd = "pass show google/app-password"
```

## iCloud 設定

**注意：** 請至 appleid.apple.com 產生「App 專用密碼」。

```toml
[accounts.icloud]
email = "you@icloud.com"
display-name = "您的名稱"

backend.type = "imap"
backend.host = "imap.mail.me.com"
backend.port = 993
backend.encryption.type = "tls"
backend.login = "you@icloud.com"
backend.auth.type = "password"
backend.auth.cmd = "pass show icloud/app-password"

message.send.backend.type = "smtp"
message.send.backend.host = "smtp.mail.me.com"
message.send.backend.port = 587
message.send.backend.encryption.type = "start-tls"
message.send.backend.login = "you@icloud.com"
message.send.backend.auth.type = "password"
message.send.backend.auth.cmd = "pass show icloud/app-password"
```

## 資料夾別名 (Folder Aliases)

對應自訂資料夾名稱：

```toml
[accounts.default.folder.alias]
inbox = "INBOX"
sent = "Sent"
drafts = "Drafts"
trash = "Trash"
```

## 切換帳號

使用 `--account` 指令切換：

```bash
himalaya --account work envelope list
```

## 其它選項

### 簽名檔 (Signature)

```toml
[accounts.default]
signature = "祝 平安,
您的名稱"
signature-delim = "-- 
"
```

### 下載目錄

```toml
[accounts.default]
downloads-dir = "~/Downloads/himalaya"
```

### 撰寫用編輯器

透過環境變數設定：

```bash
export EDITOR="vim"
```
