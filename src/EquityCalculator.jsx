import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator as CalcIcon, RefreshCw, Eye, EyeOff, Target, Trash2, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as PokerOdds from 'poker-odds-calculator';

const EquityCalculator = () => {
  const navigate = useNavigate();

  // --- RANGE DI DEFAULT (Immagine 660a21.png) ---
  const getDefaultRange = () => {
    const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    const defaultRange = new Array(169).fill(false);
    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 13; col++) {
        const r1 = ranks[row]; const r2 = ranks[col];
        const index = row * 13 + col;
        if (row === col) defaultRange[index] = true;
        else if (row < col) {
          if (r1 === 'A' || r1 === 'K') defaultRange[index] = true;
          if (r1 === 'Q' && col <= 8) defaultRange[index] = true;
          if (r1 === 'J' && col <= 6) defaultRange[index] = true;
          if (r1 === 'T' && col <= 5) defaultRange[index] = true;
          if (r1 === '9' && (col === 4 || col === 5)) defaultRange[index] = true;
          if (r1 === '8' && col === 4) defaultRange[index] = true;
          if (r1 === '7' && (col === 5 || col === 6)) defaultRange[index] = true;
          if (r1 === '6' && col === 6) defaultRange[index] = true;
          if (r1 === '5' && col === 7) defaultRange[index] = true;
          if (r1 === '4' && col === 8) defaultRange[index] = true;
        } else {
          if (r2 === 'A') defaultRange[index] = true;
          if (r2 === 'K' && row <= 8) defaultRange[index] = true;
          if (r2 === 'Q' && row <= 5) defaultRange[index] = true;
          if (r2 === 'J' && row <= 4) defaultRange[index] = true;
        }
      }
    }
    return defaultRange;
  };

  // --- STATI ---
  const [settings, setSettings] = useState({ street: 3, showOpponent: true, excludeTies: false });
  const [range, setRange] = useState(getDefaultRange());
  const [userGuess, setUserGuess] = useState(50);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [showRange, setShowRange] = useState(true);
  const [gameState, setGameState] = useState({
    board: [], playerHand: [], opponentHand: [],
    equity: 0, winProb: 0, lossProb: 0, tieProb: 0,
    isCalculating: false
  });

  const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

  const getHandFromGrid = (row, col) => {
    const r1 = ranks[row]; const r2 = ranks[col];
    return row < col ? r1 + r2 + 's' : row > col ? r2 + r1 + 'o' : r1 + r2;
  };

  const getAvailableCombosFromRange = (currentRange, excludedCards) => {
    const suits = ['s', 'h', 'd', 'c'];
    const combos = [];
    currentRange.forEach((isActive, index) => {
      if (!isActive) return;
      const row = Math.floor(index / 13); const col = index % 13;
      const r1 = ranks[row], r2 = ranks[col];
      if (row === col) {
        for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
          const c1 = r1 + suits[i], c2 = r2 + suits[j];
          if (!excludedCards.includes(c1) && !excludedCards.includes(c2)) combos.push([c1, c2]);
        }
      } else if (row < col) {
        suits.forEach(s => {
          const c1 = r1 + s, c2 = r2 + s;
          if (!excludedCards.includes(c1) && !excludedCards.includes(c2)) combos.push([c1, c2]);
        });
      } else {
        suits.forEach(s1 => suits.forEach(s2 => {
          if (s1 !== s2) {
            const c1 = r2 + s1, c2 = r1 + s2;
            if (!excludedCards.includes(c1) && !excludedCards.includes(c2)) combos.push([c1, c2]);
          }
        }));
      }
    });
    return combos;
  };



  const generateScenario = () => {

    {
      // debug
      const player1Cards = PokerOdds.CardGroup.fromString('AhAs');
      const player2Cards = PokerOdds.CardGroup.fromString('AcAd');
      const board = PokerOdds.CardGroup.fromString('7s9sTd');

      const result = PokerOdds.OddsCalculator.calculate([player1Cards, player2Cards], board);

      console.log(`Player #1 - ${player1Cards} - ${result.equities[0].getEquity()}%`);
      console.log(`Player #2 - ${player2Cards} - ${result.equities[1].getEquity()}%`);


      console.log(`Player #1 - ${player1Cards} - ${result.equities[0].getEquity()}%`);
      console.log(result.equities);

      console.log(result.equities[0].getEquity());
      console.log(result.equities[0].getTiePercentage());
    }


    const suits = ['s', 'h', 'd', 'c'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const fullDeck = [];
    suits.forEach(s => values.forEach(v => fullDeck.push(v + s)));

    const myPossible = getAvailableCombosFromRange(range, []);
    const myHand = myPossible.length > 0 ? myPossible[Math.floor(Math.random() * myPossible.length)] : ["As", "Ah"];
    let deck = fullDeck.filter(c => !myHand.includes(c));
    deck.sort(() => Math.random() - 0.5);
    const community = deck.slice(0, settings.street);
    const forbidden = [...myHand, ...community];
    const oppPossible = getAvailableCombosFromRange(range, forbidden);
    const randomOpp = oppPossible.length > 0 ? oppPossible[Math.floor(Math.random() * oppPossible.length)] : ["Ks", "Kh"];

    setHasGuessed(false);
    setGameState(prev => ({ ...prev, playerHand: myHand, opponentHand: randomOpp, board: community, isCalculating: true }));

    setTimeout(() => {
      try {
        const playerCG = PokerOdds.CardGroup.fromString(myHand.join(''));
        const boardCG = community.length > 0 ? PokerOdds.CardGroup.fromString(community.join('')) : undefined;

        let tWinOnly = 0, tTie = 0, tLossOnly = 0, tEquity = 0, count = 0;
        const combosToCalculate = settings.showOpponent ? [randomOpp] : oppPossible;

        combosToCalculate.forEach(combo => {
          const oppCG = PokerOdds.CardGroup.fromString(combo.join(''));
          const result = PokerOdds.OddsCalculator.calculate([playerCG, oppCG], boardCG);

          const p1 = result.equities[0];
          const p2 = result.equities[1];

          const eq1 = p1.getEquity();
          const eq2 = p2.getEquity();
          const tie = p1.getTiePercentage();

          // Probabilità pure per i dettagli in piccolo
          tWinOnly += eq1
          tTie += tie;
          tLossOnly += eq2

          console.log("Exluce ties:", settings.excludeTies, "Eq1:", eq1, "Eq2:", eq2, "Tie%:", tie);
          if (settings.excludeTies) {
            tEquity += (eq1 / (eq1 + eq2)) * 100;
          } else {
            tEquity += eq1;
          }
          count++;
        });

        setGameState(prev => ({
          ...prev,
          equity: Math.round(tEquity / count),
          winProb: (tWinOnly / count).toFixed(1),
          tieProb: (tTie / count).toFixed(1),
          lossProb: (tLossOnly / count).toFixed(1),
          isCalculating: false
        }));
      } catch (e) {
        setGameState(prev => ({ ...prev, isCalculating: false }));
      }
    }, 50);
  };

  useEffect(() => { generateScenario(); }, [settings.street, settings.showOpponent, settings.excludeTies, range]);

  const CardUI = ({ cardStr, hidden = false }) => {
    if (hidden) return <div className="w-12 h-16 sm:w-20 sm:h-28 bg-slate-800 rounded-lg border-2 border-slate-700 flex items-center justify-center animate-pulse" />;
    const value = cardStr[0].replace('T', '10'); const suit = cardStr[1];
    const colorMap = { s: 'text-slate-900', h: 'text-red-600', d: 'text-blue-600', c: 'text-emerald-600' };
    const suitMap = { s: '♠', h: '♥', d: '♦', c: '♣' };
    return (
      <div className="w-12 h-16 sm:w-20 sm:h-28 bg-white rounded-lg flex items-center justify-center relative shadow-xl border border-slate-200 overflow-hidden">
        <div className={`absolute top-0.5 left-1 text-xs sm:text-lg font-bold ${colorMap[suit]}`}>{suitMap[suit]}</div>
        <div className={`font-black leading-none tracking-tighter ${colorMap[suit]} ${value === '10' ? 'text-xl sm:text-4xl' : 'text-2xl sm:text-5xl'}`}>{value}</div>
      </div>
    );
  };

  <style>

</style>
  return (
    
    <div className="min-h-screen bg-slate-950 text-white font-sans p-4 flex flex-col items-center">
      <style dangerouslySetInnerHTML={{ __html: `
      input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none !important;
        appearance: none !important;
        width: 20px !important;
        height: 20px !important;
        background: #10b981 !important;
        border: 2px solid #0f172a !important;
        radius: 50% !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        box-shadow: 0 0 8px rgba(16, 185, 129, 0.4) !important;
      }

      input[type='range']::-moz-range-thumb {
        width: 20px !important;
        height: 20px !important;
        background: #10b981 !important;
        border: 2px solid #0f172a !important;
        border-radius: 50% !important;
        cursor: pointer !important;
      }

      input[type='range']::-webkit-slider-runnable-track {
        -webkit-appearance: none !important;
        box-shadow: none !important;
        border: none !important;
        background: transparent !important;
      }
    `}} />
      <div className="flex justify-between items-center max-w-7xl mx-auto w-full mb-4">
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white transition font-bold uppercase text-[10px] tracking-widest flex items-center gap-1"><ArrowLeft size={14} /> Exit</button>
        <div className="flex items-center gap-2 text-emerald-400 font-black tracking-widest uppercase text-sm"><CalcIcon size={18} /> Equity Lab</div>
      </div>

      <div className="w-full max-w-4xl bg-slate-900/40 border border-slate-800/50 p-3 rounded-2xl mb-6 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl px-3 py-1.5 transition-all group relative">
          <div className="relative flex items-center">
            <select
              value={settings.street}
              onChange={(e) => setSettings(s => ({ ...s, street: parseInt(e.target.value) }))}
              className="bg-transparent font-black text-emerald-400 text-xs outline-none cursor-pointer appearance-none pr-5 relative z-10"
            >
              <option value={3} className="bg-slate-900 text-white">FLOP</option>
              <option value={4} className="bg-slate-900 text-white">TURN</option>
              <option value={5} className="bg-slate-900 text-white">RIVER</option>
            </select>
            {/* Freccetta personalizzata */}
            <div className="absolute right-0 pointer-events-none text-emerald-400/50 group-hover:text-emerald-400 transition-colors">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1l4 4 4-4" />
              </svg>
            </div>
          </div>
        </div>
        <button onClick={() => setSettings(s => ({ ...s, showOpponent: !s.showOpponent }))} className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-xs transition-all ${settings.showOpponent ? 'bg-emerald-600' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>{settings.showOpponent ? <Eye size={14} /> : <EyeOff size={14} />} Opponent: {settings.showOpponent ? "Visible" : "Hidden"}</button>
        <button onClick={() => setSettings(s => ({ ...s, excludeTies: !s.excludeTies }))} className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-xs transition-all ${settings.excludeTies ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-amber-600'}`}><Scale size={14} /> {settings.excludeTies ? "Exclude Ties" : "Include Ties"}</button>
        <button onClick={() => setShowRange(!showRange)} className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-xs transition-all ${showRange ? 'bg-indigo-600' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
          {showRange ? <Eye size={14} /> : <EyeOff size={14} />} Range Grid: {showRange ? "Visible" : "Hidden"}
        </button>
      </div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 items-start justify-center mb-6">
        <div className="flex-1 flex flex-col items-center w-full bg-slate-900/20 p-6 rounded-[40px] border border-slate-800/30">
          <div className="mb-8 flex gap-2 sm:gap-3 bg-slate-950/50 p-4 rounded-3xl border border-slate-800 shadow-inner">
            {gameState.board.map((c, i) => <CardUI key={i} cardStr={c} />)}
            {[...Array(5 - gameState.board.length)].map((_, i) => <div key={i} className="w-12 h-16 sm:w-20 sm:h-28 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-800 font-black opacity-10">?</div>)}
          </div>
          <div className="flex gap-10 sm:gap-16">
            <div className="flex flex-col items-center gap-2"><span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Player 1</span><div className="flex gap-2 p-2 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">{gameState.playerHand.map((c, i) => <CardUI key={i} cardStr={c} />)}</div></div>
            <div className="flex flex-col items-center gap-2"><span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Opponent</span><div className="flex gap-2 p-2 bg-slate-900/60 rounded-2xl border border-slate-800">{gameState.opponentHand.map((c, i) => <CardUI key={i} cardStr={c} hidden={!settings.showOpponent} />)}</div></div>
          </div>
        </div>

        {showRange && (
          <div className="bg-slate-900/60 p-4 rounded-[32px] border border-slate-800 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-3 px-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Range Grid</h3>
              <button onClick={() => setRange(getDefaultRange())} className="text-slate-500 hover:text-emerald-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid gap-0.5 bg-slate-950 p-1 rounded-xl" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
              {range.map((isActive, index) => {
                const row = Math.floor(index / 13), col = index % 13;
                return (
                  <div
                    key={index}
                    onClick={() => { const n = [...range]; n[index] = !n[index]; setRange(n); }}
                    className={`w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center text-[7px] sm:text-[9px] font-bold cursor-pointer transition-all ${isActive ? 'bg-emerald-500 text-white rounded-sm' : row === col ? 'bg-slate-800 text-slate-500' : row < col ? 'bg-slate-900 text-slate-600' : 'bg-slate-950 text-slate-700'}`}
                  >
                    {getHandFromGrid(row, col)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-xl bg-slate-900/50 p-8 rounded-[32px] border border-slate-800 shadow-2xl">
        {!hasGuessed ? (
          <div className="flex flex-col gap-6">
            <div className="text-center flex items-center justify-center gap-2">
              <Target size={16} className="text-emerald-500" />
              <h4 className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Guess the Equity</h4>
              {gameState.isCalculating && <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>}
            </div>

            <div className="flex items-center gap-6">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={userGuess} 
                onChange={(e) => setUserGuess(parseInt(e.target.value) || 0)} 
                style={{
                  background: `linear-gradient(to right, #10b981 ${userGuess}%, #1e293b ${userGuess}%)`
                }}
                // appearance-none è obbligatoria per attivare il custom thumb
                className="slider flex-1 h-1.5 rounded-lg appearance-none cursor-pointer outline-none bg-slate-800" 
              />

              {/* Il campo di input numerico che abbiamo fatto prima */}
              <div className="relative group">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={userGuess}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val)) val = 0;
                    if (val > 100) val = 100;
                    setUserGuess(val);
                  }}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xl font-black text-emerald-400 min-w-[80px] w-20 text-center focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-600 font-bold pointer-events-none">%</span>
              </div>
            </div>

            <button
              onClick={() => setHasGuessed(true)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-xs transition-all uppercase tracking-widest shadow-lg shadow-emerald-900/20 active:scale-95"
            >
              Verify Equity
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="text-center p-4 bg-slate-800/30 rounded-2xl border border-slate-700"><div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Your Guess</div><div className="text-3xl font-black">{userGuess}%</div></div>
              <div className="text-center p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><div className="text-[9px] font-bold text-emerald-400 uppercase mb-1">Actual</div><div className="text-3xl font-black text-white">{gameState.equity}%</div></div>
            </div>

            {/* DETTAGLI PICCOLI */}
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <div className="flex flex-col items-center"><span className="text-emerald-500">P1 Win</span><span>{gameState.winProb}%</span></div>
              <div className="flex flex-col items-center"><span className="text-red-500">P2 Win</span><span>{gameState.lossProb}%</span></div>
              <div className="flex flex-col items-center"><span className="text-amber-500">Tie</span><span>{gameState.tieProb}%</span></div>
            </div>

            <div className={`w-full py-3 rounded-2xl text-center border font-black ${Math.abs(userGuess - gameState.equity) <= 5 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : Math.abs(userGuess - gameState.equity) <= 15 ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}><div className="text-[10px] uppercase opacity-60">Error Absolute: ±{Math.abs(userGuess - gameState.equity)}%</div></div>
            <button onClick={generateScenario} className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest"><RefreshCw size={16} /> New Deal</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquityCalculator;