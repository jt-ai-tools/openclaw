---
summary: "Exec 工具用法、標準輸入模式與 TTY 支援說明"
read_when:
  - 使用或修改 exec 工具時
  - 偵錯標準輸入 (stdin) 或 TTY 行為時
title: "Exec 工具"
---

> 此文件為 [English Version](/tools/exec_zh_TW) 的繁體中文版本。

# Exec 工具 (Exec tool)

在工作區中執行 Shell 指令。支援透過 `process` 工具進行前台或背景執行。
背景工作階段受限於個別代理人範圍；`process` 僅能看到來自同一代理人的工作階段。

## 參數說明

- `command` (必填)：要執行的指令。
- `workdir`：工作目錄（預設為目前目錄）。
- `yieldMs` (預設 10000)：延遲後自動轉入背景執行。
- `background` (布林值)：立即轉入背景執行。
- `timeout` (秒，預設 1800)：到期後砍掉程序。
- `pty` (布林值)：在虛擬終端機 (PTY) 中執行（適用於僅限 TTY 的 CLI 或終端機 UI）。
- `host` (`sandbox | gateway | node`)：執行位置（預設為 `sandbox`）。
- `security` (`deny | allowlist | full`)：閘道器或節點的執行安全模式。
- `ask` (`off | on-miss | always`)：是否彈出核准提示。
- `node`：針對 `host=node` 時指定的節點 ID。
- `elevated` (布林值)：請求提升權限模式（閘道器主機）。

## 重要注意事項

- **沙箱預設為關閉**。若未開啟沙箱，`host=sandbox` 會直接在閘道器主機上執行（不使用容器），且 **不需要核准**。若要強制執行核准，請使用 `host=gateway` 並配置核准設定。
- 主機執行 (`gateway`/`node`) 會拒絕自訂的 `env.PATH` 與載入器覆寫 (`LD_*`/`DYLD_*`)，以防止二進位檔劫持。
- 在非 Windows 主機上，工具優先使用 `bash` (或 `sh`) 以避免與 `fish` 等 Shell 不相容。

## 組態設定 (Config)

- `tools.exec.pathPrepend`：要加入 `PATH` 前端之目錄清單。
- `tools.exec.safeBins`：僅限標準輸入 (stdin-only) 的安全二進位檔，無需顯式允許即可執行。

## 工作階段覆寫 (`/exec`)

使用 `/exec` 指令可設定 **個別對談工作階段** 的 `host`, `security`, `ask` 與 `node` 預設值。不帶參數發送 `/exec` 可查看目前數值。

範例：
`/exec host=gateway security=allowlist ask=on-miss node=mac-1`

## 執行核准 (Exec approvals)

沙箱化的代理人在閘道器或節點主機執行 `exec` 前，可能需要逐次核准。
詳情請參閱：[執行核准 (Exec approvals)](/tools/exec-approvals_zh_TW)。

## 範例

前台執行：
`{ "tool": "exec", "command": "ls -la" }`

背景執行與輪詢：
`{"tool":"exec","command":"npm run build","yieldMs":1000}`
`{"tool":"process","action":"poll","sessionId":"<ID>"}`

發送按鍵 (類似 tmux)：
`{"tool":"process","action":"send-keys","sessionId":"<ID>","keys":["C-c"]}`
