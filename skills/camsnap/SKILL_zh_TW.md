---
name: camsnap
description: 從 RTSP/ONVIF 攝影機擷取影格或短片。
homepage: https://camsnap.ai
metadata:
  {
    "openclaw":
      {
        "emoji": "📸",
        "requires": { "bins": ["camsnap"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "steipete/tap/camsnap",
              "bins": ["camsnap"],
              "label": "安裝 camsnap (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# camsnap

使用 `camsnap` 指令從已配置的攝影機中獲取快照、短片或偵測動態事件。

## 設定

- 組態檔案：`~/.config/camsnap/config.yaml`
- 新增攝影機：`camsnap add --name 廚房 --host 192.168.0.10 --user user --pass pass`

## 常見指令

- 探索：`camsnap discover --info`
- 快照：`camsnap snap 廚房 --out shot.jpg`
- 短片：`camsnap clip 廚房 --dur 5s --out clip.mp4`
- 動態監控：`camsnap watch 廚房 --threshold 0.2 --action '...'`
- 診斷：`camsnap doctor --probe`

## 注意事項

- 需要 PATH 中包含 `ffmpeg`。
- 在擷取較長影片前，建議先進行簡短的測試擷取。
