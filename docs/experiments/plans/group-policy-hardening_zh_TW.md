---
summary: "Telegram 允許清單強化：前綴與空白字元標準化說明"
title: "Telegram 允許清單強化"
---

> 此文件為 [English Version](/experiments/plans/group-policy-hardening_zh_TW) 的繁體中文版本。

# Telegram 允許清單強化計畫

**日期**：2026-01-05
**狀態**：已完成

## 摘要
Telegram 允許清單現在支援 `telegram:` 與 `tg:` 前綴（不分大小寫），並且會自動處理意外的空白字元。這使得傳入的允許清單檢查與傳出的發送標準化邏輯達成一致。

## 變更內容
- 統一處理 `telegram:` 與 `tg:` 前綴。
- 自動修整 (Trim) 允許清單條目，並忽略空項目。

## 為什麼這很重要？
從日誌或對話 ID 中複製貼上時，往往會帶有前綴或空格。標準化處理可以避免因為這些格式差異而導致機器人不回覆的情況（False negatives）。

## 相關連結
- [群組對話 (Group Chats)](/channels/groups_zh_TW)
- [Telegram 提供者](/channels/telegram_zh_TW)
