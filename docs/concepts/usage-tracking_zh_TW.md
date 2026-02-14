---
summary: "用量追蹤介面與憑證要求說明"
read_when:
  - 您正在串接提供者的用量/額度介面時
  - 您需要解釋用量追蹤行為或驗證要求時
title: "用量追蹤"
---

> 此文件為 [English Version](/concepts/usage-tracking) 的繁體中文版本。

# 用量追蹤 (Usage tracking)

## 它是什麼

- 直接從提供者的用量端點獲取用量/額度資訊。
- 不使用估算成本；僅顯示提供者回報的統計期間。

## 顯示位置

- 對談中的 `/status`：包含工作階段 Token 數與預估成本（僅限 API Key）的豐富 Emoji 狀態卡。當可用時，會顯示 **目前模型提供者** 的用量。
- 對談中的 `/usage off|tokens|full`：每則回應的用量註腳（OAuth 僅顯示 Token 數）。
- 對談中的 `/usage cost`：從 OpenClaw 工作階段紀錄彙整而來的本地成本摘要。
- CLI：`openclaw status --usage` 印出每個提供者的完整用量細目。
- CLI：`openclaw channels list` 在印出提供者組態時一併顯示用量快照（使用 `--no-usage` 可跳過）。
- macOS 選單列：Context 下方的「Usage」區塊（僅在可用時顯示）。

## 提供者與憑證

- **Anthropic (Claude)**：驗證設定檔中的 OAuth 權杖。
- **GitHub Copilot**：驗證設定檔中的 OAuth 權杖。
- **Gemini CLI**：驗證設定檔中的 OAuth 權杖。
- **Antigravity**：驗證設定檔中的 OAuth 權杖。
- **OpenAI Codex**：驗證設定檔中的 OAuth 權杖（若存在 `accountId` 則會使用）。
- **MiniMax**：API 密鑰（程式碼方案密鑰；`MINIMAX_CODE_PLAN_KEY` 或 `MINIMAX_API_KEY`）；使用 5 小時程式碼方案期間。
- **z.ai**：透過環境變數/組態/驗證儲存庫取得的 API 密鑰。

若不存在相符的 OAuth/API 憑證，則會隱藏用量資訊。
