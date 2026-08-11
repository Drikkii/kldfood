import type { MenuProduct } from "../types/catalog";
import { CATEGORY_NAV_TILES, type CategoryNavTile } from "../data/category-nav-tiles";
import { categoryTileAccent, categoryTileImage, navTileMinPrice } from "../data/category-tiles";

type CategoryTilesProps = {
  productsByCategory: Map<string, MenuProduct[]>;
  onSelect: (targetCategoryId: string) => void;
  tiles?: CategoryNavTile[];
};

export function CategoryTiles({
  productsByCategory,
  onSelect,
  tiles = CATEGORY_NAV_TILES,
}: CategoryTilesProps) {
  return (
    <nav className="category-tiles" aria-label="Категории меню">
      <ul className="category-tiles__grid">
        {tiles.map((tile) => {
          const minPrice = navTileMinPrice(tile, productsByCategory);
          const accent = categoryTileAccent(tile.imageKey);
          const image = categoryTileImage(tile.imageKey);

          return (
            <li key={tile.id}>
              <button
                type="button"
                className="category-tiles__item"
                style={{ backgroundColor: accent }}
                onClick={() => onSelect(tile.targetCategoryId)}
                aria-label={`${tile.label}${minPrice != null ? `, от ${minPrice} ₽` : ""}`}
              >
                <span
                  className="category-tiles__bg"
                  style={{ backgroundImage: `url(${image})` }}
                />
                <span className="category-tiles__caption">{tile.label}</span>
                <span className="category-tiles__hover">
                  <span className="category-tiles__name">{tile.label}</span>
                  {minPrice != null ? (
                    <span className="category-tiles__price">от {minPrice} ₽</span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
