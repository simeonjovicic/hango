import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import { useAutoCarousel } from '../hooks/useAutoCarousel';

const PORTFOLIO_CAROUSEL_INTERVAL = 7500;

gsap.registerPlugin(ScrollTrigger);

// Add a slug here once /public/portfolio/handy-{slug}.png exists.
// Projects not listed fall back to the iphone-frame.png + {slug}-mobile.png composition.
const HANDY_AVAILABLE = new Set(['sham', 'oasespa', 'fem', 'minicrm', 'misterm', 'sivar', 'choo', 'nes', 'datri']);

const projects = [
    {
        slug: 'sham',
        domain: 'shamsweets.at',
        category: 'Food & E-Commerce',
        headline: 'Authentischer Geschmack, online erlebbar gemacht.',
        description: 'Ein präziser digitaler Auftritt, der Vertrauen, Genuss und Kaufbereitschaft auf den ersten Blick verdichtet.',
        link: 'https://shamsweets.at',
    },
    {
        slug: 'oasespa',
        domain: 'oasespa.at',
        category: 'Health & Beauty',
        headline: 'Digitale Ruheoase für entspannte Kunden.',
        description: 'Eine ruhige Premium-Präsenz, die Atmosphäre, Termininteresse und Markenwert souverän zusammenführt.',
        link: 'https://oasespa.at',
    },
    {
        slug: 'fem',
        domain: 'fembeauty.at',
        category: 'Beauty & Wellness',
        headline: 'Eleganz, die online genauso wirkt wie im Studio.',
        description: 'Ein fein kuratierter Auftritt, der Ästhetik, Klarheit und gehobenes Vertrauen elegant verbindet.',
        link: 'https://fembeauty.at',
    },
    {
        slug: 'minicrm',
        domain: 'MiniCRM',
        category: 'SaaS & Business Tool',
        headline: 'Kundenmanagement, einfach und übersichtlich.',
        description: 'Ein fokussiertes Interface, geschaffen für Übersicht, Geschwindigkeit und professionelle tägliche Nutzung.',
        link: '#',
    },
    {
        slug: 'misterm',
        domain: 'Mister M',
        category: 'Service & Handwerk',
        headline: 'Vertrauen schaffen mit klarer Online-Präsenz.',
        description: 'Eine markante Webpräsenz, die handwerkliche Kompetenz mit hochwertiger digitaler Wirkung übersetzt.',
        link: 'https://city-barbershop.simeon-jovicic.workers.dev',
    },
    {
        slug: 'sivar',
        domain: 'Sivar',
        category: 'Brand & Web',
        headline: 'Ein digitaler Auftritt mit Charakter und Klarheit.',
        description: 'Eine moderne Markenpräsenz, die Identität, Qualität und Wiedererkennung präzise auf den Punkt bringt.',
        link: '#',
    },
    {
        slug: 'choo',
        domain: 'choo-foodstore.at',
        category: 'Food & Retail',
        headline: 'Asiatische Vielfalt, digital zum Greifen nah.',
        description: 'Ein warmer, kuratierter Auftritt, der Sortiment, Standort und Einkaufslust auf einen Blick vermittelt.',
        link: 'https://choo-foodstore.at',
    },
    {
        slug: 'nes',
        domain: 'nes-shop.at',
        category: 'Fashion & E-Commerce',
        headline: 'Zurückhaltende Eleganz für eine junge Marke.',
        description: 'Eine ruhige Premium-Bühne, die Markenwerte, Neugier und Newsletter-Anmeldungen elegant zusammenführt.',
        link: 'https://nes-shop.at',
    },
    {
        slug: 'datri',
        domain: 'datri-shop.at',
        category: 'Sport & E-Commerce',
        headline: 'Kompromisslose Marke, kompromissloser Auftritt.',
        description: 'Ein kraftvoller Shop-Auftritt, der Härte, Qualitätsanspruch und klare Kaufwege konsequent verbindet.',
        link: 'https://datri-shop.at',
    },
];

// Per-project handy size scale (1 = default 18% width / 190px max)
const HANDY_SCALE = {
    sham: 1.1,
    oasespa: 1.21,
    fem: 1.21,
    minicrm: 1.32,
    misterm: 1.21,
    sivar: 1.21,
    choo: 1.21,
    nes: 1.21,
    datri: 1.21,
};

const ProjectCard = ({ project }) => {
    const hasLink = project.link && project.link !== '#';
    const scale = HANDY_SCALE[project.slug] ?? 1;
    const handyWidthPct = 18 * scale;
    const handyMaxPx = Math.round(190 * scale);

    const LaptopMedia = (
        <img
            src={`/portfolio/laptop-${project.slug}.png`}
            alt={`${project.domain} on laptop`}
            className="relative block w-full h-full object-contain"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
        />
    );

    return (
    <div className="relative w-full" style={{ aspectRatio: '1536 / 1024' }}>

        {/* Laptop Mockup (transparent PNG with frame + screenshot baked in) */}
        {hasLink ? (
            <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full transition-transform duration-500 hover:scale-[1.02]"
                onClick={(e) => e.stopPropagation()}
            >
                {LaptopMedia}
            </a>
        ) : (
            LaptopMedia
        )}

        {/* Phone Mockup — pre-rendered handy-*.png if available, else iphone-frame + mobile.png composition */}
        {HANDY_AVAILABLE.has(project.slug) ? (
            <img
                src={`/portfolio/handy-${project.slug}.png`}
                alt={`${project.domain} on phone`}
                className="hidden md:block absolute right-[2%] bottom-[-3%] z-20 object-contain"
                style={{ aspectRatio: '1536 / 2752', width: `${handyWidthPct}%`, maxWidth: `${handyMaxPx}px` }}
                loading="lazy"
                onError={(e) => (e.target.style.display = 'none')}
            />
        ) : (
            <div
                className="hidden md:block absolute right-[2%] bottom-[-3%] z-20 drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)]"
                style={{ aspectRatio: '852 / 1846', width: `${handyWidthPct}%`, maxWidth: `${handyMaxPx}px` }}
            >
                <div
                    className="absolute overflow-hidden rounded-[14%/6.5%] bg-black"
                    style={{ top: '4.5%', bottom: '9%', left: '8%', right: '8%' }}
                >
                    <img
                        src={`/portfolio/${project.slug}-mobile.png`}
                        alt={`Mobile view of ${project.domain}`}
                        className="absolute inset-0 w-full h-full object-contain object-top"
                        loading="lazy"
                        onError={(e) => (e.target.style.display = 'none')}
                    />
                </div>
                <img
                    src="/portfolio/iphone-frame.png"
                    alt=""
                    aria-hidden="true"
                    className="relative w-full h-full pointer-events-none select-none"
                />
            </div>
        )}
    </div>
    );
};

const Portfolio = () => {
  const containerRef = useRef(null);
  const infoPanelRef = useRef(null);
  const infoPanelContentRef = useRef(null);
  const infoPanelTimelineRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [visibleProject, setVisibleProject] = useState(null);
  const [progress, setProgress] = useState(0);

  // Add these two refs:
  const elapsedRef = useRef(0);
  const lastTickRef = useRef(0);
  const len = projects.length;

  const { activeIndex, next, prev, goTo, pause, resume } = useAutoCarousel(
    len,
    {
      interval: PORTFOLIO_CAROUSEL_INTERVAL,
      enabled: len > 1,
    },
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // 1. Reset the timer ONLY when the slide actually changes
  useEffect(() => {
    elapsedRef.current = 0;
    setProgress(100);
  }, [activeIndex]);

  // 2. Handle the countdown, allowing it to pause and resume smoothly
  useEffect(() => {
    // If paused (hovered or panel open), do nothing so it stays frozen in place
    if (len <= 1 || hoveredIndex !== null || visibleProject !== null)
      return undefined;

    let frameId;
    lastTickRef.current = performance.now();

    const tick = (now) => {
      // Calculate how much time passed since the last frame
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      // Add that to our total elapsed time
      elapsedRef.current += delta;

      // Calculate the new percentage based on total elapsed time
      setProgress(
        Math.max(
          0,
          100 - (elapsedRef.current / PORTFOLIO_CAROUSEL_INTERVAL) * 100,
        ),
      );

      // Continue the loop if we haven't reached 0
      if (elapsedRef.current < PORTFOLIO_CAROUSEL_INTERVAL) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [activeIndex, len, hoveredIndex, visibleProject]);
  useEffect(() => {
    if (hoveredIndex !== null || visibleProject !== null) {
      pause();
    } else {
      resume();
    }
  }, [hoveredIndex, visibleProject, pause, resume]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const active = projects[activeIndex];
  const hoveredProject = hoveredIndex === activeIndex ? active : null;
  const isInfoVisible = visibleProject !== null;

  useLayoutEffect(() => {
    const panel = infoPanelRef.current;
    const content = infoPanelContentRef.current;
    if (!panel || !content) return;

    const children = Array.from(content.children);
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "expo.out" },
      onReverseComplete: () => {
        gsap.set(panel, { pointerEvents: "none" });
        setVisibleProject(null);
      },
    });

    gsap.set(panel, {
      autoAlpha: 0,
      x: 86,
      yPercent: -50,
      rotateY: -22,
      rotateX: 8,
      scale: 0.9,
      filter: "blur(18px)",
      transformPerspective: 1200,
      pointerEvents: "auto",
    });
    gsap.set(children, {
      autoAlpha: 0,
      y: 18,
      rotateX: -10,
      transformOrigin: "50% 50%",
    });

    tl.to(
      panel,
      {
        autoAlpha: 1,
        x: 0,
        yPercent: -50,
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.72,
      },
      0,
    );
    tl.to(
      children,
      {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        duration: 0.56,
        stagger: 0.09,
        ease: "power3.out",
      },
      0.1,
    );

    infoPanelTimelineRef.current = tl;

    if (isInfoVisible) {
      gsap.set(panel, { pointerEvents: "auto" });
      tl.play(0);
    } else {
      tl.progress(1);
    }

    return () => {
      tl.kill();
    };
  }, [isInfoVisible, activeIndex]);

  useEffect(() => {
    if (hoveredProject) {
      if (visibleProject?.slug !== hoveredProject.slug) {
        setVisibleProject(hoveredProject);
      }
      if (infoPanelTimelineRef.current) {
        gsap.set(infoPanelRef.current, { pointerEvents: "auto" });
        infoPanelTimelineRef.current.timeScale(1).play(0);
      }
      return;
    }

    if (!visibleProject) return;

    if (infoPanelTimelineRef.current) {
      infoPanelTimelineRef.current.timeScale(3.5).reverse();
    } else {
      setVisibleProject(null);
    }
  }, [hoveredProject, visibleProject]);

  return (
    <section
      id="referenzen"
      ref={containerRef}
      className="relative min-h-[100dvh] py-12 sm:py-14 md:py-24 lg:py-28 bg-white text-black w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-16 lg:mb-20 md:max-w-5xl lg:max-w-6xl">
          <p className="text-[0.7rem] sm:text-xs md:text-sm lg:text-base font-extrabold tracking-[0.3em] md:tracking-[0.34em] text-red-600 uppercase font-inter">
            Ausgewählte Arbeiten
          </p>
          <h1 className="mt-4 md:mt-6 text-[2.65rem] sm:text-5xl md:text-7xl lg:text-[5.25rem] xl:text-[6rem] leading-[1.02] md:leading-[0.92] font-black tracking-tight text-gray-950 font-roboto">
            Wir machen Ihre Webseite{" "}
            <span className="text-red-600">einzigartig.</span>
          </h1>
          <p className="mt-5 md:mt-8 max-w-2xl md:max-w-3xl text-base md:text-xl lg:text-2xl leading-relaxed md:leading-8 text-gray-600 font-inter">
            Websites, Markenauftritte und Systeme — visuell präzise, im Alltag
            zuverlässig. Scrollen Sie durch unsere Referenzen.
          </p>

          <div className="mt-7 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 w-full sm:w-auto max-w-md md:max-w-none">
            <HashLink
              smooth
              to="#kontakt"
              className="block w-full sm:w-auto sm:order-2"
            >
              <button
                type="button"
                className="w-full sm:w-auto py-3.5 md:py-4 px-7 md:px-9 rounded-xl md:rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-inter text-base md:text-lg font-bold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 active:scale-[0.98]"
              >
                Jetzt kontaktieren
              </button>
            </HashLink>
            <HashLink
              smooth
              to="#services"
              className="block w-full sm:w-auto sm:order-1"
            >
              <button
                type="button"
                className="w-full sm:w-auto py-3.5 md:py-4 px-7 md:px-9 relative overflow-hidden rounded-xl md:rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20 before:content-[''] before:absolute before:inset-0 before:z-0 before:bg-gradient-to-r before:from-black before:to-gray-400 before:rounded-xl md:before:rounded-2xl after:content-[''] after:absolute after:inset-[2px] after:z-10 after:bg-white after:rounded-[0.6rem] md:after:rounded-[0.85rem] hover:after:bg-[#f5f5f7]"
              >
                <span className="font-inter relative z-20 text-base md:text-lg font-bold text-black">
                  Mehr erfahren
                </span>
              </button>
            </HashLink>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative pt-2 md:pt-4"
          style={{ perspective: "2200px", perspectiveOrigin: "50% 50%" }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Active project URL — hover to reveal the detail panel */}
          <div className="mb-6 md:mb-8 hidden md:flex items-center justify-center">
            <button
              type="button"
              onMouseEnter={() => setHoveredIndex(activeIndex)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(activeIndex)}
              onBlur={() => setHoveredIndex(null)}
              aria-label={`Details zu ${active.domain} anzeigen`}
              className="group inline-flex items-center gap-3 cursor-pointer text-xs md:text-sm font-semibold tracking-[0.22em] uppercase text-gray-500 hover:text-red-600 focus:text-red-600 focus:outline-none transition-colors font-inter"
            >
              <span className="h-px w-8 bg-current opacity-40 transition-all group-hover:w-12 group-hover:opacity-100" />
              <span className="border-b border-dashed border-current/40 pb-0.5">
                {active.domain}
              </span>
              <span className="h-px w-8 bg-current opacity-40 transition-all group-hover:w-12 group-hover:opacity-100" />
            </button>
          </div>

          {/* Stage */}
          <div
            className="relative h-[270px] sm:h-[395px] md:h-[535px] flex items-center justify-center select-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transformStyle: "preserve-3d",
              transform: isInfoVisible ? "translateX(-12.8%)" : "translateX(0)",
            }}
          >
            {projects.map((project, index) => {
              let offset = index - activeIndex;
              if (offset > len / 2) offset -= len;
              if (offset < -len / 2) offset += len;
              const distance = Math.abs(offset);
              const direction = Math.sign(offset);
              const isActive = distance === 0;

              // 3D positioning — cards rotate as they move outward (like a carousel cylinder)
              const tx =
                direction * (distance === 1 ? 82 : distance === 2 ? 145 : 190); // % of own width
              const tz = isActive ? 40 : distance === 1 ? -220 : -430; // depth in px (negative = further back)
              const rotY =
                direction * (distance === 1 ? -31 : distance === 2 ? -42 : -48); // degrees
              const scale = isActive ? 1.03 : distance === 1 ? 0.83 : 0.72;
              const blur = isActive ? 0 : distance === 1 ? 5.5 : 10;
              const brightness = isActive ? 1 : distance === 1 ? 0.9 : 0.8;
              const saturate = isActive ? 1 : distance === 1 ? 0.7 : 0.5;
              const opacityVal = isActive ? 1 : distance >= 3 ? 0 : 1;
              const zIndex = 30 - distance;

              return (
                <div
                  key={project.slug}
                  onClick={() => {
                    if (!isActive) {
                      goTo(index);
                    }
                  }}
                  className="absolute top-1/2 left-1/2 w-[77%] md:w-[61%] will-change-transform"
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${tx}%, 0, ${tz}px) rotateY(${rotY}deg) scale(${scale})`,
                    filter: `blur(${blur}px) brightness(${brightness}) saturate(${saturate})`,
                    opacity: opacityVal,
                    zIndex,
                    cursor: isActive ? "default" : "pointer",
                    pointerEvents: distance >= 3 ? "none" : "auto",
                    transformStyle: "preserve-3d",
                    transformOrigin: "50% 50%",
                    transition:
                      "transform 1100ms cubic-bezier(0.22, 1, 0.36, 1), filter 800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  aria-hidden={!isActive}
                >
                  <ProjectCard project={project} />
                </div>
              );
            })}
          </div>

          <div
            ref={infoPanelRef}
            className="pointer-events-none absolute right-0 top-1/2 z-50 hidden w-[min(26rem,38vw)] md:block"
            style={{ opacity: 0, transformStyle: "preserve-3d" }}
          >
            {visibleProject && (
              <div
                className="relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="absolute inset-3 rounded-[1.9rem] bg-black/35 blur-2xl"
                  style={{ transform: "translateZ(-44px)" }}
                />
                <div
                  className="absolute -inset-px rounded-[1.75rem] bg-gradient-to-br from-white/55 via-slate-200/20 to-black/30"
                  style={{ transform: "translateZ(-2px)" }}
                />
                <div
                  ref={infoPanelContentRef}
                  className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-[linear-gradient(145deg,#1a1a1a_0%,#070707_48%,#101010_100%)] p-8 text-white shadow-[0_42px_110px_rgba(0,0,0,0.5)]"
                  style={{
                    transform: "translateZ(34px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                  <div className="absolute inset-y-6 right-0 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
                  <div className="absolute -right-24 -top-28 h-56 w-56 rounded-full bg-white/12 blur-3xl" />
                  <div className="absolute -bottom-28 -left-24 h-56 w-56 rounded-full bg-white/12 blur-3xl" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.09),transparent_36%)]" />

                  <div
                    className="relative flex items-center justify-between gap-4"
                    style={{ transform: "translateZ(32px)" }}
                  >
                    <span className="inline-flex w-fit border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[0.66rem] font-extrabold uppercase tracking-[0.22em] text-white/72 backdrop-blur">
                      {visibleProject.category}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-white/35 via-white/55 to-transparent" />
                  </div>
                  <div
                    className="relative mt-6"
                    style={{ transform: "translateZ(48px)" }}
                  >
                    {visibleProject.link === "#" ? (
                      <h3 className="portfolio-panel-title text-4xl font-extrabold tracking-tight font-roboto">
                        {visibleProject.domain}
                      </h3>
                    ) : (
                      <a
                        href={visibleProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio-panel-title pointer-events-auto block text-4xl font-extrabold tracking-tight font-roboto"
                      >
                        {visibleProject.domain}
                      </a>
                    )}
                  </div>
                  <p
                    className="relative mt-6 text-xl font-semibold leading-8 text-white font-inter"
                    style={{ transform: "translateZ(42px)" }}
                  >
                    {visibleProject.headline}
                  </p>
                  <p
                    className="relative mt-4 text-sm leading-7 text-white/64 font-inter"
                    style={{ transform: "translateZ(36px)" }}
                  >
                    {visibleProject.description}
                  </p>
                  <div
                    className="relative mt-8 flex items-center gap-3"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <span className="h-px flex-1 bg-gradient-to-r from-white/45 via-white/30 to-transparent" />
                    <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.24em] text-white/45">
                      Selected Work
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 md:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0 w-full max-w-[100px] sm:max-w-[250px]">
              <div className="carousel-progress-shell h-0.5 md:h-1">
                <div
                  className="portfolio-carousel-progress-fill carousel-progress-fill h-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2.5 flex justify-center gap-1.5 sm:justify-start">
                {projects.map((project, index) => (
                  <button
                    key={project.slug}
                    type="button"
                    onClick={() => goTo(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-5 bg-red-500"
                        : "w-1.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Projekt ${index + 1}: ${project.domain}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                  />
                ))}
              </div>
            </div>
            <div className="text-center text-[0.65rem] font-extrabold uppercase tracking-[0.28em] text-gray-500 tabular-nums sm:text-right">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(len).padStart(2, "0")}
            </div>
          </div>

          <button
            type="button"
            onClick={prev}
            aria-label="Vorheriges Projekt"
            className="portfolio-carousel-btn portfolio-carousel-btn--prev absolute left-1 sm:left-2 md:-left-1 top-1/2 z-40"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Nächstes Projekt"
            className="portfolio-carousel-btn portfolio-carousel-btn--next absolute right-1 sm:right-2 md:-right-1 top-1/2 z-40"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Einstieg in die 3D-Galerie (/gallery) */}
        <div className="mt-12 md:mt-16 flex flex-col items-center gap-3">
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-3 rounded-full bg-gray-950 px-7 py-4 md:px-9 font-inter text-sm md:text-base font-bold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:bg-black hover:shadow-xl hover:shadow-black/30 active:scale-[0.98]"
          >
            Alle Projekte ansehen
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M13 6l6 6-6 6"
              />
            </svg>
          </Link>
          <p className="font-inter text-[0.65rem] md:text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
            Interaktive 3D-Galerie
          </p>
        </div>
      </div>
    </section>
  );
};;;

export default Portfolio;
