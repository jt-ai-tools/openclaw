---
summary: "Linux 支援度與配套 App 狀態說明"
read_when:
  - 尋找 Linux 配套 App 的開發狀態時
  - 規劃平台覆蓋範圍或進行貢獻時
title: "Linux App"
---

> 此文件為 [English Version](/platforms/linux_zh_TW) 的繁體中文版本。

# Linux 支援 (Linux App)

閘道器 (Gateway) 在 Linux 上獲得完整支援。**建議使用 Node 作為執行環境**。不建議為閘道器使用 Bun（存在 WhatsApp/Telegram 相關 Bug）。

原生的 Linux 配套 App 正在規劃中。如果您有興趣協助開發，歡迎參與貢獻。

## 初學者快速入門 (VPS)

1. 安裝 Node 22+。
2. `npm i -g openclaw@latest`。
3. `openclaw onboard --install-daemon`。
4. 從您的筆電執行 SSH 隧道：`ssh -N -L 18789:127.0.0.1:18789 <使用者>@<主機>`。
5. 開啟瀏覽器訪問 `http://127.0.0.1:18789/` 並貼入您的權杖 (Token)。

逐步的 VPS 指南請參閱：[exe.dev](/install/exe-dev_zh_TW)。

## 安裝指南

- [開始使用 (Getting started)](/start/getting-started_zh_TW)
- [安裝與更新](/install/updating_zh_TW)
- 其它流程：[Nix](/install/nix_zh_TW), [Docker](/install/docker_zh_TW)

## 閘道器管理

- [閘道器執行手冊 (Gateway runbook)](/gateway_zh_TW)
- [組態設定 (Configuration)](/gateway/configuration_zh_TW)

## 閘道器服務安裝 (CLI)

建議使用以下任一方式：
```bash
# 透過引導設定安裝
openclaw onboard --install-daemon

# 或直接安裝
openclaw gateway install

# 或透過配置流程
openclaw configure
# 提示時選擇 Gateway service
```

## 系統控制 (systemd user unit)

OpenClaw 預設安裝為 systemd **使用者 (user)** 服務。對於共用或始終在線的伺服器，建議使用 **系統 (system)** 服務。

最簡設定範例：
建立 `~/.config/systemd/user/openclaw-gateway.service`：

```ini
[Unit]
Description=OpenClaw Gateway
After=network-online.target

[Service]
ExecStart=/usr/local/bin/openclaw gateway --port 18789
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

啟用服務：
```bash
systemctl --user enable --now openclaw-gateway.service
```
