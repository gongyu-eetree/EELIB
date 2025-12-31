
import React, { useState } from 'react';

const BOMManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [projects] = useState([
    { id: 'P001', name: 'IoT Gateway V2.0', items: 45, status: 'Purchasing', date: '2023-10-24', cost: '$1,850' },
    { id: 'P002', name: 'Industrial Temp Controller', items: 28, status: 'Pending', date: '2023-10-22', cost: '$540' },
    { id: 'P003', name: 'BLE Tracker Mass Prod', items: 12, status: 'Done', date: '2023-10-15', cost: '$120' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center text-sm font-medium text-slate-500"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md">
          + New Project
        </button>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-lg font-bold">BOM Dashboard</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-xl font-bold">12</div>
            <div className="text-[10px] opacity-80">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">$12k</div>
            <div className="text-[10px] opacity-80">Est. Cost</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">98%</div>
            <div className="text-[10px] opacity-80">Part Match</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-800">Projects</h3>
          <span className="text-xs text-indigo-600 font-medium">Filter</span>
        </div>

        {projects.map(proj => (
          <div key={proj.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{proj.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">ID: {proj.id} | Created: {proj.date}</p>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                proj.status === 'Purchasing' ? 'bg-amber-50 text-amber-600' : 
                proj.status === 'Pending' ? 'bg-indigo-50 text-indigo-600' : 
                'bg-emerald-50 text-emerald-600'
              }`}>
                {proj.status}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
              <div className="flex space-x-4">
                <div className="text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700">{proj.items}</span> items
                </div>
                <div className="text-[11px] text-slate-500">
                  Est: <span className="font-bold text-slate-700">{proj.cost}</span>
                </div>
              </div>
              <button className="text-[11px] text-indigo-600 font-bold flex items-center">
                Details
                <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center py-8">
        <svg className="w-10 h-10 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        <span className="text-xs text-slate-400">Import BOM (Excel/CSV)</span>
      </div>
    </div>
  );
};

export default BOMManagement;
