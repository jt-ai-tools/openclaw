# 使用 MML (MIME Meta Language) 撰寫郵件

Himalaya 使用 MML 來撰寫電子郵件。MML 是一種簡單的類 XML 語法，可編譯為標準的 MIME 訊息。

## 基本郵件結構

電子郵件訊息由一組 **標頭 (Headers)** 以及 **內文 (Body)** 組成，中間以空行分隔：

```
From: sender@example.com
To: recipient@example.com
Subject: 哈囉，世界

這是郵件內文。
```

## 標頭 (Headers)

常用標頭：

- `From`: 傳送者地址
- `To`: 主要收件者
- `Cc`: 副本收件者
- `Bcc`: 密件副本收件者
- `Subject`: 郵件主旨
- `Reply-To`: 回覆地址（若與 From 不同）
- `In-Reply-To`: 被回覆的郵件 ID

## 純文字內文

簡單的純文字郵件：

```
From: alice@localhost
To: bob@localhost
Subject: 純文字範例

您好，這是一封純文字郵件。
不需要特殊的格式。

祝好,
Alice
```

## MML 富文本郵件

### 多部分訊息 (Multipart Messages)

同時提供純文字與 HTML 版本：

```
From: alice@localhost
To: bob@localhost
Subject: Multipart 範例

<#multipart type=alternative>
這是純文字版本。
<#part type=text/html>
<html><body><h1>這是 HTML 版本</h1></body></html>
<#/multipart>
```

### 附件 (Attachments)

附加檔案：

```
From: alice@localhost
To: bob@localhost
Subject: 帶有附件的郵件

這是您要求的檔案。

<#part filename=/路徑/文件.pdf><#/part>
```

帶有自訂名稱的附件：

```
<#part filename=/路徑/檔案.pdf name=報告.pdf><#/part>
```

### 內嵌圖片 (Inline Images)

在 HTML 中內嵌圖片：

```
From: alice@localhost
To: bob@localhost
Subject: 內嵌圖片範例

<#multipart type=related>
<#part type=text/html>
<html><body>
<p>請看這張圖片：</p>
<img src="cid:image1">
</body></html>
<#part disposition=inline id=image1 filename=/路徑/圖片.png><#/part>
<#/multipart>
```

## MML 標籤參考

### `<#multipart>`

將多個部分分組。

- `type=alternative`: 同一內容的不同表示方式
- `type=mixed`: 獨立的部分（文字 + 附件）
- `type=related`: 相互引用的部分（HTML + 圖片）

### `<#part>`

定義訊息的一個部分。

- `type=<mime-type>`: 內容類型（如 `text/html`, `application/pdf`）
- `filename=<路徑>`: 要附加的檔案
- `name=<名稱>`: 附件顯示名稱
- `disposition=inline`: 內嵌顯示而非作為附件
- `id=<cid>`: 用於 HTML 引用的內容 ID

## 透過 CLI 撰寫

### 互動式撰寫

開啟您的預設編輯器 (`$EDITOR`)：

```bash
himalaya message write
```

### 傳送標準輸入 (Stdin)

```bash
cat message.txt | himalaya template send
```

### 從 CLI 預填標頭

```bash
himalaya message write 
  -H "To:recipient@example.com" 
  -H "Subject:快速訊息" 
  "郵件內容在此"
```
