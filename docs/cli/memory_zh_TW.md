---
summary: "`openclaw memory` (狀態、索引與搜尋) 的 CLI 參考資料"
read_when:
  - 您想要索引或搜尋語義記憶時
  - 您正在偵錯記憶可用性或索引過程時
title: "memory"
---

> 此文件為 [English Version](/cli/memory_zh_TW) 的繁體中文版本。

# `openclaw memory`

管理語義記憶 (Semantic memory) 的索引與搜尋。
此功能由活動中的記憶外掛程式提供（預設為 `memory-core`；設定 `plugins.slots.memory = "none"` 可停用）。

## 相關資訊：
- 記憶概念說明：[記憶 (Memory)](/concepts/memory_zh_TW)
- 外掛程式說明：[外掛程式 (Plugins)](/tools/plugin_zh_TW)

## 範例

```bash
openclaw memory status (顯示記憶狀態)
openclaw memory status --deep (執行深度探針檢查)
openclaw memory index (建立記憶索引)
openclaw memory index --verbose (顯示詳細索引日誌)
openclaw memory search "發佈檢查清單" (執行語義搜尋)
openclaw memory status --agent main (針對特定代理人)
```

## 選項說明

- `--agent <id>`：將範圍限定於單一代理人（預設為所有已配置的代理人）。
- `--verbose`：在探針檢查與索引過程中發出詳細日誌。

## 注意事項：

- `memory status --deep` 會探測向量庫與嵌入模型 (Embedding) 的可用性。
- `memory index --verbose` 會印出各階段的細節（提供者、模型、來源、批次活動）。
- `memory status` 會包含任何透過 `memorySearch.extraPaths` 配置的額外路徑。
