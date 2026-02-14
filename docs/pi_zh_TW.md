---
title: "Pi 整合架構 (Pi Integration Architecture)"
---

> 此文件為 [English Version](/pi_zh_TW) 的繁體中文版本。

# Pi 整合架構 (Pi Integration Architecture)

本文件描述 OpenClaw 如何與 [pi-coding-agent](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent) 及其兄弟套件（`pi-ai`, `pi-agent-core`, `pi-tui`）整合，以驅動其 AI 代理人能力。

## 概觀

OpenClaw 使用 pi SDK 將 AI 程式碼代理人內嵌至其訊息閘道器架構中。OpenClaw 並非以子程序形式啟動 pi 或使用 RPC 模式，而是透過 `createAgentSession()` 直接匯入並實例化 pi 的 `AgentSession`。這種內嵌方式提供了：

- 對工作階段生命週期與事件處理的完全控制。
- 自訂工具注入（訊息傳送、沙箱、頻道特定動作）。
- 針對不同頻道/上下文的系統提示詞自訂。
- 支援分支/壓縮 (Compaction) 的工作階段持久化。
- 具備容錯移轉 (Failover) 能力的多帳號驗證設定檔輪替。
- 與提供者無關 (Provider-agnostic) 的模型切換。

## 套件依賴關係 (Package Dependencies)

```json
{
  "@mariozechner/pi-agent-core": "0.49.3",
  "@mariozechner/pi-ai": "0.49.3",
  "@mariozechner/pi-coding-agent": "0.49.3",
  "@mariozechner/pi-tui": "0.49.3"
}
```

| 套件名稱           | 用途                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| `pi-ai`            | 核心 LLM 抽象化：`Model`, `streamSimple`, 訊息類型, 提供者 API                                          |
| `pi-agent-core`    | 代理人迴圈、工具執行、`AgentMessage` 類型                                                              |
| `pi-coding-agent`  | 高階 SDK：`createAgentSession`, `SessionManager`, `AuthStorage`, `ModelRegistry`, 內建工具             |
| `pi-tui`           | 終端機 UI 元件（用於 OpenClaw 的本地 TUI 模式）                                                        |

## 核心整合流程

### 1. 執行內嵌代理人

主要的入口點是 `src/agents/pi-embedded-runner/run.ts` 中的 `runEmbeddedPiAgent()`。

### 2. 建立工作階段 (Session Creation)

在 `runEmbeddedAttempt()` 內部，會使用 pi SDK 進行初始化，包含載入資源、配置驗證儲存庫與模型註冊表，並最終建立 `AgentSession`。

### 3. 事件訂閱 (Event Subscription)

`subscribeEmbeddedPiSession()` 會訂閱來自 pi `AgentSession` 的事件，包含：

- `message_start` / `message_end` / `message_update` (串流文字/推理)。
- `tool_execution_start` / `tool_execution_update` / `tool_execution_end`。
- `turn_start` / `turn_end`。
- `agent_start` / `agent_end`。
- `auto_compaction_start` / `auto_compaction_end`。

### 4. 提示發送 (Prompting)

設定完成後，工作階段將執行 `session.prompt()`。SDK 會處理完整的代理人迴圈：發送至 LLM、執行工具呼叫、串流回應內容。

## 工具架構 (Tool Architecture)

### 工具管線 (Tool Pipeline)

1. **基礎工具**：pi 的 `codingTools` (read, bash, edit, write)。
2. **自訂替換**：OpenClaw 以 `exec`/`process` 替換 bash，並針對沙箱環境自訂 read/edit/write。
3. **OpenClaw 工具**：訊息傳送、瀏覽器、畫布、工作階段、Cron 等。
4. **頻道工具**：Discord/Telegram/Slack/WhatsApp 專屬的動作工具。
5. **策略過濾**：工具會根據設定檔、提供者、代理人、群組與沙箱策略進行過濾。
6. **Schema 規範化**：針對 Gemini/OpenAI 的特性清理工具 Schema。
7. **AbortSignal 封裝**：工具會被封裝以遵循中止信號。

## 系統提示詞建置

系統提示詞是在 `buildAgentSystemPrompt()` 中建置的。它會彙整包含工具集、工具呼叫風格、安全防護欄、OpenClaw CLI 參考、技能 (Skills)、文件、工作區、沙箱、訊息傳送、回應標籤、語音、靜默回應、心跳與執行時期詮釋資料等區塊。

## 工作階段管理

### 工作階段檔案

工作階段為具備樹狀結構的 JSONL 檔案。pi 的 `SessionManager` 負責持久化處理。OpenClaw 透過 `guardSessionManager()` 對其進行封裝，以確保工具結果的安全性。

### 壓縮 (Compaction)

當上下文溢出時會觸發自動壓縮。`compactEmbeddedPiSessionDirect()` 則負責處理手動壓縮請求。

## 驗證與模型解析

### 驗證設定檔 (Auth Profiles)

OpenClaw 維護一個驗證設定檔儲存庫，每個提供者可擁有多組 API 密鑰。設定檔會在發生失敗時自動輪替，並具備冷卻追蹤機制。

### 模型解析

使用 pi 的 `ModelRegistry` 與 `AuthStorage` 進行模型解析。

### 容錯移轉 (Failover)

當配置了容錯移轉時，`FailoverError` 會觸發模型回退機制。

## Pi 擴充功能 (Pi Extensions)

OpenClaw 載入自訂的 pi 擴充功能以實現特殊行為：

- **壓縮防護欄 (Compaction Safeguard)**：為壓縮程序增加防護，包含自適應 Token 預算與工具執行摘要。
- **上下文裁剪 (Context Pruning)**：實作基於快取 TTL 的上下文裁剪機制。

## 串流處理與區塊回應

- **區塊分塊 (Block Chunking)**：`EmbeddedBlockChunker` 將串流文字管理為離散的回應區塊。
- **標籤清理**：處理串流輸出以移除 `<think>` 區塊並擷取 `<final>` 內容。
- **回應指令**：解析並擷取如 `[[media:url]]`, `[[voice]]` 等回應指令。

## 關鍵差異：Pi CLI vs OpenClaw 內嵌

| 面向            | Pi CLI                  | OpenClaw 內嵌實作                                                                              |
| --------------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| 呼叫方式        | `pi` 指令 / RPC         | 透過 `createAgentSession()` 使用 SDK                                                           |
| 工具            | 預設程式碼工具          | 自訂 OpenClaw 工具套件                                                                         |
| 系統提示詞      | AGENTS.md + 提示詞      | 根據頻道/上下文動態生成                                                                        |
| 工作階段儲存    | `~/.pi/agent/sessions/` | `~/.openclaw/agents/<agentId>/sessions/`                                                       |
| 驗證            | 單一憑證                | 具備輪替機制的多設定檔                                                                         |
| 外掛程式        | 從磁碟載入              | 程式化載入 + 磁碟路徑                                                                          |
| 事件處理        | TUI 渲染                | 基於回呼 (Callback)                                                                            |
