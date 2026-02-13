---
summary: "鉤子 (Hooks)：針對指令與生命週期事件的事件驅動自動化系統"
read_when:
  - 您想要針對 /new, /reset, /stop 與代理人生命週期事件設定自動化動作時
  - 您想要建置、安裝或偵錯鉤子時
title: "鉤子"
---

> 此文件為 [English Version](/automation/hooks) 的繁體中文版本。

# 鉤子 (Hooks)

鉤子提供了一個可擴充的事件驅動系統，用於自動化執行回應代理人指令與事件的動作。鉤子會從目錄中自動被發現，並可透過 CLI 指令進行管理，運作方式與 OpenClaw 的「技能 (Skills)」類似。

## 入門指引

鉤子是當特定事件發生時執行的小型腳本。主要分為兩類：

- **鉤子 (Hooks)**（本頁面）：執行於閘道器內部，當代理人事件觸發時執行，如 `/new`, `/reset`, `/stop` 或生命週期事件。
- **Webhooks**：外部 HTTP Webhooks，讓其他系統觸發 OpenClaw 的任務。請參閱 [Webhook 鉤子](/automation/webhook_zh_TW) 或使用 `openclaw webhooks` 處理 Gmail 輔助指令。

鉤子也可以封裝在外掛程式中；請參閱 [外掛程式](/tools/plugin_zh_TW#外掛程式鉤子)。

常見用途：

- 當您重設對談時儲存記憶快照。
- 保留指令的稽核追蹤 (Audit trail)，用於故障排除或合規性檢查。
- 當工作階段開始或結束時觸發後續的自動化流程。
- 當事件觸發時將檔案寫入代理人工作區，或調用外部 API。

如果您會寫簡單的 TypeScript 函式，您就能編寫鉤子。系統會自動發現鉤子，您可以透過 CLI 啟用或停用它們。

## 概觀

鉤子系統允許您：

- 當發出 `/new` 指令時，將對談上下文儲存至記憶體中。
- 記錄所有指令以供稽核。
- 針對代理人生命週期事件觸發自訂自動化動作。
- 在不修改核心程式碼的情況下擴充 OpenClaw 的行為。

## 開始使用

### 內建鉤子 (Bundled Hooks)

OpenClaw 隨附了三個會被自動發現的內建鉤子：

- **💾 session-memory**：當您發出 `/new` 指令時，將對談上下文儲存至您的代理人工作區（預設為 `~/.openclaw/workspace/memory/`）。
- **📝 command-logger**：將所有指令事件記錄至 `~/.openclaw/logs/commands.log`。
- **🚀 boot-md**：當閘道器啟動時執行 `BOOT.md`（需要啟用內部鉤子功能）。

列出可用鉤子：

```bash
openclaw hooks list
```

啟用鉤子：

```bash
openclaw hooks enable session-memory
```

檢查鉤子狀態：

```bash
openclaw hooks check
```

取得詳細資訊：

```bash
openclaw hooks info session-memory
```

### 引導設定 (Onboarding)

在引導設定 (`openclaw onboard`) 過程中，系統會提示您啟用建議的鉤子。精靈會自動發現符合資格的鉤子並供您選擇。

## 鉤子發現機制 (Hook Discovery)

鉤子會從以下三個目錄自動被發現（依優先順序排列）：

1. **工作區鉤子**：`<workspace>/hooks/`（針對特定代理人，優先權最高）
2. **託管鉤子**：`~/.openclaw/hooks/`（使用者安裝，跨工作區共享）
3. **內建鉤子**：`<openclaw>/dist/hooks/bundled/`（隨 OpenClaw 附帶）

託管鉤子目錄可以是 **單個鉤子** 或 **鉤子包 (Hook pack)**（套件目錄）。

每個鉤子都是一個包含以下內容的目錄：

```
my-hook/
├── HOOK.md          # 元數據 + 說明文件
└── handler.ts       # 處理程式實作
```

## 鉤子包 (npm/封存檔)

鉤子包是標準的 npm 套件，透過 `package.json` 中的 `openclaw.hooks` 導出一個或多個鉤子。安裝指令：

```bash
openclaw hooks install <路徑或名稱>
```

`package.json` 範例：

```json
{
  "name": "@acme/my-hooks",
  "version": "0.1.0",
  "openclaw": {
    "hooks": ["./hooks/my-hook", "./hooks/other-hook"]
  }
}
```

每個項目皆指向一個包含 `HOOK.md` 與 `handler.ts` (或 `index.ts`) 的鉤子目錄。鉤子包可以包含依賴項，它們會被安裝在 `~/.openclaw/hooks/<id>` 下。

## 鉤子結構

### HOOK.md 格式

`HOOK.md` 檔案包含 YAML Frontmatter 格式的元數據以及 Markdown 說明文件：

```markdown
---
name: my-hook
description: "簡短描述此鉤子的功能"
homepage: https://docs.openclaw.ai/hooks#my-hook
metadata:
  { "openclaw": { "emoji": "🔗", "events": ["command:new"], "requires": { "bins": ["node"] } } }
---

# 我的鉤子 (My Hook)

此處為詳細說明文件...

## 功能說明

- 監聽 `/new` 指令
- 執行特定動作
- 記錄執行結果

## 前置要求

- 必須安裝 Node.js

## 組態設定

無需額外設定。
```

### 元數據欄位 (Metadata Fields)

`metadata.openclaw` 物件支援：

- **`emoji`**：顯示於 CLI 的圖示（例如：`"💾"`）
- **`events`**：要監聽的事件陣列（例如：`["command:new", "command:reset"]`）
- **`export`**：要使用的具名導出項目（預設為 `"default"`）
- **`homepage`**：說明文件網址
- **`requires`**：選用的前置要求
  - **`bins`**：PATH 中必備的二進位檔（例如：`["git", "node"]`）
  - **`anyBins`**：列表中的二進位檔至少需存在一個
  - **`env`**：必備的環境變數
  - **`config`**：必備的組態路徑（例如：`["workspace.dir"]`）
  - **`os`**：要求的作業系統平台（例如：`["darwin", "linux"]`）
- **`always`**：跳過資格檢查（布林值）
- **`install`**：安裝方法（針對內建鉤子：`[{"id":"bundled","kind":"bundled"}]`）

### 處理程式實作 (Handler Implementation)

`handler.ts` 檔案需導出一個 `HookHandler` 函式：

```typescript
import type { HookHandler } from "../../src/hooks/hooks.js";

const myHandler: HookHandler = async (event) => {
  // 僅針對 'new' 指令觸發
  if (event.type !== "command" || event.action !== "new") {
    return;
  }

  console.log(`[my-hook] 觸發了新指令`);
  console.log(`  對談：${event.sessionKey}`);
  console.log(`  時間戳記：${event.timestamp.toISOString()}`);

  // 此處編寫您的自訂邏輯

  // 可選擇向使用者傳送訊息
  event.messages.push("✨ 我的鉤子已執行！");
};

export default myHandler;
```

#### 事件上下文 (Event Context)

每個事件包含：

```typescript
{
  type: 'command' | 'session' | 'agent' | 'gateway',
  action: string,              // 例如：'new', 'reset', 'stop'
  sessionKey: string,          // 對談識別碼
  timestamp: Date,             // 事件發生時間
  messages: string[],          // 將訊息推入此陣列以傳送給使用者
  context: {
    sessionEntry?: SessionEntry,
    sessionId?: string,
    sessionFile?: string,
    commandSource?: string,    // 例如：'whatsapp', 'telegram'
    senderId?: string,
    workspaceDir?: string,
    bootstrapFiles?: WorkspaceBootstrapFile[],
    cfg?: OpenClawConfig
  }
}
```

## 事件類型

### 指令事件 (Command Events)

當發出代理人指令時觸發：

- **`command`**：所有指令事件（通用監聽器）
- **`command:new`**：當發出 `/new` 指令時
- **`command:reset`**：當發出 `/reset` 指令時
- **`command:stop`**：當發出 `/stop` 指令時

### 代理人事件 (Agent Events)

- **`agent:bootstrap`**：在注入工作區引導檔案之前觸發（鉤子可改動 `context.bootstrapFiles`）

### 閘道器事件 (Gateway Events)

當閘道器啟動時觸發：

- **`gateway:startup`**：在頻道啟動且鉤子載入後觸發

### 工具結果鉤子 (外掛程式 API)

這類鉤子並非事件流監聽器；它們讓外掛程式能在 OpenClaw 持久化工具執行結果前，同步調整該結果。

- **`tool_result_persist`**：在工具結果寫入對談轉錄紀錄前進行轉換。必須是同步執行；回傳更新後的工具結果負載，或回傳 `undefined` 以保持原樣。請參閱 [代理人迴圈](/concepts/agent-loop_zh_TW)。

### 未來規劃的事件

計畫加入的事件類型：

- **`session:start`**：當新對談開始時
- **`session:end`**：當對談結束時
- **`agent:error`**：當代理人遇到錯誤時
- **`message:sent`**：當訊息傳送時
- **`message:received`**：當收到訊息時

## 建立自訂鉤子

### 1. 選擇存放位置

- **工作區鉤子** (`<workspace>/hooks/`)：針對單一代理人，具最高優先權。
- **託管鉤子** (`~/.openclaw/hooks/`)：跨工作區共享。

### 2. 建立目錄結構

```bash
mkdir -p ~/.openclaw/hooks/my-hook
cd ~/.openclaw/hooks/my-hook
```

### 3. 建立 HOOK.md

```markdown
---
name: my-hook
description: "執行一些有用的動作"
metadata: { "openclaw": { "emoji": "🎯", "events": ["command:new"] } }
---

# 我的自訂鉤子

此鉤子會在您執行 `/new` 指令時執行某些有用的動作。
```

### 4. 建立 handler.ts

```typescript
import type { HookHandler } from "../../src/hooks/hooks.js";

const handler: HookHandler = async (event) => {
  if (event.type !== "command" || event.action !== "new") {
    return;
  }

  console.log("[my-hook] 正在執行！");
  // 此處編寫您的邏輯
};

export default handler;
```

### 5. 啟用並測試

```bash
# 驗證鉤子是否已被發現
openclaw hooks list

# 啟用鉤子
openclaw hooks enable my-hook

# 重啟您的閘道器程序 (macOS 上重啟選單列 App，或重啟開發中的程序)

# 觸發事件
# 透過您的通訊頻道發送 /new
```

## 組態設定

### 新版組態格式 (建議方式)

```json
{
  "hooks": {
    "internal": {
      "enabled": true,
      "entries": {
        "session-memory": { "enabled": true },
        "command-logger": { "enabled": false }
      }
    }
  }
}
```

### 各鉤子獨立組態

鉤子可以具備自訂設定：

```json
{
  "hooks": {
    "internal": {
      "enabled": true,
      "entries": {
        "my-hook": {
          "enabled": true,
          "env": {
            "MY_CUSTOM_VAR": "value"
          }
        }
      }
    }
  }
}
```

### 額外目錄

從額外目錄載入鉤子：

```json
{
  "hooks": {
    "internal": {
      "enabled": true,
      "load": {
        "extraDirs": ["/路徑/至/更多/鉤子"]
      }
    }
  }
}
```

### 舊版組態格式 (仍支援)

為了向後相容，舊的格式依然有效：

```json
{
  "hooks": {
    "internal": {
      "enabled": true,
      "handlers": [
        {
          "event": "command:new",
          "module": "./hooks/handlers/my-handler.ts",
          "export": "default"
        }
      ]
    }
  }
}
```

**遷移建議**：針對新的鉤子，請使用基於發現機制的新系統。舊版處理程式會在基於目錄的鉤子之後載入。

## CLI 指令

### 列出鉤子

```bash
# 列出所有鉤子
openclaw hooks list

# 僅顯示符合資格的鉤子
openclaw hooks list --eligible

# 詳細輸出（顯示缺失的要求）
openclaw hooks list --verbose

# JSON 格式輸出
openclaw hooks list --json
```

### 鉤子資訊

```bash
# 顯示特定鉤子的詳細資訊
openclaw hooks info session-memory

# JSON 格式輸出
openclaw hooks info session-memory --json
```

### 檢查資格

```bash
# 顯示資格摘要
openclaw hooks check

# JSON 格式輸出
openclaw hooks check --json
```

### 啟用/停用

```bash
# 啟用鉤子
openclaw hooks enable session-memory

# 停用鉤子
openclaw hooks disable command-logger
```

## 內建鉤子參考

### session-memory

當您發出 `/new` 指令時，將對談上下文儲存至記憶體中。

**事件**：`command:new`

**前置要求**：需配置 `workspace.dir`

**輸出路徑**：`<workspace>/memory/YYYY-MM-DD-代稱.md` (預設為 `~/.openclaw/workspace`)

**運作流程**：

1. 使用重設前的對談紀錄定位正確的轉錄檔。
2. 提取最後 15 行對話。
3. 使用 LLM 產生具描述性的檔名代稱 (Slug)。
4. 將對談元數據儲存至帶有日期的記憶檔案中。

**輸出範例**：

```markdown
# Session: 2026-01-16 14:30:00 UTC

- **Session Key**: agent:main:main
- **Session ID**: abc123def456
- **Source**: telegram
```

**檔名範例**：

- `2026-01-16-vendor-pitch.md`
- `2026-01-16-api-design.md`
- `2026-01-16-1430.md` (若代稱產生失敗則使用時間戳記備援)

**啟用指令**：

```bash
openclaw hooks enable session-memory
```

### command-logger

將所有指令事件記錄至集中式的稽核檔案中。

**事件**：`command`

**前置要求**：無

**輸出路徑**：`~/.openclaw/logs/commands.log`

**運作流程**：

1. 擷取事件細節（指令動作、時間戳記、對談金鑰、傳送者 ID、來源）。
2. 以 JSONL 格式附加至日誌檔案。
3. 在背景靜默執行。

**日誌條目範例**：

```jsonl
{"timestamp":"2026-01-16T14:30:00.000Z","action":"new","sessionKey":"agent:main:main","senderId":"+1234567890","source":"telegram"}
{"timestamp":"2026-01-16T15:45:22.000Z","action":"stop","sessionKey":"agent:main:main","senderId":"user@example.com","source":"whatsapp"}
```

**檢視日誌**：

```bash
# 檢視最近的指令
tail -n 20 ~/.openclaw/logs/commands.log

# 使用 jq 進行美化輸出
cat ~/.openclaw/logs/commands.log | jq .

# 依動作篩選
grep '"action":"new"' ~/.openclaw/logs/commands.log | jq .
```

**啟用指令**：

```bash
openclaw hooks enable command-logger
```

### boot-md

當閘道器啟動時（頻道啟動後）執行 `BOOT.md`。需要啟用內部鉤子功能。

**事件**：`gateway:startup`

**前置要求**：需配置 `workspace.dir`

**運作流程**：

1. 從您的工作區讀取 `BOOT.md`。
2. 透過代理人執行器執行指令。
3. 透過訊息工具發送任何要求的傳出訊息。

**啟用指令**：

```bash
openclaw hooks enable boot-md
```

## 最佳實務

### 保持處理程式快速執行

鉤子在指令處理期間執行。請保持輕量：

```typescript
// ✓ 優良做法 - 非同步處理，立即回傳
const handler: HookHandler = async (event) => {
  void processInBackground(event); // 發送後不理 (Fire and forget)
};

// ✗ 不良做法 - 阻礙指令處理流程
const handler: HookHandler = async (event) => {
  await slowDatabaseQuery(event);
  await evenSlowerAPICall(event);
};
```

### 優雅處理錯誤

務必包裝具風險的操作：

```typescript
const handler: HookHandler = async (event) => {
  try {
    await riskyOperation(event);
  } catch (err) {
    console.error("[my-handler] 失敗：", err instanceof Error ? err.message : String(err));
    // 不要拋出錯誤 - 讓其他處理程式能繼續執行
  }
};
```

### 儘早過濾事件

若事件不相關，請儘早回傳：

```typescript
const handler: HookHandler = async (event) => {
  // 僅處理 'new' 指令
  if (event.type !== "command" || event.action !== "new") {
    return;
  }

  // 您的邏輯
};
```

### 使用具體的事件金鑰

盡可能在元數據中指定精確的事件：

```yaml
metadata: { "openclaw": { "events": ["command:new"] } } # 具體
```

優於：

```yaml
metadata: { "openclaw": { "events": ["command"] } } # 通用 - 產生更多額外開銷
```

## 偵錯

### 啟用鉤子日誌

閘道器在啟動時會記錄鉤子載入情形：

```
Registered hook: session-memory -> command:new
Registered hook: command-logger -> command
Registered hook: boot-md -> gateway:startup
```

### 檢查發現狀態

列出所有被發現的鉤子：

```bash
openclaw hooks list --verbose
```

### 檢查註冊狀態

在您的處理程式中，記錄被調用的時機：

```typescript
const handler: HookHandler = async (event) => {
  console.log("[my-handler] 已觸發：", event.type, event.action);
  // 您的邏輯
};
```

### 驗證資格

檢查鉤子為何不符合資格：

```bash
openclaw hooks info my-hook
```

查看輸出中的缺失要求項目。

## 測試

### 閘道器日誌

監控閘道器日誌以觀察鉤子執行情況：

```bash
# macOS
./scripts/clawlog.sh -f

# 其他平台
tail -f ~/.openclaw/gateway.log
```

### 直接測試鉤子

隔離測試您的處理程式：

```typescript
import { test } from "vitest";
import { createHookEvent } from "./src/hooks/hooks.js";
import myHandler from "./hooks/my-hook/handler.js";

test("我的處理程式運作正常", async () => {
  const event = createHookEvent("command", "new", "test-session", {
    foo: "bar",
  });

  await myHandler(event);

  // 斷言副作用結果
});
```

## 架構說明

### 核心組件

- **`src/hooks/types.ts`**：型別定義
- **`src/hooks/workspace.ts`**：目錄掃描與載入
- **`src/hooks/frontmatter.ts`**：HOOK.md 元數據解析
- **`src/hooks/config.ts`**：資格檢查
- **`src/hooks/hooks-status.ts`**：狀態報告
- **`src/hooks/loader.ts`**：動態模組載入器
- **`src/cli/hooks-cli.ts`**：CLI 指令
- **`src/gateway/server-startup.ts`**：閘道器啟動時載入鉤子
- **`src/auto-reply/reply/commands-core.ts`**：觸發指令事件

### 發現流程

```
閘道器啟動
    ↓
掃描目錄 (工作區 → 託管 → 內建)
    ↓
解析 HOOK.md 檔案
    ↓
檢查資格 (二進位檔, 環境變數, 組態, 作業系統)
    ↓
從符合資格的鉤子載入處理程式
    ↓
為事件註冊處理程式
```

### 事件流程

```
使用者傳送 /new
    ↓
指令驗證
    ↓
建立鉤子事件
    ↓
觸發鉤子 (所有已註冊的處理程式)
    ↓
指令處理繼續進行
    ↓
會話重設
```

## 故障排除

### 鉤子未被發現

1. 檢查目錄結構：

   ```bash
   ls -la ~/.openclaw/hooks/my-hook/
   # 應顯示：HOOK.md, handler.ts
   ```

2. 驗證 HOOK.md 格式：

   ```bash
   cat ~/.openclaw/hooks/my-hook/HOOK.md
   # 應包含具有名稱與元數據的 YAML Frontmatter
   ```

3. 列出所有被發現的鉤子：

   ```bash
   openclaw hooks list
   ```

### 鉤子不符合資格

檢查需求：

```bash
openclaw hooks info my-hook
```

查看缺失的：

- 二進位檔（檢查 PATH）
- 環境變數
- 組態值
- 作業系統相容性

### 鉤子未執行

1. 驗證鉤子是否已啟用：

   ```bash
   openclaw hooks list
   # 已啟用的鉤子旁應顯示 ✓
   ```

2. 重啟您的閘道器程序以重新載入鉤子。

3. 檢查閘道器日誌中的錯誤：

   ```bash
   ./scripts/clawlog.sh | grep hook
   ```

### 處理程式錯誤

檢查 TypeScript/匯入錯誤：

```bash
# 直接測試匯入
node -e "import('./path/to/handler.ts').then(console.log)"
```

## 遷移指南

### 從舊版組態遷移至發現系統

**遷移前 (Before)**：

```json
{
  "hooks": {
    "internal": {
      "enabled": true,
      "handlers": [
        {
          "event": "command:new",
          "module": "./hooks/handlers/my-handler.ts"
        }
      ]
    }
  }
}
```

**遷移後 (After)**：

1. 建立鉤子目錄：

   ```bash
   mkdir -p ~/.openclaw/hooks/my-hook
   mv ./hooks/handlers/my-handler.ts ~/.openclaw/hooks/my-hook/handler.ts
   ```

2. 建立 HOOK.md：

   ```markdown
   ---
   name: my-hook
   description: "我的自訂鉤子"
   metadata: { "openclaw": { "emoji": "🎯", "events": ["command:new"] } }
   ---

   # 我的鉤子

   執行某些有用的動作。
   ```

3. 更新組態：

   ```json
   {
     "hooks": {
       "internal": {
         "enabled": true,
         "entries": {
           "my-hook": { "enabled": true }
         }
       }
     }
   }
   ```

4. 驗證並重啟您的閘道器程序：

   ```bash
   openclaw hooks list
   # 應顯示：🎯 my-hook ✓
   ```

**遷移優點**：

- 自動發現
- 可透過 CLI 管理
- 具備資格檢查
- 更好的說明文件
- 一致的結構

## 另請參閱

- [CLI 參考：hooks](/cli/hooks_zh_TW)
- [內建鉤子 README](https://github.com/openclaw/openclaw/tree/main/src/hooks/bundled)
- [Webhook 鉤子](/automation/webhook_zh_TW)
- [組態設定](/gateway/configuration_zh_TW#鉤子)
