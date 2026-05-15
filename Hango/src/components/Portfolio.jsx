import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Add a slug here once /public/portfolio/handy-{slug}.png exists.
// Projects not listed fall back to the iphone-frame.png + {slug}-mobile.png composition.
const HANDY_AVAILABLE = new Set(['sham', 'oasespa', 'fem', 'minicrm', 'misterm']);

const projects = [
    {
        slug: 'sham',
        domain: 'shamsweets.at',
        category: 'Food & E-Commerce',
        headline: 'Authentischer Geschmack, online erlebbar gemacht.',
        link: 'https://shamsweets.at',
    },
    {
        slug: 'oasespa',
        domain: 'oasespa.at',
        category: 'Health & Beauty',
        headline: 'Digitale Ruheoase für entspannte Kunden.',
        link: 'https://oasespa.at',
    },
    {
        slug: 'fem',
        domain: 'fembeauty.at',
        category: 'Beauty & Wellness',
        headline: 'Eleganz, die online genauso wirkt wie im Studio.',
        link: 'https://fembeauty.at',
    },
    {
        slug: 'minicrm',
        domain: 'MiniCRM',
        category: 'SaaS & Business Tool',
        headline: 'Kundenmanagement, einfach und übersichtlich.',
        link: '#',
    },
    {
        slug: 'misterm',
        domain: 'Mister M',
        category: 'Service & Handwerk',
        headline: 'Vertrauen schaffen mit klarer Online-Präsenz.',
        link: 'https://city-barbershop.simeon-jovicic.workers.dev',
    },
];

// Per-project handy size scale (1 = default 18% width / 190px max)
const HANDY_SCALE = {
    sham: 1.1,
    oasespa: 1.21,
    fem: 1.21,
    minicrm: 1.32,
    misterm: 1.21,
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
    const [activeIndex, setActiveIndex] = useState(0);
    const len = projects.length;

    const next = () => setActiveIndex((p) => (p + 1) % len);
    const prev = () => setActiveIndex((p) => (p - 1 + len) % len);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(containerRef.current, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const active = projects[activeIndex];

    return (
        <section
            id="referenzen"
            ref={containerRef}
            className="py-14 md:py-24 bg-white text-black w-full overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase font-roboto">
                        Recent Projects
                    </h2>
                    <h1 className="mt-2 text-3xl leading-tight font-extrabold text-gray-900 sm:text-5xl lg:text-6xl font-roboto">
                        Unsere Referenzen
                    </h1>
                </div>

                {/* Active project info — above the carousel, tight to images */}
                <div className="mb-[-8px] md:mb-[-16px] max-w-3xl mx-auto text-center min-h-[90px] md:min-h-[110px]">
                    <div key={active.slug} className="animate-fade-in-up">
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-center gap-1 sm:gap-4 mb-1 md:mb-2 font-inter">
                            {active.link === '#' ? (
                                <span className="text-xl md:text-2xl font-bold text-gray-900">{active.domain}</span>
                            ) : (
                                <a
                                    href={active.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xl md:text-2xl font-bold text-gray-900 hover:text-red-600 transition-colors"
                                >
                                    {active.domain}
                                </a>
                            )}
                            <span className="text-sm md:text-base font-medium text-gray-500">
                                {active.category}
                            </span>
                        </div>
                        <h4 className="text-xl md:text-3xl font-extrabold text-black font-roboto leading-snug">
                            {active.headline}
                        </h4>
                    </div>
                </div>

                {/* SVG displacement filter for liquid glass refraction */}
                <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    <filter id="liquid-glass-filter" primitiveUnits="objectBoundingBox">
                        <feImage
                            result="map"
                            width="100%"
                            height="100%"
                            x="0"
                            y="0"
                            href="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3CradialGradient id='g' cx='50%25' cy='50%25' r='60%25'%3E%3Cstop offset='0%25' stop-color='%23808080'/%3E%3Cstop offset='100%25' stop-color='%23ffffff'/%3E%3C/radialGradient%3E%3Crect width='100' height='100' fill='url(%23g)'/%3E%3C/svg%3E"
                            preserveAspectRatio="none"
                        />
                        <feGaussianBlur in="SourceGraphic" stdDeviation="0.01" result="blur" />
                        <feDisplacementMap in="blur" in2="map" scale="0.35" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </svg>

                {/* Carousel */}
                <div className="relative" style={{ perspective: '2200px', perspectiveOrigin: '50% 50%' }}>
                    {/* Stage */}
                    <div className="relative h-[260px] sm:h-[380px] md:h-[520px] flex items-center justify-center select-none" style={{ transformStyle: 'preserve-3d' }}>
                        {projects.map((project, index) => {
                            let offset = index - activeIndex;
                            if (offset > len / 2) offset -= len;
                            if (offset < -len / 2) offset += len;
                            const distance = Math.abs(offset);
                            const direction = Math.sign(offset);
                            const isActive = distance === 0;

                            // 3D positioning — cards rotate as they move outward (like a carousel cylinder)
                            const tx = direction * (distance === 1 ? 62 : distance === 2 ? 105 : 150); // % of own width
                            const tz = isActive ? 0 : distance === 1 ? -180 : -360; // depth in px (negative = further back)
                            const rotY = direction * (distance === 1 ? -28 : distance === 2 ? -38 : -42); // degrees
                            const blur = isActive ? 0 : distance === 1 ? 5 : 10;
                            const brightness = isActive ? 1 : distance === 1 ? 0.92 : 0.85;
                            const saturate = isActive ? 1 : distance === 1 ? 0.75 : 0.55;
                            const opacityVal = isActive ? 1 : distance >= 3 ? 0 : 1;
                            const zIndex = 30 - distance;

                            return (
                                <div
                                    key={project.slug}
                                    onClick={() => !isActive && setActiveIndex(index)}
                                    className="absolute top-1/2 left-1/2 w-[77%] md:w-[61%] will-change-transform"
                                    style={{
                                        transform: `translate(-50%, -50%) translate3d(${tx}%, 0, ${tz}px) rotateY(${rotY}deg)`,
                                        filter: `blur(${blur}px) brightness(${brightness}) saturate(${saturate})`,
                                        opacity: opacityVal,
                                        zIndex,
                                        cursor: isActive ? 'default' : 'pointer',
                                        pointerEvents: distance >= 3 ? 'none' : 'auto',
                                        transformStyle: 'preserve-3d',
                                        transformOrigin: '50% 50%',
                                        transition: 'transform 1100ms cubic-bezier(0.22, 1, 0.36, 1), filter 800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 800ms cubic-bezier(0.22, 1, 0.36, 1)',
                                    }}
                                    aria-hidden={!isActive}
                                >
                                    <ProjectCard project={project} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Liquid Glass Nav arrows */}
                    <button
                        onClick={prev}
                        aria-label="Vorheriges Projekt"
                        data-dir="prev"
                        className="liquid-glass-btn absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-16 md:h-16 rounded-full isolate inline-flex items-center justify-center cursor-pointer"
                    >
                        <span className="liquid-glass-lens absolute inset-0 -z-10 rounded-full pointer-events-none" />
                        <span className="liquid-glass-content relative z-10 flex items-center justify-center">
                            <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </span>
                    </button>
                    <button
                        onClick={next}
                        aria-label="Nächstes Projekt"
                        data-dir="next"
                        className="liquid-glass-btn absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-16 md:h-16 rounded-full isolate inline-flex items-center justify-center cursor-pointer"
                    >
                        <span className="liquid-glass-lens absolute inset-0 -z-10 rounded-full pointer-events-none" />
                        <span className="liquid-glass-content relative z-10 flex items-center justify-center">
                            <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </button>
                </div>

                {/* Indicators */}
                <div className="mt-2 md:mt-3 flex justify-center gap-2">
                    {projects.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            aria-label={`Projekt ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-10 bg-red-600' : 'w-1.5 bg-gray-300 hover:bg-gray-400'}`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Portfolio;
