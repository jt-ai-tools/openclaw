> 此文件為 [English Version](CONTRIBUTING.md) 的繁體中文版本。

# 參與 OpenClaw 貢獻

歡迎加入龍蝦缸！ 🦞

## 快速連結

- **GitHub:** https://github.com/openclaw/openclaw
- **Discord:** https://discord.gg/qkhbAGHRBT
- **X/Twitter:** [@steipete](https://x.com/steipete) / [@openclaw](https://x.com/openclaw)

## 維護者 (Maintainers)

- **Peter Steinberger** - 仁慈的獨裁者 (Benevolent Dictator)
  - GitHub: [@steipete](https://github.com/steipete) · X: [@steipete](https://x.com/steipete)

- **Shadow** - Discord + Slack 子系統
  - GitHub: [@thewilloftheshadow](https://github.com/thewilloftheshadow) · X: [@4shad0wed](https://x.com/4shad0wed)

- **Vignesh** - 記憶體 (QMD)、形式建模、TUI 以及 Lobster
  - GitHub: [@vignesh07](https://github.com/vignesh07) · X: [@\_vgnsh](https://x.com/_vgnsh)

- **Jos** - Telegram、API、Nix 模式
  - GitHub: [@joshp123](https://github.com/joshp123) · X: [@jjpcodes](https://x.com/jjpcodes)

- **Christoph Nakazawa** - JS 基礎設施
  - GitHub: [@cpojer](https://github.com/cpojer) · X: [@cnakazawa](https://x.com/cnakazawa)

- **Gustavo Madeira Santana** - 多代理人、CLI、網頁 UI
  - GitHub: [@gumadeiras](https://github.com/gumadeiras) · X: [@gumadeiras](https://x.com/gumadeiras)

- **Maximilian Nussbaumer** - DevOps、CI、程式碼完整性
  - GitHub: [@quotentiroler](https://github.com/quotentiroler) · X: [@quotentiroler](https://x.com/quotentiroler)

## 如何參與貢獻

1. **錯誤 (Bugs) 與微小修復** → 直接提交 PR！
2. **新功能 / 架構變動** → 先啟動 [GitHub 討論](https://github.com/openclaw/openclaw/discussions) 或先在 Discord 中詢問。
3. **問題諮詢** → Discord #setup-help 頻道。

## 在您提交 PR 之前

- 使用您的 OpenClaw 實例進行本地測試。
- 執行測試指令：`pnpm build && pnpm check && pnpm test`。
- 確保 CI 檢查全數通過。
- 保持 PR 焦點集中（一個 PR 處理一件事）。
- 描述「做了什麼」以及「為什麼要做」。

## 控制 UI 裝飾器 (Control UI Decorators)

控制 UI 使用 Lit 並搭配 **舊版 (legacy)** 裝飾器（目前的 Rollup 解析不支援標準裝飾器所需的 `accessor` 欄位）。新增響應式欄位時，請保持舊版風格：

```ts
@state() foo = "bar";
@property({ type: Number }) count = 0;
```

根目錄的 `tsconfig.json` 已配置為支援舊版裝飾器 (`experimentalDecorators: true`) 並設定 `useDefineForClassFields: false`。除非您同時更新 UI 建置工具以支援標準裝飾器，否則請避免更動這些設定。

## 歡迎 AI/氛圍編碼 (Vibe-Coded) 的 PR！ 🤖

使用 Codex、Claude 或其他 AI 工具建置的嗎？**太棒了 —— 只要標註清楚即可！**

請在您的 PR 中包含：

- [ ] 在 PR 標題或描述中標註為「AI 協助 (AI-assisted)」
- [ ] 註明測試程度（未測試 / 輕度測試 / 完整測試）
- [ ] 盡可能包含提示詞 (Prompts) 或對談日誌（非常有幫助！）
- [ ] 確認您瞭解程式碼的運作方式

在這裡，AI PR 享有與一般 PR 同等的地位。我們只希望保持透明，以便審閱者知道該注意什麼。

## 目前重點與開發路線圖 🗺

我們目前的優先事項如下：

- **穩定性**：修復頻道連線（WhatsApp/Telegram）中的邊緣案例。
- **使用者體驗 (UX)**：改進引導精靈 (Onboarding wizard) 與錯誤訊息。
- **技能 (Skills)**：如欲貢獻技能，請前往 [ClawHub](https://clawhub.ai/) —— OpenClaw 技能的社群中心。
- **效能**：優化 Token 用量與壓縮 (compaction) 邏輯。

請查看 [GitHub Issues](https://github.com/openclaw/openclaw/issues) 中的 "good first issue" 標籤！

## 報告漏洞

我們非常重視安全性報告。請將漏洞直接報告給相關的儲存庫：

- **核心 CLI 與閘道器** — [openclaw/openclaw](https://github.com/openclaw/openclaw)
- **macOS 桌面應用程式** — [openclaw/openclaw](https://github.com/openclaw/openclaw) (apps/macos)
- **iOS 應用程式** — [openclaw/openclaw](https://github.com/openclaw/openclaw) (apps/ios)
- **Android 應用程式** — [openclaw/openclaw](https://github.com/openclaw/openclaw) (apps/android)
- **ClawHub** — [openclaw/clawhub](https://github.com/openclaw/clawhub)
- **信任與威脅模型** — [openclaw/trust](https://github.com/openclaw/trust)

對於不屬於特定儲存庫的問題，或如果您不確定，請發送電子郵件至 **security@openclaw.ai**，我們將代為轉發。

### 報告所需內容

1. **標題**
2. **嚴重性評估**
3. **影響範圍**
4. **受影響的組件**
5. **技術復現步驟**
6. **展示影響**
7. **環境資訊**
8. **修補建議**

若報告中未包含復現步驟、影響展示與修補建議，處理優先順序將會降低。鑑於 AI 產生的掃描結果數量龐大，我們必須確保收到的報告是經過研究人員審核且理解其問題所在的。
