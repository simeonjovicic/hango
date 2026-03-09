import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Impressum = () => {
  return (
    <div id="impressuma" className="min-h-screen bg-[#f5f5f7] text-black pt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8 bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-200"
        >
          <h1 className="text-3xl md:text-4xl font-bold font-roboto mb-6 text-gray-900 border-b-2 border-gray-200 pb-4">
            Impressum
          </h1>

          <div className="space-y-6 text-gray-700 font-inter">
            <p className="text-sm text-gray-600 mb-6">
              Angaben gemäß § 5 (1) ECG, § 25 MedienG, § 63 GewO und § 14 UGB
            </p>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Webseitenbetreiber
              </h2>
              <div className="space-y-1 text-gray-600">
                <p>Lee Hanxiang</p>
                <p>Belvederegasse 36/38</p>
                <p>1040 Wien</p>
                <p>Österreich</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Unternehmensdaten
              </h2>
              <div className="space-y-1 text-gray-600">
                <p>UID-Nummer: ATU81775624</p>
                <p>Gewerbebehörde: [Bitte hier eintragen]</p>
                <p>Mitglied der Wirtschaftskammer Österreich (WKO)</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Kontakt
              </h2>
              <div className="space-y-1  text-gray-600">
                <p>
                  Telefon:{" "}
                  <a
                    href="tel:+436605722674"
                    className="text-blue-600 hover:text-blue-700 transition"
                  >
                    +43 660 5722674
                  </a>
                </p>
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

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Berufsangaben
              </h2>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">
                  IT-Dienstleister & Digital Marketing Agentur
                </p>
                <p className="text-gray-600">
                  Erbringung von IT-Dienstleistungen, insbesondere Konzeption,
                  Gestaltung, Umsetzung und Pflege von Webseiten, Online-Shops
                  und mobilen Anwendungen. Zusätzlich Leistungen im Bereich SEO,
                  Performance Marketing (Meta/Google Ads) und Beratung für digitale Kommunikation.
                </p>
              </div>
            </section>

            <section className="space-y-3 pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Online-Streitbeilegung
              </h2>
              <p className="text-gray-600">
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  className="text-blue-600 hover:text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ec.europa.eu/consumers/odr
                </a>
              </p>
              <p className="mt-2 text-sm text-gray-600 italic">
                Wir sind nicht verpflichtet und nicht bereit, an einem
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Urheberrecht
              </h2>
              <p className="text-gray-600">
                Die Inhalte dieser Webseite unterliegen dem Urheberrecht. Jede
                Nutzung außerhalb der gesetzlichen Schranken bedarf unserer
                schriftlichen Zustimmung.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Haftungsausschluss
              </h2>
              <div className="text-gray-600 space-y-2">
                <p>
                  Trotz sorgfältiger Kontrolle übernehmen wir keine Haftung für
                  externe Links. Für deren Inhalte sind ausschließlich die
                  Betreiber der verlinkten Seiten verantwortlich.
                </p>
                <p>
                  Bei Rechtsverstößen bitten wir um Hinweis gemäß § 17 Abs. 2
                  ECG. Rechtswidrige Inhalte werden umgehend entfernt.
                </p>
              </div>
            </section>

            <section className="pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Rechtsinformationen
              </h2>
              <p className="text-gray-600">
                Weitere Rechtsvorschriften:{" "}
                <a
                  href="https://www.ris.bka.gv.at"
                  className="text-blue-600 hover:text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ris.bka.gv.at
                </a>
              </p>
            </section>

            <section className="pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Icon Attribution
              </h2>
              <p className="text-gray-600">
                <a
                  href="https://www.flaticon.com/free-icons/performance"
                  title="performance icons"
                  className="text-blue-600 hover:text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Icons used in the About Us section created by Freepik -
                  Flaticon
                </a>
              </p>
            </section>
          </div>

          <div className="pt-8">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <p className="text-gray-700">← Zurück zur Startseite</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Impressum;
