import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TeamStory = () => {
    const containerRef = useRef(null);
    const leftRef = useRef(null);
    const rightRef = useRef(null);

    useLayoutEffect(() => {
        const isMobile = window.innerWidth < 768;
        const ctx = gsap.context(() => {
            if (isMobile) {
                // Mobile: simple sequential fade up
                gsap.fromTo(leftRef.current, { opacity: 0, y: 30 }, {
                    opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
                    scrollTrigger: { trigger: containerRef.current, start: "top 85%", toggleActions: "play none none none" },
                });
                gsap.fromTo(rightRef.current, { opacity: 0, y: 30 }, {
                    opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2,
                    scrollTrigger: { trigger: rightRef.current, start: "top 90%", toggleActions: "play none none none" },
                });
            } else {
                // Desktop: slide from sides
                const tl = gsap.timeline({
                    scrollTrigger: { trigger: containerRef.current, start: "top 70%", toggleActions: "play none none reverse" },
                });
                tl.fromTo(leftRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" })
                  .fromTo(rightRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" }, "-=0.6");
            }
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-14 md:py-24 bg-[#f5f5f7] w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Label */}
                <p className="text-xs md:text-sm font-bold tracking-wide text-red-500 uppercase mb-2 text-center">Wer steckt dahinter</p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 font-roboto text-center mb-10 md:mb-16 leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Zwei Menschen.</span>
                </h2>

                <div className="flex flex-col md:flex-row gap-6 md:gap-16 items-stretch">

                    {/* Left — Story Card */}
                    <div ref={leftRef} className="flex-1 bg-white rounded-2xl p-6 md:p-10 shadow-md border border-gray-100 flex flex-col justify-between">
                        <div>
                            {/* Avatars */}
                            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                                <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-lg md:text-xl shadow">H</div>
                                <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-lg md:text-xl shadow">S</div>
                                <div className="ml-1 md:ml-2">
                                    <p className="font-bold text-gray-900 text-base md:text-lg font-roboto">Hanxiang &amp; Simeon</p>
                                    <p className="text-xs md:text-sm text-gray-500">Gründer · Hango Digital</p>
                                </div>
                            </div>

                            {/* Story */}
                            <blockquote className="text-gray-700 text-base md:text-xl font-inter leading-relaxed border-l-4 border-red-500 pl-4 md:pl-5 mb-4 md:mb-6">
                                „Wir sind beide in der letzten Klasse der HTL Spengergasse in Wien — und haben beschlossen, unsere Leidenschaft für Webdesign und digitales Marketing nicht nur als Hobby zu betreiben."
                            </blockquote>
                            <p className="text-gray-600 font-inter leading-relaxed text-sm md:text-base">
                                Was bei Hango anders ist: Ihr habt immer einen direkten Draht zu uns. Keine anonymen Tickets, keine weitergereichten E-Mails. Eure Anfrage landet bei denen, die auch wirklich daran arbeiten.
                            </p>
                        </div>

                        <div className="mt-8 flex items-center gap-3">
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">HTL Spengergasse · Wien</span>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200">Abschlussklasse 2026</span>
                        </div>
                    </div>

                    {/* Right — Values */}
                    <div ref={rightRef} className="flex-1 flex flex-col gap-2 md:gap-6">
                        {[
                            {
                                icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
                                title: "Persönlicher Kontakt",
                                desc: "Ihr redet immer direkt mit uns — nicht mit einem Support-Bot oder einer Hotline.",
                            },
                            {
                                icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>,
                                title: "Echte Leidenschaft",
                                desc: "Webdesign und Marketing ist nicht unser Job, es ist das, womit wir aufgewachsen sind.",
                            },
                            {
                                icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
                                title: "Junges Mindset",
                                desc: "Wir kennen aktuelle Trends aus erster Hand — kein veraltetes Agentur-Denken.",
                            },
                            {
                                icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
                                title: "Messbare Ergebnisse",
                                desc: "Wir liefern nicht nur schöne Webseiten, sondern auch Traffic, Leads und Umsatz.",
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2.5 md:items-start md:gap-4 bg-white rounded-lg md:rounded-xl p-3 md:p-5 border border-gray-100 shadow-sm md:hover:shadow-md md:hover:border-red-100 transition-all duration-300">
                                <span className="shrink-0 flex items-center justify-center bg-red-50 p-1.5 md:p-2.5 rounded-md md:rounded-lg border border-red-100 [&_svg]:w-4 [&_svg]:h-4 md:[&_svg]:w-6 md:[&_svg]:h-6">
                                    {item.icon}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-gray-900 font-roboto text-sm md:text-base leading-snug">{item.title}</p>
                                    <p className="text-gray-500 text-xs md:text-sm font-inter mt-0.5 md:mt-1 leading-snug">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TeamStory;
