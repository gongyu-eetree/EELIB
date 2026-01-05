
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { NewsItem } from '../types';
import { chatAboutNews } from '../services/geminiService';

interface NewsDetailProps {
  news: NewsItem;
  onBack: () => void;
  isFavorited: boolean;
  onToggleFavorite: (item: NewsItem) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ news, onBack, isFavorited, onToggleFavorite }) => {
  const [showChat, setShowChat] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSendMessage = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const newsContext = `Title: ${news.title}\nSummary: ${news.summary}\nContent: ${news.content}\nTakeaway: ${news.takeaway}`;
    try {
      const response = await chatAboutNews(messageText, newsContext);
      setMessages(prev => [...prev, { role: 'assistant', content: response || 'Sorry, I cannot discuss this news right now.' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Service timeout. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    onToggleFavorite(news);
    setToast(!isFavorited ? 'Saved to Favorites' : 'Removed from Favorites');
  };

  const handleShare = async (type: string) => {
    const url = window.location.href; // In a real app this would be the deep link
    const text = `Check out this news: ${news.title}`;

    switch (type) {
      case 'Twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'LinkedIn':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'Email':
        window.location.href = `mailto:?subject=${encodeURIComponent(news.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      case 'Copy':
        try {
          await navigator.clipboard.writeText(`${text}\n${url}`);
          setToast('Link copied to clipboard');
        } catch (err) {
          setToast('Failed to copy');
        }
        break;
    }
    setShowShareModal(false);
  };

  return (
    <div className="relative min-h-full pb-20">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          {toast}
        </div>
      )}

      <div className={`space-y-6 pb-12 animate-in fade-in slide-in-from-right-4 duration-300 ${showChat || showShareModal ? 'opacity-40 pointer-events-none scale-95 blur-sm' : 'opacity-100'} transition-all duration-500`}>
        {/* Back Header */}
        <div className="flex items-center -mx-4 px-4 sticky top-0 bg-slate-50/80 backdrop-blur-md py-3 z-10 border-b border-slate-200/50">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="ml-2 font-bold text-slate-800 line-clamp-1">{news.title}</span>
        </div>

        {/* Hero Image */}
        {news.imageUrl && (
          <div className="rounded-2xl overflow-hidden shadow-lg aspect-video relative">
            <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full shadow-lg">
                {news.category}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-black text-slate-900 leading-tight">
            {news.title}
          </h1>
          <div className="flex items-center text-xs text-slate-400 space-x-4">
            <span>{news.time}</span>
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              1,280 Reads
            </span>
          </div>

          <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed">
            <ReactMarkdown>{news.content}</ReactMarkdown>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="bg-white rounded-3xl p-1 border border-indigo-100 shadow-xl shadow-indigo-100/20 overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[calc(1.5rem-0.25rem)] p-5 text-white">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-white/20 rounded-xl">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold tracking-wide">EELIB Deep Dive</h3>
              <span className="ml-auto text-[10px] px-2 py-0.5 bg-white/10 rounded-full border border-white/20">Pro</span>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-indigo-200 font-bold mb-2">Key Takeaway</div>
                <p className="text-sm font-bold leading-relaxed border-l-2 border-amber-400 pl-3">
                  {news.takeaway}
                </p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-indigo-200 font-bold mb-3">Affected Areas</div>
                <div className="flex flex-wrap gap-2">
                  {news.affected.map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/10 rounded-lg text-[11px] font-medium border border-white/5">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-indigo-200 font-bold mb-3">Applications</div>
                <ul className="space-y-2">
                  {news.scenarios.map((item, idx) => (
                    <li key={idx} className="flex items-start text-[11px] leading-snug">
                      <svg className="w-3 h-3 text-amber-400 mr-2 mt-0.5 flex-none" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <button 
              onClick={() => setShowChat(true)}
              className="mt-8 w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center space-x-2 group hover:bg-indigo-50 transition-all active:scale-95"
            >
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Discuss with AI</span>
            </button>
          </div>
        </div>

        {/* Share Section */}
        <div className="flex gap-4">
          <button 
            onClick={() => setShowShareModal(true)}
            className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 text-sm font-bold flex items-center justify-center space-x-2 active:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            <span>Share</span>
          </button>
          <button 
            onClick={handleToggleFavorite}
            className={`flex-1 py-3 border rounded-2xl text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
              isFavorited ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-inner' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <svg className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>{isFavorited ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center pointer-events-none">
          <div className="absolute inset-0 bg-slate-900/60 pointer-events-auto backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-[2rem] p-8 pointer-events-auto animate-in slide-in-from-bottom-full duration-500">
             <div className="flex justify-between items-center mb-8">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm">Share Via</h4>
               <button onClick={() => setShowShareModal(false)} className="text-slate-300 hover:text-slate-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
             </div>
             <div className="grid grid-cols-4 gap-6">
                {[
                  { name: 'Twitter', icon: 'M4 4l5 5 5-5M4 20l5-5 5 5M4 12h16', color: 'bg-black' },
                  { name: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z', color: 'bg-blue-600' },
                  { name: 'Email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'bg-indigo-500' },
                  { name: 'Copy', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', color: 'bg-slate-500' }
                ].map(item => (
                  <button 
                    key={item.name} 
                    onClick={() => handleShare(item.name)}
                    className="flex flex-col items-center group active:scale-95 transition-transform"
                  >
                    <div className={`${item.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-100 group-hover:brightness-110 transition-all mb-3`}>
                       <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 tracking-tighter">{item.name}</span>
                  </button>
                ))}
             </div>
             <div className="mt-10 border-t border-slate-50 pt-8">
                <div className="flex bg-slate-50 p-4 rounded-2xl items-center space-x-4 border border-slate-100">
                   <div className="w-12 h-12 bg-white rounded-lg flex-none overflow-hidden shadow-sm">
                      <img src={news.imageUrl} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mb-1">Sharing</div>
                      <div className="text-xs font-bold text-slate-800 truncate">{news.title}</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* AI Discussion Panel */}
      {showChat && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-0 sm:px-4 pointer-events-none">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto" 
            onClick={() => setShowChat(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-t-3xl shadow-2xl h-[90vh] flex flex-col pointer-events-auto animate-in slide-in-from-bottom-full duration-500 overflow-hidden">
            {/* Handle Bar */}
            <div className="w-full flex justify-center py-3 flex-none cursor-pointer" onClick={() => setShowChat(false)}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center flex-none">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-600 rounded-xl">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-800 text-sm truncate">Discussion: {news.title}</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-tight">AI Content Grounding</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors flex-none"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Messages Area */}
            <div ref={chatEndRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar overscroll-contain">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-8">
                  <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                  </div>
                  <h5 className="font-bold text-slate-800 text-sm mb-2">Start Discussion</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">Ask about technical details, market outlook, or specific applications.</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {["Technical barriers?", "Who are competitors?", "Mass production date?"].map(q => (
                      <button 
                        key={q} 
                        onClick={() => handleSendMessage(q)}
                        className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-[10px] border border-slate-100 hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm active:scale-95"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-slate'}`}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 rounded-tl-none flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                    <span className="text-[10px] text-slate-400 italic">Reading context...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-slate-100 bg-white pb-[calc(1.5rem+env(safe-area-inset-bottom))] flex-none">
              <div className="relative flex items-center space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask a question..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-inner text-sm min-h-[48px] max-h-32 resize-none"
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={loading || !input.trim()}
                    className="absolute right-2 bottom-2 p-2 text-indigo-600 disabled:text-slate-300 transition-transform active:scale-90"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetail;
