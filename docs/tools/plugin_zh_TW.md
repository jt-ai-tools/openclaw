---
summary: "OpenClaw 外掛程式與擴充功能：探索、組態設定與安全性說明"
read_when:
  - 新增或修改外掛程式/擴充功能時
  - 記錄外掛程式安裝或載入規則時
title: "外掛程式 (Plugins)"
---

> 此文件為 [English Version](/tools/plugin_zh_TW) 的繁體中文版本。

# 外掛程式與擴充功能 (Plugins / Extensions)

## 快速開始（外掛程式新手？）

外掛程式就是一個 **小型程式碼模組**，用於為 OpenClaw 擴充額外功能（如指令、工具與閘道器 RPC）。

**快速操作路徑：**
1. 查看已載入內容：`openclaw plugins list`。
2. 安裝官方外掛程式（以語音通話為例）：`openclaw plugins install @openclaw/voice-call`。
3. 重啟閘道器，然後在 `plugins.entries.<id>.config` 下進行配置。

## 核心機制

OpenClaw 外掛程式是執行時期透過 jiti 載入的 **TypeScript 模組**。外掛程式可以註冊：
- 閘道器 RPC 方法。
- 閘道器 HTTP 處理程式。
- 代理人工具。
- CLI 指令。
- 背景服務。
- **技能 (Skills)**。
- **自動回覆指令**（無需調用 AI 代理人即可執行）。

外掛程式與閘道器 **在同一個程序 (In-process) 內執行**，因此請將其視為受信任的程式碼。

## 探索與優先權

OpenClaw 依序掃描以下路徑，最先匹配者勝出：
1. **組態路徑**：`plugins.load.paths`。
2. **工作區擴充功能**：`<workspace>/.openclaw/extensions/`。
3. **全域擴充功能**：`~/.openclaw/extensions/`。
4. **內建擴充功能**：隨 OpenClaw 隨附，但 **預設停用**。

## 外掛程式插槽 (Plugin slots)

部分類別是 **排他性** 的（一次僅能啟動一個）。例如記憶外掛程式：

```json5
{
  plugins: {
    slots: {
      memory: "memory-core", // 或 "memory-lancedb"
    },
  },
}
```

## CLI 指令集

```bash
openclaw plugins list (列表)
openclaw plugins info <id> (資訊)
openclaw plugins install <路徑或規範> (安裝)
openclaw plugins update <id> (更新)
openclaw plugins enable <id> (啟用)
openclaw plugins disable <id> (停用)
openclaw plugins doctor (診斷)
```

## 自動回覆指令

外掛程式可以註冊自訂的斜線指令，這些指令會 **在調用 AI 代理人之前** 執行，適用於切換開關、狀態檢查等快速動作。

## 安全性注意

- 僅安裝您信任的外掛程式。
- 建議使用 `plugins.allow` 建立允許清單。
- 修改外掛程式後務必重啟閘道器。
