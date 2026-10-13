---
summary: "`openclaw approvals` (針對閘道器或節點主機的執行核准) 的 CLI 參考資料"
read_when:
  - 您想要透過 CLI 編輯執行核准 (exec approvals) 時
  - 您需要管理閘道器或節點主機上的允許清單時
title: "approvals"
---

> 此文件為 [English Version](/cli/approvals_zh_TW) 的繁體中文版本。

# `openclaw approvals`

管理 **本地主機**、**閘道器主機** 或 **節點主機** 的執行核准。
預設情況下，指令會鎖定磁碟上的本地核准檔案。使用 `--gateway` 可針對閘道器進行操作，使用 `--node` 則針對特定節點。

## 相關資訊：
- 執行核准說明：[執行核准 (Exec approvals)](/tools/exec-approvals_zh_TW)
- 節點說明：[節點 (Nodes)](/nodes_zh_TW)

## 常用指令

```bash
openclaw approvals get (獲取核准清單)
openclaw approvals get --node <ID|名稱|IP> (獲取特定節點的核准清單)
openclaw approvals get --gateway (獲取閘道器的核准清單)
```

## 從檔案替換核准設定

```bash
openclaw approvals set --file ./exec-approvals.json
openclaw approvals set --node <ID|名稱|IP> --file ./exec-approvals.json
openclaw approvals set --gateway --file ./exec-approvals.json
```

## 允許清單輔助指令

```bash
# 新增至允許清單
openclaw approvals allowlist add "~/Projects/**/bin/rg"
openclaw approvals allowlist add --agent main --node <ID|名稱|IP> "/usr/bin/uptime"
openclaw approvals allowlist add --agent "*" "/usr/bin/uname"

# 從允許清單中移除
openclaw approvals allowlist remove "~/Projects/**/bin/rg"
```

## 注意事項：

- `--agent` 預設為 `"*"`，代表套用於所有代理人。
- 節點主機必須具備 `system.execApprovals.get/set` 能力（macOS App 或無頭節點主機）。
- 核准設定檔案儲存於主機的 `~/.openclaw/exec-approvals.json`。
