---
summary: "用於代理人工作流的相機擷取（iOS/Android 節點 + macOS App）：照片 (jpg) 與短片 (mp4)"
read_when:
  - 新增或修改 iOS 節點或 macOS 的相機擷取功能時
  - 擴充代理人可存取的 MEDIA 臨時檔案工作流時
title: "相機擷取"
---

> 此文件為 [English Version](/nodes/camera_zh_TW) 的繁體中文版本。

# 相機擷取 (Camera capture - Agent)

OpenClaw 支援代理人調用相機功能：
- **iOS/Android 節點**：透過 `node.invoke` 擷取 **照片** (`jpg`) 或 **短片** (`mp4`)。
- **macOS App**：作為節點提供相同的相機擷取能力。

所有相機存取權限皆受 **使用者端設定** 控制。

## 核心行為

- **前台要求**：節點 App 必須處於 **前台執行** 狀態才能使用 `camera.*` 指令。背景呼叫會回傳 `NODE_BACKGROUND_UNAVAILABLE`。
- **酬載保護**：照片會自動重新壓縮，確保 base64 酬載大小低於 5 MB。
- **錄影上限**：短片目前上限為 60 秒，以避免產生過大的酬載。

## CLI 輔助工具 (MEDIA 產出)

獲取附件最簡單的方式是透過 CLI，它會將解碼後的檔案寫入臨時目錄並印出 `MEDIA:<路徑>`。

範例：
```bash
# 拍攝照片（預設同時拍前後鏡頭）
openclaw nodes camera snap --node <ID>

# 指定鏡頭
openclaw nodes camera snap --node <ID> --facing front

# 錄製 3 秒短片
openclaw nodes camera clip --node <ID> --duration 3000

# 錄製不含音訊的短片
openclaw nodes camera clip --node <ID> --no-audio
```

## 權限與安全
- **iOS/Android**：首次調用時會彈出系統權限提示。
- **macOS**：需在選單列 App 的設定中明確勾選「Allow Camera」。
- **螢幕錄製**：若需錄製螢幕而非相機，請使用 `openclaw nodes screen record`。
