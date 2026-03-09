import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { trust, success, efficiency } from "../utils";

const Highlights = () => {
  // Refs for the elements to animate
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const columnsRef = useRef([]);

  // Helper function to add refs to columns
  const addToRefs = (el) => {
    if (el && !columnsRef.current.includes(el)) {
      columnsRef.current.push(el);
    }
  };

  useEffect(() => {
    // Register the ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Create a timeline that triggers when the title scrolls into view
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: titleRef.current, // Trigger based on the title element
        start: "top 64%", // When the top of the title reaches 64% of the viewport
        // markers: true, // Uncomment for debugging scroll trigger
      },
    });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: -50 }, // Initial state
      { opacity: 1, y: 0, duration: 0.9 } // Final state
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.5" // Overlap with the title animation
      )
      .fromTo(
        columnsRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.3,
          ease: "power1.in",
        },
        "-=0.5"
      );
  }, []);

  return (
    <div className="pt-32 md:lg:pt-0 min-h-screen md:h-[10rem] bg-gradient-to-t from-[#f5f5f7] via-[#f5f5f7] to-[#ffffff] text-black text-center">
      <section className="h-[76rem] lg:md:h-[60rem] w-full flex flex-col items-center justify-center px-4 sm:px-8 pt-32 md:px-32 md:pt-0">
        {/* Title and Subtitle */}
        <div className="mb-4 lg:md:mb-16 max-w-5xl">
          <h1
            ref={titleRef}
            className="text-3xl md:text-5xl font-extrabold font-roboto"
          >
            Qualität auf hohem Niveau
          </h1>
          <p
            ref={subtitleRef}
            className="text-[1.21rem] md:text-2xl text-gray-200 mt-4 mb-8"
          >
            Anstatt sich in technischen Details zu verlieren, übernimmt unser
            Team effizient alle Aufgaben – so bleibt Ihnen mehr Zeit für das
            Wesentliche.
          </p>
        </div>

        {/* Main Content Section */}
        <div className="w-full flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-center mb-16 md:mb-40">
          {/* Column 1 */}
          <div
            ref={addToRefs}
            className="flex-1 flex flex-col items-center max-w-md"
          >
            <img
              src={success}
              alt="Success"
              width={120}
              className="opacity-90 mb-8 mx-auto"
            />
            <h2 className="text-2xl font-bold mb-4 font-roboto">
              Zeiteffizient
            </h2>
            <p className="text-gray-100 text-lg">
              Anstatt sich selber qualvoll mit der Technik oder komplexen Werbekampagnen zu befassen,
              arbeitet unser Team zeiteffizient an Ihrem digitalen Auftritt.
            </p>
          </div>

          {/* Column 2 */}
          <div
            ref={addToRefs}
            className="flex-1 flex flex-col items-center max-w-md"
          >
            <img
              src={trust}
              alt="Trust"
              width={120}
              className="opacity-90 mb-8 mx-auto"
            />
            <h2 className="text-2xl font-bold mb-4 font-roboto">Sicherheit</h2>
            <p className="text-gray-100 text-lg">
              Unsere Websites sind modern ausgestattet und dadurch gegen DDoS
              Cyber-Attacken geschützt.
            </p>
          </div>

          {/* Column 3 */}
          <div ref={addToRefs} className="flex-1 flex flex-col items-center">
            <img
              src={efficiency}
              alt="Efficiency"
              width={120}
              className="opacity-90 mb-8 mx-auto"
            />
            <h2 className="text-2xl font-bold mb-4 font-roboto">
              Weg zum Erfolg
            </h2>
            <p className="text-gray-100 text-lg">
              Wir möchten Sie zur Spitze bringen! Mit gezieltem SEO und smarten Ads
              sammeln wir mehr Reichweite für Ihr Projekt. Win-Win!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Highlights;
