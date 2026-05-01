import { HashRouter, Routes, Route } from 'react-router-dom'; // Cambiato BrowserRouter in HashRouter
import Home from './PokerTrainingHome'; 
import WinTraining from './WinTraining';
import EquityCalculator from './EquityCalculator';

function App() {
  return (
    /* HashRouter è perfetto per GitHub Pages perché non si confonde con le sottocartelle */
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/win-lab" element={<WinTraining />} />
        <Route path="/equity" element={<EquityCalculator />} />
      </Routes>
    </HashRouter>
  );
}

export default App;