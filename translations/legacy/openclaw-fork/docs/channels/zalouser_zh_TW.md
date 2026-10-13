---
summary: "透過 zca-cli (QR 登入) 支援 Zalo 個人帳號的能力與組態設定說明"
read_when:
  - 為 OpenClaw 設定 Zalo 個人帳號時
  - 偵錯 Zalo 個人帳號登入或訊息流時
title: "Zalo 個人帳號"
---

> 此文件為 [English Version](/channels/zalouser_zh_TW) 的繁體中文版本。

# Zalo 個人帳號 (非官方)

目前狀態：實驗性 (Experimental)。此整合透過 `zca-cli` 自動化操作 **Zalo 個人帳號**。

> **警告：** 這是一個非官方整合，可能會導致您的帳號被停權或封鎖。請自行承擔使用風險。

## 外掛程式需求
Zalo 個人帳號功能是以外掛程式形式提供的。
- 安裝指令：`openclaw plugins install @openclaw/zalouser`。

## 事前準備：zca-cli
閘道器機器必須在 `PATH` 中具備 `zca` 二進位檔。
- 驗證方式：`zca --version`。

## 快速設定

1. **安裝外掛程式**。
2. **登入**（在閘道器機器上執行）：
   - `openclaw channels login --channel zalouser`
   - 使用手機上的 Zalo App 掃描終端機顯示的 QR Code。
3. **啟用頻道**：
```json5
{
  channels: {
    zalouser: {
      enabled: true,
      dmPolicy: "pairing",
    },
  },
}
```
4. **重啟閘道器**。首次連訊時需核准配對碼。

## 尋找 ID (目錄查詢)
使用目錄 CLI 來探索同儕/群組及其 ID：
```bash
openclaw directory self --channel zalouser (查詢本人)
openclaw directory peers list --channel zalouser --query "名稱"
openclaw directory groups list --channel zalouser --query "工作"
```

## 存取控制
- **私訊政策**：預設為 `pairing`。支援透過使用者 ID 或名稱進行允許清單配置。
- **群組政策**：預設為 `open`。可透過 `channels.zalouser.groupPolicy` 限制為 `allowlist`。

## 疑難排解
- **找不到 `zca`**：請安裝 zca-cli 並確保其位於閘道器程序的 `PATH` 中。
- **登入失效**：請執行 `openclaw channels logout --channel zalouser` 後重新登入。
