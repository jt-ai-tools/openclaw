---
title: "建立技能"
---

> 此文件為 [English Version](/tools/creating-skills_zh_TW) 的繁體中文版本。

# 建立自訂技能 🛠 (Creating Custom Skills)

OpenClaw 的設計理念在於易於擴充。「技能 (Skills)」是為您的助理新增能力的主要方式。

## 什麼是技能？

一個技能就是一個目錄，其中包含一個 `SKILL.md` 檔案（用於向 LLM 提供指令與工具定義），並可選擇性地包含一些腳本或資源。

## 逐步教學：您的第一個技能

### 1. 建立目錄
技能存放於您的工作區中，通常路徑為 `~/.openclaw/workspace/skills/`。為您的技能建立一個新資料夾：

```bash
mkdir -p ~/.openclaw/workspace/skills/hello-world
```

### 2. 定義 `SKILL.md`
在該目錄下建立 `SKILL.md`。此檔案使用 YAML 前端詮釋資料 (Frontmatter) 記錄元數據，並使用 Markdown 撰寫指令。

```markdown
---
name: hello_world
description: 一個會打招呼的簡單技能。
---

# Hello World 技能

當使用者要求問候時，請使用 `echo` 工具說出「來自您自訂技能的問候！」。
```

### 3. 新增工具（選用）
您可以在前端詮釋資料中定義自訂工具，或指示代理人使用現有的系統工具（如 `bash` 或 `browser`）。

### 4. 重新整理 OpenClaw
要求您的代理人「重新整理技能 (refresh skills)」或重啟閘道器。OpenClaw 會自動發現新目錄並索引 `SKILL.md`。

## 最佳實踐

- **保持簡潔**：指示模型「要做什麼」，而不是如何當一個 AI。
- **安全性第一**：如果您的技能使用 `bash`，請確保提示詞不會導致來自不可信使用者輸入的任意指令注入。
- **本地測試**：使用 `openclaw agent --message "使用我的新技能"` 進行測試。

## 共享技能

您也可以在 [ClawHub](https://clawhub.com) 瀏覽或貢獻技能。
