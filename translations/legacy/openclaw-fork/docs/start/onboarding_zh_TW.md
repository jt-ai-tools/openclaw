---
summary: "OpenClaw (macOS App) 的首次執行引導流程"
read_when:
  - 設計 macOS 引導助理時
  - 實作驗證或身份設定時
title: "引導設定 (macOS App)"
sidebarTitle: "引導設定：macOS App"
---

> 此文件為 [English Version](/start/onboarding_zh_TW) 的繁體中文版本。

# 引導設定 (macOS App)

本文件說明 **目前** 的首次執行引導流程。目標是提供流暢的「Day 0」體驗：選擇閘道器 (Gateway) 執行位置、連接驗證、執行設定精靈，並讓代理人 (Agent) 完成引導啟動。
關於引導路徑的整體概觀，請參閱 [引導設定概觀](/start/onboarding-overview_zh_TW)。

<Steps>
<Step title="核准 macOS 警告">
<Frame>
<img src="/assets/macos-onboarding/01-macos-warning.jpeg" alt="" />
</Frame>
</Step>
<Step title="核准尋找區域網路裝置">
<Frame>
<img src="/assets/macos-onboarding/02-local-networks.jpeg" alt="" />
</Frame>
</Step>
<Step title="歡迎與安全性聲明">
<Frame caption="閱讀顯示的安全性聲明並做出決定">
<img src="/assets/macos-onboarding/03-security-notice.png" alt="" />
</Frame>
</Step>
<Step title="本地 vs 遠端">
<Frame>
<img src="/assets/macos-onboarding/04-choose-gateway.png" alt="" />
</Frame>

**閘道器** 執行於何處？

- **這台 Mac (僅限本地)：** 引導設定可以執行 OAuth 流程並在本地寫入憑證。
- **遠端 (透過 SSH/Tailnet)：** 引導設定 **不會** 在本地執行 OAuth；憑證必須已存在於閘道器主機上。
- **稍後設定：** 跳過設定，讓應用程式保持未組態狀態。

<Tip>
**閘道器驗證提示：**
- 設定精靈現在即使在迴路位址 (loopback) 也會產生 **Token**，因此本地 WS 用戶端必須進行驗證。
- 如果您停用驗證，任何本地程序都可以連線；請僅在完全受信任的機器上使用此選項。
- 對於多機存取或非迴路位址的綁定，請使用 **Token**。
</Tip>
</Step>
<Step title="權限設定">
<Frame caption="選擇您想授予 OpenClaw 的權限">
<img src="/assets/macos-onboarding/05-permissions.png" alt="" />
</Frame>

引導設定會要求以下功能所需的 TCC 權限：

- 自動化 (AppleScript)
- 通知
- 輔助功能
- 螢幕錄製
- 麥克風
- 語音辨識
- 相機
- 位置

</Step>
<Step title="CLI 指令工具">
  <Info>此步驟為選填</Info>
  應用程式可以透過 npm/pnpm 安裝全域 `openclaw` CLI，讓終端機工作流與 launchd 任務能直接運作。
</Step>
<Step title="引導聊天 (專用會話)">
  設定完成後，應用程式會開啟一個專用的引導聊天會話，讓代理人能自我介紹並引導後續步驟。這能將首次執行的指引與您的日常對話分開。關於代理人首次執行時在閘道器主機上發生的情況，請參閱 [引導啟動 (Bootstrapping)](/start/bootstrapping_zh_TW)。
</Step>
</Steps>
