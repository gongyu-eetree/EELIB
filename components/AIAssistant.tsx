
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { analyzeHardwareImage } from '../services/geminiService';
import ChatConsultation from './ChatConsultation';
import BOMManagement from './BOMManagement';
import { HistoryItem } from '../types';

interface AIAssistantProps {
  credits: number;
  onConsume: (amount: number) => boolean;
  history: HistoryItem[];
  onSaveHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

const taskPrompts: Record<string, string> = {
  'Identify': 'Identify the electronic components in the image, providing model suggestions, package types, and key specs.',
  'Simulation': 'Analyze the schematic logic, explain the workflow, assess design rationality, and suggest improvements.',
  'Waveform': 'Analyze the oscilloscope/logic analyzer waveform, judge signal quality, and point out overshoot, glitches, or timing issues.',
  'Optimize': 'Identify the components, recommend cost-effective or supply-chain-stable alternatives.',
  'PCB Check': 'Review PCB layout/routing, assessing thermal design, signal integrity, and EMI suppression.',
  'Alternative': 'Find 3 Pin-to-Pin or functionally compatible high-reliability alternatives for the core chip in the image.',
};

const AIAssistant: React.FC<AIAssistantProps> = ({ credits, onConsume, history, onSaveHistory }) => {
  const [mode, setMode] = useState<'IMAGE' | 'CHAT' | 'BOM' | 'HISTORY'>('IMAGE');
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState('Identify');
  const [customPrompt, setCustomPrompt] = useState(taskPrompts['Identify']);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tasks = Object.keys(taskPrompts);

  useEffect(() => {
    setCustomPrompt(taskPrompts[activeTask]);
  }, [activeTask]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage(reader.result as string);
        triggerAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAnalysis = async (base64?: string) => {
    setError(null);
    const targetImage = base64 || (image ? image.split(',')[1] : null);
    
    if (!targetImage) {
      setError('Please upload an image first.');
      return;
    }

    if (!onConsume(1)) {
      setError('Insufficient credits. Please top up in "Me" tab.');
      return;
    }

    setAnalyzing(true);
    setResult(null);
    const analysisResult = await analyzeHardwareImage(targetImage, customPrompt);
    setResult(analysisResult);
    setAnalyzing(false);

    // Save to history
    onSaveHistory({
      type: 'IMAGE',
      task: activeTask,
      content: analysisResult,
      image: image || undefined
    });
  };

  if (mode === 'BOM') {
    return <BOMManagement onBack={() => setMode('IMAGE')} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Credits Top Bar */}
      <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-3 px-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-slate-800">Balance: {credits} pt</span>
          <div className="w-px h-3 bg-slate-200"></div>
          <span className="text-[10px] text-indigo-600 font-bold">Pro</span>
        </div>
      </div>

      <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-200">
        <button 
          onClick={() => setMode('IMAGE')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${
            mode === 'IMAGE' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          Image Analysis
        </button>
        <button 
          onClick={() => setMode('CHAT')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${
            mode === 'CHAT' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          Consultation
        </button>
        <button 
          onClick={() => setMode('HISTORY')}
          className={`flex-none px-4 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${
            mode === 'HISTORY' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          History
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 animate-bounce">
          <svg className="w-5 h-5 text-red-500 flex-none" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          <p className="text-xs text-red-600 font-bold">{error}</p>
        </div>
      )}

      {mode === 'IMAGE' && (
        <>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">Upload Image</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">1 pt / task</p>
              </div>
              {image && (
                <button 
                  onClick={() => setImage(null)}
                  className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg"
                >
                  Reset
                </button>
              )}
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/30 transition-all group overflow-hidden ${image ? 'py-4' : 'py-8'}`}
            >
              {image ? (
                <img src={image} alt="Upload" className="max-h-48 rounded-xl shadow-lg animate-in zoom-in-95 duration-500" />
              ) : (
                <>
                  <div className="w-12 h-12 bg-white shadow-lg shadow-indigo-100 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <span className="text-slate-800 font-black text-xs">Tap to Upload or Snap</span>
                  <span className="text-[9px] text-slate-400 mt-1.5 font-bold uppercase tracking-widest">PCB / Waveform / Schematic</span>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-800 mb-4 flex items-center uppercase tracking-widest">
              <span className="w-1 h-3 bg-indigo-600 rounded-full mr-2"></span>Analysis Tasks
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {tasks.map(task => (
                <button
                  key={task}
                  onClick={() => setActiveTask(task)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                    activeTask === task ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {task}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Command Detail (Editable)</label>
              </div>
              <textarea 
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter specific analysis requirements..."
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all h-24 resize-none leading-relaxed"
              />
              <button 
                onClick={() => triggerAnalysis()}
                disabled={analyzing || !image}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all disabled:bg-slate-200 disabled:shadow-none"
              >
                {analyzing ? 'Analyzing...' : 'Start Analysis'}
              </button>
            </div>

            {analyzing && (
              <div className="flex flex-col items-center py-10 mt-6 border-t border-slate-50">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-[9px] text-indigo-600 font-black uppercase tracking-[0.2em]">Gemini 3 Flash Processing</p>
              </div>
            )}

            {result && (
              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center space-x-2 mb-4">
                   <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                   <span className="text-[10px] font-black text-slate-800 uppercase">Report</span>
                </div>
                <div className="prose prose-sm prose-slate max-w-none text-slate-700 leading-relaxed font-medium">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {mode === 'CHAT' && (
        <ChatConsultation onConsume={onConsume} onSaveHistory={onSaveHistory} />
      )}

      {mode === 'HISTORY' && (
        <div className="space-y-4 pb-20 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="flex items-center justify-between mb-2">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">History Log</h3>
             <span className="text-[10px] text-slate-400 font-bold">{history.length} items</span>
           </div>
           {history.map(item => (
             <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                   <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${item.type === 'IMAGE' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                         {item.type === 'IMAGE' ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
                      </div>
                      <div>
                         <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.task}</h4>
                         <p className="text-[10px] text-slate-400 font-bold">{item.timestamp}</p>
                      </div>
                   </div>
                   <button onClick={() => {
                      setResult(item.content);
                      setImage(item.image || null);
                      setMode('IMAGE');
                   }} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase">View</button>
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-3 bg-slate-50 p-3 rounded-2xl italic">
                   {item.content.substring(0, 200)}...
                </div>
             </div>
           ))}
           {history.length === 0 && (
             <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-300 font-bold">No history found. Start your first analysis!</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
