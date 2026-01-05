
import React, { useState, useMemo } from 'react';
import { MOCK_NEWS, NEWS_CATEGORIES, MOCK_STOCKS } from '../constants';
import { NewsItem, StockData } from '../types';
import NewsDetail from './NewsDetail';
import MarketWatch from './MarketWatch';

interface NewsFeedProps {
  onConsume: (amount: number) => boolean;
  favorites: NewsItem[];
  onToggleFavorite: (item: NewsItem) => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ onConsume, favorites, onToggleFavorite }) => {
  const [viewMode, setViewMode] = useState<'NEWS' | 'STOCKS' | 'SAVED'>('NEWS');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredNews = useMemo(() => {
    if (viewMode === 'SAVED') return favorites;
    if (activeCategory === "All") return MOCK_NEWS;
    return MOCK_NEWS.filter(news => news.category.includes(activeCategory));
  }, [activeCategory, viewMode, favorites]);

  if (selectedNews) {
    return (
      <NewsDetail 
        news={selectedNews} 
        onBack={() => setSelectedNews(null)} 
        isFavorited={!!favorites.find(f => f.id === selectedNews.id)}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Tab Switcher */}
      <div className="flex bg-slate-200/50 p-1.5 rounded-2xl">
         <button 
           onClick={() => setViewMode('NEWS')}
           className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
             viewMode === 'NEWS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
           }`}
         >
           News
         </button>
         <button 
           onClick={() => setViewMode('STOCKS')}
           className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
             viewMode === 'STOCKS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
           }`}
         >
           Market
         </button>
         <button 
           onClick={() => setViewMode('SAVED')}
           className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
             viewMode === 'SAVED' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
           }`}
         >
           Saved
         </button>
      </div>

      {viewMode === 'NEWS' || viewMode === 'SAVED' ? (
        <div className="space-y-4">
          {/* Categories - Only show for general news, not saved */}
          {viewMode === 'NEWS' && (
            <div className="flex space-x-2 overflow-x-auto pb-3 -mx-4 px-4 no-scrollbar">
              {NEWS_CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
          
          {viewMode === 'SAVED' && (
            <div className="px-1 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center">
                 <span className="w-1 h-3 bg-rose-500 rounded-full mr-2"></span>
                 My Saved Articles
              </h3>
              <span className="text-[10px] text-slate-400 font-bold">{favorites.length} items</span>
            </div>
          )}

          <div className="space-y-4">
            {filteredNews.length > 0 ? (
              filteredNews.map(news => (
                <div 
                  key={news.id} 
                  onClick={() => setSelectedNews(news)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                >
                  <h3 className="text-base font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                    {news.summary}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] px-2 py-1 bg-indigo-50 text-indigo-600 rounded font-bold uppercase tracking-tight">
                        {news.category}
                      </span>
                      <div className="flex items-center text-[10px] text-indigo-400 bg-indigo-50 px-2 py-1 rounded">
                         <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                         AI Insight
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{news.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-slate-400">
                <p className="text-sm">{viewMode === 'SAVED' ? 'No saved articles yet.' : 'No news in this category.'}</p>
              </div>
            )}
            
            {/* Banner - Only on main news feed */}
            {viewMode === 'NEWS' && (
              <div className="bg-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-200">
                 <div className="relative z-10">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">EELIB PRO</div>
                   <h4 className="font-bold mb-1 text-lg">AI-Powered Hardware Bootcamp</h4>
                   <p className="text-xs opacity-90 leading-relaxed max-w-[80%]">Master component selection and circuit simulation with Gemini 3 Pro.</p>
                   <button className="mt-5 px-5 py-2.5 bg-white text-indigo-600 rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-transform">Learn More</button>
                 </div>
                 <svg className="absolute -right-4 -bottom-4 w-44 h-44 opacity-10 rotate-12" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
              </div>
            )}
          </div>
        </div>
      ) : (
        <MarketWatch onSelectNews={setSelectedNews} />
      )}
    </div>
  );
};

export default NewsFeed;
