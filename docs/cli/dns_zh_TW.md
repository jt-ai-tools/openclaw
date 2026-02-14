---
summary: "`openclaw dns` (廣域探索輔助工具) 的 CLI 參考資料"
read_when:
  - 您想要透過 Tailscale + CoreDNS 實現廣域探索 (DNS-SD) 時
  - 您正在為自訂探索網域（例如 openclaw.internal）設定分割 DNS (Split DNS) 時
title: "dns"
---

> 此文件為 [English Version](/cli/dns_zh_TW) 的繁體中文版本。

# `openclaw dns`

用於廣域探索 (Wide-area discovery, DNS-SD) 的 DNS 輔助工具（結合 Tailscale 與 CoreDNS）。目前主要針對 macOS 與 Homebrew 版的 CoreDNS。

## 相關資訊：
- 閘道器探索說明：[探索 (Discovery)](/gateway/discovery_zh_TW)
- 廣域探索組態：[組態設定 (Configuration)](/gateway/configuration_zh_TW)

## 設定指令

```bash
# 檢查設定
openclaw dns setup

# 執行設定（需要 sudo 權限）
openclaw dns setup --apply
```
