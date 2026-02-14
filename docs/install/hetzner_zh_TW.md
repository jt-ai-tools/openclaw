---
summary: "在廉價的 Hetzner VPS (Docker) 上執行 24/7 的 OpenClaw 閘道器，具備持久化狀態與內建二進位檔"
read_when:
  - 您想要在雲端 VPS 上全天候執行 OpenClaw 時
  - 您想要建立生產等級、始終在線的閘道器時
  - 您想要完全控制持久化、二進位檔與重啟行為時
title: "Hetzner"
---

> 此文件為 [English Version](/install/hetzner_zh_TW) 的繁體中文版本。

# 在 Hetzner 上使用 OpenClaw (Docker 生產環境指南)

## 目標
在 Hetzner VPS 上使用 Docker 執行一個持續在線的 OpenClaw 閘道器，並具備持久化狀態、內建二進位檔以及安全的重啟行為。

如果您想要以每月約 $5 美元的預算實現「24/7 全天候 OpenClaw」，這是最簡單且可靠的方案。

---

## 快速路徑
1. 租用 Hetzner VPS（建議選用 Ubuntu 或 Debian）。
2. 安裝 Docker。
3. 複製 OpenClaw 儲存庫。
4. 建立持久化目錄並設定權限。
5. 配置 `.env` 與 `docker-compose.yml`。
6. **關鍵步驟**：將必要的二進位檔（如 `gog`, `wacli`）寫入 Docker 映像檔。
7. 啟動容器並驗證存取。

---

## 1) 建立持久化目錄與權限
Docker 容器是瞬時的，所有持久狀態必須存放在主機上。

```bash
mkdir -p /root/.openclaw/workspace
# 將擁有者設為容器使用者 (uid 1000)
chown -R 1000:1000 /root/.openclaw
```

## 2) 內建二進位檔 (重要！)
任何在執行時期安裝的工具（透過 `apt` 或 `brew`）在容器重啟後都會消失。請務必在 Dockerfile 中使用 `RUN` 指令將工具安裝進去。

範例 Dockerfile 片段：
```dockerfile
# 安裝 Gmail CLI
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz 
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/gog
```

## 3) 啟動與存取
使用 `docker compose up -d` 啟動後，從您的筆電執行 SSH 隧道：
```bash
ssh -N -L 18789:127.0.0.1:18789 root@您的VPS_IP
```
然後在瀏覽器開啟 `http://127.0.0.1:18789/` 即可看到控制介面。

---

## 數據持久化對照表

| 組件                | 儲存位置                          | 持久化機制             |
| ------------------- | --------------------------------- | ---------------------- |
| 閘道器組態          | `/home/node/.openclaw/`           | 主機卷軸掛載 (Volume)  |
| 代理人工作區        | `/home/node/.openclaw/workspace/` | 主機卷軸掛載           |
| 外部工具 (如 gog)   | `/usr/local/bin/`                 | **寫入 Docker 映像檔** |
| 作業系統套件        | 容器檔案系統                      | **寫入 Docker 映像檔** |
