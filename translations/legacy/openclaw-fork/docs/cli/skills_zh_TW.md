---
summary: "`openclaw skills` (列表、詳情與檢查) 以及技能適用性的 CLI 參考資料"
read_when:
  - 您想要查看有哪些可用且已準備好執行的技能時
  - 您想要偵錯技能缺少的二進位檔、環境變數或組態時
title: "skills"
---

> 此文件為 [English Version](/cli/skills_zh_TW) 的繁體中文版本。

# `openclaw skills`

檢查技能（包含內建、工作區以及受控覆寫的技能），並查看哪些技能已符合資格或缺少必要條件。

## 相關資訊：
- 技能系統說明：[技能 (Skills)](/tools/skills_zh_TW)
- 技能組態說明：[技能組態 (Skills config)](/tools/skills-config_zh_TW)
- ClawHub 安裝：[ClawHub](/tools/clawhub_zh_TW)

## 指令範例

```bash
openclaw skills list (列出所有技能)
openclaw skills list --eligible (僅列出符合執行資格的技能)
openclaw skills info <技能名稱> (查看特定技能詳情)
openclaw skills check (檢查所有技能的相依性狀態)
```
