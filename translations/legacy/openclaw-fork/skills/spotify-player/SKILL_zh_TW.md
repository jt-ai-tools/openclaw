---
name: spotify-player
description: 透過 spogo（優先建議）或 spotify_player 在終端機進行 Spotify 播放/搜尋。
homepage: https://www.spotify.com
metadata:
  {
    "openclaw":
      {
        "emoji": "🎵",
        "requires": { "anyBins": ["spogo", "spotify_player"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "spogo",
              "tap": "steipete/tap",
              "bins": ["spogo"],
              "label": "安裝 spogo (brew)",
            },
            {
              "id": "brew",
              "kind": "brew",
              "formula": "spotify_player",
              "bins": ["spotify_player"],
              "label": "安裝 spotify_player (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# spogo / spotify_player

使用 `spogo` **（優先建議）** 進行 Spotify 播放與搜尋。如有需要，可回退至 `spotify_player`。

## 要求 (Requirements)

- Spotify Premium 帳號。
- 已安裝 `spogo` 或 `spotify_player`。

## spogo 設定

- 匯入 Cookie：`spogo auth import --browser chrome`

## 常見 CLI 指令

- 搜尋：`spogo search track "查詢字串"`
- 播放控制：`spogo play|pause|next|prev`
- 裝置管理：`spogo device list` (列出裝置), `spogo device set "<名稱|ID>"` (設定裝置)
- 狀態：`spogo status`

## spotify_player 指令 (備援)

- 搜尋：`spotify_player search "查詢字串"`
- 播放控制：`spotify_player playback play|pause|next|previous`
- 連接裝置：`spotify_player connect`
- 按讚歌曲：`spotify_player like`

## 注意事項

- 組態資料夾：`~/.config/spotify-player`（例如 `app.toml`）。
- 針對 Spotify Connect 整合，請在組態中設定使用者的 `client_id`。
- 在應用程式中按下 `?` 可查看 TUI 快捷鍵。
