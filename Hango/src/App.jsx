import AboutUs from './components/AboutUs';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Navbar from './components/Navbar';
import Procedure from './components/Procedure';
import Footer from './components/Footer'
import ContactUs from './components/ContactUs';


const App = () => {
  return (
    <main>
      <Navbar />
      <Hero/> 
      <AboutUs/>
      <Highlights/>
      <Procedure/>
      <ContactUs/>
      <Footer/>
    </main>
  )
}

export default App;
