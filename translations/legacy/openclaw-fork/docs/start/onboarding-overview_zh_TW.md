---
summary: "OpenClaw 引導設定選項與流程概觀"
read_when:
  - 選擇引導設定路徑時
  - 設定新環境時
title: "引導設定概觀"
sidebarTitle: "引導設定概觀"
---

> 此文件為 [English Version](/start/onboarding-overview_zh_TW) 的繁體中文版本。

# 引導設定概觀 (Onboarding Overview)

OpenClaw 支援多種引導設定路徑，具體取決於閘道器 (Gateway) 的執行位置以及您偏好的配置方式。

## 選擇您的引導設定路徑

- **CLI 精靈**：適用於 macOS, Linux, 以及 Windows (WSL2)。
- **macOS App**：適用於 Apple Silicon 或 Intel Mac 上的引導式首次執行。

## CLI 引導設定精靈

在終端機中執行：
```bash
openclaw onboard
```
當您想要完整控制閘道器、工作區、頻道與技能時，請使用 CLI 精靈。

相關文件：
- [引導設定精靈 (CLI)](/start/wizard_zh_TW)
- [`openclaw onboard` 指令參考](/cli/onboard_zh_TW)

## macOS App 引導設定

當您希望在 macOS 上獲得完整的視覺化引導設定時，請使用 OpenClaw App。

相關文件：
- [引導設定 (macOS App)](/start/onboarding_zh_TW)

## 自訂提供者 (Custom Provider)

如果您需要的端點未列在選項中（包含提供標準 OpenAI 或 Anthropic API 的代管提供者），請在 CLI 精靈中選擇 **Custom Provider**。系統會要求您：
- 選擇相容模式（OpenAI, Anthropic 或 **Unknown** 自動偵測）。
- 輸入基礎 URL 與 API 密鑰。
- 提供模型 ID 與選用的別名。
- 選擇端點 ID，以便多個自訂端點可以共存。
