import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import emailjs from "emailjs-com";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const ContactUs = () => {
  const [formData, setFormData] = useState({
    vorname: "",
    nachname: "",
    email: "",
    telefonnummer: "",
    betreff: "",
    nachricht: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const contactLinkRefs = useRef([]);
  const formCardRef = useRef(null);
  const fieldRefs = useRef([]);
  const buttonRef = useRef(null);
  const successOverlayRef = useRef(null);
  const successModalRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },
          "-=0.25"
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
          "-=0.35"
        )
        .fromTo(
          contactLinkRefs.current,
          { opacity: 0, x: -28 },
          { opacity: 1, x: 0, stagger: 0.12, duration: 0.5, ease: "power3.out" },
          "-=0.2"
        )
        .fromTo(
          formCardRef.current,
          { opacity: 0, y: 48, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "power3.out" },
          "-=0.45"
        )
        .fromTo(
          fieldRefs.current.filter(Boolean),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.07, duration: 0.45, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          buttonRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          "-=0.15"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!isSent) return;

    gsap.fromTo(
      buttonRef.current,
      { scale: 1 },
      { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.out" }
    );

    const overlay = successOverlayRef.current;
    const modal = successModalRef.current;
    if (overlay && modal) {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(
        modal,
        { opacity: 0, scale: 0.88, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.4)", delay: 0.08 }
      );
    }

    const timer = setTimeout(() => setIsSent(false), 3000);
    return () => clearTimeout(timer);
  }, [isSent]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.vorname.trim()) newErrors.vorname = "Pflichtfeld";
    if (!formData.nachname.trim()) newErrors.nachname = "Pflichtfeld";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Ungültige E-Mail";
    if (!formData.telefonnummer.match(/^\+?[0-9\s-]{7,15}$/)) newErrors.telefonnummer = "Ungültige Nummer";
    if (!formData.betreff.trim()) newErrors.betreff = "Pflichtfeld";
    if (!formData.nachricht.trim()) newErrors.nachricht = "Pflichtfeld";
    if (!formData.terms) newErrors.terms = "Bitte akzeptieren";
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid && formCardRef.current) {
      gsap.fromTo(
        formCardRef.current,
        { x: 0 },
        { x: -8, duration: 0.06, repeat: 5, yoyo: true, ease: "power2.inOut" }
      );
    }
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSending(true);

    const templateParams = {
      to_name: "Hango Support",
      from_name: `${formData.vorname} ${formData.nachname}`,
      from_email: formData.email,
      reply_to: formData.email,
      phone: formData.telefonnummer,
      subject: formData.betreff,
      message: `Betreff: ${formData.betreff}\nNachricht: ${formData.nachricht}\n\nTelefonnummer: ${formData.telefonnummer}\nE-Mail: ${formData.email}`,
    };

    emailjs
      .send("service_mn1xjte", "template_n65hvxf", templateParams, "cRQL4WjpEK6oZIUHO")
      .then(
        () => {
          setFormData({ vorname: "", nachname: "", email: "", telefonnummer: "", betreff: "", nachricht: "", terms: false });
          setErrors({});
          setIsSending(false);
          setIsSent(true);
        },
        (error) => {
          console.error("EmailJS send failed:", error);
          const message = error?.text || error?.message || "Bitte versuchen Sie es erneut.";
          alert(`Fehler beim Senden: ${message}`);
          setIsSending(false);
        }
      );
  };

  return (
    <div ref={sectionRef} className="relative w-full overflow-hidden bg-[#f5f5f7] py-12 text-gray-900 md:py-32">
      {isSent && (
        <div ref={successOverlayRef} className="contact-success-modal-overlay" role="status" aria-live="polite">
          <div ref={successModalRef} className="contact-success-modal">
            <div className="contact-success-progress" />
            <span className="contact-success-icon contact-success-icon-lg" aria-hidden="true">
              <svg className="contact-success-ring" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="19" />
              </svg>
              <svg className="contact-success-check contact-success-check-lg" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4.2 4.2L19 7" />
              </svg>
            </span>
            <div className="relative text-center">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-emerald-700">Nachricht gesendet</p>
              <h3 className="mt-3 text-2xl font-extrabold text-gray-950">Danke für Ihre Anfrage</h3>
              <p className="mt-3 text-base leading-7 text-gray-600">Wir haben Ihre Nachricht erhalten und melden uns zeitnah bei Ihnen.</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-24">
          
          {/* Left Column: Typography & Info */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-10">
            <div>
              <p ref={eyebrowRef} className="mb-3 text-xs font-bold uppercase tracking-widest text-red-500 md:mb-4 md:text-sm">Starten wir ein Projekt</p>
              <h2 ref={titleRef} className="mb-4 font-roboto text-3xl font-extrabold leading-tight text-gray-900 md:mb-6 md:text-6xl">
                Bereit für das <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">nächste Level?</span>
              </h2>
              <p ref={descRef} className="max-w-md font-inter text-base leading-relaxed text-gray-600 md:text-xl">
                Lassen Sie uns gemeinsam Ihre digitale Präsenz transformieren. Schreiben Sie uns eine Nachricht, wir melden uns innerhalb von 24 Stunden.
              </p>
            </div>

            <div className="space-y-5 border-t border-gray-200 pt-6 md:space-y-8 md:pt-8">
              <a ref={(el) => (contactLinkRefs.current[0] = el)} href="mailto:business@hango.at" className="group flex items-center gap-4 md:gap-6">
                <div className="h-11 w-11 shrink-0 rounded-full md:h-14 md:w-14 border border-gray-200 bg-white flex items-center justify-center group-hover:border-red-300 transition-colors duration-500 shadow-sm">
                  <svg className="h-5 w-5 text-gray-400 md:h-6 md:w-6 group-hover:text-red-500 transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">E-Mail</p>
                  <p className="text-base font-medium text-gray-900 md:text-xl group-hover:text-red-500 transition-colors duration-500">business@hango.at</p>
                </div>
              </a>

              <a ref={(el) => (contactLinkRefs.current[1] = el)} href="tel:+436605722674" className="group flex items-center gap-4 md:gap-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors duration-500 group-hover:border-red-300 md:h-14 md:w-14">
                  <svg className="h-5 w-5 text-gray-400 transition-colors duration-500 group-hover:text-red-500 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p className="mb-1 text-sm uppercase tracking-widest text-gray-500">Telefon</p>
                  <p className="text-base font-medium text-gray-900 transition-colors duration-500 group-hover:text-red-500 md:text-xl">+43 660 5722 674</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: The Form */}
          <div ref={formCardRef} className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/50 md:rounded-[2rem] md:p-12 md:shadow-2xl">
            <form onSubmit={handleSubmit} className="relative z-10 space-y-5 md:space-y-8">
              <div ref={(el) => (fieldRefs.current[0] = el)} className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
                <div className="relative">
                  <input type="text" name="vorname" value={formData.vorname} onChange={handleChange} placeholder="Vorname" className="w-full bg-transparent border-b-2 border-gray-400 py-2 text-base font-medium text-gray-900 md:py-3 md:text-lg placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors duration-300" />
                  {errors.vorname && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.vorname}</p>}
                </div>
                <div className="relative">
                  <input type="text" name="nachname" value={formData.nachname} onChange={handleChange} placeholder="Nachname" className="w-full bg-transparent border-b-2 border-gray-400 py-2 text-base font-medium text-gray-900 md:py-3 md:text-lg placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors duration-300" />
                  {errors.nachname && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.nachname}</p>}
                </div>
              </div>

              <div ref={(el) => (fieldRefs.current[1] = el)} className="relative">
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-Mail Adresse" className="w-full bg-transparent border-b-2 border-gray-400 py-2 text-base font-medium text-gray-900 md:py-3 md:text-lg placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors duration-300" />
                {errors.email && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div ref={(el) => (fieldRefs.current[2] = el)} className="relative">
                <input type="text" name="telefonnummer" value={formData.telefonnummer} onChange={handleChange} placeholder="Telefonnummer" className="w-full bg-transparent border-b-2 border-gray-400 py-2 text-base font-medium text-gray-900 md:py-3 md:text-lg placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors duration-300" />
                {errors.telefonnummer && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.telefonnummer}</p>}
              </div>

              <div ref={(el) => (fieldRefs.current[3] = el)} className="relative">
                <input type="text" name="betreff" value={formData.betreff} onChange={handleChange} placeholder="Betreff" className="w-full bg-transparent border-b-2 border-gray-400 py-2 text-base font-medium text-gray-900 md:py-3 md:text-lg placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors duration-300" />
                {errors.betreff && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.betreff}</p>}
              </div>

              <div ref={(el) => (fieldRefs.current[4] = el)} className="relative">
                <textarea rows={2} name="nachricht" value={formData.nachricht} onChange={handleChange} placeholder="Wie können wir Ihnen helfen?" className="min-h-[4.5rem] w-full border-b-2 border-gray-400 bg-transparent pb-2 pt-4 text-base font-medium text-gray-900 md:min-h-[6.25rem] md:pt-8 md:text-lg placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors duration-300 resize-none leading-7" />
                {errors.nachricht && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.nachricht}</p>}
              </div>

              <div ref={(el) => (fieldRefs.current[5] = el)} className="relative flex items-start pt-2 md:pt-4">
                <div className="flex items-center h-5 mt-1">
                  <input id="terms" type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} className="h-4 w-4 bg-transparent md:h-5 md:w-5 border-gray-300 rounded text-red-500 focus:ring-red-500 focus:ring-offset-white cursor-pointer" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="cursor-pointer text-sm font-medium leading-snug text-gray-800 md:text-base">
                    Ich stimme den <Link to="/privacy-policy" className="text-gray-900 hover:text-red-500 transition-colors underline decoration-gray-300 underline-offset-4">Datenschutzbestimmungen</Link> zu und erkläre mich mit der Verarbeitung meiner Daten einverstanden.
                  </label>
                </div>
                {errors.terms && <p className="absolute -bottom-5 left-8 text-xs text-red-500">{errors.terms}</p>}
              </div>

              <button ref={buttonRef} type="submit" disabled={isSending} className="mt-4 w-full rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-3 text-sm font-extrabold uppercase tracking-widest text-white transition-all duration-300 hover:from-red-500 hover:to-red-400 md:mt-6 md:py-4 md:text-base flex justify-center items-center group shadow-xl shadow-red-500/30 hover:shadow-red-500/50 transform hover:-translate-y-1">
                <span className="mr-3">{isSent ? "Erfolgreich Gesendet" : isSending ? "Wird gesendet..." : "Nachricht Senden"}</span>
                {!isSent && !isSending && (
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                )}
                {isSent && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                )}
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;
