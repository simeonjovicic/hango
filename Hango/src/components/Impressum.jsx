import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Impressum = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8 bg-gray-800 p-6 md:p-10 rounded-xl shadow-xl border border-gray-700"
        >
          <h1 className="text-3xl md:text-4xl font-bold font-roboto mb-6 text-gray-100 border-b-2 border-gray-700 pb-4">
            Impressum
          </h1>

          <div className="space-y-6 text-gray-300 font-inter">
            <p className="text-sm text-gray-400 mb-6">
              Angaben gemäß § 5 (1) ECG, § 25 MedienG, § 63 GewO und § 14 UGB
            </p>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-100 mb-2">
                Webseitenbetreiber
              </h2>
              <div className="space-y-1 text-gray-400">
                <p>Lee Hanxiang</p>
                <p>Belvederegasse 36/38</p>
                <p>1040 Wien</p>
                <p>Österreich</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-100 mb-2">
                Unternehmensdaten
              </h2>
              <div className="space-y-1 text-gray-400">
                <p>UID-Nummer: ATU81775624</p>
                <p>Gewerbebehörde: [Bitte hier eintragen]</p>
                <p>Mitglied der Wirtschaftskammer Österreich (WKO)</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-100 mb-2">
                Kontakt
              </h2>
              <div className="space-y-1  text-gray-400">
                <p>
                  Telefon:{" "}
                  <a
                    href="tel:+436605722674"
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    +43 660 5722674
                  </a>
                </p>
                <p>
                  E-Mail:{" "}
                  <a
                    href="mailto:business@hango.at"
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    business@hango.at
                  </a>
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-100 mb-2">
                Berufsangaben
              </h2>
              <div className="space-y-2">
                <p className="font-medium text-gray-100">
                  IT-Dienstleister im Bereich Webdesign
                </p>
                <p className="text-gray-400">
                  Erbringung von IT-Dienstleistungen, insbesondere Konzeption,
                  Gestaltung, Umsetzung und Pflege von Webseiten, Online-Shops
                  und mobilen Anwendungen sowie Beratung im Bereich digitale
                  Kommunikation und Online-Marketing.
                </p>
              </div>
            </section>

            <section className="space-y-3 pt-4 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-gray-100 mb-2">
                Online-Streitbeilegung
              </h2>
              <p className="text-gray-400">
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  className="text-blue-400 hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ec.europa.eu/consumers/odr
                </a>
              </p>
              <p className="mt-2 text-sm text-gray-400 italic">
                Wir sind nicht verpflichtet und nicht bereit, an einem
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-gray-100 mb-2">
                Urheberrecht
              </h2>
              <p className="text-gray-400">
                Die Inhalte dieser Webseite unterliegen dem Urheberrecht. Jede
                Nutzung außerhalb der gesetzlichen Schranken bedarf unserer
                schriftlichen Zustimmung.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-gray-100 mb-2">
                Haftungsausschluss
              </h2>
              <div className="text-gray-400 space-y-2">
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

            <section className="pt-4 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-gray-100 mb-2">
                Rechtsinformationen
              </h2>
              <p className="text-gray-400">
                Weitere Rechtsvorschriften:{" "}
                <a
                  href="https://www.ris.bka.gv.at"
                  className="text-blue-400 hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ris.bka.gv.at
                </a>
              </p>
            </section>
          </div>

          <div className="pt-8">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-gray-400 shadow-sm text-base font-medium rounded-md text-gray-100 bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <p className="text-gray-400">← Zurück zur Startseite</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Impressum;
