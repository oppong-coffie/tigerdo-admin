"use client";

import React, { useState, useEffect } from 'react';
import { Users, Shield, AlertTriangle, MapPin, Clock, UserX } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const SectorStat = ({ 
  label, 
  value, 
  icon: Icon, 
  color 
}: { 
  label: string, 
  value: string | number, 
  icon: any, 
  color: 'red' | 'green' | 'white' 
}) => {
  const themes = {
    red: 'border-red-500/10 hover:border-red-500/30 bg-red-500/5 text-red-500',
    green: 'border-green-500/10 hover:border-green-500/30 bg-green-500/5 text-green-500',
    white: 'border-white/10 hover:border-white/30 bg-white/5 text-white'
  };

  const iconColors = {
    red: 'bg-red-500/10 text-red-500',
    green: 'bg-green-500/10 text-green-500',
    white: 'bg-white/10 text-white'
  };

  return (
    <div className={`border p-6 rounded-[2rem] transition-all duration-300 group ${themes[color]}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${iconColors[color]}`}>
        <Icon size={24} />
      </div>
      <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-black text-white italic tracking-tighter">
        {typeof value === 'number' && value < 10 ? `0${value}` : value}
      </p>
    </div>
  );
};

const DEMO_GUARDS = [
  {
    id: 'g1',
    name: 'Kofi Mensah',
    location: 'Main Gate Control',
    timeStarted: '06:00 AM',
    status: 'On Duty',
    code: 'GD-0892',
  },
  {
    id: 'g2',
    name: 'Emmanuel Osei',
    location: 'North Warehouse',
    timeStarted: '06:30 AM',
    status: 'Active',
    code: 'GD-0741',
  },
  {
    id: 'g3',
    name: 'Kwame Boadu',
    location: 'Patrol Car 2',
    timeStarted: '07:00 AM',
    status: 'Mobile',
    code: 'GD-0112',
  },
  {
    id: 'g4',
    name: 'Ama Serwaa',
    location: 'South Parking Lobby',
    timeStarted: '07:15 AM',
    status: 'On Duty',
    code: 'GD-0993',
  },
  {
    id: 'g5',
    name: 'Prince Appiah',
    location: 'East Loading Dock',
    timeStarted: '08:00 AM',
    status: 'Late',
    code: 'GD-0254',
    delayedTime: '25m late'
  },
  {
    id: 'g6',
    name: 'Yaw Boateng',
    location: 'West Perimeter Gate',
    timeStarted: '08:00 AM',
    status: 'Late',
    code: 'GD-0331',
    delayedTime: '12m late'
  },
  {
    id: 'g7',
    name: 'Akua Mansah',
    location: 'Reception Desk',
    timeStarted: '08:00 AM',
    status: 'Off Duty',
    code: 'GD-0402',
  },
  {
    id: 'g8',
    name: 'Derrick Addo',
    location: 'Server Room Lobby',
    timeStarted: '07:00 AM',
    status: 'Absent',
    code: 'GD-0556',
  }
];

export default function SupervisorDashboard() {
  const [guards, setGuards] = useState<any[]>(DEMO_GUARDS);

  useEffect(() => {
    // For now, using demo data. Commented out Firebase real-time listener:
    /*
    const supervisorID = localStorage.getItem("supervisorID");
    
    const unsubscribe = onSnapshot(collection(db, 'guards'), (snapshot) => {
      const dbGuardsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      
      const filtered = supervisorID 
        ? dbGuardsList.filter(g => g.supervisorID === supervisorID)
        : dbGuardsList;
        
      setGuards(filtered);
    }, (error) => {
      console.error("Firestore listen error:", error);
    });

    return () => unsubscribe();
    */
  }, []);

  // Group guards by status
  const onPostGuards = guards.filter(g => 
    g.status === 'On Duty' || 
    g.status === 'Active' || 
    g.status === 'Mobile'
  );

  const lateGuards = guards.filter(g => 
    g.status === 'Late'
  );

  const absentGuards = guards.filter(g => 
    g.status === 'Off Duty' || 
    g.status === 'Absent'
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sector Header */}
      <div className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-2 text-white mb-2">
              <MapPin size={16} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Sector Alpha</span>
           </div>
           <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">OPERATIONAL <span className="text-green-500">HUB</span></h1>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4">
           <div className="flex flex-col text-right">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">System Status</span>
              <span className="text-green-500 font-black text-xs tracking-tight uppercase">ALL SECURE</span>
           </div>
           <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
        </div>
      </div>

      {/* Redesigned Metrics Grid using White, Green, and Red */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SectorStat label="Total Guards" value={guards.length} icon={Users} color="white" />
        <SectorStat label="On Post" value={onPostGuards.length} icon={Shield} color="green" />
        <SectorStat label="Late" value={lateGuards.length} icon={Clock} color="red" />
        <SectorStat label="Absent" value={absentGuards.length} icon={UserX} color="red" />
      </div>

      {/* Main Grid: On Post (Green - Major), Late (White - Small), Absent (Red - Smallest) */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* On Post Guards Panel (Green - Major Area - col-span-6) */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">On Post Personnel</h2>
            <span className="text-xs font-bold text-green-500 uppercase tracking-widest">{onPostGuards.length} Active</span>
          </div>

          <div className="grid gap-4">
            {onPostGuards.map((guard) => (
              <div key={guard.id} className="bg-[#121212] border border-green-500/10 p-5 rounded-3xl flex items-center justify-between hover:bg-green-500/5 hover:border-green-500/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-950/30 flex items-center justify-center text-green-500 font-bold text-lg">
                    {guard.name ? guard.name.charAt(0) : '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-green-500 transition-colors uppercase italic">{guard.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-green-500" /> {guard.location}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {guard.timeStarted || "07:00 AM"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                    {guard.status || 'Active'}
                  </span>
                </div>
              </div>
            ))}

            {onPostGuards.length === 0 && (
              <div className="text-center p-8 bg-[#121212] border border-green-500/10 rounded-3xl text-gray-500 font-medium">
                No active personnel checked on post.
              </div>
            )}
          </div>
        </div>

        {/* Late Guards Panel (White/Alert - Small Area - col-span-4) */}
        <div className="col-span-12 md:col-span-7 lg:col-span-4 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Late Arrivals</h2>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">{lateGuards.length} Overdue</span>
          </div>

          <div className="grid gap-4">
            {lateGuards.map((guard) => (
              <div key={guard.id} className="bg-[#121212] border border-white/10 p-5 rounded-3xl flex flex-col gap-3 hover:bg-white/5 hover:border-white/30 transition-all group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white font-bold text-lg">
                      {guard.name ? guard.name.charAt(0) : '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-red-500 transition-colors uppercase italic">{guard.name}</h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{guard.code || 'GD-0000'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 animate-pulse">
                    {guard.delayedTime || "15m late"}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-gray-400 mt-1">
                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-red-500" /> Site: {guard.location}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} /> Scheduled: {guard.timeStarted || "08:00 AM"}</span>
                </div>
              </div>
            ))}

            {lateGuards.length === 0 && (
              <div className="text-center p-8 bg-[#121212] border border-white/10 rounded-3xl text-gray-500 font-medium">
                No delayed arrivals in Sector.
              </div>
            )}
          </div>
        </div>

        {/* Absent Guards Panel (Red - Smallest Area - col-span-2) */}
        <div className="col-span-12 md:col-span-5 lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Absent</h2>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">{absentGuards.length}</span>
          </div>

          <div className="grid gap-4">
            {absentGuards.map((guard) => (
              <div key={guard.id} className="bg-[#121212] border border-red-500/10 p-4 rounded-3xl flex flex-col gap-2 hover:bg-red-500/5 hover:border-red-500/30 transition-all group">
                <div>
                  <h3 className="font-bold text-white text-sm tracking-tight group-hover:text-red-500 transition-colors uppercase italic">{guard.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10} className="text-red-500" /> {guard.location}</p>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 inline-block">
                    {guard.status === 'Off Duty' ? 'Off Duty' : 'Absent'}
                  </span>
                </div>
              </div>
            ))}

            {absentGuards.length === 0 && (
              <div className="text-center p-8 bg-[#121212] border border-red-500/10 rounded-3xl text-gray-500 font-medium">
                No absent/off duty reports.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
