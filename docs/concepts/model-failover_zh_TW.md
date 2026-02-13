---
summary: "OpenClaw 如何進行驗證設定檔輪替以及跨模型的備援機制說明"
read_when:
  - 診斷驗證設定檔輪替、冷卻期或模型備援行為時
  - 更新驗證設定檔或模型的容錯移轉規則時
title: "模型容錯移轉"
---

> 此文件為 [English Version](/concepts/model-failover) 的繁體中文版本。

# 模型容錯移轉 (Model failover)

OpenClaw 分兩個階段處理失敗情況：

1. **驗證設定檔輪替 (Auth profile rotation)**：在目前提供者內部進行切換。
2. **模型備援 (Model fallback)**：切換至 `agents.defaults.model.fallbacks` 清單中的下一個模型。

本文件將解釋執行階段的規則以及支援這些規則的底層數據。

## 驗證存儲 (密鑰 + OAuth)

OpenClaw 將 API 密鑰與 OAuth Token 統一儲存為 **驗證設定檔 (Auth profiles)**。

- 機密資訊存放在 `~/.openclaw/agents/<agentId>/agent/auth-profiles.json`（舊版路徑：`~/.openclaw/agent/auth-profiles.json`）。
- 組態中的 `auth.profiles` / `auth.order` 僅包含 **元數據與路由資訊**（不含機密資訊）。
- 舊版的僅限匯入 OAuth 檔案：`~/.openclaw/credentials/oauth.json`（首次使用時會匯入至 `auth-profiles.json`）。

更多細節請見：[/concepts/oauth](/concepts/oauth_zh_TW)

憑證類型：

- `type: "api_key"` → `{ provider, key }`
- `type: "oauth"` → `{ provider, access, refresh, expires, email? }`（部分提供者還包含 `projectId`/`enterpriseUrl`）

## 設定檔 ID (Profile IDs)

OAuth 登入會建立獨立的設定檔，以便多個帳號並存。

- 預設值：當沒有提供電子郵件時為 `provider:default`。
- 帶有電子郵件的 OAuth：`provider:<電子郵件>`（例如 `google-antigravity:user@gmail.com`）。

設定檔儲存在 `auth-profiles.json` 的 `profiles` 欄位下。

## 輪替順序

當一個提供者擁有多個設定檔時，OpenClaw 會依以下優先順序決定切換順序：

1. **明確組態**：`auth.order[provider]`（若有設定）。
2. **已配置的設定檔**：`auth.profiles`（依提供者過濾）。
3. **已儲存的設定檔**：`auth-profiles.json` 中該提供者的所有項目。

若未配置明確順序，OpenClaw 將使用輪詢 (Round-robin) 順序：

- **第一排序鍵：** 設定檔類型（**OAuth 優於 API 密鑰**）。
- **第二排序鍵：** `usageStats.lastUsed`（各類型中最早使用的優先）。
- **冷卻中/已停用的設定檔** 會被移至末尾，並依據最接近到期時間進行排序。

### 會話黏著性 (快取友善)

OpenClaw 會為 **每個會話固定 (Pin) 所選的驗證設定檔**，以保持提供者端的快取處於暖機 (Warm) 狀態。它 **不會** 在每次請求時都進行輪替。固定的設定檔會持續使用，直到：

- 工作階段重設 (`/new` / `/reset`)。
- 完成了一次壓縮 (Compaction)（壓縮次數增加）。
- 該設定檔進入冷卻期或被停用。

透過 `/model …@<profileId>` 進行手動選擇，會為該會話設定 **使用者覆寫 (User override)**，且在開啟新會話前不會自動輪替。

自動固定的設定檔（由會話路由選擇）被視為一種 **偏好**：會優先嘗試使用，但 OpenClaw 可能會在遇到頻率限制或逾時時輪替至另一個設定檔。使用者手動固定的設定檔則會鎖定在該設定檔；若失敗且有配置模型備援，OpenClaw 會直接切換至下一個模型，而非切換驗證設定檔。

### 為什麼 OAuth 有時看起來會「遺失」

如果您針對同一個提供者同時擁有 OAuth 設定檔與 API 密鑰設定檔，除非已固定，否則輪詢機制可能會在不同訊息間切換。若要強制使用單一設定檔，請：

- 使用 `auth.order[provider] = ["provider:profileId"]` 進行固定，或
- 透過 `/model …` 指令加上設定檔覆寫進行單次會話設定（若您的 UI/聊天介面支援）。

## 冷卻期 (Cooldowns)

當設定檔因驗證/頻率限制錯誤（或看起來像頻率限制的逾時）而失敗時，OpenClaw 會將其標記為進入冷卻期，並切換至下一個設定檔。格式錯誤或無效請求錯誤（例如 Cloud Code Assist 的工具調用 ID 驗證失敗）也被視為符合容錯移轉條件，並套用相同的冷卻規則。

冷卻期使用指數退避 (Exponential backoff) 機制：

- 1 分鐘
- 5 分鐘
- 25 分鐘
- 1 小時（上限）

狀態儲存在 `auth-profiles.json` 的 `usageStats` 欄位下：

```json
{
  "usageStats": {
    "provider:profile": {
      "lastUsed": 1736160000000,
      "cooldownUntil": 1736160600000,
      "errorCount": 2
    }
  }
}
```

## 帳務原因停用

帳務/點數扣款失敗（例如：「餘額不足」/「點數低於門檻」）被視為符合容錯移轉條件，但這類錯誤通常不是暫時性的。與短期的冷卻期不同，OpenClaw 會將該設定檔標記為 **已停用 (disabled)**（具備更長的退避時間），並輪替至下一個設定檔或提供者。

狀態儲存在 `auth-profiles.json` 中：

```json
{
  "usageStats": {
    "provider:profile": {
      "disabledUntil": 1736178000000,
      "disabledReason": "billing"
    }
  }
}
```

預設值：

- 帳務退避從 **5 小時** 開始，每次失敗翻倍，上限為 **24 小時**。
- 若該設定檔在 **24 小時**（可配置）內未發生失敗，退避計數器將重置。

## 模型備援 (Model fallback)

若一個提供者的所有設定檔皆失敗，OpenClaw 會切換至 `agents.defaults.model.fallbacks` 清單中的下一個模型。這適用於驗證失敗、頻率限制以及耗盡了所有輪替設定檔的逾時情況（其他類型的錯誤不會觸發備援遞進）。

當執行回合是以模型覆寫（透過 Hooks 或 CLI）開始時，在嘗試完所有配置的備援後，最終仍會回到 `agents.defaults.model.primary`。

## 相關組態

請參閱 [閘道器組態](/gateway/configuration_zh_TW) 以了解：

- `auth.profiles` / `auth.order`
- `auth.cooldowns.billingBackoffHours` / `auth.cooldowns.billingBackoffHoursByProvider`
- `auth.cooldowns.billingMaxHours` / `auth.cooldowns.failureWindowHours`
- `agents.defaults.model.primary` / `agents.defaults.model.fallbacks`
- `agents.defaults.imageModel` 路由設定

關於整體的模型選擇與備援概觀，請參閱 [模型](/concepts/models_zh_TW)。
