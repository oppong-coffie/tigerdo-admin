"use client";

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Shield, MoreVertical, MessageSquare, ExternalLink, Filter, UserPlus, X, Loader2 } from 'lucide-react';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { db, app } from '@/lib/firebase';

export default function SupervisorGuardsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guards, setGuards] = useState<any[]>([]);
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

  useEffect(() => {
    // Listen for real-time updates to guards collection
    const unsubscribeGuards = onSnapshot(collection(db, 'guards'), (snapshot) => {
      const guardsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      
      const supervisorID = localStorage.getItem("supervisorID");
      if (supervisorID) {
        setGuards(guardsData.filter(g => g.supervisorID === supervisorID));
      } else {
        setGuards(guardsData);
      }
    });

    // Listen for real-time updates to clients collection
    const unsubscribeClients = onSnapshot(collection(db, 'clients'), (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setClients(clientsData);
    });

    return () => {
      unsubscribeGuards();
      unsubscribeClients();
    };
  }, []);

  const handleCreateGuard = async () => {
    if (!name || !code || !email || !password || !phone || !shift || !location) {
      alert("Please fill in all fields including deployment zone.");
      return;
    }

    const selectedClient = clients.find(c => c.companyName === location);
    const latitude = selectedClient?.latitude || "";
    const longitude = selectedClient?.longitude || "";

    try {
      setIsLoading(true);
      // Create secondary app to avoid signing out the current supervisor
      const secondaryApp = getApps().find(a => a.name === "SecondaryApp") || initializeApp(app.options, "SecondaryApp");
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      
      // Get IDs from local storage
      const supervisorID = localStorage.getItem("supervisorID") || "";
      const managerID = localStorage.getItem("managerID") || "";

      // Add to Firestore
      await setDoc(doc(db, "guards", userCredential.user.uid), {
        uid: userCredential.user.uid,
        supervisorID,
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
        performance: 100, // default performance score
        createdAt: new Date().toISOString()
      });
      
      await secondaryAuth.signOut();
      
      setIsModalOpen(false);
      // Clear form
      setName("");
      setCode("");
      setLocation("");
      setShift("Morning Shift");
      setPhone("");
      setEmail("");
      setPassword("");
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
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">SECTOR <span className="text-red-600">PERSONNEL</span></h1>
          <p className="text-gray-500 font-medium lowercase tracking-tight">Active duty guards under your command in Sector Alpha.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-red-950/20 border border-red-900/30 text-red-500 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Filter size={20} /></button>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold tracking-widest uppercase text-xs transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
           >
             <UserPlus size={16} />
             Add Guard
           </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Filter by name, code, or deployment zone..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#121212] border border-red-900/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-red-600 shadow-2xl transition-all font-medium"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGuards.map((guard) => (
          <div key={guard.id} className="bg-[#121212] border border-red-900/10 rounded-[2.5rem] p-8 hover:border-red-600/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
               <button className="text-gray-700 hover:text-red-600 transition-colors"><MoreVertical size={24} /></button>
            </div>
            
            <div className="flex items-start gap-6">
               <div className="w-20 h-20 rounded-3xl bg-red-950/30 border border-red-900/20 flex items-center justify-center text-red-600 font-black text-3xl italic shadow-inner group-hover:scale-105 transition-transform">
                  {guard.name ? guard.name.charAt(0) : '?'}
               </div>
               <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white tracking-tighter group-hover:text-red-600 transition-colors uppercase italic">{guard.name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest bg-black/40 inline-block px-2 py-0.5 rounded border border-white/5">{guard.code}</p>
                    <p className="text-xs font-bold text-gray-400">{guard.shift}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                     <span className={`w-2 h-2 rounded-full ${guard.status === 'Active' || guard.status === 'On Duty' || guard.status === 'Mobile' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                     {guard.status || 'Off Duty'} • {guard.location}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-red-900/10">
               <div>
                  <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1">Efficiency</p>
                  <p className="text-xl font-black text-white italic">{guard.performance || 100}%</p>
               </div>
               <div className="col-span-2 flex justify-end gap-3">
                  <button className="w-12 h-12 bg-[#0a0a0a] border border-red-900/20 rounded-2xl flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-600/50 transition-all shadow-lg">
                    <Phone size={20} />
                  </button>
                  <button className="w-12 h-12 bg-[#0a0a0a] border border-red-900/20 rounded-2xl flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-600/50 transition-all shadow-lg">
                    <MessageSquare size={20} />
                  </button>
                  <button className="px-4 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                    Full Log <ExternalLink size={14} />
                  </button>
               </div>
            </div>
          </div>
        ))}
        {filteredGuards.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 font-medium">
            {guards.length === 0 ? "No guards registered in database." : `No guards found matching "${searchTerm}"`}
          </div>
        )}
      </div>

      {/* Add Guard Modal UI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-red-900/30 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.15)]">
            <div className="p-6 border-b border-red-900/20 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Add New <span className="text-red-600">Guard</span></h2>
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
                    <option>Afternoon Shift</option>
                    <option>Night Shift</option>
                    <option>Graveyard Shift</option>
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
