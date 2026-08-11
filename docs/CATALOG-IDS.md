# ID каталога: вёрстка сейчас, R-Keeper потом

Пока нет доступа к R-Keeper, **можно и нужно** рисовать фронт с реальными позициями. Переделывать витрину после подключения RK **не придётся**, если соблюдать правило:

> **Фронт знает только наши стабильные `id`. Коды R-Keeper живут на backend и в seed/БД.**

## Два слоя идентификаторов

| Поле | Кто использует | Когда задаётся | Меняется ли |
|------|----------------|----------------|-------------|
| `id` (товар, категория, группа, option) | Фронт, корзина, checkout | Сейчас, при вёрстке / в `menu-seed.json` | **Нет** (как slug: `shawarma-chicken`, `size`, `standard`) |
| `rkeeperCode` | Только backend → White Server | Когда завели блюдо в RK7 | Заполняется один раз, можно править при ошибке маппинга |

Фронт в корзине отправляет:

```json
{
  "productId": "shawarma-chicken",
  "quantity": 1,
  "selections": [{ "groupId": "size", "optionId": "standard" }],
  "modifiers": [
    { "modifierId": "extra-cheese", "quantity": 1 },
    { "modifierId": "extra-bacon", "quantity": 1 }
  ]
}
```

- **Вариант (`selections`)** — обычно один из группы: размер, объём (меняет базовую цену).
- **Доп (`modifiers`)** — необязательные добавки, можно несколько; у каждого свой `modifierId` и `quantity`.

Названия и цены на клиенте — для UI; **истина по цене, лимитам и стоп-листу — на backend** (`validateAndPriceCart` + `resolveLineModifiers`).

## Допы (modifierGroups)

В seed у блюда (например шаурма):

```json
"modifierGroups": [
  {
    "id": "extras",
    "name": "Добавить",
    "minPick": 0,
    "maxPick": 8,
    "modifiers": [
      { "id": "extra-cheese", "name": "Сыр", "price": 55, "maxQuantity": 3, "rkeeperCode": null }
    ]
  }
]
```

| Поле | Назначение |
|------|------------|
| `minPick` / `maxPick` | Сумма `quantity` всех допов в группе (лимит «не больше N добавок») |
| `maxQuantity` | Сколько раз один и тот же доп на одно блюдо |
| `rkeeperCode` | Отдельная номенклатура в RK (часто доп = отдельная позиция в заказе) |

В R-Keeper уходит **несколько строк** `rkeeperLines`: основное блюдо + каждый доп с своим кодом.

Id допа: `extra-cheese`, `extra-bacon` — **не меняются** при подключении RK.

Стоп-лист допа на точке: ключ `{productId}:mod:{modifierId}` (см. `catalog.js`).

## Где править меню на этапе дизайна

Файл **`apps/api/data/menu-seed.json`** — список категорий и блюд для API и фронта.

1. Добавляете позиции с финальными `id` (латиница, kebab-case).
2. `rkeeperCode` оставляете `null`.
3. Вёрстка тянет меню через `GET /api/menu` — те же id, что в seed.

Когда появится RK:

1. Создаёте те же блюда в кассе (или импорт).
2. В seed (или в таблице БД) прописываете `rkeeperCode` у товара и/или у варианта (если в RK размер — отдельная номенклатура).
3. Включаете синк меню/стоп-листа из RK — **id для фронта не трогаете**.

API **не отдаёт** `rkeeperCode` на витрину (`toPublicProduct`).

## Соглашения по id

- **Категория:** `cat-shawarma`, `cat-drinks`
- **Товар:** `shawarma-chicken`, `burger-student`
- **Группа вариантов:** `size`, `volume`, `sauce`
- **Вариант:** `mini`, `standard`, `mega`, `0_3`
- **Доп:** `extra-cheese`, `extra-bacon`, `extra-sauce-garlic`

Не используйте коды RK, артикулы 1C или objectId ресторана во фронтовых id.

## Сверка после подключения RK

Чек-лист:

1. Каждый `id` из seed имеет заполненный `rkeeperCode` (вариант и/или доп — отдельные коды, если так заведено в RK).
2. Тестовый заказ: webhook → в RK уходит `Order_Num` = UUID заказа, строки — `rkeeperLines[]` (блюдо + допы).
3. Стоп-лист в RK → backend помечает `stopped` → фронт только скрывает/блокирует кнопку (id те же).

При расхождении цены RK и seed backend отрежет checkout или пометит `paid_cart_invalid` после оплаты — фронт менять не нужно.

## Позже: БД вместо JSON

Таблицы `products`, `product_variants` с колонками:

- `id` (PK, наш slug)
- `rkeeper_ident` (nullable → заполняется)
- `name`, `price`, …

Миграция: импорт из `menu-seed.json` один раз.

См. также [`ORDER-FLOW.md`](./ORDER-FLOW.md).
