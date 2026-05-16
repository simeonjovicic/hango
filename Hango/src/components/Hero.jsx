import { useState, useEffect, useMemo, useRef } from "react";
import {
  motion,
  animate,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
const IMG_WIDTH = 60;
const IMG_HEIGHT = 110;
const TOTAL_IMAGES = 18;
const MORPH_END = 600;
const DISAPPEAR_END = 1000;

const PHONE_IMAGES = Array.from(
  { length: 9 },
  (_, i) => `/assets/images/phone-view/phone-view${i + 1}.png`
);
const IMAGES = Array.from(
  { length: TOTAL_IMAGES },
  (_, i) => PHONE_IMAGES[i % PHONE_IMAGES.length]
);

const lerp = (a, b, t) => a * (1 - t) + b * t;

function FlipCard({
  src,
  index,
  scatterPos,
  containerSize,
  phaseProgress,
  morphProgress,
  disappearProgress,
  mouseX,
}) {
  const isMobile = containerSize.width < 768;
  const minDimension = Math.min(containerSize.width, containerSize.height);

  const lineSpacing = 70;
  const lineX = index * lineSpacing - (TOTAL_IMAGES * lineSpacing) / 2;

  const circleRadius = Math.min(minDimension * 0.32, 320);
  const circleAngle = (index / TOTAL_IMAGES) * 360;
  const circleRad = (circleAngle * Math.PI) / 180;
  const circleX = Math.cos(circleRad) * circleRadius;
  const circleY = Math.sin(circleRad) * circleRadius;
  const circleRotation = circleAngle + 90;

  const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
  const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
  const arcApexY = containerSize.height * (isMobile ? 0.38 : 0.3);
  const arcCenterY = arcApexY + arcRadius;
  const spreadAngle = isMobile ? 110 : 140;
  const startAngle = -90 - spreadAngle / 2;
  const step = spreadAngle / (TOTAL_IMAGES - 1);
  const currentArcAngle = startAngle + index * step;
  const arcRad = (currentArcAngle * Math.PI) / 180;
  const arcX = Math.cos(arcRad) * arcRadius;
  const arcY = Math.sin(arcRad) * arcRadius + arcCenterY;
  const arcRotation = currentArcAngle + 90;
  const arcScale = isMobile ? 1.2 : 1.4;

  const disappearDir = index % 2 === 0 ? -1 : 1;

  const x = useTransform(
    [phaseProgress, morphProgress, disappearProgress, mouseX],
    ([phase, morph, disappear, parallax]) => {
      let base;
      if (phase < 1) base = lerp(scatterPos.x, lineX, phase);
      else if (phase < 2) base = lerp(lineX, circleX, phase - 1);
      else base = lerp(circleX, arcX + parallax, morph);
      return base + disappear * disappearDir * 80;
    }
  );

  const y = useTransform(
    [phaseProgress, morphProgress, disappearProgress],
    ([phase, morph, disappear]) => {
      let base;
      if (phase < 1) base = lerp(scatterPos.y, 0, phase);
      else if (phase < 2) base = lerp(0, circleY, phase - 1);
      else base = lerp(circleY, arcY, morph);
      return base + disappear * containerSize.height * 0.7;
    }
  );

  const rotate = useTransform(
    [phaseProgress, morphProgress, disappearProgress],
    ([phase, morph, disappear]) => {
      let base;
      if (phase < 1) base = lerp(scatterPos.rotation, 0, phase);
      else if (phase < 2) base = lerp(0, circleRotation, phase - 1);
      else base = lerp(circleRotation, arcRotation, morph);
      return base + disappear * disappearDir * 35;
    }
  );

  const scale = useTransform(
    [phaseProgress, morphProgress, disappearProgress],
    ([phase, morph, disappear]) => {
      let base;
      if (phase < 1) base = lerp(scatterPos.scale, 1, phase);
      else if (phase < 2) base = 1;
      else base = lerp(1, arcScale, morph);
      return base * (1 - disappear * 0.4);
    }
  );

  const opacity = useTransform(
    [phaseProgress, disappearProgress],
    ([phase, disappear]) => {
      const fadeIn = Math.min(Math.max(phase / 0.4, 0), 1);
      return fadeIn * (1 - disappear);
    }
  );

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        position: "absolute",
        width: isMobile ? 48 : IMG_WIDTH,
        height: isMobile ? 88 : IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-200"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={src}
            alt={`hango-${index}`}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
        </div>

        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-red-600 to-black flex flex-col items-center justify-center p-3 border border-red-500/30"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
            <p className="text-[8px] font-bold text-red-300 uppercase tracking-widest mb-1">
              Hango
            </p>
            <p className="text-xs font-medium text-white">Webdesign</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Hero({ ready = true }) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  const phaseProgress = useMotionValue(0);

  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  const morphRaw = useTransform(virtualScroll, [0, MORPH_END], [0, 1]);
  const morphProgress = useSpring(morphRaw, { stiffness: 110, damping: 26 });

  const disappearRaw = useTransform(
    virtualScroll,
    [MORPH_END, DISAPPEAR_END],
    [0, 1]
  );
  const disappearProgress = useSpring(disappearRaw, {
    stiffness: 110,
    damping: 26,
  });

  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 25 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!ready) return;

    const t1 = setTimeout(() => {
      animate(phaseProgress, 1, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    }, 300);
    const t2 = setTimeout(() => {
      animate(phaseProgress, 2, {
        type: "spring",
        stiffness: 60,
        damping: 18,
      });
    }, 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phaseProgress, ready]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (window.scrollY > 0) return;
      if (e.deltaY > 0 && scrollRef.current >= DISAPPEAR_END) return;
      if (e.deltaY < 0 && scrollRef.current <= 0) return;

      e.preventDefault();
      const newScroll = Math.min(
        Math.max(scrollRef.current + e.deltaY, 0),
        DISAPPEAR_END
      );
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e) => {
      if (window.scrollY > 0) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (deltaY > 0 && scrollRef.current >= DISAPPEAR_END) return;
      if (deltaY < 0 && scrollRef.current <= 0) return;

      touchStartY = touchY;
      e.preventDefault();
      const newScroll = Math.min(
        Math.max(scrollRef.current + deltaY, 0),
        DISAPPEAR_END
      );
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [virtualScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const normalizedX = (relativeX / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 50);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  const scatterPositions = useMemo(
    () =>
      IMAGES.map(() => ({
        x: (Math.random() - 0.5) * 1500,
        y: (Math.random() - 0.5) * 800,
        rotation: (Math.random() - 0.5) * 180,
        scale: 0.6,
      })),
    []
  );

  const introTextOpacity = useTransform(
    [phaseProgress, morphProgress],
    ([p, m]) => {
      if (p < 1.7) return 0;
      const phaseIn = Math.min((p - 1.7) / 0.3, 1);
      const morphFade = Math.max(0, 1 - m * 5);
      return phaseIn * morphFade;
    }
  );

  return (
    <section
        ref={containerRef}
        className="relative w-full h-[100dvh] sm:h-screen bg-gradient-to-t from-[#ffffff] via-[#f5f5f7] to-[#ffffff] overflow-hidden"
      >
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <motion.div
            style={{ opacity: introTextOpacity }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none text-center px-4"
          >
            <h1 className="max-w-[20rem] font-roboto text-[2rem] font-extrabold leading-[1.02] tracking-tight text-black sm:max-w-lg sm:text-4xl md:text-5xl">
              Sehen Sie <span className="text-red-600">selbst.</span>
            </h1>
            <p className="font-inter mt-5 sm:mt-5 text-sm sm:text-sm font-semibold tracking-[0.22em] sm:tracking-[0.28em] text-gray-500">
              Nach unten scrollen
            </p>
          </motion.div>

          <div className="relative flex items-center justify-center w-full h-full">
            {IMAGES.map((src, i) => (
              <FlipCard
                key={i}
                src={src}
                index={i}
                scatterPos={scatterPositions[i]}
                containerSize={containerSize}
                phaseProgress={phaseProgress}
                morphProgress={morphProgress}
                disappearProgress={disappearProgress}
                mouseX={smoothMouseX}
              />
            ))}
          </div>
        </div>
      </section>

  );
}

export default Hero;
