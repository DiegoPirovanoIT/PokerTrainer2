import { useNavigate } from 'react-router-dom';
import React from 'react';
import {
  Trophy,
  Target,
  Zap,
  Layout,
  BarChart3,
  Users,
  ChevronRight
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      {/* Altri contenuti... */}

      <button
        onClick={() => navigate('/equity')}
        className="flex items-center gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all group"
      >
        <div className="bg-emerald-500/20 p-4 rounded-2xl group-hover:bg-emerald-500/30 transition-colors">
          <Calculator className="text-emerald-400" size={32} />
        </div>
        <div className="text-left">
          <h3 className="text-xl font-black uppercase italic">Equity Calculator</h3>
          <p className="text-slate-500 text-sm">Impara a calcolare le tue probabilità di vittoria.</p>
        </div>
      </button>
    </div>
  );
};
const PokerTrainingHome = () => {
  const navigate = useNavigate(); // DEVE stare dentro la funzione
  // Funzione per lo scroll fluido (opzionale ma consigliata)
  const scrollToModes = (e) => {
    e.preventDefault();
    const element = document.getElementById('modes-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleStart = () => {
    navigate('/win-training');
  };
  const trainingModes = [
    {
      title: "Find the winner",
      desc: "Get dealt some decks and find as fast as possible who won.",
      icon: <Target className="w-8 h-8 text-emerald-400" />,
      color: "hover:border-emerald-500",
      path: "/win-lab", // Assicurati che corrisponda a quello in App.jsx
      disabled: false
    },
    {
      title: "Equity calculator",
      desc: "Calculate equity of hand vs hands or hand vs range.",
      icon: <Trophy className="w-8 h-8 text-amber-400" />,
      color: "hover:border-amber-500",
      path: "/equity", // Assicurati che corrisponda a quello in App.jsx
      disabled: false
    },
    {
      title: "Preflop Ranges",
      desc: "Import your GTO charts and train them.",
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      color: "hover:border-blue-500",
      disabled: true
    },
    {
      title: "EV fold",
      desc: "Learn when to fold based on expected value calculations.",
      icon: <Layout className="w-8 h-8 text-purple-400" />,
      color: "hover:border-purple-500",
      disabled: true
    },
    {
      title: "Hand analyzer",
      desc: "Import your pokerstars hand history and analyze your play.",
      icon: <BarChart3 className="w-8 h-8 text-red-400" />,
      color: "hover:border-red-500",
      disabled: true
    },
    {
      title: "Incoming",
      desc: "Other modes coming soon.",
      icon: <Users className="w-8 h-8 text-cyan-400" />,
      color: "hover:border-cyan-500",
      disabled: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">

      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 absolute w-full z-50">
        <div className="text-2xl font-black tracking-tighter italic text-emerald-500">
          POKER<span className="text-white">TRAINER2</span>
        </div>

        <button
          onClick={scrollToModes}
          className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-full font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-95 cursor-pointer"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=2073&auto=format&fit=crop"
            alt="Poker Table"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl pt-24">
          <div className="inline-block mb-4 px-4 py-1 border border-emerald-500/30 rounded-full bg-emerald-500/10">
            <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-xs">
              The Ultimate (free) Training Ground
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-none">
            Become the best. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              For free.
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Poker training lab completey free, no ads, no payments. Built by a poker player that thought prices of training tools where too high.
          </p>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Pirovano Diego
          </p>
        </div>
      </div>

      {/* Main Training Section */}
      <section id="modes-section" className="max-w-7xl mx-auto px-6 pb-32 relative z-20">

        {/* Training Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingModes.map((mode, index) => (
            <div
              key={index}
              // MODIFICA QUI: Naviga al path specifico dell'oggetto
              onClick={() => {
                if (!mode.disabled && mode.path) {
                  navigate(mode.path);
                }
              }}
              className={`group relative p-8 rounded-3xl border transition-all duration-300 backdrop-blur-xl 
                  ${mode.disabled
                  ? 'bg-slate-900/40 border-slate-900 cursor-not-allowed opacity-60'
                  : `bg-slate-900/80 border-slate-800 cursor-pointer border-b-4 hover:-translate-y-3 hover:shadow-2xl hover:shadow-emerald-950/20 ${mode.color}`
                }`}
            >
              {/* Coming Soon Badge */}
              {mode.disabled && (
                <div className="absolute top-4 right-6 bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border border-slate-700">
                  Coming Soon
                </div>
              )}

              {/* Assicurati che le icone e i titoli siano corretti come prima */}
              <div className={`mb-6 bg-slate-800 w-fit p-4 rounded-2xl transition-all ${!mode.disabled && 'group-hover:scale-110 group-hover:bg-slate-700'}`}>
                <div className={mode.disabled ? 'grayscale opacity-50' : ''}>
                  {mode.icon}
                </div>
              </div>

              <h3 className={`text-2xl font-bold mb-3 transition-colors ${!mode.disabled && 'group-hover:text-emerald-400'}`}>
                {mode.title}
              </h3>

              <p className="text-slate-400 leading-relaxed mb-8">
                {mode.desc}
              </p>

              <div className={`flex items-center text-sm font-bold uppercase tracking-widest transition-colors ${mode.disabled ? 'text-slate-600' : 'text-slate-500 group-hover:text-white'}`}>
                {mode.disabled ? 'Under Development' : (
                  <>
                    Enter Arena <ChevronRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Section */}
      <footer className="py-20 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold mb-8">
            Developed by Diego Pirovano
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PokerTrainingHome;