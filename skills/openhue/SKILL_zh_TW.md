---
name: openhue
description: 透過 OpenHue CLI 控制 Philips Hue 燈光與場景。
homepage: https://www.openhue.io/cli
metadata:
  {
    "openclaw":
      {
        "emoji": "💡",
        "requires": { "bins": ["openhue"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "openhue/cli/openhue-cli",
              "bins": ["openhue"],
              "label": "安裝 OpenHue CLI (brew)",
            },
          ],
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# OpenHue CLI

使用 `openhue` 指令透過 Hue Bridge 橋接器控制 Hue 燈光與場景。

## 設定

- 探索橋接器：`openhue discover`。
- 引導式設定：`openhue setup`。

## 讀取狀態

- `openhue get light --json` (獲取燈光)。
- `openhue get room --json` (獲取房間)。
- `openhue get scene --json` (獲取場景)。

## 寫入操作

- 開啟燈光：`openhue set light <ID或名稱> --on`。
- 關閉燈光：`openhue set light <ID或名稱> --off`。
- 調整亮度：`openhue set light <ID> --on --brightness 50`。
- 調整顏色：`openhue set light <ID> --on --rgb #3399FF`。
- 切換場景：`openhue set scene <場景ID>`。

## 注意事項

- 在設定過程中，您可能需要按一下 Hue Bridge 上的按鈕。
- 若燈光名稱重複，請使用 `--room "房間名稱"` 進行定位。
