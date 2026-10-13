---
summary: "安全地更新 OpenClaw（全域安裝或原始碼安裝），以及版本回退策略說明"
read_when:
  - 更新 OpenClaw 時
  - 更新後發生問題需要修復時
title: "更新 (Updating)"
---

> 此文件為 [English Version](/install/updating_zh_TW) 的繁體中文版本。

# 更新 OpenClaw

OpenClaw 發展迅速。請將更新視為基礎設施維護：更新 → 執行檢查 → 重啟（或使用自動重啟的 `openclaw update`）→ 驗證。

## 推薦方式：重新執行安裝腳本（原位升級）

這是 **最建議** 的更新路徑。它能自動偵測現有安裝、執行原位升級，並在必要時執行 `openclaw doctor`。

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**注意：**
- 若不想再次啟動精靈，請加上 `--no-onboard`。
- 對於 **原始碼安裝**，請指定 `--install-method git`。腳本僅會在儲存庫乾淨時執行 `git pull --rebase`。

## 更新 (全域安裝)

全域安裝的使用者請執行：

```bash
npm i -g openclaw@latest
# 或
pnpm add -g openclaw@latest
```

切換更新頻道（例如切換至測試版）：
```bash
openclaw update --channel beta
```

更新後請執行：
```bash
openclaw doctor
openclaw gateway restart
openclaw health
```

## 更新 (`openclaw update` 指令)

對於 **原始碼簽出** 的使用者，優先使用此指令。它會執行安全的更新流程：
- 要求工作區乾淨。
- 切換至選定的頻道。
- 執行 Fetch 與 Rebase。
- 安裝依賴項、進行建置，最後執行 `doctor` 指令。
- 預設會自動重啟閘道器。

## 務必執行：`openclaw doctor`

Doctor 是「安全更新」的必備指令。其功能包含：
- 遷移已棄用的組態鍵值。
- 稽核私訊 (DM) 策略。
- 檢查閘道器健康度並視需求重啟。
- 自動將舊版服務（如 schtasks）遷移至目前的 OpenClaw 服務。

詳情請參閱：[診斷工具 (Doctor)](/gateway/doctor_zh_TW)。

## 版本回退 (Rollback)

### 全域安裝
安裝一個已知的穩定版本（將 `<version>` 替換為版本號）：
```bash
npm i -g openclaw@<version>
openclaw doctor
openclaw gateway restart
```

### 原始碼安裝（依日期回退）
例如回退至 2026-01-01 的狀態：
```bash
git fetch origin
git checkout "$(git rev-list -n 1 --before="2026-01-01" origin/main)"
pnpm install && pnpm build
openclaw gateway restart
```
