
import React, { useState } from 'react';

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
  { id: 'DIVIDER', name: 'Voltage Divider', nameCn: '电阻分压', desc: '上下拉与分压计算', icon: '⚡', color: 'bg-purple-600' },
  { id: 'LED', name: 'LED Resistor', nameCn: 'LED限流', desc: '电流与功耗偏置', icon: '💡', color: 'bg-indigo-600' },
  { id: 'RC_LC', name: 'RC/LC Filter', nameCn: 'RC/LC频率', desc: '截止频率与谐振', icon: '〰️', color: 'bg-blue-600' },
  { id: 'ADC', name: 'ADC Resolution', nameCn: 'ADC分辨率', desc: 'LSB与量化误差', icon: '📊', color: 'bg-cyan-600' },
  { id: 'POWER', name: 'Power Budget', nameCn: '功耗估算', desc: '系统功耗与续航', icon: '🔋', color: 'bg-emerald-600' },
  { id: 'TRACE', name: 'Trace Impedance', nameCn: '阻抗计算', desc: '微带线 Z0 模型', icon: '📏', color: 'bg-teal-600' },
  { id: 'INTERFACE', name: 'Interface Checker', nameCn: '接口速查', desc: 'I2C/SPI/UART/CAN', icon: '🔌', color: 'bg-rose-600' },
  { id: 'PACKAGE', name: 'Package Ref', nameCn: '封装速查', desc: '尺寸与焊盘参考', icon: '📦', color: 'bg-slate-600' },
  { id: 'UNIT', name: 'Unit Converter', nameCn: '单位换算', desc: '工程量级转换', icon: '⚖️', color: 'bg-sky-600' },
  { id: 'PARAMS', name: 'Param Ref', nameCn: '参数速查', desc: '常见传感器与标准', icon: '📚', color: 'bg-violet-600' }
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
      </svg>
    ),
    'TRACE': (
       <svg viewBox="0 0 100 80" className="w-full h-32">
          <rect x="10" y="55" width="80" height="4" fill="#cbd5e1" />
          <rect x="10" y="35" width="80" height="20" fill="#d1fae5" stroke="#10b981" strokeWidth="0.5" />
          <rect x="30" y="32" width="40" height="3" fill="#f59e0b" />
          <text x="50" y="72" textAnchor="middle" className="text-[6px] font-bold fill-slate-400">微带线模型</text>
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
    alert(`EELIB AI 正在分析工程数据...\n${JSON.stringify(data, null, 2)}`);
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
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">输入电压 Vin (V)</label>
                 <input type="number" value={div.vin} onChange={e => setDiv({...div, vin: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">目标电压 Vout (V)</label>
                 <input type="number" value={div.vout} onChange={e => setDiv({...div, vout: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">R1 电阻 (Ω)</label>
                 <input type="number" value={div.r1} onChange={e => setDiv({...div, r1: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
               </div>
            </div>
            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl">
               <div className="text-[10px] font-black uppercase opacity-60 mb-1">计算所得 R2</div>
               <div className="text-4xl font-black">{r2_calc > 0 ? r2_calc.toFixed(1) : '--'} Ω</div>
               <div className="mt-4 pt-4 border-t border-white/10 text-[10px] flex justify-between font-bold">
                  <span>R1 功耗: {((parseFloat(div.vin)-parseFloat(div.vout))**2 / parseFloat(div.r1) * 1000).toFixed(1)} mW</span>
                  <span>E24标准: {(r2_calc/1000).toFixed(1)}k</span>
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
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">电源 Vs (V)</label><input type="number" value={led.vs} onChange={e => setLed({...led, vs: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" /></div>
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">正向 Vf (V)</label><input type="number" value={led.vf} onChange={e => setLed({...led, vf: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" /></div>
               <div className="col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">目标电流 If (mA)</label><input type="number" value={led.if} onChange={e => setLed({...led, if: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" /></div>
            </div>
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
               <div className="text-[10px] font-black uppercase opacity-60 mb-1">限流电阻</div>
               <div className="text-4xl font-black">{r_led > 0 ? r_led.toFixed(0) : '--'} Ω</div>
            </div>
          </div>
        );

      case 'RC_LC':
        const fc = 1 / (2 * Math.PI * parseFloat(rc.r) * (parseFloat(rc.c) * 1e-9));
        return (
          <div className="space-y-6">
             <ToolSchematic type="RC_LC" />
             <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">电阻 (Ω)</label><input type="number" value={rc.r} onChange={e => setRc({...rc, r: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" /></div>
                <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">电容 (nF)</label><input type="number" value={rc.c} onChange={e => setRc({...rc, c: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" /></div>
             </div>
             <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl">
                <div className="text-[10px] font-black uppercase opacity-60 mb-1">截止频率 (-3dB)</div>
                <div className="text-4xl font-black">{fc > 1000 ? (fc/1000).toFixed(2) + ' kHz' : fc.toFixed(1) + ' Hz'}</div>
             </div>
          </div>
        );

      case 'ADC':
        const lsb = (parseFloat(adc.vref) / Math.pow(2, parseInt(adc.n))) * 1000;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">分辨率 (Bits)</label><select value={adc.n} onChange={e => setAdc({...adc, n: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold">
                  {[8, 10, 12, 14, 16, 24].map(b => <option key={b}>{b}</option>)}
               </select></div>
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">基准电压 Vref (V)</label><input type="number" value={adc.vref} onChange={e => setAdc({...adc, vref: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" /></div>
            </div>
            <div className="bg-cyan-600 rounded-3xl p-6 text-white shadow-xl">
               <div className="text-[10px] font-black uppercase opacity-60 mb-1">最小分度 LSB</div>
               <div className="text-4xl font-black">{lsb.toFixed(3)} mV</div>
            </div>
          </div>
        );

      case 'POWER':
        const total_i = pwr.reduce((acc, curr) => acc + (parseFloat(curr.i) * parseFloat(curr.duty) / 100), 0);
        return (
          <div className="space-y-6">
             <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4">模块功耗树</h4>
                <div className="space-y-3">
                   {pwr.map((mod, i) => (
                     <div key={i} className="flex gap-2 items-center">
                        <input value={mod.name} className="flex-1 bg-slate-50 p-2 rounded-xl text-xs font-bold" onChange={e => {const n = [...pwr]; n[i].name = e.target.value; setPwr(n);}} />
                        <input type="number" value={mod.i} className="w-12 bg-slate-50 p-2 rounded-xl text-xs font-bold" onChange={e => {const n = [...pwr]; n[i].i = e.target.value; setPwr(n);}} />
                        <span className="text-[9px] text-slate-300">mA</span>
                        <input type="number" value={mod.duty} className="w-10 bg-slate-50 p-2 rounded-xl text-xs font-bold" onChange={e => {const n = [...pwr]; n[i].duty = e.target.value; setPwr(n);}} />
                        <span className="text-[9px] text-slate-300">%</span>
                     </div>
                   ))}
                   <button onClick={() => setPwr([...pwr, {name: '模块', i: '10', duty: '100'}])} className="w-full py-2 bg-slate-50 text-indigo-600 rounded-xl text-[10px] font-bold">+ 添加模块</button>
                </div>
             </div>
             <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl">
                <div className="text-[10px] font-black uppercase opacity-60 mb-1">系统平均电流</div>
                <div className="text-4xl font-black">{total_i.toFixed(1)} mA</div>
             </div>
          </div>
        );

      case 'INTERFACE':
        return (
          <div className="space-y-6">
            <ToolSchematic type="INTERFACE" subType={iface.type} />
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2 flex bg-slate-100 p-1 rounded-2xl">
                 {['I2C', 'SPI', 'UART', 'CAN'].map(t => (
                   <button key={t} onClick={() => setIface({...iface, type: t})} className={`flex-1 py-3 text-[10px] font-bold rounded-xl ${iface.type === t ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}>{t}</button>
                 ))}
               </div>
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">VDD (V)</label><input type="number" value={iface.vdd} onChange={e => setIface({...iface, vdd: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" /></div>
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">总线电容 (pF)</label><input type="number" value={iface.cbus} onChange={e => setIface({...iface, cbus: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" /></div>
            </div>
            {iface.type === 'I2C' && (
               <div className="bg-rose-600 rounded-3xl p-6 text-white shadow-xl">
                  <div className="text-[10px] font-black uppercase opacity-60 mb-1">建议上拉电阻</div>
                  <div className="text-3xl font-black">2.2k ~ 10k Ω</div>
               </div>
            )}
          </div>
        );

      case 'UNIT':
        let u_out = parseFloat(unit.val) || 0;
        if (unit.from === 'nF' && unit.to === 'uF') u_out /= 1000;
        if (unit.from === 'uF' && unit.to === 'nF') u_out *= 1000;
        return (
          <div className="space-y-6">
             <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center">
                <input type="number" value={unit.val} onChange={e => setUnit({...unit, val: e.target.value})} className="text-6xl font-black text-slate-900 outline-none w-full text-center mb-6" />
                <div className="flex items-center space-x-6">
                   <select value={unit.from} onChange={e => setUnit({...unit, from: e.target.value})} className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-black uppercase"><option>pF</option><option>nF</option><option>uF</option></select>
                   <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth={2} /></svg>
                   <select value={unit.to} onChange={e => setUnit({...unit, to: e.target.value})} className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-black uppercase"><option>pF</option><option>nF</option><option>uF</option></select>
                </div>
             </div>
             <div className="bg-sky-600 rounded-3xl p-8 text-white text-center shadow-xl">
                <div className="text-4xl font-black">{u_out} {unit.to}</div>
             </div>
          </div>
        );

      case 'PARAMS':
        const lookup = [{ k: 'I2C 速率', v: '100/400/1000 kbps' }, { k: 'CAN 2.0B', v: '最高 1 Mbps' }, { k: 'LDO 压差', v: '典型 &lt;200mV' }];
        return (
          <div className="space-y-6">
             <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <tr><th className="p-4">参数名称</th><th className="p-4">典型值</th></tr>
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
          </div>
        );

      default:
        return <div className="py-20 text-center text-slate-400">工具详情即将更新...</div>;
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
            <h2 className="text-sm font-black text-slate-800 uppercase leading-none mb-1">{activeTool?.nameCn}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase">{activeTool?.name}</p>
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
             <span className="uppercase tracking-[0.1em]">邀请 AI 审阅设计</span>
           </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">EELIB 工具箱</h2>
          <p className="text-xs text-indigo-300 font-bold uppercase tracking-[0.2em] opacity-80">10 个核心硬件工程引擎</p>
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
    </div>
  );
};

export default Tools;
