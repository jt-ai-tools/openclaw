---
summary: "OpenClaw 中的 OAuth 機制：權杖交換、儲存以及多帳號模式說明"
read_when:
  - 您想要全面了解 OpenClaw 的 OAuth 運作原理時
  - 遇到權杖失效或自動登出問題時
  - 需要設定多個帳號或進行設定檔路由時
title: "OAuth"
---

> 此文件為 [English Version](/concepts/oauth_zh_TW) 的繁體中文版本。

# OAuth

OpenClaw 支援「訂閱制驗證」—— 針對提供此服務的供應商（如 **OpenAI Codex**）使用 OAuth；針對 Anthropic 訂閱則使用 **setup-token** 流程。

## 權杖匯集 (Token Sink) 的必要性

OAuth 供應商在每次登入或重新整理流程中通常會核發一個 **新的重新整理權杖 (Refresh token)**。部分供應商會使舊的重新整理權杖失效。

**實際案例**：
如果您同時在 OpenClaw 與 Claude Code CLI 中登入，其中一個可能會隨機發生「登出」的情況。為了解決此問題，OpenClaw 將 `auth-profiles.json` 視為 **權杖匯集點**，讓執行時期從單一位置讀取憑證。

## 儲存位置

秘密資訊是 **按代理人 (Per-agent)** 儲存的：
- **驗證設定檔** (OAuth + API 密鑰)：`~/.openclaw/agents/<agentId>/agent/auth-profiles.json`。
- **執行時期快照**（自動管理，請勿編輯）：`~/.openclaw/agents/<agentId>/agent/auth.json`。

## Anthropic setup-token (訂閱制驗證)

在任何機器上執行 `claude setup-token`，然後將其貼入 OpenClaw：
```bash
openclaw models auth setup-token --provider anthropic
```

## OAuth 交換流程

### OpenAI Codex (ChatGPT OAuth)
採用 PKCE 流程：
1. 產生挑戰碼與隨機狀態。
2. 開啟 OpenAI 授權頁面。
3. 嘗試在 `http://127.0.0.1:1455/auth/callback` 捕捉回呼；若為遠端或無頭環境，請手動貼回導向 URL。
4. 完成權杖交換並儲存。

## 多帳號 (Profiles) 與路由

### 1) 推薦方式：獨立的代理人
如果您希望「個人」與「工作」完全隔離，請建立兩個代理人：
```bash
openclaw agents add work
openclaw agents add personal
```

### 2) 進階方式：單一代理人下的多個設定檔
`auth-profiles.json` 支援同一個供應商有多個設定檔 ID。您可以在工作階段中透過以下方式覆寫：
- `/model Opus@anthropic:work`
