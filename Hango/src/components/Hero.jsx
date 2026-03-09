import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { arrow, cylinder2, triangle } from "../utils";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const heroRef = useRef(null);
  const triangleRef = useRef(null);
  const cylinderRef = useRef(null);
  const arrowRef = useRef(null);
  const textRef = useRef(null);
  const subtitleRef = useRef(null);
  const learnButtonRef = useRef(null);
  const contactButtonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Randomized floating animations for abstract shapes
      gsap.to(triangleRef.current, {
        y: "+=20",
        rotation: "8deg",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        duration: 3.5,
        delay: Math.random() * 1.5,
      });

      gsap.to(cylinderRef.current, {
        x: "+=20",
        y: "-=7",
        rotation: "-5deg",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        duration: 3.2,
        delay: Math.random() * 1.5,
      });

      // Text animation - "assembling" effect
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 50, letterSpacing: "0.03em" },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0em",
          duration: 1.2,
          ease: "power3.out",
          delay: 0.2,
          stagger: 0.05,
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.8,
        }
      );

      gsap.fromTo(
        contactButtonRef.current,
        { opacity: 0, y: 90 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.in",
          delay: 0.95,
        }
      );

      gsap.fromTo(
        learnButtonRef.current,
        { opacity: 0, y: 90 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.in",
          delay: 0.8,
        }
      );

      // Reveal the arrow only after scrolling on larger screens
      gsap.fromTo(
        arrowRef.current,
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "expo.inOut",
          scrollTrigger: {
            trigger: heroRef.current,
            start: 100,
            toggleActions: "play none none reverse",
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="flex flex-col" id="home">
      <section className="pt-40 lg:md:pt-0 h-[30rem] md:h-screen w-full bg-gradient-to-t from-[#ffffff] via-[#f5f5f7] to-[#ffffff] flex items-center justify-start relative">
        <div className="flex flex-col items-start gap-8 max-w-3xl mt-10 md:mt-0 md:mb-10 px-6  lg:md:ml-20">
          {/* Text Content */}
          <div className="flex flex-col gap-4">
            <h1
              ref={textRef}
              className="font-roboto text-[2.6rem] max-w-[50rem] lg:md:max-w-[40rem] sm:text-4xl md:text-6xl lg:text-[4rem] font-extrabold text-black leading-tight"
            >
              Ihre Digitalagentur in Wien
            </h1>
            <p
              ref={subtitleRef}
              className="font-inter text-[1.3rem] md:text-xl lg:text-[1.5rem] text-gray-600 max-w-[21.5rem] lg:md:max-w-[38rem]"
            >
              Auf der Suche nach einer professionellen Webseite, SEO, modernem UI oder gezielter Werbung? Bei uns sind Sie richtig!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#über uns">
              <button
                ref={learnButtonRef}
                className="
                  w-screen max-w-[21.5rem] lg:md:w-fit py-[.7rem] lg:md:px-4 sm:px-6 lg:md:py-3 sm:py-3
                  relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20
                  before:content-[''] before:absolute before:inset-0 before:z-0 before:bg-gradient-to-r before:from-black before:to-gray-400 before:rounded-xl
                  after:content-[''] after:absolute after:inset-[2px] after:z-10 after:bg-[#ffffff] after:rounded-lg hover:after:bg-[#f5f5f7]
                "
              >
                <span className="font-inter relative z-20 text-[1.21rem]  md:text-lg text-black">
                  Mehr Erfahren
                </span>
              </button>
            </a>

            <a href="#contact">
              <button
                ref={contactButtonRef}
                className="
                  w-screen max-w-[21.5rem]  lg:md:w-fit py-[.7rem]  px-2 lg:md:px-[1rem] sm:px-[1.5rem] lg:md:py-[.7rem] sm:py-[.8rem]
                  bg-gradient-to-r from-red-500 to-red-600 hover:from-red-500 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 rounded-lg
                "
              >
                <p className="font-inter text-[1.21rem] md:text-lg">
                  Jetzt Kontaktieren
                </p>
              </button>
            </a>
          </div>
        </div>

        {/* Animated Shapes - Hidden on mobile */}
        <img
          ref={triangleRef}
          src={triangle}
          alt="abstract triangle"
          className="hidden md:block absolute left-[78%] md:left-[45%] bottom-[58%] transform -translate-x-1/2 md:bottom-[5%] w-[80px] sm:w-[200px] md:w-[300px] opacity-90"
        />
        <img
          ref={cylinderRef}
          src={cylinder2}
          alt="abstract cylinder"
          className="hidden md:block absolute md:right-[3%] right-[12%] bottom-[5%] md:bottom-[2%] w-[160px] sm:w-[400px] md:w-[610px] opacity-90"
        />
        {/* Arrow is already hidden on mobile */}
        <img
          ref={arrowRef}
          src={arrow}
          alt="scroll arrow"
          className="hidden md:block absolute right-[75%] -bottom-[7%] w-[22rem] opacity-60 rotate-[60deg]"
        />
      </section>
    </div>
  );
}

export default Hero;
