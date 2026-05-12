import { useState, useEffect, useMemo, useRef } from "react";
import {
  motion,
  animate,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { HashLink } from "react-router-hash-link";

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
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
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

function Hero() {
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
  }, [phaseProgress]);

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
    <>
      <section
        ref={containerRef}
        className="relative w-full h-screen bg-gradient-to-t from-[#ffffff] via-[#f5f5f7] to-[#ffffff] overflow-hidden"
      >
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <motion.div
            style={{ opacity: introTextOpacity }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none text-center px-4"
          >
            <h1 className="font-roboto text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black max-w-sm md:max-w-md leading-tight">
              Sehen Sie <span className="text-red-600">selbst.</span>
            </h1>
            <p className="font-inter mt-4 text-[11px] md:text-xs font-bold tracking-[0.3em] text-gray-500">
              SCROLLEN ZUM ENTDECKEN
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

      <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#ffffff] via-[#f5f5f7] to-[#ffffff] px-4 overflow-hidden">
        <div className="flex flex-col justify-center items-center w-[280px] sm:w-[360px] md:w-[640px] lg:w-[820px] z-10">
          <motion.h1
            className="font-roboto text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-center w-full leading-tight tracking-tight font-extrabold text-black"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Wir machen Ihre Webseite{" "}
            <span className="text-red-600">einzigartig.</span>
          </motion.h1>

          <motion.p
            className="font-inter text-base sm:text-lg md:text-xl lg:text-2xl text-center text-gray-600 max-w-[40rem] pt-6 sm:pt-8 md:pt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            Ihre Digitalagentur in Wien — professionelle Webseiten, SEO,
            modernes UI und gezielte Werbung. Bei uns sind Sie richtig.
          </motion.p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center mt-10 sm:mt-12 md:mt-14 w-full max-w-[24rem] sm:max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="w-full sm:w-auto"
            >
              <HashLink smooth to="#über-uns" className="block w-full">
                <button
                  className="
                    w-full sm:w-auto py-3 px-6 md:px-8
                    relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20
                    before:content-[''] before:absolute before:inset-0 before:z-0 before:bg-gradient-to-r before:from-black before:to-gray-400 before:rounded-xl
                    after:content-[''] after:absolute after:inset-[2px] after:z-10 after:bg-white after:rounded-lg hover:after:bg-[#f5f5f7]
                  "
                >
                  <span className="font-inter relative z-20 text-lg md:text-xl text-black">
                    Mehr Erfahren
                  </span>
                </button>
              </HashLink>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="w-full sm:w-auto"
            >
              <HashLink smooth to="#kontakt" className="block w-full">
                <button
                  className="
                    w-full sm:w-auto py-3 px-6 md:px-8 rounded-xl
                    bg-gradient-to-r from-red-500 to-red-600 hover:from-red-500 hover:to-red-700
                    transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50
                  "
                >
                  <span className="font-inter text-lg md:text-xl text-white">
                    Jetzt Kontaktieren
                  </span>
                </button>
              </HashLink>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
