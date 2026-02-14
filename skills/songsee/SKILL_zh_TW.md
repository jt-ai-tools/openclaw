---
name: songsee
description: 透過 songsee CLI 從音訊產生頻譜圖 (spectrograms) 與特徵面板可視化圖表。
homepage: https://github.com/steipete/songsee
metadata:
  {
    "openclaw":
      {
        "emoji": "🌊",
        "requires": { "bins": ["songsee"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "steipete/tap/songsee",
              "bins": ["songsee"],
              "label": "安裝 songsee (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# songsee

從音訊產生頻譜圖與特徵面板。

## 快速開始

- 頻譜圖：`songsee track.mp3`
- 多面板可視化：`songsee track.mp3 --viz spectrogram,mel,chroma,hpss,selfsim,loudness,tempogram,mfcc,flux`
- 時間切片：`songsee track.mp3 --start 12.5 --duration 8 -o slice.jpg`
- 標準輸入 (Stdin)：`cat track.mp3 | songsee - --format png -o out.png`

## 常用旗標

- `--viz` 清單（可重複使用或以逗號分隔）。
- `--style` 調色盤（classic, magma, inferno, viridis, gray）。
- `--width` / `--height` 輸出尺寸。
- `--window` / `--hop` FFT (快速傅立葉變換) 設定。
- `--min-freq` / `--max-freq` 頻率範圍。
- `--start` / `--duration` 時間切片。
- `--format` jpg|png。

## 注意事項

- 原生支援 WAV/MP3 解碼；其它格式在可用時會使用 ffmpeg。
- 多個 `--viz` 會渲染成網格視圖。
