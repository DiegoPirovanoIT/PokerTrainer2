import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Hand } from 'pokersolver';

const WinTraining = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState({
    board: [],
    player1: [],
    player2: [],
    winner: null,
    gameOver: false,
    feedback: "",
    p1HandName: "",
    p2HandName: ""
  });

  const generateHand = () => {
    const weights = {
      highCard: 15,
      pair: 15,
      twoPair: 15,
      threeOfAKind: 15,
      straight: 25,
      flush: 20,
      fullHouse: 15,
    };

    const rankMap = {
      highCard: 0,
      pair: 1,
      twoPair: 2,
      threeOfAKind: 3,
      straight: 4,
      flush: 5,
      fullHouse: 6
    };

    const getRandomTargetRank = () => {
      const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
      let random = Math.random() * totalWeight;
      for (const [key, value] of Object.entries(weights)) {
        if (random < value) return rankMap[key];
        random -= value;
      }
      return 0;
    };

    const targetRank = getRandomTargetRank();

    const suits = ['s', 'h', 'd', 'c'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const fullDeck = [];
    suits.forEach(s => values.forEach(v => fullDeck.push(v + s)));

    let hand1, hand2, winnerArray, community, p1, p2;
    let found = false;
    let attempts = 0;

    while (!found && attempts < 1000) {
      attempts++;
      const shuffled = [...fullDeck].sort(() => Math.random() - 0.5);
      community = shuffled.slice(0, 5);
      p1 = shuffled.slice(5, 7);
      p2 = shuffled.slice(7, 9);
      hand1 = Hand.solve([...p1, ...community]);
      hand2 = Hand.solve([...p2, ...community]);
      const highestRankFound = Math.max(hand1.rank, hand2.rank);
      if (highestRankFound >= targetRank) found = true;
    }

    winnerArray = Hand.winners([hand1, hand2]);
    let winningPlayer = 0;
    if (winnerArray.length === 1) {
      winningPlayer = (winnerArray[0] === hand1) ? 1 : 2;
    }

    setGameState({
      board: community,
      player1: p1,
      player2: p2,
      winner: winningPlayer,
      gameOver: false,
      feedback: "",
      p1HandName: hand1.descr,
      p2HandName: hand2.descr
    });
  };

  useEffect(() => {
    generateHand();
  }, []);

  const handleGuess = (playerNum) => {
    if (gameState.gameOver) return;
    if (playerNum === gameState.winner) {
      setScore(prev => prev + 1);
      setGameState(prev => ({ ...prev, gameOver: true, feedback: `CORRECT! 🎉` }));
    } else if (gameState.winner === 0) {
      setGameState(prev => ({ ...prev, gameOver: true, feedback: "SPLIT POT! 🤝" }));
    } else {
      setScore(0);
      setGameState(prev => ({ ...prev, gameOver: true, feedback: `WRONG! ❌` }));
    }
  };

  const CardUI = ({ cardStr }) => {
    if (!cardStr) return null;
    const value = cardStr[0].replace('T', '10');
    const suit = cardStr[1];
    const suitMap = { s: '♠', h: '♥', d: '♦', c: '♣' };
    const colorMap = {
      s: 'text-slate-900',
      h: 'text-red-600',
      d: 'text-blue-600',
      c: 'text-emerald-600'
    };

    return (
      <div className="w-14 h-20 sm:w-24 sm:h-36 flex-shrink-0 bg-white rounded-lg sm:rounded-xl flex items-center justify-center relative shadow-xl border border-slate-200 overflow-hidden transform transition-all">
        <div className={`absolute top-0.5 left-1 sm:top-1.5 sm:left-2 text-sm sm:text-2xl font-bold ${colorMap[suit]}`}>{suitMap[suit]}</div>
        <div className={`absolute top-0.5 right-1 sm:top-1.5 sm:right-2 text-sm sm:text-2xl font-bold ${colorMap[suit]}`}>{suitMap[suit]}</div>
        <div className={`absolute bottom-0.5 left-1 sm:bottom-1.5 sm:left-2 text-sm sm:text-2xl font-bold ${colorMap[suit]} rotate-180`}>{suitMap[suit]}</div>
        <div className={`absolute bottom-0.5 right-1 sm:bottom-1.5 sm:right-2 text-sm sm:text-2xl font-bold ${colorMap[suit]} rotate-180`}>{suitMap[suit]}</div>
        <div className={`font-black leading-none tracking-tighter ${colorMap[suit]} ${value === '10' ? 'text-2xl sm:text-6xl' : 'text-3xl sm:text-7xl'}`}>{value}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-4 flex flex-col selection:bg-emerald-500/30">
      {/* Header */}
      <div className="flex justify-between items-center max-w-5xl mx-auto w-full py-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition font-bold uppercase text-xs tracking-widest">
          <ArrowLeft size={16} /> Exit Lab
        </button>
        <div className="bg-slate-900 px-6 py-2 rounded-full border border-emerald-500/30 flex items-center gap-3 shadow-lg shadow-emerald-900/10">
          <Trophy className="text-emerald-400" size={18} />
          <span className="text-2xl font-black text-emerald-400">{score}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-start w-full max-w-5xl mx-auto pt-8 sm:pt-16">

        {/* Board */}
        {/* Board Container - Altezza fissa per bloccare il layout */}
        <div className="h-[120px] sm:h-[200px] flex items-center justify-center w-full mb-8">
          <div className="flex gap-1.5 sm:gap-4 bg-slate-900/60 p-3 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-x-auto no-scrollbar justify-center items-center mx-auto max-w-[95vw]">
            {gameState.board.map((c, i) => <CardUI key={i} cardStr={c} />)}
          </div>
        </div>

        {/* Players & Selection Blocks */}
        <div className="w-full flex flex-row justify-center items-start gap-3 sm:gap-12 px-2">

          {/* Player 1 */}
          <div className="flex flex-col gap-3 w-1/2 sm:w-auto">
            <div
              onClick={() => handleGuess(1)}
              className={`p-2 sm:p-6 rounded-2xl transition-all duration-500 cursor-pointer relative overflow-hidden ${gameState.gameOver && gameState.winner === 1
                ? 'bg-emerald-500/20 ring-4 ring-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900/40 border border-slate-800'
                }`}
            >
              <div className="flex gap-1 sm:gap-4 mb-3 justify-center">
                {gameState.player1.map((c, i) => <CardUI key={i} cardStr={c} />)}
              </div>
              <div className="bg-blue-600 text-[10px] font-black py-1 rounded-full uppercase text-center shadow-md">P1</div>

              {/* Nome mano P1 (GRANDE) */}
              <div className="mt-4 min-h-[40px] flex items-center justify-center">
                <span className={`text-sm sm:text-lg font-black uppercase tracking-tight transition-all duration-500 
    ${gameState.gameOver ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} 
    text-blue-400`}>
                  {gameState.gameOver ? gameState.p1HandName : '\u00A0'}
                </span>
              </div>
            </div>

            {!gameState.gameOver && (
              <button
                onClick={() => handleGuess(1)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-sm sm:text-xl transition-all active:scale-95 shadow-lg shadow-blue-900/30 uppercase"
              >
                Select P1
              </button>
            )}
          </div>

          {/* Player 2 */}
          <div className="flex flex-col gap-3 w-1/2 sm:w-auto">
            <div
              onClick={() => handleGuess(2)}
              className={`p-2 sm:p-6 rounded-2xl transition-all duration-500 cursor-pointer relative overflow-hidden ${gameState.gameOver && gameState.winner === 2
                ? 'bg-emerald-500/20 ring-4 ring-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900/40 border border-slate-800'
                }`}
            >
              <div className="flex gap-1 sm:gap-4 mb-3 justify-center">
                {gameState.player2.map((c, i) => <CardUI key={i} cardStr={c} />)}
              </div>
              <div className="bg-red-600 text-[10px] font-black py-1 rounded-full uppercase text-center shadow-md">P2</div>

              {/* Nome mano P2 (GRANDE) */}
              <div className="mt-4 min-h-[40px] flex items-center justify-center">
                <span className={`text-sm sm:text-lg font-black uppercase tracking-tight transition-all duration-500 
    ${gameState.gameOver ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} 
    text-red-400`}>
                  {gameState.gameOver ? gameState.p2HandName : '\u00A0'}
                </span>
              </div>
            </div>

            {!gameState.gameOver && (
              <button
                onClick={() => handleGuess(2)}
                className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-xl font-black text-sm sm:text-xl transition-all active:scale-95 shadow-lg shadow-red-900/30 uppercase"
              >
                Select P2
              </button>
            )}
          </div>
        </div>

        {/* Feedback finale (Correction/Wrong) */}
        <div className="mt-8 w-full max-w-md px-4 min-h-[140px]">
          {gameState.gameOver && (
            <div className="flex flex-col items-center gap-5 animate-in fade-in zoom-in duration-300">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black italic text-white tracking-tighter drop-shadow-lg">{gameState.feedback}</div>
              </div>
              <button
                onClick={generateHand}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/40 active:scale-95 uppercase tracking-widest"
              >
                Next Hand <RefreshCw size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WinTraining;