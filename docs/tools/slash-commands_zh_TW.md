---
summary: "斜線指令：文字指令與原生指令的區別、組態設定與支援的指令列表"
read_when:
  - 使用或配置對談指令時
  - 偵錯指令路由或權限時
title: "斜線指令"
---

> 此文件為 [English Version](/tools/slash-commands_zh_TW) 的繁體中文版本。

# 斜線指令 (Slash commands)

指令由閘道器 (Gateway) 處理。大多數指令必須以單一訊息形式發送，且以 `/` 開頭。

OpenClaw 具備兩套相關系統：
- **指令 (Commands)**：獨立的 `/...` 訊息。
- **指令語句 (Directives)**：`/think`, `/verbose`, `/model` 等。
  - 指令語句在模型看到訊息前會被剝離。
  - 在一般對談訊息中，它們被視為「內嵌提示」，**不會** 持久化至工作階段設定中。
  - 在僅包含指令語句的訊息中，它們會持久化至工作階段，並回傳確認。
  - 指令語句僅對 **獲授權的傳送者** 生效。

此外還有一些 **內嵌快捷指令**（僅限獲授權使用者）：`/help`, `/commands`, `/status`, `/whoami` (`/id`)。它們會立即執行，並在模型看到訊息前被移除。

## 組態設定 (Config)

```json5
{
  commands: {
    native: "auto", // 自動註冊原生指令 (Discord/Telegram)
    text: true, // 啟用在對談訊息中解析 /...
    bash: false, // 啟用 ! <指令> 執行主機 Shell 指令
    config: false, // 啟用 /config (讀寫 openclaw.json)
    debug: false, // 啟用 /debug (僅限執行時期覆寫)
    useAccessGroups: true, // 針對指令強制執行允許清單策略
  },
}
```

## 指令列表 (Command list)

文字與原生指令（啟用時）：
- `/help`：顯示幫助。
- `/commands`：列出所有可用指令。
- `/skill <名稱> [輸入]`：執行指定技能。
- `/status`：顯示目前狀態與用量。
- `/allowlist`：列出/新增/移除允許清單條目。
- `/approve <ID> <動作>`：處理執行核准請求。
- `/subagents <動作>`：檢查、停止或管理子代理人執行。
- `/config <動作>`：讀寫磁碟上的 `openclaw.json`（僅限擁有者）。
- `/usage <off|tokens|full|cost>`：控制每則回應下方的用量註腳。
- `/tts <動作>`：控制文字轉語音設定。
- `/reset` 或 `/new [模型別名]`：重置對談或開啟新對談。
- `/think <等級>`：動態調整推理等級 (Thinking level)。
- `/verbose <on|full|off>`：調整詳細程度。
- `/model <名稱>`：切換模型（支援別名）。
- `/bash <指令>`：執行主機 Shell 指令（別名為 `! <指令>`）。

## 模型選擇 (`/model`)

`/model` 指令是以指令語句 (Directive) 形式實作的。

範例：
- `/model`：顯示精簡的模型選擇器（帶編號）。
- `/model 3`：選擇選擇器中編號 3 的模型。
- `/model openai/gpt-5.2`：指定特定模型路徑。
- `/model status`：顯示詳細的驗證與端點狀態。

## 偵錯覆寫 (Debug overrides)

`/debug` 讓您設定 **僅限執行時期 (Memory-only)** 的組態覆寫，不會寫入磁碟。僅限擁有者使用。

範例：
- `/debug set messages.responsePrefix="[測試中]"`
- `/debug reset`：清除所有執行時期覆寫，回復至磁碟組態。

## 組態更新 (Config updates)

`/config` 會將變更 **寫入磁碟** 上的 `openclaw.json`。僅限擁有者使用。變更在寫入前會經過驗證，不正確的變更將被拒絕。
