---
name: apple-notes
description: 透過 macOS 上的 `memo` CLI 管理 Apple 備忘錄（建立、查看、編輯、刪除、搜尋、移動與匯出）。當使用者要求 OpenClaw 新增筆記、列出筆記、搜尋筆記或管理筆記資料夾時使用。
homepage: https://github.com/antoniorodr/memo
metadata:
  {
    "openclaw":
      {
        "emoji": "📝",
        "os": ["darwin"],
        "requires": { "bins": ["memo"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "antoniorodr/memo/memo",
              "bins": ["memo"],
              "label": "透過 Homebrew 安裝 memo",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# Apple 備忘錄 CLI (Apple Notes CLI)

使用 `memo notes` 直接從終端機管理 Apple 備忘錄。支援建立、查看、編輯、刪除、搜尋、在資料夾間移動筆記，以及匯出為 HTML/Markdown。

## 安裝與設定

- 安裝 (Homebrew)：`brew tap antoniorodr/memo && brew install antoniorodr/memo/memo`
- 手動安裝 (pip)：複製儲存庫後執行 `pip install .`
- 僅限 macOS 使用；若系統提示，請授予對「備忘錄」App 的「自動化」存取權限。

## 查看筆記 (View Notes)

- 列出所有筆記：`memo notes`
- 依資料夾過濾：`memo notes -f "資料夾名稱"`
- 搜尋筆記（模糊比對）：`memo notes -s "查詢關鍵字"`

## 建立筆記 (Create Notes)

- 新增筆記：`memo notes -a`
  - 會開啟互動式編輯器以撰寫內容。
- 快速新增標題：`memo notes -a "筆記標題"`

## 編輯筆記 (Edit Notes)

- 編輯現有筆記：`memo notes -e`
  - 互動式選擇要編輯的筆記。

## 刪除筆記 (Delete Notes)

- 刪除筆記：`memo notes -d`
  - 互動式選擇要刪除的筆記。

## 移動筆記 (Move Notes)

- 將筆記移動至資料夾：`memo notes -m`
  - 互動式選擇筆記與目標資料夾。

## 匯出筆記 (Export Notes)

- 匯出為 HTML/Markdown：`memo notes -ex`
  - 匯出選定的筆記；使用 Mistune 進行 Markdown 處理。

## 限制 (Limitations)

- 無法編輯包含圖片或附件的筆記。
- 互動式提示可能需要終端機存取權。

## 注意事項

- 僅限 macOS。
- 需要可存取 Apple 備忘錄 App。
- 針對自動化，請至「系統設定」>「隱私權與安全性」>「自動化」中授予權限。
