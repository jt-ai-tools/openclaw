---
name: github
description: "使用 `gh` CLI 與 GitHub 互動。使用 `gh issue`, `gh pr`, `gh run` 與 `gh api` 處理議題 (Issues)、提取請求 (PRs)、CI 執行以及進階查詢。"
metadata:
  {
    "openclaw":
      {
        "emoji": "🐙",
        "requires": { "bins": ["gh"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "gh",
              "bins": ["gh"],
              "label": "安裝 GitHub CLI (brew)",
            },
            {
              "id": "apt",
              "kind": "apt",
              "package": "gh",
              "bins": ["gh"],
              "label": "安裝 GitHub CLI (apt)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# GitHub 技能

使用 `gh` CLI 與 GitHub 互動。當不在 Git 目錄中時，請務必指定 `--repo 擁有者/儲存庫`，或直接使用 URL。

## 提取請求 (Pull Requests)

檢查 PR 的 CI 狀態：

```bash
gh pr checks 55 --repo owner/repo
```

列出最近的工作流執行 (Workflow runs)：

```bash
gh run list --repo owner/repo --limit 10
```

查看執行詳情並確認失敗的步驟：

```bash
gh run view <run-id> --repo owner/repo
```

僅查看失敗步驟的記錄 (Logs)：

```bash
gh run view <run-id> --repo owner/repo --log-failed
```

## 用於進階查詢的 API

`gh api` 指令在存取其它子指令無法取得的數據時非常有用。

獲取具有特定欄位的 PR：

```bash
gh api repos/owner/repo/pulls/55 --jq '.title, .state, .user.login'
```

## JSON 輸出

大多數指令都支援 `--json` 以進行結構化輸出。您可以使用 `--jq` 來過濾：

```bash
gh issue list --repo owner/repo --json number,title --jq '.[] | "\(.number): \(.title)"'
```
