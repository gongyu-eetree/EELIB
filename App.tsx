
import React, { useState, useEffect } from 'react';
import { AppTab, UserAccount, UserTier, NewsItem, ComponentData, HistoryItem } from './types';
import Layout from './components/Layout';
import AIAssistant from './components/AIAssistant';
import NewsFeed from './components/NewsFeed';
import ComponentSearch from './components/ComponentSearch';
import Tools from './components/Tools';
import PricingView from './components/PricingView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.AI_ASSISTANT);
  const [favorites, setFavorites] = useState<NewsItem[]>([]);
  const [compFavorites, setCompFavorites] = useState<ComponentData[]>([]);
  const [aiHistory, setAiHistory] = useState<HistoryItem[]>([]);
  const [showPricing, setShowPricing] = useState(false);
  
  const [user, setUser] = useState<UserAccount>({
    name: 'Alex Chen',
    avatar: 'https://picsum.photos/seed/ee-user/100/100',
    role: 'Senior Hardware Eng.',
    tier: 'Free',
    credits: 50,
    totalUsage: 128
  });

  // Load persistence from local storage
  useEffect(() => {
    const savedNews = localStorage.getItem('user_favorites');
    if (savedNews) setFavorites(JSON.parse(savedNews));
    
    const savedComps = localStorage.getItem('comp_favorites');
    if (savedComps) setCompFavorites(JSON.parse(savedComps));

    const savedHistory = localStorage.getItem('ai_history');
    if (savedHistory) setAiHistory(JSON.parse(savedHistory));
  }, []);

  const toggleFavorite = (item: NewsItem) => {
    setFavorites(prev => {
      const next = prev.find(f => f.id === item.id) ? prev.filter(f => f.id !== item.id) : [item, ...prev];
      localStorage.setItem('user_favorites', JSON.stringify(next));
      return next;
    });
  };

  const toggleCompFavorite = (comp: ComponentData) => {
    setCompFavorites(prev => {
      const next = prev.find(f => f.id === comp.id) ? prev.filter(f => f.id !== comp.id) : [comp, ...prev];
      localStorage.setItem('comp_favorites', JSON.stringify(next));
      return next;
    });
  };

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString('en-US', { hour12: false })
    };
    setAiHistory(prev => {
      const next = [newItem, ...prev].slice(0, 50);
      localStorage.setItem('ai_history', JSON.stringify(next));
      return next;
    });
  };

  const consumeCredits = (amount: number): boolean => {
    if (user.credits >= amount) {
      setUser(prev => ({ ...prev, credits: prev.credits - amount }));
      return true;
    }
    return false;
  };

  const addCredits = (amount: number) => {
    setUser(prev => ({ ...prev, credits: prev.credits + amount }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.AI_ASSISTANT:
        return <AIAssistant credits={user.credits} onConsume={consumeCredits} history={aiHistory} onSaveHistory={addToHistory} />;
      case AppTab.NEWS:
        return <NewsFeed onConsume={consumeCredits} favorites={favorites} onToggleFavorite={toggleFavorite} />;
      case AppTab.COMPONENT_SEARCH:
        return <ComponentSearch onConsume={consumeCredits} favorites={compFavorites} onToggleFavorite={toggleCompFavorite} />;
      case AppTab.TOOLS:
        return <Tools />;
      case AppTab.ME:
        // Render Pricing View if active
        if (showPricing) {
          return <PricingView onBack={() => setShowPricing(false)} onAddCredits={addCredits} />;
        }

        return (
          <div className="flex flex-col space-y-6 pb-24 animate-in fade-in duration-500">
            {/* Profile Card */}
            <div className="flex items-center space-x-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-20 h-20 bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-md flex-none">
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-black text-slate-800 truncate">{user.name}</h2>
                  <span className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-black uppercase tracking-widest">{user.tier}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">{user.role}</p>
              </div>
            </div>

            {/* Credits Panel */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Available Credits</div>
                  <div className="text-4xl font-black">{user.credits}</div>
                  <div 
                    onClick={() => setShowPricing(true)}
                    className="mt-2 text-[10px] text-indigo-300 font-bold flex items-center cursor-pointer hover:text-white transition-colors"
                  >
                     <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     View Usage Rules
                  </div>
                </div>
                <button onClick={() => setShowPricing(true)} className="px-6 py-2 bg-indigo-600 rounded-xl text-xs font-black shadow-lg hover:bg-indigo-500 transition-colors active:scale-95">Top Up</button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            </div>

            {/* Menu Links */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               {[
                 { label: 'Membership & Subscription', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', onClick: () => setShowPricing(true) },
                 { label: 'Invoices & Billing', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z', onClick: () => {} },
                 { label: 'API Key Settings', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', onClick: () => {} }
               ].map((menu, idx) => (
                 <div 
                   key={menu.label} 
                   onClick={menu.onClick}
                   className={`p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors ${idx !== 2 ? 'border-b border-slate-50' : ''}`}
                 >
                    <div className="flex items-center space-x-3">
                       <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menu.icon} /></svg>
                       </div>
                       <span className="text-xs font-bold text-slate-700">{menu.label}</span>
                    </div>
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                 </div>
               ))}
            </div>

            {/* Collected Sections */}
            <div className="space-y-6">
              {/* Components Collection */}
              <div>
                <h3 className="text-xs font-black text-slate-800 px-1 uppercase tracking-widest flex items-center mb-4">
                  <span className="w-1 h-3 bg-amber-500 rounded-full mr-2"></span>Saved Components
                </h3>
                {compFavorites.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {compFavorites.map(comp => (
                      <div key={comp.id} className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center space-x-3 shadow-sm">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex-none overflow-hidden p-1">
                          <img src={comp.imageUrl} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[10px] font-black text-slate-800 truncate">{comp.name}</h4>
                          <p className="text-[8px] text-slate-400 truncate">{comp.manufacturer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-[10px] text-slate-300 px-1">No saved components.</p>}
              </div>

              {/* AI History Section */}
              <div>
                <h3 className="text-xs font-black text-slate-800 px-1 uppercase tracking-widest flex items-center mb-4">
                  <span className="w-1 h-3 bg-indigo-600 rounded-full mr-2"></span>Recent AI Tasks
                </h3>
                <div className="space-y-2">
                  {aiHistory.slice(0, 5).map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-xl ${item.type === 'IMAGE' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'}`}>
                          {item.type === 'IMAGE' ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[11px] font-bold text-slate-700 truncate">{item.task}</h4>
                          <p className="text-[9px] text-slate-400">{item.timestamp}</p>
                        </div>
                      </div>
                      <button className="text-[10px] text-indigo-600 font-bold px-3 py-1 bg-indigo-50 rounded-lg">View</button>
                    </div>
                  ))}
                  {aiHistory.length === 0 && <p className="text-[10px] text-slate-300 px-1">No history yet.</p>}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
