---
name: weather
description: 獲取目前天氣與預報（無需 API 密鑰）。
homepage: https://wttr.in/:help
metadata: { "openclaw": { "emoji": "🌤️", "requires": { "bins": ["curl"] } } }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# 天氣 (Weather)

這裡提供兩個免費服務，皆不需要 API 密鑰。

## wttr.in (主要建議方式)

快速獲取：

```bash
curl -s "wttr.in/Taipei?format=3"
# 輸出：Taipei: ⛅️ +22°C
```

精簡格式：

```bash
curl -s "wttr.in/Taipei?format=%l:+%c+%t+%h+%w"
# 輸出：Taipei: ⛅️ +22°C 71% ↙5km/h
```

完整預報：

```bash
curl -s "wttr.in/Taipei?T"
```

格式代碼：`%c` 天氣狀況 · `%t` 溫度 · `%h` 濕度 · `%w` 風速 · `%l` 位置 · `%m` 月相。

小撇步：

- URL 編碼空白字元：`wttr.in/New+York`。
- 機場代碼：`wttr.in/TPE`。
- 單位：`?m` (公制) `?u` (美制)。
- 僅限今天：`?1` · 僅限目前：`?0`。
- 圖片格式：`curl -s "wttr.in/Taipei.png" -o /tmp/weather.png`。

## Open-Meteo (備援方案, JSON)

免費且無需密鑰，適合程式化處理：

```bash
curl -s "https://api.open-meteo.com/v1/forecast?latitude=25.03&longitude=121.56&current_weather=true"
```

先找到城市座標，再進行查詢。回傳包含溫度、風速與天氣代碼的 JSON。

說明文件：https://open-meteo.com/en/docs
