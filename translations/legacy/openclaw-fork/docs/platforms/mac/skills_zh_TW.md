---
summary: "macOS 技能設定 UI 與基於閘道器的狀態顯示說明"
read_when:
  - 更新 macOS 技能設定 UI 時
  - 更改技能門控或安裝行為時
title: "技能"
---

> 此文件為 [English Version](/platforms/mac/skills_zh_TW) 的繁體中文版本。

# 技能 (Skills - macOS)

macOS App 透過閘道器 (Gateway) 呈現 OpenClaw 技能；App 本身不進行本地端的技能剖析。

## 數據來源

- 透過閘道器的 `skills.status` 獲取所有技能、適用資格以及缺少的必要條件。
- 必要條件衍生自每個 `SKILL.md` 檔案中的 `metadata.openclaw.requires`。

## 安裝動作

- `metadata.openclaw.install` 定義了安裝選項（brew/node/go/uv）。
- App 呼叫 `skills.install` 在閘道器主機上執行安裝程式。
- 當提供多個安裝選項時，閘道器僅會呈現一個優先選項（優先使用 Homebrew）。

## 環境變數與 API 密鑰

- App 將密鑰儲存於 `~/.openclaw/openclaw.json` 中的 `skills.entries.<skillKey>` 區段。
- 支援透過 UI 調整技能的啟用狀態 (`enabled`)、API 密鑰與環境變數。

## 遠端模式

- 在遠端模式下，安裝與組態更新皆發生於 **閘道器主機** 上（而非本地的 Mac 裝置）。
