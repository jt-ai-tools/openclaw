---
name: summarize
description: 摘要或擷取來自 URL、播客 (Podcasts) 與本地檔案的文字/逐字稿（是「逐字稿化此 YouTube/影片」要求的最佳備援方案）。
homepage: https://summarize.sh
metadata:
  {
    "openclaw":
      {
        "emoji": "🧾",
        "requires": { "bins": ["summarize"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "steipete/tap/summarize",
              "bins": ["summarize"],
              "label": "安裝 summarize (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# 摘要 (Summarize)

用於摘要 URL、本地檔案與 YouTube 連結的快速 CLI 工具。

## 使用時機 (觸發詞)

當使用者詢問以下任何內容時，請立即使用此技能：

- 「使用 summarize.sh」
- 「這則連結/影片在講什麼？」
- 「摘要此 URL/文章」
- 「將此 YouTube/影片轉成逐字稿」（盡力而為的逐字稿擷取；不需要 `yt-dlp`）

## 快速開始

```bash
summarize "https://example.com" --model google/gemini-3-flash-preview
summarize "/path/to/file.pdf" --model google/gemini-3-flash-preview
summarize "https://youtu.be/dQw4w9WgXcQ" --youtube auto
```

## YouTube：摘要 vs 逐字稿

盡力而為的逐字稿（僅限 URL）：

```bash
summarize "https://youtu.be/dQw4w9WgXcQ" --youtube auto --extract-only
```

如果使用者要求逐字稿但內容過大，請先提供精簡的摘要，然後詢問需要展開哪個章節/時間範圍。

## 模型與密鑰

為您選擇的提供者設定 API 密鑰：

- OpenAI: `OPENAI_API_KEY`
- Anthropic: `ANTHROPIC_API_KEY`
- xAI: `XAI_API_KEY`
- Google: `GEMINI_API_KEY` (別名：`GOOGLE_GENERATIVE_AI_API_KEY`, `GOOGLE_API_KEY`)

如果未設定，預設模型為 `google/gemini-3-flash-preview`。

## 有用的旗標

- `--length short|medium|long|xl|xxl|<字元數>`
- `--max-output-tokens <數量>`
- `--extract-only` (僅限 URL)
- `--json` (機器可讀格式)
- `--firecrawl auto|off|always` (備援擷取機制)
- `--youtube auto` (若設定了 `APIFY_API_TOKEN` 則使用 Apify 備援)

## 組態設定 (Config)

選用的組態檔案：`~/.summarize/config.json`

```json
{ "model": "openai/gpt-5.2" }
```

選用服務：

- `FIRECRAWL_API_KEY` 用於處理被封鎖的網站。
- `APIFY_API_TOKEN` 用於 YouTube 備援處理。
