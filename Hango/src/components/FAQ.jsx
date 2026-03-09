import React, { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
    {
        question: "Warum braucht mein Unternehmen SEO?",
        answer: "SEO (Suchmaschinenoptimierung) ist entscheidend, um in Google und anderen Suchmaschinen sichtbar zu sein. Egal ob lokales Geschäft oder Onlineshop – wer nicht auf der ersten Seite steht, verliert potenzielle Kunden an die Konkurrenz. Mit SEO verbessern Sie Ihre Online-Präsenz nachhaltig.",
    },
    {
        question: "Wie lange dauert es, bis SEO Ergebnisse zeigt?",
        answer: "SEO ist ein langfristiger Prozess. Erste Verbesserungen können oft schon nach wenigen Wochen sichtbar werden, aber signifikante Steigerungen des Traffics und Top-Rankings benötigen in der Regel 3 bis 6 Monate konsequenter Optimierung.",
    },
    {
        question: "Was ist der Unterschied zwischen Webdesign und Conversion-Rate Optimierung (CRO)?",
        answer: "Webdesign fokussibt sich auf die Ästhetik und Nutzerführung einer Website. CRO hingegen optimiert diese Elemente durch datengesteuerte Tests so, dass ein möglichst hoher Anteil der Besucher auch tatsächlich anfragt oder kauft. Wir kombinieren beides von Anfang an.",
    },
    {
        question: "Warum sollte ich Hango anstelle eines Freelancers wählen?",
        answer: "Wir sind eine Full-Service Digitalagentur. Statt nur eine Webseite 'hinzustellen', betrachten wir Ihr gesamtes digitales Ökosystem. Von schnellen Ladezeiten über Google Ads bis hin zu erstklassigem SEO – bei uns bekommen Sie alles gebündelt und professionell gemanagt.",
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const containerRef = useRef(null);
    const itemsRef = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                itemsRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.15,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" ref={containerRef} className="py-24 bg-[#f5f5f7] text-black w-full">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-roboto">
                        Häufig gestellte Fragen (FAQ)
                    </h2>
                    <p className="mt-4 text-xl text-gray-600 font-inter">
                        Alles, was Sie über unsere Dienstleistungen wissen müssen.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            ref={(el) => (itemsRef.current[index] = el)}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300"
                        >
                            <button
                                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span className="font-semibold text-lg text-gray-900 font-roboto">{faq.question}</span>
                                <span className="ml-6 flex-shrink-0">
                                    <svg
                                        className={`w-6 h-6 text-red-500 transform transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                            }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>

                            <div
                                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <p className="text-gray-600 font-inter text-base">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
