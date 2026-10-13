# 1Password CLI 入門摘要 (get-started)

- 支援 macOS, Windows 與 Linux。
  - macOS/Linux Shell：bash, zsh, sh, fish。
  - Windows Shell：PowerShell。
- 需要 1Password 訂閱，且需安裝桌面 App 才能使用 App 整合功能。
- macOS 要求：Big Sur 11.0.0 或更高版本。
- Linux App 整合要求：需要 PolKit 與驗證代理 (Auth agent)。
- 請依照您的作業系統官方文件安裝 CLI。
- 在 1Password App 中啟用桌面 App 整合：
  - 開啟並解鎖 App，然後選擇您的帳號/集合。
  - **macOS**：「設定」>「開發者」>「與 1Password CLI 整合」（可選用 Touch ID）。
  - **Windows**：開啟 Windows Hello，然後進入「設定」>「開發者」>「與 1Password CLI 整合」。
  - **Linux**：「設定」>「安全性」>「使用系統身分驗證解鎖」，然後進入「設定」>「開發者」>「與 1Password CLI 整合」。
- 完成整合後，執行任何指令即可登入（官方範例：`op vault list`）。
- 若有多個帳號：使用 `op signin` 挑選，或使用 `--account` / `OP_ACCOUNT` 參數。
- 針對不使用整合功能的驗證方式，請使用 `op account add`。
