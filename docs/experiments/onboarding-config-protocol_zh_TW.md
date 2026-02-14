---
summary: "引導設定精靈與組態 Schema 的 RPC 協定筆記說明"
read_when: "更改引導設定精靈步驟或組態 Schema 端點時"
title: "引導設定與組態協定"
---

> 此文件為 [English Version](/experiments/onboarding-config-protocol_zh_TW) 的繁體中文版本。

# 引導設定與組態協定 (Onboarding + Config Protocol)

目的：在 CLI、macOS App 與網頁 UI 之間共用引導設定與組態界面。

## 核心組件
- **精靈引擎**：共用的工作階段、提示詞與引導狀態。
- **CLI 引導設定**：使用與 UI 客戶端相同的精靈流程。
- **閘道器 RPC**：公開精靈與組態 Schema 的端點。
- **網頁 UI**：根據 JSON Schema 與 UI 提示 (UI hints) 渲染組態表單。

## 閘道器 RPC 方法
- `wizard.start`：開始引導流程。
- `wizard.next`：回答步驟並進行下一階段。
- `wizard.cancel`：取消引導。
- `config.schema`：獲取組態 Schema 與 UI 提示。

## UI 提示 (UI Hints)
- 透過路徑對應，提供標籤、幫助文字、分組、排序、進階選項、敏感資訊標記及預位元文字。
- 敏感欄位會渲染為密碼輸入框。
- 若遇到不支援的 Schema 節點，會回退至原始 JSON 編輯器。
