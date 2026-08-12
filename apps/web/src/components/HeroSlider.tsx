import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type RefObject,
  type TouchEvent,
  type TransitionEvent,
} from "react";
import { Link } from "react-router-dom";
import { HERO_SLIDES } from "../data/hero-slides";
import type { HeroSlide } from "../types/hero-slide";

const AUTOPLAY_MS = 5000;
const SLIDE_WIDTH_RATIO = 0.82;
const SLIDE_WIDTH_RATIO_MOBILE = 1;
const SLIDE_GAP_PX = 16;
const SLIDE_GAP_PX_MOBILE = 0;
const MOBILE_MAX_WIDTH = 900;
const TRACK_TRANSITION_MS = 450;
const SWIPE_THRESHOLD_PX = 48;

type Metrics = {
  slideWidth: number;
  peek: number;
  slideGap: number;
  isMobile: boolean;
};

function useSliderMetrics(viewportRef: RefObject<HTMLDivElement | null>) {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches,
  );
  const [metrics, setMetrics] = useState<Metrics>({
    slideWidth: 0,
    peek: 0,
    slideGap: SLIDE_GAP_PX,
    isMobile,
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const onMqChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onMqChange);
    return () => mq.removeEventListener("change", onMqChange);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const ratio = isMobile ? SLIDE_WIDTH_RATIO_MOBILE : SLIDE_WIDTH_RATIO;
    const gap = isMobile ? SLIDE_GAP_PX_MOBILE : SLIDE_GAP_PX;

    const update = () => {
      const width = el.clientWidth;
      const slideWidth = width * ratio;
      const peek = (width - slideWidth) / 2;
      setMetrics({ slideWidth, peek, slideGap: gap, isMobile });
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        update();
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [viewportRef, isMobile]);

  return metrics;
}

function SlideCard({
  slide,
  width,
  onPrev,
  onNext,
  showArrows,
}: {
  slide: HeroSlide;
  width: number;
  onPrev: () => void;
  onNext: () => void;
  showArrows: boolean;
}) {
  const style: CSSProperties = {
    ...(width > 0 ? { width: "100%" } : {}),
    background: slide.imageUrl
      ? `url(${slide.imageUrl}) center/cover no-repeat`
      : `linear-gradient(135deg, ${slide.accent} 0%, color-mix(in srgb, ${slide.accent} 55%, #000) 100%)`,
  };

  const shellStyle: CSSProperties = width > 0 ? { width } : {};

  const stopNav = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const slideBody = (
    <article className="hero-slider__slide" style={style}>
      <div className="hero-slider__slide-overlay" />
      <div className="hero-slider__slide-copy">
        <h2 className="hero-slider__slide-title">{slide.title}</h2>
        {slide.subtitle ? <p className="hero-slider__slide-subtitle">{slide.subtitle}</p> : null}
      </div>
    </article>
  );

  return (
    <div className="hero-slider__slide-shell" style={shellStyle}>
      {showArrows ? (
        <>
          <button
            type="button"
            className="hero-slider__arrow hero-slider__arrow--prev"
            aria-label="Предыдущий слайд"
            onClick={(event) => {
              stopNav(event);
              onPrev();
            }}
          >
            <span aria-hidden="true" />
          </button>
          <button
            type="button"
            className="hero-slider__arrow hero-slider__arrow--next"
            aria-label="Следующий слайд"
            onClick={(event) => {
              stopNav(event);
              onNext();
            }}
          >
            <span aria-hidden="true" />
          </button>
        </>
      ) : null}

      {slide.link ? (
        <Link to={slide.link} className="hero-slider__slide-link" draggable={false}>
          {slideBody}
        </Link>
      ) : (
        slideBody
      )}
    </div>
  );
}

function positionToDotIndex(position: number, count: number) {
  if (position === 0) return count - 1;
  if (position > count) return 0;
  return position - 1;
}

export function HeroSlider({ slides = HERO_SLIDES }: { slides?: HeroSlide[] }) {
  const count = slides.length;
  const isLoop = count > 1;
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const isLockedRef = useRef(false);
  const snapTimerRef = useRef<number | null>(null);
  const { slideWidth, peek, slideGap, isMobile } = useSliderMetrics(viewportRef);
  const [position, setPosition] = useState(isLoop ? 1 : 0);
  const [animating, setAnimating] = useState(true);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(() => document.visibilityState === "hidden");
  const positionRef = useRef(position);

  positionRef.current = position;

  const clearSnapTimer = useCallback(() => {
    if (snapTimerRef.current != null) {
      window.clearTimeout(snapTimerRef.current);
      snapTimerRef.current = null;
    }
  }, []);

  const unlockSlider = useCallback(() => {
    isLockedRef.current = false;
  }, []);

  const snapLoopClone = useCallback(() => {
    if (!isLoop) {
      unlockSlider();
      return;
    }
    const pos = positionRef.current;
    if (pos === count + 1) {
      setAnimating(false);
      setPosition(1);
      window.requestAnimationFrame(unlockSlider);
      return;
    }
    if (pos === 0) {
      setAnimating(false);
      setPosition(count);
      window.requestAnimationFrame(unlockSlider);
      return;
    }
    if (pos > count + 1 || pos < 0) {
      setAnimating(false);
      setPosition(Math.min(Math.max(pos, 1), count));
      window.requestAnimationFrame(unlockSlider);
      return;
    }
    unlockSlider();
  }, [count, isLoop, unlockSlider]);

  const loopSlides = useMemo(() => {
    if (!isLoop) return slides;
    return [slides[count - 1], ...slides, slides[0]];
  }, [slides, count, isLoop]);

  const activeDot = isLoop ? positionToDotIndex(position, count) : 0;

  const goToDot = useCallback(
    (dotIndex: number) => {
      if (count === 0 || isLockedRef.current) return;
      isLockedRef.current = true;
      clearSnapTimer();
      setAnimating(true);
      setPosition(isLoop ? dotIndex + 1 : 0);
    },
    [count, isLoop, clearSnapTimer],
  );

  const goNext = useCallback(() => {
    if (count === 0 || isLockedRef.current) return;
    isLockedRef.current = true;
    clearSnapTimer();
    setAnimating(true);
    setPosition((prev) => {
      if (!isLoop) return (prev + 1) % count;
      const next = prev + 1;
      return next > count + 1 ? count + 1 : next;
    });
  }, [count, isLoop, clearSnapTimer]);

  const goPrev = useCallback(() => {
    if (count === 0 || isLockedRef.current) return;
    isLockedRef.current = true;
    clearSnapTimer();
    setAnimating(true);
    setPosition((prev) => {
      if (!isLoop) return (prev - 1 + count) % count;
      const next = prev - 1;
      return next < 0 ? 0 : next;
    });
  }, [count, isLoop, clearSnapTimer]);

  const onTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? 0;
    setPaused(true);
  }, []);

  const onTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
      const delta = endX - touchStartX.current;

      if (Math.abs(delta) >= SWIPE_THRESHOLD_PX && !isLockedRef.current) {
        if (delta < 0) goNext();
        else goPrev();
      }

      setPaused(false);
    },
    [goNext, goPrev],
  );

  const onTouchCancel = useCallback(() => {
    setPaused(false);
  }, []);

  const onTrackTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (!isLoop) return;
      if (event.target !== event.currentTarget) return;
      if (event.propertyName !== "transform") return;
      clearSnapTimer();
      snapLoopClone();
    },
    [isLoop, snapLoopClone, clearSnapTimer],
  );

  useEffect(() => {
    if (!isLoop) return;
    if (position !== count + 1 && position !== 0) return;

    clearSnapTimer();
    snapTimerRef.current = window.setTimeout(() => {
      snapTimerRef.current = null;
      snapLoopClone();
    }, TRACK_TRANSITION_MS + 80);

    return clearSnapTimer;
  }, [position, isLoop, count, snapLoopClone, clearSnapTimer]);

  useEffect(() => {
    const onVisibility = () => {
      const hidden = document.visibilityState === "hidden";
      setTabHidden(hidden);
      if (!hidden) {
        snapLoopClone();
        window.requestAnimationFrame(() => setAnimating(true));
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [snapLoopClone]);

  useEffect(() => {
    if (animating) return;
    const frame = window.requestAnimationFrame(() => {
      setAnimating(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [animating]);

  useEffect(() => {
    if (count <= 1 || paused || tabHidden) return;
    const timer = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [count, paused, tabHidden, goNext]);

  if (count === 0) return null;

  const trackIndex = isLoop ? position : 0;
  const offset = peek - trackIndex * (slideWidth + slideGap);

  return (
    <section
      className={`hero-slider${isMobile ? " hero-slider--mobile" : ""}`}
      aria-roledescription="carousel"
      aria-label="Акции и новости"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="hero-slider__frame">
        <div
          className="hero-slider__viewport"
          ref={viewportRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchCancel}
        >
          <div
            className={`hero-slider__track${animating ? " is-animating" : ""}`}
            style={{
              gap: slideGap,
              transform: slideWidth > 0 ? `translate3d(${offset}px, 0, 0)` : undefined,
            }}
            onTransitionEnd={onTrackTransitionEnd}
          >
            {loopSlides.map((slide, slideIndex) => (
              <SlideCard
                key={`${slide.id}-${slideIndex}`}
                slide={slide}
                width={slideWidth}
                onPrev={goPrev}
                onNext={goNext}
                showArrows={slideIndex === trackIndex}
              />
            ))}
          </div>

          <div className="hero-slider__edge hero-slider__edge--left" aria-hidden="true" />
          <div className="hero-slider__edge hero-slider__edge--right" aria-hidden="true" />
        </div>

        <div className="hero-slider__pagination" role="tablist" aria-label="Слайды">
          {slides.map((slide, dotIndex) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              className={`hero-slider__dot${dotIndex === activeDot ? " is-active" : ""}`}
              aria-label={`Слайд ${dotIndex + 1}`}
              aria-selected={dotIndex === activeDot}
              onClick={() => goToDot(dotIndex)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
