---
summary: "`openclaw onboard` (互動式引導設定精靈) 的 CLI 參考資料"
read_when:
  - 您想要針對閘道器、工作區、驗證、頻道與技能進行引導式設定時
title: "onboard"
---

> 此文件為 [English Version](/cli/onboard_zh_TW) 的繁體中文版本。

# `openclaw onboard`

互動式引導設定精靈（支援本地端或遠端閘道器設定）。

## 相關指南

- CLI 引導設定中心：[引導設定精靈 (CLI)](/start/wizard_zh_TW)
- 引導設定概觀：[引導設定概觀](/start/onboarding-overview_zh_TW)
- CLI 引導設定參考：[CLI 引導設定參考](/start/wizard-cli-reference_zh_TW)
- CLI 自動化：[CLI 自動化](/start/wizard-cli-automation_zh_TW)
- macOS 引導設定：[引導設定 (macOS App)](/start/onboarding_zh_TW)

## 範例

```bash
openclaw onboard
openclaw onboard --flow quickstart (快速開始)
openclaw onboard --flow manual (手動模式)
openclaw onboard --mode remote --remote-url ws://gateway-host:18789 (遠端模式)
```

**非互動式自訂提供者：**

```bash
openclaw onboard --non-interactive 
  --auth-choice custom-api-key 
  --custom-base-url "https://llm.example.com/v1" 
  --custom-model-id "foo-large" 
  --custom-api-key "$CUSTOM_API_KEY" 
  --custom-compatibility openai
```

非互動模式下，`--custom-api-key` 為選填。若省略，引導程式會檢查 `CUSTOM_API_KEY` 環境變數。

**流程說明：**

- `quickstart`：最少量的提示，自動產生閘道器權杖 (Token)。
- `manual`：針對連接埠、繫結與驗證方式提供完整提示（為 `advanced` 的別名）。
- **最快開始聊天的方法**：`openclaw dashboard`（啟動控制介面，無需頻道設定）。
- **自訂提供者**：可連接任何相容於 OpenAI 或 Anthropic 的端點，包含未列出的代管提供者。

## 常用後續指令

```bash
openclaw configure (互動式配置)
openclaw agents add <名稱> (新增代理人)
```

<Note>
`--json` 旗標並不代表非互動模式。針對腳本自動化，請務必使用 `--non-interactive`。
</Note>
