import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './PokerTrainingHome'; // La tua pagina principale
import WinTraining from './WinTraining';
import EquityCalculator from './EquityCalculator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/win-lab" element={<WinTraining />} />
        <Route path="/equity" element={<EquityCalculator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;