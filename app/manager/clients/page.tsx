"use client";

import React, { useState, useEffect } from 'react';
import { Building2, Search, MoreVertical, X, Check, Loader2, Plus, MapPin } from 'lucide-react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [geographicalArea, setGeographicalArea] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    // Listen for real-time updates to clients collection
    const unsubscribe = onSnapshot(collection(db, 'clients'), (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(clientsData);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateClient = async () => {
    if (!companyName || !contactName || !email || !phone || !address || !geographicalArea || !latitude || !longitude) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      const managerID = localStorage.getItem("managerID") || "";
      
      // Add to Firestore
      await addDoc(collection(db, "clients"), {
        managerID,
        companyName,
        contactName,
        email,
        phone,
        address,
        geographicalArea,
        latitude,
        longitude,
        status: 'Active',
        createdAt: new Date().toISOString()
      });
      
      setIsModalOpen(false);
      // Clear form
      setCompanyName("");
      setContactName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setGeographicalArea("");
      setLatitude("");
      setLongitude("");
    } catch (error: any) {
      console.error("Error creating client:", error);
      alert(`Failed to create client: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clients Portfolio</h1>
          <p className="text-gray-400">Manage your security contracts and client accounts.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
        >
          <Plus size={18} />
          Add Client
        </button>
      </div>

      <div className="bg-[#121212] border border-red-900/30 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-red-900/30 flex justify-between items-center bg-[#0a0a0a]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#1a1a1a] border border-red-900/30 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-red-600 w-64 transition-all"
            />
          </div>
          <div className="text-xs text-gray-500">
            Showing {filteredClients.length} of {clients.length} clients
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0a0a0a] text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Company</th>
                <th className="px-6 py-4 font-semibold">Contact Person</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-900/10">
              {filteredClients.map((c) => (
                <tr key={c.id} className="hover:bg-red-950/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-900/20 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all font-bold border border-red-900/30">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-red-500 transition-colors">{c.companyName}</p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-300">{c.contactName}</p>
                    <p className="text-xs text-gray-500">{c.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                      c.status === 'Active' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                    }`}>
                      {c.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-red-500/50 flex-shrink-0" />
                        <span className="truncate max-w-[150px]">{c.address}</span>
                      </div>
                      {c.geographicalArea && (
                        <div className="text-xs text-gray-500 flex gap-2 pl-5">
                          <span className="font-bold">{c.geographicalArea}</span>
                          {c.latitude && c.longitude && <span>[{c.latitude}, {c.longitude}]</span>}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-600 hover:text-white p-1 hover:bg-white/5 rounded transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {clients.length === 0 ? "No clients found in database" : `No clients found matching "${searchTerm}"`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal UI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-red-900/30 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.15)]">
            <div className="px-6 border-b border-red-900/20 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add New Client</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Company Name</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full bg-[#151515] border border-red-900/20 rounded-lg py-1 px-3 text-white focus:outline-none focus:border-red-600 transition-colors" 
                  placeholder="e.g. Acme Corp" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Primary Contact Name</label>
                <input 
                  type="text" 
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full bg-[#151515] border border-red-900/20 rounded-lg py-1 px-3 text-white focus:outline-none focus:border-red-600 transition-colors" 
                  placeholder="e.g. Jane Doe" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#151515] border border-red-900/20 rounded-lg py-1 px-3 text-white focus:outline-none focus:border-red-600 transition-colors" 
                    placeholder="contact@acme.com" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">Phone Number</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-[#151515] border border-red-900/20 rounded-lg py-1 px-3 text-white focus:outline-none focus:border-red-600 transition-colors" 
                    placeholder="0800 123 4567" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">Facility Address</label>
                <textarea 
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-[#151515] border border-red-900/20 rounded-lg py-1 px-3 text-white focus:outline-none focus:border-red-600 transition-colors resize-none h-24 custom-scrollbar" 
                  placeholder="123 Corporate Blvd, Business District" 
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-red-900/10">
                <label className="text-xs font-black text-red-500/80 uppercase tracking-widest">Geospatial Data</label>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Geographical Area</label>
                <input 
                  type="text" 
                  value={geographicalArea}
                  onChange={e => setGeographicalArea(e.target.value)}
                  className="w-full bg-[#151515] border border-red-900/20 rounded-lg py-1 px-3 text-white focus:outline-none focus:border-red-600 transition-colors" 
                  placeholder="e.g. North Region" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">Latitude</label>
                  <input 
                    type="text" 
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                    className="w-full bg-[#151515] border border-red-900/20 rounded-lg py-1 px-3 text-white focus:outline-none focus:border-red-600 transition-colors" 
                    placeholder="e.g. 34.0522" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">Longitude</label>
                  <input 
                    type="text" 
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                    className="w-full bg-[#151515] border border-red-900/20 rounded-lg py-1 px-3 text-white focus:outline-none focus:border-red-600 transition-colors" 
                    placeholder="e.g. -118.2437" 
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#050505] border-t border-red-900/20 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-1 bg-transparent border border-red-900/30 text-gray-400 rounded-lg hover:bg-white/5 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateClient}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold shadow-[0_4px_15px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Client"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}