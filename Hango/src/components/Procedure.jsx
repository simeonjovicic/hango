import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        number: "01",
        title: "Kostenlose Erstberatung",
        description:
            "In einem unverbindlichen Gespräch analysieren wir den Ist-Zustand Ihrer Online-Präsenz. Gemeinsam besprechen wir Ihre Ziele, Erwartungen und den Umfang des Projekts — und Sie erhalten ein maßgeschneidertes Angebot.",
    },
    {
        number: "02",
        title: "Strategie & Konzept",
        description:
            "Wir analysieren Ihre Zielgruppe und erarbeiten eine klare digitale Strategie. Anhand eines Prototyps sehen Sie bereits, wie Ihre neue Website aufgebaut sein wird — bevor eine einzige Zeile Code geschrieben wird.",
    },
    {
        number: "03",
        title: "Design & Entwicklung",
        description:
            "Ihr Designentwurf wird so lange verfeinert, bis jedes Detail stimmt. Danach entwickeln wir Ihre Website responsive, schnell und SEO-optimiert. Kleine Animationen und durchdachte Details verleihen ihr das gewisse Etwas.",
    },
    {
        number: "04",
        title: "Go-Live & Betreuung",
        description:
            "Wir zeigen Ihnen, wie Sie Ihre Website selbst verwalten — kein technisches Know-how nötig. Dann schalten wir gemeinsam live. Danach bleiben wir an Ihrer Seite für Wartung, Updates und Marketing.",
    },
];

const Procedure = () => {
    const containerRef = useRef(null);
    const progressLineRef = useRef(null);
    const mobileStepRefs = useRef([]);
    const desktopStepRefs = useRef([]);
    const dotRefs = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add("(min-width: 1024px)", () => {
                if (!progressLineRef.current || !containerRef.current) return;

                gsap.fromTo(
                    progressLineRef.current,
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top 40%",
                            end: "bottom 60%",
                            scrub: true,
                        },
                    }
                );

                desktopStepRefs.current.forEach((step) => {
                    if (!step) return;
                    gsap.fromTo(
                        step,
                        { opacity: 0, y: 60, scale: 0.97 },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.8,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: step,
                                start: "top 85%",
                                toggleActions: "play none none reverse",
                            },
                        }
                    );
                });

                dotRefs.current.forEach((dot) => {
                    if (!dot) return;
                    gsap.fromTo(
                        dot,
                        { scale: 0 },
                        {
                            scale: 1,
                            duration: 0.5,
                            ease: "back.out(3)",
                            scrollTrigger: {
                                trigger: dot,
                                start: "top 80%",
                                toggleActions: "play none none reverse",
                            },
                        }
                    );
                });
            });

            mm.add("(max-width: 1023px)", () => {
                mobileStepRefs.current.forEach((step) => {
                    if (!step) return;
                    gsap.fromTo(
                        step,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: step,
                                start: "top 90%",
                                toggleActions: "play none none none",
                            },
                        }
                    );
                });
            });
        }, containerRef);

        const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
            cancelAnimationFrame(refreshId);
            ctx.revert();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="py-16 md:py-32 relative w-full bg-[#f5f5f7] text-black"
            id="ablauf"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ===== MOBILE LAYOUT ===== */}
                <div className="block lg:hidden">
                    {/* Mobile Header */}
                    <div className="text-center mb-10">
                        <p className="text-xs font-bold tracking-wide text-red-500 uppercase mb-2 font-inter">
                            Projektablauf
                        </p>
                        <h1 className="mb-3 font-roboto text-2xl font-extrabold leading-tight text-gray-900">
                            Ihre Website in{" "}
                            <span className="text-red-500">4 Schritten</span>
                        </h1>
                        <p className="mx-auto max-w-sm font-inter text-sm leading-relaxed text-gray-500">
                            Größtmöglicher Mehrwert, kleinstmöglicher Zeitaufwand.
                        </p>
                    </div>

                    {/* Mobile Steps — simple stacked cards */}
                    <div className="flex flex-col gap-5">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                ref={(el) => (mobileStepRefs.current[index] = el)}
                                className="bg-[#1a1a2e] rounded-xl p-4 sm:p-5 shadow-md border border-gray-800"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-roboto text-xl font-extrabold text-red-500">{step.number}</span>
                                    <h3 className="font-roboto text-lg font-bold text-white">{step.title}</h3>
                                </div>
                                <p className="font-inter text-sm leading-relaxed text-gray-400">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== DESKTOP LAYOUT ===== */}
                <div className="hidden lg:flex flex-row gap-20">

                    {/* LEFT — Sticky Header */}
                    <div className="w-[38%] sticky top-32 self-start">
                        <p className="text-sm font-bold tracking-wide text-red-500 uppercase mb-3 font-inter">
                            // Projektablauf
                        </p>
                        <h1 className="text-[3.5rem] font-extrabold text-gray-900 font-roboto leading-tight mb-6">
                            Ihre Website in{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10 text-white">4 Schritten</span>
                                <span className="absolute inset-0 bg-red-500 -skew-y-1 rounded-md z-0 opacity-90" />
                            </span>
                        </h1>
                        <p className="text-gray-500 text-xl font-inter leading-relaxed max-w-md">
                            Unser Prozess ist so aufgebaut, dass Sie den größtmöglichen Mehrwert für den kleinstmöglichen Zeitaufwand bekommen.
                        </p>
                    </div>

                    {/* RIGHT — Scrolling Steps with vertical line */}
                    <div className="w-[62%] relative">
                        {/* Vertical line track */}
                        <div className="absolute left-7 top-0 bottom-0 w-[2px] bg-gray-300 rounded-full" />
                        <div
                            ref={progressLineRef}
                            className="absolute left-7 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-500 to-red-600 rounded-full origin-top"
                            style={{ scaleY: 0 }}
                        />

                        <div className="flex flex-col gap-16">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="relative flex items-start gap-8"
                                >
                                    {/* Dot on the line */}
                                    <div
                                        ref={(el) => (dotRefs.current[index] = el)}
                                        className="relative z-10 shrink-0 w-14 h-14 rounded-full bg-white border-[3px] border-red-500 flex items-center justify-center shadow-lg"
                                    >
                                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>

                                    {/* Step Card */}
                                    <div
                                        ref={(el) => (desktopStepRefs.current[index] = el)}
                                        className="flex-1 bg-[#1a1a2e] rounded-2xl p-8 shadow-lg border border-gray-800 hover:border-red-500/30 hover:shadow-xl transition-all duration-300 group"
                                    >
                                        <p className="text-red-500 text-4xl font-extrabold font-roboto mb-3">
                                            {step.number}
                                        </p>
                                        <h3 className="text-2xl font-bold text-white font-roboto mb-3 group-hover:text-red-400 transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-400 font-inter leading-relaxed text-lg">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Procedure;
