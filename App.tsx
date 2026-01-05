
import React, { useState, useEffect } from 'react';
import ParticipantManager from './components/ParticipantManager';
import RaffleRoom from './components/RaffleRoom';
import GroupingRoom from './components/GroupingRoom';
import { Participant, AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('manage');
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hr_participants');
    if (saved) {
      try {
        setParticipants(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved participants");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('hr_participants', JSON.stringify(participants));
  }, [participants]);

  const handleUpdateParticipants = (newList: Participant[]) => {
    setParticipants(newList);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="gradient-bg text-white shadow-lg p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <i className="fa-solid fa-users-gear text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">HR Fun & Flow Hub</h1>
              <p className="text-white/80 text-sm">專業、有趣的名單管理與互動工具</p>
            </div>
          </div>
          
          <nav className="flex bg-white/10 p-1 rounded-xl backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('manage')}
              className={`px-5 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === 'manage' ? 'bg-white text-indigo-600 shadow-md' : 'hover:bg-white/10 text-white'}`}
            >
              <i className="fa-solid fa-list-ul mr-2"></i>名單管理
            </button>
            <button 
              onClick={() => setActiveTab('raffle')}
              className={`px-5 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === 'raffle' ? 'bg-white text-indigo-600 shadow-md' : 'hover:bg-white/10 text-white'}`}
              disabled={participants.length === 0}
            >
              <i className="fa-solid fa-gift mr-2"></i>獎品抽籤
            </button>
            <button 
              onClick={() => setActiveTab('grouping')}
              className={`px-5 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === 'grouping' ? 'bg-white text-indigo-600 shadow-md' : 'hover:bg-white/10 text-white'}`}
              disabled={participants.length === 0}
            >
              <i className="fa-solid fa-people-group mr-2"></i>自動分組
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
        {participants.length === 0 && activeTab !== 'manage' && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-user-plus text-4xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">尚未匯入名單</h2>
            <p className="text-gray-500 mb-8">請先在「名單管理」中上傳 CSV 或貼上姓名以開始使用功能。</p>
            <button 
              onClick={() => setActiveTab('manage')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              前往匯入
            </button>
          </div>
        )}

        <div className={activeTab === 'manage' ? 'block' : 'hidden'}>
          <ParticipantManager participants={participants} onUpdate={handleUpdateParticipants} />
        </div>

        {participants.length > 0 && (
          <>
            <div className={activeTab === 'raffle' ? 'block' : 'hidden'}>
              <RaffleRoom participants={participants} />
            </div>
            <div className={activeTab === 'grouping' ? 'block' : 'hidden'}>
              <GroupingRoom participants={participants} />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} HR Fun & Flow Hub. Powered by Gemini AI.
        </div>
      </footer>
    </div>
  );
};

export default App;
