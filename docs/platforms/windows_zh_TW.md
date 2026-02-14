---
summary: "Windows (WSL2) 支援度與配套 App 狀態說明"
read_when:
  - 在 Windows 上安裝 OpenClaw 時
  - 尋找 Windows 配套 App 的開發狀態時
title: "Windows (WSL2)"
---

> 此文件為 [English Version](/platforms/windows_zh_TW) 的繁體中文版本。

# Windows (WSL2)

在 Windows 上使用 OpenClaw，我們強烈建議 **透過 WSL2**（建議使用 Ubuntu）。CLI 與閘道器 (Gateway) 執行於 Linux 內部，這能保持執行環境的一致性，並使工具（Node/Bun/pnpm、Linux 二進位檔、技能）具備極高的相容性。原生 Windows 環境的設定會相對複雜。

原生的 Windows 配套 App 正在規劃中。

## 安裝指南 (WSL2)

- [開始使用 (Getting started)](/start/getting-started_zh_TW)（在 WSL 內部執行）。
- [安裝與更新](/install/updating_zh_TW)。
- 微軟官方 WSL2 指南：[https://learn.microsoft.com/windows/wsl/install](https://learn.microsoft.com/windows/wsl/install)

## 閘道器服務安裝 (CLI)

在 WSL2 內部執行：
```bash
# 透過引導設定安裝
openclaw onboard --install-daemon

# 或透過配置流程
openclaw configure
# 提示時選擇 Gateway service
```

## 進階：透過區域網路公開 WSL 服務 (portproxy)

WSL 有自己的虛擬網路。若其它機器需要存取 **執行於 WSL 內部** 的服務（如 SSH 或閘道器），您必須將 Windows 連接埠轉發至目前的 WSL IP。由於 WSL IP 在重啟後會變動，您可能需要重新整理轉發規則。

範例（**以管理員身分** 執行 PowerShell）：

```powershell
$Distro = "Ubuntu-24.04"
$ListenPort = 2222
$TargetPort = 22

$WslIp = (wsl -d $Distro -- hostname -I).Trim().Split(" ")[0]
if (-not $WslIp) { throw "找不到 WSL IP。" }

# 新增轉發規則
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=$ListenPort `
  connectaddress=$WslIp connectport=$TargetPort

# 允許通過 Windows 防火牆
New-NetFirewallRule -DisplayName "WSL SSH $ListenPort" -Direction Inbound `
  -Protocol TCP -LocalPort $ListenPort -Action Allow
```

## 逐步 WSL2 安裝教學

### 1) 安裝 WSL2 與 Ubuntu
以管理員身分開啟 PowerShell：
```powershell
wsl --install -d Ubuntu-24.04
```

### 2) 啟用 systemd（閘道器服務安裝必備）
在您的 WSL 終端機內：
```bash
sudo tee /etc/wsl.conf >/dev/null <<'EOF'
[boot]
systemd=true
EOF
```
接著在 PowerShell 執行 `wsl --shutdown` 並重新開啟 Ubuntu。

### 3) 安裝 OpenClaw
在 WSL 內部遵循 Linux 安裝流程：
```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm build
openclaw onboard
```
