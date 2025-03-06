import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // ScrollTrigger importieren

gsap.registerPlugin(ScrollTrigger); // Plugin registrieren

const AboutUs = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const cardRef = useRef(null);
  const listItemsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ScrollTrigger für alle Animationen
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 47%", // Animation startet wenn 70% des Containers sichtbar sind
          end: "bottom 30%",
          toggleActions: "play none none none",
        },
      });

      // Animationen zur Timeline hinzufügen
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: .9, ease: "power3.out" }
      )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: .9, ease: "power3.out" },
          "-=.2" // Startet 0.7s nach Title-Animation
        )
        .fromTo(
          cardRef.current,
          { opacity: 0, x: 100 },
          { opacity: 1, x: 0, duration: .9, ease: "power3.out" },
          "-=0.4" // Startet 0.5s nach Text-Animation
        )
        .fromTo(
          listItemsRef.current,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.2,
            duration: .9,
            ease: "power3.out",
          },
          "-=0.2" // Startet 0.3s nach Card-Animation
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    // Rest bleibt gleich
    <div
      ref={containerRef}
      className="h-[47rem] bg-gradient-to-t from-[#473D3D] to-[#473D3D]"
      id="über uns"
    >
      <section className="h-screen w-full flex items-center justify-center px-8">
        <div className="ml-16 max-w-12xl w-full mb-28">
          {/* Main Content Container */}
          <div className="flex flex-col md:flex-row gap-16 items-center">
            {/* Left Column */}
            <div className="flex-1 text-center md:text-left">
              {/* Main Title */}
              <h1
                ref={titleRef}
                className="max-w-8xl text-white text-5xl md:text-7xl font-extrabold leading-tight mb-6"
              >
                Auf der Suche nach einer Website?
              </h1>

              {/* Paragraph */}
              <p
                ref={textRef}
                className="text-gray-200 text-lg md:text-3xl lg:leading-[1.5] max-w-4xl"
              >
                Überlassen Sie die technische Arbeit unserem Team. Dies erspart
                Ihnen nicht nur effektive Zeit sondern auch schlaflose Nächte.
              </p>
            </div>

            {/* Right Column */}
            <div
              ref={cardRef}
              className="mr-16 flex-1 p-14 md:p-18 bg-gradient-to-br from-[#3D3539] to-[rgb(40,38,43)] rounded-2xl shadow-lg backdrop-blur-lg max-w-2xl min-h-[450px] border-2 border-solid border-red-500"
            >
              {/* Subtitle */}
              <h2 className="text-white text-3xl md:text-5xl font-semibold mb-12 mt-4">
                Wir helfen Ihnen bei:
              </h2>

              {/* Bullet Points */}
              <ul className="space-y-8">
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
                    <span className="text-red-500 text-2xl mr-3">•</span>
                    <span className="text-white text-xl md:text-3xl">
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
