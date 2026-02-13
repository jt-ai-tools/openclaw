# OpenClaw 繁體中文翻譯進度 (zh_TW)

> 翻譯準則：使用台灣技術術語，保留所有 Markdown 格式與指令，檔名後置 `_zh_TW.md`。

## 待辦清單 (Checklist)

### 核心文件 (Root)
- [x] README.md
- [x] CONTRIBUTING.md
- [ ] CHANGELOG.md
- [x] SECURITY.md
- [x] AGENTS.md
- [ ] LICENSE (不翻譯)

### 說明文件 (Docs - /docs)
- [x] docs/index.md
- [x] docs/onboarding.md (in /docs/start)
- [x] docs/start/getting-started.md
- [x] docs/start/onboarding.md
- [x] docs/concepts/agent.md
- [x] docs/concepts/architecture.md
- [x] docs/gateway/index.md
- [x] docs/gateway/configuration.md
- [x] docs/gateway/troubleshooting.md
- [x] docs/gateway/configuration-reference.md
- [x] docs/gateway/configuration-examples.md
- [x] docs/gateway/sandboxing.md
- [x] docs/gateway/security/index.md
- [x] docs/gateway/pairing.md
- [x] docs/gateway/protocol.md
- [x] docs/gateway/remote.md
- [x] docs/gateway/tailscale.md
- [x] docs/gateway/doctor.md
- [x] docs/gateway/heartbeat.md
- [x] docs/gateway/health.md
- [x] docs/gateway/gateway-lock.md
- [x] docs/gateway/background-process.md
- [x] docs/gateway/authentication.md
- [x] docs/gateway/bonjour.md
- [x] docs/gateway/bridge-protocol.md
- [x] docs/gateway/cli-backends.md
- [x] docs/gateway/discovery.md
- [x] docs/gateway/local-models.md
- [x] docs/gateway/logging.md
- [x] docs/gateway/multiple-gateways.md
- [x] docs/gateway/network-model.md
- [x] docs/gateway/openai-http-api.md
- [x] docs/gateway/openresponses-http-api.md
- [x] docs/gateway/remote-gateway-readme.md
- [x] docs/gateway/sandbox-vs-tool-policy-vs-elevated.md
- [x] docs/gateway/tools-invoke-http-api.md
- [x] docs/security/formal-verification.md
- [x] docs/security/THREAT-MODEL-ATLAS.md
- [x] docs/security/CONTRIBUTING-THREAT-MODEL.md

### 頻道文件 (Channels - /docs/channels)
- [x] docs/channels/index.md
- [x] docs/channels/whatsapp.md
- [x] docs/channels/telegram.md
- [x] docs/channels/discord.md
- [x] docs/channels/slack.md
- [x] docs/channels/signal.md
- [x] docs/channels/imessage.md
- [x] docs/channels/googlechat.md
- [x] docs/channels/pairing.md
- [x] docs/channels/groups.md
- [x] docs/channels/troubleshooting.md
- [ ] docs/automation/cron-jobs.md

### 自動化文件 (Automation - /docs/automation)
- [x] docs/automation/cron-jobs.md
- [x] docs/automation/webhook.md
- [x] docs/automation/gmail-pubsub.md
- [x] docs/automation/hooks.md
- [x] docs/automation/poll.md
- [x] docs/automation/auth-monitoring.md

### 其它核心概念 (Concepts - /docs/concepts)
- [x] docs/concepts/agent-loop.md
- [x] docs/concepts/agent-workspace.md
- [x] docs/concepts/compaction.md
- [x] docs/concepts/context.md
- [x] docs/concepts/features.md
- [x] docs/concepts/messages.md
- [x] docs/concepts/models.md
- [x] docs/concepts/model-failover.md
- [x] docs/concepts/multi-agent.md
- [x] docs/concepts/presence.md
- [x] docs/concepts/queue.md
- [x] docs/concepts/retry.md
- [x] docs/concepts/session.md
- [x] docs/concepts/sessions.md
- [x] docs/concepts/session-tool.md
- [x] docs/concepts/streaming.md
- [x] docs/concepts/system-prompt.md
- [ ] docs/concepts/typebox.md
- [ ] docs/concepts/typing-indicators.md
- [ ] docs/concepts/usage-tracking.md

## 執行紀錄 (Execution Log)
- 2026-02-13: 初始化 PROGRESS.md。
- 2026-02-13: 完成 Root 核心文件翻譯。
- 2026-02-13: 完成 docs/gateway/ 全目錄翻譯 (30+ 文件)。
- 2026-02-13: 完成部分 docs/start/ 與 docs/concepts/ 翻譯。
- 2026-02-13: 完成 docs/security/ 全目錄翻譯。
- 2026-02-13: 完成 docs/channels/index.md 翻譯。
- 2026-02-13: 完成 docs/channels/whatsapp.md 翻譯為 docs/channels/whatsapp_zh_TW.md。
- 2026-02-13: 完成 docs/channels/telegram.md 翻譯為 docs/channels/telegram_zh_TW.md。
- 2026-02-13: 完成 docs/channels/discord.md 翻譯為 docs/channels/discord_zh_TW.md。
- 2026-02-13: 完成 docs/channels/slack.md 翻譯為 docs/channels/slack_zh_TW.md。
- 2026-02-13: 完成 docs/channels/signal.md 翻譯為 docs/channels/signal_zh_TW.md。
- 2026-02-13: 完成 docs/channels/imessage.md 翻譯為 docs/channels/imessage_zh_TW.md。
- 2026-02-13: 完成 docs/channels/googlechat.md 翻譯為 docs/channels/googlechat_zh_TW.md。
- 2026-02-13: 完成 docs/channels/pairing.md 翻譯為 docs/channels/pairing_zh_TW.md。
- 2026-02-13: 完成 docs/channels/groups.md 翻譯為 docs/channels/groups_zh_TW.md。
- 2026-02-13: 完成 docs/channels/troubleshooting.md 翻譯為 docs/channels/troubleshooting_zh_TW.md。
- 2026-02-13: 完成 docs/automation/cron-jobs.md 翻譯為 docs/automation/cron-jobs_zh_TW.md。
- 2026-02-13: 完成 docs/automation/webhook.md 翻譯為 docs/automation/webhook_zh_TW.md。
- 2026-02-13: 完成 docs/automation/gmail-pubsub.md 翻譯為 docs/automation/gmail-pubsub_zh_TW.md。
- 2026-02-13: 完成 docs/automation/poll.md 翻譯為 docs/automation/poll_zh_TW.md。
- 2026-02-13: 完成 docs/automation/hooks.md 翻譯為 docs/automation/hooks_zh_TW.md。
- 2026-02-13: 完成 docs/automation/auth-monitoring.md 翻譯為 docs/automation/auth-monitoring_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/agent-loop.md 翻譯為 docs/concepts/agent-loop_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/agent-workspace.md 翻譯為 docs/concepts/agent-workspace_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/presence.md 翻譯為 docs/concepts/presence_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/session.md 翻譯為 docs/concepts/session_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/sessions.md 翻譯為 docs/concepts/sessions_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/session-tool.md 翻譯為 docs/concepts/session-tool_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/streaming.md 翻譯為 docs/concepts/streaming_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/system-prompt.md 翻譯為 docs/concepts/system-prompt_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/queue.md 翻譯為 docs/concepts/queue_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/retry.md 翻譯為 docs/concepts/retry_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/compaction.md 翻譯為 docs/concepts/compaction_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/features.md 翻譯為 docs/concepts/features_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/messages.md 翻譯為 docs/concepts/messages_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/models.md 翻譯為 docs/concepts/models_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/model-failover.md 翻譯為 docs/concepts/model-failover_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/multi-agent.md 翻譯為 docs/concepts/multi-agent_zh_TW.md。
- 2026-02-13: 完成 docs/concepts/context.md 翻譯為 docs/concepts/context_zh_TW.md。
