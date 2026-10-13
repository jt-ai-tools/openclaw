---
name: clawhub
description: 使用 ClawHub CLI 從 clawhub.com 搜尋、安裝、更新與發佈代理人技能。當您需要即時獲取新技能、同步已安裝技能至最新版或特定版本，或是透過 npm 安裝的 clawhub CLI 發佈新/更新的技能資料夾時使用。
metadata:
  {
    "openclaw":
      {
        "requires": { "bins": ["clawhub"] },
        "install":
          [
            {
              "id": "node",
              "kind": "node",
              "package": "clawhub",
              "bins": ["clawhub"],
              "label": "安裝 ClawHub CLI (npm)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# ClawHub CLI

## 安裝

```bash
npm i -g clawhub
```

## 驗證 (發佈時需要)

```bash
clawhub login
clawhub whoami
```

## 搜尋

```bash
clawhub search "postgres backups"
```

## 安裝

```bash
clawhub install my-skill
clawhub install my-skill --version 1.2.3
```

## 更新（基於雜湊比對與升級）

```bash
clawhub update my-skill
clawhub update my-skill --version 1.2.3
clawhub update --all
clawhub update my-skill --force
clawhub update --all --no-input --force
```

## 列出已安裝技能

```bash
clawhub list
```

## 發佈

```bash
clawhub publish ./my-skill --slug my-skill --name "我的技能" --version 1.2.0 --changelog "修復問題與更新文件"
```

## 注意事項

- 預設註冊表：https://clawhub.com（可透過 `CLAWHUB_REGISTRY` 或 `--registry` 覆寫）。
- 預設工作目錄：目前目錄（回退至 OpenClaw 工作區）；安裝目錄：`./skills`（可透過 `--workdir` / `--dir` / `CLAWHUB_WORKDIR` 覆寫）。
- `update` 指令會計算本地檔案的雜湊值，解析匹配的版本，並升級至最新版本（除非指定了 `--version`）。
