---
summary: "測試工具組：單元/E2E/實時測試套件、Docker 執行器以及各項測試涵蓋範圍說明"
read_when:
  - 在本地或 CI 環境執行測試時
  - 為模型/提供者 Bug 新增迴歸測試時
  - 偵錯閘道器與代理人行為時
title: "測試"
---

> 此文件為 [English Version](/help/testing_zh_TW) 的繁體中文版本。

# 測試 (Testing)

OpenClaw 擁有三套 Vitest 測試套件（單元/整合、E2E、實時）以及一組 Docker 執行器。

## 快速開始

- **全面檢查**（推送前必做）：`pnpm build && pnpm check && pnpm test`。
- **覆蓋率檢查**：`pnpm test:coverage`。
- **E2E 冒煙測試**：`pnpm test:e2e`。
- **實時測試**（需真實 API 密鑰）：`pnpm test:live`。

## 測試套件說明

### 1. 單元與整合測試 (Unit / Integration)
- **指令**：`pnpm test`。
- **範圍**：純單元測試、程序內整合測試（驗證、路由、工具、剖析、組態）。
- **特點**：在 CI 中執行，無需真實密鑰，速度快且穩定。

### 2. E2E 閘道器冒煙測試 (Gateway Smoke)
- **指令**：`pnpm test:e2e`。
- **範圍**：多實例閘道器的端到端行為、WebSocket/HTTP 介面、節點配對。
- **特點**：在 CI 中執行，涉及網路通訊，較單元測試慢。

### 3. 實時測試 (Live - 真實提供者與模型)
- **指令**：`pnpm test:live` (設定 `OPENCLAW_LIVE_TEST=1`)。
- **範圍**：驗證提供者 API 格式變動、工具呼叫怪癖、驗證問題與速率限制行為。
- **特點**：非 CI 穩定（依賴真實網路與配額），會產生實際費用。支援從 `~/.profile` 自動讀取密鑰。

## 實時測試：模型矩陣 (Model Matrix)
推薦定期在開發機器上測試以下「現代模型集」：
- **OpenAI**：`openai/gpt-5.2`
- **Anthropic**：`anthropic/claude-opus-4-6` (或 `sonnet-4-5`)
- **Google**：`google/gemini-3-pro-preview`
- **Z.AI (GLM)**：`zai/glm-4.7`
- **MiniMax**：`minimax/minimax-m2.1`

執行指令範例：
`OPENCLAW_LIVE_GATEWAY_MODELS="openai/gpt-5.2,anthropic/claude-opus-4-6,..." pnpm test:live`

## Docker 執行器
這些執行器在 Docker 映像檔內執行測試，驗證「在 Linux 下是否運作正常」：
- `pnpm test:docker:live-models`
- `pnpm test:docker:live-gateway`
- `pnpm test:docker:onboard` (引導精靈完整流程)
