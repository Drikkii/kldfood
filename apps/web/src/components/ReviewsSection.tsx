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

      <div className="home-reviews__scroll" role="list">
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
    </section>
  );
}
