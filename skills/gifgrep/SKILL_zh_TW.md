---
name: gifgrep
description: 使用 CLI/TUI 搜尋 GIF 提供者、下載結果並擷取靜態影格或採樣表格。
homepage: https://gifgrep.com
metadata:
  {
    "openclaw":
      {
        "emoji": "🧲",
        "requires": { "bins": ["gifgrep"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "steipete/tap/gifgrep",
              "bins": ["gifgrep"],
              "label": "安裝 gifgrep (brew)",
            },
            {
              "id": "go",
              "kind": "go",
              "module": "github.com/steipete/gifgrep/cmd/gifgrep@latest",
              "bins": ["gifgrep"],
              "label": "安裝 gifgrep (go)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# gifgrep

使用 `gifgrep` 搜尋 GIF 提供者 (Tenor/Giphy)、在 TUI 中瀏覽、下載結果，並擷取靜態影格 (Stills) 或採樣表格 (Sheets)。

## 快速開始

- `gifgrep cats --max 5` (搜尋貓咪 GIF)。
- `gifgrep cats --format url | head -n 5` (僅輸出網址)。
- `gifgrep tui "office handshake"` (開啟互動式介面)。
- `gifgrep cats --download --max 1` (下載一張貓咪 GIF)。

## 下載與開啟

- `--download` 會將檔案儲存至 `~/Downloads`。
- `--reveal` 會在 Finder 中顯示最後下載的檔案。

## 靜態影格與採樣表格 (Stills + Sheets)

- `gifgrep still ./clip.gif --at 1.5s -o still.png` (擷取特定時間點影格)。
- `gifgrep sheet ./clip.gif --frames 9 --cols 3 -o sheet.png` (產生採樣表格)。
- **採樣表格 (Sheets)**：將多個採樣影格組合成單張 PNG 網格（非常適合快速預覽、文件撰寫、PR 或聊天使用）。
- 調整參數：`--frames` (影格數), `--cols` (網格寬度), `--padding` (間距)。

## 提供者 (Providers)

- `--source auto|tenor|giphy`。
- `GIPHY_API_KEY`：使用 Giphy 時必填。
- `TENOR_API_KEY`：使用 Tenor 時選填（若未設定則使用展示用的 Demo Key）。

## 輸出格式

- `--json` 印出包含 `id`, `title`, `url`, `tags` 等欄位的 JSON 陣列。
- `--format` 用於僅輸出特定欄位（如 `url`），方便透過管線 (Pipe) 處理。
