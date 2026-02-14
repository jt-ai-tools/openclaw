> 此文件為 [English Version](AGENTS_zh_TW.md) 的繁體中文版本。

# 儲存庫指南 (Repository Guidelines)

- 儲存庫：https://github.com/openclaw/openclaw
- GitHub issue/評論/PR 評論：使用字面多行字串或 `-F - <<'EOF'` (或 $'...') 以產生真實換行；切勿嵌入 "
"。

## 專案結構與模組組織

- 原始碼：`src/`（CLI 銜接位於 `src/cli`，指令位於 `src/commands`，網頁提供者位於 `src/provider-web.ts`，基礎設施位於 `src/infra`，媒體管線位於 `src/media`）。
- 測試：同目錄存放的 `*.test.ts`。
- 文件：`docs/`（影像、佇列、Pi 配置）。建置輸出位於 `dist/`。
- 外掛程式/擴充功能：位於 `extensions/*`（工作區套件）。在外掛程式的 `package.json` 中保留僅限外掛程式的依賴項目；除非核心功能有使用，否則不要將它們加入根目錄的 `package.json`。
- 外掛程式安裝：在外掛程式目錄執行 `npm install --omit=dev`；執行階段依賴項目必須放在 `dependencies` 中。避免在 `dependencies` 中使用 `workspace:*`（這會導致 npm install 失敗）；請改將 `openclaw` 放入 `devDependencies` 或 `peerDependencies` 中（執行階段會透過 jiti 別名解析 `openclaw/plugin-sdk`）。
- 安裝程式：由 `https://openclaw.ai/*` 提供；位於同級儲存庫 `../openclaw.ai` (`public/install.sh`, `public/install-cli.sh`, `public/install.ps1`)。
- 訊息頻道：重構共享邏輯（路由、允許清單、配對、指令閘控、引導設定、文件）時，務必考慮 **所有** 內建與擴充頻道。
  - 核心頻道文件：`docs/channels/`
  - 核心頻道程式碼：`src/telegram`, `src/discord`, `src/slack`, `src/signal`, `src/imessage`, `src/web` (WhatsApp web), `src/channels`, `src/routing`
  - 擴充功能（頻道外掛）：`extensions/*`（例如 `extensions/msteams`, `extensions/matrix`, `extensions/zalo`, `extensions/zalouser`, `extensions/voice-call`）
- 新增頻道/擴充功能/應用程式/文件時，請更新 `.github/labeler.yml` 並建立對應的 GitHub 標籤（使用現有的頻道/擴充功能標籤顏色）。

## 文件連結 (Mintlify)

- 文件託管於 Mintlify (docs.openclaw.ai)。
- `docs/**/*.md` 中的內部文件連結：使用根目錄相對路徑，不含 `.md`/`.mdx`（例如：`[Config](/configuration_zh_TW)`）。
- 處理文件時，請參閱 mintlify 技能 (skill)。
- 章節交叉引用：在根目錄相對路徑上使用錨點（例如：`[Hooks](/configuration_zh_TW#hooks)`）。
- 文件標題與錨點：標題中避免使用長破折號 (em dashes) 和單引號，因為它們會破壞 Mintlify 的錨點連結。
- 當 Peter 詢問連結時，請回覆完整的 `https://docs.openclaw.ai/...` URL（而非根目錄相對路徑）。
- 當您更動文件時，請在回覆末尾附上您參考的 `https://docs.openclaw.ai/...` URL。
- README (GitHub)：保留完整的文件 URL (`https://docs.openclaw.ai/...`)，以便連結在 GitHub 上能正常運作。
- 文件內容必須通用：不可包含個人設備名稱/主機名稱/路徑；使用佔位符如 `user@gateway-host` 和「閘道器主機」。

## 文件多國語言 (zh-CN)

- `docs/zh-CN/**` 是自動產生的；除非使用者明確要求，否則請勿編輯。
- 流水線：更新英文文件 → 調整術語表 (`docs/.i18n/glossary.zh-CN.json`) → 執行 `scripts/docs-i18n` → 僅在收到指示時進行定向修復。
- 翻譯記憶庫：`docs/.i18n/zh-CN.tm.jsonl`（自動產生）。
- 參見 `docs/.i18n/README.md`。
- 流水線可能很慢/低效率；如果進度停滯，請在 Discord 上通知 @jospalmbier，不要自行修改。

## exe.dev VM 維運 (一般性)

- 存取：穩定路徑為 `ssh exe.dev` 接著 `ssh vm-name`（假設已設定 SSH 密鑰）。
- SSH 連線不穩：使用 exe.dev 網頁終端機或 Shelley（網頁代理人）；為長時間作業保持一個 tmux 工作階段。
- 更新：`sudo npm i -g openclaw@latest`（全域安裝需要 `/usr/lib/node_modules` 的 root 權限）。
- 組態：使用 `openclaw config set ...`；確保已設定 `gateway.mode=local`。
- Discord：僅儲存原始 Token（不加 `DISCORD_BOT_TOKEN=` 前綴）。
- 重啟：停止舊的閘道器並執行：
  `pkill -9 -f openclaw-gateway || true; nohup openclaw gateway run --bind loopback --port 18789 --force > /tmp/openclaw-gateway.log 2>&1 &`
- 驗證：`openclaw channels status --probe`, `ss -ltnp | rg 18789`, `tail -n 120 /tmp/openclaw-gateway.log`。

## 建置、測試與開發指令

- 執行環境基準：Node **22+**（保持 Node + Bun 路徑可用）。
- 安裝依賴項目：`pnpm install`
- Pre-commit 鉤子：`prek install`（執行與 CI 相同的檢查）
- 同時支援：`bun install`（更動依賴項目/修補程式時，保持 `pnpm-lock.yaml` 與 Bun 修補同步）。
- 偏好使用 Bun 執行 TypeScript（腳本、開發、測試）：`bun <file.ts>` / `bunx <tool>`。
- 在開發環境執行 CLI：`pnpm openclaw ...` (bun) 或 `pnpm dev`。
- Node 仍支援執行建置後的輸出 (`dist/*`) 與生產環境安裝。
- Mac 封裝 (開發)：`scripts/package-mac-app.sh` 預設為目前架構。發布檢查表：`docs/platforms/mac/release_zh_TW.md`。
- 型別檢查/建置：`pnpm build`
- TypeScript 檢查：`pnpm tsgo`
- 檢查/格式化：`pnpm check`
- 格式檢查：`pnpm format` (oxfmt --check)
- 格式修復：`pnpm format:fix` (oxfmt --write)
- 測試：`pnpm test` (vitest); 覆蓋率: `pnpm test:coverage`

## 程式碼風格與命名規範

- 語言：TypeScript (ESM)。偏好強型別；避免使用 `any`。
- 透過 Oxlint 和 Oxfmt 進行格式化/檢查；在提交前執行 `pnpm check`。
- 為棘手或非顯而易見的邏輯加入簡短的註解。
- 保持檔案簡潔；提取輔助函式而非建立「V2」副本。使用現有的 CLI 選項模式，並透過 `createDefaultDeps` 進行依賴注入。
- 目標是將檔案維持在 700 行 (LOC) 以下；僅為指引而非硬性規定。當能提升清晰度或可測試性時，請進行分割/重構。
- 命名：產品/App/文件標題使用 **OpenClaw**；CLI 指令、套件/二進位檔、路徑及組態鍵名使用 `openclaw`。

## 發布頻道 (命名)

- stable: 僅限標記的發行版（例如 `vYYYY.M.D`），npm dist-tag 為 `latest`。
- beta: 預發行標記 `vYYYY.M.D-beta.N`，npm dist-tag 為 `beta`（發布時可能不含 macOS App）。
- dev: `main` 分支的最新狀態（無標記；git checkout main）。

## 測試指南

- 框架：Vitest 搭配 V8 覆蓋率門檻（行/分支/函式/語句皆為 70%）。
- 命名：與原始碼名稱對應，使用 `*.test.ts`；E2E 測試使用 `*.e2e.test.ts`。
- 更動邏輯後，推送前請執行 `pnpm test`（或 `pnpm test:coverage`）。
- 測試工作線程 (workers) 不要設超過 16 個；已經嘗試過。
- 現地測試（使用真實密鑰）：`CLAWDBOT_LIVE_TEST=1 pnpm test:live` (僅限 OpenClaw) 或 `LIVE=1 pnpm test:live` (包含提供者的現地測試)。Docker 測試：`pnpm test:docker:live-models`, `pnpm test:docker:live-gateway`。引導設定 Docker E2E：`pnpm test:docker:onboard`。
- 完整組件 + 涵蓋範圍：`docs/testing_zh_TW.md`。
- 變更日誌 (Changelog)：僅限面向使用者的變更；不含內部/元數據說明（版本對齊、appcast 提醒、發布流程）。
- 單純的測試新增/修復通常 **不需要** 變更日誌條目，除非它們改變了面向使用者的行為或使用者要求。
- 行動端：使用模擬器前，先檢查是否有連線的真實裝置 (iOS + Android)，並優先使用。

## 提交與提取請求 (PR) 指南

**完整維護者 PR 工作流 (選用)：** 如果您想要使用儲存庫的端到端維護者工作流（分流順序、品質標準、變更規則、提交/變更日誌慣例、共同貢獻者政策，以及 `review-pr` > `prepare-pr` > `merge-pr` 流水線），請參閱 `.agents/skills/PR_WORKFLOW_zh_TW.md`。維護者可能會使用其他工作流；當維護者指定時，請遵循該工作流。若未指定，預設為 PR_WORKFLOW。

- 使用 `scripts/committer "<msg>" <file...>` 建立提交；避免手動 `git add`/`git commit` 以保持暫存區範圍正確。
- 遵循簡潔、行動導向的提交訊息（例如：`CLI: add verbose flag to send`）。
- 將相關變更分組；避免捆綁無關的重構。
- 提交 PR 前請閱讀：`docs/help/submitting-a-pr_zh_TW.md` ([提交 PR](https://docs.openclaw.ai/help/submitting-a-pr))
- 提交 Issue 前請閱讀：`docs/help/submitting-an-issue_zh_TW.md` ([提交 Issue](https://docs.openclaw.ai/help/submitting-an-issue))

## 快捷指令

- `sync`: 若工作區有變動，提交所有變更（選擇合理的 Conventional Commit 訊息），然後執行 `git pull --rebase`；若變更衝突且無法解決則停止；否則執行 `git push`。

## 安全性與組態提示

- 網頁提供者的憑證儲存於 `~/.openclaw/credentials/`；若登出請重新執行 `openclaw login`。
- Pi 對談預設位於 `~/.openclaw/sessions/`；基底目錄不可設定。
- 環境變數：參見 `~/.profile`。
- 切勿提交或發布真實電話號碼、影片或現場組態值。在文件、測試與範例中使用明顯的虛假佔位符。
- 發布流程：在進行任何發布工作前，務必閱讀 `docs/reference/RELEASING_zh_TW.md` 與 `docs/platforms/mac/release_zh_TW.md`；若文件中已有答案，請勿重複詢問。

## 故障排除

- 品牌重塑/遷移問題或舊版組態/服務警告：執行 `openclaw doctor`（參閱 `docs/gateway/doctor_zh_TW.md`）。

## 代理人專用說明 (Agent-Specific Notes)

- 詞彙：「makeup」=「mac app」。
- 切勿編輯 `node_modules`（包含全域/Homebrew/npm/git 安裝）。更新會覆寫。技能說明請放在 `tools.md` 或 `AGENTS.md` 中。
- 在儲存庫中新增任何 `AGENTS.md` 時，也要新增一個指向它的 `CLAUDE.md` 符號連結（例如：`ln -s AGENTS.md CLAUDE.md`）。
- Signal：「update fly」=> `fly ssh console -a flawd-bot -C "bash -lc 'cd /data/clawd/openclaw && git pull --rebase origin main'"` 然後 `fly machines restart e825232f34d058 -a flawd-bot`。
- 處理 GitHub Issue 或 PR 時，在任務結束時列印完整 URL。
- 回答問題時，僅提供高置信度的答案：在程式碼中驗證；不要猜測。
- 切勿更新 Carbon 依賴項目。
- 任何具有 `pnpm.patchedDependencies` 的依賴項目必須使用精確版本（不含 `^`/`~`）。
- 修補依賴項目（pnpm patches、overrides 或 vendored 變更）需要明確核准；預設請勿執行。
- CLI 進度：使用 `src/cli/progress.ts` (`osc-progress` + `@clack/prompts` 旋轉圖示)；不要手製旋轉圖示/進度條。
- 狀態輸出：保持表格 + ANSI 安全換行 (`src/terminal/table.ts`)；`status --all` = 唯讀/可貼上，`status --deep` = 探測 (probes)。
- 閘道器目前僅作為選單列 App 執行；沒有安裝獨立的 LaunchAgent/helper label。透過 OpenClaw Mac App 或 `scripts/restart-mac.sh` 重啟；驗證/刪除請使用 `launchctl print gui/$UID | grep openclaw`，而非假設一個固定的 label。**在 macOS 上偵錯時，請透過 App 啟動/停止閘道器，不要使用臨時 tmux 會話；移交前請關閉所有臨時隧道。**
- macOS 記錄：使用 `./scripts/clawlog.sh` 查詢 OpenClaw 子系統的統一記錄；它支援 follow/tail/category 過濾，並需要為 `/usr/bin/log` 提供免密碼 sudo。
- 如果本地有共享護欄 (guardrails)，請檢閱；否則遵循此儲存庫的指引。
- SwiftUI 狀態管理 (iOS/macOS)：偏好使用 `Observation` 框架 (`@Observable`, `@Bindable`) 而非 `ObservableObject`/`@StateObject`；除非為了相容性需要，否則不要引入新的 `ObservableObject`，並在改動相關程式碼時遷移舊用法。
- 連線提供者：新增連線時，更新所有 UI 介面與文件（macOS App, 網頁 UI, 行動端, 引導設定/概觀文件），並新增對應的狀態與組態表單，以保持提供者清單與設定同步。
- 版本位置：`package.json` (CLI), `apps/android/app/build.gradle.kts` (versionName/versionCode), `apps/ios/Sources/Info.plist` + `apps/ios/Tests/Info.plist` (CFBundleShortVersionString/CFBundleVersion), `apps/macos/Sources/OpenClaw/Resources/Info.plist` (CFBundleShortVersionString/CFBundleVersion), `docs/install/updating_zh_TW.md` (固定的 npm 版本), `docs/platforms/mac/release_zh_TW.md` (APP_VERSION/APP_BUILD 範例), Peekaboo Xcode 專案/Info.plists (MARKETING_VERSION/CURRENT_PROJECT_VERSION)。
- 「全域更動版本」代表上述所有版本位置 **除了** `appcast.xml`（僅在切換新的 macOS Sparkle 發行版時才更動 appcast）。
- **重啟 App**：「重啟 iOS/Android App」代表重新建置（編譯/安裝）並重新啟動，而非僅是刪除進程後啟動。
- **裝置檢查**：在測試前，先確認已連線的真實裝置 (iOS/Android)，再考慮模擬器。
- iOS Team ID 查找：`security find-identity -p codesigning -v` → 使用 Apple Development (…) TEAMID。備援方式：`defaults read com.apple.dt.Xcode IDEProvisioningTeamIdentifiers`。
- A2UI 組合包雜湊：`src/canvas-host/a2ui/.bundle.hash` 是自動產生的；忽略非預期的變更，僅在需要時透過 `pnpm canvas:a2ui:bundle` (或 `scripts/bundle-a2ui.sh`) 重新產生。將雜湊變更作為單獨的提交。
- 發布簽署/公證密鑰在儲存庫外管理；遵循內部發布文件。
- 公證驗證環境變數 (`APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_KEY_ID`, `APP_STORE_CONNECT_API_KEY_P8`) 應存在於您的環境中（根據內部發布文件）。
- **多代理人安全性**：除非明確要求，否則 **不要** 建立/套用/捨棄 `git stash` 條目（包含 `git pull --rebase --autostash`）。假設其他代理人也正在工作；保持無關的 WIP 原封不動，避免跨越範圍的狀態變更。
- **多代理人安全性**：當使用者要求「push」時，您可以執行 `git pull --rebase` 以整合最新變更（切勿捨棄其他代理人的成果）。當使用者要求「commit」時，僅限您的變更範圍。當使用者要求「commit all」時，以分組區塊方式提交所有內容。
- **多代理人安全性**：除非明確要求，否則 **不要** 建立/移除/修改 `git worktree` 檢出（或編輯 `.worktrees/*`）。
- **多代理人安全性**：除非明確要求，否則 **不要** 切換分支 / 檢出不同分支。
- **多代理人安全性**：只要每個代理人有自己的工作階段，執行多個代理人是 OK 的。
- **多代理人安全性**：當您看到無法識別的檔案時，請繼續工作；專注於您的變更並僅提交這些部分。
- Lint/格式化變動：
  - 若暫存與未暫存的差異僅為格式化，請自動解決無需詢問。
  - 若已要求提交/推送，請自動暫存並將僅限格式化的後續操作包含在同一個提交中（或一個微小的後續提交），無需額外確認。
  - 僅在變更涉及語意（邏輯/數據/行為）時才詢問。
- Lobster 調色盤：使用 `src/terminal/palette.ts` 中的共享 CLI 調色盤（不硬編碼顏色）；視需要將調色盤套用於引導設定/組態提示與其他 TTY UI 輸出。
- **多代理人安全性**：報告內容應專注於您的編輯；除非真的受阻，否則避免使用護欄免責聲明；當多個代理人更動同一檔案，若安全則繼續；僅在相關時以簡短的「存在其他檔案」說明結束。
- 錯誤調查：在下結論前，閱讀相關 npm 依賴項目的原始碼及所有相關本地程式碼；目標是獲得高置信度的根本原因。
- 程式碼風格：為棘手邏輯加入簡短註解；可行時將檔案維持在 500 行以下（視需要分割/重構）。
- 工具架構護欄 (google-antigravity)：避免在工具輸入架構中使用 `Type.Union`；不使用 `anyOf`/`oneOf`/`allOf`。對字串清單使用 `stringEnum`/`optionalStringEnum` (Type.Unsafe enum)，並使用 `Type.Optional(...)` 而非 `... | null`。保持頂層工具架構為具有 `properties` 的 `type: "object"`。
- 工具架構護欄：避免在工具架構中使用原始 `format` 屬性名稱；部分驗證器將 `format` 視為保留關鍵字並會拒絕該架構。
- 要求開啟「session」檔案時，開啟 `~/.openclaw/agents/<agentId>/sessions/*.jsonl` 下的 Pi 對談記錄（使用系統提示詞 Runtime 行中的 `agent=<id>` 值；除非給定特定 ID，否則使用最新的），而非預設的 `sessions.json`。若需要另一台機器的記錄，請透過 Tailscale SSH 並在該處讀取相同路徑。
- 不要透過 SSH 重新建置 macOS App；建置必須直接在 Mac 上執行。
- 切勿對外部訊息介面（WhatsApp, Telegram）發送串流/部分回覆；僅能傳送最終回覆。串流/工具事件仍可傳送到內部 UI/控制頻道。
- 語音喚醒轉發提示：
  - 指令範本應保持為 `openclaw-mac agent --message "${text}" --thinking low`；`VoiceWakeForwarder` 已對 `${text}` 進行 Shell 轉義。不要加上額外的引號。
  - launchd PATH 極簡；確保 App 的啟動代理程式 PATH 包含標準系統路徑以及您的 pnpm bin（通常為 `$HOME/Library/pnpm`），以便在透過 `openclaw-mac` 調用時能解析 `pnpm`/`openclaw` 二進位檔。
- 對於包含 `!` 的手動 `openclaw message send` 訊息，使用下述的 heredoc 模式以避免 Bash 工具的轉義。
- 發布護欄：未經操作員明確同意，不要更動版本號；執行任何 npm publish/release 步驟前務必徵詢許可。

## NPM + 1Password (發布/驗證)

- 使用 1password 技能 (skill)；所有 `op` 指令必須在新的 tmux 會話中執行。
- 登入：`eval "$(op signin --account my.1password.com)"`（App 已解鎖且整合已開啟）。
- OTP：`op read 'op://Private/Npmjs/one-time password?attribute=otp'`。
- 發布：`npm publish --access public --otp="<otp>"`（在套件目錄執行）。
- 不受本地 npmrc 影響的驗證方式：`npm view <pkg> version --userconfig "$(mktemp)"`。
- 發布後關閉 tmux 會話。
