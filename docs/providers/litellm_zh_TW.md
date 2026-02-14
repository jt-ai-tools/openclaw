---
summary: "透過 LiteLLM 代理執行 OpenClaw，實現統一的模型存取與成本追蹤"
read_when:
  - 您想要將 OpenClaw 流量導向 LiteLLM 代理時
  - 您需要透過 LiteLLM 進行成本追蹤、記錄或模型路由時
---

> 此文件為 [English Version](/providers/litellm_zh_TW) 的繁體中文版本。

# LiteLLM

[LiteLLM](https://litellm.ai) 是一個開源的 LLM 閘道器，為超過 100 個模型提供者提供統一的 API。將 OpenClaw 流量導向 LiteLLM，可以實現集中式的成本追蹤、日誌記錄，並能靈活地切換後端模型而無需修改 OpenClaw 組態。

## 為什麼在 OpenClaw 中使用 LiteLLM？

- **成本追蹤**：精確查看 OpenClaw 在所有模型上的花費。
- **模型路由**：切換 Claude, GPT-4, Gemini, Bedrock 而不需更改 OpenClaw 組態。
- **虛擬密鑰**：為 OpenClaw 建立具有預算限制的密鑰。
- **日誌記錄**：完整的請求/回應日誌，方便偵錯。
- **備援機制**：當主提供者服務中斷時自動執行容錯移轉。

## 快速開始

### 透過引導設定

```bash
openclaw onboard --auth-choice litellm-api-key
```

### 手動設定

1. 啟動 LiteLLM 代理：

```bash
pip install 'litellm[proxy]'
litellm --model claude-opus-4-6
```

2. 將 OpenClaw 指向 LiteLLM：

```bash
export LITELLM_API_KEY="您的_LITELLM_密鑰"

openclaw
```

就這樣。OpenClaw 現在會透過 LiteLLM 進行路由。

## 虛擬密鑰 (Virtual keys)

為 OpenClaw 建立具有預算上限的專用密鑰：

```bash
curl -X POST "http://localhost:4000/key/generate" 
  -H "Authorization: Bearer $LITELLM_MASTER_KEY" 
  -H "Content-Type: application/json" 
  -d '{
    "key_alias": "openclaw",
    "max_budget": 50.00,
    "budget_duration": "monthly"
  }'
```

將產生的密鑰用作 `LITELLM_API_KEY`。

## 模型路由 (Model routing)

LiteLLM 可以將模型請求路由至不同的後端。在您的 LiteLLM `config.yaml` 中進行配置：

```yaml
model_list:
  - model_name: claude-opus-4-6
    litellm_params:
      model: claude-opus-4-6
      api_key: os.environ/ANTHROPIC_API_KEY

  - model_name: gpt-4o
    litellm_params:
      model: gpt-4o
      api_key: os.environ/OPENAI_API_KEY
```

OpenClaw 持續請求 `claude-opus-4-6` —— LiteLLM 會自動處理底層的路由。

## 查看用量

檢查 LiteLLM 的儀表板或 API：

```bash
# 密鑰資訊
curl "http://localhost:4000/key/info" 
  -H "Authorization: Bearer sk-litellm-key"

# 消耗紀錄
curl "http://localhost:4000/spend/logs" 
  -H "Authorization: Bearer $LITELLM_MASTER_KEY"
```

## 注意事項

- LiteLLM 預設執行於 `http://localhost:4000`。
- OpenClaw 透過相容於 OpenAI 的 `/v1/chat/completions` 端點進行連線。
- 所有的 OpenClaw 功能皆可透過 LiteLLM 運作，沒有任何限制。
