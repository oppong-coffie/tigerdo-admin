"use client";

import React, { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Shield, Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SupervisorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const supervisorDoc = await getDoc(doc(db, "supervisors", userCredential.user.uid));
      if (supervisorDoc.exists()) {
        const data = supervisorDoc.data();
        localStorage.setItem("supervisorID", userCredential.user.uid);
        localStorage.setItem("managerID", data.managerID || "");
      } else {
        localStorage.setItem("supervisorID", userCredential.user.uid);
      }

      router.push("/supervisor/home");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid security credentials provided.");
      } else {
        setError("Unable to authenticate. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 selection:bg-red-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] mb-4">
            <Shield className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase tracking-widest">
            TIGER<span className="text-red-600">DO</span> SUPERVISOR
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Field Command Portal</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" htmlFor="email">
                  Supervisor Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="supervisor@tigerdo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest" htmlFor="password">
                    Access Code
                  </label>
                  <Link href="#" className="text-[10px] font-bold text-zinc-600 hover:text-red-500 uppercase tracking-wider transition-colors">
                    Forgot Key?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all placeholder:text-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800/50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl shadow-[0_4px_20px_rgba(185,28,28,0.3)] transition-all flex items-center justify-center gap-2 group mt-8 active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  AUTHENTICATE
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-zinc-600 text-xs font-medium uppercase tracking-wider">
            No clearance?{" "}
            <span className="text-red-500 font-black">Contact Administrator</span>
          </p>
        </div>

        {/* System info */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Server: Online</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-800" />
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Encrypted SSL/256</span>
        </div>
      </div>
    </div>
  );
}