import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { value: 10, suffix: "+", label: "Projekte abgeschlossen", icon: "🚀" },
    { value: 100, suffix: "%", label: "Kundenzufriedenheit", icon: "⭐" },
    { value: 3, suffix: "x", label: "Ø Traffic-Steigerung", icon: "📈" },
    { value: 48, suffix: "h", label: "Durchschn. Reaktionszeit", icon: "⚡" },
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
