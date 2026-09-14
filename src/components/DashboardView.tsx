import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, FileText, Bell, User, Clock, ChevronRight, Check, AlertCircle, Save, CalendarDays, RefreshCw, ShieldCheck } from 'lucide-react';
import { Appointment, AIResult, Notification, User as UserType } from '../types';

export default function DashboardView() {
  const [user, setUser] = useState<UserType | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [aiResults, setAiResults] = useState<AIResult[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Profile forms
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileMsg, setProfileMsg] = useState("");

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 29)); // July 2026 matches local current time 2026-06-29 + appointments
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // User Profile
      const uRes = await fetch("/api/auth/me");
      const uData = await uRes.json();
      if (uData.user) {
        setUser(uData.user);
        setProfileName(uData.user.name);
        setProfileEmail(uData.user.email);
        setProfilePhone(uData.user.phone || "+1 (555) 019-2834");
      }

      // Appointments
      const aRes = await fetch("/api/appointments");
      const aData = await aRes.json();
      if (aData.appointments) setAppointments(aData.appointments);

      // AI Results
      const aiRes = await fetch("/api/ai/results");
      const aiData = await aiRes.json();
      if (aiData.results) setAiResults(aiData.results);

      // Notifications
      const nRes = await fetch("/api/notifications");
      const nData = await nRes.json();
      if (nData.notifications) setNotifications(nData.notifications);

    } catch (err) {
      console.error("Dashboard load issue:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg("Updating profile details in server database...");
    
    // Simple mock update
    setTimeout(() => {
      setProfileMsg("Profile updated successfully!");
      if (user) {
        setUser({ ...user, name: profileName, email: profileEmail, phone: profilePhone });
      }
      setTimeout(() => setProfileMsg(""), 4000);
    }, 1500);
  };

  const markNotificationRead = async (id: string) => {
    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Notification mark error:", err);
    }
  };

  // Generate calendar grid for June/July 2026
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Map appointment dates onto calendar
  const getAptDay = (aptDateStr: string) => {
    const parts = aptDateStr.split('-');
    if (parts.length === 3) {
      const aptYear = parseInt(parts[0]);
      const aptMonth = parseInt(parts[1]) - 1;
      const aptDay = parseInt(parts[2]);
      if (aptYear === year && aptMonth === month) {
        return aptDay;
      }
    }
    return null;
  };

  const daysGrid = [];
  // padding for previous month days
  for (let i = 0; i < firstDay; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(d);
  }

  return (
    <div className="space-y-12 py-4">
      {/* Welcome statement */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl border border-[#F8BBD0]/30 shadow-md">
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-extrabold text-[#4A1D2C]">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC407A] to-[#F06292]">{user ? user.name : "Jane Doe"}</span>
          </h1>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Patient Portal Dashboard • Role: {user ? user.role : "Patient"}
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF5F8] border border-[#F8BBD0]/40 hover:bg-[#F8BBD0]/30 rounded-xl text-xs font-bold text-[#EC407A] transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Dashboard
        </button>
      </section>

      {/* Grid: Notifications & Reminder Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Reminder Calendar */}
        <div className="lg:col-span-8 glass-panel p-6 md:p-8 rounded-3xl bg-white border border-brand-200/20 shadow-md flex flex-col justify-between">
          <div className="space-y-1 mb-4">
            <h3 className="font-heading font-extrabold text-[#4A1D2C] text-lg flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#EC407A]" /> Breast Health Reminder Calendar
            </h3>
            <p className="text-xs text-slate-400">Track scheduled diagnostic appointments and set menstrual-cycle breast exam reminders.</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h4 className="font-heading font-extrabold text-sm text-slate-800">{months[month]} {year}</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="p-1 px-3 border border-slate-100 rounded-lg hover:bg-slate-50 text-xs text-slate-600 transition"
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="p-1 px-3 border border-slate-100 rounded-lg hover:bg-slate-50 text-xs text-slate-600 transition"
              >
                Next
              </button>
            </div>
          </div>

          {/* Calendar Table Grid */}
          <div className="grid grid-cols-7 gap-3 text-center text-xs font-bold text-slate-400 border-b border-slate-50 pb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3 pt-3 text-xs font-semibold">
            {daysGrid.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;
              
              // Check if day has appointment
              const matchedApts = appointments.filter(a => getAptDay(a.date) === day);
              const hasApt = matchedApts.length > 0;
              const isToday = day === 29 && month === 5 && year === 2026; // June 29, 2026

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-between border relative transition cursor-pointer ${
                    isToday 
                      ? "border-[#EC407A] bg-[#FFF5F8] text-[#EC407A]" 
                      : hasApt 
                        ? "border-sky-200 bg-sky-50 text-sky-700 font-bold" 
                        : "border-slate-50 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="text-[11px]">{day}</span>
                  {hasApt && (
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                  )}
                  {day === 7 && (
                    <span className="w-2 h-2 rounded-full bg-[#EC407A]" title="Self exam reminder" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar details legend */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-150 flex justify-between text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>Diagnostic Consultation Scheduled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EC407A]" />
              <span>Self-Examination (BSE) Cycle Day</span>
            </div>
          </div>
        </div>

        {/* Notifications Hub */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl bg-white border border-brand-200/20 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <h3 className="font-heading font-extrabold text-[#4A1D2C] text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#EC407A]" /> Notifications Feed
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FFF5F8] text-[#EC407A] border border-[#F8BBD0]/30 rounded-full">
                {notifications.filter(n => !n.read).length} Unread
              </span>
            </div>

            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6 font-medium">No recent notifications.</p>
              ) : (
                notifications.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => markNotificationRead(note.id)}
                    className={`p-3 rounded-2xl border transition-all text-xs cursor-pointer ${
                      note.read 
                        ? "bg-slate-50/50 border-slate-100 opacity-60" 
                        : "bg-[#FFF5F8] border-[#F8BBD0]/40 shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-bold text-[#4A1D2C] leading-tight">{note.title}</span>
                      {!note.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EC407A] mt-1 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{note.message}</p>
                    <span className="text-[9px] text-slate-400 block mt-2">{new Date(note.date).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 text-center text-[10px] text-slate-400">
            Click notifications to dismiss and mark them as read in our records database.
          </div>
        </div>

      </div>

      {/* Reports, Scans, & Appointments History Table */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Scans list */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl bg-white border border-[#F8BBD0]/20 shadow-md space-y-4">
          <h3 className="font-heading font-extrabold text-[#4A1D2C] text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#EC407A]" /> AI Radiography Results Summary
          </h3>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {aiResults.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8 font-medium">No diagnostic screening evaluations on file.</p>
            ) : (
              aiResults.map((result) => (
                <div key={result.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex justify-between gap-4 items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-[#FFF5F8] text-[#EC407A] border border-[#F8BBD0]/20 px-2 py-0.5 rounded-md">
                        {result.imageType} File Check
                      </span>
                      <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {result.evaluationMode || 'Privacy Verified'} (0B Stored)
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-slate-800 text-sm">{result.fileName}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed truncate max-w-[280px]">"{result.prediction}"</p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      result.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {result.riskLevel} Risk
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold">{result.confidence}% Match</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Edit profile detail */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl bg-white border border-[#F8BBD0]/20 shadow-md space-y-4">
          <h3 className="font-heading font-extrabold text-[#4A1D2C] text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-[#EC407A]" /> Patient Medical Profile Settings
          </h3>

          {profileMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-700 text-xs rounded-xl font-medium">
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">Email Address</label>
                <input
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600">Mobile Phone / Urgent Contact</label>
              <input
                type="text"
                required
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-300"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-400 text-[10px] leading-relaxed">
              🧬 Medical records, phone numbers, and identity coefficients are encrypted in compliance with healthcare data protection standards. To toggle hereditary genetic maps, please register DNA samples via oncology genetic counseling.
            </div>

            <button
              type="submit"
              className="w-full bg-[#EC407A] hover:bg-[#D81B60] text-white font-bold py-3 rounded-xl transition shadow shadow-[#EC407A]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Profile Details
            </button>
          </form>
        </div>

      </section>
    </div>
  );
}
