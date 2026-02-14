---
summary: "瀏覽器自動化的手動登入與 X (Twitter) 發文指引"
read_when:
  - 您需要為瀏覽器自動化登入網站時
  - 您想要在 X (Twitter) 上發布更新時
title: "瀏覽器登入"
---

> 此文件為 [English Version](/tools/browser-login_zh_TW) 的繁體中文版本。

# 瀏覽器登入與 X (Twitter) 發文

## 手動登入（建議方式）

當網站需要登入時，請在 **主機 (Host)** 瀏覽器設定檔（即 `openclaw` 瀏覽器）中 **手動登入**。

**切勿** 將您的憑證交給模型。自動化登入通常會觸發反機器人防禦機制，並可能導致帳號被鎖定。

瀏覽器主文件請參閱：[瀏覽器 (Browser)](/tools/browser_zh_TW)。

## 使用的是哪一個 Chrome 設定檔？

OpenClaw 控制一個 **專用的 Chrome 設定檔**（名為 `openclaw`，具備橘色 UI 標記）。這與您的日常瀏覽器設定檔是分開的。

您可以透過以下方式存取：
1. **要求代理人開啟瀏覽器**，然後由您自己手動登入。
2. **透過 CLI 開啟**：

```bash
openclaw browser start
openclaw browser open https://x.com
```

## X (Twitter)：推薦流程

- **讀取/搜尋/串文**：使用主機瀏覽器（手動登入）。
- **發布更新**：使用主機瀏覽器（手動登入）。

## 沙箱化與主機瀏覽器存取

沙箱化的瀏覽器工作階段 **更容易** 觸發機器人偵測。對於 X (Twitter) 等嚴格的網站，請優先使用主機瀏覽器。

若代理人正處於沙箱中，瀏覽器工具預設會使用沙箱。若要允許主機控制，請設定：

```json5
{
  agents: {
    defaults: {
      sandbox: {
        browser: {
          allowHostControl: true,
        },
      },
    },
  },
}
```

接著指定主機作為目標：
`openclaw browser open https://x.com --target host`
