---
summary: "在樹莓派上執行 OpenClaw（平價自託管方案）"
read_when:
  - 在樹莓派上設定 OpenClaw 時
  - 在 ARM 裝置上執行 OpenClaw 時
  - 建立廉價且始終在線的個人 AI 時
title: "樹莓派 (Raspberry Pi)"
---

> 此文件為 [English Version](/platforms/raspberry-pi_zh_TW) 的繁體中文版本。

# 在樹莓派 (Raspberry Pi) 上使用 OpenClaw

## 目標
在樹莓派上執行一個持續且始終在線的 OpenClaw 閘道器，一次性硬體成本僅約 **$35-80 美元**（無每月維護費）。

非常適合：
- 24/7 全天候個人 AI 助理。
- 家庭自動化中心。
- 低功耗、隨時可用的 Telegram/WhatsApp 機器人。

## 硬體要求

| 樹莓派型號      | 記憶體  | 支援度   | 備註                               |
| --------------- | ------- | -------- | ---------------------------------- |
| **Pi 5**        | 4GB/8GB | ✅ 最佳  | 速度最快，強烈建議                 |
| **Pi 4**        | 4GB     | ✅ 良好  | 多數使用者的最佳平衡點             |
| **Pi 4**        | 2GB     | ✅ 可行  | 可運作，需增加 Swap                |
| **Pi 4**        | 1GB     | ⚠️ 吃緊  | 需使用 Swap，且組態需最小化        |
| **Pi Zero 2 W** | 512MB   | ❌       | 不建議使用                         |

## 1) 燒錄作業系統 (OS)

建議使用 **Raspberry Pi OS Lite (64-bit)** —— 無頭伺服器無需桌面環境。

1. 下載 [Raspberry Pi Imager](https://www.raspberrypi.com/software/)。
2. 選擇 OS：**Raspberry Pi OS Lite (64-bit)**。
3. 點擊齒輪圖示 (⚙️) 進行預先配置：
   - 設定主機名稱：`gateway-host`。
   - 啟用 SSH。
   - 設定使用者名稱與密碼。
4. 燒錄至 SD 卡或 USB 磁碟。

## 2) 透過 SSH 連線

```bash
ssh user@gateway-host
```

## 3) 系統設定

```bash
# 更新系統
sudo apt update && sudo apt upgrade -y

# 安裝必要套件
sudo apt install -y git curl build-essential

# 設定時區 (對 Cron/提醒非常重要)
sudo timedatectl set-timezone Asia/Taipei
```

## 4) 安裝 Node.js 22 (ARM64)

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

## 5) 新增 Swap (針對 2GB 以下記憶體尤為重要)

Swap 可防止記憶體溢出 (OOM) 導致的崩潰：

```bash
# 建立 2GB swap 檔案
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 設定永久生效
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 6) 安裝 OpenClaw

執行標準安裝指令：
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

## 7) 執行引導設定 (Onboarding)

```bash
openclaw onboard --install-daemon
```

## 8) 存取儀表板 (Dashboard)

由於樹莓派通常是無頭執行的，請從您的電腦建立 SSH 隧道進行存取：

```bash
# 從您的筆電執行
ssh -L 18789:localhost:18789 user@gateway-host

# 然後在瀏覽器開啟
open http://localhost:18789
```

或者使用 Tailscale 以獲得隨時隨地的存取權限。

---

## 效能優化建議

### 使用 USB SSD (顯著提升)
SD 卡速度慢且易磨損。使用 USB SSD 可以大幅提升效能。

### 減少記憶體消耗
```bash
# 減少 GPU 記憶體分配 (無頭模式)
echo 'gpu_mem=16' | sudo tee -a /boot/config.txt
```

---

## 成本分析比較

| 方案           | 一次性成本 | 每月成本 | 備註                      |
| -------------- | ---------- | -------- | ------------------------- |
| **Pi 4 (4GB)** | ~$55       | $0       | 建議配置                  |
| **Pi 5 (4GB)** | ~$60       | $0       | 最佳效能                  |
| DigitalOcean   | $0         | $6/月    | 每年約 $72 美元           |
| Hetzner        | $0         | ~€4/月   | 每年約 $50 美元           |

**回收期**：與雲端 VPS 相比，樹莓派約在 6-12 個月內即可回本。
