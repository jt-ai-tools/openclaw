---
summary: "重構計畫：執行主機路由、節點核准以及無頭執行器說明"
read_when:
  - 設計執行主機路由或執行核准功能時
  - 實作節點執行器與 UI IPC 時
  - 新增執行主機安全模式與斜線指令時
title: "執行主機重構"
---

> 此文件為 [English Version](/refactor/exec-host_zh_TW) 的繁體中文版本。

# 執行主機重構計畫 (Exec host refactor)

## 核心目標
- 引入 `exec.host` 與 `exec.security`，在 **沙箱 (sandbox)**、**閘道器 (gateway)** 與 **節點 (node)** 之間路由指令執行。
- 保持預設值為 **安全模式**：除非明確啟用，否則禁止跨主機執行。
- 將執行邏輯拆分為 **無頭執行器服務 (Headless runner service)**，並透過本地 IPC 連接選用的 UI（macOS App）。
- 提供 **按代理人 (Per-agent)** 配置的策略、允許清單與詢問模式。
- 跨平台支援：使用 Unix Socket 與權杖驗證（macOS/Linux/Windows 一致性）。

## 關鍵概念

### 執行主機 (Host)
- **sandbox**：Docker 執行環境。
- **gateway**：執行於閘道器主機。
- **node**：透過 Bridge 協定執行於遠端節點。

### 安全模式 (Security mode)
- **deny**：一律封鎖。
- **allowlist**：僅允許匹配的指令。
- **full**：允許所有執行（等同於提升權限模式）。

### 詢問模式 (Ask mode)
- **off**：不提示。
- **on-miss**：僅在未命中允許清單時提示。
- **always**：每次皆提示。

## 核准存儲 (Approvals store)
路徑：`~/.openclaw/exec-approvals.json`
用途：存放本地策略、允許清單以及用於 UI 客戶端的 IPC 憑證。檔案權限嚴格限制為 `0600`。

## UI 整合 (macOS App)
- 使用位於 `~/.openclaw/exec-approvals.sock` 的 Unix Socket 進行通訊。
- 透過 nonce + HMAC 挑戰/回應機制防止重放攻擊。
- 執行器接收到指令後，透過 Socket 向 App 請求 UI 提示，App 在 UI 上下文中執行指令後回傳結果。

## 重構階段
- **階段 1**：實作組態與路由邏輯。
- **階段 2**：實作核准存儲與閘道器端的強制執行。
- **階段 3**：實作節點執行器與 macOS App 之間的 IPC 橋接。
- **階段 4 & 5**：整合執行事件與 UI 介面優化。
