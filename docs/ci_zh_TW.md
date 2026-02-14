---
title: CI 管線 (CI Pipeline)
description: OpenClaw CI 管線的工作原理
---

> 此文件為 [English Version](/ci) 的繁體中文版本。

# CI 管線 (CI Pipeline)

CI 於每次推送 (Push) 至 `main` 分支以及每次提取請求 (PR) 時執行。它使用智慧範圍偵測 (Smart scoping)，當僅有文件或原生程式碼變更時，會跳過高昂成本的任務。

## 任務概觀 (Job Overview)

| 任務名稱           | 目的                                            | 執行時機                  |
| ----------------- | ----------------------------------------------- | ------------------------- |
| `docs-scope`      | 偵測是否僅有文件變更                            | 總是執行                  |
| `changed-scope`   | 偵測變更區域 (Node/macOS/Android)               | 非僅文件的 PR              |
| `check`           | TypeScript 型別、Lint、格式化                   | 非僅文件的變更            |
| `check-docs`      | Markdown Lint + 死連結檢查                      | 文件變更時                |
| `code-analysis`   | 行數 (LOC) 限制檢查 (1000 行)                   | 僅限 PR                   |
| `secrets`         | 偵測洩漏的密鑰                                  | 總是執行                  |
| `build-artifacts` | 建置一次成品 (dist)，供其它任務共用               | 非僅文件、Node 變更時     |
| `release-check`   | 驗證 npm pack 內容                              | 建置後                    |
| `checks`          | Node/Bun 測試 + 通訊協定檢查                    | 非僅文件、Node 變更時     |
| `checks-windows`  | Windows 專屬測試                                | 非僅文件、Node 變更時     |
| `macos`           | Swift Lint/建置/測試 + TS 測試                  | 包含 macOS 變更的 PR      |
| `android`         | Gradle 建置 + 測試                              | 非僅文件、Android 變更時  |

## 快速失敗順序 (Fail-Fast Order)

任務順序經特別設計，使低成本的檢查在昂貴任務執行前先失敗：

1. `docs-scope` + `code-analysis` + `check`（並行執行，約 1-2 分鐘）
2. `build-artifacts`（受上述任務阻塞）
3. `checks`, `checks-windows`, `macos`, `android`（受建置任務阻塞）

## 執行器 (Runners)

| 執行器                          | 任務                          |
| ------------------------------- | ----------------------------- |
| `blacksmith-4vcpu-ubuntu-2404`  | 大多數 Linux 任務             |
| `blacksmith-4vcpu-windows-2025` | `checks-windows`              |
| `macos-latest`                  | `macos`, `ios`                |
| `ubuntu-latest`                 | 範圍偵測（輕量級）            |

## 本地等效指令

```bash
pnpm check          # 型別 + lint + 格式化
pnpm test           # vitest 測試
pnpm check:docs     # 文件格式 + lint + 死連結
pnpm release:check  # 驗證 npm pack
```
