import React, { useState, useRef, useEffect } from "react";
import emailjs from "emailjs-com";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

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
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isSent) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 1 },
        { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.out" }
      );
      const timer = setTimeout(() => setIsSent(false), 3000);
      return () => clearTimeout(timer);
    }
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
    return Object.keys(newErrors).length === 0;
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
    <div className="relative w-full bg-[#f5f5f7] text-gray-900 overflow-hidden py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Typography & Info */}
          <div className="flex flex-col justify-center space-y-10">
            <div>
              <p className="text-red-500 font-bold tracking-widest uppercase text-sm mb-4">Starten wir ein Projekt</p>
              <h2 className="text-4xl md:text-6xl font-extrabold font-roboto leading-tight mb-6 text-gray-900">
                Bereit für das <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">nächste Level?</span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl font-inter max-w-md leading-relaxed">
                Lassen Sie uns gemeinsam Ihre digitale Präsenz transformieren. Schreiben Sie uns eine Nachricht, wir melden uns innerhalb von 24 Stunden.
              </p>
            </div>

            <div className="space-y-8 pt-8 border-t border-gray-200">
              <a href="mailto:business@hango.at" className="group flex items-center space-x-6">
                <div className="w-14 h-14 rounded-full border border-gray-200 bg-white flex items-center justify-center group-hover:border-red-300 transition-colors duration-500 shadow-sm">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">E-Mail</p>
                  <p className="text-xl font-medium text-gray-900 group-hover:text-red-500 transition-colors duration-500">business@hango.at</p>
                </div>
              </a>

              <a href="tel:+436605722674" className="group flex items-center space-x-6">
                <div className="w-14 h-14 rounded-full border border-gray-200 bg-white flex items-center justify-center group-hover:border-red-300 transition-colors duration-500 shadow-sm">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Telefon</p>
                  <p className="text-xl font-medium text-gray-900 group-hover:text-red-500 transition-colors duration-500">+43 660 5722 674</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: The Form */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 relative">
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <input type="text" name="vorname" value={formData.vorname} onChange={handleChange} placeholder="Vorname" className="w-full bg-transparent border-b-2 border-gray-400 py-3 text-gray-900 text-lg font-medium placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors duration-300" />
                  {errors.vorname && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.vorname}</p>}
                </div>
                <div className="relative">
                  <input type="text" name="nachname" value={formData.nachname} onChange={handleChange} placeholder="Nachname" className="w-full bg-transparent border-b-2 border-gray-400 py-3 text-gray-900 text-lg font-medium placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors duration-300" />
                  {errors.nachname && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.nachname}</p>}
                </div>
              </div>

              <div className="relative">
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-Mail Adresse" className="w-full bg-transparent border-b-2 border-gray-400 py-3 text-gray-900 text-lg font-medium placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors duration-300" />
                {errors.email && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="relative">
                <input type="text" name="telefonnummer" value={formData.telefonnummer} onChange={handleChange} placeholder="Telefonnummer" className="w-full bg-transparent border-b-2 border-gray-400 py-3 text-gray-900 text-lg font-medium placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors duration-300" />
                {errors.telefonnummer && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.telefonnummer}</p>}
              </div>

              <div className="relative">
                <input type="text" name="betreff" value={formData.betreff} onChange={handleChange} placeholder="Betreff" className="w-full bg-transparent border-b-2 border-gray-400 py-3 text-gray-900 text-lg font-medium placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors duration-300" />
                {errors.betreff && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.betreff}</p>}
              </div>

              <div className="relative">
                <textarea rows={2} name="nachricht" value={formData.nachricht} onChange={handleChange} placeholder="Wie können wir Ihnen helfen?" className="w-full bg-transparent border-b-2 border-gray-400 pt-8 pb-2 min-h-[6.25rem] text-gray-900 text-lg font-medium placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors duration-300 resize-none leading-7" />
                {errors.nachricht && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.nachricht}</p>}
              </div>

              <div className="relative flex items-start pt-4">
                <div className="flex items-center h-5 mt-1">
                  <input id="terms" type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} className="w-5 h-5 bg-transparent border-gray-300 rounded text-red-500 focus:ring-red-500 focus:ring-offset-white cursor-pointer" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-800 font-medium cursor-pointer text-base">
                    Ich stimme den <Link to="/privacy-policy" className="text-gray-900 hover:text-red-500 transition-colors underline decoration-gray-300 underline-offset-4">Datenschutzbestimmungen</Link> zu und erkläre mich mit der Verarbeitung meiner Daten einverstanden.
                  </label>
                </div>
                {errors.terms && <p className="absolute -bottom-5 left-8 text-xs text-red-500">{errors.terms}</p>}
              </div>

              <button ref={buttonRef} type="submit" disabled={isSending} className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white transition-all duration-300 font-extrabold tracking-widest uppercase py-4 rounded-xl flex justify-center items-center group shadow-xl shadow-red-500/30 hover:shadow-red-500/50 transform hover:-translate-y-1">
                <span className="mr-3">{isSent ? "Erfolgreich Gesendet" : isSending ? "Wird gesendet..." : "Nachricht Senden"}</span>
                {!isSent && !isSending && (
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                )}
                {isSent && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                )}
              </button>

              {isSent && (
                <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-800 shadow-sm animate-success-slide">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white animate-success-pop">
                    <svg className="h-6 w-6 animate-success-draw" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-bold text-green-950">Nachricht gesendet</p>
                    <p className="text-sm text-green-700">Danke, wir melden uns so schnell wie möglich.</p>
                  </div>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;
