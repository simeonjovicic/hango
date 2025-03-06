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
      "Kontinuierliche Weiterentwicklung basierend auf Nutzerfeedback.",
    ],
  },
];

const Timeline = () => {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const markersRef = useRef([]);
  const lineRef = useRef(null);

useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    if (!markersRef.current.length) return;

    const firstMarker = markersRef.current[0];
    const lastMarker = markersRef.current[markersRef.current.length - 1];

    const firstMarkerOffset =
      firstMarker.offsetTop + firstMarker.offsetHeight / 2;
    const lastMarkerOffset = lastMarker.offsetTop + lastMarker.offsetHeight / 2;
    const totalHeight = lastMarkerOffset - firstMarkerOffset;

    if (lineRef.current) {
      lineRef.current.style.top = `${firstMarkerOffset}px`;
      lineRef.current.style.backgroundColor = "#FF6B6B";
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

    itemsRef.current.forEach((card, index) => {
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
        { backgroundColor: "#2c3139" }, // Initial color
        {
          backgroundColor: "#4A5568", // Gold color
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
      className="relative w-full bg-gradient-to-t from-[#28262B] via-[#28262B] to-[#28262B] text-white py-56"
      style={{ minHeight: "100vh" }}
      id="ablauf"
    >
      <div className="flex flex-col items-center py-16">
        <h1 className="text-7xl font-bold mb-16 bg-gradient-to-t from-[#e0a33b] to-[#ffd87d] bg-clip-text text-transparent">
          Unser Ablauf
        </h1>
        <div className="relative w-full max-w-7xl flex flex-col gap-8 pb-20">
          <div
            ref={lineRef}
            className="absolute left-1/2 transform -translate-x-1/2 w-1"
            style={{ height: 0 }}
          ></div>
          {timelineData.map((event, index) => (
            <div
              key={index}
              className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-x-16 items-center"
            >
              {index % 2 === 0 ? (
                <div className="flex justify-end pr-8">
                  <div
                    ref={(el) => (itemsRef.current[index] = el)}
                    className="bg-[#272e3c] p-10 pt-8 pb-12 space-y-8 rounded-xl shadow-xl w-full max-w-[900px] border-4 border-[#f0b349] transition-all duration-300"
                  >
                    <h2 className="text-4xl font-bold mt-2 text-[#FFD166]">
                      {event.title}
                    </h2>
                    <ul className="list-disc list-inside text-gray-200 text-xl space-y-4">
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
                  className="w-16 h-16 rounded-full bg-[#4A5568] flex items-center justify-center text-3xl font-bold text-red border-2 "
                >
                  {event.number}
                </div>
              </div>
              {index % 2 !== 0 ? (
                <div className="flex justify-start pl-8">
                  <div
                    ref={(el) => (itemsRef.current[index] = el)}
                    className="bg-[#272e3c]  p-10 pt-8 pb-12  space-y-8 rounded-xl shadow-xl w-full max-w-[900px] border-4 border-[#f0b349] transition-all duration-300"
                  >
                    <h2 className="text-4xl font-bold mt-2 text-[#FFD166]">
                      {event.title}
                    </h2>
                    <ul className="list-disc list-inside text-gray-200 text-xl space-y-4">
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
          ))}
        </div>
      </div>
      <div id="contact"></div>
    </div>
  );
};

export default Timeline;
