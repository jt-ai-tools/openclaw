# @openclaw/zalo

針對 OpenClaw 的 Zalo 頻道外掛程式 (Bot API)。

## 安裝 (本地檢出)

```bash
openclaw plugins install ./extensions/zalo
```

## 安裝 (npm)

```bash
openclaw plugins install @openclaw/zalo
```

引導設定 (Onboarding)：選擇 Zalo 並確認安裝提示，系統將自動獲取外掛程式。

## 組態設定 (Config)

```json5
{
  channels: {
    zalo: {
      enabled: true,
      botToken: "12345689:abc-xyz",
      dmPolicy: "pairing",
      proxy: "http://proxy.local:8080",
    },
  },
}
```

## Webhook 模式

```json5
{
  channels: {
    zalo: {
      webhookUrl: "https://example.com/zalo-webhook",
      webhookSecret: "您的秘密金鑰-8位字元以上",
      webhookPath: "/zalo-webhook",
    },
  },
}
```

如果省略 `webhookPath`，外掛程式將使用 Webhook URL 的路徑。

修改組態後請重啟閘道器 (Gateway)。
