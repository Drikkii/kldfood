import { Link } from "react-router-dom";
import { SITE_LINKS } from "../data/site-links";

function IconTelegram() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"
      />
    </svg>
  );
}

function IconVk() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M15.684 2H8.316C3.592 2 2 3.592 2 8.316v7.368C2 20.408 3.592 22 8.316 22h7.368C20.408 22 22 20.408 22 15.684V8.316C22 3.592 20.408 2 15.684 2zm3.692 14.896h-1.608c-.612 0-.798-.496-1.896-1.604-1.002-.96-1.444-1.092-1.692-1.092-.348 0-.444.1-.444.588v1.464c0 .42-.132.672-1.224.672-1.812 0-3.828-1.104-5.244-3.168-2.136-3.012-2.724-5.28-2.724-5.748 0-.24.1-.468.588-.468h1.608c.444 0 .612.204.78.684.852 2.472 2.28 4.644 2.868 4.644.216 0 .312-.1.312-.648v-2.52c-.072-1.188-.696-1.284-.696-1.704 0-.204.168-.408.444-.408h2.532c.372 0 .504.204.504.54v3.408c0 .372.168.504.276.504.216 0 .396-.132.792-.528 1.224-1.368 2.088-3.48 2.088-3.48.12-.264.312-.516.756-.516h1.608c.48 0 .588.252.48.588-.204.948-2.388 3.732-2.388 3.732-.216.348-.3.504 0 .876.216.276.924.864 1.404 1.392.852.948 1.5 1.752 1.668 2.304.168.552-.084.828-.636.828z"
      />
    </svg>
  );
}

const SOCIAL = [
  { id: "tg", href: SITE_LINKS.telegram, label: "Telegram", icon: IconTelegram },
  { id: "vk", href: SITE_LINKS.vk, label: "ВКонтакте", icon: IconVk },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__copy">© 2026 FIRE FOOD</span>
        <Link to="/privacy" className="site-footer__policy">
          Политика конфиденциальности
        </Link>

        <div className="site-footer__social">
          {SOCIAL.map(({ id, href, label, icon: Icon }) => (
            <a
              key={id}
              href={href}
              className="site-footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              <Icon />
            </a>
          ))}
          <a
            href={SITE_LINKS.max}
            className="site-footer__social-link site-footer__social-link--max"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="MAX"
          >
            <span className="site-footer__max-box">
              <span className="site-footer__max-text">MAX</span>
            </span>
          </a>
        </div>

        <a
          href={SITE_LINKS.drikkiiGithub}
          className="site-footer__credit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by <span className="site-footer__credit-name">Drikki</span>
        </a>
      </div>
    </footer>
  );
}
