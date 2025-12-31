
import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MOCK_COMPONENTS } from '../constants';
import { ComponentData, AlternativePart } from '../types';
import { deepComponentSearch, componentChat } from '../services/geminiService';

interface ComponentSearchProps {
  onConsume: (amount: number) => boolean;
  favorites: ComponentData[];
  onToggleFavorite: (comp: ComponentData) => void;
}

const ComponentSearch: React.FC<ComponentSearchProps> = ({ onConsume, favorites, onToggleFavorite }) => {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isAiSearching, setIsAiSearching] = useState(false);
  // Store structured AI results
  const [aiSearchResults, setAiSearchResults] = useState<ComponentData[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'SPEC' | 'DATASHEET' | 'ALT' | 'CAD' | 'MARKET'>('SPEC');
  const [activeCadType, setActiveCadType] = useState<'Symbol' | 'Footprint' | '3D'>('Symbol');

  useEffect(() => {
    const savedHistory = localStorage.getItem('search_history');
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
  }, []);

  const updateHistory = (newQuery: string) => {
    if (!newQuery.trim()) return;
    const cleanQuery = newQuery.trim();
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h !== cleanQuery);
      const updated = [cleanQuery, ...filtered].slice(0, 5);
      localStorage.setItem('search_history', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredComponents = useMemo(() => {
    if (!query.trim()) return MOCK_COMPONENTS;
    const lowerQuery = query.toLowerCase();
    return MOCK_COMPONENTS.filter(comp => 
      comp.name.toLowerCase().includes(lowerQuery) ||
      comp.manufacturer.toLowerCase().includes(lowerQuery) ||
      comp.category.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  // Helper to find if an AI result exists in local mock DB
  const findLocalMatch = (aiComp: ComponentData) => {
    return MOCK_COMPONENTS.find(local => 
      local.name.toLowerCase() === aiComp.name.toLowerCase() || 
      aiComp.name.toLowerCase().includes(local.name.toLowerCase())
    );
  };

  const handleAiSearch = async () => {
    if (!query.trim()) return;
    
    // Check credits
    if (!onConsume(1)) {
      setSearchError("Insufficient credits for deep search.");
      setTimeout(() => setSearchError(null), 3000);
      return;
    }

    updateHistory(query);
    setIsAiSearching(true);
    setAiSearchResults([]);
    setSearchError(null);
    
    try {
      // Result is now ComponentData[]
      const results = await deepComponentSearch(query);
      setAiSearchResults(results);
    } catch (e) {
      setSearchError("Service busy. Please try again.");
    } finally {
      setIsAiSearching(false);
    }
  };

  const isFavorited = (compId: string) => !!favorites.find(f => f.id === compId);

  // Render logic for the details view
  if (selectedComponent) {
    const tabs = [
      { id: 'SPEC', label: 'Specs' },
      { id: 'DATASHEET', label: 'Datasheet' },
      { id: 'ALT', label: 'Alternatives' },
      { id: 'CAD', label: 'CAD Model' },
      { id: 'MARKET', label: 'Sourcing' },
    ] as const;

    // Handle generic AI image if url is missing
    const displayImage = selectedComponent.imageUrl || 'https://images.unsplash.com/photo-1555664424-778a69022365?auto=format&fit=crop&q=80&w=200';

    return (
      <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Detail Header */}
        <div className="flex items-center -mx-4 px-4 sticky top-0 bg-slate-50/90 backdrop-blur-md py-3 z-30 border-b border-slate-200/50">
          <button onClick={() => setSelectedComponent(null)} className="p-2 -ml-2 text-slate-500 hover:text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="ml-2 flex-1 truncate">
            <h2 className="text-sm font-bold text-slate-800 leading-none truncate">{selectedComponent.name}</h2>
            <p className="text-[10px] text-slate-400 mt-1">{selectedComponent.manufacturer}</p>
          </div>
          <button 
            onClick={() => onToggleFavorite(selectedComponent)}
            className={`mr-2 p-2 rounded-xl transition-all ${isFavorited(selectedComponent.id) ? 'text-amber-500 bg-amber-50' : 'text-slate-400 bg-white'}`}
          >
            <svg className={`w-5 h-5 ${isFavorited(selectedComponent.id) ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </button>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center space-x-6">
          <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-2 flex-none shadow-inner text-center">
            <img src={displayImage} className="w-full h-full object-contain mx-auto" alt="" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedComponent.aiAdvice?.risks?.lifecycle?.includes('Active') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                {selectedComponent.aiAdvice?.risks?.lifecycle || 'Active'}
              </span>
              {/* @ts-ignore - isDomestic used as Asian Source flag */}
              {selectedComponent.isDomestic && (
                 <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[10px] font-bold border border-rose-100">Asian Source</span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 italic">"{selectedComponent.description}"</p>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-200 sticky top-14 z-20 overflow-x-auto no-scrollbar gap-1 items-center">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-none px-5 py-2.5 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-[400px]">
          {activeTab === 'SPEC' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
                  <span className="w-1 h-4 bg-indigo-600 rounded-full mr-2"></span>Technical Specs
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {selectedComponent.specs && Object.entries(selectedComponent.specs).map(([k, v]) => (
                    <div key={k} className="flex flex-col border-b border-slate-50 pb-2">
                      <span className="text-[10px] text-slate-400 mb-1 font-medium uppercase tracking-tight">{k}</span>
                      <span className="text-xs font-bold text-slate-700">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedComponent.engineeringInsights?.pitfalls && (
                <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
                   <h3 className="text-sm font-bold mb-4 flex items-center text-indigo-400">
                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                     Engineering Pitfalls
                   </h3>
                   <ul className="space-y-3">
                     {selectedComponent.engineeringInsights.pitfalls.map((p, idx) => (
                       <li key={idx} className="flex items-start text-xs leading-relaxed opacity-90">
                         <span className="text-rose-500 mr-2 font-black">!</span>
                         {p}
                       </li>
                     ))}
                   </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'DATASHEET' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-slate-800">Technical Documentation</h3>
                  {selectedComponent.datasheetInsights?.datasheetUrl && (
                    <a href={selectedComponent.datasheetInsights.datasheetUrl} target="_blank" className="text-xs text-indigo-600 font-bold flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      PDF Download
                    </a>
                  )}
                </div>
                <div className="space-y-4">
                   <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Key Parameters</h4>
                   <div className="grid grid-cols-1 gap-3">
                      {selectedComponent.datasheetInsights?.parameterTable && Object.entries(selectedComponent.datasheetInsights.parameterTable).map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                          <span className="text-xs text-slate-600 font-medium">{k}</span>
                          <span className="text-xs text-slate-800 font-bold">{v}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ALT' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex items-start space-x-3 mb-2">
                 <svg className="w-5 h-5 text-indigo-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                 <p className="text-[11px] text-indigo-700 leading-relaxed">Click any alternative to view details. System prioritizes local inventory matches, otherwise performs deep AI search.</p>
              </div>
              <div className="space-y-4">
                {selectedComponent.alternatives && selectedComponent.alternatives.length > 0 ? selectedComponent.alternatives.map(alt => {
                   const localMatch = MOCK_COMPONENTS.find(c => c.name === alt.mpn || alt.mpn.includes(c.name));
                   return (
                    <div 
                      key={alt.mpn} 
                      onClick={async () => {
                         if (localMatch) {
                           setSelectedComponent(localMatch);
                           setActiveTab('SPEC');
                         } else {
                           // Trigger AI Search
                           setQuery(alt.mpn);
                           // Small delay to allow UI to update if needed, but actually we just call search
                           await handleAiSearch();
                           // Note: handleAiSearch updates state, but since we are inside the render of a selectedComponent, 
                           // we need to make sure we exit this view or the AI search updates the `aiSearchResults` 
                           // and the outer view needs to show it.
                           // Actually, simpler logic: Set Query -> Clear Selected -> Auto-trigger search is hard to coordinate.
                           // Better: Call deep search, get result, Set Selected.
                           if (!onConsume(1)) {
                             setSearchError("Insufficient credits for deep search.");
                             return;
                           }
                           
                           setSelectedComponent(null); // Go back to list
                           setAiSearchResults([]); 
                           setIsAiSearching(true);
                           
                           try {
                             const results = await deepComponentSearch(alt.mpn);
                             setAiSearchResults(results);
                             setIsAiSearching(false);
                           } catch(e) {
                             setSearchError("Search failed.");
                             setIsAiSearching(false);
                           }
                         }
                      }}
                      className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group relative"
                    >
                      <div className="flex justify-between items-start mb-4">
                         <div>
                           <div className="flex items-center space-x-2">
                             <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{alt.mpn}</h4>
                             {localMatch && <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-600 text-[9px] rounded font-bold">Local</span>}
                           </div>
                           <div className="flex items-center space-x-2 mt-1">
                             <span className="text-[9px] text-slate-400 font-bold uppercase">{alt.mfg}</span>
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${alt.compatibility === 'Pin-to-Pin' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                               {alt.compatibility}
                             </span>
                             {alt.isDomestic && <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded text-[8px] font-black uppercase tracking-widest">Asian Source</span>}
                           </div>
                         </div>
                         <div className="text-right">
                           <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Risk Score</div>
                           <div className={`text-lg font-black ${alt.riskScore < 15 ? 'text-emerald-500' : 'text-amber-500'}`}>{alt.riskScore}</div>
                         </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                         <p className="text-[11px] text-slate-600 leading-relaxed font-medium">"{alt.reasoning}"</p>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                         <span className="text-slate-400">Ref Price: <span className="text-slate-900 font-bold">{alt.price}</span></span>
                         <span className="text-indigo-600 font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                         </span>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="bg-slate-50 rounded-3xl p-8 text-center border border-dashed border-slate-200">
                    <p className="text-slate-400 text-xs font-bold">No alternatives found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'CAD' && (
            <div className="space-y-6">
               <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-slate-800">Preview & Download</h3>
                    <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
                       {(['Symbol', 'Footprint', '3D'] as const).map(type => (
                         <button
                           key={type}
                           onClick={() => setActiveCadType(type)}
                           className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeCadType === type ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                         >
                           {type}
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Simulated CAD Viewer */}
                 <div className="aspect-video bg-slate-900 rounded-2xl mb-6 relative overflow-hidden group flex items-center justify-center border border-slate-800 shadow-inner">
                    <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] opacity-20 pointer-events-none">
                       {Array.from({length: 400}).map((_, i) => <div key={i} className="border-[0.5px] border-slate-700"></div>)}
                    </div>
                    {/* Placeholder content based on type */}
                    {activeCadType === 'Symbol' && (
                       <svg className="w-32 h-32 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                    )}
                    {activeCadType === 'Footprint' && (
                       <div className="w-32 h-32 border-2 border-red-500 rounded-sm relative">
                          <div className="absolute -top-1 -left-1 w-2 h-2 bg-slate-400 rounded-full"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-dashed border-yellow-500"></div>
                          {Array.from({length: 8}).map((_, i) => (
                             <div key={i} className="absolute w-1.5 h-3 bg-slate-300" style={{
                               left: i < 4 ? '-4px' : 'auto', right: i >= 4 ? '-4px' : 'auto',
                               top: `${10 + (i % 4) * 25}%`
                             }}></div>
                          ))}
                       </div>
                    )}
                    {activeCadType === '3D' && (
                       <img src={selectedComponent.imageUrl} className="w-48 h-48 object-contain drop-shadow-2xl grayscale brightness-75 contrast-125" style={{filter: 'drop-shadow(0 20px 13px rgba(0,0,0,0.5))'}} />
                    )}
                    
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur text-white text-[9px] px-2 py-1 rounded font-mono">
                       Online Viewer v1.0
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white rounded-xl shadow-sm">
                             <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          </div>
                          <div>
                             <h4 className="text-xs font-bold text-slate-800">
                                {activeCadType === 'Symbol' ? 'Symbol (.SchLib)' : activeCadType === 'Footprint' ? 'Footprint (.PcbLib)' : 'Model (.STEP)'}
                             </h4>
                             <p className="text-[10px] text-slate-400">For Altium / KiCad / Cadence</p>
                          </div>
                       </div>
                       <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-transform">
                          Download
                       </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                       {['SnapEDA', 'UltraLibrarian'].map(source => (
                          <div key={source} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between">
                             <span className="text-[10px] font-bold text-slate-500">via {source}</span>
                             <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          </div>
                       ))}
                    </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'MARKET' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-800">Global Pricing</h3>
                    <div className="flex items-center space-x-2">
                       <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                       <span className="text-[10px] font-bold text-slate-400">Live</span>
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    {selectedComponent.marketInfo?.sources?.length > 0 ? selectedComponent.marketInfo.sources.map(source => (
                      <div key={source.distributor} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                         <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-3">
                            <div className="flex items-center space-x-2">
                               <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{source.distributor}</span>
                               {source.isAuthorized && <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-bold rounded">Authorized</span>}
                            </div>
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center bg-white px-2 py-1 rounded border border-slate-100 shadow-sm">
                               Stock: {source.stock}
                            </span>
                         </div>
                         
                         <div className="space-y-3">
                            <div className="flex justify-between items-center">
                               <div className="text-[10px] text-slate-400 font-bold uppercase">Price Breaks (USD)</div>
                               <div className="text-[10px] text-slate-400">Lead Time: <span className="text-slate-700 font-bold">{source.leadTime}</span></div>
                            </div>
                            
                            {source.priceBreaks && source.priceBreaks.length > 0 ? (
                               <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                                  <table className="w-full text-left">
                                    <thead>
                                      <tr className="bg-slate-50 text-[9px] text-slate-400 border-b border-slate-100">
                                        <th className="py-2 px-3 font-bold uppercase">Qty</th>
                                        <th className="py-2 px-3 font-bold uppercase text-right">Unit Price</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {source.priceBreaks.map((pb, idx) => (
                                        <tr key={pb.quantity} className={`text-[11px] ${idx !== source.priceBreaks!.length - 1 ? 'border-b border-slate-50' : ''}`}>
                                           <td className="py-2 px-3 font-bold text-slate-700">{pb.quantity}+</td>
                                           <td className="py-2 px-3 font-bold text-indigo-600 text-right">{pb.price}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                               </div>
                            ) : (
                               <div className="text-center py-3 bg-white rounded-xl border border-dashed border-slate-200">
                                 <span className="text-[10px] text-slate-400">No price break data</span>
                                 {source.price && <div className="mt-1 text-sm font-bold text-slate-800">Ref: {source.price}</div>}
                               </div>
                            )}
                         </div>
                         
                         <button className="w-full mt-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors">
                            Buy Now
                         </button>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                         <p className="text-xs text-slate-400">No market info available</p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300 h-full overflow-hidden flex flex-col">
      <div className="relative flex-none">
        <textarea
          rows={1}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAiSearch(); }}}
          placeholder="Search Part Number or Spec (e.g., 3.3V LDO)..."
          className="w-full pl-12 pr-12 py-5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm text-sm"
        />
        <svg className="absolute left-4 top-[22px] w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <button onClick={handleAiSearch} disabled={isAiSearching} className="absolute right-3 top-[12px] p-2 bg-indigo-600 text-white rounded-xl shadow-md disabled:bg-slate-300 transition-all active:scale-95">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-1">
        {searchError && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl text-center border border-red-100">
            {searchError}
          </div>
        )}

        {/* AI Search Results Section */}
        {(isAiSearching || aiSearchResults.length > 0) && (
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-2 px-1">
               <div className="p-1 bg-indigo-600 rounded-md text-white">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <h3 className="font-bold text-indigo-900 text-xs uppercase tracking-widest">AI Recommendations</h3>
            </div>
            
            {isAiSearching ? (
              <div className="bg-indigo-50/50 rounded-3xl p-8 flex flex-col items-center justify-center border border-indigo-100">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <span className="text-xs text-indigo-600 font-bold">Scanning Global Datasheets...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {aiSearchResults.map(comp => {
                  const localMatch = findLocalMatch(comp);
                  // Use local component data if available, otherwise use AI data
                  const displayComp = localMatch || comp; 
                  
                  return (
                    <div 
                      key={comp.id} 
                      onClick={() => setSelectedComponent(displayComp)}
                      className="bg-indigo-50/40 rounded-3xl p-5 shadow-sm border border-indigo-100 flex space-x-4 cursor-pointer hover:bg-indigo-50 transition-all relative group"
                    >
                      <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden flex-none flex items-center justify-center p-2 border border-indigo-50 shadow-sm">
                        <img src={displayComp.imageUrl} className="w-full h-full object-contain" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <h3 className="text-sm font-black text-slate-800 truncate flex items-center gap-2">
                               {displayComp.name}
                               {localMatch && <span className="px-1.5 py-0.5 bg-indigo-600 text-white text-[9px] rounded font-bold">Local</span>}
                               {/* @ts-ignore */}
                               {displayComp.isDomestic && !localMatch && <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] rounded font-bold">Asian Source</span>}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{displayComp.manufacturer}</p>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onToggleFavorite(displayComp); }}
                            className={`p-1.5 rounded-lg transition-colors ${isFavorited(displayComp.id) ? 'bg-amber-100 text-amber-500' : 'bg-white text-slate-300 hover:text-indigo-500'}`}
                          >
                            <svg className={`w-4 h-4 ${isFavorited(displayComp.id) ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 line-clamp-1">{displayComp.description}</p>
                        {!localMatch && <div className="mt-2 text-[9px] text-indigo-400 flex items-center">
                           <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                           AI Generated
                        </div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="w-full h-px bg-slate-100 my-4"></div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 px-1 uppercase tracking-widest">Local Library</h3>
          {filteredComponents.map(comp => (
            <div 
              key={comp.id} 
              onClick={() => setSelectedComponent(comp)}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex space-x-4 cursor-pointer hover:border-indigo-300 transition-all relative"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden flex-none flex items-center justify-center p-2">
                <img src={comp.imageUrl} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-black text-slate-800 truncate">{comp.name}</h3>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(comp); }}
                    className={`p-1 transition-colors ${isFavorited(comp.id) ? 'text-amber-500' : 'text-slate-300'}`}
                  >
                    <svg className={`w-5 h-5 ${isFavorited(comp.id) ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{comp.manufacturer}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-bold">{comp.category}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredComponents.length === 0 && !isAiSearching && aiSearchResults.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <p className="text-xs text-slate-400 font-bold">No components found.</p>
              <p className="text-[10px] text-slate-300 mt-1">Try AI Search for global results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentSearch;
