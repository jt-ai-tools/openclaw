---
summary: "將 WhatsApp 訊息廣播至多個代理人同時處理"
read_when:
  - 配置廣播群組時
  - 偵錯 WhatsApp 中的多代理人回覆時
status: 實驗性
title: "廣播群組"
---

> 此文件為 [English Version](/channels/broadcast-groups_zh_TW) 的繁體中文版本。

# 廣播群組 (Broadcast Groups)

**目前狀態**：實驗性 (Experimental)
**發佈版本**：2026.1.9 新增

## 概觀

廣播群組讓多個代理人能夠同時處理並回應同一則訊息。這讓您可以在單一 WhatsApp 群組或私訊中建立協作的專業代理人團隊 —— 且全部共用同一個電話號碼。

目前僅支援：**WhatsApp**。

## 使用情境

### 1. 專業代理人團隊
部署多個職責明確的代理人：
- **CodeReviewer**：審查程式碼片段。
- **DocumentationBot**：產生文件。
- **SecurityAuditor**：檢查安全性漏洞。

### 2. 多語言支援
根據同一則訊息，由不同語言的代理人分別回覆。

## 組態設定

在 `openclaw.json` 頂層新增 `broadcast` 區段。鍵值為 WhatsApp 的 Peer ID（群組 JID 或 E.164 門號）：

```json
{
  "broadcast": {
    "120363403215116621@g.us": ["alfred", "baerbel", "assistant3"]
  }
}
```

### 執行策略 (Strategy)
- **parallel** (預設)：所有代理人同時並行處理。
- **sequential**：代理人依序處理（一個結束後才換下一個）。

## 工作原理

### 工作階段隔離
廣播群組中的每個代理人保持完全獨立：
- **獨立工作階段金鑰**：代理人間看不到彼此的訊息。
- **獨立工作區**：可配置不同的沙箱。
- **獨立工具權限**：例如一個唯讀，一個可寫。
- **獨立模型**：例如一個用 Opus，一個用 Sonnet。

## 相關資訊：
- [多代理人組態](/tools/multi-agent-sandbox-tools_zh_TW)
- [頻道路由組態](/channels/channel-routing_zh_TW)
- [工作階段管理](/concepts/session_zh_TW)
