
import React from 'react';

interface PricingViewProps {
  onBack: () => void;
  onAddCredits: (amount: number) => void;
}

const PricingView: React.FC<PricingViewProps> = ({ onBack, onAddCredits }) => {
  const consumptionRules = [
    { action: 'AI Chat/Vision', cost: 1, icon: '💬' },
    { action: 'Component Search', cost: 5, icon: '🔍' },
    { action: 'News Insight', cost: 2, icon: '📰' },
    { action: 'Hardware Design', cost: 15, icon: '📐' },
  ];

  const packs = [
    { id: 1, credits: 100, price: '$1.99', label: 'Starter Pack', tag: '' },
    { id: 2, credits: 500, price: '$5.99', label: 'Engineer Choice', tag: 'Hot' },
    { id: 3, credits: 2000, price: '$19.99', label: 'Enterprise', tag: '-20%' },
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center -mx-4 px-4 sticky top-0 bg-slate-50/90 backdrop-blur-md py-3 z-30 border-b border-slate-200/50">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-indigo-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="ml-2 font-bold text-slate-800">Membership & Credits</div>
      </div>

      {/* Credit Rules */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center uppercase tracking-widest">
          <span className="w-1 h-3 bg-indigo-600 rounded-full mr-2"></span>
          Credit Cost (Per Task)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {consumptionRules.map((rule, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="text-base">{rule.icon}</span>
                <span className="text-xs font-bold text-slate-600">{rule.action}</span>
              </div>
              <span className="text-xs font-black text-indigo-600">-{rule.cost} pt</span>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Packs */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-sm font-black mb-1 uppercase tracking-widest text-indigo-200">Credit Top-up</h3>
          <p className="text-xs text-slate-300 mb-6">Credits never expire. Invoices available.</p>
          
          <div className="space-y-3">
            {packs.map(pack => (
              <div key={pack.id} className="flex justify-between items-center bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/20 transition-colors cursor-pointer group">
                 <div className="flex flex-col">
                   <div className="flex items-center space-x-2">
                     <span className="text-xl font-black text-white">{pack.credits}</span>
                     <span className="text-xs text-indigo-200 font-bold">pts</span>
                     {pack.tag && <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded">{pack.tag}</span>}
                   </div>
                   <span className="text-[10px] text-slate-300">{pack.label}</span>
                 </div>
                 <button 
                   onClick={() => { onAddCredits(pack.credits); onBack(); }}
                   className="px-5 py-2 bg-white text-indigo-900 rounded-xl text-xs font-black shadow-lg hover:scale-105 transition-transform"
                 >
                   {pack.price}
                 </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
      </div>

      {/* Membership Tiers */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
        <div className="p-6 bg-slate-50 border-b border-slate-100">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest text-center">Plan Comparison</h3>
        </div>
        <div className="p-4">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="text-[10px] text-slate-400 uppercase">
                 <th className="py-2 pl-2 font-bold">Feature</th>
                 <th className="py-2 text-center font-bold">Free</th>
                 <th className="py-2 text-center font-bold text-indigo-600">Pro</th>
               </tr>
             </thead>
             <tbody className="text-xs">
               <tr className="border-b border-slate-50">
                 <td className="py-3 pl-2 font-bold text-slate-700">AI Model</td>
                 <td className="py-3 text-center text-slate-500">Flash</td>
                 <td className="py-3 text-center font-bold text-indigo-600">Pro</td>
               </tr>
               <tr className="border-b border-slate-50">
                 <td className="py-3 pl-2 font-bold text-slate-700">Search</td>
                 <td className="py-3 text-center text-slate-500">Basic</td>
                 <td className="py-3 text-center font-bold text-indigo-600">Global Deep</td>
               </tr>
               <tr className="border-b border-slate-50">
                 <td className="py-3 pl-2 font-bold text-slate-700">Hardware Gen</td>
                 <td className="py-3 text-center text-slate-500">Text Only</td>
                 <td className="py-3 text-center font-bold text-indigo-600">BOM + Topology</td>
               </tr>
               <tr>
                 <td className="py-3 pl-2 font-bold text-slate-700">Speed</td>
                 <td className="py-3 text-center text-slate-500">Standard</td>
                 <td className="py-3 text-center font-bold text-indigo-600">Priority</td>
               </tr>
             </tbody>
           </table>
           <button className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-200">
             Upgrade to Pro ($4.99/mo)
           </button>
           <p className="text-[9px] text-slate-400 text-center mt-3">Pro includes 300 credits monthly</p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center py-4">
        <button className="text-xs text-slate-400 font-bold hover:text-indigo-600 transition-colors">
          Contact Sales for API Access &rarr;
        </button>
      </div>
    </div>
  );
};

export default PricingView;
