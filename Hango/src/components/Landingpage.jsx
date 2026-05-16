import React from 'react'
import AboutUs from "./AboutUs";
import Hero from "./Hero";
import Highlights from "./Highlights";
import ServicesDetail from "./ServicesDetail";
import Portfolio from "./Portfolio";
import Procedure from "./Procedure";
import FAQ from "./FAQ";
import Footer from "./Footer";
import ContactUs from "./ContactUs";
import Navbar from "./Navbar";
import Stats from "./Stats";
import TeamStory from "./TeamStory";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Landingpage = ({ ready = true }) => {
  return (
    <>
      <section id="home">
        <Hero ready={ready} />
      </section>

      {/* <section id="über-uns">
        <AboutUs />
      </section> */}

      {/* <section id="highlights">
        <Highlights />
      </section> */}

      
      <section id="referenzen">
        <Portfolio />
      </section>

      <section id="services">
        <ServicesDetail />
      </section>

      <section id="stats">
        <Stats />
      </section>

      <section id="team">
        <TeamStory />
      </section>

      <section id="ablauf">
        <Procedure />
      </section>

      <section id="faq">
        <FAQ />
      </section>

      <section id="contact">
        <div id="kontakt" />
        <ContactUs />
      </section>
    </>
  );
}

export default Landingpage
