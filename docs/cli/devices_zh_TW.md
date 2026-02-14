---
summary: "`openclaw devices` (裝置配對、權杖輪替與撤銷) 的 CLI 參考資料"
read_when:
  - 您正在核准裝置配對請求時
  - 您需要輪替或撤銷裝置權杖時
title: "devices"
---

> 此文件為 [English Version](/cli/devices_zh_TW) 的繁體中文版本。

# `openclaw devices`

管理裝置配對請求與裝置範圍的權杖。

## 指令集

### `openclaw devices list`
列出待處理的配對請求與已配對的裝置。

```bash
openclaw devices list
openclaw devices list --json
```

### `openclaw devices approve <requestId>`
核准一個待處理的裝置配對請求。

```bash
openclaw devices approve <請求ID>
```

### `openclaw devices reject <requestId>`
拒絕一個待處理的裝置配對請求。

```bash
openclaw devices reject <請求ID>
```

### `openclaw devices rotate --device <id> --role <role> [--scope <scope...>]`
為特定角色輪替裝置權杖（可選用更新權限範圍）。

```bash
openclaw devices rotate --device <裝置ID> --role operator --scope operator.read --scope operator.write
```

### `openclaw devices revoke --device <id> --role <role>`
撤銷特定角色的裝置權杖。

```bash
openclaw devices revoke --device <裝置ID> --role node
```

## 常用選項

- `--url <url>`：閘道器 WebSocket URL（預設為配置中的 `gateway.remote.url`）。
- `--token <token>`：閘道器權杖（若需要）。
- `--password <password>`：閘道器密碼（使用密碼驗證時）。
- `--json`：JSON 輸出（建議用於腳本自動化）。

**注意**：當您設定了 `--url` 時，CLI 不會回退至使用組態或環境變數中的憑證。請務必明確傳遞 `--token` 或 `--password`。

## 注意事項

- 權杖輪替會回傳一個新的權杖（敏感資訊），請將其視為秘密妥善保存。
- 這些指令需要 `operator.pairing` 或 `operator.admin` 權限範圍。
