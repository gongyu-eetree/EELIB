
import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { MOCK_COMPONENTS } from '../constants';
import { ComponentData } from '../types';
import { deepComponentSearch } from '../services/geminiService';

interface ComponentSearchProps {
  onConsume: (amount: number) => boolean;
  favorites: ComponentData[];
  onToggleFavorite: (comp: ComponentData) => void;
}

const ComponentSearch: React.FC<ComponentSearchProps> = ({ onConsume, favorites, onToggleFavorite }) => {
  const [query, setQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'SPEC' | 'DATASHEET' | 'ALT' | 'CAD' | 'SUPPLIERS'>('SPEC');
  const [cadPreviewType, setCadPreviewType] = useState<'SYM' | 'FOOT' | '3D'>('SYM');

  const filteredComponents = useMemo(() => {
    if (!query.trim()) return MOCK_COMPONENTS;
    const lowerQuery = query.toLowerCase();
    return MOCK_COMPONENTS.filter(comp => 
      comp.name.toLowerCase().includes(lowerQuery) ||
      comp.manufacturer.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const handleAiSearch = async () => {
    if (!query.trim()) return;
    if (!onConsume(5)) {
      setSearchError("Insufficient credits for Deep Search.");
      return;
    }
    setIsAiSearching(true);
    setSearchError(null);
    try {
      await deepComponentSearch(query);
      alert("AI Deep Search completed. In a production environment, this would fetch the latest real-time data from global supply chains.");
    } catch (e) {
      setSearchError("Deep Search service is temporarily busy. Please try again.");
    } finally {
      setIsAiSearching(false);
    }
  };

  const renderDetailContent = () => {
    if (!selectedComponent) return null;

    switch (activeTab) {
      case 'SPEC':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Specifications</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedComponent.specs).map(([key, val]) => (
                  <div key={key} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold block mb-1 uppercase tracking-tighter">{key}</span>
                    <span className="text-xs font-black text-slate-700">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pinout Configuration</h4>
                {selectedComponent.pinout.length > 5 && (
                  <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Scroll to view all</span>
                )}
              </div>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                {selectedComponent.pinout.map((pin) => (
                  <div key={pin.pin} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                    <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md flex-none">{pin.pin}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-slate-800">{pin.func}</div>
                      <div className="text-[10px] text-slate-400 truncate font-medium">{pin.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'DATASHEET':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">AI Expert Design Notes</h4>
                <p className="text-sm leading-relaxed font-medium mb-6 opacity-90">{selectedComponent.datasheetInsights.designNotes}</p>
                <a href={selectedComponent.datasheetInsights.datasheetUrl} target="_blank" className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black transition-all shadow-lg">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Download Datasheet (PDF)
                </a>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Electrical Characteristics</h4>
              <div className="space-y-3">
                {Object.entries(selectedComponent.datasheetInsights.parameterTable).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                    <span className="text-xs text-slate-500 font-bold">{key}</span>
                    <span className="text-xs font-black text-slate-800 bg-slate-50 px-2 py-1 rounded-lg">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'ALT':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">Smart Alternatives</h4>
            {selectedComponent.alternatives.map((alt) => (
              <div key={alt.mpn} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="text-base font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{alt.mpn}</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{alt.mfg}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${alt.compatibility === 'Pin-to-Pin' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {alt.compatibility === 'Pin-to-Pin' ? 'P2P Drop-in' : 'Functional'}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">Recommendation: {alt.reasoning}</p>
                </div>
                <div className="flex justify-between items-center">
                   <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 font-black uppercase">Avg. Price</span>
                      <span className="text-sm font-black text-indigo-600">{alt.price}</span>
                   </div>
                   {alt.isDomestic && <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[9px] font-black uppercase border border-rose-100">Asian High-Value Source</span>}
                </div>
              </div>
            ))}
          </div>
        );

      case 'CAD':
        return (
          <div className="space-y-6 animate-in fade-in duration-300 px-1">
             <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-slate-50 p-6 flex flex-col border-b border-slate-100 min-h-[400px]">
                  <div className="flex justify-center items-center space-x-2 mb-8">
                    <button onClick={() => setCadPreviewType('SYM')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${cadPreviewType === 'SYM' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-600'}`}>Symbol</button>
                    <button onClick={() => setCadPreviewType('FOOT')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${cadPreviewType === 'FOOT' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-600'}`}>Footprint</button>
                    <button onClick={() => setCadPreviewType('3D')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${cadPreviewType === '3D' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-600'}`}>3D View</button>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center">
                    {cadPreviewType === 'SYM' && (
                      <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center">
                         <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm mb-4">
                           <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none">
                              <rect x="30" y="20" width="40" height="60" stroke="#4f46e5" strokeWidth="1.5" fill="white" />
                              <path d="M15,30 H30 M15,40 H30 M15,50 H30 M15,60 H30 M15,70 H30" stroke="#4f46e5" strokeWidth="1" />
                              <path d="M70,30 H85 M70,40 H85 M70,50 H85 M70,60 H85 M70,70 H85" stroke="#4f46e5" strokeWidth="1" />
                              <text x="50" y="52" textAnchor="middle" className="text-[8px] font-black fill-indigo-600">{selectedComponent.name}</text>
                           </svg>
                         </div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KiCad Symbol Preview</span>
                      </div>
                    )}

                    {cadPreviewType === 'FOOT' && (
                      <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center">
                         <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm mb-4">
                           <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none">
                              <rect x="25" y="25" width="50" height="50" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                              <rect x="20" y="30" width="8" height="4" fill="#f59e0b" />
                              <rect x="20" y="40" width="8" height="4" fill="#f59e0b" />
                              <rect x="20" y="50" width="8" height="4" fill="#f59e0b" />
                              <rect x="20" y="60" width="8" height="4" fill="#f59e0b" />
                              <rect x="72" y="30" width="8" height="4" fill="#f59e0b" />
                              <rect x="72" y="40" width="8" height="4" fill="#f59e0b" />
                              <rect x="72" y="50" width="8" height="4" fill="#f59e0b" />
                              <rect x="72" y="60" width="8" height="4" fill="#f59e0b" />
                           </svg>
                         </div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KiCad Footprint (WLCSP-20)</span>
                      </div>
                    )}

                    {cadPreviewType === '3D' && (
                      <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center">
                         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-4 flex items-center justify-center min-w-[240px] min-h-[240px]">
                            <img src={selectedComponent.imageUrl} className="w-40 h-40 object-contain hover:rotate-12 transition-transform duration-700" />
                         </div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3D STEP MODEL PREVIEW</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8">
                   <h4 className="text-sm font-black text-slate-800 mb-2">CAD Library Assets Ready</h4>
                   <p className="text-[11px] text-slate-400 font-bold mb-8 uppercase tracking-widest">KiCad & Industry Standard Export</p>
                   
                   <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95 flex flex-col items-center justify-center space-y-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5 5-5M12 4v11" /></svg>
                          <span>KiCad Symbol</span>
                        </button>
                        <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95 flex flex-col items-center justify-center space-y-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5 5-5M12 4v11" /></svg>
                          <span>KiCad Footprint</span>
                        </button>
                      </div>

                      <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5 5-5M12 4v11" /></svg>
                        Download 3D STEP Model (.step)
                      </button>

                      <div className="pt-4 border-t border-slate-50">
                        <div className="text-[9px] font-black text-slate-400 uppercase mb-3 text-center">Other EDA Support</div>
                        <div className="grid grid-cols-2 gap-3">
                          <button className="py-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-100 transition-all">Altium Designer</button>
                          <button className="py-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-100 transition-all">Cadence Allegro</button>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );

      case 'SUPPLIERS':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Display Sources Content First */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Distributor Inventory</h4>
                 <span className="flex items-center text-[9px] text-indigo-500 font-bold">
                   <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1.5 animate-pulse"></span>
                   Syncing Live Data
                 </span>
              </div>
              {selectedComponent.marketInfo.sources.map((source, i) => (
                <div key={i} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:border-indigo-300 transition-all">
                  <div className="p-5 flex justify-between items-start">
                     <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-base font-black text-slate-800">{source.distributor}</span>
                          {source.isAuthorized && (
                            <div className="flex items-center text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-black border border-emerald-100">
                              <svg className="w-2.5 h-2.5 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                              Authorized
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-[11px]">
                           <span className="text-emerald-600 font-black">Stock: {source.stock}</span>
                           <span className="text-slate-400 font-bold">Lead Time: {source.leadTime}</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-xl font-black text-indigo-600 leading-none mb-1">{source.price}</div>
                        <div className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Unit (USD)</div>
                     </div>
                  </div>
                  
                  {source.priceBreaks && (
                     <div className="px-5 pb-5 flex space-x-3 overflow-x-auto no-scrollbar">
                        {source.priceBreaks.map((pb, j) => (
                          <div key={j} className="flex-none bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center min-w-[70px]">
                             <div className="text-[9px] text-slate-400 font-black uppercase mb-1">{pb.quantity}+</div>
                             <div className="text-[11px] font-black text-slate-800">{pb.price}</div>
                          </div>
                        ))}
                     </div>
                  )}
                  
                  <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
                     <button className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-lg active:scale-95 transition-all">
                       View Listing
                     </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Display Market Analysis Content Next */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supply Chain Analysis</h4>
                   <div className={`flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${selectedComponent.marketInfo.priceTrend === 'Stable' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${selectedComponent.marketInfo.priceTrend === 'Stable' ? 'bg-blue-600' : 'bg-rose-600'}`}></span>
                      Trend: {selectedComponent.marketInfo.priceTrend === 'Stable' ? 'Stable' : 'Volatile'}
                   </div>
                 </div>
                 <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100">
                    <p className="text-xs text-indigo-900 leading-relaxed font-bold italic">“{selectedComponent.marketInfo.buyingAdvice}”</p>
                 </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-7 text-white shadow-xl">
                 <div className="flex items-center space-x-3 mb-6">
                   <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   <h4 className="text-xs font-black uppercase tracking-widest text-indigo-100">AI Supply Chain Alerts</h4>
                 </div>
                 <ul className="space-y-4">
                    <li className="flex items-start">
                       <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mr-3 flex-none mt-0.5">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                       </div>
                       <p className="text-[11px] font-bold leading-relaxed opacity-90">Forecast: Demand expected to rise by 15% in Q3. Consider buffer stocking.</p>
                    </li>
                    <li className="flex items-start">
                       <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mr-3 flex-none mt-0.5">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                       </div>
                       <p className="text-[11px] font-bold leading-relaxed opacity-90">Global availability is currently healthy with minimal price risk.</p>
                    </li>
                 </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (selectedComponent) {
    const detailTabs = [
      { id: 'SPEC', label: 'Specs' },
      { id: 'DATASHEET', label: 'Design' },
      { id: 'ALT', label: 'Alternatives' },
      { id: 'CAD', label: 'CAD Lib' },
      { id: 'SUPPLIERS', label: 'Suppliers' },
    ] as const;

    const isFavorited = favorites.some(f => f.id === selectedComponent.id);

    return (
      <div className="space-y-6 pb-24 animate-in slide-in-from-right-4 duration-500">
        <div className="flex items-center -mx-4 px-4 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-30 border-b border-slate-200/50">
          <button onClick={() => setSelectedComponent(null)} className="p-2.5 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-indigo-600 transition-all active:scale-90 border border-slate-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="ml-3 flex-1 min-w-0">
            <h2 className="text-sm font-black text-slate-900 truncate leading-none mb-1.5">{selectedComponent.name}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase truncate tracking-widest">{selectedComponent.manufacturer}</p>
          </div>
          <button 
            onClick={() => onToggleFavorite(selectedComponent)}
            className={`p-3 rounded-2xl transition-all active:scale-90 ${isFavorited ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-white text-slate-300 border border-slate-100 shadow-sm'}`}
          >
            <svg className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col items-center">
           <div className="w-32 h-32 bg-slate-50 rounded-3xl p-4 flex-none border border-slate-50 mb-6 group overflow-hidden">
              <img src={selectedComponent.imageUrl} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
           </div>
           <div className="text-center">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase mb-3 tracking-widest border border-indigo-100">{selectedComponent.category}</span>
              <p className="text-xs text-slate-500 leading-relaxed font-bold italic px-4">“{selectedComponent.description}”</p>
           </div>
        </div>

        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm sticky top-16 z-20 overflow-x-auto no-scrollbar border border-slate-100">
          {detailTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-none px-6 py-3 text-xs font-black rounded-xl transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
           {renderDetailContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full overflow-hidden">
      <div className="relative group px-1">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search MPN, Manufacturer, or Spec (e.g., 3.3V LDO)..."
            className="w-full pl-14 pr-32 py-5 bg-white border border-slate-200 rounded-[1.8rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-sm text-sm font-bold transition-all placeholder:text-slate-300"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <button 
            onClick={handleAiSearch} 
            disabled={isAiSearching || !query.trim()} 
            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-6 py-3 bg-indigo-600 text-white rounded-[1.3rem] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 disabled:bg-slate-200 disabled:shadow-none transition-all group overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              {isAiSearching ? 'Wait...' : 'Deep Search'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {searchError && <div className="mx-1 p-4 bg-rose-50 text-rose-600 text-[11px] font-black rounded-2xl text-center mb-4 border border-rose-100 animate-in shake duration-500">{searchError}</div>}
        
        <div className="flex items-center justify-between mb-6 px-3">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
             <span className="w-1.5 h-4 bg-indigo-600 rounded-full mr-2"></span>
             Recommended Components
           </h3>
           <span className="text-[11px] text-slate-400 font-bold bg-slate-100 px-3 py-1 rounded-full">{filteredComponents.length} Results</span>
        </div>

        <div className="grid grid-cols-1 gap-5 px-1">
          {filteredComponents.map(comp => (
            <div 
              key={comp.id} 
              onClick={() => setSelectedComponent(comp)} 
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex space-x-5 cursor-pointer hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-50 transition-all group relative overflow-hidden active:scale-[0.98]"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex-none overflow-hidden p-3 group-hover:scale-105 transition-transform duration-500 border border-slate-50">
                <img src={comp.imageUrl} className="w-full h-full object-contain mix-blend-multiply" />
              </div>

              <div className="flex-1 min-w-0 py-1">
                 <div className="flex justify-between items-start mb-1">
                   <h3 className="text-base font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors tracking-tight">{comp.name}</h3>
                   {comp.marketInfo.priceTrend === 'Falling' && (
                     <span className="text-[8px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-black uppercase tracking-widest border border-emerald-200">Price Drop</span>
                   )}
                 </div>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">{comp.manufacturer}</p>
                 
                 <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100/50">
                      {comp.category}
                    </span>
                    <div className="flex items-center text-[10px] font-bold text-slate-300">
                       <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                       {Math.floor(Math.random() * 500 + 100)}
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="py-24 text-center space-y-5">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <div>
               <p className="text-sm font-black text-slate-800">Part Not Found in Local Database</p>
               <p className="text-xs text-slate-400 font-bold mt-1">Try "Deep Search" to fetch real-time global engineering data.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentSearch;
