import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  {
    number: "01",
    year: "2020",
    title: "Besprechung",
    description: [
      "Besprechung der Anforderungen, Ziele und Wünsche.",
      "Klärung offener Fragen und Festlegung des Projektumfangs.",
      "Festlegung des Zeitplans und der nächsten Schritte.",
    ],
  },
  {
    number: "02",
    year: "2021",
    title: "Design",
    description: [
      "Erstellung erster Designvorschläge (Layout, Farben, Typografie).",
      "Einholung von Feedback und iterative Anpassung.",
      "Finale Freigabe des Designs nach Überarbeitung.",
    ],
  },
  {
    number: "03",
    year: "2022",
    title: "Entwicklung",
    description: [
      "Umsetzung des Designs in Code.",
      "Implementierung der gewünschten Features.",
      "Regelmäßige Tests und Qualitätssicherung.",
    ],
  },
  {
    number: "04",
    year: "2023",
    title: "Wartung",
    description: [
      "Regelmäßige Updates und Performance-Optimierung.",
      "Bugfixes und Sicherheitsupdates.",
      "Fortlaufende Weiterentwicklung je nach Nutzerfeedback.",
    ],
  },
];

const Timeline = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const itemsRef = useRef([]);
  const markersRef = useRef([]);
  const lineRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the title when scrolled into view
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (!markersRef.current.length) return;

      const firstMarker = markersRef.current[0];
      const lastMarker = markersRef.current[markersRef.current.length - 1];
      const firstMarkerOffset =
        firstMarker.offsetTop + firstMarker.offsetHeight / 2;
      const lastMarkerOffset =
        lastMarker.offsetTop + lastMarker.offsetHeight / 2;
      const totalHeight = lastMarkerOffset - firstMarkerOffset;

      if (lineRef.current) {
        lineRef.current.style.top = `${firstMarkerOffset}px`;
        lineRef.current.style.backgroundColor = "#FF6B6B"; // Vibrant red
        gsap.fromTo(
          lineRef.current,
          { height: 0 },
          {
            height: totalHeight,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              scrub: true,
            },
            duration: 1,
          }
        );
      }

      itemsRef.current.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      markersRef.current.forEach((marker) => {
        gsap.fromTo(
          marker,
          { backgroundColor: "#2c3139" },
          {
            backgroundColor: "#4A5568",
            scrollTrigger: {
              trigger: marker,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="pt-24 lg:pt-40 relative w-full bg-[#28262B] text-white min-h-screen"
      id="ablauf"
    >
      <div className="flex flex-col items-center py-16">
        <h1
          ref={titleRef}
          className="text-5xl font-roboto font-bold mb-16 bg-gradient-to-t from-[#e0a33b] to-[#ffd87d] bg-clip-text text-transparent"
        >
          Unser Ablauf
        </h1>
        <div className="relative w-full max-w-7xl flex flex-col gap-6 pb-16">
          <div
            ref={lineRef}
            className="absolute left-1/2 transform -translate-x-1/2 w-1"
            style={{ height: 0 }}
          ></div>
          {timelineData.map((event, index) => (
            <div key={index} className="p-4">
              {/* Mobile Layout */}
              <div className="block md:hidden">
                <div className="flex flex-col items-center">
                  <div
                    ref={(el) => (markersRef.current[index] = el)}
                    className="w-10 h-10 rounded-full bg-[#4A5568] flex items-center justify-center text-xl font-bold text-red border-2 mb-6"
                  >
                    {event.number}
                  </div>
                  <div
                    ref={(el) => (itemsRef.current[index] = el)}
                    className="bg-[#272e3c] p-6 rounded-lg shadow-lg w-full max-w-md mx-auto border-2 border-[#f0b349]"
                  >
                    <h2 className="text-2xl font-bold text-[#FFD166] mb-4">
                      {event.title}
                    </h2>
                    <ul className="mt-2 list-disc list-inside text-gray-200 text-sm space-y-3">
                      {event.description.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-x-12 items-center">
                {index % 2 === 0 ? (
                  <div className="flex justify-end pr-4">
                    <div
                      ref={(el) => (itemsRef.current[index] = el)}
                      className="bg-[#272e3c] p-8 rounded-lg shadow-lg w-[33rem] max-w-[600px] border-2 border-[#f0b349]"
                    >
                      <h2 className="text-2xl font-roboto font-bold text-[#FFD166]">
                        {event.title}
                      </h2>
                      <ul className="mt-2 list-disc list-inside text-gray-200 text-lg space-y-2">
                        {event.description.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
                <div className="flex justify-center relative">
                  <div
                    ref={(el) => (markersRef.current[index] = el)}
                    className="w-10 h-10 rounded-full bg-[#4A5568] flex items-center justify-center text-xl font-bold text-red border-2"
                  >
                    {event.number}
                  </div>
                </div>
                {index % 2 !== 0 ? (
                  <div className="flex justify-start pl-4">
                    <div
                      ref={(el) => (itemsRef.current[index] = el)}
                      className="bg-[#272e3c] p-6 rounded-lg shadow-lg max-w-[800px] border-2 border-[#f0b349]"
                    >
                      <h2 className="text-2xl font-roboto font-bold text-[#FFD166]">
                        {event.title}
                      </h2>
                      <ul className="mt-2 list-disc list-inside text-gray-200 text-lg space-y-2">
                        {event.description.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div id="contact"></div>
    </div>
  );
};

export default Timeline;
