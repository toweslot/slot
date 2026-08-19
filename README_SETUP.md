# Setup Full PHP (Tower Slot)

## 1) Pre-requisitos
- PHP 8.1+
- Extensoes: `pdo_sqlite`, `pdo_mysql`, `curl`, `json`

## 2) Configuracao
1. Copie `.env.example` para `.env`
2. Ajuste `APP_URL` (ex: `https://jogosmania.site`)
3. Defina o banco:
   - SQLite: `DB_DRIVER=sqlite` e `DB_PATH=api/storage/database.sqlite`
   - MySQL: `DB_DRIVER=mysql` + `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
4. Defina gateway em `PAYMENT_PROVIDER`:
   - `mock` (teste local)
   - `mercadopago`
   - `ecompag`
   - `sigilopay`

## 3) Banco e seed
- SQLite: rode `php api/migrate.php`
- MySQL: importe `database.sql` no phpMyAdmin (ou SQL) e pronto

Admin padrao (quando criado pelo migrate):
- telefone: `11999999999`
- senha: `admin123`

Voce pode definir antes no ambiente:
- `ADMIN_TELEFONE`
- `ADMIN_SENHA`

## 4) Rodar local
```bash
php -S 127.0.0.1:8080 router.php
```

## 5) URLs
- Frontend: `http://127.0.0.1:8080`
- Admin: `http://127.0.0.1:8080/admin`
- API: `http://127.0.0.1:8080/api`

## 6) Dificuldade e payout via admin
No admin voce controla:
- dificuldade global
- risco global (`killer_chance_global`)
- payout por plataforma:
  - `fixed` + valor fixo (ex: `0.05`)
  - `proporcional` + taxa
- modo influencer global (on/off)
- usuario influencer individual (on/off)

## 7) Gateways
### Mock
Aprova deposito automaticamente em ~15s no polling.

### Mercado Pago
Preencha:
- `MP_ACCESS_TOKEN`
- `APP_URL`

### Ecompag
Preencha:
- `ECOMPAG_BASE_URL`
- `ECOMPAG_CLIENT_ID`
- `ECOMPAG_CLIENT_SECRET`
- `ECOMPAG_WEBHOOK_SECRET`

Webhook para configurar no painel Ecompag:
- `https://SEU-DOMINIO/api/webhook/ecompag`

Observacao:
- `ECOMPAG_API_KEY` continua suportado apenas para modo legado.

> O provider Ecompag ja esta estruturado; ajuste campos/endpoints conforme o contrato oficial.

### SigiloPay
Preencha:
- `SIGILOPAY_BASE_URL` (padrao: `https://app.sigilopay.com.br/api/v1`)
- `SIGILOPAY_PUBLIC_KEY`
- `SIGILOPAY_SECRET_KEY`
- `SIGILOPAY_WEBHOOK_SECRET` (opcional, recomendado)

Webhook para configurar no painel SigiloPay:
- `https://SEU-DOMINIO/api/webhook/sigilopay`

Observacoes importantes:
- Use sempre um `callbackUrl` fixo (o sistema ja faz isso por padrao).
- O provider aceita override dos paths:
  - `SIGILOPAY_CREATE_PIX_PATH` (padrao `/gateway/pix/receive`)
  - `SIGILOPAY_STATUS_PATH` (padrao `/gateway/transactions?id={id}`)
- Ajuste os paths acima com base no botao "Integrar com IA" da rota exata da sua conta/documentacao.
