---
summary: "傳入音訊/語音訊息的下載、轉錄與注入回覆流程說明"
read_when:
  - 更改音訊轉錄或多媒體處理邏輯時
title: "音訊與語音訊息"
---

> 此文件為 [English Version](/nodes/audio_zh_TW) 的繁體中文版本。

# 音訊與語音訊息 (Audio / Voice Notes)

## 功能說明

- **多媒體理解 (音訊)**：若啟用了音訊理解，OpenClaw 會：
  1. 定位音訊附件並下載。
  2. 依序嘗試符合資格的模型（提供者或本地 CLI）。
  3. 成功後，將訊息正文替換為 `[Audio]` 區塊並設定 `{{Transcript}}`。
- **指令解析**：轉錄成功後，對話內容會被設為 `CommandBody`，因此語音訊息中的斜線指令（如「斜線重置」）依然有效。

## 自動偵測 (預設順序)

若未指定模型，OpenClaw 會依序偵測以下工具：
1. **本地 CLI**：`sherpa-onnx-offline`, `whisper-cli`, `whisper`。
2. **Gemini CLI**：透過 `gemini` 指令。
3. **雲端提供者**：OpenAI → Groq → Deepgram → Google。

若要關閉此功能，請設定 `tools.media.audio.enabled: false`。

## 群組中的提及偵測 (Mention Detection)

針對設定為 `requireMention: true` 的群組，OpenClaw 現在會 **先轉錄音訊** 再檢查是否被標記 (Ping)。
- **運作流程**：收到語音訊息 → 執行「預檢轉錄」 → 檢查轉錄內容是否包含 `@機器人` 或觸發詞 → 若包含則繼續處理並回覆。
- 這代表您可以透過語音訊息說出：「嘿 @Claude，幫我查一下天氣」，代理人將能正確識別並回應。

## 注意事項與限制
- **檔案大小**：預設上限為 20MB (`maxBytes`)。
- **逾時設定**：預設為 60 秒，以避免阻塞回覆佇列。
- **提供者驗證**：遵循標準的模型驗證順序（設定檔、環境變數、組態檔案）。
