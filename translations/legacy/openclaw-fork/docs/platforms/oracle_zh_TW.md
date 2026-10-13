---
summary: "在 Oracle Cloud 上執行 OpenClaw (始終免費 ARM 實例)"
read_when:
  - 在 Oracle Cloud 上設定 OpenClaw 時
  - 尋找 OpenClaw 的低成本 VPS 託管方案時
  - 想要在小型伺服器上 24/7 執行 OpenClaw 時
title: "Oracle Cloud"
---

> 此文件為 [English Version](/platforms/oracle_zh_TW) 的繁體中文版本。

# 在 Oracle Cloud (OCI) 上使用 OpenClaw

## 目標
在 Oracle Cloud (甲骨文雲) 的 **始終免費 (Always Free)** ARM 層級上執行一個持續在線的 OpenClaw 閘道器。

Oracle 的免費層級非常適合 OpenClaw，但也有其權衡：
- **ARM 架構**：大多數功能皆可運作，但某些二進位檔可能僅支援 x86。
- **容量限制**：免費實例的建立有時需要碰運氣或排隊。

## 成本分析比較 (2026)

| 提供者       | 方案            | 規格                   | 每月價格 | 備註                  |
| ------------ | --------------- | ---------------------- | -------- | --------------------- |
| Oracle Cloud | Always Free ARM | 最多 4 OCPU, 24GB RAM  | $0       | ARM，容量有限         |
| Hetzner      | CX22            | 2 vCPU, 4GB RAM        | ~ $4     | 最便宜的付費選項      |
| DigitalOcean | Basic           | 1 vCPU, 1GB RAM        | $6       | 介面友好，文件豐富    |

---

## 事前準備
- Oracle Cloud 帳號。
- Tailscale 帳號（可於 [tailscale.com](https://tailscale.com) 免費註冊）。

## 1) 建立 OCI 實例 (Instance)

1. 登入 [Oracle Cloud 主控台](https://cloud.oracle.com/)。
2. 前往 **Compute → Instances → Create Instance**。
3. 配置如下：
   - **名稱**：`openclaw`。
   - **映像檔**：Ubuntu 24.04 (aarch64)。
   - **資源配置 (Shape)**：`VM.Standard.A1.Flex` (Ampere ARM)。
   - **OCPUs**：2 (或最多 4)。
   - **記憶體**：12 GB (或最多 24 GB)。
   - **開機磁碟**：50 GB。
   - **SSH 密鑰**：新增您的公鑰。
4. 點擊 **Create**。

**提示**：若出現「Out of capacity（容量不足）」錯誤，請嘗試不同的可用性網域 (Availability domain) 或稍後再試。

## 2) 連線與更新

```bash
# 透過公網 IP 連線
ssh ubuntu@您的公網IP

# 更新系統
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential
```

## 3) 設定使用者與主機名稱

```bash
sudo hostnamectl set-hostname openclaw
# 啟用延遲關閉（登出後保持服務執行）
sudo loginctl enable-linger ubuntu
```

## 4) 安裝 Tailscale

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up --ssh --hostname=openclaw
```

現在您可以直接執行 `ssh ubuntu@openclaw` 連線，不再需要公網 IP。

## 5) 安裝 OpenClaw

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
source ~/.bashrc
```

提示 "How do you want to hatch your bot?" 時，請選擇 **"Do this later"**。

## 6) 配置閘道器與 Tailscale Serve

我們建議將閘道器限制在本地，並透過 Tailscale Serve 公開，以確保安全性。

```bash
# 保持閘道器在 VM 內部私有
openclaw config set gateway.bind loopback

# 要求權杖驗證
openclaw config set gateway.auth.mode token
openclaw doctor --generate-gateway-token

# 透過 Tailscale Serve 公開 (HTTPS)
openclaw config set gateway.tailscale.mode serve
openclaw config set gateway.trustedProxies '["127.0.0.1"]'

systemctl --user restart openclaw-gateway
```

## 7) 鎖定 VCN 安全性規則

現在一切運作正常，請鎖定 VCN 以封鎖除了 Tailscale 以外的所有流量。

1. 前往 OCI 主控台的 **Networking → Virtual Cloud Networks**。
2. 點選您的 VCN → **Security Lists** → Default Security List。
3. **移除** 所有入站規則 (Ingress Rules)，僅保留：
   - `0.0.0.0/0 UDP 41641` (Tailscale)。
4. 保留預設的出站規則。

這樣會從網路邊緣封鎖 22 埠 (SSH)、HTTP 等所有連線。從現在起，您只能透過 Tailscale 連線。

---

## 存取控制介面 (Control UI)

在您 Tailscale 網路中的任何裝置上存取：
`https://openclaw.<您的Tailnet名稱>.ts.net/`

Tailscale 提供：
- HTTPS 加密（自動處理憑證）。
- 透過 Tailscale 身分進行驗證。
- 跨裝置存取（電腦、手機等）。
