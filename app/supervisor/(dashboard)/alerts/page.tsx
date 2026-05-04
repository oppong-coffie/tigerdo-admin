"use client";

import React from 'react';
import { AlertCircle, ShieldAlert, CheckCircle2, Navigation, MessageSquare, AlertTriangle, Clock } from 'lucide-react';

const alertItems = [
  { id: 1, type: 'Critical', title: 'Panic Signal Triggered', personnel: 'Robert Wilson', location: 'Gate 4', time: '2 mins ago', details: 'Immediate tactical support requested. Officer reported suspicious perimeter breach.' },
  { id: 2, type: 'Warning', title: 'Missed Checkpoint', personnel: 'Alice Johnson', location: 'Main Lobby', time: '14 mins ago', details: 'NFC scan overdue for Scheduled Rotation 4. Attempting radio contact.' },
  { id: 3, type: 'Info', title: 'Unauthorized Entry', personnel: 'Automated System', location: 'Sector Alpha - Backlot', time: '45 mins ago', details: 'Motion sensor triggered in restricted area. Verify with on-duty personnel.' },
];

export default function SupervisorAlertsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">SECTOR <span className="text-red-600">ALERTS</span></h1>
          <p className="text-gray-500 font-medium tracking-tight">Active incident feed for Sector Alpha operations.</p>
        </div>
        <div className="bg-[#121212] border border-red-900/10 px-4 py-2 rounded-xl flex items-center gap-3">
           <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
           <span className="text-[10px] font-black uppercase text-red-500 tracking-[0.2em]">Live Monitoring</span>
        </div>
      </div>

      <div className="space-y-6">
        {alertItems.map((alert) => (
          <div key={alert.id} className={`bg-[#121212] border rounded-[2.5rem] overflow-hidden transition-all hover:scale-[1.01] shadow-2xl ${
            alert.type === 'Critical' ? 'border-red-600 shadow-red-600/10' : 'border-red-900/10 shadow-black'
          }`}>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    alert.type === 'Critical' ? 'bg-red-600 text-white' : alert.type === 'Warning' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                  }`}>
                    {alert.type === 'Critical' ? <ShieldAlert size={32} /> : <AlertTriangle size={32} />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                      {alert.title}
                      {alert.type === 'Critical' && <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded text-white font-black tracking-widest animate-pulse italic-none">PRIORITY 1</span>}
                    </h3>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                      <Clock size={12} className="text-red-600" /> {alert.time} • {alert.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Assigned Personnel</p>
                   <p className="text-white font-bold tracking-tight uppercase italic">{alert.personnel}</p>
                </div>
              </div>

              <div className="bg-black/40 border border-white/5 p-6 rounded-2xl mb-8">
                <p className="text-gray-300 italic leading-relaxed">"{alert.details}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button className="flex items-center justify-center gap-2 py-4 bg-red-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                    <Navigation size={18} /> Deploy Backup
                 </button>
                 <button className="flex items-center justify-center gap-2 py-4 bg-[#0a0a0a] border border-red-900/30 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-red-950/30 transition-all">
                    <MessageSquare size={18} /> Dispatch Comms
                 </button>
                 <button className="flex items-center justify-center gap-2 py-4 bg-green-950/20 border border-green-900/30 text-green-500 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-green-600 hover:text-white transition-all">
                    <CheckCircle2 size={18} /> Resolve Incident
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
