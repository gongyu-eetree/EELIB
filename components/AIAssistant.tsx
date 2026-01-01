
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
  '组件识别': '请识别图像中的电子元器件，提供型号建议、封装类型和关键规格。',
  '电路分析': '分析原理图逻辑，解释工作流程，评估设计合理性，并建议改进措施。',
  '波形诊断': '分析示波器/逻辑分析仪波形，判断信号质量，并指出过冲、毛刺或时序问题。',
  '设计优化': '识别组件并推荐更具成本效益或供应链稳定的替代方案。',
  'PCB审查': '审查 PCB 布局/布线，评估散热设计、信号完整性和 EMI 抑制。',
  '替代方案': '为图像中的核心芯片寻找 3 个 Pin-to-Pin 或功能兼容的高可靠性替代方案。',
};

const AIAssistant: React.FC<AIAssistantProps> = ({ credits, onConsume, history, onSaveHistory }) => {
  const [mode, setMode] = useState<'IMAGE' | 'CHAT' | 'BOM' | 'HISTORY'>('IMAGE');
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState('组件识别');
  const [customPrompt, setCustomPrompt] = useState(taskPrompts['组件识别']);
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
      setError('请先上传图片。');
      return;
    }

    if (!onConsume(1)) {
      setError('额度不足，请在“我的”页面充值。');
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
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">系统状态</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-slate-800">点数余额: {credits} pt</span>
          <div className="w-px h-3 bg-slate-200"></div>
          <span className="text-[10px] text-indigo-600 font-bold">Pro会员</span>
        </div>
      </div>

      <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-200">
        <button onClick={() => setMode('IMAGE')} className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${mode === 'IMAGE' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-400'}`}>图像分析</button>
        <button onClick={() => setMode('CHAT')} className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${mode === 'CHAT' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-400'}`}>技术咨询</button>
        <button onClick={() => setMode('HISTORY')} className={`flex-none px-4 py-2.5 text-xs font-black rounded-xl transition-all ${mode === 'HISTORY' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-400'}`}>记录</button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3">
          <p className="text-xs text-red-600 font-bold">{error}</p>
        </div>
      )}

      {mode === 'IMAGE' && (
        <>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-base font-black text-slate-800 mb-4">上传图像</h3>
            <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/30 transition-all ${image ? 'py-4' : 'py-8'}`}>
              {image ? <img src={image} className="max-h-48 rounded-xl shadow-lg" /> : <span className="text-slate-800 font-black text-xs">点击上传电路图或PCB照片</span>}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-800 mb-4 uppercase tracking-widest">分析任务</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {tasks.map(task => (
                <button key={task} onClick={() => setActiveTask(task)} className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all ${activeTask === task ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-400'}`}>{task}</button>
              ))}
            </div>
            <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium h-24 resize-none mb-4 outline-none" />
            <button onClick={() => triggerAnalysis()} disabled={analyzing || !image} className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:bg-slate-200">{analyzing ? '分析中...' : '开始分析'}</button>
            {result && (
              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="prose prose-sm prose-slate max-w-none"><ReactMarkdown>{result}</ReactMarkdown></div>
              </div>
            )}
          </div>
        </>
      )}
      {mode === 'CHAT' && <ChatConsultation onConsume={onConsume} onSaveHistory={onSaveHistory} />}
      {mode === 'HISTORY' && (
        <div className="space-y-4 pb-20">
           {history.map(item => (
             <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start">
                   <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.task}</h4>
                   <p className="text-[10px] text-slate-400">{item.timestamp}</p>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
