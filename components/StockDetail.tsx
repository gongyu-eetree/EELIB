
import React from 'react';
import { StockData, NewsItem } from '../types';
import { MOCK_NEWS } from '../constants';
import ReactMarkdown from 'react-markdown';

interface StockDetailProps {
  stock: StockData;
  onClose: () => void;
  onRemove: (symbol: string) => void;
  onSelectNews: (news: NewsItem) => void;
}

const LargeChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const width = 400;
  const height = 150;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / (range || 1)) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${points} ${width},${height} 0,${height}`;

  return (
    <div className="w-full h-40 relative">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          fill="url(#chartGradient)"
          points={areaPoints}
          className="transition-all duration-700"
        />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="transition-all duration-700"
        />
      </svg>
    </div>
  );
};

const StockDetail: React.FC<StockDetailProps> = ({ stock, onClose, onRemove, onSelectNews }) => {
  const isPositive = stock.change >= 0;
  const color = isPositive ? '#10b981' : '#f43f5e';

  const stats = [
    { label: 'Market Cap', value: stock.marketCap || 'N/A' },
    { label: 'P/E Ratio', value: stock.peRatio || 'N/A' },
    { label: '52W High', value: stock.high52w || 'N/A' },
    { label: '52W Low', value: stock.low52w || 'N/A' },
    { label: 'Volume', value: stock.volume || 'N/A' },
    { label: 'Avg Vol', value: '12.4M' },
  ];

  const filteredNews = MOCK_NEWS.filter(news => {
    const companyShortName = stock.name.split(' ')[0].toLowerCase();
    return news.title.toLowerCase().includes(companyShortName) || 
           news.summary.toLowerCase().includes(companyShortName);
  });

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-none">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div className="text-center">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">{stock.symbol}</h2>
          <p className="text-[10px] text-slate-400 font-bold">{stock.name}</p>
        </div>
        <button 
          onClick={() => { onRemove(stock.symbol); onClose(); }}
          className="p-2 -mr-2 text-slate-300 hover:text-rose-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Price & Performance */}
        <div className="px-6 py-8">
          <div className="text-4xl font-black text-slate-900 mb-1">${stock.price.toFixed(2)}</div>
          <div className={`flex items-center text-sm font-black ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
             <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
             <span className="mx-2 opacity-30">|</span>
             <span>({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
          </div>
        </div>

        {/* Interactive Chart */}
        <div className="px-6 mb-10">
           <LargeChart data={stock.history} color={color} />
           <div className="flex justify-between mt-4 border-t border-slate-50 pt-3">
              {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(range => (
                <button key={range} className={`text-[10px] font-black px-3 py-1.5 rounded-lg ${range === '1W' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>
                  {range}
                </button>
              ))}
           </div>
        </div>

        {/* Stats Grid */}
        <div className="px-6 mb-10">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Key Statistics</h3>
           <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {stats.map(stat => (
                <div key={stat.label} className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-[11px] font-bold text-slate-400">{stat.label}</span>
                  <span className="text-[11px] font-black text-slate-700">{stat.value}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Company News Feed */}
        <div className="px-6 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Latest News</h3>
            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[9px] font-black uppercase">AI Filtered</span>
          </div>
          <div className="space-y-4">
            {filteredNews.map(news => (
              <div 
                key={news.id} 
                onClick={() => onSelectNews(news)}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex gap-4 active:scale-[0.98] transition-all"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800 mb-1 line-clamp-2 leading-tight">{news.title}</h4>
                  <div className="flex items-center text-[9px] text-slate-400 font-bold uppercase">
                    <span>{news.time}</span>
                    <span className="mx-2">•</span>
                    <span className="text-indigo-500">Market Insight</span>
                  </div>
                </div>
                {news.imageUrl && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-none">
                    <img src={news.imageUrl} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
            {filteredNews.length === 0 && (
              <div className="text-center py-10">
                <p className="text-xs text-slate-300 font-bold">No recent headlines for this symbol.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
