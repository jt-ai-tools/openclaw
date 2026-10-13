# Lobster (外掛程式)

將 `lobster` 代理人工具新增為 **選用** 的外掛程式工具。

## 它是什麼

- Lobster 是一個獨立的工作流 Shell（具備類型的 JSON 優先管線 + 核准/恢復執行機制）。
- 此外掛程式在 *不修改核心* 的情況下將 Lobster 與 OpenClaw 整合。

## 啟用

由於此工具可能會觸發副作用（透過工作流），它註冊時標記為 `optional: true`。

在代理人允許清單中啟用它：

```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "tools": {
          "allow": [
            "lobster" // 外掛程式 ID (啟用此外掛程式的所有工具)
          ]
        }
      }
    ]
  }
}
```

## 使用 `openclaw.invoke` (Lobster → OpenClaw 工具)

某些 Lobster 管線可能包含 `openclaw.invoke` 步驟，用以回呼 (Call back) OpenClaw 的工具/外掛程式（例如：用於 Google Workspace 的 `gog`、用於 GitHub 的 `gh`、`message.send` 等）。

為了使此功能運作，OpenClaw 閘道器 (Gateway) 必須公開工具橋接端點 (Tool bridge endpoint)，且目標工具必須符合策略許可：

- OpenClaw 提供一個 HTTP 端點：`POST /tools/invoke`。
- 該請求受到 **閘道器驗證** 的門控保護（例如：啟用權杖驗證時的 `Authorization: Bearer …`）。
- 被呼叫的工具受到 **工具策略 (Tool policy)** 的門控保護（包含全域、個別代理人、提供者以及群組策略）。如果工具不被允許，OpenClaw 會回傳 `404 Tool not available`。

### 建議使用允許清單

為了避免讓工作流呼叫任意工具，請在 `openclaw.invoke` 使用的代理人上設定嚴格的允許清單。

範例（僅允許一組小型工具）：

```jsonc
{
  "agents": {
    "list": [
      {
        "id": "main",
        "tools": {
          "allow": ["lobster", "web_fetch", "web_search", "gog", "gh"],
          "deny": ["gateway"],
        },
      },
    ],
  },
}
```

注意事項：

- 如果 `tools.allow` 被省略或為空，其行為等同於「允許所有（除了被拒絕的）」。若要建立真實的允許清單，請設定 **非空** 的 `allow`。
- 工具名稱取決於您已安裝/啟用的外掛程式。

## 安全性

- 以本地子程序形式執行 `lobster` 執行檔。
- 不管理 OAuth/權杖 (Tokens)。
- 使用逾時機制、stdout 上限以及嚴格的 JSON 信封解析。
- 在生產環境中建議使用絕對路徑 `lobsterPath`，以避免 PATH 劫持 (PATH hijack)。
