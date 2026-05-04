"use client";

import React from 'react';
import { Users, Shield, AlertTriangle, TrendingUp, MapPin, CheckCircle2, Clock, MoreVertical, ChevronRight } from 'lucide-react';

const SectorStat = ({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) => (
  <div className="bg-[#121212] border border-red-900/10 p-6 rounded-[2rem] hover:border-red-600/30 transition-all group">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">{label}</p>
    <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
  </div>
);

export default function SupervisorDashboard() {
  const activeGuards = [
    { id: 1, name: 'Robert Wilson', location: 'Gate 4', status: 'Mobile', time: '2h 14m' },
    { id: 2, name: 'Alice Johnson', location: 'Main Lobby', status: 'Stationary', time: '4h 05m' },
    { id: 3, name: 'David Smith', location: 'Zone C', status: 'Active', time: '1h 50m' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sector Header */}
      <div className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-2 text-red-600 mb-2">
              <MapPin size={16} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Sector Alpha</span>
           </div>
           <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">OPERATIONAL <span className="text-red-600">HUB</span></h1>
        </div>
        <div className="bg-red-950/20 border border-red-900/30 px-6 py-3 rounded-2xl flex items-center gap-4">
           <div className="flex flex-col text-right">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">System Status</span>
              <span className="text-green-500 font-black text-xs tracking-tight uppercase">ALL SECURE</span>
           </div>
           <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SectorStat label="Total Personnel" value="18" icon={Users} color="red" />
        <SectorStat label="On-Post" value="12" icon={Shield} color="red" />
        <SectorStat label="Alerts (24h)" value="04" icon={AlertTriangle} color="red" />
        <SectorStat label="Efficiency" value="98%" icon={TrendingUp} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Guards List */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Sector Personnel</h2>
              <button className="text-xs font-bold text-red-600 hover:underline uppercase tracking-widest">Manage All</button>
           </div>
           <div className="grid gap-4">
              {activeGuards.map((guard) => (
                <div key={guard.id} className="bg-[#121212] border border-red-900/10 p-5 rounded-3xl flex items-center justify-between hover:bg-white/5 transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-950/30 flex items-center justify-center text-red-500 font-bold text-lg">
                         {guard.name.charAt(0)}
                      </div>
                      <div>
                         <p className="font-bold text-white text-lg tracking-tight group-hover:text-red-500 transition-colors uppercase italic">{guard.name}</p>
                         <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                            <span className="flex items-center gap-1"><MapPin size={12} className="text-red-600" /> {guard.location}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {guard.time}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                        {guard.status}
                      </span>
                      <ChevronRight size={20} className="text-gray-700 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Live Incident Log */}
        <div className="space-y-6">
           <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Incident Log</h2>
           <div className="bg-[#0a0a0a] border border-red-900/20 rounded-[2.5rem] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-3xl rounded-full" />
              <div className="space-y-8 relative z-10">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 group">
                       <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full mt-1.5 shadow-[0_0_10px_rgba(220,38,38,0.5)] ${i === 1 ? 'bg-red-600' : 'bg-red-900'}`} />
                          <div className="w-0.5 flex-1 bg-red-900/20 my-1 group-last:hidden" />
                       </div>
                       <div className="space-y-1 pb-4">
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">14:2{i} PM</p>
                          <p className="text-sm font-bold text-white tracking-tight">{i === 1 ? 'Checkpoint Alpha Missed' : 'Unscheduled Sector Entry'}</p>
                          <p className="text-xs text-gray-500 italic">"Submitting follow-up report..."</p>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-4 py-4 bg-red-600/10 border border-red-600/30 text-red-500 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-600 hover:text-white transition-all">VIEW FULL ARCHIVE</button>
           </div>
        </div>
      </div>
    </div>
  );
}
