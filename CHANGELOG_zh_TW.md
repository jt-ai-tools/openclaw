# 變更日誌 (Changelog)

說明文件：https://docs.openclaw.ai

## 2026.2.13 (未發佈)

### 修復 (Fixes)

- 引導設定 (Onboarding)/CLI：在不恢復已暫停的 `stdin` 情況下還原終端機狀態，使引導設定在選擇 Web UI 後能乾淨退出，並讓安裝程式正常回傳而非卡住。
- macOS 語音喚醒 (Voice Wake)：修復 CJK/Unicode 逐字稿觸發裁剪時的崩潰問題，改為匹配並切分原始字串範圍而非轉換後的字串索引。(#11052) 感謝 @Flash-LHR。

## 2026.2.12

### 變更 (Changes)

- CLI/外掛程式：新增 `openclaw plugins uninstall <id>` 指令，具備 `--dry-run`, `--force` 與 `--keep-files` 選項，包含安全解除安裝路徑處理與外掛程式解除安裝文件。(#5985) 感謝 @JustasMonkev。
- CLI：新增 `openclaw logs --local-time` 以在本地時區顯示記錄時間戳記。(#13818) 感謝 @xialonglee。
- Telegram：將 blockquotes 渲染為原生的 `<blockquote>` 標籤而非將其剝離。(#14608)
- Telegram：在原生指令選單中公開 `/compact` 指令。(#10352) 感謝 @akramcodez。
- Discord：新增基於身分組 (Role-based) 的允許清單與代理人路由。(#10650) 感謝 @Minidoracat。
- 組態 (Config)：在組態快照遮蔽期間避免遮蔽類似 `maxTokens` 的欄位，防止 `/config` 中的來回驗證失敗。(#14006) 感謝 @constansino。

### 破壞性變更 (Breaking)

- 勾子 (Hooks)：`POST /hooks/agent` 現在預設拒絕酬載中的 `sessionKey` 覆寫。若要保持固定的勾子上下文，請設定 `hooks.defaultSessionKey`（建議配合 `hooks.allowedSessionKeyPrefixes: ["hook:"]`）。如果您需要舊有行為，請明確設定 `hooks.allowRequestSessionKey: true`。感謝 @alpernae 的回報。

### 修復 (Fixes)

- 閘道器/OpenResponses：強化基於 URL 的 `input_file`/`input_image` 處理，具備明確的 SSRF 拒絕策略、主機名稱允許清單 (`files.urlAllowlist` / `images.urlAllowlist`)、單次請求 URL 輸入上限 (`maxUrlParts`)、遭阻擋獲取的稽核記錄，以及回歸測試覆蓋與文件更新。
- 安全性：修復未經驗證的 Nostr 個人檔案 API 遠端組態篡改問題。(#13719) 感謝 @coygeek。
- 安全性：移除內建的惡意勾子。(#14757) 感謝 @Imccccc。
- 安全性/稽核：新增勾子工作階段路由強化檢查（`hooks.defaultSessionKey`, `hooks.allowRequestSessionKey` 與前綴允許清單），並在 HTTP API 端點允許明確的工作階段金鑰路由時發出警告。
- 安全性/沙箱：將鏡像技能同步目的地限制在沙箱的 `skills/` 根目錄，並停止使用 Frontmatter 控制的技能名稱作為檔案系統目的地路徑。感謝 @1seal。
- 安全性/網頁工具：預設將瀏覽器/網頁內容視為不信任（針對瀏覽器快照/分頁/主控台使用封裝輸出，並針對網頁工具使用結構化外部內容詮釋資料），並從模型面對的逐字稿/壓縮輸入中剝離 `toolResult.details`，以降低提示詞注入 (Prompt-injection) 重播風險。
- 安全性/勾子：透過共享的常數時間秘密比較強化 Webhook 與裝置權杖驗證，並為勾子端點新增針對單一客戶端的驗證失敗頻率限制 (`429` + `Retry-After`)。感謝 @akhmittra。
- 安全性/瀏覽器：針對環回 (Loopback) 瀏覽器控制 HTTP 路由要求驗證，當瀏覽器控制在無驗證狀態啟動時自動產生 `gateway.auth.token`，並新增未經驗證瀏覽器控制的安全性稽核檢查。感謝 @tcusolle。
- 工作階段/閘道器：強化逐字稿路徑解析，拒絕不安全的工作階段 ID/檔案路徑，確保工作階段操作維持在代理人工作階段目錄內。感謝 @akhmittra。
- 工作階段：在 `/new` 與 `/reset` 工作階段重置時，保留 `verboseLevel`, `thinkingLevel`/`reasoningLevel` 以及 `ttsAuto` 的覆寫設定。(#10787) 感謝 @mcaxtr。
- 閘道器：提高 WS 酬載/緩衝限制，使 5,000,000 位元組的圖片附件能穩定運作。(#14486) 感謝 @0xRaini。
- 記錄 (Logging)/CLI：在控制台前綴使用本地時區時間戳記，並在使用 `openclaw logs --local-time` 時包含 `±HH:MM` 偏移量以避免歧義。(#14771) 感謝 @0xRaini。
- 閘道器：在重啟前排空 (Drain) 活動回合以防止訊息遺失。(#13931) 感謝 @0xRaini。
- 閘道器：在安裝期間自動產生驗證權杖，以防止 launchd 重啟迴圈。(#13813) 感謝 @cathrynlavery。
- 閘道器：防止驗證組態中出現 `undefined`/遺失權杖的情況。(#13809) 感謝 @asklee-klawd。
- 閘道器：處理關機期間 stdout/stderr 上的非同步 `EPIPE` 錯誤。(#13414) 感謝 @keshav55。
- 閘道器/控制介面：修復當 `openclaw` 透過基於符號連結的 Node 管理器（nvm/fnm/n/Homebrew）全域安裝時，遺失儀表板資產的問題。(#14919) 感謝 @aynorica。
- 排程 (Cron)：針對隔離任務驗證解析使用請求的 `agentId`。(#13983) 感謝 @0xRaini。
- 排程 (Cron)：防止排程任務在 `nextRunAtMs` 推進時跳過執行。(#14068) 感謝 @WalterSumbon。
- 排程 (Cron)：針對主工作階段任務將 `agentId` 傳遞給 `runHeartbeatOnce`。(#14140) 感謝 @ishikawa-pro。
- 排程 (Cron)：當任務仍在執行且 `onTimer` 觸發時，重新設定定時器。(#14233) 感謝 @tomron87。
- 排程 (Cron)：防止多個任務同時觸發時重複執行。(#14256) 感謝 @xinhuagu。
- 排程 (Cron)：隔離排程器錯誤，使單一錯誤任務不會影響所有任務。(#14385) 感謝 @MarvinDontPanic。
- 排程 (Cron)：防止單次執行的 `at` 任務在跳過/錯誤執行後的重啟時再次觸發。(#13878) 感謝 @lailoo。
- 心跳 (Heartbeat)：防止排程器在意外執行錯誤時停滯，並避免在 `requests-in-flight` 跳過後立即進入重跑迴圈。(#14901) 感謝 @joeykrug。
- 排程 (Cron)：針對隔離代理人執行遵循儲存的工作階段模型覆寫，同時保留 Gmail 勾子工作階段的 `hooks.gmail.model` 優先權。(#14983) 感謝 @shtse8。
- 記錄/瀏覽器：當 `/tmp/openclaw` 不可用時，回退至 `os.tmpdir()/openclaw` 作為預設記錄、瀏覽器追蹤與瀏覽器下載臨時路徑。
- WhatsApp：將 Markdown 粗體/刪除線轉換為 WhatsApp 格式。(#14285) 感謝 @Raikan10。
- WhatsApp：允許僅發送媒體，並規範化領先的空白酬載。(#14408) 感謝 @karimnaguib。
- WhatsApp：當 Baileys 省略語音訊息的 MIME 類型時，使用預設值。(#14444) 感謝 @mcaxtr。
- Telegram：處理模型選擇器 editMessageText 中無文字訊息的情況。(#14397) 感謝 @0xRaini。
- Telegram：將 REACTION_INVALID 呈現為非致命警告。(#14340) 感謝 @0xRaini。
- BlueBubbles：修復透過環回代理信任導致的 Webhook 驗證繞過問題。(#13787) 感謝 @coygeek。
- Slack：將預設的 replyToMode 從 "off" 改為 "all"。(#14364) 感謝 @nm-de。
- Slack：當頻道訊息以機器人提及前綴開始時（例如 `@Bot /new`），偵測控制指令。(#14142) 感謝 @beefiker。
- Signal：針對 Signal 機器人帳號提示強制執行 E.164 驗證，以便及早發現輸入錯誤的號碼。(#15063) 感謝 @Duartemartins。
- Discord：處理私訊 (DM) 的回應 (Reactions)，而非靜默丟棄。(#10418) 感謝 @mcaxtr。
- Discord：在頻道權限檢查中將 Administrator 視為完整權限。感謝 @thewilloftheshadow。
- Discord：在執行緒中遵循 replyToMode。(#11062) 感謝 @cordx56。
- 瀏覽器：新增 Chrome 啟動旗標 `--disable-blink-features=AutomationControlled`，以減少受 reCAPTCHA 保護網站上的 `navigator.webdriver` 自動化偵測問題。(#10735) 感謝 @Milofax。
- 心跳：過濾僅含雜訊的系統事件，使預約提醒通知不會在 Cron 執行僅帶有心跳標記時觸發。(#13317) 感謝 @pvtclawn。
- Signal：將提及佔位符渲染為 `@uuid`/`@phone`，使提及門控與 Clawdbot 目標鎖定功能正常運作。(#2013) 感謝 @alexgleason。
- Discord：針對僅媒體訊息省略空白內容欄位，同時保留說明的空白字元。(#9507) 感謝 @leszekszpunar。
- 引導設定/提供者：新增 Z.AI 端點專屬驗證選項 (`zai-coding-global`, `zai-coding-cn`, `zai-global`, `zai-cn`) 並擴展預設 Z.AI 模型串接。(#13456) 感謝 @tomsun28。
- 引導設定/提供者：將 MiniMax API 預設/建議模型從 M2.1 更新為 M2.5，新增 M2.5/M2.5-Lightning 模型項目，並在現代模型過濾中包含 `minimax-m2.5`。(#14865) 感謝 @adao-max。
- Ollama：使用配置的 `models.providers.ollama.baseUrl` 進行模型探索，並將 `/v1` 端點規範化為原生 Ollama API 根路徑。(#14131) 感謝 @shtse8。
- 語音通話 (Voice Call)：透過 `<Parameter>` 而非查詢字串傳遞 Twilio 串流驗證權杖。(#14029) 感謝 @mcwigglesmcgee。
- 飛書 (Feishu)：直接將 `Buffer` 傳遞給飛書 SDK 上傳 API，而非使用 `Readable.from(...)`，以避免表單數據上傳失敗。(#10345) 感謝 @youngerstyle。
- 飛書：僅在機器人本身被提及時（而非任何提及）觸發提及門控群組處理。(#11088) 感謝 @openperf。
- 飛書：探針狀態現在使用解析後的帳號上下文進行多帳號憑證檢查。(#11233) 感謝 @onevcat。
- 飛書：透過 Card Kit API 新增串流卡片回應，並為純文字回應保留 `renderMode=auto` 回退行為。(#10379) 感謝 @xzq-xu。
- 飛書 DocX：寫入/附加文件時使用 `firstLevelBlockIds` 保留最上層轉換區塊的順序。(#13994) 感謝 @Cynosure159。
- 飛書外掛程式打包：從 `extensions/feishu` 中移除 `workspace:*` 的 `openclaw` 依賴，並同步 lockfile 以確保安裝相容性。(#14423) 感謝 @jackcooper2015。
- CLI/精靈：當 `configure`, `agents add` 或互動式 `onboard` 精靈被取消時，以狀態碼 1 退出，使 `set -e` 自動化流程能正確停止。(#14156) 感謝 @0xRaini。
- 媒體：剝離帶有本地路徑的 `MEDIA:` 行，而非將其作為可見文字洩漏。(#14399) 感謝 @0xRaini。
- 組態/排程：從組態遮蔽中排除 `maxTokens`，並在跳過的 Cron 任務中遵循 `deleteAfterRun`。(#13342) 感謝 @niceysam。
- 組態：在組態檔案監聽器中忽略 `meta` 欄位的變更。(#13460) 感謝 @brandonwise。
- 守護程序 (Daemon)：在重啟 LaunchAgent 時抑制 `EPIPE` 錯誤。(#14343) 感謝 @0xRaini。
- Antigravity：新增 opus 4.6 向前相容模型，並繞過推理簽章清理。(#14218) 感謝 @jg-noncelogic。
- 代理人 (Agents)：防止子程序清理中的檔案描述符 (File descriptor) 洩漏。(#13565) 感謝 @KyleChen26。
- 代理人：防止由快取 TTL 繞過防護導致的重複壓縮。(#13514) 感謝 @taw0002。
- 代理人：在上下文顯示中使用最後一次 API 呼叫的快取 Token，而非累計總和。(#13805) 感謝 @akari-musubi。
- 代理人：透過使用最後一次呼叫用量與共享的 Token 計算邏輯，使後續執行器 (followup-runner) 工作階段的 `totalTokens` 與壓縮後的上下文保持一致。(#14979) 感謝 @shtse8。
- 勾子/外掛程式：將 9 個先前未串接的外掛程式生命週期勾子連結至核心執行路徑（包含工作階段、壓縮、閘道器與傳出訊息勾子）。(#14882) 感謝 @shtse8。
- 勾子/工具：從兩條工具執行路徑發送 `before_tool_call` 與 `after_tool_call` 勾子，並修復變更衝突。(#15012) 感謝 @Patrick-Barletta, @Takhoffman。
- Discord：允許 channel-edit 封存/鎖定執行緒並設定自動封存時長。(#5542) 感謝 @stumct。
- Discord 測試：在斜線指令測試覆蓋中使用部分 @buape/carbon 模擬。(#13262) 感謝 @arosstale。
- 測試：更新 Slack 訊息收集測試中的執行緒 ID 處理。(#14108) 感謝 @swizzmagik。
- 更新/守護程序：透過從雜湊後的守護程序套件產生具備別名感知導出的 `dist/cli/daemon-cli.js`，修復更新後的重啟相容性，防止 `openclaw update` 期間出現 `registerDaemonCli` 匯入失敗。

## 2026.2.9

### 新增 (Added)

- 指令：新增 `commands.allowFrom` 組態用於獨立的指令授權，允許操作者將斜線指令限制給特定使用者，同時保持對話開放給他人。(#12430) 感謝 @thewilloftheshadow。
- Docker：為 Docker 工作流新增 ClawDock Shell 輔助程式。(#12817) 感謝 @Olshansk。
- iOS：Alpha 版節點 App + 設定碼引導。(#11756) 感謝 @mbelinky。
- 頻道：全面的 BlueBubbles 與頻道清理。(#11093) 感謝 @tyler6204。
- 頻道：IRC 一等公民頻道支援。(#11482) 感謝 @vignesh07.
- 外掛程式：裝置配對 + 手機控制外掛程式（Telegram `/pair`, iOS/Android 節點控制）。(#11755) 感謝 @mbelinky。
- 工具：新增 Grok (xAI) 作為 `web_search` 提供者。(#12419) 感謝 @tmchow。
- 閘道器：為 Web UI 新增代理人管理 RPC 方法 (`agents.create`, `agents.update`, `agents.delete`)。(#11045) 感謝 @advaitpaliwal。
- 閘道器：向 WS 客戶端串流推理事件，並廣播與詳細程度層級無關的工具事件。(#10568) 感謝 @nk1tz。
- Web UI：在對談歷史中顯示壓縮 (Compaction) 分隔線。(#11341) 感謝 @Takhoffman。
- 代理人：在代理人信封中包含執行時期 Shell。(#1835) 感謝 @Takhoffman。
- 代理人：當 ZAI 為主要提供者時，自動選擇 `zai/glm-4.6v` 進行圖片理解。(#10267) 感謝 @liuy。
- 路徑：新增 `OPENCLAW_HOME` 用於覆寫內部路徑解析使用的家目錄。(#12091) 感謝 @sebslight。
- 引導設定：為 OpenAI 與 Anthropic 相容端點新增自訂提供者流程。(#11106) 感謝 @MackDing。
- 勾子：將 Webhook 代理人執行路由至特定的 `agentId`，新增 `hooks.allowedAgentIds` 控制，並在提供未知 ID 時回退至預設代理人。(#13672) 感謝 @BillChirico。

### 修復 (Fixes)

- 排程 (Cron)：防止單次執行的 `at` 任務在先前跳過或出錯時於閘道器重啟後再次觸發。(#13845)
- Discord：新增執行核准清理選項，在核准/拒絕/逾時後刪除私訊。(#13205) 感謝 @thewilloftheshadow。
- 工作階段：裁剪陳舊項目、限制儲存大小、輪替大型儲存、接受時長/大小閾值、預設僅警告式維護，並在保留期後裁剪 Cron 執行工作階段。(#13083) 感謝 @skyfallsin, @Glucksberg, @gumadeiras。
- CI：實作管線與工作流順序。感謝 @quotentiroler。
- WhatsApp：保留傳入文件的原始檔名。(#12691) 感謝 @akramcodez。
- Telegram：強化引用解析；保留引用上下文；避免 QUOTE_TEXT_INVALID；避免巢狀回覆引用的誤判。(#12156) 感謝 @rybnikov。
- Telegram：當使用陳舊的主題執行緒 ID 時，透過不帶 `message_thread_id` 重試來恢復主動發送。(#11620)
- Discord：在發送時自動建立論壇/媒體執行緒貼文，具備分塊後續回覆與論壇發送的媒體處理。(#12380) 感謝 @magendary, @thewilloftheshadow。
- Discord：限制閘道器重新連線嘗試次數以避免無限重試迴圈。(#12230) 感謝 @Yida-Dev。
- Telegram：使用 `<tg-spoiler>` HTML 標籤渲染 Markdown 劇透內容。(#11543) 感謝 @ezhikkk。
- Telegram：將指令註冊限制在 100 個項目內，以避免啟動時出現 `BOT_COMMANDS_TOO_MUCH` 錯誤。(#12356) 感謝 @arosstale。
- Telegram：將私訊 `allowFrom` 與傳送者使用者 ID 進行比對（回退至對話 ID）並釐清配對記錄。(#12779) 感謝 @liuxiaopai-ai。
- 配對/Telegram：在核准指令中包含實際配對碼，透過共享的配對訊息產生器路由 Telegram 配對回覆，並增加回歸測試以防止 `<code>` 佔位符偏移。
- 引導設定：快速開始 (QuickStart) 現在會自動安裝 Shell 補全（手動模式僅作提示）。
- 引導設定/提供者：新增 LiteLLM 提供者引導，保留自訂 LiteLLM 代理基礎 URL，同時強制執行 API-key 驗證模式。(#12823) 感謝 @ryan-crabbe。
- Docker：使 `docker-setup.sh` 相容於 macOS Bash 3.2 與空白的額外掛載。(#9441) 感謝 @mateusz-michalik。
- 驗證 (Auth)：在儲存/解析憑證前從貼上的 API 密鑰與權杖中剝離內嵌的換行符。
- 代理人：從訊息工具與串流輸出中剝離推理標籤與降級工具標記，以防止資訊洩漏。(#11053, #13453) 感謝 @liebertar, @meaadore1221-afk, @gumadeiras。
- 瀏覽器：防止卡住的 `act:evaluate` 癱瘓瀏覽器工具，並使取消操作能立即停止等待。(#13498) 感謝 @onutc。
- 安全性/閘道器：預設拒絕遺失的連線 `scopes`（無隱含的 `operator.admin`）。
- Web UI：使對談重新整理能平滑捲動至最新訊息，並在手動重新整理時抑制新訊息徽章閃爍。
- Web UI：在 `config.set` 與 `config.apply` 前將表單編輯器的值強制轉換為 Schema 型別，防止數字與布林欄位被序列化為字串。(#13468) 感謝 @mcaxtr。
- 工具/網頁搜尋：在網頁搜尋快取鍵值中包含提供者專屬設定，並為 Grok 傳遞 `inlineCitations`。(#12419) 感謝 @tmchow。
- 工具/網頁搜尋：修復 xAI Responses API 輸出區塊的 Grok 回應解析。(#13049) 感謝 @ereid7。
- 工具/網頁搜尋：規範化直接連接的 Perplexity 模型 ID，同時保持 OpenRouter 模型 ID 不變。(#12795) 感謝 @cdorsey。
- 模型容錯移轉：將 HTTP 400 錯誤視為符合容錯移轉資格，啟用自動模型回退。(#1879) 感謝 @orenyomtov。
- 錯誤處理：當對話提到「上下文溢出 (context overflow)」主題時，防止誤判。(#2078) 感謝 @sbking。
- 錯誤處理：透過將 `sanitizeUserFacingText` 的改寫範圍限制在錯誤上下文中，避免改寫/吞掉提到錯誤關鍵字的正常助理回覆。(#12988) 感謝 @Takhoffman。
- 組態：在執行時期組態載入期間重新載入狀態目錄的 `.env`，使 `${VAR}` 替換維持可用。(#12748) 感謝 @rodrigouroz。
- 閘道器：不再有壓縮後失憶症；注入的逐字稿寫入現在會保留 Pi 工作階段的 `parentId` 鏈，以便代理人重新記憶。(#12283) 感謝 @Takhoffman。
- 閘道器：修復多代理人工作階段用量探索。(#11523) 感謝 @Takhoffman。
- 代理人：從過大工具結果導致的上下文溢出中恢復（預先限制上限 + 回退截斷）。(#11579) 感謝 @tyler6204。
- 子代理人/壓縮：穩定宣告時機，並在重試中保留壓縮指標。(#11664) 感謝 @tyler6204。
- 子代理人：在父工作階段宣告中，將因逾時中止的執行回報為已逾時，而非成功完成。(#13996) 感謝 @dario-github。
- 排程 (Cron)：共享隔離宣告流程，並強化排程/傳送可靠性。(#11641) 感謝 @tyler6204。
- 排程工具：當 LLM 在新增請求中省略 `job` 封裝時，恢復扁平參數。(#12124) 感謝 @tyler6204。
- 閘道器/CLI：當 `gateway.bind=lan` 時，針對探針 URL 與控制介面連結使用區域網路 IP。(#11448) 感謝 @AnonO6。
- CLI：透過提升原始根目錄並縮短內建/全域/工作區外掛程式路徑，使 `openclaw plugins list` 輸出更易閱讀。
- 勾子：修復自 2026.2.2 (tsdown 遷移) 以來損壞的內建勾子。(#9295) 感謝 @patrickshao。
- 安全性/外掛程式：使用 `--ignore-scripts` 安裝外掛程式與勾子依賴，以防止生命週期腳本執行。
- 路由：透過在路由解析時載入組態，針對每則訊息重新整理繫結，使繫結變更無需重啟即可生效。(#11372) 感謝 @juanpablodlc。
- 執行核准：以等寬字型渲染轉發的指令，以便更安全地進行核准審核。(#11937) 感謝 @sebslight。
- 組態：將 `maxTokens` 限制在 `contextWindow` 以內，防止無效的模型組態。(#5516) 感謝 @lailoo。
- 推理：為 `github-copilot/gpt-5.2-codex` 與 `github-copilot/gpt-5.2` 允許 xhigh 模式。(#11646) 感謝 @LatencyTDH。
- 推理：對具備推理能力的模型遵循 `/think off` 指令。(#9564) 感謝 @liuy。
- Discord：支援論壇/媒體執行緒建立的起始訊息，串接 `message thread create --message`，並強化路由。(#10062) 感謝 @jarvis89757。
- 路徑：結構化解析衍生自 `OPENCLAW_HOME` 的家目錄路徑，並修復工具詮釋資料縮寫中的 Windows 磁碟機代號處理。(#12125) 感謝 @mcaxtr。
- 記憶：設定 Voyage 嵌入模型的 `input_type` 以提升檢索效果。(#10818) 感謝 @mcinteerj。
- 記憶：針對記憶索引預設停用非同步批次嵌入（需透過 `agents.defaults.memorySearch.remote.batch.enabled` 啟用）。(#13069) 感謝 @mcinteerj。
- 記憶/QMD：在代理人間重複使用預設模型快取，而非為每個代理人重複下載。(#12114) 感謝 @tyler6204。
- 記憶/QMD：預設在背景執行啟動刷新，新增可配置的 QMD 維護逾時，在回退失敗後重試 QMD，並將 QMD 查詢範圍限制在 OpenClaw 管理的集合中。(#9690, #9705, #10042) 感謝 @vignesh07。
- 記憶/QMD：在閘道器啟動時初始化 QMD 後端，使背景更新定時器在程序重新載入後能重啟。(#10797) 感謝 @vignesh07。
- 組態/記憶：自動將舊有的頂層 `memorySearch` 設定遷移至 `agents.defaults.memorySearch`。(#11278, #9143) 感謝 @vignesh07。
- 記憶/QMD：將 QMD 的純文字 `No results found` 輸出視為空結果，而非拋出無效 JSON 錯誤。(#9824)
- 記憶/QMD：新增 `memory.qmd.searchMode` 用於選擇 `query`, `search` 或 `vsearch` 檢索模式。(#9967, #10084)
- 媒體理解：辨識 `.caf` 音訊附件進行轉錄。(#10982) 感謝 @succ985。
- 狀態目錄：針對預設裝置身分與畫布儲存路徑遵循 `OPENCLAW_STATE_DIR`。(#4824) 感謝 @kossoy。

## 2026.2.6

### 變更 (Changes)

- 排程 (Cron)：新任務的預設 `wakeMode` 現在是 `"now"`（原為 `"next-heartbeat"`）。(#10776) 感謝 @tyler6204。
- 排程 (Cron)：`cron run` 預設為強制執行；使用 `--due` 限制為僅執行到期任務。(#10776) 感謝 @tyler6204。
- 模型：支援 Anthropic Opus 4.6 與 OpenAI Codex gpt-5.3-codex（向前相容回退）。(#9853, #10720, #9995) 感謝 @TinyTb, @calvin-hpnet, @tyler6204。
- 提供者：新增 xAI (Grok) 支援。(#9885) 感謝 @grp06。
- 提供者：新增百度千帆 (Baidu Qianfan) 支援。(#8868) 感謝 @ide-rea。
- Web UI：新增 Token 使用量儀表板。(#10072) 感謝 @Takhoffman。
- 記憶：原生 Voyage AI 支援。(#7078) 感謝 @mcinteerj。
- 工作階段：限制 `sessions_history` 酬載大小以減少上下文溢出。(#10000) 感謝 @gut-puncture。
- CLI：在幫助輸出中按字母順序排列指令。(#8068) 感謝 @deepsoumya617。
- CI：優化管線吞吐量（macOS 合併、Windows 效能、工作流並行）。(#10784) 感謝 @mcaxtr。
- 代理人：升級 pi-mono 至 0.52.7；為 Opus 4.6 模型 ID 新增內嵌向前相容回退。

### 新增 (Added)

- 排程 (Cron)：執行歷史可從儀表板深層連結至對談聊天。(#10776) 感謝 @tyler6204。
- 排程 (Cron)：執行日誌中包含單次執行的工作階段金鑰，並為 Cron 工作階段提供預設標籤。(#10776) 感謝 @tyler6204。
- 排程 (Cron)：Schema 中支援舊有的酬載欄位 (`deliver`, `channel`, `to`, `bestEffortDeliver`)。(#10776) 感謝 @tyler6204。

### 修復 (Fixes)

- 排程 (Cron)：排程器可靠性（定時器偏移、重啟追趕、鎖競爭、陳舊執行標記）。(#10776) 感謝 @tyler6204。
- 排程 (Cron)：強化存儲遷移（舊欄位遷移、解析錯誤處理、明確傳送模式持久化）。(#10776) 感謝 @tyler6204。
- 記憶：設定 Voyage 嵌入模型的 `input_type` 以提升檢索效果。(#10818) 感謝 @mcinteerj。
- 記憶/QMD：預設在背景執行啟動刷新，新增可配置的 QMD 維護逾時，在回退失敗後重試 QMD，並將 QMD 查詢範圍限制在 OpenClaw 管理的集合中。(#9690, #9705, #10042) 感謝 @vignesh07。
- 媒體理解：辨識 `.caf` 音訊附件進行轉錄。(#10982) 感謝 @succ985。
- Telegram：在訊息工具與子代理人宣告中自動注入私訊主題執行緒 ID。(#7235) 感謝 @Lukavyi。
- 安全性：閘道器畫布主機與 A2UI 資產要求驗證。(#9518) 感謝 @coygeek。
- 排程 (Cron)：修復排程與提醒傳送的回歸問題；強化下次執行重新計算 + 定時器重設 + 舊排程欄位。(#9733, #9823, #9948, #9932) 感謝 @tyler6204, @pycckuu, @j2h4u, @fujiwara-tofu-shop。
- 更新：強化更新流程中的控制介面資產處理。(#10146) 感謝 @gumadeiras。
- 安全性：新增技能/外掛程式代碼安全性掃描；從 `config.get` 閘道器回應中遮蔽憑證。(#9806, #9858) 感謝 @abdelsfane。
- 執行核准：將純字串允許清單項制轉換為物件。(#9903) 感謝 @mcaxtr。
- Slack：為 `/new` 與 `/reset` 新增提及剝離模式。(#9971) 感謝 @ironbyte-rgb。
- Chrome 擴充功能：修復內建路徑解析。(#8914) 感謝 @kelvinCB。
- 壓縮/錯誤：允許在上下文溢出時進行多次壓縮重試；顯示清晰的帳單錯誤。(#8928, #8391) 感謝 @Glucksberg。

## 2026.2.3

### 變更 (Changes)

- Telegram：從 `bot-handlers.ts` 移除最後的 `@ts-nocheck`，直接使用 Grammy 型別，去重疊 `StickerMetadata`。`src/telegram/` 中已無 `@ts-nocheck`。(#9206)
- Telegram：從 `bot-message.ts` 移除 `@ts-nocheck`，透過 `Omit<BuildTelegramMessageContextParams>` 定義依賴型別，將 `allMedia` 擴展為 `TelegramMediaRef[]`。(#9180)
- Telegram：從 `bot.ts` 移除 `@ts-nocheck`，修復重複的 `bot.catch` 錯誤處理器，移除無用的回應 `message_thread_id` 路由，強化貼圖快取防護。(#9077)
- 引導設定：新增 Cloudflare AI Gateway 提供者設定與文件。(#7914) 感謝 @roerohan。
- 引導設定：新增 Moonshot (.cn) 驗證選項，在保留預設值時維持中國基礎 URL。(#7180) 感謝 @waynelwz。
- 說明文件：透過分開文字與 Enter，釐清針對 TUI 的 tmux `send-keys` 指法。(#7737) 感謝 @Wangnov。
- 說明文件：將首頁翻新內容同步至 zh-CN（功能、快速開始、文件目錄、網路模型、致謝）。(#8994) 感謝 @joshp123。
- 訊息：跨頻道新增每個頻道與每個帳號的 `responsePrefix` 覆寫。(#9001) 感謝 @mudrii。
- 排程 (Cron)：為隔離任務新增宣告傳送模式（CLI + 控制介面）與傳送模式組態。
- 排程 (Cron)：隔離任務預設為宣告傳送模式；在工具輸入中接受 ISO 8601 `schedule.at`。
- 排程 (Cron)：將隔離任務強制遷移至宣告/無傳送模式；捨棄舊有的發送至主頻道/酬載傳送欄位與 `atMs` 輸入。
- 排程 (Cron)：單次執行任務成功後預設刪除；為 CLI 新增 `--keep-after-run` 參數。
- 排程 (Cron)：在宣告傳送期間抑制訊息工具，以確保摘要發送一致。
- 排程 (Cron)：避免當隔離執行直接發送訊息時發生重複傳送。

### 修復 (Fixes)

- 心跳：針對多帳號頻道允許明確的 `accountId` 路由。(#8702) 感謝 @lsh411。
- TUI/閘道器：處理非串流的最終回應，為非本地聊天執行刷新歷史紀錄，並避免針對性工具串流的事件間隙警告。(#8432) 感謝 @gumadeiras。
- Shell 補全：自動偵測並將緩慢的動態模式遷移至快取檔案，以加快終端機啟動；為診斷/更新/引導設定新增補全健康檢查。
- Telegram：在內嵌模型選擇中遵循工作階段模型覆寫。(#8193) 感謝 @gildo。
- Web UI：修復預設/非預設代理人的模型選擇儲存，並對長工作區路徑進行換行處理。感謝 @Takhoffman。
- Web UI：當設定了 `gateway.controlUi.basePath` 時正確解析標頭標誌路徑。(#7178) 感謝 @Yeom-JinHo。
- Web UI：為新訊息指示器套用按鈕樣式。
- 引導設定：從非互動式 API 密鑰旗標推斷驗證選項。(#8484) 感謝 @f-trycua。
- 安全性：防止不信任的頻道詮釋資料進入系統提示詞 (Slack/Discord)。感謝 @KonstantinMirin。
- 安全性：強制對訊息工具附件執行沙箱化媒體路徑。(#9182) 感謝 @victormier。
- 安全性：針對閘道器 URL 覆寫要求明確憑證，以防止憑證洩漏。(#8113) 感謝 @victormier。
- 安全性：將 `whatsapp_login` 工具限制給擁有者傳送者，並預設拒絕非擁有者上下文。(#8768) 感謝 @victormier。
- 語音通話：透過主機允許清單/代理信任強化 Webhook 驗證，並保留 ngrok 環回繞過。
- 語音通話：針對具備允許清單策略的匿名傳入撥號者 ID 增加回歸測試。(#8104) 感謝 @victormier。
- 排程 (Cron)：在 CLI `--at` 解析中接受 Epoch 時間戳記與 0ms 持續時間。
- 排程 (Cron)：當存儲檔案被重新建立或修改時間變更時，重新載入存儲數據。
- 排程 (Cron)：直接傳送宣告執行，遵循傳送模式，並針對摘要遵循 `wakeMode`。(#8540) 感謝 @tyler6204。
- Telegram：在轉發訊息中包含 `forward_from_chat` 詮釋資料，並強化 Cron 傳送目標檢查。(#8392) 感謝 @Glucksberg。
- macOS：修復 Cron 酬載摘要渲染與 ISO 8601 格式化器的並行安全性。
- Discord：針對代理人元件（按鈕/選擇選單）強制執行私訊允許清單，遵循配對存儲核准與標籤匹配。(#11254) 感謝 @thedudeabidesai。

## 2026.2.2-3

### 修復 (Fixes)

- 更新：為 tsdown 前的更新匯入提供舊版 `daemon-cli` 適配，修復 npm 更新後的守護程序重啟。

## 2026.2.2-2

### 變更 (Changes)

- 說明文件：推廣 BlueBubbles 作為建議的 iMessage 整合方案；將 imsg 頻道標記為舊版。(#8415) 感謝 @tyler6204。

### 修復 (Fixes)

- CLI 狀態：從封裝後的 dist 輸出中解析建置資訊（修復 npm 建置中出現 "unknown" 提交的問題）。

## 2026.2.2-1

### 修復 (Fixes)

- CLI 狀態：回退至建置資訊進行版本偵測（修復 Beta 建置中出現 "unknown" 的問題）。感謝 @gumadeira。

## 2026.2.2

### 變更 (Changes)

- 飛書 (Feishu)：新增飛書/Lark 外掛程式支援與文件。(#7313) 感謝 @jiulingyun (openclaw-cn)。
- Web UI：新增代理人儀表板，用於管理代理人檔案、工具、技能、模型、頻道與 Cron 任務。
- 子代理人：除非要求特定的外部收件者，否則不鼓勵直接使用訊息工具。
- 記憶：為工作區記憶實作選用的 QMD 後端。(#3160) 感謝 @vignesh07.
- 安全性：新增健康檢查 (healthcheck) 技能與引導稽核指引。(#7641) 感謝 @Takhoffman。
- 組態：允許透過 `agents.defaults.subagents.thinking` 設定預設的子代理人推理等級。(#7372) 感謝 @tyler6204。
- 說明文件：zh-CN 翻譯初始化與潤飾、管線指引、導覽/首頁更新與錯字修復。(#8202, #6995, #6619, #7242, #7303, #7415)
- 說明文件：新增 zh-CN 國際化防護欄，以避免編輯產生的翻譯內容。(#8416) 感謝 @joshp123。

### 修復 (Fixes)

- 說明文件：完成 QMD 記憶文件重新命名，以引用 OpenClaw 狀態目錄。
- 引導設定：保持 TUI 流程獨佔（跳過補全提示 + 背景 Web UI 啟動）。
- TUI：在 TUI 活動期間阻擋引導設定輸出，並在退出時還原終端機狀態。
- CLI：在狀態目錄快取 Shell 補全腳本，並在設定檔中載入快取檔案。
- Zsh 補全：轉義選項說明以避免無效選項錯誤。
- 代理人：修復格式錯誤的工具呼叫與工作階段逐字稿。(#7473) 感謝 @justinhuangcode。
- 安全性：強制對 Slack 斜線指令執行存取群組門控。
- 安全性：針對技能安裝程式下載增加 SSRF 檢查（阻擋私有/localhost URL）。
- 安全性：強化 Windows 執行允許清單；阻擋透過單個 `&` 繞過 cmd.exe 的行為。感謝 @simecek。
- 語音通話：強化傳入允許清單；拒絕匿名撥號者；要求 Telnyx 公鑰；對 Twilio 媒體串流進行權杖門控。
- UI：修復控制介面資產路徑解析。
- UI：在外部編輯後刷新代理人檔案。

## 2026.2.1

### 變更 (Changes)

- 說明文件：引導設定/安裝/國際化/執行核准/控制介面/exe.dev/快取保留等更新。
- Telegram：使用共享的配對儲存庫。(#6127) 感謝 @obviyus。
- 代理人：新增 OpenRouter 應用程式歸屬標頭。感謝 @alexanderatallah。
- 代理人：新增系統提示詞安全性防護欄。(#5445) 感謝 @joshp123。
- 代理人：將 `cacheControlTtl` 重新命名為 `cacheRetention`（具備向後相容映射）。
- 閘道器：為代理人與 `chat.send` 訊息注入時間戳記。(#3705) 感謝 @conroywhitney, @CashWilliams。
- 閘道器：針對 TLS 監聽器要求最低 TLS 1.3。(#5970) 感謝 @loganaden。
- Web UI：精煉對談佈局並延長工作階段活動時間。

### 修復 (Fixes)

- 安全性：針對遠端媒體獲取增加 SSRF 保護（阻擋私有/localhost、DNS 釘選）。
- 更新：清理陳舊的全域安裝重命名目錄，並延長閘道器更新逾時。
- 外掛程式：驗證外掛程式/勾子安裝路徑，拒絕路徑遍歷名稱。
- 串流：在段落邊界刷新區塊串流，以實現換行分塊。(#7014)
- 自動回覆：避免在 `/new` 問候提示詞中引用工作區檔案。(#5706) 感謝 @bravostation。
- 工具：對齊工具執行適配器/簽名（包含參數順序與參數規範化）。
- 記憶搜尋：L2 規範化本地嵌入向量以修復語義搜尋。(#5332)
- 代理人：限制壓縮防護的上下文視窗解析上限。(#6187) 感謝 @iamEvanYT。
- 系統提示詞：修復解析覆寫與使用 `session_status` 獲取日期時間的提示。
- 飛書 (Teams)：門控媒體驗證重試。
- Docker：針對閘道器指令使用容器連接埠而非主機連接埠。(#5110) 感謝 @mise42。
- 龍蝦 (Lobster)：阻擋透過 `lobsterPath`/`cwd` 注入執行的任意指令。(#5335) 感謝 @vignesh07.
- 安全性：規範化 WhatsApp `accountId` 以防止路徑遍歷。
- 安全性：限制 `MEDIA` 路徑擷取以防止本地檔案包含 (LFI)。
- 安全性：封鎖主機執行的 `LD*/DYLD*` 環境變數覆寫。

## 2026.1.30

### 變更 (Changes)

- CLI：新增 `completion` 指令（支援 Zsh/Bash/PowerShell/Fish）並在安裝/引導設定期間自動設定。
- CLI：新增個別代理人的 `models status`（支援 `--agent` 過濾）。(#4780)
- 代理人：在合成模型型錄中新增 Kimi K2.5。(#4407)
- 驗證：將 Kimi Coding 切換為內建提供者；規範化 OAuth 設定檔電子郵件。
- 驗證：新增 MiniMax OAuth 外掛程式與引導設定選項。(#4521)
- 說明文件：新增 pi/pi-dev 文件並更新 OpenClaw 品牌與安裝連結。

### 修復 (Fixes)

- 安全性：限制媒體解析器中的本地路徑擷取以防止 LFI。(#4880)
- 閘道器：防止權杖預設值變成字面上的 "undefined"。(#4873)
- 控制介面：修復 npm 全域安裝的資產解析。(#4909)
- Telegram：修復重疊樣式/連結的 HTML 巢狀處理。(#4578)
- Telegram：在回應動作中接受數字格式的 `messageId`/`chatId`。(#4533)
- Telegram：將技能指令限制在每個機器人綁定的代理人範圍內。(#4360)
- 路由：在子代理人宣告傳送時，優先使用 `requesterOrigin` 而非陳舊的工作階段項目。(#4957)

## 2026.1.29

### 變更 (Changes)

- 品牌重塑：將 npm 套件/CLI 重新命名為 `openclaw`，新增 `openclaw` 相容性適配，並將擴充功能移至 `@openclaw/*` 範圍。
- 引導設定：強化 Beta 版的安全性警告文字與存取控制預期。
- 組態：自動遷移舊有的狀態/組態路徑，並在不同舊檔名間保持組態解析的一致性。
- 閘道器：針對透過查詢參數傳遞勾子權杖發出警告；文件化標頭驗證偏好。
- 診斷 (Doctor)：針對無驗證的閘道器公開發出警告。(#2016)
- Web UI：使子代理人的宣告回覆在 WebChat 中可見。(#1977)
- 瀏覽器：透過閘道器/節點路由瀏覽器控制；移除獨立的瀏覽器控制指令與控制 URL 組態。
