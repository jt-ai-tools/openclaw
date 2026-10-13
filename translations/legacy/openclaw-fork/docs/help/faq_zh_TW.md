---
summary: "OpenClaw 設定、組態與用法的常見問答"
title: "常見問答 (FAQ)"
---

> 此文件為 [English Version](/help/faq_zh_TW) 的繁體中文版本。

# 常見問答 (FAQ)

本頁面提供快速解答與深入的疑難排解建議。若需執行時期診斷，請參閱 [疑難排解](/gateway/troubleshooting_zh_TW)。

## 快速入門與首次設定

### 我卡住了，最快脫困的方法是什麼？
建議使用具備本機存取權限的 AI 助理（如 Claude Code 或 OpenAI Codex）來查看您的機器環境。
1. 確保您安裝的是 **原始碼簽出版 (Git checkout)**：
   `curl -fsSL https://openclaw.ai/install.sh | bash -s -- --install-method git`
2. 讓 AI 助理閱讀儲存庫、檢查日誌並規劃修復步驟。
3. 執行基本檢查指令並分享結果：
   `openclaw status`, `openclaw models status`, `openclaw doctor`。

### 我該如何安裝並設定 OpenClaw？
推薦從原始碼安裝並使用引導精靈：
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
openclaw onboard --install-daemon
```

### 設定完成後如何開啟儀表板 (Dashboard)？
精靈會在結束時自動開啟瀏覽器。若未開啟，請手動訪問 `http://127.0.0.1:18789/`。若需要權杖 (Token)，請執行：
`openclaw config get gateway.auth.token`。

---

## 模型與驗證

### 是否需要訂閱 Claude Pro 或 OpenAI 才能使用？
不一定。您可以使用 **API 密鑰**（按量計費）或是 **本地模型**。訂閱制（如 Claude Pro/Max）可以透過 `setup-token` 進行驗證。

### Anthropic 的 `setup-token` 是什麼？
這是在 **Claude Code CLI** 產生的權杖（非 Anthropic 主控台）。在任何機器執行 `claude setup-token` 獲取權杖後，貼入 OpenClaw 即可完成訂閱制驗證。

---

## 技能與自動化

### 可以在 Linux 上執行 macOS 專屬的技能嗎？
不能直接執行。但您可以透過 **macOS 節點 (Node)** 或 SSH 隧道來間接調用。建議將閘道器執行於 Linux，並將您的 Mac 作為節點配對。

### 如何讓代理人記住事情？
直接要求助理 **「將這件事寫入記憶」**。助理會將資訊寫入 `MEMORY.md` (長期) 或 `memory/YYYY-MM-DD.md` (短期) 檔案中。

---

## 相關連結
- [安裝指南](/install_zh_TW)
- [閘道器組態](/gateway/configuration_zh_TW)
- [安全性說明](/gateway/security_zh_TW)
