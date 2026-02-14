---
summary: "`openclaw plugins` (列表、安裝、解除安裝、啟用/停用與診斷) 的 CLI 參考資料"
read_when:
  - 您想要安裝或管理閘道器 (Gateway) 內處理的外掛程式時
  - 您想要針對外掛程式載入失敗進行偵錯時
title: "plugins"
---

> 此文件為 [English Version](/cli/plugins_zh_TW) 的繁體中文版本。

# `openclaw plugins`

管理閘道器外掛程式與擴充功能（於程序內載入）。

## 相關資訊：
- 外掛程式系統說明：[外掛程式 (Plugins)](/tools/plugin_zh_TW)
- 外掛程式資訊清單與 Schema：[外掛程式清單 (Plugin manifest)](/plugins/manifest_zh_TW)
- 安全性強化：[安全性 (Security)](/gateway/security_zh_TW)

## 指令集

```bash
openclaw plugins list (列出外掛程式)
openclaw plugins info <ID> (查看詳情)
openclaw plugins enable <ID> (啟用)
openclaw plugins disable <ID> (停用)
openclaw plugins uninstall <ID> (解除安裝)
openclaw plugins doctor (載入診斷)
openclaw plugins update <ID> (更新)
openclaw plugins update --all (更新全部)
```

內建 (Bundled) 外掛程式隨 OpenClaw 一併發佈，但初始狀態為停用。請使用 `plugins enable` 來激活它們。

所有外掛程式皆 **必須** 包含 `openclaw.plugin.json` 檔案，且檔案內需有 JSON Schema (`configSchema`) 定義。若缺少或資訊清單無效，將導致外掛程式載入失敗。

### 安裝 (Install)

```bash
openclaw plugins install <路徑或規範>
```

**安全性注意**：請將安裝外掛程式視同執行程式碼。建議優先使用固定版本。

支援的壓縮格式：`.zip`, `.tgz`, `.tar.gz`, `.tar`。

使用 `--link` 可避免複製本地目錄（僅將其加入 `plugins.load.paths`）：

```bash
openclaw plugins install -l ./my-plugin
```

### 解除安裝 (Uninstall)

```bash
openclaw plugins uninstall <ID>
```

解除安裝會從組態與允許清單中移除外掛程式紀錄。預設情況下，也會移除位於 `$OPENCLAW_STATE_DIR/extensions/<ID>` 的安裝目錄。使用 `--keep-files` 可保留磁碟上的檔案。

### 更新 (Update)

更新僅適用於從 npm 安裝的外掛程式（記錄於 `plugins.installs` 中）。
