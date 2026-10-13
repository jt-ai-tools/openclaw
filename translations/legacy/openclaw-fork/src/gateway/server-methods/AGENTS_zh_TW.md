# 閘道器伺服器方法注意事項 (Gateway Server Methods Notes)

- Pi 工作階段逐字稿採用 `parentId` 鏈狀/有向無環圖 (DAG) 結構。
- **絕不可** 直接透過原始 JSONL 寫入來附加 Pi `type: "message"` 條目。
- 缺少 `parentId` 會切斷葉子路徑 (Leaf path)，並破壞壓縮 (Compaction) 與歷史紀錄功能。
- 請一律透過 `SessionManager.appendMessage(...)` 或其封裝方法來寫入逐字稿訊息。
