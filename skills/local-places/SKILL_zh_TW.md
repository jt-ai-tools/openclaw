---
name: local-places
description: 透過本地端執行之 Google Places API 代理搜尋地點（餐廳、咖啡廳等）。
homepage: https://github.com/Hyaxia/local_places
metadata:
  {
    "openclaw":
      {
        "emoji": "📍",
        "requires": { "bins": ["uv"], "env": ["GOOGLE_PLACES_API_KEY"] },
        "primaryEnv": "GOOGLE_PLACES_API_KEY",
      },
  }
---

> 此文件為 [English Version](SKILL.md) 的繁體中文版本。

# 📍 本地地點搜尋 (Local Places)

使用本地端 Google Places API 代理搜尋附近地點。兩階段流程：先解析位置，再進行搜尋。

## 設定

```bash
cd {baseDir}
echo "GOOGLE_PLACES_API_KEY=您的密鑰" > .env
uv venv && uv pip install -e ".[dev]"
uv run --env-file .env uvicorn local_places.main:app --host 127.0.0.1 --port 8000
```

需要在 `.env` 或環境變數中設定 `GOOGLE_PLACES_API_KEY`。

## 快速開始

1. **檢查伺服器：** `curl http://127.0.0.1:8000/ping`

2. **解析位置：**

```bash
curl -X POST http://127.0.0.1:8000/locations/resolve 
  -H "Content-Type: application/json" 
  -d '{"location_text": "台北市信義區", "limit": 5}'
```

3. **搜尋地點：**

```bash
curl -X POST http://127.0.0.1:8000/places/search 
  -H "Content-Type: application/json" 
  -d '{
    "query": "咖啡廳",
    "location_bias": {"lat": 25.033, "lng": 121.56, "radius_m": 1000},
    "filters": {"open_now": true, "min_rating": 4.0},
    "limit": 10
  }'
```

4. **獲取詳情：**

```bash
curl http://127.0.0.1:8000/places/{place_id}
```

## 對話流程建議

1. 若使用者說「在我附近」或位置模糊 → 先進行「位置解析 (Resolve)」。
2. 若解析出多個結果 → 顯示編號清單，詢問使用者挑選。
3. 詢問偏好：類型、是否營業中、評價、價格等級。
4. 根據選定位置進行搜尋。
5. 呈現包含名稱、評價、地址、營業狀態的結果。

## 過濾器約束

- `filters.types`：僅限 **一個** 類型（如 "restaurant", "cafe", "gym"）。
- `filters.price_levels`：整數 0-4（0=免費，4=非常昂貴）。
- `filters.min_rating`：0-5 之間，以 0.5 為遞增單位。
- `filters.open_now`：布林值。
- `limit`：搜尋為 1-20，解析位置為 1-10。
