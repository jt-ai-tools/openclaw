---
summary: "傳出回應的文字轉語音 (TTS) 功能說明"
read_when:
  - 啟用回應的文字轉語音功能時
  - 配置 TTS 提供者或限制時
  - 使用 /tts 指令時
title: "文字轉語音 (TTS)"
---

> 此文件為 [English Version](/tts) 的繁體中文版本。

# 文字轉語音 (TTS)

OpenClaw 可以使用 ElevenLabs、OpenAI 或 Edge TTS 將傳出的回應轉換為音訊。此功能適用於任何 OpenClaw 可發送音訊的頻道；在 Telegram 中會以圓形語音訊息泡泡的形式呈現。

## 支援的服務

- **ElevenLabs**（主要或備援提供者）
- **OpenAI**（主要或備援提供者；也用於摘要）
- **Edge TTS**（主要或備援提供者；使用 `node-edge-tts`，在無 API 密鑰時的預設選項）

### Edge TTS 注意事項

Edge TTS 透過 `node-edge-tts` 函式庫使用 Microsoft Edge 的線上神經網路 TTS 服務。這是一個代管服務（非本地端），使用 Microsoft 的端點，且 **不需要** API 密鑰。`node-edge-tts` 提供語音組態選項與輸出格式，但並非所有選項皆受 Edge 服務支援。

由於 Edge TTS 是一個沒有公開 SLA 或額度的公共網路服務，請將其視為「盡力而為 (best-effort)」。如果您需要保證的限制與支援，請使用 OpenAI 或 ElevenLabs。Microsoft 的語音 REST API 說明每次請求有 10 分鐘的音訊限制；Edge TTS 未公開限制，因此請假設具有類似或更低的限制。

## 選用金鑰

如果您想要使用 OpenAI 或 ElevenLabs：

- `ELEVENLABS_API_KEY` (或 `XI_API_KEY`)
- `OPENAI_API_KEY`

Edge TTS **不需要** API 密鑰。如果找不到 API 密鑰，OpenClaw 將預設使用 Edge TTS（除非透過 `messages.tts.edge.enabled=false` 停用）。

如果配置了多個提供者，則會優先使用選定的提供者，其他則作為備援選項。自動摘要使用配置的 `summaryModel`（或 `agents.defaults.model.primary`），因此如果您啟用了摘要功能，該提供者也必須通過驗證。

## 服務連結

- [OpenAI 文字轉語音指南](https://platform.openai.com/docs/guides/text-to-speech)
- [OpenAI 音訊 API 參考](https://platform.openai.com/docs/api-reference/audio)
- [ElevenLabs 文字轉語音](https://elevenlabs.io/docs/api-reference/text-to-speech)
- [ElevenLabs 驗證](https://elevenlabs.io/docs/api-reference/authentication)
- [node-edge-tts](https://github.com/SchneeHertz/node-edge-tts)
- [Microsoft 語音輸出格式](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech#audio-outputs)

## 預設是否啟用？

不。自動 TTS 預設為 **關閉 (off)**。請在組態中使用 `messages.tts.auto` 啟用，或在對談中使用 `/tts always`（別名：`/tts on`）開啟。

一旦開啟 TTS，Edge TTS 預設為 **啟用**，且在沒有 OpenAI 或 ElevenLabs API 密鑰時會自動被使用。

## 組態設定 (Config)

TTS 組態位於 `openclaw.json` 中的 `messages.tts` 區段。
完整結構請參閱 [閘道器組態](/gateway/configuration_zh_TW)。

### 最簡組態（啟用 + 提供者）

```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "elevenlabs",
    },
  },
}
```

### 以 OpenAI 為主，ElevenLabs 為備援

```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "openai",
      summaryModel: "openai/gpt-4.1-mini",
      modelOverrides: {
        enabled: true,
      },
      openai: {
        apiKey: "openai_api_key",
        model: "gpt-4o-mini-tts",
        voice: "alloy",
      },
      elevenlabs: {
        apiKey: "elevenlabs_api_key",
        baseUrl: "https://api.elevenlabs.io",
        voiceId: "voice_id",
        modelId: "eleven_multilingual_v2",
        seed: 42,
        applyTextNormalization: "auto",
        languageCode: "zh",
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.75,
          style: 0.0,
          useSpeakerBoost: true,
          speed: 1.0,
        },
      },
    },
  },
}
```

### 以 Edge TTS 為主（無需 API 密鑰）

```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "edge",
      edge: {
        enabled: true,
        voice: "zh-TW-HsiaoChenNeural",
        lang: "zh-TW",
        outputFormat: "audio-24khz-48kbitrate-mono-mp3",
        rate: "+10%",
        pitch: "-5%",
      },
    },
  },
}
```

### 停用 Edge TTS

```json5
{
  messages: {
    tts: {
      edge: {
        enabled: false,
      },
    },
  },
}
```

### 自訂限制與偏好設定路徑

```json5
{
  messages: {
    tts: {
      auto: "always",
      maxTextLength: 4000,
      timeoutMs: 30000,
      prefsPath: "~/.openclaw/settings/tts.json",
    },
  },
}
```

### 僅在收到語音訊息後以音訊回覆

```json5
{
  messages: {
    tts: {
      auto: "inbound",
    },
  },
}
```

### 針對長篇回應停用自動摘要

```json5
{
  messages: {
    tts: {
      auto: "always",
    },
  },
}
```

接著執行：

```
/tts summary off
```

### 欄位說明

- `auto`: 自動 TTS 模式 (`off`, `always`, `inbound`, `tagged`)。
  - `inbound` 僅在收到傳入的語音訊息後發送音訊。
  - `tagged` 僅在回應包含 `[[tts]]` 標籤時發送音訊。
- `enabled`: 舊版開關（`doctor` 會將其遷移至 `auto`）。
- `mode`: `"final"`（預設）或 `"all"`（包含工具/區塊回應）。
- `provider`: `"elevenlabs"`, `"openai"`, 或 `"edge"`（備援是自動的）。
- 如果 `provider` **未設定**，OpenClaw 會優先選擇 `openai`（如有密鑰），接著是 `elevenlabs`（如有密鑰），否則使用 `edge`。
- `summaryModel`: 用於自動摘要的選用廉價模型；預設為 `agents.defaults.model.primary`。
  - 接受 `provider/model` 或配置的模型別名。
- `modelOverrides`: 允許模型發出 TTS 指令（預設為開啟）。
- `maxTextLength`: TTS 輸入的硬性限制（字元數）。若超過此限制，`/tts audio` 將失敗。
- `timeoutMs`: 請求逾時時間（毫秒）。
- `prefsPath`: 覆寫本地偏好設定 JSON 路徑（提供者/限制/摘要）。
- `apiKey` 值會回退至環境變數 (`ELEVENLABS_API_KEY`/`XI_API_KEY`, `OPENAI_API_KEY`)。
- `elevenlabs.voiceSettings`:
  - `stability`, `similarityBoost`, `style`: `0..1`
  - `useSpeakerBoost`: `true|false`
  - `speed`: `0.5..2.0` (1.0 = 正常)
- `elevenlabs.applyTextNormalization`: `auto|on|off`
- `elevenlabs.languageCode`: 2 字母 ISO 639-1 代碼 (例如 `zh`, `en`)
- `elevenlabs.seed`: 整數 `0..4294967295` (盡力實現確定性)
- `edge.enabled`: 允許使用 Edge TTS (預設 `true`；無需 API 密鑰)。
- `edge.voice`: Edge 神經網路語音名稱 (例如 `zh-TW-HsiaoChenNeural`)。
- `edge.lang`: 語言代碼 (例如 `zh-TW`)。
- `edge.outputFormat`: Edge 輸出格式。
- `edge.rate` / `edge.pitch` / `edge.volume`: 百分比字串 (例如 `+10%`, `-5%`)。

## 模型驅動的覆寫 (預設開啟)

預設情況下，模型 **可以** 針對單次回應發出 TTS 指令。
當 `messages.tts.auto` 為 `tagged` 時，必須包含這些指令才能觸發音訊。

啟用後，模型可以發出 `[[tts:...]]` 指令來覆寫單次回應的語音，以及選用的 `[[tts:text]]...[[/tts:text]]` 區塊，以提供僅應出現在音訊中的表情標籤（笑聲、唱歌提示等）。

範例回應內容：

```
Here you go.

[[tts:provider=elevenlabs voiceId=pMsXgVXv3BLzUgSXRplE model=eleven_v3 speed=1.1]]
[[tts:text]](笑聲) 請再讀一次這首歌。[[/tts:text]]
```

可用的指令鍵值：

- `provider` (`openai` | `elevenlabs` | `edge`)
- `voice` (OpenAI 語音) 或 `voiceId` (ElevenLabs)
- `model` (OpenAI TTS 模型或 ElevenLabs 模型 ID)
- `stability`, `similarityBoost`, `style`, `speed`, `useSpeakerBoost`
- `applyTextNormalization` (`auto|on|off`)
- `languageCode` (ISO 639-1)
- `seed`

停用所有模型覆寫：

```json5
{
  messages: {
    tts: {
      modelOverrides: {
        enabled: false,
      },
    },
  },
}
```

## 使用者偏好設定

斜線指令會將本地覆寫寫入 `prefsPath`（預設：`~/.openclaw/settings/tts.json`）。

儲存的欄位：

- `enabled`
- `provider`
- `maxLength` (摘要閾值；預設 1500 字元)
- `summarize` (預設 `true`)

這些設定會針對該主機覆寫 `messages.tts.*`。

## 輸出格式 (固定)

- **Telegram**: Opus 語音訊息 (`opus_48000_64` 來自 ElevenLabs, `opus` 來自 OpenAI)。
  - 48kHz / 64kbps 是語音訊息的最佳權衡，也是圓形泡泡所需的格式。
- **其他頻道**: MP3 (`mp3_44100_128` 來自 ElevenLabs, `mp3` 來自 OpenAI)。
  - 44.1kHz / 128kbps 是語音清晰度的預設平衡。
- **Edge TTS**: 使用 `edge.outputFormat` (預設 `audio-24khz-48kbitrate-mono-mp3`)。

## 自動 TTS 行為

啟用後，OpenClaw 會：

- 如果回應已包含媒體或 `MEDIA:` 指令，則跳過 TTS。
- 跳過非常短的回應 (< 10 字元)。
- 對長篇回應進行摘要（如果啟用），使用 `agents.defaults.model.primary` (或 `summaryModel`)。
- 將產生的音訊附加至回應。

## 斜線指令用法

單一指令：`/tts`。
Discord 注意事項：`/tts` 是 Discord 內建指令，因此 OpenClaw 在該處註冊 `/voice` 為原生指令。文字 `/tts ...` 仍可運作。

```
/tts off
/tts always
/tts inbound
/tts tagged
/tts status
/tts provider openai
/tts limit 2000
/tts summary off
/tts audio 來自 OpenClaw 的問候
```

## 代理人工具

`tts` 工具將文字轉換為語音並回傳 `MEDIA:` 路徑。當結果與 Telegram 相容時，工具會包含 `[[audio_as_voice]]`，以便 Telegram 以語音泡泡形式發送。
