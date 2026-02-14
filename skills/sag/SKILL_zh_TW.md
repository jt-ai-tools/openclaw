---
name: sag
description: 具備 macOS `say` 風格體驗的 ElevenLabs 文字轉語音工具。
homepage: https://sag.sh
metadata:
  {
    "openclaw":
      {
        "emoji": "🗣️",
        "requires": { "bins": ["sag"], "env": ["ELEVENLABS_API_KEY"] },
        "primaryEnv": "ELEVENLABS_API_KEY",
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "steipete/tap/sag",
              "bins": ["sag"],
              "label": "安裝 sag (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# sag

使用 `sag` 進行 ElevenLabs TTS (文字轉語音) 並在本地端播放。

## API 密鑰 (必填)

- `ELEVENLABS_API_KEY`（建議使用）。
- CLI 也支援 `SAG_API_KEY`。

## 快速開始

- `sag "哈囉，你好"`。
- `sag speak -v "Roger" "你好"`。
- `sag voices` (列出語音)。
- `sag prompting` (模型專屬提示)。

## 模型說明

- 預設：`eleven_v3`（具備表現力）。
- 穩定：`eleven_multilingual_v2`。
- 快速：`eleven_flash_v2_5`。

## 發音與交付規則

- **拼寫修復**：使用連字號（如 "key-note"）或調整大小寫。
- **單位/URL 規範化**：`--normalize auto`（若損害專有名詞則設為 `off`）。
- **語系引導**：`--lang zh|en|de|...` 引導規範化方向。
- **停頓 (v3)**：不支援 SSML `<break>`；請使用 `[pause]`, `[short pause]`, `[long pause]`。

## v3 語音標籤（置於行首）

- `[whispers]` (竊竊私語), `[shouts]` (大喊), `[sings]` (唱歌)。
- `[laughs]` (笑), `[starts laughing]`, `[sighs]` (嘆氣), `[exhales]` (吐氣)。
- `[sarcastic]` (諷刺), `[curious]` (好奇), `[excited]` (興奮), `[crying]` (哭泣), `[mischievously]` (調皮地)。
- 範例：`sag "[whispers] 保持安靜。[short pause] 好嗎？"`

## 語音預設值

- `ELEVENLABS_VOICE_ID` 或 `SAG_VOICE_ID`。
- 長篇輸出前，請先確認語音與說話者。

## 對談語音回應

當 Peter 要求「語音」回覆時（例如：「瘋狂科學家語音」、「用說的」），產生音訊並發送：

```bash
# 產生音訊檔案
sag -v Clawd -o /tmp/voice-reply.mp3 "您的訊息內文"

# 接著在回覆中包含：
# MEDIA:/tmp/voice-reply.mp3
```

**語音性格小撇步：**
- 瘋狂科學家：使用 `[excited]` 標籤、戲劇性停頓 `[short pause]`。
- 冷靜：使用 `[whispers]` 或較慢語速。
- 戲劇化：適度使用 `[sings]` 或 `[shouts]`。

Clawd 的預設語音 ID：`lj2rcrvANS3gaWWnczSX`（或僅需使用 `-v Clawd`）。
