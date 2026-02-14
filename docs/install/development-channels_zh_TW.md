---
summary: "穩定版、測試版與開發版頻道：語義、切換與標籤說明"
read_when:
  - 您想要在 stable/beta/dev 頻道間切換時
  - 您正在為預覽版標記標籤或發佈時
title: "開發頻道"
---

> 此文件為 [English Version](/install/development-channels_zh_TW) 的繁體中文版本。

# 開發頻道 (Development channels)

OpenClaw 提供三個更新頻道：

- **stable (穩定版)**：對應 npm 標籤 `latest`。
- **beta (測試版)**：對應 npm 標籤 `beta`（測試中的建置版本）。
- **dev (開發版)**：Git 中的 `main` 分支。對應 npm 標籤 `dev`（若有發佈）。

我們會先將版本發佈至 **beta**，經過測試後，再將同一個版本號提升 (Promote) 至 **latest** —— 對於 npm 安裝而言，dist-tags 是唯一的準則。

## 切換頻道

```bash
# Git 原始碼安裝
openclaw update --channel stable
openclaw update --channel beta
openclaw update --channel dev

# npm/pnpm 全域安裝
openclaw update --channel stable
openclaw update --channel beta
openclaw update --channel dev
```

當您明確使用 `--channel` 切換頻道時，OpenClaw 會同步調整安裝方法：
- **dev**：確保存在 Git 簽出（預設為 `~/openclaw`），更新該簽出，並從該處安裝全域 CLI。
- **stable/beta**：從 npm 安裝對應標籤的版本。

## 外掛程式與頻道
當切換頻道時，外掛程式來源也會同步：
- **dev**：優先使用 Git 簽出中隨附的外掛程式。
- **stable/beta**：還原為從 npm 安裝的外掛程式套件。

## 標籤最佳實踐
- 標籤格式建議：`vYYYY.M.D`。
- 標籤一經建立即不可變：切勿移動或重用已存在的標籤。
- npm dist-tags 是安裝的唯一準則：`latest` 代表穩定版，`beta` 代表候選版本。

## macOS App 可用性
測試版與開發版建置 **可能不包含** macOS App 的發佈。這對於 Git 與 npm 頻道來說是正常的，請在發佈說明中註明「此測試版不含 macOS 建置」。
