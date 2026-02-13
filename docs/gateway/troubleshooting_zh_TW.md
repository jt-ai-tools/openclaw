---
summary: "閘道器、頻道、自動化、節點與瀏覽器工具的深度故障排除執行手冊"
read_when:
  - 故障排除中心引導您至此進行更深入的診斷
  - 您需要根據徵兆分類的維運手冊，包含精確的指令說明
title: "故障排除"
---

> 此文件為 [English Version](/gateway/troubleshooting) 的繁體中文版本。

# 閘道器故障排除

本頁面為深度維運手冊。
如果您需要先進行快速的初步診斷，請從 [/help/troubleshooting](/help/troubleshooting_zh_TW) 開始。

## 指令診斷階梯

請依序執行下列指令：

```bash
openclaw status
openclaw gateway status
openclaw logs --follow
openclaw doctor
openclaw channels status --probe
```

預期的健康訊號：

- `openclaw gateway status` 顯示 `Runtime: running` 且 `RPC probe: ok`。
- `openclaw doctor` 未回報任何阻礙性的組態或服務問題。
- `openclaw channels status --probe` 顯示所有頻道皆已連線且就緒。

## 沒有回覆

如果頻道已連線但沒有任何回應，請在嘗試重新連線前先檢查路由與原則 (Policy)。

```bash
openclaw status
openclaw channels status --probe
openclaw pairing list <channel>
openclaw config get channels
openclaw logs --follow
```

檢查重點：

- 私訊傳送者是否有待處理的配對請求。
- 群組提及門檻 (`requireMention`, `mentionPatterns`)。
- 頻道或群組的允許清單是否不符。

常見的錯誤特徵：

- `drop guild message (mention required` → 群組訊息被忽略，直到被提及 (Mention)。
- `pairing request` → 傳送者需要經過核准。
- `blocked` / `allowlist` → 傳送者或頻道被原則過濾掉。

相關連結：

- [/channels/troubleshooting](/channels/troubleshooting_zh_TW)
- [/channels/pairing](/channels/pairing_zh_TW)
- [/channels/groups](/channels/groups_zh_TW)

## 儀表板控制 UI 連線問題

當儀表板或控制 UI 無法連線時，請驗證 URL、驗證模式以及安全上下文 (Secure context) 的假設是否正確。

```bash
openclaw gateway status
openclaw status
openclaw logs --follow
openclaw doctor
openclaw gateway status --json
```

檢查重點：

- 探測 (Probe) URL 與儀表板 URL 是否正確。
- 用戶端與閘道器之間的驗證模式或 Token 是否不符。
- 在需要裝置識別 (Device Identity) 的情況下，是否錯誤地使用了 HTTP。

常見的錯誤特徵：

- `device identity required` → 非安全上下文或缺失裝置驗證資訊。
- `unauthorized` / 重連迴圈 → Token 或密碼不符。
- `gateway connect failed:` → 目標主機、連接埠或 URL 錯誤。

相關連結：

- [/web/control-ui](/web/control-ui_zh_TW)
- [/gateway/authentication](/gateway/authentication_zh_TW)
- [/gateway/remote](/gateway/remote_zh_TW)

## 閘道器服務未執行

當服務已安裝但程序無法保持啟動時，請使用此部分。

```bash
openclaw gateway status
openclaw status
openclaw logs --follow
openclaw doctor
openclaw gateway status --deep
```

檢查重點：

- `Runtime: stopped` 以及相關的結束提示。
- 服務組態不符 (`Config (cli)` vs `Config (service)`)。
- 連接埠或監聽程式 (Listener) 衝突。

常見的錯誤特徵：

- `Gateway start blocked: set gateway.mode=local` → 未啟用本地閘道器模式。
- `refusing to bind gateway ... without auth` → 非迴路位址 (Loopback) 綁定且未設定 Token/密碼。
- `another gateway instance is already listening` / `EADDRINUSE` → 連接埠衝突。

相關連結：

- [/gateway/background-process](/gateway/background-process_zh_TW)
- [/gateway/configuration](/gateway/configuration_zh_TW)
- [/gateway/doctor](/gateway/doctor_zh_TW)

## 頻道已連線但訊息未流動

如果頻道狀態顯示已連線但訊息流動中斷，請專注於原則、權限以及各頻道專屬的傳遞規則。

```bash
openclaw channels status --probe
openclaw pairing list <channel>
openclaw status --deep
openclaw logs --follow
openclaw config get channels
```

檢查重點：

- 私訊原則 (`pairing`, `allowlist`, `open`, `disabled`)。
- 群組允許清單與提及要求。
- 缺失的頻道 API 權限或範圍 (Scopes)。

常見的錯誤特徵：

- `mention required` → 訊息因群組提及原則而被忽略。
- `pairing` / 待核准跡象 → 傳送者未經核准。
- `missing_scope`, `not_in_channel`, `Forbidden`, `401/403` → 頻道驗證或權限問題。

相關連結：

- [/channels/troubleshooting](/channels/troubleshooting_zh_TW)
- [/channels/whatsapp](/channels/whatsapp_zh_TW)
- [/channels/telegram](/channels/telegram_zh_TW)
- [/channels/discord](/channels/discord_zh_TW)

## 排程任務 (Cron) 與心跳遞送

如果排程任務或心跳 (Heartbeat) 未執行或未送達，請先驗證排程器狀態，再檢查遞送目標。

```bash
openclaw cron status
openclaw cron list
openclaw cron runs --id <jobId> --limit 20
openclaw system heartbeat last
openclaw logs --follow
```

檢查重點：

- 排程任務是否已啟用，且存在下次喚醒時間。
- 工作執行紀錄的狀態 (`ok`, `skipped`, `error`)。
- 心跳跳過的原因 (`quiet-hours` 靜音時段, `requests-in-flight` 正在處理中, `alerts-disabled`)。

常見的錯誤特徵：

- `cron: scheduler disabled; jobs will not run automatically` → 排程任務已停用。
- `cron: timer tick failed` → 排程器計時失敗；檢查檔案、日誌或執行階段錯誤。
- `heartbeat skipped` 並帶有 `reason=quiet-hours` → 處於非活躍時段。
- `heartbeat: unknown accountId` → 心跳遞送目標的帳號 ID 無效。

相關連結：

- [/automation/troubleshooting](/automation/troubleshooting_zh_TW)
- [/automation/cron-jobs](/automation/cron-jobs_zh_TW)
- [/gateway/heartbeat](/gateway/heartbeat_zh_TW)

## 節點配對工具失敗

如果節點已配對但工具執行失敗，請釐清前台狀態、權限以及核准狀態。

```bash
openclaw nodes status
openclaw nodes describe --node <idOrNameOrIp>
openclaw approvals get --node <idOrNameOrIp>
openclaw logs --follow
openclaw status
```

檢查重點：

- 節點是否在線且具備預期的能力。
- 作業系統的相機、麥克風、位置與螢幕權限是否已授權。
- 執行核准 (Exec approvals) 與允許清單狀態。

常見的錯誤特徵：

- `NODE_BACKGROUND_UNAVAILABLE` → 節點 App 必須在前景執行。
- `*_PERMISSION_REQUIRED` / `LOCATION_PERMISSION_REQUIRED` → 缺失作業系統權限。
- `SYSTEM_RUN_DENIED: approval required` → 執行核准尚在等待中。
- `SYSTEM_RUN_DENIED: allowlist miss` → 指令被允許清單阻擋。

相關連結：

- [/nodes/troubleshooting](/nodes/troubleshooting_zh_TW)
- [/nodes/index](/nodes/index_zh_TW)
- [/tools/exec-approvals](/tools/exec-approvals_zh_TW)

## 瀏覽器工具失敗

當閘道器本身健康，但瀏覽器工具動作失敗時，請使用此部分。

```bash
openclaw browser status
openclaw browser start --browser-profile openclaw
openclaw browser profiles
openclaw logs --follow
openclaw doctor
```

檢查重點：

- 瀏覽器執行檔路徑是否有效。
- CDP 設定檔的可達性。
- 針對 `profile="chrome"`，檢查擴充功能中繼分頁是否已附加。

常見的錯誤特徵：

- `Failed to start Chrome CDP on port` → 瀏覽器程序啟動失敗。
- `browser.executablePath not found` → 設定的路徑無效。
- `Chrome extension relay is running, but no tab is connected` → 擴充功能中繼程式未附加任何分頁。
- `Browser attachOnly is enabled ... not reachable` → 僅限附加 (attach-only) 的設定檔找不到可連線的目標。

相關連結：

- [/tools/browser-linux-troubleshooting](/tools/browser-linux-troubleshooting_zh_TW)
- [/tools/chrome-extension](/tools/chrome-extension_zh_TW)
- [/tools/browser](/tools/browser_zh_TW)

## 如果您剛完成升級且功能突然異常

大多數升級後的異常通常是由於組態偏離 (drift) 或現在執行了更嚴格的預設規範。

### 1) 驗證與 URL 覆寫行為變更

```bash
openclaw gateway status
openclaw config get gateway.mode
openclaw config get gateway.remote.url
openclaw config get gateway.auth.mode
```

檢查重點：

- 如果 `gateway.mode=remote`，CLI 調用可能會指向遠端，而您的本地服務其實運作正常。
- 明確使用 `--url` 的調用不會自動套用儲存的憑證。

常見的錯誤特徵：

- `gateway connect failed:` → 目標 URL 錯誤。
- `unauthorized` → 端點可連線但驗證資訊錯誤。

### 2) 綁定與驗證護欄更趨嚴格

```bash
openclaw config get gateway.bind
openclaw config get gateway.auth.token
openclaw gateway status
openclaw logs --follow
```

檢查重點：

- 非迴路位址 (Loopback) 綁定（如 `lan`, `tailnet`, `custom`）必須設定驗證資訊。
- 舊有的鍵名如 `gateway.token` 不會取代 `gateway.auth.token`。

常見的錯誤特徵：

- `refusing to bind gateway ... without auth` → 綁定方式與驗證設定不符。
- `RPC probe: failed` 且執行階段正常執行中 → 閘道器存活但目前的驗證/URL 無法存取。

### 3) 配對與裝置識別狀態變更

```bash
openclaw devices list
openclaw pairing list <channel>
openclaw logs --follow
openclaw doctor
```

檢查重點：

- 儀表板或節點是否有待處理的裝置核准。
- 原則或身分變更後，私訊配對核准是否仍待處理。

常見的錯誤特徵：

- `device identity required` → 未滿足裝置驗證。
- `pairing required` → 傳送者或裝置必須經過核准。

如果檢查後服務組態與執行階段仍不一致，請從同一個設定檔/狀態目錄重新安裝服務元數據：

```bash
openclaw gateway install --force
openclaw gateway restart
```

相關連結：

- [/gateway/pairing](/gateway/pairing_zh_TW)
- [/gateway/authentication](/gateway/authentication_zh_TW)
- [/gateway/background-process](/gateway/background-process_zh_TW)
