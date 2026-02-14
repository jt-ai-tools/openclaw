---
name: openai-whisper-api
description: 透過 OpenAI 音訊轉錄 API (Whisper) 進行語音轉文字。
homepage: https://platform.openai.com/docs/guides/speech-to-text
metadata:
  {
    "openclaw":
      {
        "emoji": "☁️",
        "requires": { "bins": ["curl"], "env": ["OPENAI_API_KEY"] },
        "primaryEnv": "OPENAI_API_KEY",
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# OpenAI Whisper API (curl)

透過 OpenAI 的 `/v1/audio/transcriptions` 端點轉錄音訊檔案。

## 快速開始

```bash
{baseDir}/scripts/transcribe.sh /路徑/到/音訊.m4a
```

預設值：

- 模型：`whisper-1`
- 輸出：`<輸入檔案名稱>.txt`

## 常用旗標

```bash
{baseDir}/scripts/transcribe.sh /路徑/音訊.ogg --model whisper-1 --out /tmp/逐字稿.txt
{baseDir}/scripts/transcribe.sh /路徑/音訊.m4a --language zh
{baseDir}/scripts/transcribe.sh /路徑/音訊.m4a --prompt "講者姓名：Peter, Daniel"
{baseDir}/scripts/transcribe.sh /路徑/音訊.m4a --json --out /tmp/逐字稿.json
```

## API 密鑰

設定 `OPENAI_API_KEY` 環境變數，或在 `~/.openclaw/openclaw.json` 中配置：

```json5
{
  skills: {
    "openai-whisper-api": {
      apiKey: "在此填入_OPENAI_密鑰",
    },
  },
}
```
