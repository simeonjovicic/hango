import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform, useAnimationControls } from "framer-motion";
import MobileCarousel from "./MobileCarousel";

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
        title: "Online Marketing",
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

const CompactServiceCard = ({ service }) => (
    <article className="flex min-h-[320px] flex-col rounded-2xl border border-gray-200/80 bg-[#f5f5f7] p-6 shadow-sm">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm [&_svg]:h-7 [&_svg]:w-7">
            {service.icon}
        </div>
        <h3 className="font-roboto text-xl font-bold leading-snug text-gray-900">{service.title}</h3>
        <p className="mt-1.5 text-sm font-semibold text-red-500">{service.subtitle}</p>
        <p className="mt-4 flex-1 font-inter text-base leading-relaxed text-gray-600">
            {service.description}
        </p>
        <ul className="mt-6 space-y-2.5 border-t border-gray-200/70 pt-5">
            {service.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2.5 text-base font-medium text-gray-800">
                    <svg className="h-5 w-5 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                </li>
            ))}
        </ul>
    </article>
);

const TiltCard = ({ service }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const controls = useAnimationControls();
    const clickAccum = useRef({ count: 0, lastClick: 0, accumulatedFlips: 0 });

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["25deg", "-25deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-25deg", "25deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleClick = async (e) => {
        const now = Date.now();
        const acc = clickAccum.current;

        if (now - acc.lastClick > 900) {
            acc.count = 0;
            acc.accumulatedFlips = 0;
        }
        acc.count += 1;
        acc.lastClick = now;

        const rect = e.currentTarget.getBoundingClientRect();
        const cx = e.clientX - rect.left - rect.width / 2;
        const cy = e.clientY - rect.top - rect.height / 2;
        const dirX = -Math.sign(cx) || 1;
        const dirY = -Math.sign(cy) || 1;

        // SPAM → FLIP: 3rd+ rapid click triggers a full Y-axis flip
        if (acc.count >= 3) {
            acc.accumulatedFlips += 1;
            const totalRotation = 360 * acc.accumulatedFlips * dirX;

            await controls.start({
                x: dirX * 30,
                y: dirY * 20,
                z: -500,
                rotateY: totalRotation,
                rotateZ: dirX * 20,
                scale: 0.72,
                transition: { duration: 0.55, ease: [0.32, 0, 0.4, 1] },
            });
            controls.start({
                x: 0, y: 0, z: 0, rotateY: 0, rotateZ: 0, scale: 1,
                transition: { type: "spring", stiffness: 160, damping: 20, mass: 1.8 },
            });
        } else {
            // TANK PUSH — standhaft: kleiner Push, bouncy return
            const intensity = Math.min(acc.count, 3);
            await controls.start({
                x: dirX * (22 + intensity * 6),
                y: dirY * (16 + intensity * 4),
                z: -(240 + intensity * 50),
                rotateZ: dirX * (7 + intensity * 3),
                scale: 0.88 - intensity * 0.02,
                transition: { duration: 0.28, ease: [0.45, 0, 0.55, 1] },
            });
            // Bouncy spring back — overshoots and settles with weight
            controls.start({
                x: 0, y: 0, z: 0, rotateZ: 0, scale: 1,
                transition: { type: "spring", stiffness: 280, damping: 9, mass: 1.3, restDelta: 0.001 },
            });
        }
    };

    return (
        <motion.div
            onClick={handleClick}
            animate={controls}
            className="relative h-full cursor-pointer"
            style={{ transformStyle: "preserve-3d", height: "100%" }}
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    height: "100%",
                }}
                className="group h-full min-h-[420px] rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 p-[2px] shadow-sm transition-colors duration-500 hover:from-red-400 hover:to-red-600 hover:shadow-xl hover:shadow-red-500/20"
            >
            <div
                className="flex h-full min-h-[416px] flex-col gap-6 rounded-2xl bg-[#f5f5f7] p-7 transition-colors duration-300 group-hover:bg-white md:p-9"
                style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
            >
                <div style={{ transform: "translateZ(40px)" }}>
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 group-hover:border-red-100 group-hover:shadow-md">
                        {service.icon}
                    </div>
                    <h3 className="mb-2 font-roboto text-xl font-bold leading-snug text-gray-900 md:text-2xl">{service.title}</h3>
                    <p className="mb-5 text-sm font-semibold text-red-500">{service.subtitle}</p>
                    <p className="font-inter text-[15px] leading-relaxed text-gray-600 md:text-base">
                        {service.description}
                    </p>
                </div>
                <ul className="mt-auto space-y-3 border-t border-gray-200/70 pt-6" style={{ transform: "translateZ(25px)" }}>
                    {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-sm font-medium text-gray-800 md:text-[15px]">
                            <svg className="h-5 w-5 flex-shrink-0 text-green-500 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
            </motion.div>
        </motion.div>
    );
};

const ServicesDetail = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                cardsRef.current.filter(Boolean),
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
            className="py-12 md:py-24 bg-[#ffffff] text-black w-full overflow-hidden md:perspective-[1000px]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 md:mb-16">
                    <h2 className="text-xs font-bold tracking-wide text-red-500 uppercase md:text-sm">Unsere Expertise</h2>
                    <h1 className="mt-2 px-2 font-roboto text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-[2.75rem] md:text-5xl">
                        Mehr Kunden mit <span className="hango-shine">Hango</span>
                    </h1>
                    <p className="mx-auto mt-3 max-w-2xl px-2 font-inter text-base leading-relaxed text-gray-600 md:mt-4 md:text-xl">
                        Ganzheitliche digitale Lösungen für mehr Sichtbarkeit und nachhaltiges Wachstum.
                    </p>
                </div>

                {isMobile ? (
                    <div ref={(el) => (cardsRef.current[0] = el)}>
                        <MobileCarousel
                            items={services}
                            ariaLabel="Leistungen"
                            renderItem={(service) => (
                                <CompactServiceCard service={service} />
                            )}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:gap-8 lg:gap-10" style={{ perspective: "1500px" }}>
                        {services.map((service, index) => (
                            <div key={index} ref={(el) => (cardsRef.current[index] = el)} className="min-h-[420px]">
                                <TiltCard service={service} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ServicesDetail;
