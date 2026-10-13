---
title: Fly.io
description: 在 Fly.io 上部署 OpenClaw
---

> 此文件為 [English Version](/install/fly_zh_TW) 的繁體中文版本。

# Fly.io 部署指南

**目標：** 在 [Fly.io](https://fly.io) 機器上執行 OpenClaw 閘道器，具備持久化儲存、自動 HTTPS 以及通訊頻道存取權。

## 事前準備

- 已安裝 [flyctl CLI](https://fly.io/docs/hands-on/install-flyctl/)。
- Fly.io 帳號（免費層級即可）。
- 模型驗證：Anthropic API 密鑰（或其它提供者密鑰）。
- 頻道憑證：Discord Bot Token, Telegram Token 等。

## 1) 建立 Fly App

```bash
# 複製儲存庫
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# 建立新的 Fly App（請自訂名稱）
fly apps create my-openclaw

# 建立持久化磁碟卷軸 (1GB 通常足夠)
fly volumes create openclaw_data --size 1 --region iad
```

**提示**：請選擇離您較近的區域 (Region)。

## 2) 設定 fly.toml

編輯 `fly.toml` 以符合您的 App 名稱與需求。

**關鍵設定值：**
- `internal_port = 3000`：必須與啟動指令中的 `--port 3000` 相符。
- `memory = "2048mb"`：建議使用 **2GB** 記憶體以確保穩定。
- `OPENCLAW_STATE_DIR = "/data"`：將狀態持久化儲存於磁碟卷軸中。

## 3) 設定秘密資訊 (Secrets)

```bash
# 必要：閘道器權杖 (用於非本地繫結)
fly secrets set OPENCLAW_GATEWAY_TOKEN=$(openssl rand -hex 32)

# 模型提供者 API 密鑰
fly secrets set ANTHROPIC_API_KEY=sk-ant-...

# 頻道權杖
fly secrets set DISCORD_BOT_TOKEN=MTQ...
```

**注意**：建議優先使用 **環境變數 (Secrets)** 而非組態檔案來儲存 API 密鑰，以避免秘密資訊被意外記錄。

## 4) 部署

```bash
fly deploy
```

部署後可透過以下指令驗證：
```bash
fly status
fly logs
```

## 5) 建立組態檔案

透過 SSH 進入機器建立正確的 `openclaw.json`：

```bash
fly ssh console
```

建立檔案：
```bash
mkdir -p /data
cat > /data/openclaw.json << 'EOF'
{
  "agents": {
    "defaults": {
      "model": { "primary": "anthropic/claude-opus-4-6" }
    }
  },
  "gateway": {
    "mode": "local",
    "bind": "auto"
  }
}
EOF
```

重啟以套用變更：
```bash
exit
fly machine restart <machine-id>
```

## 6) 存取閘道器

### 控制介面 (Control UI)
在瀏覽器開啟：`https://您的App名稱.fly.dev/`。貼入您的 `OPENCLAW_GATEWAY_TOKEN` 即可進行驗證。

## 疑難排解

- **記憶體溢出 (OOM)**：若機器頻繁重啟，請確認記憶體是否設為 2048mb。
- **閘道器鎖定問題**：若重啟後提示 "already running"，請透過 SSH 刪除 `/data/gateway.*.lock`。
- **狀態未持久化**：請確保 `fly.toml` 中正確設定了 `OPENCLAW_STATE_DIR=/data` 並已部署。

## 安全性：私有部署 (Hardened)
預設情況下 Fly 會分配公網 IP。若要強化安全性且 **不暴露於公網**：
1. 使用 `fly.private.toml` 進行部署。
2. 透過 `fly proxy 3000:3000` 在本地進行存取。
3. 這樣您的部署將對網際網路掃描程式隱形。
