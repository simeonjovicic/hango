import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        domain: 'shamsweets.at',
        category: 'Food & E-Commerce',
        headline: 'Authentischer Geschmack, online erlebbar gemacht.',
        link: 'https://shamsweets.at',
        desktopImg: '/portfolio/shamsweets-desktop.png',
        mobileImg: '/portfolio/shamsweets-mobile.png',
        testimonial: '"Wir haben seit dem Launch unserer neuen Webseite deutlich mehr Bestellungen erhalten. Hango hat einen unglaublichen Job gemacht!"',
        author: '— Inhaber, Sham Sweets',
    },
    {
        domain: 'oasespa.at',
        category: 'Health & Beauty',
        headline: 'Digitale Ruheoase für entspannte Kunden.',
        link: 'https://oasespa.at',
        desktopImg: '/portfolio/oasespa-desktop.png',
        mobileImg: '/portfolio/oasespa-mobile.png',
        testimonial: '"Unsere Online-Buchungen haben sich verdoppelt. Die neue Website wirkt professioneller und zieht genau die richtigen Kunden an."',
        author: '— Inhaberin, Oase Spa',
    }
];

const Portfolio = () => {
    const containerRef = useRef(null);
    const projectRefs = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Animate projects coming into view
            gsap.fromTo(
                projectRefs.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.3,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 70%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="referenzen" ref={containerRef} className="py-24 bg-[#ffffff] text-black w-full min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="mb-20">
                    <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase font-roboto">
                        Recent Projects
                    </h2>
                    <h1 className="mt-2 text-4xl leading-tight font-extrabold text-gray-900 sm:text-5xl lg:text-6xl font-roboto">
                        Unsere Referenzen
                    </h1>
                </div>

                {/* Projects Grid */}
                <div className="flex flex-col gap-24">
                    {projects.map((project, index) => (
                        <a
                            key={index}
                            href={project.link}
                            target="_blank"
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

                            <h4 className="text-2xl md:text-4xl font-extrabold text-black mb-8 font-roboto max-w-3xl leading-snug">
                                {project.headline}
                            </h4>

                            {/* Composition Container (Hover Trigger) */}
                            <div className={`group w-full pt-[65%] md:pt-[50%] rounded-t-[2rem] overflow-hidden relative bg-gray-200/50 backdrop-blur-xl border border-white/60 border-b-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500`}>

                                {/* Desktop Browser Mockup */}
                                <div className="absolute inset-x-4 top-4 -bottom-4 md:inset-x-10 md:top-10 transform scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out flex flex-col origin-bottom">
                                    <div className="w-full h-full bg-[#1e1e1e] rounded-t-xl md:rounded-t-2xl flex flex-col shadow-2xl overflow-hidden border border-[#333] border-b-0">

                                        {/* Browser Top Bar */}
                                        <div className="h-7 md:h-10 w-full bg-[#323233] flex items-center px-3 md:px-4 border-b border-[#222] shrink-0">
                                            {/* Window Controls */}
                                            <div className="flex gap-1.5 md:gap-2 shrink-0">
                                                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#5f5f5f]"></div>
                                                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#5f5f5f]"></div>
                                                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#5f5f5f]"></div>
                                            </div>
                                            {/* URL Bar */}
                                            <div className="flex-1 max-w-[60%] md:max-w-md mx-auto bg-[#1e1e1e] rounded h-4 md:h-6 flex items-center px-2 md:px-3 text-[#888] text-[9px] md:text-xs font-mono truncate">
                                                https://{project.domain}
                                            </div>
                                            <div className="w-6 md:w-12 shrink-0"></div> {/* Spacer */}
                                        </div>

                                        {/* Browser Content */}
                                        <div className="flex-1 w-full bg-white relative overflow-hidden">
                                            <img
                                                src={project.desktopImg}
                                                alt={`Desktop view of ${project.domain}`}
                                                className="w-full h-auto min-h-full object-cover object-top opacity-95 group-hover:opacity-100 transition-opacity"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = `<div class="w-full h-full flex flex-col items-center justify-center text-gray-500 text-xs md:text-lg font-bold bg-gray-100 p-4 text-center">Screenshot missing<br/><span class="font-normal text-xs">public/portfolio/${project.domain.split('.')[0]}-desktop.png</span></div>`;
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Mockup (iPhone Style) */}
                                <div className="absolute -bottom-4 right-[5%] w-[26%] min-w-[100px] h-[90%] bg-black rounded-t-[2rem] md:rounded-t-[2.5rem] border-[6px] md:border-[10px] border-black border-b-0 shadow-2xl overflow-hidden transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out z-20 origin-bottom flex flex-col">
                                    {/* Dynamic Island / Notch */}
                                    <div className="absolute top-0 inset-x-0 flex justify-center z-30 pointer-events-none">
                                        <div className="w-[45%] h-[14px] md:h-[20px] bg-black rounded-b-xl md:rounded-b-2xl"></div>
                                    </div>
                                    <div className="flex-1 w-full bg-white relative overflow-hidden rounded-t-[1.2rem] md:rounded-t-[1.8rem]">
                                        <img
                                            src={project.mobileImg}
                                            alt={`Mobile view of ${project.domain}`}
                                            className="absolute top-0 left-0 w-full h-auto min-h-full object-cover object-top"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                </div>

                                {/* Overlay to dim slightly until hover */}
                                <div className="absolute inset-x-0 top-0 bottom-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none rounded-t-[2rem]" />
                            </div>

                            {/* Bottom "View Project" link */}
                            <div className="mt-8 flex items-center text-red-600 font-semibold font-inter hover:translate-x-2 transition-transform duration-300">
                                <span className="text-lg">View project</span>
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>

                            {/* Testimonial */}
                            {project.testimonial && (
                                <div className="mt-6 border-l-4 border-red-500 pl-5">
                                    <p className="text-gray-600 italic font-inter text-base md:text-lg leading-relaxed">{project.testimonial}</p>
                                    <p className="mt-2 text-sm font-semibold text-gray-900">{project.author}</p>
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
