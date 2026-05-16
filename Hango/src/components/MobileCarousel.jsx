import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAutoCarousel } from "../hooks/useAutoCarousel";

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction > 0 ? "-100%" : "100%",
        opacity: 0,
    }),
};

const MobileCarousel = ({
    items,
    renderItem,
    interval = 5500,
    className = "",
    autoPlay = true,
    ariaLabel = "Karussell",
}) => {
    const { activeIndex, direction, next, prev, goTo, pause, resume } = useAutoCarousel(items.length, {
        interval,
        enabled: autoPlay && items.length > 1,
    });
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!autoPlay || items.length <= 1) return undefined;

        setProgress(0);
        const started = performance.now();
        let frameId = 0;

        const tick = (now) => {
            const elapsed = now - started;
            setProgress(Math.min(100, (elapsed / interval) * 100));
            if (elapsed < interval) {
                frameId = requestAnimationFrame(tick);
            }
        };

        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [activeIndex, autoPlay, interval, items.length]);

    if (!items.length) return null;

    return (
        <motion.div
            className={`relative ${className}`}
            aria-roledescription="carousel"
            aria-label={ariaLabel}
            onPointerDown={pause}
            onPointerUp={resume}
            onPointerLeave={resume}
            onPointerCancel={resume}
        >
            <div className="relative min-h-[340px] overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={activeIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
                    >
                        {renderItem(items[activeIndex], activeIndex)}
                    </motion.div>
                </AnimatePresence>
            </div>

            {items.length > 1 && (
                <motion.div
                    className="mt-4 flex items-center gap-3"
                    initial={false}
                >
                    <button
                        type="button"
                        onClick={prev}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-red-200 hover:text-red-500"
                        aria-label="Vorheriger Eintrag"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="min-w-0 flex-1">
                        <div className="carousel-progress-shell">
                            <div
                                className="carousel-progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="mt-2 flex justify-center gap-1.5">
                            {items.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => goTo(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        index === activeIndex
                                            ? "w-5 bg-red-500"
                                            : "w-1.5 bg-gray-300 hover:bg-gray-400"
                                    }`}
                                    aria-label={`Eintrag ${index + 1}`}
                                    aria-current={index === activeIndex ? "true" : undefined}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={next}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-red-200 hover:text-red-500"
                        aria-label="Nächster Eintrag"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default MobileCarousel;
