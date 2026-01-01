
import React, { useState } from 'react';

type ToolId = 
  | 'DIVIDER' | 'LED' | 'RC_LC' | 'ADC' | 'POWER' | 'TRACE' 
  | 'INTERFACE' | 'PACKAGE' | 'UNIT' | 'PARAMS';                                     

interface ToolMeta {
  id: ToolId;
  name: string;
  desc: string;
  icon: string;
  color: string;
}

const TOOLS_LIST: ToolMeta[] = [
  { id: 'DIVIDER', name: 'Voltage Divider', desc: 'Resistor network & drop calc', icon: '⚡', color: 'bg-purple-600' },
  { id: 'LED', name: 'LED Resistor', desc: 'Current limiting & bias', icon: '💡', color: 'bg-indigo-600' },
  { id: 'RC_LC', name: 'RC/LC Filter', desc: 'Filters & Frequency calc', icon: '〰️', color: 'bg-blue-600' },
  { id: 'ADC', name: 'ADC/DAC Resolution', desc: 'LSB, ENOB & Code calc', icon: '📊', color: 'bg-cyan-600' },
  { id: 'POWER', name: 'Power Budget', desc: 'System consumption & life', icon: '🔋', color: 'bg-emerald-600' },
  { id: 'TRACE', name: 'Trace Impedance', desc: 'Microstrip Z0 modeling', icon: '📏', color: 'bg-teal-600' },
  { id: 'INTERFACE', name: 'Interface Logic', desc: 'I2C/SPI/UART/CAN ref', icon: '🔌', color: 'bg-rose-600' },
  { id: 'PACKAGE', name: 'Package Library', desc: 'Dimensions & footprint ref', icon: '📦', color: 'bg-slate-600' },
  { id: 'UNIT', name: 'Converter', desc: 'Units, Codes & Radix calc', icon: '⚖️', color: 'bg-sky-600' },
  { id: 'PARAMS', name: 'Sensor Ref', desc: 'Standard ranges & specs', icon: '📚', color: 'bg-violet-600' }
];

const ToolSchematic: React.FC<{ type: ToolId; subType?: string }> = ({ type, subType }) => {
  const stroke = "#4f46e5";
  const fill = "rgba(79, 70, 229, 0.05)";

  const diagrams: Record<string, React.ReactNode> = {
    'DIVIDER': (
      <svg viewBox="0 0 100 80" className="w-full h-32">
        <path d="M50,5 V15" stroke={stroke} fill="none" strokeWidth="1.5" />
        <rect x="42" y="15" width="16" height="15" stroke={stroke} fill={fill} rx="1" />
        <path d="M50,30 V35" stroke={stroke} fill="none" />
        <circle cx="50" cy="35" r="2" fill={stroke} />
        <path d="M50,35 H75" stroke={stroke} fill="none" />
        <path d="M50,35 V45" stroke={stroke} fill="none" />
        <rect x="42" y="45" width="16" height="15" stroke={stroke} fill={fill} rx="1" />
        <path d="M50,60 V70 M40,70 H60" stroke={stroke} fill="none" />
        <text x="62" y="24" className="text-[5px] font-bold fill-slate-400">R1</text>
        <text x="62" y="54" className="text-[5px] font-bold fill-slate-400">R2</text>
        <text x="78" y="38" className="text-[7px] font-black fill-indigo-600">VOUT</text>
      </svg>
    ),
    'LED': (
      <svg viewBox="0 0 100 80" className="w-full h-32">
        <path d="M10,40 H30" stroke={stroke} strokeWidth="1.5" />
        <rect x="30" y="32" width="15" height="16" stroke={stroke} fill={fill} rx="1" />
        <path d="M45,40 H55" stroke={stroke} />
        <path d="M55,30 V50 L75,40 Z" stroke={stroke} fill={fill} />
        <path d="M75,30 V50" stroke={stroke} />
        <path d="M75,40 H95" stroke={stroke} />
        <path d="M62,25 L68,18 M66,28 L72,21" stroke={stroke} strokeWidth="0.5" />
      </svg>
    ),
    'INTERFACE': (
      <svg viewBox="0 0 100 80" className="w-full h-32">
        <rect x="20" y="15" width="60" height="50" stroke={stroke} fill={fill} rx="4" strokeWidth="1.5" />
        <text x="50" y="45" textAnchor="middle" className="text-[10px] font-black fill-indigo-600 uppercase tracking-widest">{subType || 'BUS'}</text>
        <path d="M10,25 H20 M10,40 H20 M10,55 H20" stroke={stroke} strokeWidth="1" />
        <path d="M80,25 H90 M80,40 H90 M80,55 H90" stroke={stroke} strokeWidth="1" />
      </svg>
    ),
    'TRACE': (
       <svg viewBox="0 0 100 80" className="w-full h-32">
          <rect x="10" y="60" width="80" height="4" fill="#cbd5e1" />
          <rect x="10" y="40" width="80" height="20" fill="#d1fae5" stroke="#10b981" strokeWidth="0.5" />
          <rect x="30" y="37" width="40" height="3" fill="#f59e0b" />
          <path d="M30,37 H70 V40 H30 Z" fill="#f59e0b" />
          <text x="50" y="75" textAnchor="middle" className="text-[6px] font-bold fill-slate-400">Microstrip Z0 Model</text>
       </svg>
    ),
    'ADC': (
      <svg viewBox="0 0 100 80" className="w-full h-32">
        <rect x="30" y="20" width="40" height="40" stroke={stroke} fill={fill} rx="2" strokeWidth="1.5" />
        <path d="M10,40 H30" stroke={stroke} strokeWidth="1.5" />
        <path d="M70,30 H90 M70,35 H90 M70,40 H90 M70,45 H90 M70,50 H90" stroke={stroke} strokeWidth="1" />
        <text x="50" y="42" textAnchor="middle" className="text-[8px] font-black fill-indigo-600">ΣΔ / SAR</text>
        <text x="15" y="35" className="text-[5px] font-bold fill-slate-400">ANALOG IN</text>
        <text x="75" y="25" className="text-[5px] font-bold fill-slate-400">DIGITAL CODE</text>
      </svg>
    ),
    'PARAMS': (
      <svg viewBox="0 0 100 80" className="w-full h-32">
        <circle cx="50" cy="40" r="25" stroke={stroke} fill={fill} strokeWidth="1.5" />
        <path d="M50,25 V55 M35,40 H65" stroke={stroke} strokeWidth="1" />
        <circle cx="50" cy="40" r="15" stroke={stroke} fill="none" strokeDasharray="2 2" />
        <text x="50" y="42" textAnchor="middle" className="text-[6px] font-black fill-indigo-600">SENSOR CORE</text>
      </svg>
    ),
    'RC_LC': (
      <svg viewBox="0 0 100 80" className="w-full h-32">
        <path d="M10,40 H30" stroke={stroke} strokeWidth="1.5" />
        {subType === 'LC' ? (
           <path d="M30,40 Q35,25 40,40 Q45,25 50,40 Q55,25 60,40 Q65,25 70,40" stroke={stroke} fill="none" strokeWidth="1.5" />
        ) : (
           <rect x="30" y="32" width="40" height="16" stroke={stroke} fill={fill} rx="1" />
        )}
        <path d="M70,40 H90" stroke={stroke} strokeWidth="1.5" />
        <circle cx="80" cy="40" r="2" fill={stroke} />
        <path d="M80,40 V50" stroke={stroke} />
        <path d="M72,50 H88 M75,55 H85" stroke={stroke} />
      </svg>
    )
  };

  return diagrams[type] || (
    <div className="h-32 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
      <span className="text-[8px] text-slate-300 font-black uppercase tracking-widest">Topology Preview</span>
    </div>
  );
};

const UNIT_CONVERSION_DATA: Record<string, Record<string, number>> = {
  Capacitance: { F: 1, mF: 1e-3, uF: 1e-6, nF: 1e-9, pF: 1e-12 },
  Voltage: { kV: 1e3, V: 1, mV: 1e-3, uV: 1e-6 },
  Current: { A: 1, mA: 1e-3, uA: 1e-6 },
  Inductance: { H: 1, mH: 1e-3, uH: 1e-6, nH: 1e-9 },
  Resistance: { MΩ: 1e6, kΩ: 1e3, Ω: 1, mΩ: 1e-3 },
  Power: { kW: 1e3, W: 1, mW: 1e-3, uW: 1e-6 }
};

const Tools: React.FC = () => {
  const [activeId, setActiveId] = useState<ToolId | null>(null);

  // --- Logic States ---
  const [div, setDiv] = useState({ vin: '12', vout: '5', r1: '10000', r2: '', i_load: '0' });
  const [led, setLed] = useState({ vs: '5', vf: '2.0', if: '20' });
  const [rc, setRc] = useState({ r: '1000', c: '100', l: '10', mode: 'Filter', filterType: 'RC' });
  const [freqCalc, setFreqCalc] = useState({ val: '1', unit: 'MHz', type: 'Freq' });
  const [adc, setAdc] = useState({ n: '12', vref: '3.3', val: '1.65', mode: 'ADC' });
  const [pwr, setPwr] = useState([{ name: 'MCU', i: '25', duty: '100' }]);
  const [iface, setIface] = useState({ type: 'I2C', vdd: '3.3', cbus: '100' });
  const [conv, setConv] = useState({ 
    val: '10', 
    unitType: 'Capacitance',
    from: 'nF', 
    to: 'uF', 
    mode: 'Unit', 
    code: '103', 
    radixIn: '255', 
    radixBase: '10' 
  });
  const [trace, setTrace] = useState({ w: '0.2', h: '0.1', t: '0.035', er: '4.4' });
  const [sensorCat, setSensorCat] = useState<'Env' | 'Motion' | 'Light'>('Env');

  const activeTool = TOOLS_LIST.find(t => t.id === activeId);

  const handleSendToAI = (data: any) => {
    alert(`EELIB AI is analyzing your design data...\nTarget: ${activeTool?.name}`);
  };

  const renderActiveTool = () => {
    switch (activeId) {
      case 'DIVIDER':
        const r2_calc = (parseFloat(div.vout) * parseFloat(div.r1)) / (Math.max(0.001, parseFloat(div.vin) - parseFloat(div.vout)));
        return (
          <div className="space-y-6">
            <ToolSchematic type="DIVIDER" />
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Input Voltage Vin (V)</label>
                 <input type="number" value={div.vin} onChange={e => setDiv({...div, vin: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Target Vout (V)</label>
                 <input type="number" value={div.vout} onChange={e => setDiv({...div, vout: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">R1 Value (Ω)</label>
                 <input type="number" value={div.r1} onChange={e => setDiv({...div, r1: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" />
               </div>
            </div>
            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                  <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Calculated R2 Resistance</div>
                  <div className="text-4xl font-black">{r2_calc > 0 ? r2_calc.toFixed(1) : '--'} Ω</div>
                  <div className="mt-6 pt-5 border-t border-white/10 text-[10px] flex justify-between font-bold uppercase tracking-widest">
                      <span>R1 Power: {((parseFloat(div.vin)-parseFloat(div.vout))**2 / parseFloat(div.r1) * 1000).toFixed(1)} mW</span>
                      <span>E24 Ref: {(r2_calc/1000).toFixed(1)}k</span>
                  </div>
               </div>
            </div>
          </div>
        );

      case 'LED':
        const r_led = (parseFloat(led.vs) - parseFloat(led.vf)) / (parseFloat(led.if) / 1000);
        return (
          <div className="space-y-6">
            <ToolSchematic type="LED" />
            <div className="grid grid-cols-2 gap-4">
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Source Vs (V)</label><input type="number" value={led.vs} onChange={e => setLed({...led, vs: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Forward Vf (V)</label><input type="number" value={led.vf} onChange={e => setLed({...led, vf: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
               <div className="col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Target If (mA)</label><input type="number" value={led.if} onChange={e => setLed({...led, if: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
            </div>
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
               <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Limiting Resistor</div>
               <div className="text-4xl font-black">{r_led > 0 ? r_led.toFixed(0) : '--'} Ω</div>
            </div>
          </div>
        );

      case 'RC_LC':
        const fc_rc = 1 / (2 * Math.PI * parseFloat(rc.r) * (parseFloat(rc.c) * 1e-9));
        const fc_lc = 1 / (2 * Math.PI * Math.sqrt((parseFloat(rc.l) * 1e-6) * (parseFloat(rc.c) * 1e-9)));
        
        // Frequency Calculator Logic
        const c_light = 299792458;
        let freqVal = parseFloat(freqCalc.val) || 0;
        let freqInHz = freqVal;
        if (freqCalc.unit === 'kHz') freqInHz *= 1e3;
        if (freqCalc.unit === 'MHz') freqInHz *= 1e6;
        if (freqCalc.unit === 'GHz') freqInHz *= 1e9;
        
        const period = freqInHz > 0 ? (1 / freqInHz) : 0;
        const wavelength = freqInHz > 0 ? (c_light / freqInHz) : 0;

        return (
          <div className="space-y-6">
             <div className="flex bg-slate-100 p-1 rounded-2xl">
                {['Filter', 'Wave/Freq'].map(m => (
                  <button key={m} onClick={() => setRc({...rc, mode: m})} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${rc.mode === m ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{m}</button>
                ))}
             </div>

             {rc.mode === 'Filter' ? (
                <div className="animate-in fade-in duration-300 space-y-6">
                  <div className="flex space-x-2">
                    <button onClick={() => setRc({...rc, filterType: 'RC'})} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl border transition-all ${rc.filterType === 'RC' ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm' : 'bg-white text-slate-400 border-slate-100'}`}>RC Filter</button>
                    <button onClick={() => setRc({...rc, filterType: 'LC'})} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl border transition-all ${rc.filterType === 'LC' ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm' : 'bg-white text-slate-400 border-slate-100'}`}>LC Filter</button>
                  </div>

                  <ToolSchematic type="RC_LC" subType={rc.filterType} />

                  <div className="grid grid-cols-2 gap-4">
                      {rc.filterType === 'RC' ? (
                        <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Resistance (Ω)</label><input type="number" value={rc.r} onChange={e => setRc({...rc, r: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
                      ) : (
                        <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Inductance (μH)</label><input type="number" value={rc.l} onChange={e => setRc({...rc, l: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
                      )}
                      <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Capacitance (nF)</label><input type="number" value={rc.c} onChange={e => setRc({...rc, c: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
                  </div>

                  <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">{rc.filterType === 'RC' ? 'Cutoff Frequency (-3dB)' : 'Resonant Frequency (Fc)'}</div>
                        <div className="text-4xl font-black">
                          {rc.filterType === 'RC' ? (
                             fc_rc > 1000 ? (fc_rc/1000).toFixed(2) + ' kHz' : fc_rc.toFixed(1) + ' Hz'
                          ) : (
                             fc_lc > 1e6 ? (fc_lc/1e6).toFixed(2) + ' MHz' : fc_lc > 1e3 ? (fc_lc/1e3).toFixed(2) + ' kHz' : fc_lc.toFixed(1) + ' Hz'
                          )}
                        </div>
                        <div className="mt-4 text-[9px] font-bold text-blue-100 uppercase tracking-widest">{rc.filterType === 'RC' ? 'f = 1 / (2πRC)' : 'f = 1 / (2π√LC)'}</div>
                      </div>
                  </div>
                </div>
             ) : (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Frequency Source</h4>
                    <div className="flex space-x-3 mb-6">
                      <input type="number" value={freqCalc.val} onChange={e => setFreqCalc({...freqCalc, val: e.target.value})} className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" />
                      <select value={freqCalc.unit} onChange={e => setFreqCalc({...freqCalc, unit: e.target.value})} className="bg-slate-50 px-5 rounded-2xl border border-slate-200 text-xs font-black uppercase">
                        {['Hz', 'kHz', 'MHz', 'GHz'].map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-900 rounded-[2rem] p-7 text-white shadow-lg">
                       <span className="text-[10px] font-black uppercase opacity-40 mb-2 block tracking-widest">Period (T)</span>
                       <div className="text-3xl font-black">
                         {period > 1 ? period.toFixed(2) + ' s' : 
                          period > 1e-3 ? (period*1e3).toFixed(3) + ' ms' :
                          period > 1e-6 ? (period*1e6).toFixed(3) + ' μs' :
                          (period*1e9).toFixed(3) + ' ns'}
                       </div>
                    </div>
                    <div className="bg-blue-600 rounded-[2rem] p-7 text-white shadow-lg">
                       <span className="text-[10px] font-black uppercase opacity-40 mb-2 block tracking-widest">Wavelength (λ) in Vacuum</span>
                       <div className="text-3xl font-black">
                         {wavelength > 1000 ? (wavelength/1000).toFixed(2) + ' km' : 
                          wavelength > 1 ? wavelength.toFixed(3) + ' m' :
                          (wavelength*100).toFixed(3) + ' cm'}
                       </div>
                    </div>
                  </div>
                </div>
             )}
          </div>
        );

      case 'UNIT':
        // Integrated "Converter" Tool
        const decodeSmd = (code: string) => {
           if (!code || code.length < 3) return '--';
           const val = parseInt(code.substring(0, code.length - 1));
           const mult = Math.pow(10, parseInt(code.charAt(code.length - 1)));
           const total = val * mult;
           return total >= 1e6 ? (total/1e6).toFixed(2) + ' M' : 
                  total >= 1e3 ? (total/1e3).toFixed(1) + ' k' : total + ' ';
        };

        const radixVal = parseInt(conv.radixIn, parseInt(conv.radixBase)) || 0;

        // Unit Conversion Calculation
        const categoryData = UNIT_CONVERSION_DATA[conv.unitType];
        const valNumeric = parseFloat(conv.val) || 0;
        const resultVal = valNumeric * (categoryData[conv.from] / categoryData[conv.to]);

        const handleUnitTypeChange = (type: string) => {
          const firstUnit = Object.keys(UNIT_CONVERSION_DATA[type])[0];
          const secondUnit = Object.keys(UNIT_CONVERSION_DATA[type])[1] || firstUnit;
          setConv({ ...conv, unitType: type, from: firstUnit, to: secondUnit });
        };

        return (
          <div className="space-y-6">
             <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
                {['Unit', 'Code', 'Radix'].map(m => (
                  <button key={m} onClick={() => setConv({...conv, mode: m})} className={`flex-1 min-w-[80px] py-2.5 text-[10px] font-black uppercase rounded-xl transition-all ${conv.mode === m ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400'}`}>{m}</button>
                ))}
             </div>

             {conv.mode === 'Unit' && (
                <div className="animate-in fade-in duration-300 space-y-6">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Conversion Category</label>
                    <div className="grid grid-cols-3 gap-2 mb-8">
                       {Object.keys(UNIT_CONVERSION_DATA).map(type => (
                         <button 
                           key={type} 
                           onClick={() => handleUnitTypeChange(type)}
                           className={`py-2 px-1 text-[9px] font-black rounded-xl border transition-all ${conv.unitType === type ? 'bg-sky-50 border-sky-200 text-sky-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                         >
                           {type}
                         </button>
                       ))}
                    </div>

                    <div className="flex flex-col items-center">
                      <input type="number" value={conv.val} onChange={e => setConv({...conv, val: e.target.value})} className="text-5xl font-black text-slate-900 outline-none w-full text-center mb-6 bg-transparent" />
                      <div className="flex items-center space-x-6 w-full">
                        <select 
                          value={conv.from} 
                          onChange={e => setConv({...conv, from: e.target.value})} 
                          className="flex-1 bg-slate-50 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100"
                        >
                          {Object.keys(categoryData).map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <svg className="w-5 h-5 text-slate-300 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth={2.5} /></svg>
                        <select 
                          value={conv.to} 
                          onChange={e => setConv({...conv, to: e.target.value})} 
                          className="flex-1 bg-slate-50 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100"
                        >
                          {Object.keys(categoryData).map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="bg-sky-600 rounded-[2rem] p-10 text-white text-center shadow-xl">
                    <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Calculated Result</div>
                    <div className="text-3xl font-black">
                       {resultVal.toLocaleString(undefined, { maximumFractionDigits: 6 })} {conv.to}
                    </div>
                  </div>
                </div>
             )}

             {conv.mode === 'Code' && (
                <div className="animate-in slide-in-from-right duration-300 space-y-6">
                   <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">SMD Resistor/Cap Code (e.g. 103, 472)</label>
                      <input 
                        type="text" 
                        value={conv.code} 
                        maxLength={4}
                        onChange={e => setConv({...conv, code: e.target.value})} 
                        className="text-6xl font-black text-slate-900 bg-slate-50 border-b-4 border-sky-600 w-full text-center py-4 outline-none rounded-t-3xl" 
                      />
                   </div>
                   <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-black uppercase opacity-40 block tracking-widest">Resistor (Ω)</span>
                        <div className="text-3xl font-black text-sky-400">{decodeSmd(conv.code)}Ω</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase opacity-40 block tracking-widest">Capacitor (pF)</span>
                        <div className="text-3xl font-black text-indigo-400">{decodeSmd(conv.code)}F</div>
                      </div>
                   </div>
                </div>
             )}

             {conv.mode === 'Radix' && (
                <div className="animate-in slide-in-from-right duration-300 space-y-6">
                   <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                      <div className="flex space-x-3 mb-6">
                        <input value={conv.radixIn} onChange={e => setConv({...conv, radixIn: e.target.value})} className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" />
                        <select value={conv.radixBase} onChange={e => setConv({...conv, radixBase: e.target.value})} className="bg-slate-50 px-5 rounded-2xl border border-slate-200 text-xs font-black uppercase">
                          <option value="10">Dec</option>
                          <option value="16">Hex</option>
                          <option value="2">Bin</option>
                        </select>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between">
                        <span className="text-xs font-black text-slate-400 uppercase">Decimal</span>
                        <span className="text-base font-black text-slate-800">{radixVal}</span>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between">
                        <span className="text-xs font-black text-slate-400 uppercase">Hexadecimal</span>
                        <span className="text-base font-black text-indigo-600 uppercase">0x{radixVal.toString(16)}</span>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between">
                        <span className="text-xs font-black text-slate-400 uppercase">Binary</span>
                        <span className="text-sm font-black text-emerald-600">{radixVal.toString(2)}</span>
                      </div>
                   </div>
                </div>
             )}
          </div>
        );

      case 'ADC':
        const bits = parseInt(adc.n);
        const vref = parseFloat(adc.vref);
        const inputVal = parseFloat(adc.val);
        const lsbSize = (vref / Math.pow(2, bits)) * 1000;
        const snr = 6.02 * bits + 1.76;
        
        let resultLabel = "Output Code";
        let resValAdc = "--";
        
        if (adc.mode === 'ADC') {
          const code = Math.floor((inputVal / vref) * Math.pow(2, bits));
          resValAdc = code.toString();
        } else {
          resultLabel = "Output Voltage (V)";
          const vout = (inputVal / Math.pow(2, bits)) * vref;
          resValAdc = vout.toFixed(4) + " V";
        }

        return (
          <div className="space-y-6">
            <ToolSchematic type="ADC" />
            
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button 
                onClick={() => setAdc({...adc, mode: 'ADC', val: '1.65'})} 
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${adc.mode === 'ADC' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-400'}`}
              >
                ADC Mode
              </button>
              <button 
                onClick={() => setAdc({...adc, mode: 'DAC', val: '2048'})} 
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${adc.mode === 'DAC' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-400'}`}
              >
                DAC Mode
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Resolution (Bits)</label>
                 <select value={adc.n} onChange={e => setAdc({...adc, n: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm">
                  {[8, 10, 12, 14, 16, 24, 32].map(b => <option key={b}>{b}</option>)}
                 </select>
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Reference Vref (V)</label>
                 <input type="number" step="0.1" value={adc.vref} onChange={e => setAdc({...adc, vref: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" />
               </div>
               <div className="col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">
                   {adc.mode === 'ADC' ? 'Analog Input Vin (V)' : 'Digital Code (Dec)'}
                 </label>
                 <input 
                   type="number" 
                   value={adc.val} 
                   onChange={e => setAdc({...adc, val: e.target.value})} 
                   className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" 
                 />
               </div>
            </div>

            <div className="bg-cyan-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                  <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">{resultLabel}</div>
                  <div className="text-4xl font-black">{resValAdc}</div>
                  <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-widest">
                      <div className="flex flex-col">
                        <span className="opacity-60 mb-1">LSB Size</span>
                        <span>{lsbSize.toFixed(4)} mV</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="opacity-60 mb-1">Theo. SNR</span>
                        <span>{snr.toFixed(1)} dB</span>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        );

      case 'TRACE':
        const w = parseFloat(trace.w);
        const h = parseFloat(trace.h);
        const t = parseFloat(trace.t);
        const er = parseFloat(trace.er);
        const z0 = (87 / Math.sqrt(er + 1.41)) * Math.log(5.98 * h / (0.8 * w + t));
        return (
          <div className="space-y-6">
            <ToolSchematic type="TRACE" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Width (mm)</label>
                <input type="number" step="0.01" value={trace.w} onChange={e => setTrace({...trace, w: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Height (mm)</label>
                <input type="number" step="0.01" value={trace.h} onChange={e => setTrace({...trace, h: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Thickness (mm)</label>
                <input type="number" step="0.001" value={trace.t} onChange={e => setTrace({...trace, t: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Dielectric (Er)</label>
                <input type="number" step="0.1" value={trace.er} onChange={e => setTrace({...trace, er: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" />
              </div>
            </div>
            <div className="bg-teal-600 rounded-[2rem] p-8 text-white shadow-xl">
               <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Characteristic Impedance</div>
               <div className="text-4xl font-black">{!isNaN(z0) && z0 > 0 ? z0.toFixed(1) + ' Ω' : '--'}</div>
               <div className="mt-4 text-[10px] font-bold text-teal-100 italic">Formula: Microstrip Approximation</div>
            </div>
          </div>
        );

      case 'INTERFACE':
        const interfaces: Record<string, any> = {
          'I2C': { pins: ['SDA', 'SCL'], speed: '100/400/1000 kHz', tips: 'Requires pull-up resistors (typically 2.2k-10k).' },
          'SPI': { pins: ['MOSI', 'MISO', 'SCK', 'CS'], speed: '10 - 50+ MHz', tips: 'Supports full-duplex. Multiple slaves require separate CS pins.' },
          'UART': { pins: ['TX', 'RX', '(GND)'], speed: '9600 - 1M+ bps', tips: 'Asynchronous. Ensure baud rates match on both ends.' },
          'CAN': { pins: ['CAN_H', 'CAN_L'], speed: '125k - 1M bps', tips: 'Differential pair. Requires 120Ω termination at bus ends.' }
        };
        const currentIf = interfaces[iface.type];
        return (
          <div className="space-y-6">
            <ToolSchematic type="INTERFACE" subType={iface.type} />
            <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
              {Object.keys(interfaces).map(type => (
                <button 
                  key={type} 
                  onClick={() => setIface({...iface, type: type as any})}
                  className={`flex-1 min-w-[70px] py-2.5 text-[10px] font-black uppercase rounded-xl transition-all ${iface.type === type ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                     <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Signals</span>
                     <div className="text-xs font-black text-slate-800">{currentIf.pins.join(' / ')}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                     <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Max Speed</span>
                     <div className="text-xs font-black text-slate-800">{currentIf.speed}</div>
                  </div>
               </div>
               <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                  <span className="text-[10px] font-black text-rose-600 uppercase block mb-1 tracking-widest">Design Tips</span>
                  <p className="text-xs font-medium text-rose-900 leading-relaxed italic">“{currentIf.tips}”</p>
               </div>
            </div>
          </div>
        );

      case 'PARAMS':
        const categories: Record<string, any> = {
          'Env': [
            { name: 'Temperature', range: '-40 to 125°C', typical: 'TMP117, SHT40', error: '±0.1°C' },
            { name: 'Pressure', range: '300 to 1100 hPa', typical: 'BMP280, LPS22', error: '±1 hPa' },
            { name: 'Humidity', range: '0 to 100% RH', typical: 'HDC1080', error: '±2%' }
          ],
          'Motion': [
            { name: 'Accelerometer', range: '±2g to ±16g', typical: 'LIS3DH, BMA400', bits: '12-16 Bit' },
            { name: 'Gyroscope', range: '±125 to ±2000 dps', typical: 'ICM-42605', bits: '16 Bit' },
            { name: 'Magnetometer', range: '±4800 uT', typical: 'MMC5603', bits: '16 Bit' }
          ],
          'Light': [
            { name: 'ALS', range: '0.01 to 64k Lux', typical: 'OPT3001', accuracy: 'Human Eye' },
            { name: 'ToF', range: '0 to 4m', typical: 'VL53L1X', type: 'Laser/IR' }
          ]
        };
        const activeSensors = categories[sensorCat];
        return (
          <div className="space-y-6">
            <ToolSchematic type="PARAMS" />
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {Object.keys(categories).map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSensorCat(cat as any)}
                  className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-xl transition-all ${sensorCat === cat ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400'}`}
                >
                  {cat === 'Env' ? 'Environment' : cat}
                </button>
              ))}
            </div>
            <div className="space-y-4">
               {activeSensors.map((s: any, i: number) => (
                 <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                       <h5 className="text-xs font-black text-slate-800">{s.name}</h5>
                       <span className="text-[9px] bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-black border border-violet-100">{s.typical}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[10px]">
                       <div>
                          <span className="text-slate-400 font-bold uppercase tracking-tighter">Typical Range</span>
                          <p className="font-black text-slate-700">{s.range}</p>
                       </div>
                       <div>
                          <span className="text-slate-400 font-bold uppercase tracking-tighter">{s.error ? 'Precision' : 'Specs'}</span>
                          <p className="font-black text-slate-700">{s.error || s.bits || s.accuracy || 'N/A'}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );

      case 'POWER':
        const total_i = pwr.reduce((acc, curr) => acc + (parseFloat(curr.i) * parseFloat(curr.duty) / 100), 0);
        return (
          <div className="space-y-6">
             <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-5 tracking-widest">Module Consumption Tree</h4>
                <div className="space-y-4">
                   {pwr.map((mod, i) => (
                     <div key={i} className="flex gap-3 items-center">
                        <input value={mod.name} className="flex-1 bg-slate-50 p-3 rounded-xl text-xs font-black" onChange={e => {const n = [...pwr]; n[i].name = e.target.value; setPwr(n);}} />
                        <div className="flex items-center space-x-2">
                           <input type="number" value={mod.i} className="w-16 bg-slate-50 p-3 rounded-xl text-xs font-black text-center" onChange={e => {const n = [...pwr]; n[i].i = e.target.value; setPwr(n);}} />
                           <span className="text-[9px] text-slate-300 font-bold">mA</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <input type="number" value={mod.duty} className="w-14 bg-slate-50 p-3 rounded-xl text-xs font-black text-center" onChange={e => {const n = [...pwr]; n[i].duty = e.target.value; setPwr(n);}} />
                           <span className="text-[9px] text-slate-300 font-bold">%</span>
                        </div>
                     </div>
                   ))}
                   <button onClick={() => setPwr([...pwr, {name: 'New Module', i: '10', duty: '100'}])} className="w-full py-3.5 bg-slate-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">+ Add Functional Block</button>
                </div>
             </div>
             <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl">
                <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">System Avg. Current</div>
                <div className="text-4xl font-black">{total_i.toFixed(1)} mA</div>
             </div>
          </div>
        );

      default:
        return <div className="py-24 text-center text-slate-400 font-bold italic">Tool engine initializing...</div>;
    }
  };

  if (activeId) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-right duration-400 overflow-hidden">
        <header className="flex items-center px-6 py-6 border-b border-slate-100 bg-white sticky top-0 z-10 flex-none shadow-sm">
          <button onClick={() => setActiveId(null)} className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all active:scale-90">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="ml-4">
            <h2 className="text-sm font-black text-slate-800 uppercase leading-none mb-1.5 tracking-tight">{activeTool?.name}</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Engineering Engine</p>
          </div>
          <button className="ml-auto p-3 text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-all active:scale-90" onClick={() => handleSendToAI(activeId)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 no-scrollbar pb-32">
           {renderActiveTool()}
        </main>
        
        <footer className="p-6 bg-white border-t border-slate-100 safe-bottom">
           <button onClick={() => handleSendToAI(activeId)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black shadow-xl shadow-indigo-100 flex items-center justify-center space-x-3 active:scale-95 transition-all">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
             <span className="uppercase tracking-[0.2em]">Invite AI Review Design</span>
           </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">EELIB Toolbox</h2>
          <p className="text-xs text-indigo-300 font-bold uppercase tracking-[0.2em] opacity-80">10 Core Engineering Engines</p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-2 gap-5 px-1">
        {TOOLS_LIST.map(tool => (
          <button 
            key={tool.id} 
            onClick={() => setActiveId(tool.id)}
            className="bg-white p-7 rounded-[2.2rem] border border-slate-100 shadow-sm text-left hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-50/50 transition-all active:scale-[0.98] group relative overflow-hidden"
          >
            <div className={`w-12 h-12 rounded-2xl ${tool.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
              <span className="text-2xl">{tool.icon}</span>
            </div>
            <h4 className="text-xs font-black text-slate-800 mb-1.5 leading-none tracking-tight">{tool.name}</h4>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter truncate leading-tight">{tool.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tools;
