---
name: model-usage
description: 使用 CodexBar CLI 本地成本用量來彙整 Codex 或 Claude 的各模型用量摘要，包含目前（最近一次）使用的模型或完整的模型細目。當被要求提供來自 codexbar 的模型級用量/成本數據，或需要從 codexbar 成本 JSON 獲取可程式化處理的模型摘要時觸發。
metadata:
  {
    "openclaw":
      {
        "emoji": "📊",
        "os": ["darwin"],
        "requires": { "bins": ["codexbar"] },
        "install":
          [
            {
              "id": "brew-cask",
              "kind": "brew",
              "cask": "steipete/tap/codexbar",
              "bins": ["codexbar"],
              "label": "安裝 CodexBar (brew cask)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# 模型用量 (Model usage)

## 概觀

從 CodexBar 的本地成本日誌中獲取每個模型的用量成本。支援 Codex 或 Claude 的「目前模型」（最近一日的項目）或「所有模型」摘要。

## 快速開始

1. 透過 CodexBar CLI 獲取成本 JSON 或傳遞 JSON 檔案。
2. 使用內建腳本按模型進行摘要彙整。

```bash
python {baseDir}/scripts/model_usage.py --provider codex --mode current
python {baseDir}/scripts/model_usage.py --provider codex --mode all
python {baseDir}/scripts/model_usage.py --provider claude --mode all --format json --pretty
```

## 目前模型邏輯

- 使用帶有 `modelBreakdowns` 的最新每日列。
- 挑選該列中成本最高的模型。
- 若缺少細目，則回退至 `modelsUsed` 中的最後一個項目。
- 當需要特定模型時，可使用 `--model <名稱>` 進行覆寫。

## 輸入方式

- 預設：執行 `codexbar cost --format json --provider <codex|claude>`。
- 檔案或標準輸入 (stdin)：

```bash
codexbar cost --provider codex --format json > /tmp/cost.json
python {baseDir}/scripts/model_usage.py --input /tmp/cost.json --mode all
cat /tmp/cost.json | python {baseDir}/scripts/model_usage.py --input - --mode current
```

## 輸出格式

- 純文字（預設）或 JSON (`--format json --pretty`)。
- 數值僅包含各模型的成本；CodexBar 的輸出中 Token 數並未按模型拆分。

## 參考文件

- 閱讀 `references/codexbar-cli.md` 了解 CLI 旗標與成本 JSON 欄位說明。
