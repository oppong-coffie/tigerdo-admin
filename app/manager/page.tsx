"use client";

import React, { useState, useEffect } from 'react';
import { Users, Shield, Clock, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend?: string }) => (
  <div className="bg-[#121212] border border-red-900/30 p-6 rounded-xl hover:border-red-600 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-red-950/30 rounded-lg group-hover:bg-red-600/20 transition-colors">
        <Icon className="w-6 h-6 text-red-500" />
      </div>
      {trend && <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{trend}</span>}
    </div>
    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

export default function Home() {
  const [managerName, setManagerName] = useState("Manager");

  useEffect(() => {
    const name = localStorage.getItem("managerName");
    if (name) {
      setManagerName(name);
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Manager Overview</h1>
        <p className="text-gray-400">Welcome back, {managerName}! Here's what's happening with your security operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Supervisors" value="12" icon={Users} trend="+2 this month" />
        <StatCard title="Active Guards" value="48" icon={Shield} trend="98% on duty" />
        <StatCard title="Average Response" value="4.2m" icon={Clock} trend="-12% improved" />
        <StatCard title="Efficiency Score" value="94%" icon={TrendingUp} trend="+5% up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#121212] border border-red-900/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Alerts</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center p-3 rounded-lg bg-red-950/10 border border-red-950/20">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-4 animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Zone B - Checkpoint Missed</p>
                  <p className="text-xs text-gray-400">Sector 4 • 12 mins ago</p>
                </div>
                <button className="text-xs font-semibold text-red-500 hover:text-red-400">View</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#121212] border border-red-900/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Shift Status</h2>
          <div className="space-y-4">
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Morning Shift</span>
                <span className="text-green-500 font-medium">Active</span>
             </div>
             <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '85%' }}></div>
             </div>
             <p className="text-xs text-gray-500">85% of personnel checked in</p>
          </div>
        </div>
      </div>
    </div>
  );
}
