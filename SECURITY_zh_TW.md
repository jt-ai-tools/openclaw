> 此文件為 [English Version](SECURITY.md) 的繁體中文版本。

# 安全性政策 (Security Policy)

如果您認為在 OpenClaw 中發現了安全性問題，請私下報告。

## 報告方式

請將漏洞直接報告給相關的儲存庫：

- **核心 CLI 與閘道器** — [openclaw/openclaw](https://github.com/openclaw/openclaw)
- **macOS 桌面應用程式** — [openclaw/openclaw](https://github.com/openclaw/openclaw) (apps/macos)
- **iOS 應用程式** — [openclaw/openclaw](https://github.com/openclaw/openclaw) (apps/ios)
- **Android 應用程式** — [openclaw/openclaw](https://github.com/openclaw/openclaw) (apps/android)
- **ClawHub** — [openclaw/clawhub](https://github.com/openclaw/clawhub)
- **信任與威脅模型** — [openclaw/trust](https://github.com/openclaw/trust)

對於不屬於特定儲存庫的問題，或如果您不確定，請發送電子郵件至 **security@openclaw.ai**，我們將代為轉發。

完整報告說明請見我們的 [信任頁面](https://trust.openclaw.ai)。

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

## 安全性與信任

**Jamieson O'Reilly** ([@theonejvo](https://twitter.com/theonejvo)) 負責 OpenClaw 的安全性與信任工作。Jamieson 是 [Dvuln](https://dvuln.com) 的創辦人，在攻擊性安全、滲透測試和安全性計畫開發方面擁有豐富經驗。

## 漏洞賞金 (Bug Bounties)

OpenClaw 是一項基於熱愛的計畫。目前沒有漏洞賞金計畫，也沒有付費報告的預算。即便如此，仍請您以負責任的方式披露漏洞，以便我們能快速修復。
目前幫助此計畫的最佳方式是提交 PR。

## 超出範圍 (Out of Scope)

- 公開網路曝光 (Public Internet Exposure)
- 以文件建議之外的方式使用 OpenClaw
- 提示詞注入攻擊 (Prompt injection attacks)

## 維運指南

關於威脅模型 + 強化指南（包括 `openclaw security audit --deep` 和 `--fix`），請參閱：

- [docs/gateway/security_zh_TW.md](docs/gateway/security_zh_TW.md)

### 網頁介面安全性

OpenClaw 的網頁介面僅供本地使用。請 **勿** 將其綁定到公開網路；它並未針對公開曝光進行強化 (Hardened)。

## 執行環境要求

### Node.js 版本

OpenClaw 需要 **Node.js 22.12.0 或更高版本** (LTS)。此版本包含重要的安全性修補程式：

- CVE-2025-59466: async_hooks 阻斷服務 (DoS) 漏洞
- CVE-2026-21636: 權限模型繞過漏洞

驗證您的 Node.js 版本：

```bash
node --version  # 應為 v22.12.0 或更高版本
```

### Docker 安全性

在 Docker 中執行 OpenClaw 時：

1. 官方映像檔以非 root 使用者 (`node`) 執行，以縮減攻擊面。
2. 盡可能使用 `--read-only` 標籤，以提供額外的檔案系統保護。
3. 使用 `--cap-drop=ALL` 限制容器能力。

安全的 Docker 執行範例：

```bash
docker run --read-only --cap-drop=ALL 
  -v openclaw-data:/app/data 
  openclaw/openclaw:latest
```

## 安全性掃描

此專案使用 `detect-secrets` 在 CI/CD 中進行自動化的密鑰偵測。
組態設定請見 `.detect-secrets.cfg`，基準線請見 `.secrets.baseline`。

本地執行：

```bash
pip install detect-secrets==1.5.0
detect-secrets scan --baseline .secrets.baseline
```
