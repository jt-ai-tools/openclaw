---
name: openai-whisper
description: 使用 Whisper CLI 進行本地語音轉文字（無需 API 密鑰）。
homepage: https://openai.com/research/whisper
metadata:
  {
    "openclaw":
      {
        "emoji": "🎙️",
        "requires": { "bins": ["whisper"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "openai-whisper",
              "bins": ["whisper"],
              "label": "安裝 OpenAI Whisper (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# Whisper (CLI)

使用 `whisper` 指令在本地端進行音訊轉錄。

## 快速開始

- `whisper /路徑/音訊.mp3 --model medium --output_format txt --output_dir .`
- `whisper /路徑/音訊.m4a --task translate --output_format srt`

## 注意事項

- 模型會在首次執行時下載至 `~/.cache/whisper`。
- 此安裝版本中的 `--model` 預設為 `turbo`。
- 使用較小的模型可提升速度，較大的模型則可提升準確度。
