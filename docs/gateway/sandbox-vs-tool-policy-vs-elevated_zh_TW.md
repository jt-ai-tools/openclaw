---
title: 沙箱 vs 工具原則 vs 提升權限
summary: "工具被阻擋的原因：沙箱執行環境、工具允許/拒絕原則，以及提升權限執行門控"
read_when: "當您遇到「沙箱監獄」或看到工具/提升權限請求被拒絕，且想知道確切的組態更動鍵名時。"
status: active
---

> 此文件為 [English Version](/gateway/sandbox-vs-tool-policy-vs-elevated_zh_TW) 的繁體中文版本。

# 沙箱 vs 工具原則 vs 提升權限

OpenClaw 具備三個相關但功能不同的控制機制：

1. **沙箱 (Sandbox)** (`agents.defaults.sandbox.*` / `agents.list[].sandbox.*`)：決定 **工具執行位置**（Docker 容器內 vs 宿主機）。
2. **工具原則 (Tool policy)** (`tools.*`, `tools.sandbox.tools.*`, `agents.list[].tools.*`)：決定 **哪些工具可用/被允許**。
3. **提升權限 (Elevated)** (`tools.elevated.*`, `agents.list[].tools.elevated.*`)：是專屬 exec 的 **逃生口**，讓您在沙箱環境下仍能在宿主機執行。

## 快速偵錯

使用檢查器查看 OpenClaw *實際上* 在做什麼：

```bash
openclaw sandbox explain
openclaw sandbox explain --session agent:main:main
openclaw sandbox explain --agent work
openclaw sandbox explain --json
```

它會印出：

- 實際生效的沙箱模式/範圍/工作區存取權
- 該會話目前是否被沙箱化（主會話 vs 非主會話）
- 實際生效的沙箱工具允許/拒絕清單（以及其來源：代理人/全域/預設）
- 提升權限的門控狀態與對應的組態鍵名路徑

## 沙箱：工具執行之處

沙箱化由 `agents.defaults.sandbox.mode` 控制：

- `"off"`：所有工具皆在宿主機執行。
- `"non-main"`：僅有非主會話 (non-main) 會被沙箱化（群組/頻道會話常因此產生預期外的沙箱行為）。
- `"all"`：所有會話皆在沙箱中執行。

請參閱 [沙箱 (Sandboxing)](/gateway/sandboxing_zh_TW) 以獲取完整的行為矩陣（範圍、工作區掛載、映像檔）。

### 自訂掛載 (安全性快速檢查)

- `docker.binds` 會 *穿透 (pierce)* 沙箱檔案系統：您掛載的任何內容都會以您設定的模式 (`:ro` 或 `:rw`) 在容器內可見。
- 若省略模式，預設為讀寫 (read-write)；針對原始碼或機密資訊，建議優先使用 `:ro`。
- `scope: "shared"` 會忽略個別代理人的掛載設定（僅套用全域掛載）。
- 掛載 `/var/run/docker.sock` 等同於將宿主機的控制權交給沙箱；請務必謹慎操作。
- 工作區存取權 (`workspaceAccess: "ro"`/`"rw"`) 獨立於掛載模式之外。

## 工具原則：哪些工具存在且可被調用

涉及兩個層面：

- **工具設定檔 (Tool profile)**：`tools.profile` 與 `agents.list[].tools.profile`（基礎允許清單）
- **提供者專屬工具設定檔**：`tools.byProvider[provider].profile` 與 `agents.list[].tools.byProvider[provider].profile`
- **全域/各代理人工具原則**：`tools.allow`/`tools.deny` 與 `agents.list[].tools.allow`/`agents.list[].tools.deny`
- **提供者專屬工具原則**：`tools.byProvider[provider].allow/deny` 與 `agents.list[].tools.byProvider[provider].allow/deny`
- **沙箱工具原則**（僅在沙箱化時套用）：`tools.sandbox.tools.allow`/`tools.sandbox.tools.deny` 與 `agents.list[].tools.sandbox.tools.*`

準則：

- `deny`（拒絕）一律勝出。
- 若 `allow`（允許）清單不為空，其餘所有工具皆被視為阻擋。
- 工具原則是硬性限制：`/exec` 指令無法覆寫已被拒絕的 `exec` 工具。
- `/exec` 僅能為授權的傳送者更改會話預設值；它本身並不授予工具存取權。
  提供者工具鍵名接受 `provider`（例如 `google-antigravity`）或 `provider/model`（例如 `openai/gpt-5.2`）。

### 工具群組 (簡寫)

工具原則（全域、代理人、沙箱）支援 `group:*` 項目，可展開為多個工具：

```json5
{
  tools: {
    sandbox: {
      tools: {
        allow: ["group:runtime", "group:fs", "group:sessions", "group:memory"],
      },
    },
  },
}
```

可用群組：

- `group:runtime`：`exec`, `bash`, `process`
- `group:fs`：`read`, `write`, `edit`, `apply_patch`
- `group:sessions`：`sessions_list`, `sessions_history`, `sessions_send`, `sessions_spawn`, `session_status`
- `group:memory`：`memory_search`, `memory_get`
- `group:ui`：`browser`, `canvas`
- `group:automation`：`cron`, `gateway`
- `group:messaging`：`message`
- `group:nodes`：`nodes`
- `group:openclaw`：所有內建的 OpenClaw 工具（不含提供者外掛程式）

## 提升權限：僅限 exec 的「在宿主機執行」

提升權限 (Elevated) 功能 **不會** 授予額外的工具；它僅影響 `exec`。

- 如果您處於沙箱環境，使用 `/elevated on`（或在 `exec` 調用中設定 `elevated: true`）會在宿主機執行（仍可能需要核准）。
- 使用 `/elevated full` 可為該會話跳過所有的執行核准步驟。
- 如果您本就直接在宿主機執行，提升權限實際上是一個無操作 (no-op) 指令（但仍受門控約束）。
- 提升權限 **不具備** 技能 (skill) 範圍，且 **無法** 覆寫工具的允許/拒絕清單。
- `/exec` 與提升權限是分開的。它僅為授權的操作員調整各對談的 exec 預設值。

門控 (Gates)：

- 啟用狀態：`tools.elevated.enabled`（以及選用的 `agents.list[].tools.elevated.enabled`）
- 傳送者允許清單：`tools.elevated.allowFrom.<provider>`（以及選用的 `agents.list[].tools.elevated.allowFrom.<provider>`）

請參閱 [提升權限模式](/tools/elevated_zh_TW)。

## 常見「沙箱監獄」修復方法

### 「工具 X 被沙箱工具原則阻擋」

修復鍵名（擇一）：

- 停用沙箱：`agents.defaults.sandbox.mode=off`（或針對個別代理人設定 `agents.list[].sandbox.mode=off`）
- 在沙箱內允許該工具：
  - 從 `tools.sandbox.tools.deny`（或代理人專屬的 `deny` 清單）中移除
  - 或將其加入 `tools.sandbox.tools.allow`（或代理人專屬的 `allow` 清單）

### 「我以為這是主會話，為什麼被沙箱化了？」

在 `"non-main"` 模式下，群組/頻道金鑰 **不被視為** 主會話。請使用主會話金鑰（可透過 `sandbox explain` 查看）或將模式切換為 `"off"`。
