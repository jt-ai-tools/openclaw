# 內建勾子 (Bundled Hooks)

本目錄包含 OpenClaw 隨附的勾子。這些勾子會被自動發現，並可透過 CLI 或組態設定進行啟用與停用。

## 可用勾子

### 💾 session-memory
當您下達 `/new` 指令時，自動將工作階段上下文存入工作區記憶體。
- **事件**：`command:new`。
- **路徑**：`<工作區>/memory/YYYY-MM-DD-slug.md`。

### 📝 command-logger
將所有指令事件記錄至集中的稽核檔案。
- **事件**：`command`（所有指令）。
- **路徑**：`~/.openclaw/logs/commands.log`。

### 🚀 boot-md
每當閘道器啟動時，自動執行工作區中的 `BOOT.md` 指令。
- **事件**：`gateway:startup`。

## 如何管理
```bash
openclaw hooks list (列表)
openclaw hooks enable <名稱> (啟用)
openclaw hooks info <名稱> (詳細資訊)
```

## 自訂勾子
若要建立您自己的勾子，請將其放置於：
- **工作區勾子**：`<工作區>/hooks/`。
- **受控勾子**：`~/.openclaw/hooks/`。

自訂勾子必須遵循與內建勾子相同的目錄結構（包含 `HOOK.md` 與 `handler.ts`）。
