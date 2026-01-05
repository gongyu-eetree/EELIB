
import React, { useState } from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Analysis Complete', desc: 'Your PCB thermal review is ready.', time: '2m ago', read: false },
    { id: 2, title: 'Credits Added', desc: 'You received 50 free daily credits.', time: '1h ago', read: false },
    { id: 3, title: 'Price Alert', desc: 'STM32F103C8T6 price dropped by 5%.', time: '3h ago', read: true }
  ]);

  const tabs = [
    { id: AppTab.AI_ASSISTANT, label: 'AI', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    )},
    { id: AppTab.NEWS, label: 'News', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 4v4h4" /></svg>
    )},
    { id: AppTab.COMPONENT_SEARCH, label: 'Parts', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z" />
      </svg>
    )},
    { id: AppTab.TOOLS, label: 'Tools', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
    )},
    { id: AppTab.ME, label: 'Me', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )},
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 relative">
      {/* Global Header with Safe Area Top */}
      <header className="flex-none px-6 pb-4 bg-indigo-600 text-white flex justify-between items-center shadow-lg z-50 relative pt-[calc(1rem+env(safe-area-inset-top))]">
        <h1 className="text-xl font-black tracking-tight uppercase select-none">EELIB</h1>
        <div className="flex space-x-2">
           <button 
             onClick={() => setShowNotifications(!showNotifications)}
             aria-label="Toggle notifications"
             className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full border-2 border-indigo-600"></span>}
           </button>
        </div>

        {/* Notification Dropdown */}
        {showNotifications && (
          <>
            <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowNotifications(false)}></div>
            <div className="absolute top-full right-4 mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right text-slate-800">
               <div className="px-5 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Notifications</h2>
                 {unreadCount > 0 && <button onClick={markAllRead} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">Mark all read</button>}
               </div>
               <div className="max-h-[300px] overflow-y-auto overscroll-contain no-scrollbar">
                 {notifications.length === 0 ? (
                   <div className="py-8 text-center text-slate-400 text-xs font-medium">No new notifications</div>
                 ) : (
                   notifications.map(n => (
                     <div key={n.id} className={`px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-indigo-50/30' : ''}`}>
                        <div className="flex items-start justify-between mb-1">
                           <span className={`text-xs font-black ${!n.read ? 'text-indigo-900' : 'text-slate-700'}`}>{n.title}</span>
                           <span className="text-[9px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">{n.desc}</p>
                     </div>
                   ))
                 )}
               </div>
            </div>
          </>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 no-scrollbar overscroll-contain">
        <div className="max-w-4xl mx-auto w-full pb-[calc(5rem+env(safe-area-inset-bottom))]">
          {children}
        </div>
      </main>

      {/* Bottom Navigation with Safe Area Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] z-50 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        <div className="max-w-4xl mx-auto flex justify-around items-center px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-2 transition-all duration-300 relative group ${
                activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <div className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110 -translate-y-0.5' : 'group-hover:scale-105'}`}>
                {tab.icon}
              </div>
              <span className={`text-[9px] mt-1.5 font-black uppercase tracking-widest transition-opacity ${activeTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <span className="absolute -top-1 w-1 h-1 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
