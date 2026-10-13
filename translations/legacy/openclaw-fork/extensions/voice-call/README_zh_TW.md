# @openclaw/voice-call

OpenClaw 官方 **語音通話 (Voice Call)** 外掛程式。

支援的提供者：

- **Twilio** (Programmable Voice + Media Streams)
- **Telnyx** (Call Control v2)
- **Plivo** (Voice API + XML 轉接 + GetInput 語音)
- **Mock** (開發用/無網路)

說明文件：`https://docs.openclaw.ai/plugins/voice-call`
外掛程式系統：`https://docs.openclaw.ai/plugin`

## 安裝 (本地開發)

### 選項 A：透過 OpenClaw 安裝 (建議方式)

```bash
openclaw plugins install @openclaw/voice-call
```

安裝後請重啟閘道器 (Gateway)。

### 選項 B：複製到您的全域擴充功能資料夾 (開發用)

```bash
mkdir -p ~/.openclaw/extensions
cp -R extensions/voice-call ~/.openclaw/extensions/voice-call
cd ~/.openclaw/extensions/voice-call && pnpm install
```

## 組態設定 (Config)

請將設定置於 `plugins.entries.voice-call.config` 下：

```json5
{
  provider: "twilio", // 或 "telnyx" | "plivo" | "mock"
  fromNumber: "+15550001234",
  toNumber: "+15550005678",

  twilio: {
    accountSid: "ACxxxxxxxx",
    authToken: "your_token",
  },

  plivo: {
    authId: "MAxxxxxxxxxxxxxxxxxxxx",
    authToken: "your_token",
  },

  // Webhook 伺服器
  serve: {
    port: 3334,
    path: "/voice/webhook",
  },

  // 公開存取 (擇一)：
  // publicUrl: "https://example.ngrok.app/voice/webhook",
  // tunnel: { provider: "ngrok" },
  // tailscale: { mode: "funnel", path: "/voice/webhook" }

  outbound: {
    defaultMode: "notify", // 或 "conversation" (對話模式)
  },

  streaming: {
    enabled: true,
    streamPath: "/voice/stream",
  },
}
```

注意事項：

- Twilio/Telnyx/Plivo 需要一個 **可從公網存取** 的 Webhook URL。
- `mock` 是一個本地開發用的提供者（不進行網路呼叫）。
- `tunnel.allowNgrokFreeTierLoopbackBypass: true` 僅在 `tunnel.provider="ngrok"` 且 `serve.bind` 為 loopback（ngrok 本地代理）時，允許不帶有效簽章的 Twilio Webhook。僅限本地開發使用。

## 通話的文字轉語音 (TTS)

語音通話外掛程式使用核心 `messages.tts` 組態（OpenAI 或 ElevenLabs）來進行通話中的語音串流。您可以在外掛程式組態中覆寫它，格式相同 —— 覆寫值將與 `messages.tts` 進行深度合併。

```json5
{
  tts: {
    provider: "openai",
    openai: {
      voice: "alloy",
    },
  },
}
```

注意事項：

- 語音通話會忽略 Edge TTS（電話音訊需要 PCM 格式；Edge 的輸出不夠穩定）。
- 當啟用了 Twilio 媒體串流時會使用核心 TTS；否則通話將回退至提供者的原生語音。

## CLI 指令

```bash
openclaw voicecall call --to "+15555550123" --message "來自 OpenClaw 的問候"
openclaw voicecall continue --call-id <id> --message "有任何問題嗎？"
openclaw voicecall speak --call-id <id> --message "請稍等"
openclaw voicecall end --call-id <id>
openclaw voicecall status --call-id <id>
openclaw voicecall tail
openclaw voicecall expose --mode funnel
```

## 工具 (Tool)

工具名稱：`voice_call`

動作 (Actions)：

- `initiate_call` (message, to?, mode?)：啟動通話。
- `continue_call` (callId, message)：繼續通話。
- `speak_to_user` (callId, message)：對使用者說話。
- `end_call` (callId)：結束通話。
- `get_status` (callId)：獲取狀態。

## 閘道器 RPC

- `voicecall.initiate` (to?, message, mode?)
- `voicecall.continue` (callId, message)
- `voicecall.speak` (callId, message)
- `voicecall.end` (callId)
- `voicecall.status` (callId)

## 注意事項

- 對 Twilio/Telnyx/Plivo 使用 Webhook 簽章驗證。
- `responseModel` 與 `responseSystemPrompt` 用於控制 AI 自動回應。
- 媒體串流需要 `ws` 與 OpenAI Realtime API 密鑰。
