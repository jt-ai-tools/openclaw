---
summary: "`openclaw config` (組態獲取/設定/取消) 的 CLI 參考資料"
read_when:
  - 您想要以非互動方式讀取或編輯組態時
title: "config"
---

> 此文件為 [English Version](/cli/config_zh_TW) 的繁體中文版本。

# `openclaw config`

組態輔助工具：透過路徑獲取 (get)、設定 (set) 或取消 (unset) 數值。若不帶子指令執行，則會開啟互動式組態精靈（與 `openclaw configure` 相同）。

## 範例

```bash
openclaw config get browser.executablePath
openclaw config set browser.executablePath "/usr/bin/google-chrome"
openclaw config set agents.defaults.heartbeat.every "2h"
openclaw config set agents.list[0].tools.exec.node "node-id-或-名稱"
openclaw config unset tools.web.search.apiKey
```

## 路徑 (Paths)

路徑使用點號 (dot) 或中括號 (bracket) 表示法：

```bash
openclaw config get agents.defaults.workspace
openclaw config get agents.list[0].id
```

使用代理人列表索引來指定特定代理人：

```bash
openclaw config get agents.list
openclaw config set agents.list[1].tools.exec.node "node-id-或-名稱"
```

## 數值 (Values)

數值會盡可能被解析為 JSON5；否則將視為字串。使用 `--json` 旗標可強制要求以 JSON5 格式解析。

```bash
openclaw config set agents.defaults.heartbeat.every "0m"
openclaw config set gateway.port 19001 --json
openclaw config set channels.whatsapp.groups '["*"]' --json
```

完成編輯後請重啟閘道器。
