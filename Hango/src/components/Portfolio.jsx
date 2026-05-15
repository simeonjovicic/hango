import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        slug: 'sham',
        domain: 'shamsweets.at',
        category: 'Food & E-Commerce',
        headline: 'Authentischer Geschmack, online erlebbar gemacht.',
        link: 'https://shamsweets.at',
        testimonial: '"Wir haben seit dem Launch unserer neuen Webseite deutlich mehr Bestellungen erhalten. Hango hat einen unglaublichen Job gemacht!"',
        author: '— Inhaber, Sham Sweets',
    },
    {
        slug: 'oasespa',
        domain: 'oasespa.at',
        category: 'Health & Beauty',
        headline: 'Digitale Ruheoase für entspannte Kunden.',
        link: 'https://oasespa.at',
        testimonial: '"Unsere Online-Buchungen haben sich verdoppelt. Die neue Website wirkt professioneller und zieht genau die richtigen Kunden an."',
        author: '— Inhaberin, Oase Spa',
    },
    {
        slug: 'choo',
        domain: 'choo.at',
        category: 'Lifestyle & Brand',
        headline: 'Ein digitaler Auftritt mit Charakter.',
        link: '#',
    },
    {
        slug: 'fem',
        domain: 'fem.at',
        category: 'Beauty & Wellness',
        headline: 'Eleganz, die online genauso wirkt wie im Studio.',
        link: '#',
    },
    {
        slug: 'minicrm',
        domain: 'minicrm.at',
        category: 'SaaS & Business Tool',
        headline: 'Kundenmanagement, einfach und übersichtlich.',
        link: '#',
    },
    {
        slug: 'misterm',
        domain: 'misterm.at',
        category: 'Service & Handwerk',
        headline: 'Vertrauen schaffen mit klarer Online-Präsenz.',
        link: '#',
    },
];

const ProjectCard = ({ project }) => (
    <div className="relative w-full">
        {/* Safari Browser Mockup */}
        <div className="w-full rounded-t-xl md:rounded-t-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] bg-white">
            {/* Safari Top Bar */}
            <div className="h-8 md:h-11 w-full bg-gradient-to-b from-[#f6f6f6] to-[#e8e8e8] flex items-center px-3 md:px-4 border-b border-[#d1d1d1] shrink-0">
                <div className="flex gap-1.5 md:gap-2 shrink-0">
                    <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] shadow-sm" />
                    <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[#febc2e] border border-[#dea123] shadow-sm" />
                    <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[#28c840] border border-[#1aab29] shadow-sm" />
                </div>
                <div className="flex-1 max-w-[55%] md:max-w-md mx-auto bg-white rounded-md md:rounded-lg h-5 md:h-7 flex items-center justify-center px-2 md:px-3 text-[#3c3c3c] text-[10px] md:text-xs font-medium font-mono truncate border border-[#d1d1d1] shadow-inner">
                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1 md:mr-1.5 text-[#888] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                    </svg>
                    <span className="truncate">{project.domain}</span>
                </div>
                <div className="w-8 md:w-14 shrink-0" />
            </div>

            {/* Browser Content */}
            <div className="w-full bg-white">
                <img
                    src={`/portfolio/${project.slug}-browser.png`}
                    alt={`Desktop view of ${project.domain}`}
                    className="block w-full h-auto"
                    loading="lazy"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
            </div>
        </div>

        {/* iPhone Mockup */}
        <div
            className="hidden md:block absolute right-[4%] -bottom-8 w-[22%] max-w-[230px] z-20 drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)]"
            style={{ aspectRatio: '852 / 1846' }}
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
    </div>
);

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
                <div className="mb-10 md:mb-16">
                    <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase font-roboto">
                        Recent Projects
                    </h2>
                    <h1 className="mt-2 text-3xl leading-tight font-extrabold text-gray-900 sm:text-5xl lg:text-6xl font-roboto">
                        Unsere Referenzen
                    </h1>
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
                    <div className="relative h-[320px] sm:h-[460px] md:h-[640px] flex items-center justify-center select-none" style={{ transformStyle: 'preserve-3d' }}>
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
                                    className="absolute top-1/2 left-1/2 w-[85%] md:w-[68%] will-change-transform"
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
                <div className="mt-8 md:mt-12 flex justify-center gap-2">
                    {projects.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            aria-label={`Projekt ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-10 bg-red-600' : 'w-1.5 bg-gray-300 hover:bg-gray-400'}`}
                        />
                    ))}
                </div>

                {/* Active project details */}
                <div className="mt-10 md:mt-14 max-w-3xl mx-auto">
                    <div key={active.slug} className="animate-fade-in-up text-center">
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-center gap-2 sm:gap-4 mb-3 font-inter">
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

                        <h4 className="text-2xl md:text-4xl font-extrabold text-black mb-6 md:mb-8 font-roboto leading-snug">
                            {active.headline}
                        </h4>

                        {active.link !== '#' && (
                            <a
                                href={active.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-red-600 font-semibold font-inter hover:translate-x-2 transition-transform duration-300"
                            >
                                <span className="text-base md:text-lg">View project</span>
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        )}

                        {active.testimonial && (
                            <div className="mt-6 md:mt-8 border-l-4 border-red-500 pl-4 md:pl-5 text-left max-w-2xl mx-auto">
                                <p className="text-gray-600 italic font-inter text-sm md:text-lg leading-relaxed">{active.testimonial}</p>
                                <p className="mt-1 md:mt-2 text-xs md:text-sm font-semibold text-gray-900">{active.author}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
