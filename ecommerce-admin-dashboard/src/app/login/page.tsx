"use client";

import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin@123");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const auth = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await auth.login(email, password);
      toast.success("Login successful");
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center px-4">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full" />
      </div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl rounded-3xl p-8">
          
          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-8">
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg mb-4">
              <ShieldCheck className="text-white" size={30} />
            </div>

            <h1 className="text-3xl font-bold text-white">
              Admin Login
            </h1>

            <p className="text-slate-400 text-sm mt-2">
              Secure access to your dashboard
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={submit} className="space-y-5">
            
            {/* EMAIL */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Email Address
              </label>

              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-all">
                <Mail size={18} className="text-slate-400 mr-3" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Password
              </label>

              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-all">
                <Lock size={18} className="text-slate-400 mr-3" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-white transition"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 transition"
              >
                Forgot Password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all text-white py-3 rounded-xl font-medium shadow-lg disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-slate-500">
              Protected Admin Panel • Secure Authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}