---
summary: "在沙箱化的 macOS 虛擬機器 (VM) 中執行 OpenClaw，適用於需要隔離環境或 iMessage 整合的情境"
read_when:
  - 您想要將 OpenClaw 與您的主要 macOS 環境隔離時
  - 您想要在沙箱中使用 iMessage 整合 (BlueBubbles) 時
  - 您想要一個可重置、可複製的 macOS 環境時
title: "macOS 虛擬機器 (VMs)"
---

> 此文件為 [English Version](/install/macos-vm_zh_TW) 的繁體中文版本。

# 在 macOS 虛擬機器 (VM) 上使用 OpenClaw

## 為什麼要使用 macOS VM？
使用 macOS 虛擬機器通常是為了獲得 **iMessage (BlueBubbles)** 的整合能力，或是為了與您日常使用的 Mac 系統進行嚴格隔離。

## 虛擬機器選項

### 在您的 Apple Silicon Mac 上執行本地 VM (Lume)
使用 [Lume](https://cua.ai/docs/lume) 在現有的 Apple Silicon Mac 上執行沙箱化的 macOS。這能帶給您：
- 隔離的完整 macOS 環境。
- 支援 iMessage (BlueBubbles)。
- 透過複製 VM 實現瞬間重置。
- 無需額外硬體或雲端費用。

---

## 快速入門 (Lume)

### 1) 安裝 Lume
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/trycua/cua/main/libs/lume/scripts/install.sh)"
```

### 2) 建立 macOS VM
```bash
lume create openclaw --os macos --ipsw latest
```
這會下載 macOS 並建立 VM，隨後會自動開啟 VNC 視窗。

### 3) 完成設定助理
在 VNC 視窗中：完成語系選擇、建立使用者帳號，並在「系統設定」→「一般」→「共享」中啟用 **遠端登錄 (SSH)**。

### 4) SSH 進入 VM 並安裝 OpenClaw
獲取 IP 位址：`lume get openclaw`。
連線：`ssh 使用者名稱@192.168.64.X`。
安裝 OpenClaw：
```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

### 5) 整合 iMessage (BlueBubbles)
這是在 macOS 上執行的核心優勢。在 VM 內安裝 BlueBubbles App，並將 Webhook 指向您的 OpenClaw 閘道器。

### 6) 儲存「黃金映像檔 (Golden Image)」
在進一步自訂前，先拍下乾淨狀態的快照：
```bash
lume stop openclaw
lume clone openclaw openclaw-golden
```
未來隨時可以從此狀態重置。

---

## 相關連結
- [VPS 託管指南](/vps_zh_TW)
- [節點概念 (Nodes)](/nodes_zh_TW)
- [BlueBubbles 頻道設定](/channels/bluebubbles_zh_TW)
