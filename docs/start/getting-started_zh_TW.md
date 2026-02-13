---
summary: "在幾分鐘內安裝 OpenClaw 並發送您的第一條聊天訊息。"
read_when:
  - 從零開始進行首次設定
  - 您希望以最快路徑建立可運作的聊天環境
title: "新手入門"
---

> 此文件為 [English Version](/start/getting-started) 的繁體中文版本。

# 新手入門

目標：以最少的設定，從零開始建立第一個可運作的聊天環境。

<Info>
最速聊天方式：開啟控制 UI (無需設定頻道)。執行 `openclaw dashboard` 並在瀏覽器中聊天，或在 <Tooltip headline="閘道器主機" tip="執行 OpenClaw 閘道器服務的機器。">閘道器主機</Tooltip> 上開啟 `http://127.0.0.1:18789/`。
相關文件：[儀表板](/web/dashboard_zh_TW) 與 [控制 UI](/web/control-ui_zh_TW)。
</Info>

## 前置要求

- Node 22 或更高版本

<Tip>
如果您不確定，請使用 `node --version` 檢查您的 Node 版本。
</Tip>

## 快速設定 (CLI)

<Steps>
  <Step title="安裝 OpenClaw (建議方式)">
    <Tabs>
      <Tab title="macOS/Linux">
        ```bash
        curl -fsSL https://openclaw.ai/install.sh | bash
        ```
        <img
  src="/assets/install-script.svg"
  alt="安裝指令流程"
  className="rounded-lg"
/>
      </Tab>
      <Tab title="Windows (PowerShell)">
        ```powershell
        iwr -useb https://openclaw.ai/install.ps1 | iex
        ```
      </Tab>
    </Tabs>

    <Note>
    其他安裝方式與要求：[安裝](/install_zh_TW)。
    </Note>

  </Step>
  <Step title="執行引導精靈">
    ```bash
    openclaw onboard --install-daemon
    ```

    精靈會協助您設定驗證、閘道器選項以及選用頻道。
    詳情請參閱 [引導精靈](/start/wizard_zh_TW)。

  </Step>
  <Step title="檢查閘道器狀態">
    如果您已安裝該服務，它應該已經在執行中：

    ```bash
    openclaw gateway status
    ```

  </Step>
  <Step title="開啟控制 UI">
    ```bash
    openclaw dashboard
    ```
  </Step>
</Steps>

<Check>
如果控制 UI 成功載入，代表您的閘道器已準備就緒。
</Check>

## 選用檢查與額外操作

<AccordionGroup>
  <Accordion title="在前台執行閘道器">
    適用於快速測試或故障排除。

    ```bash
    openclaw gateway --port 18789
    ```

  </Accordion>
  <Accordion title="傳送測試訊息">
    需要先設定好頻道。

    ```bash
    openclaw message send --target +15555550123 --message "Hello from OpenClaw"
    ```

  </Accordion>
</AccordionGroup>

## 常用的環境變數

如果您以服務帳號 (service account) 執行 OpenClaw，或想要自訂組態/狀態檔案的位置：

- `OPENCLAW_HOME` 設定內部路徑解析使用的家目錄。
- `OPENCLAW_STATE_DIR` 覆寫狀態目錄。
- `OPENCLAW_CONFIG_PATH` 覆寫組態檔案路徑。

完整的環境變數參考：[環境變數](/help/environment_zh_TW)。

## 深入了解

<Columns>
  <Card title="引導精靈 (詳細資訊)" href="/start/wizard_zh_TW">
    完整的 CLI 精靈參考與進階選項。
  </Card>
  <Card title="macOS App 引導設定" href="/start/onboarding_zh_TW">
    macOS 應用程式的首次執行流程。
  </Card>
</Columns>

## 完成後您將擁有

- 一個執行中的閘道器
- 已完成驗證設定
- 控制 UI 存取權限或已連線的頻道

## 後續步驟

- 私訊安全與核准：[配對](/channels/pairing_zh_TW)
- 連線更多頻道：[頻道](/channels_zh_TW)
- 進階工作流與從原始碼建置：[設定](/start/setup_zh_TW)
