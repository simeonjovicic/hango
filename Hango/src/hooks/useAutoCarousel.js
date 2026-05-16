import { useState, useEffect, useCallback, useRef } from "react";

export function useAutoCarousel(itemCount, { interval = 5500, enabled = true } = {}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const pausedRef = useRef(false);

    const next = useCallback(() => {
        if (itemCount <= 1) return;
        setDirection(1);
        setActiveIndex((i) => (i + 1) % itemCount);
    }, [itemCount]);

    const prev = useCallback(() => {
        if (itemCount <= 1) return;
        setDirection(-1);
        setActiveIndex((i) => (i - 1 + itemCount) % itemCount);
    }, [itemCount]);

    const goTo = useCallback(
        (index) => {
            if (itemCount <= 1) return;
            setActiveIndex((current) => {
                setDirection(index >= current ? 1 : -1);
                return index;
            });
        },
        [itemCount]
    );

    useEffect(() => {
        if (!enabled || itemCount <= 1) return undefined;

        const id = window.setInterval(() => {
            if (pausedRef.current) return;
            next();
        }, interval);

        return () => window.clearInterval(id);
    }, [enabled, interval, itemCount, next]);

    const pause = useCallback(() => {
        pausedRef.current = true;
    }, []);

    const resume = useCallback(() => {
        pausedRef.current = false;
    }, []);

    return { activeIndex, direction, next, prev, goTo, pause, resume };
}
