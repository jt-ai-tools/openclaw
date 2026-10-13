---
summary: "使用 Ansible、Tailscale VPN 與防火牆隔離，進行自動化且安全加固的 OpenClaw 安裝"
read_when:
  - 您想要進行具備安全性加固的自動化伺服器部署時
  - 您需要透過 VPN 存取的防火牆隔離環境時
  - 您正在部署至遠端 Debian/Ubuntu 伺服器時
title: "Ansible"
---

> 此文件為 [English Version](/install/ansible_zh_TW) 的繁體中文版本。

# Ansible 安裝指南

在生產環境伺服器部署 OpenClaw 的推薦方式是透過 **[openclaw-ansible](https://github.com/openclaw/openclaw-ansible)** —— 一個具備安全性優先架構的自動化安裝程式。

## 快速開始

一鍵安裝指令：
```bash
curl -fsSL https://raw.githubusercontent.com/openclaw/openclaw-ansible/main/install.sh | bash
```

> **📦 完整指南請參閱：[github.com/openclaw/openclaw-ansible](https://github.com/openclaw/openclaw-ansible)**

## 您將獲得什麼

- 🔒 **防火牆優先安全性**：結合 UFW 與 Docker 隔離（僅允許 SSH 與 Tailscale 存取）。
- 🔐 **Tailscale VPN**：無需將服務暴露於公網即可進行安全遠端存取。
- 🐳 **Docker**：用於代理人沙箱容器，採用 localhost-only 繫結。
- 🛡️ **深度防禦**：四層安全性架構。
- 🚀 **一鍵設定**：數分鐘內完成完整部署。
- 🔧 **Systemd 整合**：具備安全加固的開機自動啟動。

## 系統要求

- **作業系統**：Debian 11+ 或 Ubuntu 20.04+。
- **權限**：具備 Root 或 sudo 權限。
- **Ansible**：2.14+（快速安裝腳本會自動安裝）。

## 安裝內容

Ansible Playbook 會安裝並配置：
1. **Tailscale** (網狀 VPN)。
2. **UFW 防火牆** (僅開啟 SSH 與 Tailscale 連接埠)。
3. **Docker CE + Compose V2** (用於代理人沙箱)。
4. **Node.js 22.x + pnpm**。
5. **OpenClaw** (執行於主機端)。
6. **Systemd 服務**。

## 安裝後設定

安裝完成後，切換至 `openclaw` 使用者：
```bash
sudo -i -u openclaw
```
執行後置腳本進行引導設定、頻道登入與 Tailscale 連結。

## 安全架構：四層防禦

1. **防火牆 (UFW)**：僅對外公開 SSH (22) 與 Tailscale (41641/udp)。
2. **VPN (Tailscale)**：閘道器僅能透過 VPN 網格存取。
3. **Docker 隔離**：防止容器連接埠意外暴露。
4. **Systemd 加固**：使用非特權使用者執行，並限制程序權限。
