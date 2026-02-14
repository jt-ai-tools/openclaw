---
summary: "技能組態 Schema 與範例說明"
read_when:
  - 新增或修改技能組態時
  - 調整內建允許清單或安裝行為時
title: "技能組態"
---

> 此文件為 [English Version](/tools/skills-config_zh_TW) 的繁體中文版本。

# 技能組態 (Skills Config)

所有與技能相關的組態設定皆位於 `~/.openclaw/openclaw.json` 中的 `skills` 區段。

```json5
{
  skills: {
    allowBundled: ["gemini", "peekaboo"], // 僅允許的內建技能
    load: {
      extraDirs: ["~/Projects/agent-scripts/skills"], // 額外載入路徑
      watch: true, // 啟用自動重新整理
      watchDebounceMs: 250,
    },
    install: {
      preferBrew: true, // 優先使用 Homebrew 安裝
      nodeManager: "npm", // 指定 Node 套件管理員
    },
    entries: {
      "nano-banana-pro": {
        enabled: true,
        apiKey: "在此填入_GEMINI_密鑰",
        env: {
          GEMINI_API_KEY: "在此填入_GEMINI_密鑰",
        },
      },
      peekaboo: { enabled: true },
      sag: { enabled: false },
    },
  },
}
```

## 欄位說明

- `allowBundled`：選用的 **僅限內建 (Bundled)** 技能允許清單。設定後，僅清單中的內建技能符合資格（受控/工作區技能不受影響）。
- `load.extraDirs`：額外掃描的技能目錄（優先權最低）。
- `load.watch`：監看技能資料夾並更新快照（預設為 true）。
- `install.nodeManager`：Node 安裝程式偏好 (`npm` | `pnpm` | `yarn` | `bun`)。這 **僅影響技能安裝**；閘道器執行環境仍建議使用 Node。
- `entries.<skillKey>`：個別技能的覆寫設定。

**個別技能欄位：**
- `enabled`：設為 `false` 可停用該技能。
- `env`：為代理人執行回合注入的環境變數。
- `apiKey`：針對宣告了主要環境變數的技能提供的便利設定項。

## 注意事項

- `entries` 下的鍵名預設對應技能名稱。
- 啟用了監看器後，技能變更將在下一個代理人回合生效。

### 沙箱化技能與環境變數
當工作階段處於 **沙箱化 (Sandboxed)** 狀態時，技能程序會在 Docker 內執行。沙箱 **不會** 繼承主機的 `process.env`。
請使用以下方式處理：
- 設定 `agents.defaults.sandbox.docker.env`。
- 將環境變數寫入您的自訂沙箱映像檔中。
- 全域 `env` 與 `skills.entries.<skill>.env/apiKey` 僅適用於 **主機 (Host)** 執行模式。
