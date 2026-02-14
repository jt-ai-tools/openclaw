---
name: video-frames
description: 使用 ffmpeg 從影片中擷取影格或短片。
homepage: https://ffmpeg.org
metadata:
  {
    "openclaw":
      {
        "emoji": "🎞️",
        "requires": { "bins": ["ffmpeg"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "ffmpeg",
              "bins": ["ffmpeg"],
              "label": "安裝 ffmpeg (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# 影片影格擷取 (ffmpeg)

從影片中擷取單一影格，或建立快速縮圖以供檢查。

## 快速開始

擷取第一格：

```bash
{baseDir}/scripts/frame.sh /路徑/影片.mp4 --out /tmp/frame.jpg
```

在特定時間戳記擷取：

```bash
{baseDir}/scripts/frame.sh /路徑/影片.mp4 --time 00:00:10 --out /tmp/frame-10s.jpg
```

## 注意事項

- 當詢問「這裡發生了什麼事？」時，優先使用 `--time`。
- 快速分享建議使用 `.jpg`；若需要清晰的 UI 影格請使用 `.png`。
