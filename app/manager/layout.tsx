"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Shield, LogOut, Settings, Building2, Menu, X } from 'lucide-react';

const SidebarItem = ({ href, icon: Icon, label, active, onClick }: { href: string, icon: any, label: string, active: boolean, onClick?: () => void }) => (
  <Link 
    href={href}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]' 
        : 'text-gray-400 hover:bg-red-950/20 hover:text-red-400'
    }`}
  >
    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-gray-500'}`} />
    <span className="font-medium">{label}</span>
  </Link>
);

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [managerName, setManagerName] = useState("Manager");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("managerName");
    if (name) {
      setManagerName(name);
    }
  }, []);

  const menuItems = [
    { href: '/manager', icon: Home, label: 'Home' },
    { href: '/manager/supervisor', icon: Users, label: 'Supervisors' },
    { href: '/manager/guard', icon: Shield, label: 'Guards' },
    { href: '/manager/clients', icon: Building2, label: 'Client' },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-16 flex items-center justify-between px-4 border-b border-red-900/20 bg-[#0a0a0a] z-40">
        <div className="flex items-center gap-2">
          <Shield className="text-red-600 w-6 h-6" />
          <span className="font-bold text-xl tracking-tight">TigerDo <span className="text-red-600">HQ</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-400 hover:text-white">
          <Menu size={24} />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-red-900/20 flex-col fixed inset-y-0 shadow-2xl bg-[#0a0a0a] z-50">
        <div className="p-8 border-b border-red-900/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center rotate-3 group hover:rotate-0 transition-transform shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              <Shield className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight">TigerDo <span className="text-red-600">HQ</span></span>
          </div>
          <div className="flex items-center gap-2 px-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{managerName}</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-6">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-red-900/10 space-y-2">
          <SidebarItem href="/manager/settings" icon={Settings} label="Settings" active={pathname === '/manager/settings'} />
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-950/20 hover:text-red-500 transition-all font-medium">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-[#0a0a0a] border-r border-red-900/20 flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-red-900/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="text-red-600 w-6 h-6" />
                <span className="font-bold text-lg tracking-tight">TigerDo <span className="text-red-600">HQ</span></span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-white p-1">
                <X size={24} />
              </button>
            </div>
            
            <div className="px-6 py-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{managerName}</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => (
                <SidebarItem 
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={pathname === item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
            </nav>

            <div className="p-4 border-t border-red-900/10 space-y-2">
              <SidebarItem href="/manager/settings" icon={Settings} label="Settings" active={pathname === '/manager/settings'} onClick={() => setIsMobileMenuOpen(false)} />
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-950/20 hover:text-red-500 transition-all font-medium">
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 pt-20 lg:pt-8 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
