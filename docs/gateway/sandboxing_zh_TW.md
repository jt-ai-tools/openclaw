---
summary: "OpenClaw 沙箱運作原理：模式、範圍、工作區存取權以及映像檔說明"
title: 沙箱 (Sandboxing)
read_when: "您需要沙箱功能的專屬說明，或需要調整 agents.defaults.sandbox 設定時。"
status: active
---

> 此文件為 [English Version](/gateway/sandboxing_zh_TW) 的繁體中文版本。

# 沙箱 (Sandboxing)

OpenClaw 可以 **在 Docker 容器內執行工具**，以縮減潛在的影響範圍 (blast radius)。
此功能為 **選用** 的，並透過組態設定 (`agents.defaults.sandbox` 或 `agents.list[].sandbox`) 進行控制。若沙箱功能關閉，工具將直接在宿主機上執行。
閘道器 (Gateway) 始終維持在宿主機執行；啟用時，僅有工具執行會切換至隔離的沙箱中。

雖然這不是完美的安全性邊界，但它能在模型做出不當行為時，實質限制其對檔案系統與程序的存取權。

## 哪些內容會被沙箱化

- 工具執行 (`exec`, `read`, `write`, `edit`, `apply_patch`, `process` 等)。
- 選用的沙箱化瀏覽器 (`agents.defaults.sandbox.browser`)。
  - 預設情況下，當瀏覽器工具需要時，沙箱瀏覽器會自動啟動（確保 CDP 可達）。
    可透過 `agents.defaults.sandbox.browser.autoStart` 與 `agents.defaults.sandbox.browser.autoStartTimeoutMs` 進行配置。
  - `agents.defaults.sandbox.browser.allowHostControl` 允許沙箱會話明確指定以宿主機瀏覽器為目標。
  - 選用的允許清單可用於控管 `target: "custom"`：`allowedControlUrls`, `allowedControlHosts`, `allowedControlPorts`。

不會被沙箱化：

- 閘道器程序本身。
- 任何明確允許在宿主機執行的工具（例如 `tools.elevated`）。
  - **提升權限的 exec 會在宿主機上執行並繞過沙箱。**
  - 如果沙箱已關閉，`tools.elevated` 不會改變執行方式（本就在宿主機）。請參閱 [提升權限模式](/tools/elevated_zh_TW)。

## 模式 (Modes)

`agents.defaults.sandbox.mode` 控制沙箱的 **使用時機**：

- `"off"`：不使用沙箱。
- `"non-main"`：僅對 **非主要 (non-main)** 會話使用沙箱（若您希望在宿主機進行日常聊天，請使用此預設值）。
- `"all"`：每個會話都在沙箱中執行。
  注意：`"non-main"` 是基於 `session.mainKey`（預設為 `"main"`），而非代理人 ID。
  群組/頻道會話會使用各自的金鑰，因此會被視為「非主要」並被沙箱化。

## 範圍 (Scope)

`agents.defaults.sandbox.scope` 控制會建立 **多少個容器**：

- `"session"` (預設)：每個會話一個容器。
- `"agent"`：每個代理人一個容器。
- `"shared"`：所有沙箱會話共用一個容器。

## 工作區存取權 (Workspace access)

`agents.defaults.sandbox.workspaceAccess` 控制 **沙箱可以看見什麼內容**：

- `"none"` (預設)：工具僅能看見位於 `~/.openclaw/sandboxes` 下的沙箱工作區。
- `"ro"`：將代理人工作區以唯讀方式掛載於 `/agent`（會停用 `write`/`edit`/`apply_patch`）。
- `"rw"`：將代理人工作區以讀寫方式掛載於 `/workspace`。

傳入的媒體檔案會被複製到作用中的沙箱工作區 (`media/inbound/*`)。
技能說明：`read` 工具是以沙箱根目錄為準。在 `workspaceAccess: "none"` 模式下，OpenClaw 會將符合條件的技能鏡像輸出到沙箱工作區 (`.../skills`) 以便讀取。在 `"rw"` 模式下，工作區技能可從 `/workspace/skills` 直接讀取。

## 自訂掛載 (Custom bind mounts)

`agents.defaults.sandbox.docker.binds` 可將額外的宿主機目錄掛載至容器內。
格式：`宿主機:容器:模式`（例如 `"/home/user/source:/source:rw"`）。

全域與各代理人的掛載設定會 **合併**（而非取代）。在 `scope: "shared"` 模式下，各代理人的掛載設定會被忽略。

範例（唯讀原始碼 + Docker socket）：

```json5
{
  agents: {
    defaults: {
      sandbox: {
        docker: {
          binds: ["/home/user/source:/source:ro", "/var/run/docker.sock:/var/run/docker.sock"],
        },
      },
    },
    list: [
      {
        id: "build",
        sandbox: {
          docker: {
            binds: ["/mnt/cache:/cache:rw"],
          },
        },
      },
    ],
  },
}
```

安全性注意事項：

- 掛載會繞過沙箱檔案系統：它們會根據您設定的模式 (`:ro` 或 `:rw`) 暴露宿主機路徑。
- 敏感路徑（例如 `docker.sock`、金鑰、SSH 密鑰）除非絕對必要，否則應設為 `:ro`。
- 如果您僅需要工作區的讀取權限，請搭配使用 `workspaceAccess: "ro"`；掛載模式保持獨立。
- 請參閱 [沙箱 vs 工具原則 vs 提升權限](/gateway/sandbox-vs-tool-policy-vs-elevated_zh_TW) 以了解掛載如何與工具原則及提升權限執行互動。

## 映像檔與設定

預設映像檔：`openclaw-sandbox:bookworm-slim`

請先建置一次：

```bash
scripts/sandbox-setup.sh
```

注意：預設映像檔 **不包含** Node。如果技能需要 Node（或其他執行環境），請建置自訂映像檔，或透過 `sandbox.docker.setupCommand` 進行安裝（需要網路連線 + 可寫入的 root + root 使用者）。

沙箱瀏覽器映像檔：

```bash
scripts/sandbox-browser-setup.sh
```

預設情況下，沙箱容器在執行時 **沒有網路連線**。
可透過 `agents.defaults.sandbox.docker.network` 覆寫。

Docker 安裝與容器化閘道器的相關說明請見：
[Docker](/install/docker_zh_TW)

## setupCommand (單次容器設定)

`setupCommand` 在沙箱容器建立後 **執行一次**（而非每次執行工具時）。
它會在容器內透過 `sh -lc` 執行。

路徑：

- 全域：`agents.defaults.sandbox.docker.setupCommand`
- 各代理人：`agents.list[].sandbox.docker.setupCommand`

常見問題：

- 預設 `docker.network` 為 `"none"` (無外網連線)，會導致套件安裝失敗。
- `readOnlyRoot: true` 會阻止寫入；請將其設為 `false` 或建置自訂映像檔。
- 安裝套件必須使用 root 使用者（省略 `user` 或設定 `user: "0:0"`）。
- 沙箱執行 **不會** 繼承宿主機的 `process.env`。請使用 `agents.defaults.sandbox.docker.env` (或自訂映像檔) 來傳遞技能所需的 API 密鑰。

## 工具原則與逃生口

工具的允許/拒絕原則優先於沙箱規則。如果某個工具在全域或代理人層級被停用，沙箱功能也無法將其恢復。

`tools.elevated` 是一個明確的逃生口 (escape hatch)，它會在宿主機上執行 `exec`。
`/exec` 指令僅適用於授權的傳送者並在會話期間持久化；若要完全停用 `exec`，請使用工具原則的拒絕設定（請參閱 [沙箱 vs 工具原則 vs 提升權限](/gateway/sandbox-vs-tool-policy-vs-elevated_zh_TW)）。

偵錯：

- 使用 `openclaw sandbox explain` 來檢查實際生效的沙箱模式、工具原則以及修復建議的組態鍵名。
- 請參閱 [沙箱 vs 工具原則 vs 提升權限](/gateway/sandbox-vs-tool-policy-vs-elevated_zh_TW) 以建立「為什麼這被阻擋了？」的心智模型。
  請務必保持嚴格限制。

## 多代理人覆寫

每個代理人都可以覆寫沙箱與工具設定：
分別透過 `agents.list[].sandbox` 與 `agents.list[].tools`（以及沙箱專屬工具原則 `agents.list[].tools.sandbox.tools`）。
優先順序請參閱 [多代理人沙箱與工具](/tools/multi-agent-sandbox-tools_zh_TW)。

## 最簡啟用範例

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",
        scope: "session",
        workspaceAccess: "none",
      },
    },
  },
}
```

## 相關文件

- [沙箱組態](/gateway/configuration_zh_TW#agentsdefaults-sandbox)
- [多代理人沙箱與工具](/tools/multi-agent-sandbox-tools_zh_TW)
- [安全性](/gateway/security_zh_TW)
