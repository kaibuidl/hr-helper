
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { generateTeamNames } from '../geminiService';

interface Props {
  participants: Participant[];
}

const GroupingRoom: React.FC<Props> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState('大自然與野生動物');

  const performGrouping = async () => {
    setIsGenerating(true);
    
    // Shuffle copy of participants
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    
    const numGroups = Math.ceil(shuffled.length / groupSize);
    
    // Generate creative names with AI
    const teamNames = await generateTeamNames(numGroups, theme);
    
    const newGroups: Group[] = [];
    for (let i = 0; i < numGroups; i++) {
      const members = shuffled.slice(i * groupSize, (i + 1) * groupSize);
      newGroups.push({
        id: `group-${i}`,
        name: teamNames[i] || `小組 ${i + 1}`,
        members
      });
    }
    
    setGroups(newGroups);
    setIsGenerating(false);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    let csvContent = "\uFEFF小組名稱,成員姓名\n"; // UTF-8 BOM for Excel compatibility
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `"${group.name}","${member.name}"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const themes = [
    { label: '自然動物', value: '大自然與野生動物' },
    { label: '未來科技', value: '人工智慧與宇宙探險' },
    { label: '美食佳餚', value: '世界美食與甜點' },
    { label: '超級英雄', value: '漫畫英雄與超能力' },
    { label: '神話傳說', value: '希臘與東方神話' },
  ];

  return (
    <div className="space-y-8">
      {/* Control Panel */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-2">每組人數上限</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="2" 
                max={Math.max(10, Math.floor(participants.length / 2) + 1)} 
                value={groupSize} 
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="w-12 h-10 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl font-bold text-lg border border-indigo-100">
                {groupSize}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-2">創意隊名主題 (AI 生成)</label>
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {themes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={performGrouping}
            disabled={isGenerating}
            className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
              isGenerating 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {isGenerating ? (
              <><i className="fa-solid fa-magic-wand-sparkles animate-spin"></i> 生成中...</>
            ) : (
              <><i className="fa-solid fa-layer-group"></i> 開始自動分組</>
            )}
          </button>
        </div>
        
        <div className="mt-4 text-slate-400 text-xs flex items-center gap-2">
          <i className="fa-solid fa-circle-info"></i>
          目前有 {participants.length} 人，預計分成 {Math.ceil(participants.length / groupSize)} 組
        </div>
      </div>

      {/* Results Section */}
      {groups.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">分組結果</h2>
            <button 
              onClick={downloadCSV}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
            >
              <i className="fa-solid fa-file-export"></i> 下載 CSV 紀錄
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {groups.map((group, idx) => (
              <div key={group.id} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
                  <h3 className="font-black truncate max-w-[80%]">{group.name}</h3>
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-md font-bold">Team {idx + 1}</span>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {group.members.map((member, mIdx) => (
                      <div key={member.id} className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center text-xs font-bold transition-colors group-hover:bg-indigo-500 group-hover:text-white">
                          {mIdx + 1}
                        </div>
                        <span className="text-slate-700 font-medium group-hover:text-indigo-600 transition-colors">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <span className="text-xs font-bold text-slate-400">共 {group.members.length} 人</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {groups.length === 0 && !isGenerating && (
        <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-400">
           <i className="fa-solid fa-people-arrows text-5xl mb-4 block opacity-30"></i>
           <p className="font-medium">設定參數並按下「開始自動分組」按鈕來查看結果</p>
        </div>
      )}
    </div>
  );
};

export default GroupingRoom;
