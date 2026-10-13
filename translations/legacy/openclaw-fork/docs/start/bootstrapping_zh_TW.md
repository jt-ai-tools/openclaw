---
summary: "代理人引導啟動儀式：初始化工作區與身分檔案"
read_when:
  - 了解代理人首次執行時會發生什麼事
  - 解釋引導啟動檔案存放在何處
  - 偵錯引導設定中的身分設定
title: "代理人引導啟動"
sidebarTitle: "引導啟動"
---

> 此文件為 [English Version](/start/bootstrapping_zh_TW) 的繁體中文版本。

# 代理人引導啟動 (Agent Bootstrapping)

引導啟動是代理人 **首次執行** 時的儀式，用於準備代理人工作區並收集身分細節。這發生在引導設定 (Onboarding) 完成後，代理人第一次啟動時。

## 引導啟動內容

在代理人首次執行時，OpenClaw 會初始化工作區（預設為 `~/.openclaw/workspace`）：
- 產生 `AGENTS.md`, `BOOTSTRAP.md`, `IDENTITY.md`, `USER.md` 等種子檔案。
- 執行短暫的問答儀式（一次一個問題）。
- 將您的身分資訊與偏好設定寫入 `IDENTITY.md`, `USER.md`, `SOUL.md`。
- 完成後移除 `BOOTSTRAP.md`，確保該儀式僅執行一次。

## 執行位置

引導啟動儀式一律在 **閘道器主機 (Gateway host)** 上執行。若 macOS App 連接至遠端閘道器，則工作區與啟動檔案皆位於該遠端機器上。

<Note>
當閘道器執行於其它機器時，請務必在該閘道器主機上編輯工作區檔案。
</Note>

## 相關連結
- macOS App 引導設定：[引導設定 (Onboarding)](/start/onboarding_zh_TW)
- 工作區佈局：[代理人工作區 (Agent workspace)](/concepts/agent-workspace_zh_TW)
