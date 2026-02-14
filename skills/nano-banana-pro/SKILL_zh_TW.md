---
name: nano-banana-pro
description: 透過 Gemini 3 Pro 圖片模型 (Nano Banana Pro) 產生或編輯圖片。
homepage: https://ai.google.dev/
metadata:
  {
    "openclaw":
      {
        "emoji": "🍌",
        "requires": { "bins": ["uv"], "env": ["GEMINI_API_KEY"] },
        "primaryEnv": "GEMINI_API_KEY",
        "install":
          [
            {
              "id": "uv-brew",
              "kind": "brew",
              "formula": "uv",
              "bins": ["uv"],
              "label": "安裝 uv (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# Nano Banana Pro (Gemini 3 Pro Image)

使用隨附腳本產生或編輯圖片。

## 產生 (Generate)

```bash
uv run {baseDir}/scripts/generate_image.py --prompt "圖片描述文字" --filename "輸出檔名.png" --resolution 1K
```

## 編輯 (單張圖片)

```bash
uv run {baseDir}/scripts/generate_image.py --prompt "編輯指令" --filename "輸出檔名.png" -i "/輸入圖片路徑.png" --resolution 2K
```

## 多圖合成 (最多 14 張圖片)

```bash
uv run {baseDir}/scripts/generate_image.py --prompt "將這些圖片合成一個場景" --filename "輸出檔名.png" -i 圖片1.png -i 圖片2.png -i 圖片3.png
```

## API 密鑰

- `GEMINI_API_KEY` 環境變數。
- 或在 `~/.openclaw/openclaw.json` 中的 `skills."nano-banana-pro".apiKey` 設定。

## 注意事項

- 解析度：`1K` (預設), `2K`, `4K`。
- 建議檔名包含時間戳記：`yyyy-mm-dd-hh-mm-ss-名稱.png`。
- 腳本會印出 `MEDIA:` 行，讓 OpenClaw 在支援的通訊頻道中自動附加圖片。
- **不要** 嘗試讀回圖片內容；僅需回報儲存路徑即可。
