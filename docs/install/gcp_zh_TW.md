---
summary: "在 GCP Compute Engine VM (Docker) 上執行 24/7 的 OpenClaw 閘道器，具備持久化狀態"
read_when:
  - 您想要在 GCP 上全天候執行 OpenClaw 時
  - 您想要在自己的 VM 上建立生產等級、始終在線的閘道器時
  - 您想要完全控制持久化、二進位檔與重啟行為時
title: "GCP"
---

> 此文件為 [English Version](/install/gcp_zh_TW) 的繁體中文版本。

# 在 GCP Compute Engine 上部署 OpenClaw (Docker 生產環境指南)

## 目標
在 Google Cloud (GCP) Compute Engine VM 上使用 Docker 執行一個持續在線的 OpenClaw 閘道器，並具備持久化狀態、內建二進位檔以及安全的重啟行為。

如果您想要以每月約 $5-12 美元的預算實現「24/7 全天候 OpenClaw」，這是最穩定且推薦的設定。

---

## 事前準備
- GCP 帳號。
- 已安裝 gcloud CLI。
- 具備 SSH 操作與複製/貼上指令的基本能力。
- 模型驗證憑證。

---

## 1) 建立 VM 實例 (Instance)

**建議規格：**
- **類型**：`e2-small` (2 vCPU, 2GB RAM)。若使用 `e2-micro` 可能在負載較大時發生記憶體溢出 (OOM)。

**CLI 指令：**
```bash
gcloud compute instances create openclaw-gateway 
  --zone=us-central1-a 
  --machine-type=e2-small 
  --boot-disk-size=20GB 
  --image-family=debian-12 
  --image-project=debian-cloud
```

---

## 2) SSH 進入 VM 並安裝 Docker

```bash
gcloud compute ssh openclaw-gateway --zone=us-central1-a

# 安裝 Docker
sudo apt-get update
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
exit # 重新登入以使權限生效
```

---

## 3) 複製儲存庫並設定環境變數

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
```

建立 `.env` 檔案：
```bash
OPENCLAW_GATEWAY_TOKEN=$(openssl rand -hex 32)
OPENCLAW_GATEWAY_BIND=lan
OPENCLAW_GATEWAY_PORT=18789
OPENCLAW_CONFIG_DIR=/home/$USER/.openclaw
OPENCLAW_WORKSPACE_DIR=/home/$USER/.openclaw/workspace
```

---

## 4) 內建二進位檔 (重要！)
在 Docker 執行環境中安裝二進位檔時，若不寫入 Dockerfile，重啟後會遺失。請在 Dockerfile 中使用 `RUN` 指令安裝必要的工具（如 `gog`, `wacli` 等）。

---

## 5) 建置與啟動

```bash
docker compose build
docker compose up -d openclaw-gateway
```

驗證狀態：
```bash
docker compose logs -f openclaw-gateway
```

---

## 6) 從您的電腦存取
建立 SSH 隧道以轉發連接埠：
```bash
gcloud compute ssh openclaw-gateway --zone=us-central1-a -- -L 18789:127.0.0.1:18789
```
接著在瀏覽器開啟 `http://127.0.0.1:18789/` 並貼入您的閘道器權杖。

---

## 數據持久化說明 (Source of Truth)

| 組件                | 位置                              | 備註                             |
| ------------------- | --------------------------------- | -------------------------------- |
| 閘道器組態          | `/home/node/.openclaw/`           | 包含 `openclaw.json` 與權杖      |
| 模型驗證設定檔      | `/home/node/.openclaw/`           | OAuth 權杖與 API 密鑰            |
| 代理人工作區        | `/home/node/.openclaw/workspace/` | 程式碼與產出物                   |
| 外部二進位檔        | `/usr/local/bin/`                 | **必須** 於建置時寫入 Docker 映像檔 |
