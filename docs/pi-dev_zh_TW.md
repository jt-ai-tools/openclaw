---
title: "Pi 開發工作流 (Pi Development Workflow)"
---

> 此文件為 [English Version](/pi-dev_zh_TW) 的繁體中文版本。

# Pi 開發工作流 (Pi Development Workflow)

本指南總結了在 OpenClaw 中進行 Pi 整合開發的合理工作流程。

## 型別檢查與 Lint

- 型別檢查與建置：`pnpm build`
- Lint (程式碼靜態分析)：`pnpm lint`
- 格式檢查：`pnpm format`
- 推送前的完整門控檢查 (Full gate)：`pnpm lint && pnpm build && pnpm test`

## 執行 Pi 測試

針對 Pi 整合測試集使用專屬腳本：

```bash
scripts/pi/run-tests.sh
```

若要包含執行實際提供者行為的實測 (Live test)：

```bash
scripts/pi/run-tests.sh --live
```

此腳本會透過以下路徑匹配 (Globs) 執行所有與 Pi 相關的單元測試：

- `src/agents/pi-*.test.ts`
- `src/agents/pi-embedded-*.test.ts`
- `src/agents/pi-tools*.test.ts`
- `src/agents/pi-settings.test.ts`
- `src/agents/pi-tool-definition-adapter.test.ts`
- `src/agents/pi-extensions/*.test.ts`

## 手動測試

建議流程：

- 以開發模式執行閘道器 (Gateway)：
  - `pnpm gateway:dev`
- 直接觸發代理人：
  - `pnpm openclaw agent --message "Hello" --thinking low`
- 使用 TUI 進行互動式偵錯：
  - `pnpm tui`

對於工具呼叫行為，請提示執行 `read` 或 `exec` 動作，以便查看工具串流與酬載處理情形。

## 全量重置 (Clean Slate Reset)

狀態儲存在 OpenClaw 狀態目錄下。預設為 `~/.openclaw`。如果設定了 `OPENCLAW_STATE_DIR`，請改用該目錄。

若要重置所有內容：

- `openclaw.json`：組態設定。
- `credentials/`：驗證設定檔與權杖。
- `agents/<agentId>/sessions/`：代理人工作階段歷史紀錄。
- `agents/<agentId>/sessions.json`：工作階段索引。
- `sessions/`：如果存在舊版路徑。
- `workspace/`：如果您想要一個空白的工作區。

如果您只想重置工作階段，請刪除該代理人的 `agents/<agentId>/sessions/` 與 `agents/<agentId>/sessions.json`。如果您不想重新驗證，請保留 `credentials/`。

## 參考資料

- [https://docs.openclaw.ai/testing](https://docs.openclaw.ai/testing)
- [https://docs.openclaw.ai/start/getting-started](https://docs.openclaw.ai/start/getting-started)
