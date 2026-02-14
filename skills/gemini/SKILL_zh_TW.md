---
name: gemini
description: 用於單次問答、摘要與內容產生的 Gemini CLI。
homepage: https://ai.google.dev/
metadata:
  {
    "openclaw":
      {
        "emoji": "♊️",
        "requires": { "bins": ["gemini"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "gemini-cli",
              "bins": ["gemini"],
              "label": "安裝 Gemini CLI (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# Gemini CLI

以「單次 (One-shot)」模式使用 Gemini，直接傳遞提示詞（避免進入互動模式）。

## 快速開始

- `gemini "回答這個問題..."`
- `gemini --model <模型名稱> "提示詞..."`
- `gemini --output-format json "以 JSON 格式回傳內容"`

## 擴充功能

- 列出：`gemini --list-extensions`
- 管理：`gemini extensions <指令>`

## 注意事項

- 若需要驗證，請先手動執行一次 `gemini` 並遵循登入流程。
- 為了安全起見，請避免使用 `--yolo` 參數。
