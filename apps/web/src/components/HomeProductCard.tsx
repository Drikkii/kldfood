import { useMemo, useState } from "react";
import type { CartLine, MenuProduct } from "../types/catalog";
import { productImageUrl } from "../data/placeholder-images";
import { productDisplayMeta, productPriceLabel } from "../utils/menu-pricing";
import {
  buildProductSelections,
  defaultSizeOptionId,
  getSizeVariantGroup,
  productHasSizePicker,
} from "../utils/product-size";
import { productToCartLine } from "../utils/product-to-cart-line";
import { ProductSizePicker } from "./ProductSizePicker";

type HomeProductCardProps = {
  product: MenuProduct;
  onSelect: (line: CartLine) => void;
};

export function HomeProductCard({ product, onSelect }: HomeProductCardProps) {
  const sizeGroup = getSizeVariantGroup(product);
  const hasSizePicker = productHasSizePicker(product);
  const [selectedSizeId, setSelectedSizeId] = useState(() => defaultSizeOptionId(product));

  const selections = useMemo(
    () => buildProductSelections(product, selectedSizeId),
    [product, selectedSizeId],
  );

  const priceLabel = productPriceLabel(product, selections);
  const meta = productDisplayMeta(product, selections);

  function handleAdd() {
    onSelect(productToCartLine(product, selections));
  }

  return (
    <article className={`home-product-card${hasSizePicker ? " home-product-card--has-sizes" : ""}`}>
      <div
        className="home-product-card__image"
        style={{
          backgroundImage: `url(${productImageUrl(product.id, product.categoryId, product.imageUrl)})`,
        }}
        aria-hidden="true"
      />
      <div className="home-product-card__body">
        <h3 className="home-product-card__name">{product.name}</h3>
        {meta ? <p className="home-product-card__meta">{meta}</p> : null}
        {product.description ? (
          <p className="home-product-card__desc">{product.description}</p>
        ) : null}
        <div className="home-product-card__foot">
          <div className="home-product-card__foot-main">
            <span className="home-product-card__price">{priceLabel}</span>
            {hasSizePicker && sizeGroup ? (
              <ProductSizePicker
                product={product}
                group={sizeGroup}
                selectedOptionId={selectedSizeId ?? sizeGroup.options[0].id}
                onSelect={setSelectedSizeId}
                disabled={product.stopped}
              />
            ) : null}
          </div>
          <button
            type="button"
            className="home-product-card__btn"
            disabled={product.stopped}
            onClick={handleAdd}
          >
            Выбрать
          </button>
        </div>
      </div>
    </article>
  );
}
