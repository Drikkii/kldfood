# Локальный просмотр и GitHub Pages

## Локально

React-приложение. **Live Server не подходит** (не умеет TypeScript/JSX).

```bash
npm install
npm run dev:api    # терминал 1
npm run dev:web    # терминал 2
```

Браузер: **http://localhost:5173**

- `dev:web` — Vite, hot reload при сохранении файлов
- `dev:api` — нужен для списка точек и меню (`/api/...`)

## GitHub Pages (показ заказчику)

Репо: `Drikkii/kldfood` → URL: `https://drikkii.github.io/kldfood/`

```bash
git checkout main
git push origin main

npm run deploy:gh-pages
```

Если `gh-pages` не запушилась автоматически:

```bash
git push origin gh-pages --force
```

**Settings → Pages → branch `gh-pages`, folder `/ (root)`**.

### Почему не просто push `index.html`

В репозитории — **исходники** (`.tsx`). GitHub Pages отдаёт статику as-is и **не собирает** React.

`npm run deploy:gh-pages`:

1. Собирает проект (`VITE_BASE_PATH=/kldfood/`)
2. Кладёт готовые `index.html` + `assets/` в ветку `gh-pages`

### Превью сборки локально

```bash
npm run preview:gh-pages
```

Открыть: **http://localhost:4173/kldfood/**

## Beget

```bash
npm run build:beget
```

Загрузить **`dist/`** на хостинг (base `/`, без `/kldfood/` в путях).
