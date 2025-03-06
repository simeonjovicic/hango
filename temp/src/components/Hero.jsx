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
        x: "+=35",
        y: "-=10",
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
          duration: .6,
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

      // Reveal the arrow only after scrolling
      gsap.fromTo(
        arrowRef.current,
        { opacity: 0, y: -100},
        {
          opacity: 1,
          y: 0,
          duration: 2,
          ease: "expo.inOut",
          scrollTrigger: {
            trigger: heroRef.current,
            start: 200,
            toggleActions: "play none none reverse",
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen flex flex-col" id="home">
      <section className="h-screen w-full bg-gradient-to-t from-[#473D3D] via-[#28262B] to-[#28262B] flex items-center justify-start">
        <div className="flex flex-col items-start gap-8 max-w-5xl mb-10 px-8 ml-8 md:ml-16">
          {/* Text Content */}
          <div className="flex flex-col gap-4">
            <h1
              ref={textRef}
              className="text-4xl font-extrabold text-white md:text-6xl lg:text-8xl leading-tight"
            >
              Ihre Webdesign Agentur in Wien
            </h1>
            <p
              ref={subtitleRef}
              className="text-lg text-gray-200 md:text-xl lg:text-3xl max-w-3xl"
            >
              Auf der Suche nach einer professionellen Webseite? Bei uns sind
              Sie richtig!
            </p>
          </div>

          {/* Buttons */}
          {/* Button Container */}
          <div className="flex gap-4">
            <a href="#über uns">
              <button
                className="
                px-6 py-3 
                text-white 
                text-lg 
                font-medium 
                relative 
                overflow-hidden 
                rounded-xl 
                transition-all 
                duration-300
                hover:shadow-lg
                hover:shadow-gray-500/20
                
                before:content-['']
                before:absolute
                before:inset-0
                before:z-0
                before:bg-gradient-to-r
                before:from-white
                before:to-gray-700
                before:rounded-xl
                
                after:content-['']
                after:absolute
                after:inset-[2px]
                after:z-10
                after:bg-[#28262B]
                after:rounded-lg
                
                hover:after:bg-[#373438]"

                ref={learnButtonRef}
              >
                <span className="relative z-20 text-2xl">Mehr Erfahren</span>
              </button>
            </a>

            <a href="#contact">
              <button
                className="mr-6 px-[1.5rem] py-[.8rem] text-white text-lg font-medium 
                    bg-gradient-to-r from-red-500 to-red-600 
                    hover:from-red-500 hover:to-red-700 
                    transition-all duration-300 
                    shadow-lg shadow-red-500/30 
                    hover:shadow-red-500/50 
                    rounded-xl"

                    ref={contactButtonRef}
              >
                <p className="text-2xl">Jetzt Kontaktieren</p>
              </button>
            </a>
          </div>
        </div>

        {/* Animated Shapes */}
        <img
          ref={triangleRef}
          src={triangle}
          alt="abstract triangle"
          className="absolute left-[31%] bottom-[5%] w-[400px] opacity-90"
        />
        <img
          ref={cylinderRef}
          src={cylinder2}
          alt="abstract cylinder"
          className="absolute right-[2%] bottom-[4%] w-[820px] opacity-90"
        />
        <img
          ref={arrowRef}
          src={arrow}
          alt="scroll arrow"
          className="absolute right-[76%] -bottom-[5%] w-[30rem] opacity-60 rotate-[60deg]"
        />
      </section>
    </div>
  );
}

export default Hero;

