
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
  'Component Recognition': 'Identify the electronic components in the image, provide MPN suggestions, package types, and key specs.',
  'Circuit Analysis': 'Analyze the schematic logic, explain the workflow, evaluate design rationality, and suggest improvements.',
  'Waveform Diagnosis': 'Analyze the oscilloscope/logic analyzer waveform, judge signal quality, and identify overshoot or timing issues.',
  'Design Optimization': 'Identify components and recommend more cost-effective or supply-chain stable alternatives.',
  'PCB Review': 'Review the PCB layout/routing, evaluate thermal design, signal integrity, and EMI suppression.',
  'Alternatives': 'Find 3 Pin-to-Pin or functionally compatible high-reliability alternatives for the core chips in the image.',
};

const AIAssistant: React.FC<AIAssistantProps> = ({ credits, onConsume, history, onSaveHistory }) => {
  const [mode, setMode] = useState<'IMAGE' | 'CHAT' | 'BOM' | 'HISTORY'>('IMAGE');
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState('Component Recognition');
  const [customPrompt, setCustomPrompt] = useState(taskPrompts['Component Recognition']);
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
        // Just set the image, DO NOT trigger analysis automatically
        setImage(reader.result as string);
        setResult(null); // Clear previous results
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
      setError('Insufficient credits. Please top up in the Profile page.');
      return;
    }

    setAnalyzing(true);
    setResult(null);
    const analysisResult = await analyzeHardwareImage(targetImage, customPrompt);
    setResult(analysisResult);
    setAnalyzing(false);

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
      <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-3 px-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Status</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-slate-800">{credits} pts</span>
          <div className="w-px h-3 bg-slate-200"></div>
          <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-tighter">Pro Tier</span>
        </div>
      </div>

      <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200">
        <button onClick={() => setMode('IMAGE')} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${mode === 'IMAGE' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-400'}`}>Image Analysis</button>
        <button onClick={() => setMode('CHAT')} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${mode === 'CHAT' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-400'}`}>Tech Consult</button>
        <button onClick={() => setMode('HISTORY')} className={`flex-none px-6 py-3 text-xs font-black rounded-xl transition-all ${mode === 'HISTORY' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-400'}`}>History</button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3">
          <p className="text-xs text-rose-600 font-bold">{error}</p>
        </div>
      )}

      {mode === 'IMAGE' && (
        <>
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
            <div 
              onClick={() => fileInputRef.current?.click()} 
              className={`border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/30 transition-all ${image ? 'py-4' : 'py-16'}`}
            >
              {image ? (
                <div className="relative">
                   <img src={image} className="max-h-64 rounded-3xl shadow-2xl border-4 border-white" />
                   <button 
                     onClick={(e) => { e.stopPropagation(); setImage(null); setResult(null); }}
                     className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1.5 shadow-md hover:bg-rose-500 transition-colors"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-300 shadow-inner">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-slate-500 font-black text-sm uppercase tracking-tight">Upload or Take a Picture</span>
                    <span className="text-slate-300 font-bold text-[10px] uppercase tracking-widest">Supports Schematic / PCB / Component</span>
                  </div>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em] text-center">Select AI Workflow</h3>
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {tasks.map(task => (
                <button 
                  key={task} 
                  onClick={() => setActiveTask(task)} 
                  className={`px-5 py-3 rounded-2xl text-[10px] font-black transition-all ${activeTask === task ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 -translate-y-0.5' : 'bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-100'}`}
                >
                  {task}
                </button>
              ))}
            </div>
            
            <div className="mb-2 flex items-center justify-between px-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analysis Prompt</span>
              <span className="text-[9px] text-indigo-400 font-bold cursor-pointer hover:text-indigo-600" onClick={() => setCustomPrompt(taskPrompts[activeTask])}>Reset Default</span>
            </div>
            <textarea 
              value={customPrompt} 
              onChange={(e) => setCustomPrompt(e.target.value)} 
              className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl text-xs font-bold h-32 resize-none mb-8 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-600 leading-relaxed" 
            />
            
            <button 
              onClick={() => triggerAnalysis()} 
              disabled={analyzing || !image} 
              className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] text-sm font-black uppercase tracking-[0.15em] shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] active:scale-[0.98] active:shadow-lg transition-all disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none"
            >
              {analyzing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Synthesizing Data...
                </span>
              ) : 'Start Analyzing'}
            </button>
            
            {result && (
              <div className="mt-10 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 animate-in slide-in-from-bottom-6 duration-700">
                <div className="flex items-center space-x-2 mb-6 opacity-40">
                  <div className="w-1 h-3 bg-indigo-600 rounded-full"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Engineering Report</span>
                </div>
                <div className="prose prose-sm prose-slate max-w-none font-medium leading-relaxed"><ReactMarkdown>{result}</ReactMarkdown></div>
              </div>
            )}
          </div>
        </>
      )}
      {mode === 'CHAT' && <ChatConsultation onConsume={onConsume} onSaveHistory={onSaveHistory} />}
      {mode === 'HISTORY' && (
        <div className="space-y-4 pb-20">
           {history.map(item => (
             <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-none ${item.type === 'IMAGE' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'}`}>
                   {item.type === 'IMAGE' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth={2}/></svg>}
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate">{item.task}</h4>
                   <p className="text-[10px] text-slate-400">{item.timestamp}</p>
                </div>
                <button className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all">View</button>
             </div>
           ))}
           {history.length === 0 && (
              <div className="py-24 text-center text-slate-300 font-bold italic text-sm">No activity history yet</div>
           )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
