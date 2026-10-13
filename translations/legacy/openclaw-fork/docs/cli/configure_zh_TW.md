---
summary: "`openclaw configure` (互動式組態提示) 的 CLI 參考資料"
read_when:
  - 您想要以互動方式調整憑證、裝置或代理人預設值時
title: "configure"
---

> 此文件為 [English Version](/cli/configure_zh_TW) 的繁體中文版本。

# `openclaw configure`

用於設定憑證、裝置與代理人預設值的互動式提示工具。

**注意**：「模型 (Model)」章節現在包含一個用於 `agents.defaults.models` 允許清單的多選介面（決定了在 `/model` 指令與模型選擇器中顯示哪些模型）。

**提示**：不帶子指令執行 `openclaw config` 也會開啟相同的精靈。若要進行非互動式的編輯，請使用 `openclaw config get|set|unset`。

## 相關資訊：

- 閘道器組態參考：[組態設定 (Configuration)](/gateway/configuration_zh_TW)
- 組態 CLI：[Config](/cli/config_zh_TW)

## 注意事項：

- 選擇閘道器執行位置一律會更新 `gateway.mode`。如果您只需要進行此項變更，可以在其它章節選擇「繼續 (Continue)」。
- 頻道導向的服務（如 Slack/Discord/Matrix/Microsoft Teams）會在設定期間提示輸入頻道/聊天室允許清單。您可以輸入名稱或 ID；精靈會盡可能將名稱解析為 ID。

## 範例

```bash
openclaw configure
openclaw configure --section models --section channels
```
