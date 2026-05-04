"use client";

import React, { useState } from 'react';
import { FileText, Download, Eye, Send, Filter, Plus, Calendar, CheckSquare } from 'lucide-react';

const reportsList = [
  { id: 1, title: 'Sector Alpha - Daily Operational Log', date: 'Oct 24, 2023', type: 'Daily', status: 'Submitted', author: 'You' },
  { id: 2, title: 'Incident Report - Perimeter B Breach', date: 'Oct 23, 2023', type: 'Incident', status: 'Reviewed', author: 'Sgt. Barnes' },
  { id: 3, title: 'Weekly Personnel Efficiency Summary', date: 'Oct 21, 2023', type: 'Summary', status: 'Pending', author: 'HQ System' },
];

export default function SupervisorReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">OPERATIONAL <span className="text-red-600">REPORTS</span></h1>
          <p className="text-gray-500 font-medium tracking-tight">Access historical data and submit mandatory daily briefings.</p>
        </div>
        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-red-600/20">
          <Plus size={18} /> New Briefing
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-[#121212] border border-red-900/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-red-900/10 bg-[#0a0a0a] flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Filter size={18} className="text-red-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Filter Records</span>
                 </div>
                 <div className="flex gap-4">
                    <span className="text-[10px] font-black uppercase text-red-500 border-b-2 border-red-600 pb-1 cursor-pointer">Official</span>
                    <span className="text-[10px] font-black uppercase text-gray-600 hover:text-red-600 pb-1 cursor-pointer transition-colors">Drafts</span>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-[10px] uppercase font-black tracking-widest text-gray-600 border-b border-red-900/10 bg-[#0a0a0a]">
                          <th className="px-8 py-5">File Name</th>
                          <th className="px-8 py-5">Date</th>
                          <th className="px-8 py-5 text-center">Status</th>
                          <th className="px-8 py-5"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-red-900/10">
                       {reportsList.map((report) => (
                          <tr key={report.id} className="hover:bg-red-950/5 transition-all group">
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="p-3 bg-red-950/20 rounded-xl text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner">
                                      <FileText size={20} />
                                   </div>
                                   <div>
                                      <p className="text-white font-bold tracking-tight uppercase italic">{report.title}</p>
                                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{report.type} Archive • {report.author}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-sm text-gray-400 font-medium tabular-nums">{report.date}</td>
                             <td className="px-8 py-6 text-center">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                   report.status === 'Submitted' ? 'bg-green-500/10 text-green-500 border-green-500/20' : report.status === 'Reviewed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                }`}>
                                   {report.status}
                                </span>
                             </td>
                             <td className="px-8 py-6 text-right">
                                <div className="flex justify-end gap-2">
                                   <button className="p-2 text-gray-600 hover:text-white hover:bg-white/5 rounded-lg transition-all"><Eye size={18} /></button>
                                   <button className="p-2 text-gray-600 hover:text-white hover:bg-white/5 rounded-lg transition-all"><Download size={18} /></button>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           {/* Briefing Card */}
           <div className="bg-[#121212] border border-red-600 rounded-[2.5rem] p-8 shadow-[0_0_40px_rgba(220,38,38,0.1)] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 blur-[60px] rounded-full" />
              <div className="relative z-10">
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">DAILY<br/>MANDATORY</h3>
                 <p className="text-gray-400 text-sm italic mb-8 leading-relaxed">System requires an official Sector Alpha log submission within the next 2 hours to maintain compliance.</p>
                 <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-red-600">
                       <CheckSquare size={16} /> <span className="text-xs font-black uppercase tracking-widest">Post Checks Complete</span>
                    </div>
                    <div className="flex items-center gap-3 text-red-600">
                       <CheckSquare size={16} /> <span className="text-xs font-black uppercase tracking-widest">Personnel Audited</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                       <div className="w-4 h-4 border-2 border-gray-800 rounded flex items-center justify-center" /> <span className="text-xs font-black uppercase tracking-widest">Final Authorization</span>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2">
                   Sign & Transmit <Send size={16} />
                 </button>
              </div>
           </div>

           {/* Stats Summary Card */}
           <div className="bg-[#121212] border border-red-900/10 rounded-[2.5rem] p-8">
              <div className="flex items-center gap-3 text-gray-500 mb-6">
                 <Calendar size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">Production Cycle</span>
              </div>
              <div className="flex justify-between items-end mb-2">
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Compliant Docs</p>
                 <p className="text-3xl font-black text-white italic">24/24</p>
              </div>
              <div className="w-full bg-[#0a0a0a] rounded-full h-1.5 mb-1 overflow-hidden">
                 <div className="bg-red-600 h-full rounded-full w-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
              </div>
              <p className="text-[9px] text-gray-600 font-bold uppercase text-right">Target achieved</p>
           </div>
        </div>
      </div>
    </div>
  );
}
