
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Participant } from '../types';

interface Props {
  participants: Participant[];
}

const RaffleRoom: React.FC<Props> = ({ participants }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentName, setCurrentName] = useState('準備好了嗎？');
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const [availableNames, setAvailableNames] = useState<string[]>([]);
  
  const timerRef = useRef<number | null>(null);

  // Initialize/reset available names when participants change or settings toggle
  useEffect(() => {
    setAvailableNames(participants.map(p => p.name));
    setHistory([]);
    setWinner(null);
    setCurrentName('準備好了嗎？');
  }, [participants]);

  const startRoll = useCallback(() => {
    if (isRolling) return;
    
    // Check if we have names left
    if (!allowDuplicate && availableNames.length === 0) {
      alert('所有人都已經中過獎了！');
      return;
    }

    setIsRolling(true);
    setWinner(null);

    const source = allowDuplicate ? participants.map(p => p.name) : availableNames;
    let iterations = 0;
    const maxIterations = 30;

    const roll = () => {
      const randomIndex = Math.floor(Math.random() * source.length);
      setCurrentName(source[randomIndex]);
      
      iterations++;
      if (iterations < maxIterations) {
        timerRef.current = window.setTimeout(roll, 50 + iterations * 5);
      } else {
        // Finalize winner
        const winName = source[randomIndex];
        setWinner(winName);
        setHistory(prev => [winName, ...prev]);
        setIsRolling(false);
        
        if (!allowDuplicate) {
          setAvailableNames(prev => prev.filter(name => name !== winName));
        }
      }
    };

    roll();
  }, [isRolling, allowDuplicate, availableNames, participants]);

  const resetRaffle = () => {
    setAvailableNames(participants.map(p => p.name));
    setHistory([]);
    setWinner(null);
    setCurrentName('準備好了嗎？');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column: Raffle Machine */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-indigo-100 p-8 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-indigo-900 tracking-tight flex items-center">
              <span className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center mr-3">
                <i className="fa-solid fa-ticket"></i>
              </span>
              大驚喜抽籤筒
            </h2>
            <div className="flex items-center gap-6">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={allowDuplicate}
                    onChange={(e) => {
                      setAllowDuplicate(e.target.checked);
                      resetRaffle();
                    }}
                  />
                  <div className={`w-12 h-6 rounded-full shadow-inner transition-colors ${allowDuplicate ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${allowDuplicate ? 'translate-x-6' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">允許重複獲獎</span>
              </label>
              
              <button 
                onClick={resetRaffle}
                className="text-slate-400 hover:text-rose-500 transition-colors"
                title="重新開始"
              >
                <i className="fa-solid fa-rotate-right text-xl"></i>
              </button>
            </div>
          </div>

          <div className="relative w-full max-w-lg aspect-[16/9] flex items-center justify-center bg-slate-900 rounded-[2rem] border-8 border-slate-800 shadow-2xl overflow-hidden mb-12">
            {/* Display Screen */}
            <div className="absolute inset-0 bg-indigo-500 opacity-5 pointer-events-none"></div>
            <div className={`text-center transition-all transform ${isRolling ? 'scale-110' : 'scale-100'}`}>
              <div className={`text-5xl md:text-7xl font-black ${isRolling ? 'text-indigo-400 blur-[1px]' : winner ? 'text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] animate-bounce' : 'text-white'}`}>
                {currentName}
              </div>
              {winner && (
                <div className="mt-4 text-indigo-300 font-bold uppercase tracking-widest animate-pulse">
                  <i className="fa-solid fa-crown mr-2"></i>恭喜獲獎者！
                </div>
              )}
            </div>

            {/* Matrix background effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
               {Array.from({ length: 15 }).map((_, i) => (
                 <div key={i} className="whitespace-nowrap text-xs text-indigo-400/30 animate-float" style={{ animationDelay: `${i * 0.5}s`, marginLeft: `${i * 10}%` }}>
                   {participants.map(p => p.name).join(' ')}
                 </div>
               ))}
            </div>
          </div>

          <button
            onClick={startRoll}
            disabled={isRolling || (!allowDuplicate && availableNames.length === 0)}
            className={`group w-full max-w-sm py-6 rounded-2xl font-black text-2xl transition-all shadow-xl flex items-center justify-center gap-4 ${
              isRolling || (!allowDuplicate && availableNames.length === 0)
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-indigo-200'
            }`}
          >
            {isRolling ? (
              <><i className="fa-solid fa-spinner animate-spin"></i> 抽取中...</>
            ) : (!allowDuplicate && availableNames.length === 0) ? (
              '抽籤已結束'
            ) : (
              <><i className="fa-solid fa-play group-hover:translate-x-1 transition-transform"></i> 開始抽獎</>
            )}
          </button>
          
          <div className="mt-8 text-slate-400 text-sm font-medium">
            {!allowDuplicate && `剩餘候選人數：${availableNames.length}`}
          </div>
        </div>
      </div>

      {/* Right Column: History */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <i className="fa-solid fa-history mr-2 text-indigo-500"></i>
            中獎紀錄
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 py-12">
              <i className="fa-solid fa-award text-4xl mb-4"></i>
              <p className="text-center font-medium">尚無中獎紀錄<br/><span className="text-sm">快按下按鈕試試手氣！</span></p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((name, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 animate-slide-in">
                  <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center text-sm font-bold shadow-sm">
                    {history.length - i}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-800">{name}</div>
                    <div className="text-xs text-slate-400">{new Date().toLocaleTimeString()}</div>
                  </div>
                  <i className="fa-solid fa-trophy text-yellow-500"></i>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RaffleRoom;
