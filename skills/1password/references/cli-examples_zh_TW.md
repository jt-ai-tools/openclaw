# op CLI 指令範例

## 登入 (Sign in)

- `op signin`
- `op signin --account <簡寫|登入地址|帳號ID|使用者ID>`

## 讀取 (Read)

- `op read op://app-prod/db/password`
- `op read "op://app-prod/db/one-time password?attribute=otp"`
- `op read "op://app-prod/ssh key/private key?ssh-format=openssh"`
- `op read --out-file ./key.pem op://app-prod/server/ssh/key.pem`

## 執行 (Run)

- `export DB_PASSWORD="op://app-prod/db/password"`
- `op run --no-masking -- printenv DB_PASSWORD`
- `op run --env-file="./.env" -- printenv DB_PASSWORD`

## 注入 (Inject)

- `echo "db_password: {{ op://app-prod/db/password }}" | op inject`
- `op inject -i config.yml.tpl -o config.yml`

## 身分與帳號 (Whoami / accounts)

- `op whoami`
- `op account list`
