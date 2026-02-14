---
summary: "`openclaw setup` (初始化組態與工作區) 的 CLI 參考資料"
read_when:
  - 您正在進行首次設定，且不想使用完整的引導精靈時
  - 您想要設定預設的工作區路徑時
title: "setup"
---

> 此文件為 [English Version](/cli/setup_zh_TW) 的繁體中文版本。

# `openclaw setup`

初始化 `~/.openclaw/openclaw.json` 組態檔案與代理人工作區。

## 相關資訊：
- 快速入門：[開始使用 (Getting started)](/start/getting-started_zh_TW)
- 引導精靈：[引導設定 (Onboarding)](/start/onboarding_zh_TW)

## 範例

```bash
openclaw setup
openclaw setup --workspace ~/.openclaw/workspace
```

若要透過 setup 指令執行引導精靈：

```bash
openclaw setup --wizard
```
