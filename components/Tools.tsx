
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

// E24 Standard Base Values (Higher precision: 5% tolerance standard)
const E24_BASE = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1];

const formatResistance = (val: number): string => {
  if (!val || val <= 0) return '--';
  let unit = 'Ω';
  let displayVal = val;
  
  if (val >= 1e6) {
    displayVal = val / 1e6;
    unit = 'MΩ';
  } else if (val >= 1e3) {
    displayVal = val / 1e3;
    unit = 'kΩ';
  }

  const formatted = Number(displayVal.toFixed(displayVal < 10 ? 2 : 1)).toString();
  return `${formatted} ${unit}`;
};

const getClosestESeries = (val: number, series: number[]): number => {
  if (val <= 0) return 0;
  
  const logV = Math.log10(val);
  const exponent = Math.floor(logV);
  const fraction = Math.pow(10, logV - exponent); // range 1.0 to 10.0
  
  let closest = series[0];
  let minDiff = Math.abs(fraction - series[0]);
  
  for (let s of series) {
    const diff = Math.abs(fraction - s);
    if (diff < minDiff) {
      minDiff = diff;
      closest = s;
    }
  }

  if (Math.abs(fraction - 10) < minDiff) {
    return Math.pow(10, exponent + 1);
  }
  
  return closest * Math.pow(10, exponent);
};

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
        <text x="62" y="24" className="text-[5px] font-bold fill-slate-400 uppercase tracking-tighter">R1</text>
        <text x="62" y="54" className="text-[5px] font-bold fill-slate-400 uppercase tracking-tighter">R2</text>
        <text x="78" y="38" className="text-[7px] font-black fill-indigo-600 uppercase tracking-widest">VOUT</text>
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
        <text x="15" y="35" className="text-[5px] font-bold fill-slate-400 uppercase tracking-tighter">ANALOG IN</text>
        <text x="75" y="25" className="text-[5px] font-bold fill-slate-400 uppercase tracking-tighter">DIGITAL CODE</text>
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

interface PowerModule {
  name: string;
  v: string;
  i: string;
  duty: string;
}

const Tools: React.FC = () => {
  const [activeId, setActiveId] = useState<ToolId | null>(null);

  // --- Logic States ---
  const [div, setDiv] = useState({ vin: '12', vout: '5', r1: '1000', r2: '', i_load: '0' });
  const [led, setLed] = useState({ vs: '5', vf: '2.0', if: '20' });
  const [rc, setRc] = useState({ r: '1000', c: '100', l: '10', mode: 'Filter', filterType: 'RC' });
  const [freqCalc, setFreqCalc] = useState({ val: '1', unit: 'MHz', type: 'Freq' });
  const [adc, setAdc] = useState({ n: '12', vref: '3.3', val: '1.65', mode: 'ADC' });
  const [pwr, setPwr] = useState<PowerModule[]>([
    { name: 'MCU', v: '3.3', i: '25', duty: '10' },
    { name: 'DDR', v: '1.2', i: '150', duty: '80' }
  ]);
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

  const renderActiveTool = () => {
    switch (activeId) {
      case 'DIVIDER':
        const r1_val = parseFloat(div.r1) || 1;
        const vin_val = parseFloat(div.vin) || 0;
        const vout_target = parseFloat(div.vout) || 0;
        const r2_calc = (vout_target * r1_val) / (Math.max(0.001, vin_val - vout_target));
        
        // Using E24 for higher precision lookup
        const r2_e24 = getClosestESeries(r2_calc, E24_BASE);

        const vout_real_e24 = (vin_val * r2_e24) / (r1_val + r2_e24);
        const error_e24 = vout_target > 0 ? (Math.abs(vout_real_e24 - vout_target) / vout_target * 100) : 0;
        
        return (
          <div className="space-y-6">
            <ToolSchematic type="DIVIDER" />
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">Input Voltage Vin (V)</label>
                 <input type="number" value={div.vin} onChange={e => setDiv({...div, vin: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm transition-all focus:ring-4 focus:ring-indigo-500/5" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">Target Vout (V)</label>
                 <input type="number" value={div.vout} onChange={e => setDiv({...div, vout: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm transition-all focus:ring-4 focus:ring-indigo-500/5" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">R1 Value (Ω)</label>
                 <input type="number" value={div.r1} onChange={e => setDiv({...div, r1: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm transition-all focus:ring-4 focus:ring-indigo-500/5" />
               </div>
            </div>
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                  <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-[0.2em]">Theoretical Ideal R2</div>
                  <div className="text-5xl font-black">{r2_calc > 0 ? r2_calc.toFixed(1) : '--'} Ω</div>
                  <div className="mt-10 pt-6 border-t border-white/10 space-y-5">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                           <div className="flex items-center space-x-2 mb-1">
                             <span className="text-[9px] font-black uppercase opacity-60 tracking-widest">Standard E24 Reference</span>
                             <span className="bg-white/10 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest">Precise</span>
                           </div>
                           <span className="text-2xl font-black">{formatResistance(r2_e24)}</span>
                        </div>
                        <div className="text-right">
                           <span className="text-[8px] font-bold uppercase opacity-50 block mb-0.5">Real Vout / Error</span>
                           <span className="text-sm font-black">{vout_real_e24.toFixed(3)}V <span className="opacity-60 text-[10px]">({error_e24.toFixed(1)}%)</span></span>
                        </div>
                      </div>
                  </div>
                  <div className="mt-8 text-[9px] font-bold text-indigo-200 uppercase tracking-tighter text-right opacity-60 italic">
                    R1 Power Dissipation: {((parseFloat(div.vin)-parseFloat(div.vout))**2 / parseFloat(div.r1) * 1000).toFixed(1)} mW
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        );

      case 'LED':
        const r_led = (parseFloat(led.vs) - parseFloat(led.vf)) / (parseFloat(led.if) / 1000);
        return (
          <div className="space-y-6">
            <ToolSchematic type="LED" />
            <div className="grid grid-cols-2 gap-4">
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">Source Vs (V)</label><input type="number" value={led.vs} onChange={e => setLed({...led, vs: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">Forward Vf (V)</label><input type="number" value={led.vf} onChange={e => setLed({...led, vf: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
               <div className="col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">Target If (mA)</label><input type="number" value={led.if} onChange={e => setLed({...led, if: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
            </div>
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
               <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Calculated Limiting Resistor</div>
               <div className="text-4xl font-black">{r_led > 0 ? r_led.toFixed(0) : '--'} Ω</div>
            </div>
          </div>
        );

      case 'RC_LC':
        const fc_rc = 1 / (2 * Math.PI * parseFloat(rc.r) * (parseFloat(rc.c) * 1e-9));
        const fc_lc = 1 / (2 * Math.PI * Math.sqrt((parseFloat(rc.l) * 1e-6) * (parseFloat(rc.c) * 1e-9)));
        
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
                  <button key={m} onClick={() => setRc({...rc, mode: m})} className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-xl transition-all ${rc.mode === m ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{m}</button>
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
                        <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">Resistance (Ω)</label><input type="number" value={rc.r} onChange={e => setRc({...rc, r: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
                      ) : (
                        <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">Inductance (μH)</label><input type="number" value={rc.l} onChange={e => setRc({...rc, l: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
                      )}
                      <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">Capacitance (nF)</label><input type="number" value={rc.c} onChange={e => setRc({...rc, c: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
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
                       <div className="text-3xl font-black text-indigo-400">
                         {period > 1 ? period.toFixed(2) + ' s' : 
                          period > 1e-3 ? (period*1e3).toFixed(3) + ' ms' :
                          period > 1e-6 ? (period*1e6).toFixed(3) + ' μs' :
                          (period*1e9).toFixed(3) + ' ns'}
                       </div>
                    </div>
                    <div className="bg-blue-600 rounded-[2rem] p-7 text-white shadow-lg">
                       <span className="text-[10px] font-black uppercase opacity-40 mb-2 block tracking-widest">Wavelength (λ) in Vacuum</span>
                       <div className="text-3xl font-black text-blue-100">
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

      case 'POWER':
        const railSum: Record<string, number> = {};
        let totalPowerMW = 0;
        let totalSystemCurrentAvg = 0;

        pwr.forEach(mod => {
          const v = parseFloat(mod.v) || 0;
          const i = parseFloat(mod.i) || 0;
          const duty = (parseFloat(mod.duty) || 0) / 100;
          const avgI = i * duty;
          
          totalSystemCurrentAvg += avgI;
          totalPowerMW += (v * avgI);

          const vKey = v.toFixed(1) + 'V';
          railSum[vKey] = (railSum[vKey] || 0) + avgI;
        });

        return (
          <div className="space-y-6">
             <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-8 tracking-[0.2em] text-center">Module Consumption Map</h4>
                <div className="space-y-8">
                   {pwr.map((mod, i) => (
                     <div key={i} className="flex gap-2 items-end">
                        <div className="flex-1 min-w-0">
                           <label className="text-[8px] font-black text-slate-300 uppercase block mb-1.5 ml-1 truncate">Module Name</label>
                           <input 
                              value={mod.name} 
                              placeholder="Name"
                              className="w-full bg-slate-50 px-3 py-3.5 rounded-2xl text-xs font-black outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-300 border border-slate-100/50 transition-all" 
                              onChange={e => {const n = [...pwr]; n[i].name = e.target.value; setPwr(n);}} 
                           />
                        </div>
                        <div className="w-20 flex-none">
                           <label className="text-[8px] font-black text-slate-300 uppercase block mb-1.5 text-center truncate">Volt(V)</label>
                           <input 
                              type="number" 
                              step="0.1"
                              value={mod.v} 
                              className="w-full bg-slate-50 px-1 py-3.5 text-xs font-black text-center outline-none rounded-2xl border border-slate-100/50 focus:ring-2 focus:ring-indigo-500/20" 
                              onChange={e => {const n = [...pwr]; n[i].v = e.target.value; setPwr(n);}} 
                           />
                        </div>
                        <div className="w-24 flex-none">
                           <label className="text-[8px] font-black text-slate-300 uppercase block mb-1.5 text-center truncate">Curr(mA)</label>
                           <input 
                              type="number" 
                              value={mod.i} 
                              className="w-full bg-slate-50 px-1 py-3.5 text-xs font-black text-center outline-none rounded-2xl border border-slate-100/50 focus:ring-2 focus:ring-indigo-500/20" 
                              onChange={e => {const n = [...pwr]; n[i].i = e.target.value; setPwr(n);}} 
                           />
                        </div>
                        <div className="w-20 flex-none">
                           <label className="text-[8px] font-black text-slate-300 uppercase block mb-1.5 text-center truncate">Duty(%)</label>
                           <input 
                              type="number" 
                              value={mod.duty} 
                              className="w-full bg-slate-50 px-1 py-3.5 text-xs font-black text-center outline-none rounded-2xl border border-slate-100/50 focus:ring-2 focus:ring-indigo-500/20" 
                              onChange={e => {const n = [...pwr]; n[i].duty = e.target.value; setPwr(n);}} 
                           />
                        </div>
                        <div className="pb-2.5 flex-none">
                          <button onClick={() => setPwr(pwr.filter((_, idx) => idx !== i))} className="p-2 text-slate-200 hover:text-rose-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                     </div>
                   ))}
                   <button onClick={() => setPwr([...pwr, {name: '', v: '3.3', i: '10', duty: '100'}])} className="w-full py-4 bg-slate-50 text-indigo-600 border border-dashed border-slate-200 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center space-x-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                     <span>Add Module</span>
                   </button>
                </div>
             </div>

             <div className="space-y-4">
                <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
                   <div className="relative z-10 flex justify-between items-end">
                      <div>
                        <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-[0.2em]">Total Power Demand</div>
                        <div className="text-5xl font-black">
                           {totalPowerMW >= 1000 ? (totalPowerMW / 1000).toFixed(2) : totalPowerMW.toFixed(0)} 
                           <span className="text-2xl ml-2 opacity-80">{totalPowerMW >= 1000 ? 'W' : 'mW'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[9px] font-black uppercase opacity-60 mb-1 tracking-widest">Sys Avg Current</div>
                         <div className="text-xl font-black">{totalSystemCurrentAvg.toFixed(1)} mA</div>
                      </div>
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest text-center">Rail Summary</h4>
                   <div className="grid grid-cols-2 gap-3">
                      {Object.entries(railSum).map(([rail, current]) => (
                        <div key={rail} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                           <span className="text-xs font-black text-indigo-600">{rail}</span>
                           <span className="text-xs font-black text-slate-700">{current.toFixed(1)} mA</span>
                        </div>
                      ))}
                      {Object.keys(railSum).length === 0 && <div className="col-span-2 py-4 text-center text-[10px] font-bold text-slate-300 uppercase italic">Add modules to see breakdown</div>}
                   </div>
                </div>
             </div>
          </div>
        );

      case 'ADC':
        const bits = parseInt(adc.n);
        const vref = parseFloat(adc.vref);
        const inputVal = parseFloat(adc.val);
        const lsbSize = (vref / Math.pow(2, bits)) * 1000;
        const snr = 6.02 * bits + 1.76;
        
        let resultLabel = "Output Code (Digital)";
        let resValAdc = "--";
        
        if (adc.mode === 'ADC') {
          const code = Math.floor((inputVal / vref) * Math.pow(2, bits));
          resValAdc = code.toString();
        } else {
          resultLabel = "Output Voltage (Analog)";
          const vout = (inputVal / Math.pow(2, bits)) * vref;
          resValAdc = vout.toFixed(4) + " V";
        }

        return (
          <div className="space-y-6">
            <ToolSchematic type="ADC" />
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button onClick={() => setAdc({...adc, mode: 'ADC', val: '1.65'})} className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-xl transition-all ${adc.mode === 'ADC' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-400'}`}>ADC Mode</button>
              <button onClick={() => setAdc({...adc, mode: 'DAC', val: '2048'})} className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-xl transition-all ${adc.mode === 'DAC' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-400'}`}>DAC Mode</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">Resolution (Bits)</label><select value={adc.n} onChange={e => setAdc({...adc, n: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm">{[8, 10, 12, 14, 16, 24, 32].map(b => <option key={b}>{b}</option>)}</select></div>
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">Reference Vref (V)</label><input type="number" step="0.1" value={adc.vref} onChange={e => setAdc({...adc, vref: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
               <div className="col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">{adc.mode === 'ADC' ? 'Analog Input Vin (V)' : 'Digital Code (Decimal)'}</label><input type="number" value={adc.val} onChange={e => setAdc({...adc, val: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
            </div>
            <div className="bg-cyan-600 rounded-[2rem] p-10 text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                  <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">{resultLabel}</div>
                  <div className="text-4xl font-black">{resValAdc}</div>
                  <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-widest">
                      <div><span className="opacity-60 block mb-1">LSB Resolution</span><span>{lsbSize.toFixed(4)} mV</span></div>
                      <div><span className="opacity-60 block mb-1">Theo. SNR</span><span>{snr.toFixed(1)} dB</span></div>
                  </div>
               </div>
            </div>
          </div>
        );

      case 'UNIT':
        return (
          <div className="space-y-6">
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {['Unit', 'Code', 'Radix'].map(m => (
                <button key={m} onClick={() => setConv({...conv, mode: m as any})} className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-xl transition-all ${conv.mode === m ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400'}`}>{m}</button>
              ))}
            </div>

            {conv.mode === 'Unit' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Dimension Type</label>
                      <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
                        {Object.keys(UNIT_CONVERSION_DATA).map(type => (
                          <button key={type} onClick={() => setConv({...conv, unitType: type, from: Object.keys(UNIT_CONVERSION_DATA[type])[0], to: Object.keys(UNIT_CONVERSION_DATA[type])[1] || Object.keys(UNIT_CONVERSION_DATA[type])[0]})} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${conv.unitType === type ? 'bg-sky-50 text-sky-600 border border-sky-100' : 'bg-slate-50 text-slate-400 border border-transparent'}`}>{type}</button>
                        ))}
                      </div>
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                      <input type="number" value={conv.val} onChange={e => setConv({...conv, val: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" />
                      <div className="flex items-center space-x-4">
                         <select value={conv.from} onChange={e => setConv({...conv, from: e.target.value})} className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm uppercase">
                           {Object.keys(UNIT_CONVERSION_DATA[conv.unitType]).map(u => <option key={u}>{u}</option>)}
                         </select>
                         <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                         <select value={conv.to} onChange={e => setConv({...conv, to: e.target.value})} className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm uppercase">
                           {Object.keys(UNIT_CONVERSION_DATA[conv.unitType]).map(u => <option key={u}>{u}</option>)}
                         </select>
                      </div>
                   </div>
                </div>
                {(() => {
                  const val = parseFloat(conv.val) || 0;
                  const factorFrom = UNIT_CONVERSION_DATA[conv.unitType][conv.from];
                  const factorTo = UNIT_CONVERSION_DATA[conv.unitType][conv.to];
                  const result = (val * factorFrom) / factorTo;
                  return (
                    <div className="bg-sky-600 rounded-[2rem] p-10 text-white shadow-xl relative overflow-hidden">
                       <div className="relative z-10 text-center">
                          <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Converted Magnitude</div>
                          <div className="text-5xl font-black truncate">{result.toLocaleString(undefined, { maximumFractionDigits: 6 })} <span className="text-2xl opacity-60 ml-2">{conv.to}</span></div>
                       </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {conv.mode === 'Code' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 text-center">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">R/C Component Marking Decoder</h4>
                   <div className="flex justify-center">
                      <input 
                        type="text" 
                        maxLength={4}
                        value={conv.code} 
                        onChange={e => setConv({...conv, code: e.target.value})} 
                        className="w-48 text-center p-6 bg-slate-50 border-2 border-indigo-100 rounded-3xl outline-none font-black text-4xl tracking-[0.2em] text-indigo-600" 
                      />
                   </div>
                   <p className="text-[10px] text-slate-400 font-bold italic">e.g. 103 (10kΩ/10nF), 472 (4.7kΩ/4.7nF)</p>
                </div>
                {(() => {
                  const code = conv.code.trim();
                  let resultStr = "--";
                  if (/^\d{3,4}$/.test(code)) {
                    const digits = code.slice(0, -1);
                    const multiplier = parseInt(code.slice(-1));
                    const val = parseInt(digits) * Math.pow(10, multiplier);
                    if (val >= 1e6) resultStr = (val/1e6).toFixed(1) + " M";
                    else if (val >= 1e3) resultStr = (val/1e3).toFixed(1) + " k";
                    else resultStr = val.toString() + " ";
                  }
                  return (
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-900 rounded-[2rem] p-8 text-white text-center shadow-lg">
                          <span className="text-[9px] font-black uppercase opacity-40 block mb-2 tracking-widest">Resistance</span>
                          <div className="text-2xl font-black">{resultStr}Ω</div>
                       </div>
                       <div className="bg-indigo-600 rounded-[2rem] p-8 text-white text-center shadow-lg">
                          <span className="text-[9px] font-black uppercase opacity-40 block mb-2 tracking-widest">Capacitance</span>
                          <div className="text-2xl font-black">{resultStr}pF</div>
                       </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {conv.mode === 'Radix' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex space-x-2">
                       {['10', '16', '2'].map(base => (
                         <button key={base} onClick={() => setConv({...conv, radixBase: base})} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl border transition-all ${conv.radixBase === base ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-slate-400 border-slate-100'}`}>
                            {base === '10' ? 'Dec' : base === '16' ? 'Hex' : 'Bin'}
                         </button>
                       ))}
                    </div>
                    <input 
                      value={conv.radixIn} 
                      onChange={e => setConv({...conv, radixIn: e.target.value})} 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-2xl text-center uppercase" 
                      placeholder="Input Value"
                    />
                 </div>
                 {(() => {
                    let dec = parseInt(conv.radixIn, parseInt(conv.radixBase));
                    const isInvalid = isNaN(dec);
                    return (
                      <div className="space-y-3">
                         {[
                           { label: 'Decimal', val: isInvalid ? '--' : dec.toString(10), color: 'bg-slate-50 text-slate-600' },
                           { label: 'Hexadecimal', val: isInvalid ? '--' : '0x' + dec.toString(16).toUpperCase(), color: 'bg-indigo-50 text-indigo-600' },
                           { label: 'Binary', val: isInvalid ? '--' : dec.toString(2).padStart(8, '0'), color: 'bg-sky-50 text-sky-600' }
                         ].map(item => (
                           <div key={item.label} className={`${item.color} p-5 rounded-2xl flex justify-between items-center border border-slate-100/50 shadow-sm`}>
                              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                              <span className="text-sm font-black break-all ml-4">{item.val}</span>
                           </div>
                         ))}
                      </div>
                    );
                 })()}
              </div>
            )}
          </div>
        );

      case 'TRACE':
        const w = parseFloat(trace.w) || 0.1;
        const h = parseFloat(trace.h) || 0.1;
        const t = parseFloat(trace.t) || 0.035;
        const er = parseFloat(trace.er) || 4.4;
        const z0 = (87 / Math.sqrt(er + 1.41)) * Math.log(5.98 * h / (0.8 * w + t));
        return (
          <div className="space-y-6">
            <ToolSchematic type="TRACE" />
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">Width (mm)</label><input type="number" step="0.01" value={trace.w} onChange={e => setTrace({...trace, w: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
              <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">Height (mm)</label><input type="number" step="0.01" value={trace.h} onChange={e => setTrace({...trace, h: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
              <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">Thick (mm)</label><input type="number" step="0.001" value={trace.t} onChange={e => setTrace({...trace, t: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
              <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-widest">Diel. Constant</label><input type="number" step="0.1" value={trace.er} onChange={e => setTrace({...trace, er: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" /></div>
            </div>
            <div className="bg-teal-600 rounded-[2rem] p-10 text-white shadow-xl">
               <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Trace Impedance</div>
               <div className="text-5xl font-black">{!isNaN(z0) && z0 > 0 ? z0.toFixed(1) + ' Ω' : '--'}</div>
               <div className="mt-6 text-[10px] font-bold text-teal-100 italic opacity-80">IPC-2141 Microstrip Model</div>
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
                <button key={type} onClick={() => setIface({...iface, type: type as any})} className={`flex-1 min-w-[75px] py-2.5 text-[10px] font-black uppercase rounded-xl transition-all ${iface.type === type ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}>{type}</button>
              ))}
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-8">
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-5 rounded-2xl">
                     <span className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-widest">Pin Definitions</span>
                     <div className="text-xs font-black text-slate-800">{currentIf.pins.join(' / ')}</div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl">
                     <span className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-widest">Speed Support</span>
                     <div className="text-xs font-black text-slate-800">{currentIf.speed}</div>
                  </div>
               </div>
               <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl">
                  <span className="text-[10px] font-black text-rose-600 uppercase block mb-3 tracking-[0.2em]">FAE Design Best Practices</span>
                  <p className="text-xs font-medium text-rose-900 leading-relaxed italic">“{currentIf.tips}”</p>
               </div>
            </div>
          </div>
        );

      case 'PARAMS':
        const categoriesSensors: Record<string, any> = {
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
        const activeSensors = categoriesSensors[sensorCat];
        return (
          <div className="space-y-6">
            <ToolSchematic type="PARAMS" />
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {Object.keys(categoriesSensors).map(cat => (
                <button key={cat} onClick={() => setSensorCat(cat as any)} className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-xl transition-all ${sensorCat === cat ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400'}`}>{cat === 'Env' ? 'Environment' : cat}</button>
              ))}
            </div>
            <div className="space-y-4">
               {activeSensors.map((s: any, i: number) => (
                 <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-violet-300 transition-all">
                    <div className="flex justify-between items-start mb-4">
                       <h5 className="text-sm font-black text-slate-800 uppercase tracking-tight">{s.name}</h5>
                       <span className="text-[9px] bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full font-black border border-violet-100">{s.typical}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-[10px]">
                       <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><span className="text-slate-400 font-black uppercase tracking-widest block mb-1">Standard Range</span><p className="font-black text-slate-700">{s.range}</p></div>
                       <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><span className="text-slate-400 font-black uppercase tracking-widest block mb-1">{s.error ? 'Precision' : 'Key Specs'}</span><p className="font-black text-slate-700">{s.error || s.bits || s.accuracy || 'N/A'}</p></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );

      default:
        return <div className="py-24 text-center text-slate-300 font-bold italic tracking-widest uppercase text-xs">Engine Initializing...</div>;
    }
  };

  if (activeId) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-right duration-400 overflow-hidden text-slate-900">
        <header className="flex items-center px-6 py-8 border-b border-slate-100 bg-white sticky top-0 z-10 flex-none shadow-sm">
          <button onClick={() => setActiveId(null)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all active:scale-90 shadow-sm border border-slate-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="ml-5">
            <h2 className="text-sm font-black text-slate-800 uppercase leading-none mb-1.5 tracking-tight">{activeTool?.name}</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Engineering Engine</p>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 no-scrollbar pb-32">
           {renderActiveTool()}
        </main>
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
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-50/50 transition-all active:scale-[0.98] group relative overflow-hidden"
          >
            <div className={`w-14 h-14 rounded-2xl ${tool.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
              <span className="text-3xl">{tool.icon}</span>
            </div>
            <h4 className="text-[13px] font-black text-slate-800 mb-2 leading-none tracking-tight">{tool.name}</h4>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter truncate leading-tight opacity-80">{tool.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tools;
