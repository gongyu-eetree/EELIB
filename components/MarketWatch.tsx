
import React, { useState, useEffect } from 'react';
import { StockData, NewsItem } from '../types';
import { MOCK_STOCKS, MOCK_NEWS } from '../constants';
import StockDetail from './StockDetail';

const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const width = 100;
  const height = 40;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / (range || 1)) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

const MarketWatch: React.FC<{ onSelectNews: (news: NewsItem) => void }> = ({ onSelectNews }) => {
  const [watchlist, setWatchlist] = useState<StockData[]>([]);
  const [search, setSearch] = useState('');
  const [activeStock, setActiveStock] = useState<StockData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('eelib_watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    } else {
      // Enrich mock stocks with stats
      const enriched = MOCK_STOCKS.slice(0, 4).map(s => ({
        ...s,
        marketCap: s.symbol === 'NVDA' ? '3.12T' : s.symbol === 'TSM' ? '840.2B' : '45.1B',
        peRatio: (Math.random() * 50 + 15).toFixed(2),
        high52w: (s.price * 1.2).toFixed(2),
        low52w: (s.price * 0.8).toFixed(2),
        volume: '15.2M'
      }));
      setWatchlist(enriched);
    }
  }, []);

  const saveWatchlist = (list: StockData[]) => {
    setWatchlist(list);
    localStorage.setItem('eelib_watchlist', JSON.stringify(list));
  };

  const handleAddStock = () => {
    const symbol = search.toUpperCase().trim();
    if (!symbol) return;
    
    const exists = watchlist.find(s => s.symbol === symbol);
    if (exists) return;

    const basePrice = Math.random() * 200 + 50;
    const newStock: StockData = {
      symbol,
      name: `${symbol} Technology Inc.`,
      price: basePrice,
      change: (Math.random() - 0.5) * 5,
      changePercent: (Math.random() - 0.5) * 2,
      history: Array.from({ length: 7 }, () => basePrice * (0.95 + Math.random() * 0.1)),
      marketCap: (Math.random() * 100).toFixed(1) + 'B',
      peRatio: (Math.random() * 30 + 10).toFixed(2),
      high52w: (basePrice * 1.15).toFixed(2),
      low52w: (basePrice * 0.85).toFixed(2),
      volume: (Math.random() * 5).toFixed(1) + 'M'
    };

    saveWatchlist([...watchlist, newStock]);
    setSearch('');
  };

  const removeStock = (symbol: string) => {
    saveWatchlist(watchlist.filter(s => s.symbol !== symbol));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Search Bar */}
      <div className="relative group">
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddStock()}
          placeholder="Search Tickers (AAPL, INTC, ASML)..."
          className="w-full pl-11 pr-20 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 shadow-sm outline-none text-sm transition-all"
        />
        <svg className="absolute left-4 top-4 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <button 
          onClick={handleAddStock}
          className="absolute right-3 top-2.5 px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
        >
          Add
        </button>
      </div>

      {/* Watchlist Summary */}
      <div className="flex items-center justify-between px-1">
         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Your Watchlist</h3>
         <span className="text-[10px] text-indigo-600 font-bold">{watchlist.length} Tickers</span>
      </div>

      {/* Watchlist Items */}
      <div className="space-y-3">
        {watchlist.map((stock) => (
          <div 
            key={stock.symbol}
            onClick={() => setActiveStock(stock)}
            className="bg-white rounded-[1.5rem] p-5 border border-slate-100 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">{stock.symbol}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{stock.name}</p>
            </div>

            <div className="flex-none px-4 hidden sm:block">
               <Sparkline data={stock.history} color={stock.change >= 0 ? '#10b981' : '#f43f5e'} />
            </div>

            <div className="text-right flex-none">
              <div className="text-base font-black text-slate-800">${stock.price.toFixed(2)}</div>
              <div className={`text-[11px] font-black px-2 py-0.5 rounded-lg inline-block ${stock.change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global Market News (Default Feed) */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center">
            <span className="w-1 h-3 bg-indigo-600 rounded-full mr-2"></span>
            Market Headlines
          </h3>
        </div>

        {MOCK_NEWS.slice(0, 3).map(news => (
          <div 
            key={news.id} 
            onClick={() => onSelectNews(news)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group flex gap-4"
          >
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-800 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {news.title}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-[9px] text-slate-400 font-bold uppercase">{news.time}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span className="text-[9px] text-indigo-500 font-black uppercase tracking-widest">Market Watch</span>
              </div>
            </div>
            {news.imageUrl && (
               <div className="w-16 h-16 rounded-xl overflow-hidden flex-none">
                  <img src={news.imageUrl} className="w-full h-full object-cover" />
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail Overlay */}
      {activeStock && (
        <StockDetail 
          stock={activeStock} 
          onClose={() => setActiveStock(null)} 
          onRemove={removeStock}
          onSelectNews={onSelectNews}
        />
      )}
    </div>
  );
};

export default MarketWatch;
