---
summary: "在 DigitalOcean 上執行 OpenClaw (簡單的付費 VPS 選項)"
read_when:
  - 在 DigitalOcean 上設定 OpenClaw 時
  - 尋找 OpenClaw 的廉價 VPS 託管方案時
title: "DigitalOcean"
---

> 此文件為 [English Version](/platforms/digitalocean_zh_TW) 的繁體中文版本。

# 在 DigitalOcean 上使用 OpenClaw

## 目標
在 DigitalOcean 上執行一個持續在線的 OpenClaw 閘道器 (Gateway)，每月費用約為 **$6 美元**。

如果您想要 $0 元方案且不介意 ARM 架構與較複雜的設定，請參閱 [Oracle Cloud 指南](/platforms/oracle_zh_TW)。

## 成本分析比較 (2026)

| 提供者       | 方案            | 規格                   | 每月價格 | 備註                  |
| ------------ | --------------- | ---------------------- | -------- | --------------------- |
| DigitalOcean | Basic           | 1 vCPU, 1GB RAM        | $6       | 介面簡單，文件豐富    |
| Hetzner      | CX22            | 2 vCPU, 4GB RAM        | ~ $4     | CP 值最高的付費選項   |
| Oracle Cloud | Always Free ARM | 最多 4 OCPU, 24GB RAM  | $0       | 資源最強，但註冊困難  |

---

## 1) 建立 Droplet (實例)

1. 登入 [DigitalOcean](https://cloud.digitalocean.com/)。
2. 點擊 **Create → Droplets**。
3. 選擇：
   - **地區**：離您最近的地區。
   - **映像檔**：Ubuntu 24.04 LTS。
   - **規格**：Basic → Regular → **$6/mo** (1 vCPU, 1GB RAM, 25GB SSD)。
   - **驗證方式**：建議使用 SSH Key。
4. 點擊 **Create Droplet**。

## 2) 連線與安裝

```bash
# 透過 SSH 連線
ssh root@您的實例IP

# 安裝 Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# 安裝 OpenClaw
curl -fsSL https://openclaw.ai/install.sh | bash
```

## 3) 執行引導設定 (Onboarding)

```bash
openclaw onboard --install-daemon
```

精靈會引導您完成：模型驗證、頻道設定、權杖產生與系統服務安裝。

## 4) 存取儀表板 (Dashboard)

閘道器預設繫結於本地。存取控制介面的方法：

**選項 A：SSH 隧道（推薦）**
```bash
# 從您的筆電執行
ssh -L 18789:localhost:18789 root@您的實例IP
# 然後開啟瀏覽器訪問 http://localhost:18789
```

**選項 B：Tailscale Serve (HTTPS)**
安裝並啟動 Tailscale，然後執行：
```bash
openclaw config set gateway.tailscale.mode serve
openclaw gateway restart
```

## 5) 針對 1GB RAM 的優化建議

由於 $6 方案僅有 1GB 記憶體，建議執行以下優化：

### 新增 Swap (強烈建議)
```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### 使用雲端 API 模型
避免在 1GB RAM 的機器上執行本地 LLM（如 Ollama），建議使用 Claude 或 GPT 的 API 存取。
