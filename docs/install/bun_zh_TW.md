---
summary: "Bun 工作流（實驗性）：相對於 pnpm 的安裝與注意事項"
read_when:
  - 您想要極速的本地開發循環時（bun + watch）
  - 遇到 Bun 安裝、補丁或生命週期腳本問題時
title: "Bun (實驗性)"
---

> 此文件為 [English Version](/install/bun_zh_TW) 的繁體中文版本。

# Bun (實驗性)

目標：使用 **Bun** 執行此儲存庫（選用），同時不與 pnpm 工作流發生衝突。

⚠️ **不建議將 Bun 用於閘道器 (Gateway) 的生產環境**（存在 WhatsApp/Telegram 相關 Bug）。生產環境請使用 Node。

## 目前狀態

- Bun 是執行 TypeScript 的選用本地執行環境（如 `bun run …`, `bun --watch …`）。
- **pnpm** 仍是建置的預設工具，且獲得完整支援。
- Bun 無法使用 `pnpm-lock.yaml` 且會忽略它。

## 安裝

預設安裝：
```sh
bun install
```

## 建置與測試 (Bun)

```sh
bun run build
bun run vitest run
```

## Bun 生命週期腳本 (預設阻擋)

除非明確信任，否則 Bun 可能會阻擋相依性的生命週期腳本。對於此儲存庫，常見被阻擋的腳本並非必要：
- `@whiskeysockets/baileys`：檢查 Node 版本（我們已使用 Node 22+）。
- `protobufjs`：僅發出版本相容性警告。

如果您遇到因缺少這些腳本而導致的執行時期問題，請明確信任它們：
```sh
bun pm trust @whiskeysockets/baileys protobufjs
```

## 注意事項

- 部分腳本仍硬編碼使用 pnpm（如 `docs:build`, `ui:*`）。這類指令暫時請繼續使用 pnpm 執行。
