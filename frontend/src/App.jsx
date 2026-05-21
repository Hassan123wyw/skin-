import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Scanner from './pages/Scanner';
import Analyzing from './pages/Analyzing';
import Results from './pages/Results';
import Coach from './pages/Coach';
import History from './pages/History';
import Premium from './pages/Premium';
import Settings from './pages/Settings';
import NavBar from './components/NavBar';

function App() {
  const location = useLocation();
  const hideNav = ['/', '/onboarding', '/analyzing', '/splash'].includes(location.pathname);

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/scan" element={<Scanner />} />
          <Route path="/analyzing" element={<Analyzing />} />
          <Route path="/results" element={<Results />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/history" element={<History />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AnimatePresence>
      {!hideNav && <NavBar />}
    </div>
  );
}

export default App;
