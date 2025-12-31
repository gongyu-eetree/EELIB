
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { componentChat, generateHardwareSolution } from '../services/geminiService';
import { HistoryItem } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string; 
  solution?: HardwareSolution;
}

interface HardwareSolution {
  topologyName: string;
  description: string;
  modules: string[];
  bom: Array<{ mpn: string; mfg: string; func: string; price: string; stock: string }>;
  analysis: {
    performance: number;
    cost: number;
    availability: number;
    tradeoff: string;
  };
}

interface ChatConsultationProps {
  onConsume: (amount: number) => boolean;
  onSaveHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

const ChatConsultation: React.FC<ChatConsultationProps> = ({ onConsume, onSaveHistory }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your AI FAE Assistant. You can describe your design requirements (e.g., **12V to 5V 3A Buck Converter**), or upload a photo of a circuit/component. How can I help?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDesignMode, setIsDesignMode] = useState(false);
  
  // New States for File and Voice
  const [attachment, setAttachment] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, attachment]); 

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; // Stop after one sentence
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US'; // Changed to English

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInput(transcript); 
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support voice input.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput(''); // Clear input before recording
      recognitionRef.current.start();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleSend = async (text: string = input) => {
    if ((!text.trim() && !attachment) || loading) return;
    
    // Determine logic: Design Mode vs Regular Chat
    const isSolutionGen = isDesignMode && !attachment && (text.includes('Solution') || text.includes('Design') || text.length > 10);
    const cost = isSolutionGen ? 15 : 1;

    if (!onConsume(cost)) {
      setMessages(prev => [...prev, { role: 'assistant', content: `**Insufficient Credits!** Action requires ${cost} credits. Please top up.` }]);
      return;
    }

    // Prepare User Message
    const userMsg: Message = { 
      role: 'user', 
      content: text,
      image: attachment || undefined
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const currentAttachment = attachment; 
    setAttachment(null); 
    setLoading(true);

    try {
      if (isSolutionGen) {
        const solution = await generateHardwareSolution(text);
        const finalContent = `Generated Solution: **${solution.topologyName}**\n\n${solution.description}`;
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: finalContent,
          solution 
        }]);
        onSaveHistory({
          type: 'CHAT',
          task: `Design: ${solution.topologyName}`,
          content: finalContent
        });
      } else {
        const imageBase64 = currentAttachment ? currentAttachment.split(',')[1] : null;
        const response = await componentChat(text, imageBase64);
        
        setMessages(prev => [...prev, { role: 'assistant', content: response || 'I cannot answer this right now.' }]);
        onSaveHistory({
          type: 'CHAT',
          task: `Consult: ${text.substring(0, 15)}...`,
          content: response || ''
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const renderSolution = (sol: HardwareSolution) => (
    <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full">
      <div className="p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
          <h4 className="font-black text-indigo-900 text-base">{sol.topologyName}</h4>
        </div>
        <div className="prose prose-sm prose-indigo max-w-none text-indigo-700 leading-relaxed font-medium">
          <ReactMarkdown>{sol.description}</ReactMarkdown>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Performance', val: sol.analysis.performance, color: 'indigo' },
          { label: 'Cost', val: sol.analysis.cost, color: 'amber' },
          { label: 'Supply', val: sol.analysis.availability, color: 'emerald' }
        ].map(item => (
          <div key={item.label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">{item.label}</div>
            <div className={`text-xl font-black text-${item.color}-600`}>{item.val}%</div>
            <div className="w-full h-1 bg-slate-50 rounded-full mt-3 overflow-hidden">
              <div className={`h-full bg-${item.color}-500`} style={{ width: `${item.val}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Recommended BOM</span>
        </div>
        <div className="p-4 space-y-3">
          {sol.bom.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-[11px] pb-2 border-b border-slate-50 last:border-0">
              <div className="min-w-0">
                <div className="font-black text-slate-800 truncate">{item.mpn}</div>
                <div className="text-slate-400 truncate">{item.func}</div>
              </div>
              <div className="text-right flex-none pl-4">
                <div className="font-bold text-slate-900">{item.price}</div>
                <div className="text-[9px] text-emerald-500 font-bold uppercase">{item.stock}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-280px)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pb-4 px-1 no-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm flex flex-col gap-2 ${
              msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
            }`}>
               {/* Show Image in Message Bubble if exists */}
               {msg.image && (
                 <img src={msg.image} alt="User upload" className="rounded-xl w-full max-w-[200px] h-auto object-cover border border-white/20 mb-1" />
               )}
               {msg.content && (
                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-slate'}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
               )}
            </div>
            {msg.solution && renderSolution(msg.solution)}
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-3 bg-white p-4 rounded-3xl border border-slate-100 rounded-tl-none shadow-sm animate-pulse">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">AI Thinking...</span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center space-x-2">
           <button 
             onClick={() => setIsDesignMode(!isDesignMode)}
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
               isDesignMode ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-100'
             }`}
           >
             Design Agent (15pt)
           </button>
           <div className="flex-1 flex space-x-2 overflow-x-auto no-scrollbar">
              {["Buck Converter", "MCU Minimal System", "Li-ion Charger"].map(q => (
                <button key={q} onClick={() => handleSend(q)} className="whitespace-nowrap px-3 py-2 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-bold border border-slate-100">{q}</button>
              ))}
           </div>
        </div>
        
        {/* Attachment Preview Area */}
        {attachment && (
          <div className="relative inline-block mx-2 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-indigo-200 shadow-sm relative group">
              <img src={attachment} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <button 
              onClick={() => setAttachment(null)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-slate-800 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-500 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        <div className="relative flex items-end gap-2">
          {/* File Input Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-none p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors h-14 w-12 flex items-center justify-center active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileSelect} 
          />

          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
              placeholder={isListening ? "Listening..." : (isDesignMode ? "Describe design (15pt)..." : "Ask or upload (1pt)...")}
              className={`w-full pl-5 pr-12 py-4 bg-white border rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm text-sm h-14 resize-none no-scrollbar leading-tight transition-colors ${
                isListening ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'
              }`}
            />
            {isListening && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></span>
                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-75"></span>
                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-150"></span>
              </div>
            )}
          </div>

          {/* Voice / Send Button */}
          {input.trim() || attachment ? (
            <button 
              onClick={() => handleSend()} 
              disabled={loading} 
              className="flex-none h-14 w-14 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center active:scale-95 transition-all"
            >
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          ) : (
            <button 
              onMouseDown={toggleListening}
              onMouseUp={() => isListening && toggleListening()} 
              onTouchStart={toggleListening} 
              onTouchEnd={() => isListening && toggleListening()}
              className={`flex-none h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                isListening ? 'bg-red-500 text-white shadow-red-200 scale-105' : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatConsultation;
