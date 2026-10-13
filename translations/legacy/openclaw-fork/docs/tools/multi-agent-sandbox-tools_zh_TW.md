---
summary: "個別代理人的沙箱與工具限制、優先順序及範例說明"
title: 多代理人沙箱與工具
read_when: "您想要在多代理人閘道器中設定個別代理人的沙箱或工具允許/拒絕策略時。"
---

> 此文件為 [English Version](/tools/multi-agent-sandbox-tools_zh_TW) 的繁體中文版本。

# 多代理人沙箱與工具組態 (Multi-Agent Sandbox & Tools)

## 概觀

在多代理人設定中，每個代理人現在可以擁有自己的：
- **沙箱組態** (`agents.list[].sandbox` 可覆寫 `agents.defaults.sandbox`)。
- **工具限制** (`tools.allow` / `tools.deny` 以及 `agents.list[].tools`)。

這讓您可以執行具備不同安全性配置的多個代理人：
- **個人助理**：具備完整存取權。
- **家庭/工作代理人**：具備受限的工具。
- **對外公開代理人**：執行於沙箱中。

**驗證資訊** 是按代理人區分的：每個代理人從其自身的 `agentDir` 驗證儲存庫讀取憑證。憑證 **不會** 在代理人間共用。

關於沙箱在執行時期的行為，請參閱 [沙箱 (Sandboxing)](/gateway/sandboxing_zh_TW)。

---

## 組態範例

### 範例 1：個人 + 受限的家庭代理人

```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "default": true,
        "name": "個人助理",
        "sandbox": { "mode": "off" } // 關閉沙箱
      },
      {
        "id": "family",
        "name": "家庭機器人",
        "sandbox": {
          "mode": "all",
          "scope": "agent" // 每個代理人一個容器
        },
        "tools": {
          "allow": ["read"],
          "deny": ["exec", "write", "edit", "apply_patch", "process", "browser"]
        }
      }
    ]
  }
}
```

---

## 組態優先順序

當全域設定 (`agents.defaults.*`) 與代理人專屬設定 (`agents.list[].*`) 同時存在時：

### 沙箱組態
代理人專屬設定優先於全域設定。

### 工具限制 (過濾順序)
工具過濾會依序執行以下層級，每一層僅能縮減工具集，無法恢復前一層已拒絕的工具：
1. **工具設定檔 (Tool profile)**
2. **提供者工具設定檔 (Provider tool profile)**
3. **全域工具策略 (Global tool policy)**
4. **提供者工具策略 (Provider tool policy)**
5. **代理人專屬工具策略 (Agent-specific tool policy)**
6. **代理人提供者策略 (Agent provider policy)**
7. **沙箱工具策略 (Sandbox tool policy)**
8. **子代理人工具策略 (Subagent tool policy)**

### 工具群組 (Shorthands)
支援 `group:*` 項目，可展開為多個具體工具：
- `group:runtime`：`exec`, `bash`, `process`
- `group:fs`：`read`, `write`, `edit`, `apply_patch`
- `group:sessions`：`sessions_list`, `sessions_history`, `sessions_send`, `sessions_spawn`, `session_status`
- `group:memory`：`memory_search`, `memory_get`
- `group:ui`：`browser`, `canvas`
- `group:automation`：`cron`, `gateway`
- `group:messaging`：`message`
- `group:nodes`：`nodes`
- `group:openclaw`：所有內建工具。

---

## 常見陷阱："non-main"
`agents.defaults.sandbox.mode: "non-main"` 是基於 `session.mainKey`（預設為 `"main"`）判定的。群組或頻道工作階段一律會獲得自己的金鑰，因此會被視為 "non-main" 並進入沙箱。如果您希望某個代理人 **永不** 進入沙箱，請明確設定 `agents.list[].sandbox.mode: "off"`。

---

## 相關資訊：
- [多代理人路由 (Multi-Agent Routing)](/concepts/multi-agent_zh_TW)
- [閘道器組態：沙箱部分](/gateway/configuration_zh_TW#agentsdefaults-sandbox)
- [工作階段管理 (Session Management)](/concepts/session_zh_TW)
