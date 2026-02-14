---
summary: "CLI 引導設定精靈：閘道器、工作區、頻道與技能的引導式設定"
read_when:
  - 執行或配置引導設定精靈時
  - 在新機器上進行設定時
title: "引導設定精靈 (CLI)"
sidebarTitle: "引導設定：CLI"
---

> 此文件為 [English Version](/start/wizard_zh_TW) 的繁體中文版本。

# 引導設定精靈 (CLI Onboarding Wizard)

引導設定精靈是設定 OpenClaw 的 **推薦方式**。它將閘道器、工作區、頻道與技能的配置整合在單一引導流程中。

```bash
openclaw onboard
```

<Info>
**最快開始聊天的方法**：開啟控制介面（無需頻道設定）。執行 `openclaw dashboard` 即可在瀏覽器中進行對話。
</Info>

## 快速開始 vs 進階模式

精靈啟動時可選擇 **QuickStart** (預設) 或 **Advanced** (完整控制)。

- **QuickStart**：
  - 本地閘道器 (Loopback)。
  - 預設工作區路徑。
  - 連接埠 **18789**。
  - 閘道器驗證：自動產生 **Token**。
  - 私訊預設為 **allowlist**（會提示您輸入門號）。
- **Advanced**：暴露每一個步驟（模式、工作區、閘道器、頻道、背景服務、技能）。

## 精靈配置內容

1. **模型與驗證**：Anthropic API 密鑰 (推薦)、OpenAI 或自訂提供者。挑選預設模型。
2. **工作區**：代理人檔案路徑（預設 `~/.openclaw/workspace`）。
3. **閘道器**：連接埠、繫結位址、驗證模式、Tailscale 公開設定。
4. **頻道**：WhatsApp, Telegram, Discord, Slack 等。
5. **背景服務 (Daemon)**：安裝 LaunchAgent (macOS) 或 systemd 使用者服務 (Linux)。
6. **健康檢查**：啟動閘道器並驗證執行狀態。
7. **技能**：安裝推薦技能。

## 新增其它代理人

執行 `openclaw agents add <名稱>` 可建立獨立的代理人實例，具備各自的工作區、對談歷史與驗證資料。

## 相關連結
- CLI 指令參考：[`openclaw onboard`](/cli/onboard_zh_TW)
- 引導設定概觀：[引導設定概觀](/start/onboarding-overview_zh_TW)
- 代理人啟動儀式：[代理人引導啟動 (Bootstrapping)](/start/bootstrapping_zh_TW)
