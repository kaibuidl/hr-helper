
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';

interface Props {
  participants: Participant[];
  onUpdate: (list: Participant[]) => void;
}

const MOCK_NAMES = [
  '陳小明', '林大華', '王曉芬', '張偉', '李娜', 
  '劉洋', '陳靜', '楊林', '趙敏', '黃勇', 
  '周杰', '吳芳', '徐強', '孫利', '朱海'
];

const ParticipantManager: React.FC<Props> = ({ participants, onUpdate }) => {
  const [inputText, setInputText] = useState(participants.map(p => p.name).join('\n'));
  const [isSaved, setIsSaved] = useState(false);

  // Calculate duplicates for visual feedback
  const nameCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });
    return counts;
  }, [participants]);

  const hasDuplicates = useMemo(() => {
    // Fix: Explicitly cast Object.values to number[] to resolve 'unknown' type comparison error on line 30
    return (Object.values(nameCounts) as number[]).some(count => count > 1);
  }, [nameCounts]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rawNames = text
        .split(/\r?\n/)
        .map(line => line.split(',')[0].trim())
        .filter(name => name && name !== 'name' && name !== '姓名');
      
      const newParticipants = rawNames.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name
      }));
      
      onUpdate(newParticipants);
      setInputText(rawNames.join('\n'));
      triggerSaveFeedback();
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSave = () => {
    const rawNames = inputText
      .split('\n')
      .map(n => n.trim())
      .filter(n => n !== '');
    
    const newParticipants = rawNames.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    
    onUpdate(newParticipants);
    triggerSaveFeedback();
  };

  const handleRemoveDuplicates = () => {
    const uniqueNames = Array.from(new Set(participants.map(p => p.name)));
    const newParticipants = uniqueNames.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate(newParticipants);
    setInputText(uniqueNames.join('\n'));
    triggerSaveFeedback();
  };

  const handleLoadMockData = () => {
    const newParticipants = MOCK_NAMES.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate(newParticipants);
    setInputText(MOCK_NAMES.join('\n'));
    triggerSaveFeedback();
  };

  const triggerSaveFeedback = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const clearAll = () => {
    if (window.confirm('確定要清除所有名單嗎？')) {
      onUpdate([]);
      setInputText('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 transition-all hover:shadow-2xl">
      <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-center bg-slate-50/50 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">名單來源管理</h2>
          <p className="text-slate-500 text-sm">輸入姓名或上傳 CSV 檔案</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleLoadMockData}
            className="bg-white border border-amber-200 text-amber-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-50 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-vial mr-2"></i>
            載入模擬名單
          </button>
          <label className="cursor-pointer bg-white border border-indigo-200 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors flex items-center shadow-sm">
            <i className="fa-solid fa-file-csv mr-2"></i>
            匯入 CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
          <button 
            onClick={clearAll}
            className="bg-white border border-rose-100 text-rose-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-trash-can mr-2"></i>
            清除全部
          </button>
        </div>
      </div>

      <div className="p-8 grid md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            編輯名單 (每行一個姓名)
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="例如：&#10;王小明&#10;李大華&#10;張三..."
            className="flex-1 min-h-[400px] w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-sm resize-none bg-slate-50/50 text-slate-800 placeholder-slate-400"
          />
          <button
            onClick={handleSave}
            className={`mt-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center shadow-lg ${
              isSaved ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {isSaved ? (
              <><i className="fa-solid fa-check mr-2"></i> 已儲存名單</>
            ) : (
              <><i className="fa-solid fa-save mr-2"></i> 儲存並更新</>
            )}
          </button>
        </div>

        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center">
              目前名單總計：<span className="text-indigo-600 ml-1 text-lg">{participants.length}</span> 人
            </h3>
            {hasDuplicates && (
              <button 
                onClick={handleRemoveDuplicates}
                className="bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-black hover:bg-rose-200 transition-colors animate-pulse"
              >
                <i className="fa-solid fa-filter-circle-xmark mr-1"></i> 一鍵移除重複
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[450px]">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                <i className="fa-solid fa-ghost text-4xl mb-2"></i>
                <p>名單目前是空的</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {participants.map((p, idx) => {
                  // Fix: Ensure comparison handles potentially undefined values from index access
                  const isDuplicate = (nameCounts[p.name] ?? 0) > 1;
                  return (
                    <div 
                      key={p.id} 
                      className={`p-3 rounded-xl border transition-all text-sm flex items-center shadow-sm ${
                        isDuplicate 
                        ? 'bg-rose-50 border-rose-200 text-rose-700' 
                        : 'bg-white border-slate-100 text-slate-600'
                      }`}
                    >
                      <span className={`w-6 font-mono text-xs ${isDuplicate ? 'text-rose-300' : 'text-slate-300'}`}>
                        {idx + 1}
                      </span>
                      <span className="font-medium truncate flex-1">{p.name}</span>
                      {isDuplicate && (
                        <i className="fa-solid fa-circle-exclamation text-rose-400 text-[10px]" title="發現重複"></i>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {hasDuplicates && (
            <p className="mt-3 text-[10px] text-rose-400 font-medium">
              * 標記紅色的姓名為重複項目，建議移除以確保抽籤或分組準確性。
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantManager;
