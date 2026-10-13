---
summary: "OpenClaw 的 Docker 安裝與引導設定指引（選用）"
read_when:
  - 您想要使用容器化的閘道器而非本地安裝時
  - 您正在驗證 Docker 執行流程時
title: "Docker"
---

> 此文件為 [English Version](/install/docker_zh_TW) 的繁體中文版本。

# Docker (選用)

Docker 是 **選用** 的。僅當您想要容器化的閘道器環境，或需要驗證 Docker 流程時才使用。

## Docker 適合我嗎？

- **是**：如果您想要一個隔離、即用即丟的閘道器環境，或是在不想進行本地安裝的主機上執行 OpenClaw。
- **否**：如果您是在自己的個人機器上執行，且追求最快的開發循環。建議使用一般安裝流程。
- **沙箱注意**：代理人沙箱 (Agent Sandboxing) 雖然也使用 Docker，但 **並不要求** 整個閘道器都執行於 Docker 中。詳情請參閱 [沙箱 (Sandboxing)](/gateway/sandboxing_zh_TW)。

本指南涵蓋：
- **容器化閘道器**：完整的 OpenClaw 執行於 Docker 中。
- **代理人沙箱**：主機端的閘道器 + 透過 Docker 隔離的代理人工具執行環境。

---

## 容器化閘道器 (Docker Compose)

### 快速開始（推薦）
在儲存庫根目錄執行：
```bash
./docker-setup.sh
```
此腳本會：建置映像檔、執行引導設定、啟動閘道器並產生權杖 (Token)。

完成後：
- 開啟瀏覽器訪問 `http://127.0.0.1:18789/`。
- 將生成的權杖貼入控制介面（設定 → Token）。

### 控制介面權杖與配對
若看到「unauthorized（未授權）」或「pairing required（需要配對）」，請獲取連結並核准瀏覽器裝置：
```bash
docker compose run --rm openclaw-cli dashboard --no-open
docker compose run --rm openclaw-cli devices list
docker compose run --rm openclaw-cli devices approve <請求ID>
```

---

## 代理人沙箱 (Agent Sandbox)

詳盡說明請參閱：[沙箱 (Sandboxing)](/gateway/sandboxing_zh_TW)。

### 功能說明
當啟用了 `agents.defaults.sandbox` 時，**非主工作階段 (Non-main sessions)** 的工具將在 Docker 容器內執行。閘道器維持在您的主機上，但工具執行環境被隔離：
- 預設範圍為 `"agent"`（每個代理人一個容器與工作區）。
- 預設模式為 `"non-main"`（私訊與群組對話進入沙箱，`main` 金鑰則否）。

### 預設行為
- 映像檔：`openclaw-sandbox:bookworm-slim`。
- 預設不提供網路存取（需明確開啟）。
- 預設拒絕：`browser`, `canvas`, `nodes`, `cron`, `discord`, `gateway` 等涉及主機操作的工具。

### 建立預設沙箱映像檔
```bash
scripts/sandbox-setup.sh
```

### 工具策略 (Allow/Deny)
- **拒絕 (Deny) 優先於 允許 (Allow)**。
- 若「允許」清單為空：所有工具（除了被拒絕的）皆可使用。
- 若「允許」清單非空：僅能使用清單中的工具（扣除被拒絕的）。

## 疑難排解
- **找不到映像檔**：請執行 `scripts/sandbox-setup.sh` 建置。
- **沙箱權限錯誤**：請將 `docker.user` 設定為與掛載的工作區目錄擁有者相符的 UID:GID。
- **找不到自訂工具**：OpenClaw 使用 `sh -lc` (Login shell) 執行指令，可能會重置 PATH。請在 `docker.env.PATH` 中設定您的路徑。
