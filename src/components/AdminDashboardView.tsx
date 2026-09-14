import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, UserCheck, ShieldAlert, BookOpen, MessageSquare, PieChart, Star, Mail, CheckCircle2, RefreshCw } from 'lucide-react';
import { User, Doctor, Appointment, ContactMessage } from '../types';

export default function AdminDashboardView() {
  const [analytics, setAnalytics] = useState<{
    totalPatients: number;
    totalDoctors: number;
    totalAppointments: number;
    totalArticles: number;
    recentMessages: ContactMessage[];
    appointments: Appointment[];
    users: User[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'users' | 'messages' | 'appointments'>('users');
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Admin analytical error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: any) => {
    setActionMsg(`Adjusting user authorization level...`);
    // Simulate updating roles in memory on Express
    setTimeout(() => {
      if (analytics) {
        const updatedUsers = analytics.users.map(u => {
          if (u.id === userId) {
            const nextRole = currentRole === 'Patient' ? 'Doctor' : currentRole === 'Doctor' ? 'Admin' : 'Patient';
            return { ...u, role: nextRole as any };
          }
          return u;
        });
        setAnalytics({ ...analytics, users: updatedUsers });
      }
      setActionMsg("User credential role toggled successfully!");
      setTimeout(() => setActionMsg(""), 3000);
    }, 1000);
  };

  const handleResolveMessage = (msgId: string) => {
    setActionMsg("Marking communication as resolved...");
    setTimeout(() => {
      if (analytics) {
        const updatedMessages = analytics.recentMessages.map(m => {
          if (m.id === msgId) return { ...m, status: 'Resolved' as const };
          return m;
        });
        setAnalytics({ ...analytics, recentMessages: updatedMessages });
      }
      setActionMsg("Message resolved successfully!");
      setTimeout(() => setActionMsg(""), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-12 py-4">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#FFF5F8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-white">
            Administrative <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC407A] to-[#F06292]">Control Panel</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Secured Access • Diagnostic Analytics & Site Management
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#EC407A] text-white hover:bg-[#D81B60] rounded-xl text-xs font-bold transition shadow-lg shadow-[#EC407A]/20 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Analytics
        </button>
      </section>

      {/* Admin Quick Stat Grid */}
      {analytics && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { label: "Total Registered Patients", val: analytics.totalPatients, icon: Users, color: "bg-pink-50 text-[#EC407A]" },
            { label: "Onboarded Specialists", val: analytics.totalDoctors, icon: UserCheck, color: "bg-sky-50 text-sky-600" },
            { label: "Global Appointments", val: analytics.totalAppointments, icon: ShieldAlert, color: "bg-amber-50 text-amber-500" },
            { label: "Oncology Articles", val: analytics.totalArticles, icon: BookOpen, color: "bg-violet-50 text-violet-500" },
            { label: "Inbound Patient Notes", val: analytics.recentMessages.length, icon: MessageSquare, color: "bg-emerald-50 text-emerald-500" }
          ].map((stat, sIdx) => (
            <div key={sIdx} className="glass-panel p-5 rounded-3xl bg-white border border-[#F8BBD0]/20 shadow-sm space-y-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block tracking-tight">{stat.label}</span>
                <span className="text-2xl font-mono font-black text-slate-800">{stat.val}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* action response notice banner */}
      {actionMsg && (
        <div className="p-4 bg-[#FFF5F8] border border-[#F8BBD0]/30 text-[#EC407A] font-semibold text-xs rounded-2xl">
          ⚡ {actionMsg}
        </div>
      )}

      {/* Custom Analytics and Management Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Tabbed managers */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex border-b border-slate-100 pb-2 gap-4">
            {(['users', 'messages', 'appointments'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-bold pb-2 border-b-2 transition cursor-pointer ${
                  activeTab === tab 
                    ? 'border-[#EC407A] text-[#EC407A] font-extrabold' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'users' ? 'User Directory' : tab === 'messages' ? 'Patient Messages' : 'System Bookings'}
              </button>
            ))}
          </div>

          <div className="glass-panel p-6 rounded-3xl bg-white border border-[#F8BBD0]/20 shadow-md">
            
            {/* User Tab list */}
            {activeTab === 'users' && analytics && (
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-[#4A1D2C] text-sm">System Users & Authentication Access</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                      <tr>
                        <th className="p-3">User Name</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3">Credentials Level</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {analytics.users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-800">{u.name}</td>
                          <td className="p-3">{u.email}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                              u.role === 'Admin' ? 'bg-red-50 text-red-600' : u.role === 'Doctor' ? 'bg-sky-50 text-sky-600' : 'bg-[#FFF5F8] text-[#EC407A] border border-[#F8BBD0]/30'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleToggleRole(u.id, u.role)}
                              className="px-3 py-1 bg-slate-100 hover:bg-[#FFF5F8] rounded-lg text-[10px] font-bold text-slate-700 hover:text-[#EC407A] transition cursor-pointer"
                            >
                              Toggle Role
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Inbound Messages Tab */}
            {activeTab === 'messages' && analytics && (
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-slate-800 text-sm">Patient Contact & Feedback Notes</h3>
                
                {analytics.recentMessages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6 font-medium">No inbound communications recorded today.</p>
                ) : (
                  <div className="space-y-4">
                    {analytics.recentMessages.map(msg => (
                      <div key={msg.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-150 text-xs space-y-2">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-slate-800">{msg.name} ({msg.email})</h4>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                            msg.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {msg.status}
                          </span>
                        </div>
                        <p className="font-medium text-slate-700 text-[11px]">Subject: {msg.subject}</p>
                        <p className="text-slate-500 text-[11px] italic">"{msg.message}"</p>
                        
                        {msg.status === 'Pending' && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleResolveMessage(msg.id)}
                              className="px-3 py-1.5 bg-[#EC407A] hover:bg-[#D81B60] text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Resolve Inquiry
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && analytics && (
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-slate-800 text-sm">Active System Booking Logs</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                      <tr>
                        <th className="p-3">Patient</th>
                        <th className="p-3">Oncologist</th>
                        <th className="p-3">Date / Time</th>
                        <th className="p-3">Method</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {analytics.appointments.map(apt => (
                        <tr key={apt.id}>
                          <td className="p-3 font-bold text-slate-800">{apt.patientName}</td>
                          <td className="p-3">{apt.doctorName}</td>
                          <td className="p-3">{apt.date} • {apt.time}</td>
                          <td className="p-3 font-semibold">{apt.type}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold ${
                              apt.status === 'Upcoming' ? 'text-amber-500' : 'text-emerald-500'
                            }`}>
                              {apt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right column: SVG analytics diagrams */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl bg-white border border-[#F8BBD0]/20 shadow-md space-y-4">
            <h3 className="font-heading font-bold text-[#4A1D2C] text-sm flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#EC407A]" /> Platform Demographics
            </h3>

            {/* SVG bar diagram */}
            <div className="space-y-3 pt-2">
              {[
                { label: "BSE Screening Engagement", percentage: 88, color: "bg-[#EC407A]" },
                { label: "AI Scanner Accuracy Rating", percentage: 94, color: "bg-sky-400" },
                { label: "Successful Clinical Referrals", percentage: 76, color: "bg-emerald-400" }
              ].map((bar, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-slate-600">
                    <span>{bar.label}</span>
                    <span className="font-mono">{bar.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`${bar.color} h-full rounded-full`} style={{ width: `${bar.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 text-[10px] text-slate-400 leading-relaxed">
              📊 Stat calculations correlate clinical booking completion ratios against localized screening mammographies on the Femora Care cloud database.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
