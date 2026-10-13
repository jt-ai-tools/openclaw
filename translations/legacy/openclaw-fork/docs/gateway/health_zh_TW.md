---
summary: "頻道連線能力的健康檢查步驟"
read_when:
  - 診斷 WhatsApp 頻道健康狀態時
title: "健康檢查"
---

> 此文件為 [English Version](/gateway/health_zh_TW) 的繁體中文版本。

# 健康檢查 (CLI)

本指南提供快速步驟，協助您精確驗證頻道連線能力，無需憑空猜測。

## 快速檢查

- `openclaw status` — 本地摘要：閘道器可達性/模式、更新提示、已連結頻道的驗證效期、對談會話 + 近期活動。
- `openclaw status --all` — 完整的本地診斷（唯讀、有顏色、可安全貼出以便偵錯）。
- `openclaw status --deep` — 同時探測執行中的閘道器（若支援，則包含各頻道的探測）。
- `openclaw health --json` — 向執行中的閘道器請求完整的健康快照（僅限 WS；不直接接觸 Baileys 通訊端）。
- 在 WhatsApp/WebChat 中發送 `/status` 作為 **獨立訊息**，即可獲得狀態回覆而不觸發代理人。
- 日誌：使用 `tail` 查看 `/tmp/openclaw/openclaw-*.log`，並篩選關鍵字 `web-heartbeat`, `web-reconnect`, `web-auto-reply`, `web-inbound`。

## 深度診斷

- 磁碟上的憑證：`ls -l ~/.openclaw/credentials/whatsapp/<accountId>/creds.json`（修改時間 mtime 應為近期）。
- 對談存儲：`ls -l ~/.openclaw/agents/<agentId>/sessions/sessions.json`（路徑可透過組態覆寫）。會話數量與近期收件者會顯示在 `status` 輸出中。
- 重新連結流程：當日誌出現 409–515 狀態碼或 `loggedOut` 時，執行 `openclaw channels logout && openclaw channels login --verbose`。 (注意：QR Code 登入流程在配對後遇到狀態碼 515 時會自動重啟一次。)

## 當發生故障時

- `logged out` 或狀態碼 409–515 → 執行 `openclaw channels logout` 接著 `openclaw channels login` 重新連結。
- 閘道器不可達 → 啟動它：`openclaw gateway --port 18789`（若連接埠被佔用，請使用 `--force`）。
- 無法接收訊息 → 確認已連結的手機在線，且傳送者位於允許清單中 (`channels.whatsapp.allowFrom`)；針對群組聊天，請確保允許清單與提及規則相符 (`channels.whatsapp.groups`, `agents.list[].groupChat.mentionPatterns`)。

## 專用的 "health" 指令

`openclaw health --json` 會向執行中的閘道器請求其健康快照（CLI 不會直接建立頻道通訊端）。它會回報已連結憑證/驗證的效期（若可用）、各頻道的探測摘要、對談存儲摘要以及探測耗時。若閘道器不可達或探測失敗/逾時，該指令會以 **非零 (non-zero)** 結束代碼退出。可使用 `--timeout <ms>` 覆寫預設的 10 秒逾時設定。
