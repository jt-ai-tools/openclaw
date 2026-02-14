---
summary: "在 exe.dev (VM + HTTPS 代理) 上執行 OpenClaw 閘道器以進行遠端存取"
read_when:
  - 您想要一個廉價且始終在線的 Linux 主機來執行閘道器時
  - 您想要遠端存取控制介面而不想自行架設 VPS 時
title: "exe.dev"
---

> 此文件為 [English Version](/install/exe-dev_zh_TW) 的繁體中文版本。

# exe.dev 部署指南

**目標：** 在 exe.dev VM 上執行 OpenClaw 閘道器，並透過 `https://<vm名稱>.exe.xyz` 從您的筆電進行存取。

## 初學者快速路徑

1. 前往 [https://exe.new/openclaw](https://exe.new/openclaw)。
2. 根據需求填入您的驗證金鑰/權杖。
3. 在您的 VM 旁點擊「Agent」，然後等待自動化完成。

## 使用 Shelley 進行自動化安裝

Shelley 是 [exe.dev](https://exe.dev) 的代理人，可以使用我們的提示詞立即為您安裝 OpenClaw。它會自動處理 Nginx 轉發設定、WebSocket 支援以及引導設定流程。

## 手動安裝步驟

### 1) 建立 VM
在您的裝置執行：
```bash
ssh exe.dev new
```
然後連線進入：
```bash
ssh <vm名稱>.exe.xyz
```

### 2) 安裝 OpenClaw
執行安裝腳本：
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### 3) 設定 Nginx 代理
編輯 `/etc/nginx/sites-enabled/default`，將流量從 8000 埠轉發至 OpenClaw 的預設埠 18789，並確保啟用了 WebSocket 支援。

### 4) 存取與授權
開啟 `https://<vm名稱>.exe.xyz/`。若提示驗證，請貼入 VM 上的閘道器權杖。使用 `openclaw devices list` 獲取請求 ID，並透過 `openclaw devices approve <請求ID>` 核准裝置連線。

## 遠端存取
遠端存取由 [exe.dev](https://exe.dev) 的身分驗證機制處理。預設情況下，來自 8000 埠的 HTTP 流量會被轉發至帶有電子郵件驗證保護的 HTTPS 網址。
