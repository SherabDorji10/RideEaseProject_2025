// src/app/page.tsx
import Navbar from './components/common/Navbar';
import HeroSection from './components/common/home/HeroSection';
import HowItWorks from './components/common/home/HowItWorks';
import About from './components/common/about/AboutSection';
import Contact from './components/common/contact/Contact';
import Faqs from './components/common/faqs/FaqSection';
import Footer from './components/common/Footer';

import './globals.css';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <About />
      <Contact />
      <Faqs />
      <Footer/>
    </main>
  );
}

