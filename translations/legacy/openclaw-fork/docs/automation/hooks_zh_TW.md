---
summary: "勾子 (Hooks)：針對指令與生命週期事件的事件驅動自動化系統說明"
read_when:
  - 您想要針對 /new, /reset, /stop 與代理人生命週期事件進行自動化時
  - 您想要建置、安裝或偵錯勾子時
title: "勾子 (Hooks)"
---

> 此文件為 [English Version](/automation/hooks_zh_TW) 的繁體中文版本。

# 勾子 (Hooks)

勾子提供一個可擴充的事件驅動系統，用於自動化回應代理人的指令與事件。勾子會自動從目錄中被發現，並可透過 CLI 指令進行管理，運作方式類似於 OpenClaw 的技能 (Skills)。

## 概觀

勾子是當特定事件發生時執行的小型腳本。主要分為兩類：
- **內部勾子 (Hooks)** (本頁面)：在閘道器內執行，回應如 `/new`, `/reset`, `/stop` 或生命週期事件。
- **外部勾子 (Webhooks)**：外部 HTTP 進入點，用於觸發 OpenClaw 的工作。

常見用途：
- 在重置工作階段時自動儲存記憶快照。
- 保留指令稽核日誌。
- 在對話開始或結束時觸發後續自動化。

## 快速開始

### 內建勾子
OpenClaw 隨附三個內建勾子：
- **session-memory**：執行 `/new` 時將工作階段上下文存入記憶體。
- **command-logger**：將所有指令記錄至 `commands.log`。
- **boot-md**：閘道器啟動時自動執行 `BOOT.md`。

常用指令：
```bash
openclaw hooks list (列出勾子)
openclaw hooks enable <名稱> (啟用)
openclaw hooks check (檢查適用性)
```

## 勾子結構
每個勾子都是一個資料夾，包含：
- `HOOK.md`：詮釋資料與說明文件。
- `handler.ts`：處理程式實作。

## 建立自訂勾子
1. 在 `~/.openclaw/hooks/` 下建立資料夾。
2. 撰寫 `HOOK.md` 定義事件（如 `command:new`）。
3. 撰寫 `handler.ts` 導出一個處理函數。
4. 使用 `openclaw hooks enable` 啟用並重啟閘道器。

## 最佳實踐
- **保持執行速度**：處理程式應輕量，耗時任務應在背景執行。
- **錯誤處理**：務必使用 try-catch 包裹風險操作，避免中斷其它勾子執行。
- **精確過濾**：在詮釋資料中指定確切事件（如 `command:new`）而非通用事件。
