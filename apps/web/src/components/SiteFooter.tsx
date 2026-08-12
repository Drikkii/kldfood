import { Link } from "react-router-dom";
import { SITE_LINKS } from "../data/site-links";
import { SiteSocialLinks } from "./SiteSocialLinks";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__copy">© 2026 FIRE FOOD</span>
        <Link to="/privacy" className="site-footer__policy">
          Политика конфиденциальности
        </Link>

        <SiteSocialLinks />

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
