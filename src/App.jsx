import { Routes, Route } from 'react-router-dom';
import RandomBubbles from './components/RandomBubbles';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import JarnviljaDemo from './pages/JarnviljaDemo';

function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <RandomBubbles count={20} />
      <Header />
      <Home />
      <About />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/projects/jarnvilja" element={<JarnviljaDemo />} />
    </Routes>
  );
}

export default App;
