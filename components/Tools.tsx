
import React, { useState } from 'react';

type ToolType = 'MAIN' | 'VOLTAGE_DIVIDER' | 'UNIT_CONVERTER' | 'RESISTOR_COLOR' | 'CAP_CODE';

const Tools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('MAIN');

  // Voltage Divider State
  const [dividerIn, setDividerIn] = useState('5');
  const [dividerR1, setDividerR1] = useState('10000');
  const [dividerR2, setDividerR2] = useState('10000');

  // Unit Converter State
  const [dbmValue, setDbmValue] = useState('0');

  const toolsList = [
    { id: 'VOLTAGE_DIVIDER', name: 'Voltage Divider', desc: 'Calculate Vout based on resistors', icon: '⚡' },
    { id: 'UNIT_CONVERTER', name: 'RF Power', desc: 'dBm to mW Converter', icon: '📶' },
    { id: 'RESISTOR_COLOR', name: 'Resistor Code', desc: '4/5 Band Color Code', icon: '🌈' },
    { id: 'CAP_CODE', name: 'Capacitor Code', desc: '3-digit code (e.g., 104 -> 100nF)', icon: '🔋' },
  ];

  const renderDividerTool = () => {
    const vin = parseFloat(dividerIn) || 0;
    const r1 = parseFloat(dividerR1) || 0;
    const r2 = parseFloat(dividerR2) || 0;
    const vout = r1 + r2 > 0 ? (vin * r2) / (r1 + r2) : 0;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
        <div className="flex items-center space-x-2 text-indigo-600 mb-4" onClick={() => setActiveTool('MAIN')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="font-bold">Back to Tools</span>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Voltage Divider</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Input Voltage (Vin) V</label>
              <input type="number" value={dividerIn} onChange={e => setDividerIn(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Resistor R1 (Ω)</label>
              <input type="number" value={dividerR1} onChange={e => setDividerR1(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Resistor R2 (Ω)</label>
              <input type="number" value={dividerR2} onChange={e => setDividerR2(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div className="mt-8 p-6 bg-indigo-600 rounded-2xl text-center shadow-lg">
            <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Output Voltage (Vout)</div>
            <div className="text-3xl font-black text-white">{vout.toFixed(3)} V</div>
          </div>
        </div>
      </div>
    );
  };

  const renderUnitConverter = () => {
    const dbm = parseFloat(dbmValue) || 0;
    const mw = Math.pow(10, dbm / 10);
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
        <div className="flex items-center space-x-2 text-indigo-600 mb-4" onClick={() => setActiveTool('MAIN')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="font-bold">Back to Tools</span>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">dBm / mW Converter</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="text-xs font-bold text-slate-400 block mb-2">Input Power (dBm)</label>
              <input type="number" value={dbmValue} onChange={e => setDbmValue(e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-bold" />
            </div>
            <div className="flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </div>
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
              <label className="text-xs font-bold text-indigo-400 block mb-2">Power in mW</label>
              <div className="text-3xl font-black text-indigo-600">{mw.toFixed(2)} mW</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (activeTool === 'VOLTAGE_DIVIDER') return renderDividerTool();
  if (activeTool === 'UNIT_CONVERTER') return renderUnitConverter();

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl">
        <h2 className="text-xl font-bold mb-1">Engineer's Toolkit</h2>
        <p className="text-sm opacity-80">Essential calculators for everyday R&D.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {toolsList.map(tool => (
          <div 
            key={tool.id} 
            onClick={() => setActiveTool(tool.id as ToolType)}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all active:scale-95 cursor-pointer group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{tool.icon}</div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">{tool.name}</h4>
            <p className="text-[10px] text-slate-400 leading-tight">{tool.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
          <span className="w-1 h-4 bg-amber-500 rounded-full mr-2"></span>Reference Tables
        </h3>
        <div className="space-y-3">
          {['Logic Levels (1.8V/3.3V/5V)', 'PCB Trace Width vs Current', 'SMD Code Database', 'Pinouts (Type-C, RJ45)'].map(item => (
            <div key={item} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs font-medium text-slate-600 hover:bg-indigo-50 transition-colors cursor-pointer group">
              <span>{item}</span>
              <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h4 className="font-bold mb-2">Need more tools?</h4>
          <p className="text-xs opacity-60 leading-relaxed mb-4">Tell our AI Assistant what calculators you need, and we'll build them.</p>
          <button className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors">Submit Request</button>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
        </div>
      </div>
    </div>
  );
};

export default Tools;
