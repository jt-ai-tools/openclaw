---
summary: "OpenClaw 的 VPS 託管中心 (Oracle/Fly/Hetzner/GCP/exe.dev)"
read_when:
  - 您想要在雲端執行閘道器時
  - 您需要 VPS/託管指南的快速導覽時
title: "VPS 託管"
---

> 此文件為 [English Version](/vps_zh_TW) 的繁體中文版本。

# VPS 託管 (VPS hosting)

本中心連結至支援的 VPS/託管指南，並從高層級解釋雲端部署的工作原理。

## 挑選提供者

- **Railway** (一鍵安裝 + 瀏覽器設定)：[Railway](/install/railway_zh_TW)
- **Northflank** (一鍵安裝 + 瀏覽器設定)：[Northflank](/install/northflank_zh_TW)
- **Oracle Cloud (始終免費)**：[Oracle](/platforms/oracle_zh_TW) — 每月 $0（始終免費 ARM 實例；註冊或額度取得可能較為困難）
- **Fly.io**：[Fly.io](/install/fly_zh_TW)
- **Hetzner (Docker)**：[Hetzner](/install/hetzner_zh_TW)
- **GCP (Compute Engine)**：[GCP](/install/gcp_zh_TW)
- **exe.dev** (VM + HTTPS 代理)：[exe.dev](/install/exe-dev_zh_TW)
- **AWS (EC2/Lightsail/免費試用)**：同樣運作良好。影片指南：[https://x.com/techfrenAJ/status/2014934471095812547](https://x.com/techfrenAJ/status/2014934471095812547)

## 雲端設定的工作原理

- **閘道器 (Gateway) 執行於 VPS 上**，並擁有狀態與工作區。
- 您可以從筆記型電腦/手機透過 **控制介面 (Control UI)** 或 **Tailscale/SSH** 進行連線。
- 將 VPS 視為單一事實來源 (Source of truth)，並定期 **備份** 狀態與工作區。
- 安全預設值：保持閘道器繫結於本地環回 (loopback)，並透過 SSH 隧道或 Tailscale Serve 存取。如果您繫結至 `lan`/`tailnet`，請務必要求 `gateway.auth.token` 或 `gateway.auth.password`。

遠端存取：[閘道器遠端 (Gateway remote)](/gateway/remote_zh_TW)  
平台中心：[平台 (Platforms)](/platforms_zh_TW)

## 在 VPS 上使用節點

您可以將閘道器保留在雲端，並配對您本地裝置（Mac/iOS/Android/無頭模式）上的 **節點 (Nodes)**。節點提供本地螢幕/相機/畫布與 `system.run` 能力，而閘道器則維持在雲端執行。

相關文件：[節點概觀 (Nodes)](/nodes_zh_TW), [Nodes CLI](/cli/nodes_zh_TW)
