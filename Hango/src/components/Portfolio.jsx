import React, { useRef, useLayoutEffect } from 'react';
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

const Portfolio = () => {
    const containerRef = useRef(null);
    const projectRefs = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                projectRefs.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.2,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 70%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="referenzen" ref={containerRef} className="py-14 md:py-24 bg-white text-black w-full min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="mb-10 md:mb-20">
                    <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase font-roboto">
                        Recent Projects
                    </h2>
                    <h1 className="mt-2 text-3xl leading-tight font-extrabold text-gray-900 sm:text-5xl lg:text-6xl font-roboto">
                        Unsere Referenzen
                    </h1>
                </div>

                {/* Projects Grid */}
                <div className="flex flex-col gap-16 md:gap-28">
                    {projects.map((project, index) => (
                        <a
                            key={project.slug}
                            href={project.link}
                            target={project.link === '#' ? undefined : '_blank'}
                            rel="noopener noreferrer"
                            ref={(el) => (projectRefs.current[index] = el)}
                            className="flex flex-col items-start w-full cursor-pointer"
                        >
                            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-4 font-inter">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 transition-colors">
                                    {project.domain}
                                </h3>
                                <span className="text-sm md:text-base font-medium text-gray-500">
                                    {project.category}
                                </span>
                            </div>

                            <h4 className="text-xl md:text-4xl font-extrabold text-black mb-6 md:mb-10 font-roboto max-w-3xl leading-snug">
                                {project.headline}
                            </h4>

                            {/* Composition Container — no outer grey frame */}
                            <div className="group w-full relative">

                                {/* Safari Browser Mockup */}
                                <div className="w-full rounded-t-xl md:rounded-t-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] bg-white transform transition-transform duration-700 ease-out group-hover:-translate-y-1">

                                    {/* Safari Top Bar (light, colored) */}
                                    <div className="h-8 md:h-11 w-full bg-gradient-to-b from-[#f6f6f6] to-[#e8e8e8] flex items-center px-3 md:px-4 border-b border-[#d1d1d1] shrink-0">
                                        {/* Traffic Light Window Controls */}
                                        <div className="flex gap-1.5 md:gap-2 shrink-0">
                                            <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] shadow-sm" />
                                            <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[#febc2e] border border-[#dea123] shadow-sm" />
                                            <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[#28c840] border border-[#1aab29] shadow-sm" />
                                        </div>
                                        {/* URL Bar */}
                                        <div className="flex-1 max-w-[55%] md:max-w-md mx-auto bg-white rounded-md md:rounded-lg h-5 md:h-7 flex items-center justify-center px-2 md:px-3 text-[#3c3c3c] text-[10px] md:text-xs font-medium font-mono truncate border border-[#d1d1d1] shadow-inner">
                                            <svg className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1 md:mr-1.5 text-[#888] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                                            </svg>
                                            <span className="truncate">{project.domain}</span>
                                        </div>
                                        <div className="w-8 md:w-14 shrink-0" />
                                    </div>

                                    {/* Browser Content — natural height, no stretching */}
                                    <div className="w-full bg-white">
                                        <img
                                            src={`/portfolio/${project.slug}-browser.png`}
                                            alt={`Desktop view of ${project.domain}`}
                                            className="block w-full h-auto"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* iPhone Mockup — real frame PNG overlay */}
                                <div
                                    className="hidden md:block absolute right-[4%] -bottom-8 w-[22%] max-w-[230px] z-20 transform translate-y-2 group-hover:-translate-y-1 transition-transform duration-700 ease-out drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)]"
                                    style={{ aspectRatio: '852 / 1846' }}
                                >
                                    {/* Screen content — inset to fit inside frame's screen window so the image is ~40% smaller than the frame */}
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

                                    {/* Frame on top */}
                                    <img
                                        src="/portfolio/iphone-frame.png"
                                        alt=""
                                        aria-hidden="true"
                                        className="relative w-full h-full pointer-events-none select-none"
                                    />
                                </div>
                            </div>

                            {/* Bottom "View Project" link */}
                            <div className="mt-6 md:mt-10 flex items-center text-red-600 font-semibold font-inter group-hover:translate-x-2 transition-transform duration-300">
                                <span className="text-base md:text-lg">View project</span>
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>

                            {/* Testimonial */}
                            {project.testimonial && (
                                <div className="mt-4 md:mt-6 border-l-4 border-red-500 pl-4 md:pl-5">
                                    <p className="text-gray-600 italic font-inter text-sm md:text-lg leading-relaxed">{project.testimonial}</p>
                                    <p className="mt-1 md:mt-2 text-xs md:text-sm font-semibold text-gray-900">{project.author}</p>
                                </div>
                            )}
                        </a>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Portfolio;
