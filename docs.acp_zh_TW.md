---
summary: "OpenClaw ACP 橋接器：工作原理、IDE 整合、工作階段映射與開發細節說明"
---

> 此文件為 [English Version](docs.acp_zh_TW.md) 的繁體中文版本。

# OpenClaw ACP 橋接器 (ACP Bridge)

本文件描述了 OpenClaw ACP (Agent Client Protocol) 橋接器的工作原理、如何將 ACP 工作階段映射至閘道器 (Gateway) 工作階段，以及 IDE 應如何調用。

## 概觀

`openclaw acp` 透過 stdio 公開一個 ACP 代理人，並透過 WebSocket 將提示詞 (Prompts) 轉發至執行中的 OpenClaw 閘道器。它保持 ACP 工作階段 ID 與閘道器工作階段金鑰的映射關係，使 IDE 能夠重新連線至同一個代理人逐字稿或按需求重置。

## 如何使用

當 IDE 或工具支援 Agent Client Protocol，且您希望它驅動 OpenClaw 閘道器工作階段時，請使用 ACP。

**快速步驟：**
1. 執行閘道器（本地或遠端）。
2. 配置閘道器目標（`gateway.remote.url` 與驗證資訊）。
3. 將您的 IDE 指向透過 stdio 執行 `openclaw acp`。

## 選擇代理人 (Agents)

ACP 透過閘道器工作階段金鑰進行路由。
使用代理人範圍的工作階段金鑰可鎖定特定代理人：
- `openclaw acp --session agent:main:main`
- `openclaw acp --session agent:design:main`

每個 ACP 工作階段映射至單一閘道器金鑰。預設會使用隔離的 `acp:<uuid>` 工作階段。

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

在 Zed 中開啟 Agent 面板並選擇「OpenClaw ACP」即可開始對話。

## 工作階段映射 (Session Mapping)

您可以透過兩種方式覆寫或重用工作階段：
1. **CLI 預設值**：`--session`, `--session-label`, `--reset-session`。
2. **每個工作階段的 ACP 元數據**：透過傳遞 `_meta` 物件。

## 提示詞翻譯 (Prompt Translation)

ACP 提示詞輸入會轉換為閘道器的 `chat.send`：
- 文字與資源區塊變為提示詞文字。
- 圖片資源變為附件。
- 閘道器串流事件會轉換回 ACP 的 `message` 與 `tool_call` 更新。

## 相關文件
- CLI 用法：`docs/cli/acp_zh_TW.md`
- 工作階段模型：`docs/concepts/session_zh_TW.md`
- 工作階段管理內部機制：`docs/reference/session-management-compaction_zh_TW.md`
