# Деплой на Beget (черновик)

Пока без прод-доступов — зафиксирована **целевая** схема под типичный Beget + Node.

## Варианты

1. **VPS Beget** (маркетплейс Node.js + Nginx + PM2) — удобнее для API, webhooks и PostgreSQL.
2. **Виртуальный хостинг** — Node в Docker ([инструкция Beget](https://beget.com/ru/kb/how-to/web-apps/node-js)); статика фронта может жить отдельно.

Для **ЮKassa** и **R-Keeper callback** нужен публичный HTTPS URL на API (`/api/webhooks/yookassa`, `/api/webhooks/rkeeper`).

## Рекомендуемая схема (VPS)

```
nginx
  /          → apps/web/dist (SPA, try_files → index.html)
  /api/*     → proxy_pass http://127.0.0.1:3001
```

Сборка на сервере или в CI:

```bash
npm ci
npm run build -w @kldfood/web
npm run start -w @kldfood/api   # PM2: kldfood-api
```

Переменные окружения — в `apps/api/.env` (не коммитить):

- `WEB_ORIGIN=https://ваш-домен.ru`
- `PUBLIC_API_URL=https://ваш-домен.ru`
- `YOOKASSA_*`, `RKEEPER_*`, `DATABASE_URL`

## Webhooks

| URL | Кто вызывает |
|-----|----------------|
| `POST /api/webhooks/yookassa` | ЮKassa (настроить в ЛК) |
| `POST /api/webhooks/rkeeper` | White Server (поле `callback` в заказе) |

Return URL оплаты: `YOOKASSA_RETURN_URL=https://ваш-домен.ru/order/success`

## База данных

На VPS — PostgreSQL локально или управляемая БД Beget. Схема: `apps/api/sql/001_init.sql`.

Сейчас заказы в памяти (dev); перед продом — перенос на PostgreSQL.
