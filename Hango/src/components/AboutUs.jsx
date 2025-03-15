import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const cardRef = useRef(null);
  const listItemsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 47%",
          end: "bottom 30%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
      )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=.2"
        )
        .fromTo(
          cardRef.current,
          {
            opacity: 0,
            x: isMobile ? 0 : 100,
            y: isMobile ? 50 : 0,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .fromTo(
          listItemsRef.current,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.2,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.2"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="lg:md:h-[40rem] pb-32 lg:md:pt-16 bg-gradient-to-t from-[#473D3D] to-[#473D3D] md:px-16"
      id="über uns"
    >
      <section className="lg:md:h-[20rem] h-[37rem] pt-[25rem] lg:md:pt-64  w-full flex items-center justify-center px-4 md:px-8">
        <div className="mx-auto max-w-12xl w-full px-4 md:px-0">
          {/* Main Content Container */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            {/* Left Column */}
            <div className="flex-1 text-center md:text-left">
              {/* Main Title */}
              <h1
                ref={titleRef}
                className="font-roboto max-w-8xl text-white text-3xl md:text-5xl font-extrabold leading-tight mb-6"
              >
                Auf der Suche nach einer Website?
              </h1>
              {/* Paragraph */}
              <p
                ref={textRef}
                className="font-inter text-gray-200 text-[1.21rem] md:text-[1.45rem] lg:leading-[1.5] max-w-[40rem]"
              >
                Überlassen Sie uns die technische Umsetzung, damit Sie sich voll
                auf Ihr Kerngeschäft konzentrieren können. Genießen Sie den
                Gewinn an wertvoller Zeit.
              </p>
            </div>

            {/* Right Column */}
            <div
              ref={cardRef}
              className="flex-1 pt-6 pb-10 px-8 md:p-18 mr-0 md:mr-16 bg-gradient-to-br from-[#3D3539] to-[rgb(40,38,43)] rounded-2xl shadow-lg backdrop-blur-lg max-w-lg min-h-[250px] border-2 border-solid border-red-500"
            >
              {/* Subtitle */}
              <h2 className="font-roboto text-white text-2xl md:text-4xl font-bold mb-6 mt-4">
                Wir helfen Ihnen bei:
              </h2>

              {/* Bullet Points */}
              <ul className="space-y-4">
                {[
                  "Website Bauen/Aufrischung",
                  "SEO Optimierung",
                  "Website Wartung (Hosting und Domain-Name)",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start"
                    ref={(el) => (listItemsRef.current[index] = el)}
                  >
                    <span className="text-red-500 text-xl mr-3">•</span>
                    <span className="text-white text-2lg md:text-xl">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
