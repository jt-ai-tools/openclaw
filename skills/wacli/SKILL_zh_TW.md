---
name: wacli
description: 使用 wacli CLI 傳送 WhatsApp 訊息給他人或搜尋/同步 WhatsApp 歷史紀錄（不適用於一般的使用者對談）。
homepage: https://wacli.sh
metadata:
  {
    "openclaw":
      {
        "emoji": "📱",
        "requires": { "bins": ["wacli"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "steipete/tap/wacli",
              "bins": ["wacli"],
              "label": "安裝 wacli (brew)",
            },
            {
              "id": "go",
              "kind": "go",
              "module": "github.com/steipete/wacli/cmd/wacli@latest",
              "bins": ["wacli"],
              "label": "安裝 wacli (go)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# wacli

僅當使用者明確要求您在 WhatsApp 上傳訊息給 **其他人**，或是要求同步/搜尋 WhatsApp 歷史紀錄時才使用 `wacli`。
**不可** 將 `wacli` 用於一般的使用者對談；OpenClaw 會自動路由 WhatsApp 對話。
如果使用者正透過 WhatsApp 與您聊天，除非他們要求您聯絡第三方，否則不應使用此工具。

## 安全性

- 要求明確的收件者與訊息內文。
- 發送前必須先與使用者確認收件者與內文。
- 若有任何模糊之處，請先提問釐清。

## 驗證與同步

- `wacli auth` (QR Code 登入與初步同步)。
- `wacli sync --follow` (持續同步)。
- `wacli doctor` (診斷工具)。

## 尋找對話與訊息

- `wacli chats list --limit 20 --query "名稱或號碼"`。
- `wacli messages search "關鍵字" --limit 20 --chat <jid>`。
- `wacli messages search "發票" --after 2025-01-01 --before 2025-12-31`。

## 歷史紀錄回填 (History backfill)

- `wacli history backfill --chat <jid> --requests 2 --count 50`。

## 傳送訊息

- 文字：`wacli send text --to "+14155551212" --message "哈囉！三點有空嗎？"`。
- 群組：`wacli send text --to "1234567890-123456789@g.us" --message "會晚 5 分鐘抵達。"`。
- 檔案：`wacli send file --to "+14155551212" --file /路徑/議程.pdf --caption "議程表"`。

## 注意事項

- 存儲目錄：`~/.wacli`。
- 剖析數據時請使用 `--json` 格式以獲取機器可讀輸出。
- 回填功能需要您的手機在線；結果為盡力而為。
- JID 格式：個人對談為 `<號碼>@s.whatsapp.net`；群組為 `<ID>@g.us`（可透過 `wacli chats list` 查找）。
