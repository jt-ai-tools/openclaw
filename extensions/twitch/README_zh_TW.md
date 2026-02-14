# @openclaw/twitch

針對 OpenClaw 的 Twitch 頻道外掛程式。

## 安裝 (本地檢出)

```bash
openclaw plugins install ./extensions/twitch
```

## 安裝 (npm)

```bash
openclaw plugins install @openclaw/twitch
```

引導設定 (Onboarding)：選擇 Twitch 並確認安裝提示，系統將自動獲取外掛程式。

## 組態設定 (Config)

最簡組態（簡化單帳號）：

**⚠️ 重要：** `requireMention` 預設為 `true`。請務必新增存取控制（`allowFrom` 或 `allowedRoles`），以防止未經授權的使用者觸發機器人。

```json5
{
  channels: {
    twitch: {
      enabled: true,
      username: "openclaw",
      accessToken: "oauth:abc123...", // OAuth 存取權杖 (需加上 oauth: 前綴)
      clientId: "xyz789...", // 來自權杖產生器的 Client ID
      channel: "vevisk", // 要加入的頻道 (必填)
      allowFrom: ["123456789"], // (建議) 僅限您的 Twitch 使用者 ID（可於 https://www.streamweasels.com/tools/convert-twitch-username-%20to-user-id/ 將使用者名稱轉換為 ID）
    },
  },
}
```

**存取控制選項：**

- `requireMention: false` - 停用預設的提及要求，以回應所有訊息。
- `allowFrom: ["您的使用者ID"]` - 僅限您的 Twitch 使用者 ID（可於 https://www.twitchangles.com/xqc 或類似網站找到您的 ID）。
- `allowedRoles: ["moderator", "vip", "subscriber"]` - 限制特定角色。

多帳號組態（進階）：

```json5
{
  channels: {
    twitch: {
      enabled: true,
      accounts: {
        default: {
          username: "openclaw",
          accessToken: "oauth:abc123...",
          clientId: "xyz789...",
          channel: "vevisk",
        },
        channel2: {
          username: "openclaw",
          accessToken: "oauth:def456...",
          clientId: "uvw012...",
          channel: "secondchannel",
        },
      },
    },
  },
}
```

## 設定步驟

1. 為機器人建立一個專用的 Twitch 帳號，然後產生憑證：[Twitch 權杖產生器 (Twitch Token Generator)](https://twitchtokengenerator.com/)
   - 選擇 **Bot Token**。
   - 確認已勾選 `chat:read` 與 `chat:write` 權限範圍 (Scopes)。
   - 將 **Access Token** 複製到 `token` 屬性。
   - 將 **Client ID** 複製到 `clientId` 屬性。
2. 啟動閘道器 (Gateway)。

## 完整說明文件

請參閱 https://docs.openclaw.ai/channels/twitch 以瞭解：

- 權杖重新整理設定
- 存取控制模式
- 多帳號組態
- 疑難排解
- 功能與限制
