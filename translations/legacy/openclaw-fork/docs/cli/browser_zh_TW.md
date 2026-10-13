---
summary: "`openclaw browser` (設定檔、分頁、動作與擴充功能中繼) 的 CLI 參考資料"
read_when:
  - 您正在使用 `openclaw browser` 並需要常用任務範例時
  - 您想要透過節點主機控制執行於另一台機器上的瀏覽器時
  - 您想要使用 Chrome 擴充功能中繼 (Extension relay) 時
title: "browser"
---

> 此文件為 [English Version](/cli/browser_zh_TW) 的繁體中文版本。

# `openclaw browser`

管理 OpenClaw 的瀏覽器控制伺服器，並執行瀏覽器動作（分頁、快照、螢幕截圖、導覽、點擊、輸入）。

## 相關資訊：
- 瀏覽器工具與 API：[瀏覽器工具 (Browser tool)](/tools/browser_zh_TW)
- Chrome 擴充功能中繼：[Chrome 擴充功能](/tools/chrome-extension_zh_TW)

## 常用旗標

- `--browser-profile <名稱>`：選擇瀏覽器設定檔（預設從組態讀取）。
- `--json`：機器可讀的輸出格式。

## 快速開始 (本地)

```bash
openclaw browser --browser-profile chrome tabs (查看分頁)
openclaw browser --browser-profile openclaw start (啟動瀏覽器)
openclaw browser --browser-profile openclaw open https://example.com (開啟網址)
openclaw browser --browser-profile openclaw snapshot (獲取頁面快照)
```

## 設定檔 (Profiles)

設定檔是具名的瀏覽器路由配置。實務上：
- `openclaw`：啟動/連接至一個由 OpenClaw 專門管理的 Chrome 實例（具備隔離的使用者資料目錄）。
- `chrome`：透過 Chrome 擴充功能中繼控制您現有的 Chrome 分頁。

```bash
openclaw browser profiles (列出設定檔)
openclaw browser create-profile --name work --color "#FF5A36" (建立)
```

## 分頁操作

```bash
openclaw browser tabs (分頁列表)
openclaw browser open https://docs.openclaw.ai (開啟)
openclaw browser focus <目標ID> (聚焦)
openclaw browser close <目標ID> (關閉)
```

## 快照、截圖與 UI 自動化

```bash
openclaw browser snapshot (快照)
openclaw browser screenshot (截圖)

# 導覽與 UI 自動化 (基於引用標籤)
openclaw browser navigate https://example.com
openclaw browser click <ref>
openclaw browser type <ref> "hello"
```

## 遠端瀏覽器控制 (節點主機代理)

如果閘道器與瀏覽器執行於不同機器，請在有安裝瀏覽器的機器上執行 **節點主機 (node host)**。閘道器會自動將瀏覽器動作代理至該節點。

關於安全性與遠端設定，請參閱：[瀏覽器工具 (Browser tool)](/tools/browser_zh_TW), [遠端存取 (Remote access)](/gateway/remote_zh_TW)。
