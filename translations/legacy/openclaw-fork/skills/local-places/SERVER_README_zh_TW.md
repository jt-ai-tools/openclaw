# 本地點搜尋伺服器 (Local Places Server)

本儲存庫由兩個部分組成：

- 一個 **FastAPI 伺服器**：公開端點，透過 Google Maps Places API 搜尋與解析地點。
- 一個 **配套的代理人技能**：解釋如何使用該 API，並能呼叫它來高效地尋找地點。

這兩者結合，能讓代理人將自然語言的地點查詢快速轉換為結構化結果。

## 本地執行

```bash
# 將技能定義複製到代理人尋找的相關資料夾中
# 然後啟動伺服器

uv venv
uv pip install -e ".[dev]"
uv run --env-file .env uvicorn local_places.main:app --host 0.0.0.0 --reload
```

在 http://127.0.0.1:8000/docs 開啟 API 文件。

## Places API

執行前請先設定 Google Places API 密鑰：

```bash
export GOOGLE_PLACES_API_KEY="您的密鑰"
```

端點列表：

- `POST /places/search`（自由文字查詢 + 過濾器）
- `GET /places/{place_id}`（地點詳情）
- `POST /locations/resolve`（解析使用者提供的地點字串）

## 測試

```bash
uv run pytest
```

## OpenAPI

產生 OpenAPI Schema：

```bash
uv run python scripts/generate_openapi.py
```
