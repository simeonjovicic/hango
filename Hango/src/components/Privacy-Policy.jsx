import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div id="policy" className="min-h-screen bg-[#f5f5f7] text-black pt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8 bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-200"
        >
          <h1 className="text-3xl md:text-4xl font-bold font-roboto mb-6 text-gray-900 border-b-2 border-gray-200 pb-4">
            Datenschutzerklärung
          </h1>

          <div className="space-y-6 text-gray-700 font-inter">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                1. Verantwortlicher
              </h2>
              <div className="space-y-1 text-gray-600">
                <p>Lee Hanxiang</p>
                <p>Belvederegasse 36/38</p>
                <p>1040 Wien, Österreich</p>
                <p>
                  E-Mail:{" "}
                  <a
                    href="mailto:business@hango.at"
                    className="text-blue-600 hover:text-blue-700 transition"
                  >
                    business@hango.at
                  </a>
                </p>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                2. Erhobene Daten
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>Bei Kontaktaufnahme über unser Formular erfassen wir:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Vor- und Nachname</li>
                  <li>E-Mail-Adresse</li>
                  <li>Telefonnummer (optional)</li>
                  <li>Ihre Nachricht und Betreff</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                3. Zweck der Verarbeitung
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>Die Daten werden ausschließlich verwendet für:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Beantwortung Ihrer Anfrage</li>
                  <li>Technische Abwicklung der Kontaktaufnahme</li>
                  <li>Verbesserung unseres Services</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                4. Rechtsgrundlage
              </h2>
              <p className="text-gray-600">
                Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a
                DSGVO (Einwilligung) durch aktive Zustimmung über das
                Kontaktformular.
              </p>
            </section>

            <section className="space-y-4 pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                5. Datenweitergabe
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  Wir verwenden den Dienst EmailJS zur Übermittlung Ihrer
                  Nachricht. Anbieter: EmailJS LLC, 4106 Fire Rd #3055, Egg
                  Harbor Township, NJ 08234, USA.
                </p>
                <a
                  href="https://www.emailjs.com/legal/privacy-policy/"
                  className="text-blue-600 hover:text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Datenschutzerklärung von EmailJS
                </a>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                6. Speicherdauer
              </h2>
              <p className="text-gray-600">
                Ihre Daten werden gelöscht, sobald sie für den Zweck ihrer
                Erhebung nicht mehr erforderlich sind. Spätestens nach 6 Monaten
                erfolgt eine endgültige Löschung.
              </p>
            </section>

            <section className="space-y-4 pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                7. Ihre Rechte
              </h2>
              <div className="space-y-2 text-gray-600">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Auskunft über gespeicherte Daten</li>
                  <li>Berichtigung oder Löschung</li>
                  <li>Einschränkung der Verarbeitung</li>
                  <li>Widerruf Ihrer Einwilligung</li>
                  <li>Datenübertragbarkeit</li>
                  <li>Beschwerderecht bei der Aufsichtsbehörde</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                8. Sicherheitsmaßnahmen
              </h2>
              <div className="space-y-2 text-gray-600">
                <ul className="list-disc pl-6 space-y-2">
                  <li>SSL-Verschlüsselung</li>
                  <li>Regelmäßige Sicherheitsupdates</li>
                  <li>Zugangsbeschränkungen</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                9. Änderungen dieser Policy
              </h2>
              <p className="text-gray-600">
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen. Die
                jeweils aktuelle Version finden Sie hier.
              </p>
            </section>

            <div className="pt-8">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 border border-gray-800 shadow-sm text-base font-medium rounded-md text-white bg-gray-900 hover:bg-black transition-colors"
              >
                <p>← Zurück zur Startseite</p>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
