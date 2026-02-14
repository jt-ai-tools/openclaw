---
name: sonoscli
description: 控制 Sonos 音響（探索、狀態、播放、音量、分組）。
homepage: https://sonoscli.sh
metadata:
  {
    "openclaw":
      {
        "emoji": "🔊",
        "requires": { "bins": ["sonos"] },
        "install":
          [
            {
              "id": "go",
              "kind": "go",
              "module": "github.com/steipete/sonoscli/cmd/sonos@latest",
              "bins": ["sonos"],
              "label": "安裝 sonoscli (go)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL_zh_TW.md) 的繁體中文版本。

# Sonos CLI

使用 `sonos` 指令控制區域網路內的 Sonos 音響。

## 快速開始

- `sonos discover` (搜尋音響)。
- `sonos status --name "廚房"` (檢查狀態)。
- `sonos play|pause|stop --name "廚房"` (播放控制)。
- `sonos volume set 15 --name "廚房"` (設定音量)。

## 常用任務

- 分組：`sonos group status|join|unjoin|party|solo`。
- 我的最愛：`sonos favorites list|open`。
- 播放佇列：`sonos queue list|play|clear`。
- Spotify 搜尋 (透過 SMAPI)：`sonos smapi search --service "Spotify" --category tracks "查詢內容"`。

## 注意事項

- 若 SSDP 自動探索失敗，請指定 `--ip <音響IP位址>`。
- 使用 Spotify Web API 搜尋為選用功能，且需要 `SPOTIFY_CLIENT_ID/SECRET`。
