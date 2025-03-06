import React, { useState, useRef, useEffect } from "react";
import emailjs from "emailjs-com";
import { gsap } from "gsap";

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
    <div
      className="relative w-full bg-gradient-to-t to-[#28262B] via-[#3F404F] from-[#3F404F] text-white"
      style={{ minHeight: "120vh" }}
    >
      <h1 className="text-center text-5xl md:text-6xl font-extrabold mb-20">
        Wir würden uns freuen, von Ihnen zu hören
      </h1>

      <div className="max-w-8xl mx-64 grid grid-cols-1 md:grid-cols-2 gap-12 p-16 bg-black/30 rounded-xl shadow-2xl backdrop-blur-md">
        <div className="space-y-10">
          <h2 className="text-3xl font-bold">Kontaktmöglichkeiten</h2>
          <div className="space-y-6 text-gray-200 text-lg">
            <div>
              <h3 className="text-white font-semibold text-xl">Flowbite USA</h3>
              <p>1230 McCormick Rd, EP M, Suite 200, Iowa Myale, MD 20331</p>
              <p className="mt-2">info@flowbite.com</p>
              <p>sales@flowbite.com</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Kontaktieren Sie uns
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-lg font-medium text-gray-200">
                  Vorname
                </label>
                <input
                  type="text"
                  name="vorname"
                  value={formData.vorname}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-gray-800 border border-gray-700 p-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.vorname && (
                  <p className="text-red-500">{errors.vorname}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-lg font-medium text-gray-200">
                  Nachname
                </label>
                <input
                  type="text"
                  name="nachname"
                  value={formData.nachname}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-gray-800 border border-gray-700 p-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.nachname && (
                  <p className="text-red-500">{errors.nachname}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-lg font-medium text-gray-200">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md bg-gray-800 border border-gray-700 p-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block mb-2 text-lg font-medium text-gray-200">
                Telefonnummer
              </label>
              <input
                type="text"
                name="telefonnummer"
                value={formData.telefonnummer}
                onChange={handleChange}
                className="block w-full rounded-md bg-gray-800 border border-gray-700 p-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.telefonnummer && (
                <p className="text-red-500">{errors.telefonnummer}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-lg font-medium text-gray-200">
                Betreff
              </label>
              <input
                type="text"
                name="betreff"
                value={formData.betreff}
                onChange={handleChange}
                className="block w-full rounded-md bg-gray-800 border border-gray-700 p-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.betreff && (
                <p className="text-red-500">{errors.betreff}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-lg font-medium text-gray-200">
                Ihre Nachricht
              </label>
              <textarea
                rows={3}
                name="nachricht"
                value={formData.nachricht}
                onChange={handleChange}
                className="block w-full rounded-md bg-gray-800 border border-gray-700 p-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.nachricht && (
                <p className="text-red-500">{errors.nachricht}</p>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="h-5 w-5 mt-1 mr-3 border-gray-300 rounded"
              />
              <label className="text-lg text-gray-400">
                Ich akzeptiere die Bedingungen
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
