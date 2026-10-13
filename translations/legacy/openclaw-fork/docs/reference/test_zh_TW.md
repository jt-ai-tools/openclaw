---
summary: "如何執行本地測試 (vitest)，以及何時使用強制模式或覆蓋率模式說明"
read_when:
  - 執行或修復測試時
title: "測試 (Tests)"
---

> 此文件為 [English Version](/reference/test_zh_TW) 的繁體中文版本。

# 測試 (Tests)

- 完整測試工具組（包含套件、實時測試、Docker）：[測試指南](/help/testing_zh_TW)

## 常用測試指令

- `pnpm test:force`：清除佔用 18789 埠的殘留程序，然後在隔離的連接埠執行完整的 Vitest 測試套件。
- `pnpm test:coverage`：執行並產出 V8 覆蓋率報告（目標門檻為 70%）。
- `pnpm test:e2e`：執行閘道器端到端冒煙測試。
- `pnpm test:live`：執行模型提供者的實時連線測試（需要 API 密鑰並設定 `LIVE=1`）。

## 模型延遲基準測試 (Local keys)

腳本：[`scripts/bench-model.ts`](https://github.com/openclaw/openclaw/blob/main/scripts/bench-model.ts)

用法範例：
```bash
pnpm tsx scripts/bench-model.ts --runs 10
```

## 引導設定端到端測試 (Docker)

在乾淨的 Linux 容器中模擬完整的首次啟動流程：
```bash
scripts/e2e/onboard-docker.sh
```
此腳本會模擬互動式精靈操作、驗證組態檔案、啟動閘道器並執行健康檢查。

## QR Code 渲染測試 (Docker)
確保 `qrcode-terminal` 在 Node 22+ 容器環境下能正常載入：
```bash
pnpm test:docker:qr
```
