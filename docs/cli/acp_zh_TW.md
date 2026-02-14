---
summary: "為 IDE 整合執行 ACP 橋接程式"
read_when:
  - 設定基於 ACP 的 IDE 整合時
  - 偵錯 ACP 工作階段路由至閘道器的過程時
title: "acp"
---

> 此文件為 [English Version](/cli/acp_zh_TW) 的繁體中文版本。

# acp

執行與 OpenClaw 閘道器 (Gateway) 通訊的 ACP (Agent Client Protocol) 橋接程式。

此指令針對 IDE 透過 stdio 進行 ACP 通訊，並將提示詞透過 WebSocket 轉發至閘道器。它負責將 ACP 工作階段映射至閘道器的工作階段金鑰 (Session keys)。

## 用法

```bash
openclaw acp

# 使用遠端閘道器
openclaw acp --url wss://gateway-host:18789 --token <權杖>

# 連結至現有的工作階段金鑰
openclaw acp --session agent:main:main

# 透過標籤連結 (標籤必須已存在)
openclaw acp --session-label "支援收件匣"

# 在發送第一個提示詞前重置工作階段
openclaw acp --session agent:main:main --reset-session
```

## ACP 用戶端 (偵錯用)

使用內建的 ACP 用戶端，在沒有 IDE 的情況下驗證橋接程式是否正常。它會啟動 ACP 橋接程式並讓您以互動方式輸入提示詞。

```bash
openclaw acp client

# 將啟動的橋接程式指向遠端閘道器
openclaw acp client --server-args --url wss://gateway-host:18789 --token <權杖>
```

## 如何使用

當 IDE（或其它客戶端）支援 ACP 協定，且您希望它驅動 OpenClaw 閘道器工作階段時，請使用 ACP。

1. 確保閘道器正在執行（本地或遠端）。
2. 配置閘道器目標（透過組態或參數）。
3. 將您的 IDE 指向透過 stdio 執行 `openclaw acp`。

## Zed 編輯器設定

在 `~/.config/zed/settings.json` 中新增自訂 ACP 代理人：

```json
{
  "agent_servers": {
    "OpenClaw ACP": {
      "type": "custom",
      "command": "openclaw",
      "args": ["acp"],
      "env": {}
    }
  }
}
```

在 Zed 中開啟 Agent 面板，選擇 「OpenClaw ACP」即可開始。

## 工作階段映射 (Session mapping)

預設情況下，ACP 工作階段會獲得一個帶有 `acp:` 前綴的獨立閘道器工作階段金鑰。若要重用已知的工作階段，請傳遞金鑰或標籤。

關於工作階段金鑰的詳細資訊，請參閱 [工作階段概念](/concepts/session_zh_TW)。
