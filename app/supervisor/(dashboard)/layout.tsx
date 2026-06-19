"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { auth } from '@/lib/firebase';

const SidebarItem = ({ href, icon: Icon, label, active, onClick }: { href: string, icon: any, label: string, active: boolean, onClick?: () => void }) => (
  <Link 
    href={href}
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
      active 
        ? 'bg-red-600 text-white shadow-[0_8px_20px_rgba(220,38,38,0.3)]' 
        : 'text-gray-400 hover:bg-red-950/20 hover:text-red-400'
    }`}
  >
    <Icon className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-500'}`} />
    <span className="font-bold tracking-tight text-lg">{label}</span>
  </Link>
);

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("supervisorID");
      localStorage.removeItem("managerID");
      router.push("/supervisor");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const menuItems = [
    { href: '/supervisor/home', icon: LayoutDashboard, label: 'Sector Hub' },
    { href: '/supervisor/guards', icon: Users, label: 'My Guards' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-red-900/20 bg-[#0a0a0a] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-red-600 w-6 h-6" />
          <span className="font-black italic tracking-tighter text-xl text-white">TIGERDO <span className="text-red-600">SUPER</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-400">
          <Menu size={24} />
        </button>
      </header>

      <aside className="hidden lg:flex flex-col w-72 fixed inset-y-0 bg-[#0a0a0a] border-r border-red-900/20 p-6 z-50">
        <div className="mb-12 px-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center -rotate-2 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <ShieldCheck className="text-white w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="font-black italic tracking-tighter text-2xl leading-none underline decoration-red-600 underline-offset-4">SUPERVISOR</span>
              <span className="text-gray-500 font-bold text-[10px] tracking-widest uppercase mt-1">Sector Command</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
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

        <div className="pt-6 border-t border-red-900/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 text-gray-400 hover:bg-red-950/20 hover:text-red-400 cursor-pointer text-left"
          >
            <LogOut className="w-6 h-6 text-gray-500 group-hover:text-red-400" />
            <span className="font-bold tracking-tight text-lg">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-[#0a0a0a] border-r border-red-900/20 p-6 flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-12 px-2">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-red-600 w-7 h-7" />
                <span className="font-black italic tracking-tighter text-2xl">SUPER</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 space-y-3">
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
            <div className="pt-6 border-t border-red-900/10">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 text-gray-400 hover:bg-red-950/20 hover:text-red-400 cursor-pointer text-left"
              >
                <LogOut className="w-6 h-6 text-gray-500 group-hover:text-red-400" />
                <span className="font-bold tracking-tight text-lg">Log Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-72 p-4 lg:p-10 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
