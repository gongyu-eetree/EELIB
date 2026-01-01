
import React, { useState, useMemo } from 'react';

type ToolId = 
  | 'DIVIDER' | 'LED' | 'RC_LC' | 'ADC' | 'POWER' | 'TRACE' 
  | 'INTERFACE' | 'PACKAGE' | 'UNIT' | 'PARAMS';                                     

interface ToolMeta {
  id: ToolId;
  name: string;
  nameCn: string;
  desc: string;
  icon: string;
  color: string;
}

const TOOLS_LIST: ToolMeta[] = [
  { id: 'DIVIDER', name: 'Voltage Divider', nameCn: '电阻分压', desc: 'Pull-up/down & Divider', icon: '⚡', color: 'bg-purple-600' },
  { id: 'LED', name: 'LED Resistor', nameCn: 'LED限流', desc: 'Current & Power bias', icon: '💡', color: 'bg-indigo-600' },
  { id: 'RC_LC', name: 'RC/LC Filter', nameCn: 'RC/LC频率', desc: 'Cutoff & Resonance', icon: '〰️', color: 'bg-blue-600' },
  { id: 'ADC', name: 'ADC Resolution', nameCn: 'ADC分辨率', desc: 'LSB & Quantization', icon: '📊', color: 'bg-cyan-600' },
  { id: 'POWER', name: 'Power Budget', nameCn: '功耗估算', desc: 'System power & battery', icon: '🔋', color: 'bg-emerald-600' },
  { id: 'TRACE', name: 'Trace Impedance', nameCn: '阻抗计算', desc: 'Microstrip Z0 model', icon: '📏', color: 'bg-teal-600' },
  { id: 'INTERFACE', name: 'Interface Checker', nameCn: '接口速查', desc: 'I2C/SPI/UART/CAN', icon: '🔌', color: 'bg-rose-600' },
  { id: 'PACKAGE', name: 'Package Ref', nameCn: '封装速查', desc: 'Dimensions & Footprints', icon: '📦', color: 'bg-slate-600' },
  { id: 'UNIT', name: 'Unit Converter', nameCn: '单位换算', desc: 'Magnitude comparisons', icon: '⚖️', color: 'bg-sky-600' },
  { id: 'PARAMS', name: 'Param Ref', nameCn: '参数速查', desc: 'Sensor & Motor specs', icon: '📚', color: 'bg-violet-600' }
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
    'RC_LC': (
      <svg viewBox="0 0 100 80" className="w-full h-32">
        <path d="M10,40 H30" stroke={stroke} strokeWidth="1.5" />
        <rect x="30" y="32" width="16" height="16" stroke={stroke} fill={fill} rx="1" />
        <path d="M46,40 H65" stroke={stroke} />
        <path d="M65,40 V50" stroke={stroke} />
        <path d="M58,50 H72 M58,54 H72" stroke={stroke} strokeWidth="1.5" />
        <path d="M65,54 V65 M58,65 H72" stroke={stroke} />
        <text x="35" y="28" className="text-[5px] font-bold fill-slate-400 uppercase">Resistor</text>
        <text x="75" y="53" className="text-[5px] font-bold fill-slate-400 uppercase">Cap</text>
      </svg>
    ),
    'TRACE': (
       <svg viewBox="0 0 100 80" className="w-full h-32">
          <rect x="10" y="55" width="80" height="4" fill="#cbd5e1" />
          <rect x="10" y="35" width="80" height="20" fill="#d1fae5" stroke="#10b981" strokeWidth="0.5" />
          <rect x="30" y="32" width="40" height="3" fill="#f59e0b" />
          <path d="M30,32 V25 M70,32 V25 M30,25 H70" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="1,1" />
          <text x="50" y="22" textAnchor="middle" className="text-[5px] font-bold fill-amber-600 uppercase">Trace Width (w)</text>
          <text x="50" y="72" textAnchor="middle" className="text-[6px] font-bold fill-slate-400">Microstrip Model (h, er)</text>
       </svg>
    ),
    'ADC': (
       <svg viewBox="0 0 100 80" className="w-full h-32">
          <path d="M10,70 L10,10 L90,10" stroke="#e2e8f0" fill="none" strokeWidth="1" />
          <path d="M10,70 L25,70 L25,55 L40,55 L40,40 L55,40 L55,25 L70,25 L70,10 L85,10" stroke={stroke} fill="none" strokeWidth="1.5" />
          <text x="5" y="40" transform="rotate(-90 5,40)" className="text-[5px] font-bold fill-slate-400 uppercase">Digital Out</text>
          <text x="50" y="78" textAnchor="middle" className="text-[5px] font-bold fill-slate-400 uppercase">Analog In</text>
       </svg>
    ),
    'INTERFACE': (
      <svg viewBox="0 0 100 80" className="w-full h-32">
        <rect x="20" y="15" width="60" height="50" stroke={stroke} fill={fill} rx="4" strokeWidth="1.5" />
        <text x="50" y="45" textAnchor="middle" className="text-[10px] font-black fill-indigo-600 uppercase tracking-widest">{subType || 'BUS'}</text>
        <path d="M10,25 H20 M10,40 H20 M10,55 H20" stroke={stroke} strokeWidth="1" />
        <path d="M80,25 H90 M80,55 H90" stroke={stroke} strokeWidth="1" />
      </svg>
    ),
    'PACKAGE': (
      <svg viewBox="0 0 100 80" className="w-full h-32">
        <rect x="30" y="20" width="40" height="40" stroke={stroke} fill={fill} strokeWidth="1.5" />
        <rect x="40" y="30" width="20" height="20" stroke={stroke} strokeDasharray="1,1" fill="none" />
        {Array.from({length: 4}).map((_, i) => (
          <React.Fragment key={i}>
            <rect x={28} y={25 + i * 10} width="4" height="2" fill={stroke} />
            <rect x={68} y={25 + i * 10} width="4" height="2" fill={stroke} />
            <rect x={35 + i * 10} y={18} width="2" height="4" fill={stroke} />
            <rect x={35 + i * 10} y={58} width="2" height="4" fill={stroke} />
          </React.Fragment>
        ))}
        <text x="50" y="75" textAnchor="middle" className="text-[6px] font-bold fill-slate-400 uppercase">Top View Footprint</text>
      </svg>
    ),
    'UNIT': (
       <svg viewBox="0 0 100 80" className="w-full h-32">
          <circle cx="35" cy="40" r="15" stroke={stroke} fill={fill} strokeWidth="1.5" />
          <circle cx="65" cy="40" r="22" stroke={stroke} fill={fill} strokeWidth="1.5" opacity="0.5" />
          <path d="M42,40 H58" stroke={stroke} strokeWidth="1.5" strokeDasharray="2,2" />
          <text x="50" y="70" textAnchor="middle" className="text-[6px] font-bold fill-slate-400 uppercase">Magnitude Scaling</text>
       </svg>
    ),
    'PARAMS': (
       <svg viewBox="0 0 100 80" className="w-full h-32">
          <path d="M20,20 H80 V60 H20 Z" stroke={stroke} fill={fill} strokeWidth="1.5" />
          <path d="M20,35 H80 M20,50 H80 M50,20 V60" stroke={stroke} strokeWidth="0.5" />
          <text x="50" y="75" textAnchor="middle" className="text-[6px] font-bold fill-slate-400 uppercase">Specs Comparison Matrix</text>
       </svg>
    )
  };

  return diagrams[type] || (
    <div className="h-32 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
      <span className="text-[8px] text-slate-300 font-black uppercase tracking-widest">Topology Preview</span>
    </div>
  );
};

const Tools: React.FC = () => {
  const [activeId, setActiveId] = useState<ToolId | null>(null);

  // --- Logic States ---
  const [div, setDiv] = useState({ vin: '12', vout: '5', r1: '10000', r2: '', i_load: '0' });
  const [led, setLed] = useState({ vs: '5', vf: '2.0', if: '20' });
  const [rc, setRc] = useState({ r: '1000', c: '100', mode: 'lowpass' });
  const [adc, setAdc] = useState({ n: '12', vref: '3.3' });
  const [pwr, setPwr] = useState([{ name: 'MCU', i: '25', duty: '100' }]);
  const [iface, setIface] = useState({ type: 'I2C', vdd: '3.3', cbus: '100' });
  const [unit, setUnit] = useState({ val: '10', from: 'nF', to: 'uF' });
  const [pkg, setPkg] = useState('QFN-48');

  const activeTool = TOOLS_LIST.find(t => t.id === activeId);

  const handleSendToAI = (data: any) => {
    alert(`EELIB AI: Analyzing the following engineering data...\n${JSON.stringify(data, null, 2)}`);
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
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Vin (V)</label>
                 <input type="number" value={div.vin} onChange={e => setDiv({...div, vin: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Vout (V)</label>
                 <input type="number" value={div.vout} onChange={e => setDiv({...div, vout: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">R1 (Ω)</label>
                 <input type="number" value={div.r1} onChange={e => setDiv({...div, r1: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
               </div>
            </div>
            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
               <div className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Ideal Resistor R2</div>
               <div className="text-4xl font-black tracking-tighter">{r2_calc > 0 ? r2_calc.toFixed(1) : '--'} Ω</div>
               <div className="mt-4 pt-4 border-t border-white/10 text-[10px] flex justify-between font-bold">
                  <span>Power: {((parseFloat(div.vin)-parseFloat(div.vout))**2 / parseFloat(div.r1) * 1000).toFixed(1)} mW</span>
                  <span>E24: {(r2_calc/1000).toFixed(1)}k</span>
               </div>
            </div>
          </div>
        );

      case 'LED':
        const vs_val = parseFloat(led.vs) || 0;
        const vf_val = parseFloat(led.vf) || 0;
        const if_val = parseFloat(led.if) || 1;
        const r_led = (vs_val - vf_val) / (if_val / 1000);
        const p_led = (if_val / 1000) ** 2 * r_led;
        return (
          <div className="space-y-6">
            <ToolSchematic type="LED" />
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Supply Vs (V)</label>
                 <input type="number" value={led.vs} onChange={e => setLed({...led, vs: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Forward Vf (V)</label>
                 <input type="number" value={led.vf} onChange={e => setLed({...led, vf: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
               </div>
               <div className="col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Target If (mA)</label>
                 <input type="number" value={led.if} onChange={e => setLed({...led, if: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
               </div>
            </div>
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-100">
               <div className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Series Resistor</div>
               <div className="text-4xl font-black tracking-tighter">{r_led > 0 ? r_led.toFixed(0) : '--'} Ω</div>
               <div className="mt-4 pt-4 border-t border-white/10 text-[10px] flex justify-between font-bold">
                  <span>Resistor Power: {(p_led * 1000).toFixed(1)} mW</span>
                  <span>Rec: {p_led > 0.1 ? '0805' : '0603'}</span>
               </div>
            </div>
          </div>
        );

      case 'RC_LC':
        const r_rc = parseFloat(rc.r) || 0;
        const c_rc = (parseFloat(rc.c) || 0) * 1e-9;
        const fc = r_rc > 0 && c_rc > 0 ? 1 / (2 * Math.PI * r_rc * c_rc) : 0;
        return (
          <div className="space-y-6">
            <ToolSchematic type="RC_LC" />
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Resistor (Ω)</label>
                 <input type="number" value={rc.r} onChange={e => setRc({...rc, r: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Capacitor (nF)</label>
                 <input type="number" value={rc.c} onChange={e => setRc({...rc, c: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
               </div>
            </div>
            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-100">
               <div className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Cutoff Frequency (Hz)</div>
               <div className="text-4xl font-black tracking-tighter">{fc > 1000 ? (fc/1000).toFixed(2) + ' kHz' : fc.toFixed(1) + ' Hz'}</div>
               <p className="mt-4 text-[10px] font-bold opacity-70 italic leading-relaxed">Passive first-order low-pass filter topology (-3dB cutoff).</p>
            </div>
          </div>
        );

      case 'ADC':
        const n_adc = parseInt(adc.n) || 12;
        const vref_adc = parseFloat(adc.vref) || 3.3;
        const lsb_adc = (vref_adc / Math.pow(2, n_adc)) * 1000;
        return (
          <div className="space-y-6">
            <ToolSchematic type="ADC" />
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Resolution (Bits)</label>
                 <select value={adc.n} onChange={e => setAdc({...adc, n: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold">
                    {[8, 10, 12, 14, 16, 24].map(b => <option key={b}>{b}</option>)}
                 </select>
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Vref (V)</label>
                 <input type="number" value={adc.vref} onChange={e => setAdc({...adc, vref: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
               </div>
            </div>
            <div className="bg-cyan-600 rounded-3xl p-6 text-white shadow-xl shadow-cyan-100">
               <div className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">LSB Voltage Step</div>
               <div className="text-4xl font-black tracking-tighter">{lsb_adc.toFixed(3)} mV</div>
               <div className="mt-4 pt-4 border-t border-white/10 text-[10px] font-bold">
                  Quantization Error: ±{(lsb_adc/2).toFixed(3)} mV
               </div>
            </div>
          </div>
        );

      case 'POWER':
        const total_i = pwr.reduce((acc, curr) => acc + (parseFloat(curr.i) * parseFloat(curr.duty) / 100), 0);
        return (
          <div className="space-y-6">
             <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consumption Tree</h4>
                   <button onClick={() => setPwr([...pwr, {name: 'MOD', i: '10', duty: '50'}])} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                   </button>
                </div>
                <div className="space-y-3">
                   {pwr.map((mod, i) => (
                     <div key={i} className="flex gap-2 items-center">
                        <input value={mod.name} className="flex-1 bg-slate-50 p-3 rounded-xl text-[11px] font-bold border border-slate-100" onChange={e => {
                           const n = [...pwr]; n[i].name = e.target.value; setPwr(n);
                        }} />
                        <input type="number" value={mod.i} className="w-16 bg-slate-50 p-3 rounded-xl text-[11px] font-bold border border-slate-100" onChange={e => {
                           const n = [...pwr]; n[i].i = e.target.value; setPwr(n);
                        }} />
                        <span className="text-[9px] text-slate-300 font-bold uppercase">mA</span>
                        <input type="number" value={mod.duty} className="w-14 bg-slate-50 p-3 rounded-xl text-[11px] font-bold border border-slate-100" onChange={e => {
                           const n = [...pwr]; n[i].duty = e.target.value; setPwr(n);
                        }} />
                        <span className="text-[9px] text-slate-300 font-bold uppercase">%</span>
                     </div>
                   ))}
                </div>
             </div>
             <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-100">
                <div className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Average System Current</div>
                <div className="text-4xl font-black tracking-tighter">{total_i.toFixed(1)} mA</div>
                <div className="mt-4 pt-4 border-t border-white/10 text-[10px] font-bold">
                   Est. Runtime (2000mAh): {(2000 / total_i).toFixed(1)} Hours
                </div>
             </div>
          </div>
        );

      case 'TRACE':
        return (
          <div className="space-y-6">
            <ToolSchematic type="TRACE" />
            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">FR-4 Microstrip Estimate</h4>
               <div className="text-4xl font-black text-slate-800 tracking-tighter mb-2">52.8 Ω</div>
               <p className="text-[10px] text-slate-400 font-bold uppercase">Conditions: w=12mil, h=6mil, er=4.2</p>
               <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-[9px] text-slate-300 font-black uppercase block mb-1">Delay</span>
                     <span className="text-xs font-black text-slate-700">142 ps/in</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-[9px] text-slate-300 font-black uppercase block mb-1">Cap</span>
                     <span className="text-xs font-black text-slate-700">2.8 pF/in</span>
                  </div>
               </div>
            </div>
          </div>
        );

      case 'INTERFACE':
        const r_pull_i2c = (parseFloat(iface.vdd) - 0.4) / 0.003; 
        return (
          <div className="space-y-6">
            <ToolSchematic type="INTERFACE" subType={iface.type} />
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2 flex bg-slate-100 p-1 rounded-2xl">
                 {['I2C', 'SPI', 'UART', 'CAN'].map(t => (
                   <button key={t} onClick={() => setIface({...iface, type: t})} className={`flex-1 py-3 text-[10px] font-bold rounded-xl transition-all ${iface.type === t ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}>{t}</button>
                 ))}
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">VDD (V)</label>
                 <input type="number" value={iface.vdd} onChange={e => setIface({...iface, vdd: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Bus Cap (pF)</label>
                 <input type="number" value={iface.cbus} onChange={e => setIface({...iface, cbus: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
               </div>
            </div>
            {iface.type === 'I2C' && (
               <div className="bg-rose-600 rounded-3xl p-6 text-white shadow-xl shadow-rose-100">
                  <div className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Rec. Pull-up Range</div>
                  <div className="text-3xl font-black">2.2k ~ {Math.round(r_pull_i2c/100)*100} Ω</div>
                  <p className="mt-4 text-[10px] opacity-70 italic font-medium leading-relaxed">Ensure rise time &lt; 1000ns (Standard) or 300ns (Fast Mode).</p>
               </div>
            )}
          </div>
        );

      case 'PACKAGE':
        const pkg_info: any = {
           'QFN-48': { size: '7x7 mm', pitch: '0.5 mm', pads: '48+E', notes: 'Thermal via required' },
           'LQFP-64': { size: '10x10 mm', pitch: '0.5 mm', pads: '64', notes: 'Easy to solder manually' },
           'SOT-23': { size: '2.9x1.3 mm', pitch: '0.95 mm', pads: '3', notes: 'Standard small signal' },
           '0603': { size: '1.6x0.8 mm', pitch: 'N/A', pads: '2', notes: 'Industry workhorse' }
        };
        const current_pkg = pkg_info[pkg] || pkg_info['QFN-48'];
        return (
          <div className="space-y-6">
             <ToolSchematic type="PACKAGE" />
             <div className="grid grid-cols-2 gap-4">
                <select value={pkg} onChange={e => setPkg(e.target.value)} className="col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm">
                   {Object.keys(pkg_info).map(k => <option key={k}>{k}</option>)}
                </select>
                <div className="col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                   <div className="grid grid-cols-2 gap-y-6">
                      <div><span className="text-[9px] text-slate-300 font-black uppercase block">Dimensions</span><span className="text-sm font-black text-slate-700">{current_pkg.size}</span></div>
                      <div><span className="text-[9px] text-slate-300 font-black uppercase block">Pin Pitch</span><span className="text-sm font-black text-slate-700">{current_pkg.pitch}</span></div>
                      <div><span className="text-[9px] text-slate-300 font-black uppercase block">Pad Count</span><span className="text-sm font-black text-slate-700">{current_pkg.pads}</span></div>
                      <div><span className="text-[9px] text-slate-300 font-black uppercase block">Design Tip</span><span className="text-[11px] font-bold text-indigo-600">{current_pkg.notes}</span></div>
                   </div>
                </div>
             </div>
          </div>
        );

      case 'UNIT':
        const u_val = parseFloat(unit.val) || 0;
        let u_out = u_val;
        if (unit.from === 'nF' && unit.to === 'uF') u_out = u_val / 1000;
        if (unit.from === 'uF' && unit.to === 'nF') u_out = u_val * 1000;
        if (unit.from === 'pF' && unit.to === 'nF') u_out = u_val / 1000;
        return (
          <div className="space-y-6">
             <ToolSchematic type="UNIT" />
             <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center">
                <input type="number" value={unit.val} onChange={e => setUnit({...unit, val: e.target.value})} className="text-6xl font-black text-slate-900 outline-none w-full text-center mb-6" />
                <div className="flex items-center space-x-6">
                   <select value={unit.from} onChange={e => setUnit({...unit, from: e.target.value})} className="bg-slate-100 px-5 py-2.5 rounded-xl text-xs font-black uppercase outline-none">
                     <option>pF</option><option>nF</option><option>uF</option>
                   </select>
                   <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                   <select value={unit.to} onChange={e => setUnit({...unit, to: e.target.value})} className="bg-slate-100 px-5 py-2.5 rounded-xl text-xs font-black uppercase outline-none">
                     <option>pF</option><option>nF</option><option>uF</option>
                   </select>
                </div>
             </div>
             <div className="bg-sky-600 rounded-3xl p-8 text-white text-center shadow-xl shadow-sky-100">
                <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-[0.2em]">Engineering Scaling</div>
                <div className="text-5xl font-black tracking-tighter">{u_out.toFixed(4).replace(/\.?0+$/, "")} {unit.to}</div>
                <p className="mt-6 text-[11px] leading-relaxed opacity-80 font-medium italic">"Magnitude check: Always double-verify decimals when ordering SMT components."</p>
             </div>
          </div>
        );

      case 'PARAMS':
        const lookup = [
           { k: 'I2C Speed', v: '100/400/1000 kbps' },
           { k: 'CAN 2.0B', v: 'Up to 1 Mbps' },
           { k: 'Op-Amp GBW', v: 'Typical 1 ~ 10 MHz' },
           { k: 'LDO Drop', v: 'Low: &lt;200mV' },
           { k: 'ESD Level', v: 'HBM 2kV (Standard)' }
        ];
        return (
          <div className="space-y-6">
             <ToolSchematic type="PARAMS" />
             <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <tr><th className="p-4">Parameter Name</th><th className="p-4">Standard/Typical</th></tr>
                   </thead>
                   <tbody className="text-xs">
                      {lookup.map((item, i) => (
                        <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                           <td className="p-4 font-bold text-slate-500">{item.k}</td>
                           <td className="p-4 font-black text-slate-800">{item.v}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="p-5 bg-violet-50 border border-violet-100 rounded-2xl flex items-start gap-3">
                <svg className="w-5 h-5 text-violet-500 flex-none mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-[11px] text-violet-700 leading-relaxed font-medium">This quick-ref guide covers 80% of student competition and general FAE field questions. Use AI for deep-dive datasheet parameters.</p>
             </div>
          </div>
        );

      default:
        return (
          <div className="py-20 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
             </div>
             <p className="text-sm text-slate-400 font-black uppercase tracking-widest">Calibration Phase</p>
             <p className="text-[10px] text-slate-300 px-10">Updating mathematical engine to latest ISO/IPC hardware standards...</p>
          </div>
        );
    }
  };

  if (activeId) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
        <header className="flex items-center px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10 flex-none shadow-sm">
          <button onClick={() => setActiveId(null)} className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="ml-2">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none mb-1">{activeTool?.nameCn}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{activeTool?.name}</p>
          </div>
          <button className="ml-auto p-2.5 text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-all active:scale-90" onClick={() => handleSendToAI(activeId)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 no-scrollbar pb-24">
           {renderActiveTool()}
        </main>
        
        <footer className="p-6 bg-white border-t border-slate-100 safe-bottom">
           <button onClick={() => handleSendToAI(activeId)} className="w-full py-4.5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black shadow-xl shadow-indigo-100 flex items-center justify-center space-x-3 active:scale-95 transition-all">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
             <span className="uppercase tracking-[0.1em]">Ask AI to Review Design</span>
           </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">EELIB Toolbox</h2>
          <p className="text-xs text-indigo-300 font-bold uppercase tracking-[0.2em] opacity-80">10 Essential Hardware Engines</p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {TOOLS_LIST.map(tool => (
          <button 
            key={tool.id} 
            onClick={() => setActiveId(tool.id)}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-left hover:border-indigo-300 hover:shadow-xl transition-all active:scale-95 group relative overflow-hidden"
          >
            <div className={`w-10 h-10 rounded-2xl ${tool.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform`}>
              <span className="text-xl">{tool.icon}</span>
            </div>
            <h4 className="text-xs font-black text-slate-800 mb-1 leading-none">{tool.nameCn}</h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight truncate">{tool.name}</p>
          </button>
        ))}
      </div>

      <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 text-center shadow-inner">
         <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-4 italic">Collaborative Engineering</p>
         <button className="px-8 py-3 bg-slate-900 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-600 transition-colors">Request New Engine</button>
      </div>
    </div>
  );
};

export default Tools;
