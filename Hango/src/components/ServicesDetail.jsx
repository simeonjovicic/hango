import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        icon: (
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
        ),
        title: "Suchmaschinenoptimierung (SEO)",
        subtitle: "Local & E-Commerce SEO",
        description: "Wir helfen Ihnen, bei Google auf den ersten Plätzen zu landen. Mehr organische Besucher bedeuten mehr potenzielle Kunden für Ihr Geschäft.",
        features: ["On-Page & Off-Page SEO", "Keyword-Recherche", "Technisches SEO"],
    },
    {
        icon: (
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
        ),
        title: "Performance Marketing",
        subtitle: "Meta & Google Ads",
        description: "Erreichen Sie Ihre genaue Zielgruppe mit profitablen Werbekampagnen. Wir managen Ihr Budget so, dass sich jeder Cent in Reichweite verwandelt.",
        features: ["Targeted Ads Setup", "A/B Testing", "Conversion Tracking"],
    },
    {
        icon: (
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        title: "Webentwicklung & UI/UX",
        subtitle: "Maßgeschneiderte Webseiten",
        description: "Schnelle, sichere und conversion-optimierte Webseiten, die nicht nur gut aussehen, sondern Ihre Besucher auch zu echten Kunden machen.",
        features: ["Responsive Design", "Schnelle Ladezeiten", "Wartung & Hosting"],
    },
];

const ServicesDetail = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                cardsRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.2,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="services"
            ref={containerRef}
            className="py-24 bg-[#ffffff] text-black w-full"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold tracking-wide text-red-500 uppercase">Unsere Expertise</h2>
                    <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl font-roboto">
                        Mehr Kunden mit <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Hango</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto font-inter">
                        Wir bieten ganzheitliche digitale Lösungen, um Ihre Präsenz im Internet zu maximieren und Ihren Umsatz nachhaltig zu steigern.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            ref={(el) => (cardsRef.current[index] = el)}
                            className="relative group rounded-2xl p-[2px] bg-gradient-to-br from-gray-200 to-gray-300 hover:from-red-400 hover:to-red-600 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-red-500/10"
                        >
                            <div className="h-full bg-[#f5f5f7] group-hover:bg-white rounded-2xl p-8 flex flex-col justify-between transition-colors duration-300">
                                <div>
                                    <div className="mb-5 w-14 h-14 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:shadow-md group-hover:border-red-100 transition-all duration-300">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1 font-roboto">{service.title}</h3>
                                    <p className="text-sm font-semibold text-red-500 mb-4">{service.subtitle}</p>
                                    <p className="text-gray-600 mb-6 font-inter leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                                <ul className="space-y-3">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="flex items-start text-gray-800 font-medium">
                                            <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesDetail;
