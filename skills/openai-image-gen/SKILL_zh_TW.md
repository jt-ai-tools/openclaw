---
name: openai-image-gen
description: 透過 OpenAI 圖片 API 批次產生圖片。包含隨機提示詞採樣器與 `index.html` 展示廊。
homepage: https://platform.openai.com/docs/api-reference/images
metadata:
  {
    "openclaw":
      {
        "emoji": "🖼️",
        "requires": { "bins": ["python3"], "env": ["OPENAI_API_KEY"] },
        "primaryEnv": "OPENAI_API_KEY",
        "install":
          [
            {
              "id": "python-brew",
              "kind": "brew",
              "formula": "python",
              "bins": ["python3"],
              "label": "安裝 Python (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# OpenAI 圖片產生 (OpenAI Image Gen)

產生一些「隨機但具備結構」的提示詞，並透過 OpenAI 圖片 API 進行渲染。

## 執行

```bash
python3 {baseDir}/scripts/gen.py
open ~/Projects/tmp/openai-image-gen-*/index.html  # 如果路徑存在
```

常用旗標：

```bash
# GPT 圖片模型與各種選項
python3 {baseDir}/scripts/gen.py --count 16 --model gpt-image-1
python3 {baseDir}/scripts/gen.py --prompt "一隻龍蝦太空人的超精細攝影棚照" --count 4
python3 {baseDir}/scripts/gen.py --size 1536x1024 --quality high --out-dir ./out/images
python3 {baseDir}/scripts/gen.py --model gpt-image-1.5 --background transparent --output-format webp

# DALL-E 3 (注意：產生數量會自動限制為 1)
python3 {baseDir}/scripts/gen.py --model dall-e-3 --quality hd --size 1792x1024 --style vivid
python3 {baseDir}/scripts/gen.py --model dall-e-3 --style natural --prompt "寧靜的山景"

# DALL-E 2
python3 {baseDir}/scripts/gen.py --model dall-e-2 --size 512x512 --count 4
```

## 模型專屬參數

不同的模型支援不同的參數值。腳本會根據模型自動選擇合適的預設值。

### 尺寸 (Size)

- **GPT 圖片模型** (`gpt-image-1`, `gpt-image-1-mini`, `gpt-image-1.5`): `1024x1024`, `1536x1024` (橫向風景), `1024x1536` (縱向人像), 或 `auto`。
  - 預設值: `1024x1024`
- **dall-e-3**: `1024x1024`, `1792x1024`, 或 `1024x1792`。
  - 預設值: `1024x1024`
- **dall-e-2**: `256x256`, `512x512`, 或 `1024x1024`。
  - 預設值: `1024x1024`

### 品質 (Quality)

- **GPT 圖片模型**: `auto`, `high`, `medium`, 或 `low`。
  - 預設值: `high`
- **dall-e-3**: `hd` 或 `standard`。
  - 預設值: `standard`
- **dall-e-2**: 僅限 `standard`。

### 其它顯著差異

- **dall-e-3** 每次僅支援產生 1 張圖片 (`n=1`)。腳本會在使用此模型時自動將數量限制為 1。
- **GPT 圖片模型** 支援額外參數：
  - `--background`: `transparent` (透明), `opaque` (不透明), 或 `auto` (預設)。
  - `--output-format`: `png` (預設), `jpeg`, 或 `webp`。
- **dall-e-3** 具備 `--style` 參數：`vivid` (超現實、戲劇化) 或 `natural` (較自然的外觀)。

## 輸出結果

- `*.png`, `*.jpeg`, 或 `*.webp` 圖片檔案。
- `prompts.json` (提示詞與檔案的對照表)。
- `index.html` (縮圖展示廊)。
