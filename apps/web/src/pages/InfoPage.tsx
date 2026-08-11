import { Link } from "react-router-dom";

type InfoPageProps = {
  title: string;
  description: string;
};

export function InfoPage({ title, description }: InfoPageProps) {
  return (
    <section className="info-page">
      <h1>{title}</h1>
      <p className="muted">{description}</p>
      <Link to="/" className="info-page__cta">
        Перейти в меню
      </Link>
    </section>
  );
}
