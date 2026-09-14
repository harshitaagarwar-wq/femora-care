import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ShieldAlert, CheckCircle, RefreshCw, KeyRound, User, ArrowRight, Sparkles } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginRegisterViewProps {
  onLoginSuccess: (user: UserType) => void;
}

export default function LoginRegisterView({ onLoginSuccess }: LoginRegisterViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'Patient' | 'Doctor' | 'Admin'>("Patient");
  const [rememberMe, setRememberMe] = useState(true);

  // Verification stage
  const [otpStage, setOtpStage] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    if (isLogin) {
      // Login flow
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        setLoading(false);
        if (data.success) {
          setSuccessMsg("Welcome to Femora Care!");
          setTimeout(() => {
            onLoginSuccess(data.user);
          }, 1200);
        } else {
          setErrorMsg(data.error || "Login credentials incorrect.");
        }
      } catch (err) {
        setLoading(false);
        setErrorMsg("Error contacting server auth endpoints.");
      }
    } else {
      // Register flow -> generate simulated OTP
      setLoading(false);
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(randomOtp);
      setOtpStage(true);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (otpCode !== generatedOtp) {
      setErrorMsg("Verification code incorrect. Please use the simulated OTP code below.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setSuccessMsg("Account verified and registered successfully!");
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1500);
      } else {
        setErrorMsg(data.error || "Failed to finalize registration.");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg("Error committing registration to database.");
    }
  };

  const mockGoogleLogin = () => {
    setSuccessMsg("Authenticating with Google Account (Simulated OAuth Loop)...");
    setTimeout(() => {
      const mockUser: UserType = {
        id: "user-1",
        name: "Jane Doe (Google)",
        email: email || "jane.google@example.com",
        role: "Patient",
        joinedAt: new Date().toISOString()
      };
      onLoginSuccess(mockUser);
    }, 1200);
  };

  return (
    <div className="max-w-md w-full mx-auto py-8">
      <motion.div
        layout
        className="glass-panel p-8 rounded-3xl bg-white border border-brand-200/40 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#FFF5F8] rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-heading font-black text-[#4A1D2C] tracking-tight">
            FEMORA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC407A] to-[#F06292]">CARE</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {otpStage 
              ? "Verify your secure healthcare credentials" 
              : isLogin 
                ? "Secure access to breast wellness portals" 
                : "Register early warning patient profiles"
            }
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-150 rounded-xl text-red-700 text-xs flex gap-2 items-start mb-6">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-750 text-xs flex gap-2 items-start mb-6">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {otpStage ? (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-6"
            >
              {/* Simulated OTP Display Container */}
              <div className="p-4 bg-[#FFF5F8] border border-[#F8BBD0]/30 rounded-2xl space-y-2 text-center shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#EC407A]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>DEMO SECURE CODE DISPATCHED</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  We've simulated sending a HIPAA-compliant verification token to <strong className="text-slate-700">{email || "your email"}</strong>.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="font-mono text-base font-black tracking-widest text-[#EC407A] bg-white border border-[#F8BBD0]/30 px-3 py-1 rounded-lg shadow-sm">
                    {generatedOtp}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCode(generatedOtp);
                    }}
                    className="px-2.5 py-1 text-[#EC407A] hover:bg-[#EC407A] hover:text-white border border-[#EC407A]/30 text-[10px] font-bold rounded-lg transition-all bg-white cursor-pointer flex items-center gap-1"
                  >
                    <span>Autofill</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-[#EC407A]" /> One-Time Password (OTP)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit verification code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center font-mono text-base tracking-widest px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EC407A]"
                />
                <p className="text-[10px] text-slate-400 mt-1">Please enter the simulated verification token or click Autofill above.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#EC407A] hover:bg-[#D81B60] text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-[#EC407A]/20 cursor-pointer"
              >
                {loading ? "Verifying code..." : "Finalize Verification"}
              </button>

              <button
                type="button"
                onClick={() => setOtpStage(false)}
                className="w-full text-center text-xs text-slate-400 font-semibold hover:text-slate-600 transition"
              >
                Cancel & Go Back
              </button>
            </motion.form>
          ) : (
            <motion.form
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleAuth}
              className="space-y-5 text-xs"
            >
              {!isLogin && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#EC407A]" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your first and last name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EC407A] bg-slate-50/50"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-600 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#EC407A]" /> Email Address
                  </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EC407A] bg-slate-50/50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#EC407A]" /> Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EC407A] bg-slate-50/50"
                />
              </div>

              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-600">Account Type Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Patient', 'Doctor', 'Admin'] as const).map(item => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setRole(item)}
                        className={`p-2 rounded-xl border font-bold text-[10px] transition cursor-pointer ${
                          role === item ? 'border-[#EC407A] bg-[#FFF5F8] text-[#EC407A]' : 'border-slate-100 hover:bg-slate-50 text-slate-500'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-[#EC407A] accent-[#EC407A]"
                    />
                    <span>Remember Me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setSuccessMsg("Simulated Password Reset Email queued. Please check your associated address.")}
                    className="text-[#EC407A] hover:text-[#D81B60] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#EC407A] hover:bg-[#D81B60] text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-[#EC407A]/25 flex items-center justify-center gap-1 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : isLogin ? "Secure Login" : "Register Profile"} <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Federated Login Separator */}
              <div className="relative my-4 text-center">
                <span className="absolute inset-x-0 top-1/2 h-px bg-slate-100" />
                <span className="relative bg-white px-2.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or continue with</span>
              </div>

              <button
                type="button"
                onClick={mockGoogleLogin}
                className="w-full border border-slate-200 hover:bg-slate-50/50 py-3 rounded-xl text-slate-600 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.13-3.13C17.45 1.84 14.93 1 12 1 7.35 1 3.39 3.65 1.42 7.5l3.79 2.94C6.12 7.37 8.87 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.44c-.28 1.47-1.11 2.71-2.36 3.55v2.94h3.79c2.22-2.05 3.62-5.07 3.62-8.58z" />
                  <path fill="#FBBC05" d="M5.21 10.44C4.96 11.22 4.8 12.06 4.8 12.93s.16 1.71.41 2.49l-3.79 2.94C.52 16.59 0 14.82 0 12.93s.52-3.66 1.42-5.43l3.79 2.94z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.92l-3.79-2.94c-1.1.74-2.52 1.18-4.17 1.18-3.13 0-5.88-2.33-6.79-5.4l-3.79 2.94C3.39 20.35 7.35 23 12 23z" />
                </svg>
                <span>Google Account Auth</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-slate-500 font-semibold hover:text-[#EC407A] transition cursor-pointer"
                >
                  {isLogin ? "Don't have a patient account? Register" : "Already have an account? Login"}
                </button>
              </div>

            </motion.form>
          )}
        </AnimatePresence>

        {/* Quick Demo Accounts for Testing */}
        <div className="bg-[#FFF5F8] border border-[#F8BBD0]/30 rounded-2xl p-4 space-y-2 mt-6 text-left">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EC407A] block">Quick Demo Logins</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail("jane@example.com");
                setPassword("password123");
                setIsLogin(true);
              }}
              className="p-1.5 bg-white hover:bg-[#FFF5F8] border border-[#F8BBD0]/20 text-slate-700 hover:text-[#EC407A] text-[10px] font-bold rounded-lg text-center transition cursor-pointer"
            >
              Jane (Patient)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("nisha@femoracare.org");
                setPassword("password123");
                setIsLogin(true);
              }}
              className="p-1.5 bg-white hover:bg-[#FFF5F8] border border-[#F8BBD0]/20 text-slate-700 hover:text-[#EC407A] text-[10px] font-bold rounded-lg text-center transition cursor-pointer"
            >
              Nisha (Doctor)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@femoracare.org");
                setPassword("password123");
                setIsLogin(true);
              }}
              className="p-1.5 bg-white hover:bg-[#FFF5F8] border border-[#F8BBD0]/20 text-slate-700 hover:text-[#EC407A] text-[10px] font-bold rounded-lg text-center transition cursor-pointer"
            >
              Femora (Admin)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
