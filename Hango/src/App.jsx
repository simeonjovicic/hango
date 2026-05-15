import AboutUs from "./components/AboutUs";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import Navbar from "./components/Navbar";
import Procedure from "./components/Procedure";
import Footer from "./components/Footer";
import ContactUs from "./components/ContactUs";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Impressum from "./components/Impressum";
import Privacy_Policy from "./components/Privacy-Policy";
import Landingpage from "./components/Landingpage";
import HangoLoader from "./components/HangoLoader";
import { useState } from "react";

const App = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <Router>
      {!loaded && <HangoLoader onComplete={() => setLoaded(true)} />}
      <main style={{ opacity: loaded ? 1 : 0, transition: "opacity 400ms ease-out" }}>
        <Navbar />

        <Routes>
          {/* Main page route */}
          <Route
            path="/"
            element={
              <Landingpage/>
            }
          />

          {/* Impressum route */}
          <Route path="/impressum" element={<Impressum />} />
          {/* Impressum route */}
          <Route path="/privacy-policy" element={<Privacy_Policy />} />
        </Routes>

        <Footer />
      </main>
    </Router>
  );
};

export default App;
