import { useCallback, useRef } from "react";
import { REVIEWS } from "../data/reviews";
import { SITE_LINKS } from "../data/site-links";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="home-reviews-card__stars" aria-label={`Оценка ${rating} из 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`home-reviews-card__star${i < rating ? " is-filled" : ""}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}

export function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollReviews = useCallback((direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>(".home-reviews-card");
    const cardWidth = firstCard?.offsetWidth ?? el.clientWidth * 0.82;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "0") || 14;

    el.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });
  }, []);

  return (
    <section className="home-reviews" id="reviews" aria-labelledby="home-reviews-title">
      <div className="home-reviews__head">
        <h2 id="home-reviews-title" className="home-reviews__title">
          Отзывы
        </h2>
        <a
          className="home-reviews__add"
          href={SITE_LINKS.telegram}
          target="_blank"
          rel="noopener noreferrer"
        >
          Добавить отзыв
        </a>
      </div>

      <div className="home-reviews__scroll" ref={scrollRef} role="list">
        {REVIEWS.map((review) => (
          <article key={review.id} className="home-reviews-card" role="listitem">
            <header className="home-reviews-card__head">
              <h3 className="home-reviews-card__author">{review.author}</h3>
              <Stars rating={review.rating} />
            </header>
            <p className="home-reviews-card__text">{review.text}</p>
          </article>
        ))}
      </div>

      <div className="home-reviews__controls">
        <button
          type="button"
          className="home-reviews__arrow home-reviews__arrow--prev"
          aria-label="Предыдущий отзыв"
          onClick={() => scrollReviews(-1)}
        >
          <span aria-hidden="true" />
        </button>
        <button
          type="button"
          className="home-reviews__arrow home-reviews__arrow--next"
          aria-label="Следующий отзыв"
          onClick={() => scrollReviews(1)}
        >
          <span aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
