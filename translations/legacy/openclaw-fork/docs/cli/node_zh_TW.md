---
summary: "`openclaw node` (無頭節點主機) 的 CLI 參考資料"
read_when:
  - 執行無頭 (Headless) 節點主機時
  - 配對非 macOS 節點以使用 system.run 時
title: "node"
---

> 此文件為 [English Version](/cli/node_zh_TW) 的繁體中文版本。

# `openclaw node`

執行 **無頭節點主機 (Headless node host)**，該主機會連線至閘道器 (Gateway) 的 WebSocket，並在此機器上公開 `system.run` 與 `system.which` 能力。

## 為什麼要使用節點主機？

當您希望代理人在網路中的 **其它機器上執行指令**，但又不想要在那些機器上安裝完整的 macOS 配套 App 時，請使用節點主機。

常見使用情境：
- 在遠端 Linux/Windows 機器上執行指令（如建置伺服器、實驗室機器、NAS）。
- 保持閘道器上的執行環境為 **沙箱化 (Sandboxed)**，但將經過核准的執行任務委派給其它主機。
- 為自動化或 CI 節點提供輕量、無頭的執行目標。

執行過程仍受到節點主機上的 **執行核准 (Exec approvals)** 與個別代理人允許清單的保護。

## 瀏覽器代理 (零設定)

如果節點上未停用 `browser.enabled`，節點主機會自動宣告支援瀏覽器代理。這讓代理人能直接在該節點上使用瀏覽器自動化功能，無需額外設定。

## 執行 (前台模式)

```bash
openclaw node run --host <閘道器主機> --port 18789
```

## 服務管理 (背景模式)

將無頭節點主機安裝為使用者服務。

```bash
openclaw node install --host <閘道器主機> --port 18789
```

管理服務指令：
```bash
openclaw node status (狀態)
openclaw node stop (停止)
openclaw node restart (重啟)
openclaw node uninstall (解除安裝)
```

## 配對 (Pairing)

首次連線時，會在閘道器上建立一個待處理的節點配對請求。請透過以下方式核准：

```bash
openclaw nodes pending
openclaw nodes approve <請求ID>
```

節點主機會將其 ID、權杖、顯示名稱與閘道器連線資訊儲存在 `~/.openclaw/node.json`。

## 執行核准

`system.run` 能力受到本地執行核准的門控保護：
- `~/.openclaw/exec-approvals.json`
- [執行核准說明](/tools/exec-approvals_zh_TW)
- `openclaw approvals --node <ID|名稱|IP>` (從閘道端編輯)
