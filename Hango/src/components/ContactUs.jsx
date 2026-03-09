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

  // Reference to the submit button for GSAP animation
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isSent) {
      // Play a quick scale animation on the button
      gsap.fromTo(
        buttonRef.current,
        { scale: 1 },
        {
          scale: 1.2,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
        }
      );

      // Revert "Gesendet!" status after 2 seconds
      const timer = setTimeout(() => {
        setIsSent(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSent]);

  // Validation function
  const validateForm = () => {
    let newErrors = {};

    if (!formData.vorname.trim())
      newErrors.vorname = "Vorname ist erforderlich";
    if (!formData.nachname.trim())
      newErrors.nachname = "Nachname ist erforderlich";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Ungültige E-Mail-Adresse";
    if (!formData.telefonnummer.match(/^\+?[0-9\s-]{7,15}$/))
      newErrors.telefonnummer = "Ungültige Telefonnummer";
    if (!formData.betreff.trim())
      newErrors.betreff = "Betreff ist erforderlich";
    if (!formData.nachricht.trim())
      newErrors.nachricht = "Nachricht darf nicht leer sein";
    if (!formData.terms)
      newErrors.terms = "Bitte akzeptieren Sie die Bedingungen";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSending(true);

    // Match the keys in your code to the placeholders in your EmailJS template
    const templateParams = {
      to_name: "Flowbite Support",
      from_name: `${formData.vorname} ${formData.nachname}`,
      message: `
Betreff: ${formData.betreff}
Nachricht: ${formData.nachricht}

Telefonnummer: ${formData.telefonnummer}
E-Mail: ${formData.email}
      `,
    };

    console.log("Sending email with:", templateParams);

    emailjs
      .send(
        "service_mn1xjte", // Replace with your EmailJS Service ID
        "template_n65hvxf", // Replace with your EmailJS Template ID
        templateParams, // Pass the object with matching placeholder keys
        "cRQL4WjpEK6oZIUHO" // Replace with your EmailJS Public Key (User ID)
      )
      .then(
        (response) => {
          alert("Nachricht erfolgreich gesendet!");
          setFormData({
            vorname: "",
            nachname: "",
            email: "",
            telefonnummer: "",
            betreff: "",
            nachricht: "",
            terms: false,
          });
          setErrors({});
          setIsSending(false);
          setIsSent(true);
        },
        (error) => {
          alert(
            "Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut."
          );
          setIsSending(false);
        }
      );
  };

  return (
    <div className="pt-16 md:pt-40 relative min-h-[182vh] lg:md:min-h-[147vh] w-full bg-gradient-to-t from-[#ffffff] via-[#f5f5f7] to-[#f5f5f7] text-black">
      <h1 className="text-center text-3xl md:text-5xl font-roboto font-extrabold mb-10">
        Kontaktieren Sie uns!
      </h1>

      <div className="max-w-8xl mx-4 md:mx-40 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 p-4 md:p-16 bg-white/50 rounded-xl shadow-sm border border-gray-200 backdrop-blur-md">
        <div className="space-y-10">
          <h2 className="text-2xl md:text-3xl font-bold font-roboto">
            Kontaktmöglichkeiten
          </h2>
          <div className="space-y-6 text-gray-700 text-lg">
            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-6 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md">
              {/* Simplified background animation */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-1 -left-4 w-24 h-24 bg-blue-300 rounded-full blur-2xl opacity-20 animate-pulse-slow" />
              </div>

              <div className="relative flex items-center space-x-4">
                {/* Icon container */}
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-9 w-9 text-blue-400 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                {/* Simplified content */}
                <div className="flex-1">
                  <h3 className="text-[1.3rem] font-semibold text-blue-900 mb-2">
                    Garantierte Antwort innerhalb von 24h
                  </h3>
                  <p className="text-blue-300"></p>
                </div>
              </div>

              {/* Subtle hover effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -inset-12 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent transform -skew-x-12 w-1/3 shine-animation" />
                </div>
              </div>
            </div>

            {/* Email */}
            <a
              href="mailto:business@hango.at"
              className="flex items-center hover:text-blue-400 transition-colors group hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3 text-gray-400 group-hover:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>business@hango.at</span>
            </a>

            {/* Phone */}
            <a
              href="tel:+436605722674"
              className="flex items-center hover:text-blue-400 transition-colors group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3 text-gray-400 group-hover:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>+43 660 5722 674</span>
            </a>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold font-roboto">
            Kontaktieren Sie uns
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-lg font-medium text-gray-900">
                  Vorname
                </label>
                <input
                  type="text"
                  name="vorname"
                  value={formData.vorname}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white border border-gray-300 p-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                />
                {errors.vorname && (
                  <p className="text-red-500">{errors.vorname}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-lg font-medium text-gray-900">
                  Nachname
                </label>
                <input
                  type="text"
                  name="nachname"
                  value={formData.nachname}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white border border-gray-300 p-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                />
                {errors.nachname && (
                  <p className="text-red-500">{errors.nachname}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-1 text-lg font-medium text-gray-900">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md bg-white border border-gray-300 p-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block mb-1 text-lg font-medium text-gray-900">
                Telefonnummer
              </label>
              <input
                type="text"
                name="telefonnummer"
                value={formData.telefonnummer}
                onChange={handleChange}
                className="block w-full rounded-md bg-white border border-gray-300 p-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              />
              {errors.telefonnummer && (
                <p className="text-red-500">{errors.telefonnummer}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-lg font-medium text-gray-900">
                Betreff
              </label>
              <input
                type="text"
                name="betreff"
                value={formData.betreff}
                onChange={handleChange}
                className="block w-full rounded-md bg-white border border-gray-300 p-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              />
              {errors.betreff && (
                <p className="text-red-500">{errors.betreff}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-lg font-medium text-gray-900">
                Ihre Nachricht
              </label>
              <textarea
                rows={3}
                name="nachricht"
                value={formData.nachricht}
                onChange={handleChange}
                className="block w-full rounded-md bg-white border border-gray-300 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none p-2 text-black"
              />
              {errors.nachricht && (
                <p className="text-red-500">{errors.nachricht}</p>
              )}
            </div>

            <div className="flex items-start">
              <input
                id="accept"
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="h-5 w-5 mt-1 mr-3 border-gray-300 rounded"
              />
              <label className="text-lg text-gray-700" htmlFor="accept">
                Ich akzeptiere die{" "}
                <Link
                  to="/privacy-policy"
                  className="text-blue-400 hover:underline"
                >
                  Datenschutzbestimmungen
                </Link>{" "}
                und erkläre mich mit der Verarbeitung meiner Daten einverstanden
              </label>
            </div>
            {errors.terms && <p className="text-red-500">{errors.terms}</p>}

            <div className="flex justify-end">
              <button
                ref={buttonRef}
                type="submit"
                disabled={isSending}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-8 py-4"
              >
                {isSent ? "Gesendet!" : isSending ? "Sende..." : "Abschicken"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;


