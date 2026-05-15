import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { value: 10, suffix: "+", label: "Projekte abgeschlossen", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.36c-1.38-.07-2.73-.71-3.76-1.74l-2.06-2.06a1.5 1.5 0 010-2.12l4.82-4.83a6 6 0 017.36-5.84c.7.2 1.4.52 2.06.94l2.06 2.06a1.5 1.5 0 010 2.12l-4.64 4.64M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { value: 100, suffix: "%", label: "Kundenzufriedenheit", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg> },
    { value: 3, suffix: "x", label: "Ø Traffic-Steigerung", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg> },
    { value: 48, suffix: "h", label: "Durchschn. Reaktionszeit", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg> },
];

const AnimatedCounter = ({ target, suffix, started }) => {
    const [count, setCount] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!started || hasAnimated.current) return;
        hasAnimated.current = true;
        let current = 0;
        const stepTime = Math.max(20, Math.floor(1200 / target));
        const timer = setInterval(() => {
            current += 1;
            setCount(current);
            if (current >= target) clearInterval(timer);
        }, stepTime);
        return () => clearInterval(timer);
    }, [started, target]);

    return (
        <span>
            {count}
            {suffix}
        </span>
    );
};

const Stats = () => {
    const containerRef = useRef(null);
    const itemRefs = useRef([]);
    const [countersStarted, setCountersStarted] = useState(false);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                itemRefs.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                        onEnter: () => setCountersStarted(true),
                    },
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-16 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            ref={(el) => (itemRefs.current[index] = el)}
                            className="group flex flex-col items-center text-center p-6 rounded-2xl bg-[#f5f5f7] hover:bg-gradient-to-br hover:from-white hover:to-[#f0f0f2] border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                        >
                            <span className="text-3xl mb-2">{stat.icon}</span>
                            <p className="text-4xl md:text-5xl font-extrabold text-gray-900 font-roboto tabular-nums">
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} started={countersStarted} />
                            </p>
                            <p className="mt-2 text-sm md:text-base text-gray-500 font-inter">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
