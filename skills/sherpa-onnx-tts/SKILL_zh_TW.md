---
name: sherpa-onnx-tts
description: 透過 sherpa-onnx 進行本地端文字轉語音（離線使用，不需雲端）。
metadata:
  {
    "openclaw":
      {
        "emoji": "🗣️",
        "os": ["darwin", "linux", "win32"],
        "requires": { "env": ["SHERPA_ONNX_RUNTIME_DIR", "SHERPA_ONNX_MODEL_DIR"] },
        "install":
          [
            {
              "id": "download-runtime-macos",
              "kind": "download",
              "os": ["darwin"],
              "url": "https://github.com/k2-fsa/sherpa-onnx/releases/download/v1.12.23/sherpa-onnx-v1.12.23-osx-universal2-shared.tar.bz2",
              "archive": "tar.bz2",
              "extract": true,
              "stripComponents": 1,
              "targetDir": "~/.openclaw/tools/sherpa-onnx-tts/runtime",
              "label": "下載 sherpa-onnx 執行時期 (macOS)",
            },
            {
              "id": "download-runtime-linux-x64",
              "kind": "download",
              "os": ["linux"],
              "url": "https://github.com/k2-fsa/sherpa-onnx/releases/download/v1.12.23/sherpa-onnx-v1.12.23-linux-x64-shared.tar.bz2",
              "archive": "tar.bz2",
              "extract": true,
              "stripComponents": 1,
              "targetDir": "~/.openclaw/tools/sherpa-onnx-tts/runtime",
              "label": "下載 sherpa-onnx 執行時期 (Linux x64)",
            },
            {
              "id": "download-runtime-win-x64",
              "kind": "download",
              "os": ["win32"],
              "url": "https://github.com/k2-fsa/sherpa-onnx/releases/download/v1.12.23/sherpa-onnx-v1.12.23-win-x64-shared.tar.bz2",
              "archive": "tar.bz2",
              "extract": true,
              "stripComponents": 1,
              "targetDir": "~/.openclaw/tools/sherpa-onnx-tts/runtime",
              "label": "下載 sherpa-onnx 執行時期 (Windows x64)",
            },
            {
              "id": "download-model-lessac",
              "kind": "download",
              "url": "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-en_US-lessac-high.tar.bz2",
              "archive": "tar.bz2",
              "extract": true,
              "targetDir": "~/.openclaw/tools/sherpa-onnx-tts/models",
              "label": "下載 Piper en_US lessac (高品質) 語音模型",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# sherpa-onnx-tts

使用 sherpa-onnx 離線 CLI 進行本地端 TTS。

## 安裝步驟

1. 下載適用於您作業系統的執行時期 (Runtime)（解壓縮至 `~/.openclaw/tools/sherpa-onnx-tts/runtime`）。
2. 下載語音模型（解壓縮至 `~/.openclaw/tools/sherpa-onnx-tts/models`）。

更新 `~/.openclaw/openclaw.json`：

```json5
{
  skills: {
    entries: {
      "sherpa-onnx-tts": {
        env: {
          SHERPA_ONNX_RUNTIME_DIR: "~/.openclaw/tools/sherpa-onnx-tts/runtime",
          SHERPA_ONNX_MODEL_DIR: "~/.openclaw/tools/sherpa-onnx-tts/models/vits-piper-en_US-lessac-high",
        },
      },
    },
  },
}
```

封裝腳本 (Wrapper) 位於此技能資料夾內。您可以直接執行它，或將其路徑加入 PATH：

```bash
export PATH="{baseDir}/bin:$PATH"
```

## 用法

```bash
{baseDir}/bin/sherpa-onnx-tts -o ./tts.wav "來自本地端 TTS 的問候。"
```

## 注意事項

- 若需要其它語音，請從 sherpa-onnx 的 `tts-models` 發佈頁面挑選不同模型。
- 若模型目錄包含多個 `.onnx` 檔案，請設定 `SHERPA_ONNX_MODEL_FILE` 或傳遞 `--model-file` 參數。
- Windows 使用者：請執行 `node {baseDir}\bin\sherpa-onnx-tts -o tts.wav "來自本地端 TTS 的問候。"`。
