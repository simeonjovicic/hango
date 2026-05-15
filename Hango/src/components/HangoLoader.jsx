import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import logoSvg from "../assets/hango-logo.svg?raw";

const HangoLoader = ({ onComplete }) => {
    const containerRef = useRef(null);
    const svgWrapperRef = useRef(null);
    const wordTextRef = useRef(null);
    const [removed, setRemoved] = useState(false);

    useEffect(() => {
        if (!svgWrapperRef.current || !containerRef.current) return;

        const svg = svgWrapperRef.current.querySelector("svg");
        if (!svg) return;

        // Make SVG responsive and sized to wrapper
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

        // Compute the actual content bounding box and use it as the viewBox
        // (the source SVG has paths with absolute coords inside a 1254×1254 canvas
        //  with no viewBox, so the logo isn't centered by default)
        try {
            const bbox = svg.getBBox();
            const pad = Math.max(bbox.width, bbox.height) * 0.04;
            svg.setAttribute(
                "viewBox",
                `${bbox.x - pad} ${bbox.y - pad} ${bbox.width + pad * 2} ${bbox.height + pad * 2}`
            );
        } catch (_) {
            // getBBox can fail if the svg isn't rendered yet; ignore
        }

        const paths = Array.from(svg.querySelectorAll("path"));
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const finish = () => {
            gsap.to(containerRef.current, {
                opacity: 0,
                duration: 0.55,
                ease: "power2.out",
                onComplete: () => {
                    setRemoved(true);
                    onComplete?.();
                },
            });
        };

        // Reduced motion: simple fade
        if (reduced) {
            gsap.fromTo(
                [svgWrapperRef.current, wordTextRef.current],
                { opacity: 0, scale: 0.97 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out",
                    stagger: 0.1,
                    onComplete: () => gsap.delayedCall(0.3, finish),
                }
            );
            return;
        }

        // Setup paths: hide fill, prep stroke for drawing
        paths.forEach((p) => {
            const fillColor = p.getAttribute("fill") || "#161515";
            const length = p.getTotalLength();
            p.style.strokeDasharray = String(length);
            p.style.strokeDashoffset = String(length);
            p.style.fill = fillColor;
            p.style.fillOpacity = "0";
            p.style.stroke = fillColor;
            p.style.strokeWidth = "1.2";
            p.style.strokeLinecap = "round";
            p.style.strokeLinejoin = "round";
        });

        // Setup word text for stroke drawing
        const wordText = wordTextRef.current;
        if (wordText) {
            // Approximate dash length (works across browsers; getTotalLength isn't reliable on <text>)
            const dash = 600;
            wordText.style.strokeDasharray = String(dash);
            wordText.style.strokeDashoffset = String(dash);
            wordText.style.fillOpacity = "0";
            wordText.style.opacity = "1";
        }

        const tl = gsap.timeline({ onComplete: finish });

        tl.fromTo(
            svgWrapperRef.current,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
        )
            .to(
                paths,
                {
                    strokeDashoffset: 0,
                    duration: 1.0,
                    ease: "power2.inOut",
                    stagger: { each: 0.004, from: "start" },
                },
                "-=0.3"
            )
            .to(
                paths,
                {
                    fillOpacity: 1,
                    duration: 0.4,
                    ease: "power2.out",
                    stagger: 0.003,
                },
                "-=0.3"
            )
            // Word "Hango" — same draw + fill style
            .fromTo(
                wordTextRef.current,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
                "-=0.2"
            )
            .to(
                wordTextRef.current,
                {
                    strokeDashoffset: 0,
                    duration: 0.75,
                    ease: "power2.inOut",
                },
                "-=0.3"
            )
            .to(
                wordTextRef.current,
                {
                    fillOpacity: 1,
                    duration: 0.35,
                    ease: "power2.out",
                },
                "-=0.2"
            )
            // Hold completed mark briefly before fade out
            .to({}, { duration: 0.25 });
    }, [onComplete]);

    // Lock body scroll while loader visible
    useEffect(() => {
        if (removed) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [removed]);

    if (removed) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-5 sm:gap-6 md:gap-7 bg-white"
            aria-hidden="true"
        >
            <div
                ref={svgWrapperRef}
                className="w-[154px] h-[154px] sm:w-[192px] sm:h-[192px] md:w-[230px] md:h-[230px] drop-shadow-[0_0_40px_rgba(0,0,0,0.04)]"
                style={{ opacity: 0 }}
                dangerouslySetInnerHTML={{ __html: logoSvg }}
            />
            <svg
                viewBox="0 0 360 110"
                className="w-[180px] sm:w-[220px] md:w-[260px] h-auto"
                aria-hidden="true"
            >
                <text
                    ref={wordTextRef}
                    x="50%"
                    y="78"
                    textAnchor="middle"
                    fontFamily="menulis, sans-serif"
                    fontSize="92"
                    fontWeight="400"
                    fill="#161515"
                    stroke="#161515"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: 0 }}
                >
                    Hango
                </text>
            </svg>
        </div>
    );
};

export default HangoLoader;
