# OpenProse (外掛程式)

新增 OpenProse 技能包 (Skill pack) 與 `/prose` 斜線指令。

## 啟用

內建外掛程式預設為停用。啟用此功能：

```json
{
  "plugins": {
    "entries": {
      "open-prose": { "enabled": true }
    }
  }
}
```

啟用後請重啟閘道器 (Gateway)。

## 功能特色

- `/prose` 斜線指令（使用者可呼叫的技能）
- OpenProse VM 語義（`.prose` 程式 + 多代理人編排）
- 遙測 (Telemetry) 支援（盡力而為，遵循 OpenProse 規範）
