---
name: oracle
description: 使用 oracle CLI 的最佳實踐（提示詞 + 檔案打包、引擎、工作階段與檔案附加模式）。
homepage: https://askoracle.dev
metadata:
  {
    "openclaw":
      {
        "emoji": "🧿",
        "requires": { "bins": ["oracle"] },
        "install":
          [
            {
              "id": "node",
              "kind": "node",
              "package": "@steipete/oracle",
              "bins": ["oracle"],
              "label": "安裝 oracle (node)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# oracle — 最佳使用指南

Oracle 將您的提示詞 (Prompt) + 選定的檔案打包成一個「單次 (One-shot)」請求，以便讓另一個模型能根據真實的儲存庫上下文（透過 API 或瀏覽器自動化）進行回答。請將輸出結果視為建議：請務必根據程式碼與測試進行驗證。

## 主要使用情境 (瀏覽器, GPT‑5.2 Pro)

此處的預設工作流：`--engine browser` 搭配 ChatGPT 中的 GPT‑5.2 Pro。這是常見的「長時間思考」路徑：約 10 分鐘到 1 小時是正常範圍；預期會產生一個您可以重新連結的工作階段。

建議預設值：

- 引擎 (Engine)：瀏覽器 (`--engine browser`)
- 模型 (Model)：GPT‑5.2 Pro (`--model gpt-5.2-pro` 或 `--model "5.2 Pro"`)

## 黃金路徑 (Golden Path)

1. 挑選精簡的檔案集（最少檔案量但仍包含真相）。
2. 預覽酬載與 Token 消耗（`--dry-run` + `--files-report`）。
3. 針對一般的 GPT‑5.2 Pro 工作流使用瀏覽器模式；僅在明確需要時才使用 API。
4. 如果執行中斷或逾時：請重新連結至儲存的工作階段（不要重新執行）。

## 常用指令

- **幫助 (Help)：**
  - `oracle --help`
  - 若未安裝二進位檔：`npx -y @steipete/oracle --help`

- **預覽 (Preview，不消耗 Token)：**
  - `oracle --dry-run summary -p "<任務>" --file "src/**" --file "!**/*.test.*"`
  - `oracle --dry-run full -p "<任務>" --file "src/**"`

- **瀏覽器執行 (主路徑；耗時較長是正常的)：**
  - `oracle --engine browser --model gpt-5.2-pro -p "<任務>" --file "src/**"`

- **手動貼上備援：**
  - `oracle --render --copy -p "<任務>" --file "src/**"`
  - 注意：`--copy` 是 `--copy-markdown` 的隱藏別名。

## 附加檔案 (`--file`)

`--file` 接受檔案、目錄與萬用字元 (Globs)。您可以傳遞多次；項目可用逗號分隔。

- **包含 (Include)：**
  - `--file "src/**"`
  - `--file src/index.ts`
  - `--file docs --file README.md`

- **排除 (Exclude)：**
  - `--file "src/**" --file "!src/**/*.test.ts" --file "!**/*.snap"`

- **預設行為：**
  - 預設忽略的目錄：`node_modules`, `dist`, `coverage`, `.git`, `.turbo`, `.next`, `build`, `tmp`（除非明確傳遞文字路徑，否則會跳過）。
  - 展開 Glob 時會遵循 `.gitignore`。
  - 不追踪符號連結 (Symlinks)。
  - 隱藏檔案（點開頭）會被過濾，除非透過模式選擇（例如 `--file ".github/**"`）。
  - 拒絕大於 1 MB 的檔案。

## 引擎 (API vs Browser)

- **自動選擇：** 當設定 `OPENAI_API_KEY` 時為 `api`；否則為 `browser`。
- **瀏覽器引擎：** 僅支援 GPT 與 Gemini；針對 Claude/Grok/Codex 或多模型執行請使用 `--engine api`。
- **遠端瀏覽器主機：**
  - 主機端：`oracle serve --host 0.0.0.0 --port 9473 --token <秘密>`
  - 客戶端：`oracle --engine browser --remote-host <主機:埠> --remote-token <秘密> -p "<任務>" --file "src/**"`

## 工作階段與別名 (Sessions + Slugs)

- 儲存於 `~/.oracle/sessions`。
- 執行可能會中斷或耗時較長。若 CLI 逾時：**不要重新執行；請重新連結 (Reattach)**。
  - 列出：`oracle status --hours 72`
  - 連結：`oracle session <ID> --render`
- 使用 `--slug "<3-5個單字>"` 保持工作階段 ID 的可讀性。
- 具備重複提示詞保護；僅在真正想要全新執行時才使用 `--force`。

## 提示詞模板 (高效訊號)

Oracle 啟動時對專案知識為 **零**。不要假設模型能推斷您的技術堆疊、建置工具、慣例或「顯而易見」的路徑。請包含：

- **專案簡報**（技術棧 + 建置/測試指令 + 平台限制）。
- **檔案配置**（關鍵目錄、入口點、組態檔案、界限）。
- **精確問題** + 您已嘗試過的操作 + 錯誤訊息（逐字貼上）。
- **約束條件**（「不要更改 X」、「必須保持公開 API」等）。
- **預期輸出**（「回傳補丁計畫 + 測試」、「提供 3 個具備優缺點分析的選項」）。

## 安全性

- 預設不要附加秘密資訊（`.env`, 金鑰檔案, 驗證權杖）。請積極遮蔽；僅分享必要資訊。

## 「詳盡提示詞」還原模式

針對長時間的研究，請撰寫一份獨立的提示詞 + 檔案集，以便數天後能重新執行：

- 6–30 句的專案簡報 + 目標。
- 重現步驟 + 精確錯誤 + 您嘗試過的操作。
- 附加所有需要的上下文檔案。

Oracle 的執行是單次性的；模型不記得先前的執行內容。所謂的「還原上下文」意指使用相同的提示詞與 `--file` 集合重新執行。
