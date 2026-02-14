---
name: bear-notes
description: 透過 grizzly CLI 建立、搜尋與管理 Bear 筆記。
homepage: https://bear.app
metadata:
  {
    "openclaw":
      {
        "emoji": "🐻",
        "os": ["darwin"],
        "requires": { "bins": ["grizzly"] },
        "install":
          [
            {
              "id": "go",
              "kind": "go",
              "module": "github.com/tylerwince/grizzly/cmd/grizzly@latest",
              "bins": ["grizzly"],
              "label": "安裝 grizzly (go)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# Bear 筆記

使用 `grizzly` 在 macOS 上建立、讀取與管理 Bear 中的筆記。

## 要求 (Requirements)

- 已安裝並執行 Bear App。
- 對於某些操作（add-text, tags, open-note --selected），需要 Bear App 權杖 (Token)（儲存於 `~/.config/grizzly/token`）。

## 獲取 Bear 權杖

對於需要權杖的操作，您需要一個身份驗證權杖：

1. 開啟 Bear → 幫助 (Help) → API 權杖 (API Token) → 複製權杖。
2. 儲存它：`echo "您的權杖" > ~/.config/grizzly/token`

## 常見指令

### 建立筆記

```bash
echo "筆記內容在此" | grizzly create --title "我的筆記" --tag work
grizzly create --title "快速筆記" --tag inbox < /dev/null
```

### 依 ID 開啟/讀取筆記

```bash
grizzly open-note --id "NOTE_ID" --enable-callback --json
```

### 附加文字至筆記

```bash
echo "額外內容" | grizzly add-text --id "NOTE_ID" --mode append --token-file ~/.config/grizzly/token
```

### 列出所有標籤

```bash
grizzly tags --enable-callback --json --token-file ~/.config/grizzly/token
```

### 搜尋筆記（透過開啟標籤）

```bash
grizzly open-tag --name "work" --enable-callback --json
```

## 選項 (Options)

常用旗標：

- `--dry-run` — 預覽 URL 而不執行。
- `--print-url` — 顯示 x-callback-url。
- `--enable-callback` — 等待 Bear 的回應（讀取數據時需要）。
- `--json` — 以 JSON 格式輸出（使用回呼時）。
- `--token-file 路徑` — Bear API 權杖檔案的路徑。

## 組態設定 (Configuration)

Grizzly 會依以下優先順序讀取設定：

1. CLI 旗標。
2. 環境變數 (`GRIZZLY_TOKEN_FILE`, `GRIZZLY_CALLBACK_URL`, `GRIZZLY_TIMEOUT`)。
3. 目前目錄下的 `.grizzly.toml`。
4. `~/.config/grizzly/config.toml`。

## 注意事項

- 指令執行時 Bear 必須處於開啟狀態。
- 筆記 ID 是 Bear 的內部識別碼（可在筆記資訊中或透過回呼取得）。
- 當您需要從 Bear 讀取數據時，請務必使用 `--enable-callback`。
- 某些操作（add-text, tags, open-note --selected）需要有效的權杖。
