"use client";

import React, { useState, useEffect } from 'react';
import { UserPlus, Search, MoreVertical, X, Check, Loader2 } from 'lucide-react';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { db, app } from '@/lib/firebase';

export default function SupervisorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [zone, setZone] = useState("Alpha Zone");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Listen for real-time updates to supervisors collection
    const unsubscribe = onSnapshot(collection(db, 'supervisors'), (snapshot) => {
      const supervisorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      const currentManagerID = localStorage.getItem("managerID");
      if (currentManagerID) {
        setSupervisors(supervisorsData.filter(s => s.managerID === currentManagerID));
      } else {
        setSupervisors(supervisorsData);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleCreateSupervisor = async () => {
    if (!name || !email || !password || !phone) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      // Create secondary app to avoid signing out the current manager
      const secondaryApp = getApps().find(a => a.name === "SecondaryApp") || initializeApp(app.options, "SecondaryApp");
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      
      // Add to Firestore
      const currentManagerId = localStorage.getItem("managerID") || "";
      await setDoc(doc(db, "supervisors", userCredential.user.uid), {
        uid: userCredential.user.uid,
        supervisorID: userCredential.user.uid,
        managerID: currentManagerId,
        name,
        email,
        zone,
        phone,
        status: 'Off Duty',
        createdAt: new Date().toISOString()
      });
      
      await secondaryAuth.signOut();
      
      setIsModalOpen(false);
      // Clear form
      setName("");
      setEmail("");
      setZone("Alpha Zone");
      setPhone("");
      setPassword("");
    } catch (error: any) {
      console.error("Error creating supervisor:", error);
      alert(`Failed to create supervisor: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSupervisors = supervisors.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.zone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Supervisors</h1>
          <p className="text-gray-400">Manage and monitor your supervisory team.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
        >
          <UserPlus size={18} />
          Add Supervisor
        </button>
      </div>

      <div className="bg-[#121212] border border-red-900/30 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-red-900/30 flex justify-between items-center bg-[#0a0a0a]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search supervisors..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#1a1a1a] border border-red-900/30 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-red-600 w-64 transition-all"
            />
          </div>
          <div className="text-xs text-gray-500">
            Showing {filteredSupervisors.length} of {supervisors.length} supervisors
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0a0a0a] text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Zone</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-900/10">
              {filteredSupervisors.map((s) => (
                <tr key={s.id} className="hover:bg-red-950/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-900/20 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all font-bold border border-red-900/30">
                        {s.name ? s.name.charAt(0) : '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-red-500 transition-colors">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{s.zone}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                      s.status === 'On Duty' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                    }`}>
                      {s.status || 'Off Duty'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{s.phone}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-600 hover:text-white p-1 hover:bg-white/5 rounded transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSupervisors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {supervisors.length === 0 ? "No supervisors found in database" : `No supervisors found matching "${searchTerm}"`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal UI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-red-900/30 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.15)]">
            <div className="p-6 border-b border-red-900/20 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add New Supervisor</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#151515] border border-red-900/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-red-600 transition-colors" 
                  placeholder="e.g. James Bond" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#151515] border border-red-900/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-red-600 transition-colors" 
                  placeholder="james@tigerdo.com" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">Zone</label>
                  <select 
                    value={zone}
                    onChange={e => setZone(e.target.value)}
                    className="w-full bg-[#151515] border border-red-900/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-red-600 transition-colors appearance-none"
                  >
                    <option>Alpha Zone</option>
                    <option>Beta Zone</option>
                    <option>Gamma Zone</option>
                    <option>Delta Zone</option>
                    <option>Epsilon Zone</option>
                    <option>Zeta Zone</option>
                    <option>Eta Zone</option>
                    <option>Theta Zone</option>
                    <option>Iota Zone</option>
                    <option>Kappa Zone</option>
                    <option>Lambda Zone</option>
                    <option>Mu Zone</option>
                    <option>Nu Zone</option>
                    <option>Xi Zone</option>
                    <option>Omicron Zone</option>
                    <option>Pi Zone</option>
                    <option>Rho Zone</option>
                    <option>Sigma Zone</option>
                    <option>Tau Zone</option>
                    <option>Upsilon Zone</option>
                    <option>Phi Zone</option>
                    <option>Chi Zone</option>
                    <option>Psi Zone</option>
                    <option>Omega Zone</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">Phone Number</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-[#151515] border border-red-900/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-red-600 transition-colors" 
                    placeholder="0800 000 0000" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#151515] border border-red-900/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-red-600 transition-colors" 
                  placeholder="••••••••" 
                />
              </div>
            </div>
            <div className="p-6 bg-[#050505] border-t border-red-900/20 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-transparent border border-red-900/30 text-gray-400 rounded-lg hover:bg-white/5 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateSupervisor}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold shadow-[0_4px_15px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
