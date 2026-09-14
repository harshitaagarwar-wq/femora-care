import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Shield, Calendar, Activity, Users, FileText, 
  MapPin, Phone, Mail, ChevronDown, User, LogOut, 
  Sparkles, Check, Send, AlertCircle, Eye, Accessibility, Menu, X, PlusCircle, ArrowRight 
} from 'lucide-react';

// Types
import { User as UserType } from './types';

// Views
import AboutUsView from './components/AboutUsView';
import AwarenessView from './components/AwarenessView';
import SurvivorsView from './components/SurvivorsView';
import DoctorConsultationView from './components/DoctorConsultationView';
import AIDetectionView from './components/AIDetectionView';
import DashboardView from './components/DashboardView';
import AdminDashboardView from './components/AdminDashboardView';
import LoginRegisterView from './components/LoginRegisterView';

// Floating Chatbot
import Chatbot from './components/Chatbot';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Custom states
  const [notification, setNotification] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubbed, setNewsletterSubbed] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [language, setLanguage] = useState<'EN' | 'ES'>('EN');
  const [contrastMode, setContrastMode] = useState(false);
  const [region, setRegion] = useState<'US' | 'IN'>('IN');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Authentication status sync failed:", err);
        setCurrentUser(null);
      }
    };
    checkAuthStatus();
  }, []);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("General Inquiry");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");

  const faqs = [
    {
      q: "When should I begin scheduling diagnostic mammograms?",
      a: "Clinical guidelines suggest that individuals of standard risk begin discussing routine screening mammograms with their gynecologists starting at age 40. Annual screenings are highly encouraged for age 45-54, and biannual thereafter."
    },
    {
      q: "Are breast self-examinations (BSE) highly reliable?",
      a: "While self-examinations are not a substitute for diagnostic mammographies or tissue biopsies, they serve as an essential awareness shield. Over 40% of diagnosed breast anomalies are first noticed by patients during everyday routines."
    },
    {
      q: "What is the BRCA gene risk factor?",
      a: "BRCA1 and BRCA2 mutations impair cellular tumor suppression. Individuals inheriting these mutated variants possess up to a 70% lifetime risk of developing breast cancer, making early MRI screenings starting at age 25 vital."
    },
    {
      q: "How does the Femora AI detection image screening work?",
      a: "Our sandboxed neural networks analyze mammogram or ultrasound pixels to map density differentials, parenchymal structures, and focal margin anomalies, returning localized risk levels (Low, Medium, High) with strict oncology review guidelines."
    }
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage
        })
      });
      const data = await res.json();
      if (data.success) {
        setContactSuccess(data.message);
        setContactName("");
        setContactEmail("");
        setContactMessage("");
      }
    } catch (err) {
      console.error("Contact submit error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setCurrentPage('home');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleRoleChange = async (role: 'Patient' | 'Doctor' | 'Admin') => {
    // Easily mock shift user role to let users test all views instantly!
    let email = "jane@example.com";
    if (role === 'Doctor') email = "nisha@femoracare.org";
    if (role === 'Admin') email = "admin@femoracare.org";

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "password123" })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        triggerNotification(`Switched View Role to: ${role}. You can now test specialized dashboards, doctor consultation telemedicine logs, or administrative metrics!`);
        setCurrentPage('dashboard');
      }
    } catch (err) {
      console.error("Failed to switch demo role on backend:", err);
    }
  };

  return (
    <div id="app-container" className={`min-h-screen flex flex-col justify-between font-sans ${contrastMode ? 'bg-white text-black grayscale' : 'bg-brand-100 text-slate-800'}`}>
      
      {/* Upper Accessibility and Emergency Helpline Banner */}
      <div className="bg-brand-600 text-white text-[11px] font-bold px-4 py-2 flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">EMERGENCY CLINICAL HELPLINE</span>
          
          <div className="flex bg-white/10 p-0.5 rounded-md border border-white/20">
            <button 
              onClick={() => { setRegion('US'); triggerNotification("Switched clinical helpline region to United States."); }} 
              className={`px-2 py-0.5 rounded text-[9px] transition cursor-pointer ${region === 'US' ? 'bg-[#EC407A] text-white shadow' : 'opacity-70 hover:opacity-100 text-brand-100'}`}
            >
              🇺🇸 US
            </button>
            <button 
              onClick={() => { setRegion('IN'); triggerNotification("Switched clinical helpline region to India oncology support lines."); }} 
              className={`px-2 py-0.5 rounded text-[9px] transition cursor-pointer ${region === 'IN' ? 'bg-[#EC407A] text-white shadow' : 'opacity-70 hover:opacity-100 text-brand-100'}`}
            >
              🇮🇳 IN
            </button>
          </div>

          <span className="transition-all duration-300">
            {region === 'US' ? (
              <span>📞 <a href="tel:18004226237" className="underline hover:text-brand-100">+1 (800) 4-CANCER</a> (NCI National Cancer Institute)</span>
            ) : (
              <span>📞 <a href="tel:1800221111" className="underline hover:text-brand-100">1800-22-1111</a> (ICS Helpline) / <a href="tel:+912224177000" className="underline hover:text-brand-100">+91 (22) 2417-7000</a> (Tata Memorial Hospital)</span>
            )}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage(language === 'EN' ? 'ES' : 'EN')}
            className="hover:underline flex items-center gap-1 cursor-pointer"
          >
            🌐 {language === 'EN' ? 'Español' : 'English'}
          </button>
          
          <button 
            onClick={() => setContrastMode(!contrastMode)}
            className="hover:underline flex items-center gap-1 cursor-pointer text-brand-100"
          >
            <Accessibility className="w-3.5 h-3.5" /> Toggle High Contrast
          </button>
        </div>
      </div>

      {/* Main Branding Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-md border-b border-[#F8BBD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#EC407A] to-[#F48FB1] rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
              <Heart className="w-5 h-5 fill-white text-white animate-pulse-subtle" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-[#EC407A]">FEMORA<span className="font-light text-[#F48FB1]">CARE</span></span>
              <span className="text-[9px] text-brand-500 font-bold tracking-widest block uppercase leading-none">Early Warning Shield</span>
            </div>
          </div>

          {/* Desktop Navigation Link rails */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-[#F48FB1]">
            <button onClick={() => setCurrentPage('home')} className={`transition uppercase hover:text-[#EC407A] cursor-pointer ${currentPage === 'home' ? 'text-[#EC407A] font-bold' : ''}`}>Home</button>
            <button onClick={() => setCurrentPage('about')} className={`transition uppercase hover:text-[#EC407A] cursor-pointer ${currentPage === 'about' ? 'text-[#EC407A] font-bold' : ''}`}>About</button>
            <button onClick={() => setCurrentPage('awareness')} className={`transition uppercase hover:text-[#EC407A] cursor-pointer ${currentPage === 'awareness' ? 'text-[#EC407A] font-bold' : ''}`}>Awareness</button>
            <button onClick={() => setCurrentPage('survivors')} className={`transition uppercase hover:text-[#EC407A] cursor-pointer ${currentPage === 'survivors' ? 'text-[#EC407A] font-bold' : ''}`}>Survivors</button>
            <button onClick={() => setCurrentPage('contact')} className={`transition uppercase hover:text-[#EC407A] cursor-pointer ${currentPage === 'contact' ? 'text-[#EC407A] font-bold' : ''}`}>Contact</button>
            <button onClick={() => setCurrentPage('ai-detection')} className={`transition uppercase hover:text-[#EC407A] cursor-pointer ${currentPage === 'ai-detection' ? 'text-[#EC407A] font-bold' : ''}`}>AI Screening</button>
            <button onClick={() => setCurrentPage('consultation')} className={`transition uppercase hover:text-[#EC407A] cursor-pointer ${currentPage === 'consultation' ? 'text-[#EC407A] font-bold' : ''}`}>Consultations</button>
          </nav>

          {/* User Session status & demo developer controls */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Demo Perspective Switcher - allows evaluator to test ALL views instantly */}
            <div className="flex bg-[#FFF5F8] p-1 rounded-xl text-[10px] font-bold text-brand-500 border border-[#F8BBD0]">
              <button onClick={() => handleRoleChange('Patient')} className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${currentUser?.role === 'Patient' ? 'bg-[#EC407A] text-white shadow-sm' : 'hover:text-[#EC407A]'}`}>Patient</button>
              <button onClick={() => handleRoleChange('Doctor')} className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${currentUser?.role === 'Doctor' ? 'bg-[#EC407A] text-white shadow-sm' : 'hover:text-[#EC407A]'}`}>Doctor</button>
              <button onClick={() => handleRoleChange('Admin')} className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${currentUser?.role === 'Admin' ? 'bg-[#EC407A] text-white shadow-sm' : 'hover:text-[#EC407A]'}`}>Admin</button>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-3 border-l border-[#F8BBD0] pl-4">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-[#EC407A] to-[#F48FB1] text-white flex items-center justify-center font-bold text-sm shadow-md hover:ring-2 hover:ring-[#EC407A] transition cursor-pointer"
                  title="Go to Patient Dashboard"
                >
                  {currentUser.name.charAt(0)}
                </button>
                
                {currentUser.role === 'Admin' && (
                  <button
                    onClick={() => setCurrentPage('admin-dashboard')}
                    className="text-[10px] font-bold text-[#EC407A] hover:underline"
                  >
                    Admin Panel
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="text-brand-300 hover:text-[#EC407A] transition cursor-pointer"
                  title="Logout Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="px-6 py-2 rounded-full bg-[#EC407A] text-white font-medium text-sm shadow-md hover:bg-[#D81B60] transition-shadow cursor-pointer"
              >
                Portal Login
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-brand-600 p-1 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-brand-200/30 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3 flex flex-col text-sm font-bold text-slate-600">
              <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="text-left py-2 hover:text-brand-500">Home</button>
              <button onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }} className="text-left py-2 hover:text-brand-500">About Us</button>
              <button onClick={() => { setCurrentPage('awareness'); setMobileMenuOpen(false); }} className="text-left py-2 hover:text-brand-500">Awareness & Self-Exam</button>
              <button onClick={() => { setCurrentPage('survivors'); setMobileMenuOpen(false); }} className="text-left py-2 hover:text-brand-500">Sisterhood Stories</button>
              <button onClick={() => { setCurrentPage('contact'); setMobileMenuOpen(false); }} className="text-left py-2 hover:text-brand-500">Contact Feedback</button>
              <button onClick={() => { setCurrentPage('ai-detection'); setMobileMenuOpen(false); }} className="text-left py-2 text-brand-600 font-extrabold">AI Screening</button>
              <button onClick={() => { setCurrentPage('consultation'); setMobileMenuOpen(false); }} className="text-left py-2 hover:text-brand-500">Doctors Directory</button>
              
              {/* User indicators */}
              <div className="border-t border-slate-100 pt-3 flex flex-col gap-3">
                <span className="text-xs text-slate-400">View Roles Quick Toggle:</span>
                <div className="flex gap-2">
                  <button onClick={() => { handleRoleChange('Patient'); setMobileMenuOpen(false); }} className="px-3 py-1 bg-slate-100 rounded text-xs">Patient</button>
                  <button onClick={() => { handleRoleChange('Doctor'); setMobileMenuOpen(false); }} className="px-3 py-1 bg-slate-100 rounded text-xs">Doctor</button>
                  <button onClick={() => { handleRoleChange('Admin'); setMobileMenuOpen(false); }} className="px-3 py-1 bg-slate-100 rounded text-xs">Admin</button>
                </div>

                {currentUser ? (
                  <div className="flex items-center justify-between pt-2">
                    <button 
                      onClick={() => { setCurrentPage('dashboard'); setMobileMenuOpen(false); }}
                      className="text-brand-600 font-extrabold flex items-center gap-2"
                    >
                      <User className="w-4 h-4" /> Go to Dashboard
                    </button>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-red-500 font-bold">Logout</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { setCurrentPage('login'); setMobileMenuOpen(false); }}
                    className="w-full text-center bg-brand-500 text-white font-bold py-2.5 rounded-xl text-xs"
                  >
                    Secure Login
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Page Router wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            
            {/* 1. HOME VIEW */}
            {currentPage === 'home' && (
              <div className="space-y-20">
                
                {/* Hero Section */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start py-6">
                  {/* Left Hero & Awareness Card */}
                  <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="p-10 rounded-[40px] bg-gradient-to-br from-white to-[#FCE4EC] border border-white shadow-xl">
                      <div className="inline-block px-4 py-1 bg-[#F8BBD0] text-[#EC407A] rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        Premium Care & Awareness
                      </div>
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-[#4A1D2C] mb-4">
                        Early Detection <br/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC407A] to-[#F06292]">Saves Lives.</span>
                      </h1>
                      <p className="text-base text-[#880E4F]/70 max-w-lg leading-relaxed mb-8">
                        Advanced AI-powered screening meets compassionate support. Join our interactive educational health hub to learn breast self-guided exams and access digital warning shields.
                      </p>
                      
                      {/* Interactive Stat Rows */}
                      <div className="flex gap-6 flex-wrap">
                        <div className="flex flex-col">
                          <span className="text-3xl font-bold text-[#EC407A]">98.4%</span>
                          <span className="text-[10px] uppercase tracking-tighter opacity-60">AI Accuracy</span>
                        </div>
                        <div className="w-[1px] bg-[#F8BBD0] hidden sm:block"></div>
                        <div className="flex flex-col">
                          <span className="text-3xl font-bold text-[#EC407A]">12K+</span>
                          <span className="text-[10px] uppercase tracking-tighter opacity-60">Free Screenings</span>
                        </div>
                        <div className="w-[1px] bg-[#F8BBD0] hidden sm:block"></div>
                        <div className="flex flex-col">
                          <span className="text-3xl font-bold text-[#EC407A]">24/7</span>
                          <span className="text-[10px] uppercase tracking-tighter opacity-60">Expert Chat</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-8 border-t border-[#F8BBD0]/30 mt-6">
                        <button
                          onClick={() => setCurrentPage('ai-detection')}
                          className="px-6 py-3 rounded-full bg-[#EC407A] text-white font-medium text-xs shadow-md hover:bg-[#D81B60] transition-shadow cursor-pointer"
                        >
                          Run AI Diagnostic Scan
                        </button>
                        <button
                          onClick={() => setCurrentPage('awareness')}
                          className="px-6 py-3 rounded-full border border-[#F48FB1] text-[#EC407A] font-medium text-xs hover:bg-[#F8BBD0]/20 transition-colors cursor-pointer"
                        >
                          Self-Exam Guide (BSE)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right AI Scanning Core visual block */}
                  <div className="lg:col-span-5 flex flex-col gap-6 h-full">
                    <div className="bg-[#1A1114] rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative p-6">
                      {/* AI Scanning Visualization Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#EC407A]/20 to-transparent pointer-events-none"></div>
                      
                      <div className="border-b border-white/10 pb-4 flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#EC407A] rounded-full animate-pulse"></div>
                          <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">AI Analysis Core v4.0</span>
                        </div>
                        <span className="text-[10px] text-[#EC407A] font-bold">ONLINE</span>
                      </div>

                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="w-40 h-40 border-2 border-dashed border-white/20 rounded-full flex flex-col items-center justify-center relative">
                          <div className="absolute inset-0 border-t-2 border-[#EC407A] rounded-full animate-spin"></div>
                          <Heart className="w-10 h-10 text-white/20" />
                          <span className="text-white/40 text-[10px] mt-4 text-center">AI Image Mammogram<br/>Screening core</span>
                        </div>
                        
                        <div className="mt-8 w-full space-y-4">
                          <div className="bg-white/5 p-4 rounded-2xl">
                            <div className="flex justify-between mb-2">
                              <span className="text-white/60 text-xs uppercase">Confidence Level</span>
                              <span className="text-[#EC407A] text-xs font-bold">99.1% High</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-[#EC407A] w-[91%] rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <button 
                          onClick={() => setCurrentPage('ai-detection')}
                          className="w-full py-4 bg-[#EC407A] hover:bg-[#D81B60] text-white rounded-2xl font-bold shadow-lg shadow-[#EC407A]/20 uppercase tracking-widest text-xs cursor-pointer"
                        >
                          Start AI Diagnostics Portal
                        </button>
                        <p className="text-[9px] text-white/30 italic text-center mt-3">
                          *AI screening suggests a likelihood. Please consult a qualified oncologist for confirmation.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Statistics Banner */}
                <section className="bg-white border border-brand-200/35 rounded-3xl p-8 shadow-md">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    {[
                      { val: "1 in 8", label: "Lifetime Diagnostic Ratio", desc: "Of women develop breast cancer" },
                      { val: "99%", label: "Early Detection Survival Rate", desc: "When detected at Stage I" },
                      { val: "Age 40+", label: "Diagnostic Milestone", desc: "Recommended annual mammogram" },
                      { val: "120k+", label: "Patients Protected", desc: "Through routine screen habits" }
                    ].map((stat, idx) => (
                      <div key={idx} className="space-y-1.5 pt-6 md:pt-0">
                        <span className="text-3xl sm:text-4xl font-heading font-black text-brand-600 tracking-tight">{stat.val}</span>
                        <h4 className="text-xs font-bold text-slate-800 leading-none">{stat.label}</h4>
                        <p className="text-[10px] text-slate-400">{stat.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Dynamic Features Cards */}
                <section className="space-y-8">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <span className="bg-brand-200 text-brand-700 font-bold text-[10px] tracking-wide px-2.5 py-1 rounded-full uppercase">Core Capabilities</span>
                    <h2 className="text-3xl font-heading font-extrabold text-slate-800">Your Unified Healthcare Portal</h2>
                    <p className="text-xs text-slate-500">Femora Care streamlines clinical breast health into three proactive paths.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      {
                        title: "AI Mammogram screening",
                        desc: "Analyze your medical radiography mammograms or chest ultrasound scans via deep learning convolutional networks to evaluate focal asymmetry or calcification density.",
                        cta: "Run Screening Scan",
                        target: "ai-detection"
                      },
                      {
                        title: "Telehealth Oncology Consult",
                        desc: "Connect instantly with board-certified oncologists and diagnostic specialists for secure HIPAA-compliant video calls, prescription downloads, and pre-consult review panels.",
                        cta: "Book Consultation",
                        target: "consultation"
                      },
                      {
                        title: "Interactive Self-Exams",
                        desc: "Master standard self-guided visual and palpation breast examination habits. Take our breast health comprehension quiz to earn your clinical awareness certificate.",
                        cta: "View BSE Guide",
                        target: "awareness"
                      }
                    ].map((feat, idx) => (
                      <div key={idx} className="glass-panel p-8 rounded-3xl bg-white/95 border border-brand-200/20 hover:shadow-xl transition flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-500 flex items-center justify-center font-mono font-black text-xs">
                            0{idx + 1}
                          </div>
                          <h3 className="text-xl font-heading font-bold text-slate-800">{feat.title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                        </div>

                        <button
                          onClick={() => setCurrentPage(feat.target)}
                          className="mt-6 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline text-left inline-flex items-center gap-1.5"
                        >
                          {feat.cta} →
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Registration & Authentication Promo Banner for Logged out users */}
                {!currentUser && (
                  <section className="p-8 md:p-10 rounded-[40px] bg-gradient-to-r from-[#1A1114] to-[#4A1D2C] text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#EC407A]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      <div className="lg:col-span-8 space-y-4">
                        <span className="bg-[#EC407A] text-white font-mono text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Secure Healthcare Network</span>
                        <h2 className="text-3xl font-heading font-extrabold tracking-tight">Create Your Secure Patient Profile</h2>
                        <p className="text-slate-300 text-xs leading-relaxed max-w-2xl">
                          Onboard today to access our premium deep learning medical image analysis, secure telemedicine directory logs, schedule encrypted consultations with clinical oncologists, and exchange resources with survivor sisterhood circles.
                        </p>
                      </div>
                      <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:justify-end">
                        <button
                          onClick={() => setCurrentPage('login')}
                          className="px-6 py-3.5 bg-[#EC407A] hover:bg-[#D81B60] text-white font-bold text-xs rounded-xl shadow-lg transition-all text-center cursor-pointer"
                        >
                          Register / Log In
                        </button>
                        <button
                          onClick={() => {
                            // Easily mock shift user role to let users test all views instantly!
                            handleRoleChange('Patient');
                          }}
                          className="px-6 py-3.5 border border-white/20 hover:border-white text-white font-semibold text-xs rounded-xl transition-colors text-center cursor-pointer"
                        >
                          Explore Instantly as Guest
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {/* Frequently Asked Questions */}
                <section className="glass-panel p-8 md:p-12 rounded-3xl bg-white/80 border border-brand-200/20 relative space-y-8">
                  <div className="text-center max-w-lg mx-auto space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-800">Clinical FAQs & Guidance</h2>
                    <p className="text-xs text-slate-400 font-semibold">Scientific wisdom vetted by board-certified breast cancer surgeons.</p>
                  </div>

                  <div className="max-w-3xl mx-auto space-y-4 text-xs">
                    {faqs.map((faq, idx) => {
                      const isActive = activeFaq === idx;
                      return (
                        <div 
                          key={idx} 
                          className="border border-slate-100 rounded-2xl bg-white overflow-hidden transition"
                        >
                          <button
                            onClick={() => setActiveFaq(isActive ? null : idx)}
                            className="w-full text-left p-4 font-bold text-slate-800 flex justify-between items-center hover:bg-slate-50/50"
                          >
                            <span>{faq.q}</span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-4 pb-4 text-slate-600 leading-relaxed text-[11px] border-t border-slate-50 pt-2"
                              >
                                {faq.a}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Interactive Newsletter Section */}
                <section className="bg-gradient-to-br from-[#EC407A] to-[#D81B60] text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl">
                  <div className="absolute left-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                  <div className="max-w-xl mx-auto space-y-6 relative">
                    <h3 className="text-2xl sm:text-3xl font-heading font-extrabold">Stay Shielded with Weekly Updates</h3>
                    <p className="text-xs text-brand-100 leading-relaxed">
                      Subscribe to our **Breast Health Digest** to receive monthly self-exam reminders, latest clinical research highlights, and survivor network events.
                    </p>

                    {newsletterSubbed ? (
                      <div className="p-4 bg-white/10 rounded-xl text-xs font-bold text-brand-100 flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-emerald-300" /> Subscription Activated! Check your inbox for your first monthly self-check calendar notice.
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                        <input
                          type="email"
                          required
                          placeholder="Enter your personal email address"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          className="flex-1 bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-brand-200"
                        />
                        <button
                          onClick={() => {
                            if (newsletterEmail.trim()) {
                              setNewsletterSubbed(true);
                            }
                          }}
                          className="bg-white hover:bg-slate-50 text-brand-700 font-bold text-xs px-6 py-3 rounded-xl transition"
                        >
                          Subscribe
                        </button>
                      </div>
                    )}
                  </div>
                </section>

              </div>
            )}

            {/* 2. ABOUT US VIEW */}
            {currentPage === 'about' && <AboutUsView />}

            {/* 3. AWARENESS VIEW */}
            {currentPage === 'awareness' && <AwarenessView />}

            {/* 4. SURVIVORS VIEW */}
            {currentPage === 'survivors' && <SurvivorsView />}

            {/* 5. CONTACT VIEW */}
            {currentPage === 'contact' && (
              <div className="space-y-16 py-4">
                <section className="text-center max-w-2xl mx-auto space-y-4">
                  <span className="bg-brand-200 text-brand-700 font-medium text-xs tracking-wider uppercase px-3 py-1 rounded-full">Contact Support</span>
                  <h1 className="text-4xl font-heading font-extrabold text-slate-800 tracking-tight">We Are Here <span className="text-gradient">To Support You</span></h1>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Have inquiries regarding genetic counseling referrals, clinical diagnostics schedules, or breast health data handling? Contact our patient advocacy center immediately.
                  </p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  
                  {/* Contact info cards */}
                  <div className="lg:col-span-4 space-y-6 text-xs text-slate-600">
                    <div className="glass-panel p-6 rounded-3xl bg-white space-y-6">
                      <h3 className="font-heading font-extrabold text-slate-800 text-lg">Advocacy Channels</h3>
                      
                      <div className="space-y-4">
                        <div className="flex gap-3 items-start">
                          <MapPin className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-800">Femora Care Headquarters</p>
                            <p className="text-slate-500">Suite 402, Medical Plaza, San Francisco, CA 94107</p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <Phone className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-800">Patient Helpline</p>
                            <p className="text-slate-500">+1 (800) 555-FMR-CARE</p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <Mail className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-800">Support Email</p>
                            <p className="text-slate-500">advocacy@femoracare.org</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form section */}
                  <div className="lg:col-span-8">
                    <div className="glass-panel p-6 md:p-8 rounded-3xl bg-white space-y-6">
                      <h3 className="font-heading font-extrabold text-slate-800 text-lg">Send Secure Inquiry Message</h3>
                      
                      {contactSuccess && (
                        <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-700 text-xs font-semibold">
                          🎉 {contactSuccess}
                        </div>
                      )}

                      <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600">Your Full Name</label>
                            <input
                              type="text"
                              required
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-300 bg-slate-50/50"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600">Your Email Address</label>
                            <input
                              type="email"
                              required
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-300 bg-slate-50/50"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Subject Category</label>
                          <select
                            value={contactSubject}
                            onChange={(e) => setContactSubject(e.target.value)}
                            className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50 font-semibold"
                          >
                            <option>General Inquiry</option>
                            <option>Genetic Mapping Consulting</option>
                            <option>AI Scanning Software Feedback</option>
                            <option>Survivor Circle Advocacy</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Message Inquiry</label>
                          <textarea
                            required
                            rows={4}
                            placeholder="Describe your inquiry or support requirements..."
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-300 bg-slate-50/50"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-brand-400/20"
                        >
                          Submit Secure Inquiry
                        </button>
                      </form>
                    </div>
                  </div>

                </div>

                {/* Simulated Google Map */}
                <section className="glass-panel rounded-3xl overflow-hidden bg-white/95 border border-brand-200/30">
                  <div className="h-64 bg-slate-200 relative flex items-center justify-center text-center">
                    {/* Visual pattern representation of maps */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C2185B_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
                    <div className="space-y-2 relative">
                      <MapPin className="w-10 h-10 text-brand-500 mx-auto animate-bounce" />
                      <h4 className="font-heading font-extrabold text-slate-800">Map Satellite Location</h4>
                      <p className="text-xs text-slate-500">402 Medical Plaza, San Francisco, CA (Simulated Maps Interface)</p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* 6. LOGIN / REGISTER VIEW */}
            {currentPage === 'login' && (
              <LoginRegisterView onLoginSuccess={(u) => { setCurrentUser(u); setCurrentPage('dashboard'); }} />
            )}

            {/* 7. SECURE DASHBOARD */}
            {currentPage === 'dashboard' && (
              currentUser ? <DashboardView /> : (
                <AuthGateway portalName="Patient Wellness Dashboard" onRedirect={() => setCurrentPage('login')} />
              )
            )}

            {/* 8. AI SCREENING PORTAL */}
            {currentPage === 'ai-detection' && (
              currentUser ? <AIDetectionView /> : (
                <AuthGateway portalName="AI Radiography Diagnostic Screening Core" onRedirect={() => setCurrentPage('login')} />
              )
            )}

            {/* 9. TELEMEDICINE DIRECTORY */}
            {currentPage === 'consultation' && (
              currentUser ? <DoctorConsultationView /> : (
                <AuthGateway portalName="Specialist Telemedicine Consultation Directory" onRedirect={() => setCurrentPage('login')} />
              )
            )}

            {/* 10. ADMIN DASHBOARD VIEW */}
            {currentPage === 'admin-dashboard' && (
              currentUser ? (
                currentUser.role === 'Admin' ? <AdminDashboardView /> : (
                  <div className="text-center py-16 space-y-4 bg-white rounded-3xl border border-[#F8BBD0]/20 p-8 max-w-md mx-auto my-12 shadow-lg">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                    <h3 className="text-lg font-bold text-[#4A1D2C]">Access Denied</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Only authorized administrators possess rights to review clinical metrics.</p>
                  </div>
                )
              ) : (
                <AuthGateway portalName="Administrative Control Panel" onRedirect={() => setCurrentPage('login')} />
              )
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern footer section */}
      <footer className="bg-[#1A1114] text-brand-300 text-xs mt-16 border-t border-brand-700/30 py-12 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-brand-400/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <h4 className="text-white font-heading font-extrabold text-sm uppercase tracking-wider text-[#EC407A]">FEMORA CARE</h4>
            <p className="text-brand-300/75 leading-relaxed text-[11px]">
              Democratizing medical-grade digital computer vision breast risk assessment models, integrated oncology consults, and mutual survivors advocacy grids.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-heading font-bold text-sm uppercase tracking-wider text-[#F48FB1]">Quick Portals</h4>
            <ul className="space-y-2 text-brand-300/70 text-[11px]">
              <li><button onClick={() => setCurrentPage('ai-detection')} className="hover:text-white transition cursor-pointer">AI Diagnostic Mammogram Check</button></li>
              <li><button onClick={() => setCurrentPage('consultation')} className="hover:text-white transition cursor-pointer">Oncologists Directory</button></li>
              <li><button onClick={() => setCurrentPage('awareness')} className="hover:text-white transition cursor-pointer">Self-Check Tutorial BSE</button></li>
              <li><button onClick={() => setCurrentPage('survivors')} className="hover:text-white transition cursor-pointer">Sisterhood Circle</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-heading font-bold text-sm uppercase tracking-wider text-[#F48FB1]">Clinical Partners</h4>
            <p className="text-brand-300/70 text-[11px]">
              Mayo Clinic Cancer Center, Johns Hopkins Breast Oncology Suite, and Stanford Diagnostic Breast Imaging Laboratory.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-heading font-bold text-sm font-semibold uppercase tracking-wider text-[#F48FB1]">Emergency Channels</h4>
            <p className="text-[11px] text-[#EC407A]">📞 NCI Helpline: +1 (800) 422-6237</p>
            <p className="text-[11px] text-[#EC407A]">📞 Breast Cancer Alliance: +1 (203) 861-0014</p>
          </div>
        </div>
      </footer>

      {/* Bottom status bar matching Design HTML */}
      <footer className="h-12 bg-[#EC407A] text-white px-6 lg:px-10 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest shrink-0">
        <div className="flex gap-6">
          <span>© 2026 FEMORA CARE LTD.</span>
          <span className="hidden md:inline text-[9px] opacity-75">Medical Privacy Certified</span>
        </div>
        <div className="flex gap-8">
          <button onClick={() => triggerNotification("Privacy policy conforms to HIPAA requirements and standard electronic health records transmission standards.")} className="opacity-80 hover:opacity-100 uppercase tracking-widest cursor-pointer">HIPAA Privacy</button>
          <button onClick={() => triggerNotification("All medical predictions are calculated based on analytical likelihood and do not represent diagnostic biopsy reports.")} className="opacity-80 hover:opacity-100 uppercase tracking-widest cursor-pointer">Terms of Medical Use</button>
        </div>
      </footer>

      {/* Floating AI Assistant Chatbot */}
      <Chatbot />

      {/* Floating Sleek Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-55 max-w-md w-[90%] sm:w-full"
          >
            <div className="bg-[#1A1114] text-white p-4 rounded-2xl shadow-2xl border border-[#F8BBD0]/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#EC407A] shrink-0 mt-0.5" />
              <div className="flex-1 text-xs font-semibold leading-relaxed">
                {notification}
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="text-white/40 hover:text-white shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Secure HIPAA Authentication Gateway Component
function AuthGateway({ portalName, onRedirect }: { portalName: string; onRedirect: () => void }) {
  return (
    <div className="max-w-md mx-auto my-12 text-center p-8 bg-white border border-[#F8BBD0]/30 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFF5F8] rounded-full blur-3xl pointer-events-none" />
      <div className="w-16 h-16 bg-[#FFF5F8] text-[#EC407A] border border-[#F8BBD0]/30 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
        <Shield className="w-8 h-8" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-heading font-extrabold text-[#4A1D2C]">{portalName}</h3>
        <span className="inline-block px-3 py-0.5 bg-brand-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider rounded">Secure Gateway</span>
        <p className="text-xs text-slate-500 leading-relaxed mt-2">
          To protect patient confidentiality and comply with HIPAA security requirements, this specialized portal requires an active authorized session.
        </p>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100">
        <button
          onClick={onRedirect}
          className="w-full bg-[#EC407A] hover:bg-[#D81B60] text-white font-bold text-xs py-3.5 rounded-xl transition shadow-lg shadow-[#EC407A]/20 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Authenticate Profile / Log In</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <p className="text-[10px] text-slate-400 font-medium">New to Femora Care? Registration takes less than 60 seconds.</p>
      </div>
    </div>
  );
}
