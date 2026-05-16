import { useState, useEffect, useMemo, useRef } from "react";
import {
  motion,
  animate,
  useTransform,
  useSpring,
  useMotionValue,
  useScroll,
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
  const arcRadius = baseRadius * 1.1;
  const arcApexY = containerSize.height * 0.3;
  const arcCenterY = arcApexY + arcRadius;
  const spreadAngle = 140;
  const startAngle = -90 - spreadAngle / 2;
  const step = spreadAngle / (TOTAL_IMAGES - 1);
  const currentArcAngle = startAngle + index * step;
  const arcRad = (currentArcAngle * Math.PI) / 180;
  const arcX = Math.cos(arcRad) * arcRadius;
  const arcY = Math.sin(arcRad) * arcRadius + arcCenterY;
  const arcRotation = currentArcAngle + 90;
  const arcScale = 1.4;

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

function DesktopHero({ ready }) {
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

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
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
      className="relative w-full h-screen bg-gradient-to-t from-[#ffffff] via-[#f5f5f7] to-[#ffffff] overflow-hidden"
    >
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        <motion.div
          style={{ opacity: introTextOpacity }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none text-center px-4"
        >
          <h1 className="max-w-lg font-roboto text-4xl font-extrabold leading-[1.02] tracking-tight text-black md:text-5xl">
            Sehen Sie <span className="text-red-600">selbst.</span>
          </h1>
          <p className="font-inter mt-5 text-sm font-semibold tracking-[0.28em] text-gray-500">
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

const MOBILE_DECK = [
  { src: PHONE_IMAGES[0], depth: "front" },
  { src: PHONE_IMAGES[3], depth: "left" },
  { src: PHONE_IMAGES[6], depth: "right" },
];

function MobileHero({ ready }) {
  const ease = [0.22, 1, 0.36, 1];
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const leftX = useTransform(scrollYProgress, [0, 1], [-70, -220]);
  const leftY = useTransform(scrollYProgress, [0, 1], [12, 160]);
  const leftRotate = useTransform(scrollYProgress, [0, 1], [-10, -38]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.55, 0.85], [0.55, 0.15, 0]);

  const rightX = useTransform(scrollYProgress, [0, 1], [70, 220]);
  const rightY = useTransform(scrollYProgress, [0, 1], [12, 160]);
  const rightRotate = useTransform(scrollYProgress, [0, 1], [10, 38]);
  const rightOpacity = useTransform(scrollYProgress, [0, 0.55, 0.85], [0.55, 0.15, 0]);

  const centerY = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const centerScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const centerOpacity = useTransform(scrollYProgress, [0, 0.65, 1], [1, 0.4, 0]);

  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [1, 1, 0.2]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100dvh] bg-gradient-to-t from-[#ffffff] via-[#f5f5f7] to-[#ffffff] overflow-hidden flex flex-col justify-between px-6 pt-[10vh] pb-[6vh]"
    >
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease }}
        >
          <p className="font-inter text-[0.7rem] font-semibold tracking-[0.32em] text-red-600 uppercase mb-3">
            Hango Webdesign
          </p>
          <h1 className="font-roboto text-[2.75rem] font-extrabold leading-[0.95] tracking-tight text-black">
            Sehen Sie
            <br />
            <span className="text-red-600">selbst.</span>
          </h1>
          <p className="font-inter mt-5 text-[0.95rem] text-gray-500 leading-relaxed max-w-[18rem] mx-auto">
            Moderne Websites, die Ihre Marke zum Strahlen bringen.
          </p>
        </motion.div>
      </motion.div>

      <div className="relative flex-1 flex items-center justify-center -my-2">
        <motion.div
          style={{ x: rightX, y: rightY, rotate: rightRotate, opacity: rightOpacity }}
          className="absolute"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.25, ease }}
          >
            <img
              src={MOBILE_DECK[2].src}
              alt=""
              aria-hidden
              className="w-[140px] h-auto rounded-[1.6rem] shadow-xl ring-1 ring-black/5"
              draggable={false}
            />
          </motion.div>
        </motion.div>

        <motion.div
          style={{ x: leftX, y: leftY, rotate: leftRotate, opacity: leftOpacity }}
          className="absolute"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.25, ease }}
          >
            <img
              src={MOBILE_DECK[1].src}
              alt=""
              aria-hidden
              className="w-[140px] h-auto rounded-[1.6rem] shadow-xl ring-1 ring-black/5"
              draggable={false}
            />
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: centerY, scale: centerScale, opacity: centerOpacity }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.45, ease }}
          >
            <motion.img
              src={MOBILE_DECK[0].src}
              alt="Hango Webdesign Vorschau"
              className="w-[200px] h-auto rounded-[1.8rem] shadow-2xl ring-1 ring-black/10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              draggable={false}
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: hintOpacity }}
        className="flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1, ease }}
          className="flex flex-col items-center"
        >
        <p className="font-inter text-[0.7rem] font-semibold tracking-[0.28em] text-gray-500 uppercase">
          Nach unten scrollen
        </p>
        <motion.svg
          className="mt-2 h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Hero({ ready = true }) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isMobile ? <MobileHero ready={ready} /> : <DesktopHero ready={ready} />;
}

export default Hero;
