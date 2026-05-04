"use client";

import React, { useState, useEffect } from 'react';
import { UserPlus, Search, MapPin, Shield, X, BadgeInfo, Calendar, Loader2 } from 'lucide-react';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { db, app } from '@/lib/firebase';

export default function GuardsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guards, setGuards] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [location, setLocation] = useState("");
  const [shift, setShift] = useState("Morning Shift");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");

  useEffect(() => {
    const unsubscribeGuards = onSnapshot(collection(db, 'guards'), (snapshot) => {
      const guardsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      
      const currentManagerID = localStorage.getItem("managerID");
      if (currentManagerID) {
        setGuards(guardsData.filter(g => g.managerID === currentManagerID));
      } else {
        setGuards(guardsData);
      }
    });

    const unsubscribeSupervisors = onSnapshot(collection(db, 'supervisors'), (snapshot) => {
      const supsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      
      const currentManagerID = localStorage.getItem("managerID");
      if (currentManagerID) {
        setSupervisors(supsData.filter(s => s.managerID === currentManagerID));
      } else {
        setSupervisors(supsData);
      }
    });

    const unsubscribeClients = onSnapshot(collection(db, 'clients'), (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setClients(clientsData);
    });

    return () => {
      unsubscribeGuards();
      unsubscribeSupervisors();
      unsubscribeClients();
    };
  }, []);

  const handleCreateGuard = async () => {
    if (!name || !code || !email || !password || !phone || !shift || !location || !selectedSupervisor) {
      alert("Please fill in all fields including location and supervisor.");
      return;
    }

    const selectedClient = clients.find(c => c.companyName === location);
    const latitude = selectedClient?.latitude || "";
    const longitude = selectedClient?.longitude || "";

    try {
      setIsLoading(true);
      const secondaryApp = getApps().find(a => a.name === "SecondaryApp") || initializeApp(app.options, "SecondaryApp");
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      
      const managerID = localStorage.getItem("managerID") || "";

      await setDoc(doc(db, "guards", userCredential.user.uid), {
        uid: userCredential.user.uid,
        supervisorID: selectedSupervisor,
        managerID,
        name,
        code,
        shift,
        location,
        latitude,
        longitude,
        phone,
        email,
        status: 'Off Duty',
        performance: 100,
        createdAt: new Date().toISOString()
      });
      
      await secondaryAuth.signOut();
      setIsModalOpen(false);
      
      setName("");
      setCode("");
      setLocation("");
      setShift("Morning Shift");
      setPhone("");
      setEmail("");
      setPassword("");
      setSelectedSupervisor("");
    } catch (error: any) {
      console.error("Error creating guard:", error);
      alert(`Failed to create guard: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGuards = guards.filter(g => 
    g.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Guards</h1>
          <p className="text-gray-400">Personnel management and deployment tracking.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
        >
          <UserPlus size={18} />
          Hire Guard
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search guards by name, code, or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121212] border border-red-900/30 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-red-600 transition-all shadow-lg"
          />
        </div>
        <div className="flex gap-2">
           <button className="bg-[#121212] border border-red-900/30 text-gray-400 text-xs px-3 py-2 rounded-lg hover:border-red-600/50 transition-colors uppercase font-bold tracking-wider">All Status</button>
           <button className="bg-[#121212] border border-red-900/30 text-gray-400 text-xs px-3 py-2 rounded-lg hover:border-red-600/50 transition-colors uppercase font-bold tracking-wider">Active Shifts</button>
        </div>
      </div>

      {filteredGuards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-geist-sans">
          {filteredGuards.map((guard) => {
            const supervisor = supervisors.find(s => s.uid === guard.supervisorID);
            const supervisorName = supervisor ? supervisor.name : "Unassigned";

            return (
              <div key={guard.id} className="bg-[#121212] border border-red-900/30 rounded-2xl p-6 hover:border-red-600/50 transition-all group relative overflow-hidden shadow-xl">
                {/* Status Glow */}
                <div className={`absolute top-0 right-0 w-16 h-16 blur-2xl opacity-10 rounded-full -mr-8 -mt-8 ${
                   guard.status === 'Mobile' ? 'bg-blue-500' : guard.status === 'Stationary' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />

                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-red-950/20 border border-red-900/20 flex items-center justify-center group-hover:bg-red-600/20 group-hover:border-red-600/50 transition-all shadow-inner">
                    <Shield className="w-7 h-7 text-red-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col items-end">
                     <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-red-900/30 px-2 py-1 rounded text-[10px] text-gray-400 font-bold tracking-tighter uppercase mb-2">
                        <BadgeInfo size={10} className="text-red-500" />
                        {guard.code}
                     </div>
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm ${
                        guard.status === 'Mobile' ? 'bg-blue-500/10 text-blue-400' : guard.status === 'Stationary' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {guard.status || 'Off Duty'}
                      </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                     <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">{guard.name}</h3>
                     <p className="text-xs text-gray-500 mt-0.5">{guard.phone}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-4 border-y border-red-900/10">
                     <div className="space-y-1 overflow-hidden">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Location</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                          <MapPin size={12} className="text-red-600 flex-shrink-0" />
                          <span className="truncate" title={guard.location}>{guard.location}</span>
                        </div>
                     </div>
                     <div className="space-y-1 overflow-hidden">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Shift</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                          <Calendar size={12} className="text-red-600 flex-shrink-0" />
                          <span className="truncate">{guard.shift}</span>
                        </div>
                     </div>
                     <div className="space-y-1 overflow-hidden">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Supervisor</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                          <Shield size={12} className="text-red-600 flex-shrink-0" />
                          <span className="truncate" title={supervisorName}>{supervisorName}</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex -space-x-2">
                      {[1,2].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-[10px] font-bold text-white">
                          {String.fromCharCode(64+i)}
                        </div>
                      ))}
                      <div className="w-6 h-6 rounded-full border-2 border-black bg-red-950 flex items-center justify-center text-[8px] font-bold text-red-500">+VP</div>
                    </div>
                    <button className="text-xs font-black text-red-600 hover:text-red-500 uppercase tracking-tight flex items-center gap-1 group/btn">
                      Details
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-[#0a0a0a] border border-dashed border-red-900/30 rounded-3xl">
           <Search size={48} className="text-red-900/40 mb-4" />
           <p className="text-gray-400 font-medium text-lg">No guards found for your search</p>
           <button onClick={() => setSearchTerm("")} className="mt-2 text-red-600 hover:underline text-sm font-bold">Clear search filters</button>
        </div>
      )}

      {/* Hire Guard Modal UI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-red-900/30 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.15)]">
            <div className="p-6 border-b border-red-900/20 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Hire New <span className="text-red-600">Guard</span></h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#151515] border border-red-900/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-600 transition-colors font-medium" 
                  placeholder="e.g. Robert Wilson" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Access Code</label>
                  <input 
                    type="text" 
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full bg-[#151515] border border-red-900/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-600 transition-colors font-medium" 
                    placeholder="GD-1234" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-[#151515] border border-red-900/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-600 transition-colors font-medium" 
                    placeholder="+1 (555) 000-0000" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Shift</label>
                  <select 
                    value={shift}
                    onChange={e => setShift(e.target.value)}
                    className="w-full bg-[#151515] border border-red-900/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-600 transition-colors font-medium appearance-none"
                  >
                    <option>Morning Shift</option>
                    <option>Night Shift</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Deployment Zone</label>
                  <select 
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-[#151515] border border-red-900/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-600 transition-colors font-medium appearance-none"
                  >
                    <option value="" disabled>Select a client...</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.companyName}>
                        {client.companyName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Assign Supervisor</label>
                <select 
                  value={selectedSupervisor}
                  onChange={e => setSelectedSupervisor(e.target.value)}
                  className="w-full bg-[#151515] border border-red-900/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-600 transition-colors font-medium appearance-none"
                >
                  <option value="" disabled>Select a supervisor...</option>
                  {supervisors.map(sup => (
                    <option key={sup.id} value={sup.uid}>
                      {sup.name} ({sup.zone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-red-900/10">
                <label className="text-xs font-black text-red-500/80 uppercase tracking-widest">Login Credentials</label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#151515] border border-red-900/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-600 transition-colors font-medium" 
                  placeholder="guard@tigerdo.com" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#151515] border border-red-900/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-600 transition-colors font-medium" 
                  placeholder="••••••••" 
                />
              </div>
            </div>
            
            <div className="p-6 bg-[#050505] border-t border-red-900/20 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 bg-transparent border border-red-900/30 text-gray-400 rounded-xl hover:bg-white/5 transition-colors font-bold tracking-widest uppercase text-xs"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateGuard}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-black tracking-widest uppercase text-xs shadow-[0_4px_15px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy Guard"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
