---
title: "發佈檢查清單"
summary: "npm 與 macOS App 的逐步發佈檢查清單"
read_when:
  - 進行新的 npm 發佈時
  - 進行新的 macOS App 發佈時
  - 在發佈前驗證元數據時
---

> 此文件為 [English Version](/reference/RELEASING_zh_TW) 的繁體中文版本。

# 發佈檢查清單 (RELEASING - npm + macOS)

請在儲存庫根目錄下使用 `pnpm` (Node 22+)。在標記標籤或發佈前，請保持工作區乾淨。

## 發佈前置準備 (Preflight)

當操作者下達「發佈 (Release)」指令時，請立即執行：
- 閱讀此文件與 `docs/platforms/mac/release.md_zh_TW`。
- 載入環境變數並確認 `SPARKLE_PRIVATE_KEY_FILE` 與 App Store Connect 變數已設定。

### 1. 版本與元數據
- [ ] 提升 `package.json` 中的版本號。
- [ ] 執行 `pnpm plugins:sync` 以同步擴充功能套件的版本。
- [ ] 更新 `src/cli/program.ts` 中的 CLI 版本字串。
- [ ] 確認 `pnpm-lock.yaml` 已更新。

### 2. 建置與產出物
- [ ] 若 A2UI 有變動，執行 `pnpm canvas:a2ui:bundle`。
- [ ] 執行 `pnpm run build`。
- [ ] 驗證 npm 套件檔案清單包含所需的 `dist/*` 目錄（尤其是 `node-host` 與 `acp`）。
- [ ] 確認 `dist/build-info.json` 包含正確的 Git SHA。

### 3. 變更日誌與說明文件
- [ ] 更新 `CHANGELOG.md`（版本由新到舊排列）。
- [ ] 確保 README 中的範例與目前 CLI 行為一致。

### 4. 驗證測試 (Validation)
- [ ] `pnpm check` (Lint)。
- [ ] `pnpm test` (Unit/E2E)。
- [ ] `pnpm release:check` (驗證 npm 打包內容)。
- [ ] 執行 Docker 安裝冒煙測試：`pnpm test:install:smoke`。

### 5. macOS App (Sparkle)
- [ ] 建置並簽署 macOS App，並將其壓縮為 Zip。
- [ ] 產生 Sparkle Appcast 並更新 `appcast.xml`。
- [ ] 準備好 Zip 與 dSYM 檔案以便上傳至 GitHub。

### 6. npm 發佈
- [ ] `npm publish --access public`（預覽版請加上 `--tag beta`）。
- [ ] 驗證註冊表：`npm view openclaw version`。

### 7. GitHub Release
- [ ] 標記並推送標籤：`git tag vX.Y.Z && git push origin vX.Y.Z`。
- [ ] 建立 GitHub Release：標題為 `openclaw X.Y.Z`，內容包含該版本的變更日誌。
- [ ] 附加產出物：Zip 檔案、dSYM 檔案。
- [ ] 提交更新後的 `appcast.xml`（Sparkle 饋送源自 main 分支）。
