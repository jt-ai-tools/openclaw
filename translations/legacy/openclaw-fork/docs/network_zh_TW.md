---
summary: "網路中心：閘道器介面、配對、探索與安全性"
read_when:
  - 您需要網路架構與安全性概觀時
  - 您正在偵錯本地與 Tailnet 存取或配對問題時
  - 您想要查看網路相關文件的完整清單時
title: "網路 (Network)"
---

> 此文件為 [English Version](/network_zh_TW) 的繁體中文版本。

# 網路中心 (Network hub)

本中心連結了關於 OpenClaw 如何在 localhost、區域網路 (LAN) 與 Tailnet 之間連線、配對及保護裝置的核心文件。

## 核心模型

- [閘道器架構 (Gateway architecture)](/concepts/architecture_zh_TW)
- [閘道器通訊協定 (Gateway protocol)](/gateway/protocol_zh_TW)
- [閘道器執行手冊 (Gateway runbook)](/gateway_zh_TW)
- [網頁介面與繫結模式 (Web surfaces + bind modes)](/web_zh_TW)

## 配對與身分識別

- [配對概觀：私訊與節點 (Pairing overview)](/channels/pairing_zh_TW)
- [閘道器擁有的節點配對 (Gateway-owned node pairing)](/gateway/pairing_zh_TW)
- [Devices CLI：配對與權杖輪替 (Devices CLI)](/cli/devices_zh_TW)
- [Pairing CLI：私訊核准 (Pairing CLI)](/cli/pairing_zh_TW)

本地信任：

- 本地連線（環回位址 loopback 或閘道器主機自身的 Tailnet 位址）可以被設定為 **自動核准配對**，以保持同主機使用者體驗的流暢。
- 非本地的 Tailnet/區域網路客戶端仍需經過明確的配對核准。

## 探索與傳輸

- [探索與傳輸 (Discovery & transports)](/gateway/discovery_zh_TW)
- [Bonjour / mDNS](/gateway/bonjour_zh_TW)
- [遠端存取：SSH (Remote access)](/gateway/remote_zh_TW)
- [Tailscale](/gateway/tailscale_zh_TW)

## 節點與傳輸

- [節點概觀 (Nodes overview)](/nodes_zh_TW)
- [橋接協定：舊版節點 (Bridge protocol)](/gateway/bridge-protocol_zh_TW)
- [節點執行手冊：iOS](/platforms/ios_zh_TW)
- [節點執行手冊：Android](/platforms/android_zh_TW)

## 安全性

- [安全性概觀 (Security overview)](/gateway/security_zh_TW)
- [閘道器組態參考 (Gateway config reference)](/gateway/configuration_zh_TW)
- [疑難排解 (Troubleshooting)](/gateway/troubleshooting_zh_TW)
- [診斷工具 (Doctor)](/gateway/doctor_zh_TW)
