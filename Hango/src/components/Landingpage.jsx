import React from 'react'
import AboutUs from "./AboutUs";
import Hero from "./Hero";
import Highlights from "./Highlights";
import Navbar from "./Navbar";
import Procedure from "./Procedure";
import Footer from "./Footer";
import ContactUs from "./ContactUs";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Landingpage = () => {
    return (
      <>
        <section id="home">
          <Hero />
        </section>

        <section id="über-uns">
          <AboutUs />
        </section>

        <section id="highlights">
          <Highlights />
        </section>

        <section id="ablauf">
          <Procedure />
        </section>

        <section id="kontakt">
          <ContactUs />
        </section>
      </>
    );
}

export default Landingpage