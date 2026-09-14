import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, Video, MessageSquare, Star, FileText, Download, Upload, CheckCircle, Clock, VideoOff, Send, PhoneCall } from 'lucide-react';
import { Doctor, Appointment } from '../types';
import NishaAvatar from '../assets/images/regenerated_image_1782893632878.webp';
import RajeevAvatar from '../assets/images/rajeev_agarwal_avatar_1782894559146.jpg';
import SthitiAvatar from '../assets/images/sthiti_das_avatar_1782895533491.jpg';
import MuzammilAvatar from '../assets/images/muzammil_shaikh_avatar_1782895549430.jpg';

const getDoctorAvatar = (docId: string, defaultAvatar: string) => {
  if (docId === 'doc-1') return NishaAvatar;
  if (docId === 'doc-2') return RajeevAvatar;
  if (docId === 'doc-3') return SthitiAvatar;
  if (docId === 'doc-4') return MuzammilAvatar;
  return defaultAvatar;
};

const getDoctorSpecialty = (docId: string, defaultSpecialty: string) => {
  if (docId === 'doc-1') return "Surgical Oncologist & Breast Specialist";
  if (docId === 'doc-2') return "Clinical Breast Oncologist";
  if (docId === 'doc-3') return "Breast Imaging Specialist (Radiology)";
  if (docId === 'doc-4') return "Oncogeneticist & Risk Consultant";
  return defaultSpecialty;
};

export default function DoctorConsultationView() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [bookingDoc, setBookingDoc] = useState<Doctor | null>(null);
  
  // Form fields
  const [bookDate, setBookDate] = useState("2026-07-05");
  const [bookTime, setBookTime] = useState("10:30 AM");
  const [bookType, setBookType] = useState<'Chat' | 'Video' | 'In-Person'>("Video");
  const [submitting, setSubmitting] = useState(false);
  const [bookSuccess, setBookSuccess] = useState(false);

  // Active Consult State
  const [activeConsultation, setActiveConsultation] = useState<Appointment | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: 'patient' | 'doctor', text: string, time: string }[]>([
    { sender: 'doctor', text: "Hello! I have reviewed your screening submission. How are you feeling today?", time: "02:00 PM" }
  ]);

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");
      const data = await res.json();
      if (data.doctors) setDoctors(data.doctors);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (data.appointments) setAppointments(data.appointments);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoc) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: bookingDoc.id,
          date: bookDate,
          time: bookTime,
          type: bookType
        })
      });
      const data = await res.json();
      if (data.success) {
        setBookSuccess(true);
        fetchAppointments();
        setTimeout(() => {
          setBookSuccess(false);
          setBookingDoc(null);
        }, 3000);
      } else {
        alert(data.error || "Failed to schedule appointment.");
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
                          doc.hospital.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = filterSpecialty === "" || doc.specialty.includes(filterSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const downloadPrescription = (apt: Appointment) => {
    alert(`Downloading prescription details for appointment with ${apt.doctorName} on ${apt.date}. It contains structured medication indices, recommended clinical follow-ups, and biometric parameters.`);
  };

  const handleUploadReport = (aptId: string) => {
    alert(`File selection requested for Appointment: ${aptId}. You can attach MammoScans, Lab results, or DNA metrics to enrich the doctor's review context.`);
  };

  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return;
    const newLog = [...chatLog, { sender: 'patient' as const, text: chatMessage, time: "Just now" }];
    setChatLog(newLog);
    setChatMessage("");

    // Simulate response
    setTimeout(() => {
      setChatLog(prev => [...prev, {
        sender: 'doctor',
        text: "I understand. I am looking at your mammogram density reports now. We see symmetrical glandular distribution and no focal spiculated nodules. This is highly reassuring.",
        time: "Just now"
      }]);
    }, 2000);
  };

  return (
    <div className="space-y-16 py-4">
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="bg-[#FFF5F8] text-[#EC407A] border border-[#F8BBD0]/30 font-medium text-xs tracking-wider uppercase px-3 py-1 rounded-full">Oncology Consults</span>
        <h1 className="text-4xl font-heading font-extrabold text-[#4A1D2C] tracking-tight">
          Consult Certified <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC407A] to-[#F06292]">Oncology Experts</span>
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Book absolute secure, HIPAA-compliant telehealth consultations. Consult with expert surgical breast oncologists, clinical radiologists, and diagnostic specialists through instant chat or secure video calls.
        </p>
      </section>

      {/* teleconsult active room */}
      {activeConsultation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-6 md:p-8 text-white grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Active room details */}
          <div className="lg:col-span-12 flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 bg-red-500 rounded-full animate-ping shrink-0" />
              <div>
                <h3 className="font-heading font-extrabold text-base">Active Consultation Suite</h3>
                <p className="text-xs text-slate-400">Dr. {activeConsultation.doctorName} ({activeConsultation.doctorSpecialty})</p>
              </div>
            </div>
            <button
              onClick={() => setActiveConsultation(null)}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition"
            >
              Exit Suite
            </button>
          </div>

          {/* Video stream panel */}
          <div className="lg:col-span-7 h-[360px] bg-slate-950 rounded-2xl relative border border-slate-800 flex items-center justify-center overflow-hidden">
            {activeConsultation.type === 'Video' ? (
              <div className="w-full h-full flex flex-col justify-between p-6">
                <div className="flex justify-between">
                  <span className="bg-slate-900/80 px-3 py-1 rounded-lg text-xs font-mono border border-slate-800">
                    🔴 HD CONNECTED
                  </span>
                  <span className="bg-slate-900/80 px-3 py-1 rounded-lg text-xs font-mono border border-slate-800">
                    SECURE (TLS 1.3)
                  </span>
                </div>
                
                {/* Doctor Avatar simulated inside call */}
                <div className="text-center space-y-3">
                  <div className="w-24 h-24 rounded-full border-4 border-brand-300 mx-auto overflow-hidden shadow-lg">
                    <img src={getDoctorAvatar(activeConsultation.doctorId, "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200")} alt={activeConsultation.doctorName} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-heading font-bold text-lg">{activeConsultation.doctorName}</h4>
                  <p className="text-xs text-slate-400">{getDoctorSpecialty(activeConsultation.doctorId, "Oncology Surgeon | Patient Advisor")}</p>
                </div>

                <div className="flex gap-4 justify-center">
                  <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center transition border border-slate-700">
                    Mic
                  </button>
                  <button className="w-10 h-10 bg-slate-850 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center transition border border-slate-750">
                    Cam
                  </button>
                  <button className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition">
                    End Call
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <VideoOff className="w-12 h-12 text-slate-600 mx-auto" />
                <div>
                  <h4 className="font-heading font-bold text-sm">Consultation Type: Instant Chat</h4>
                  <p className="text-xs text-slate-500">Video streaming disabled for this consult.</p>
                </div>
              </div>
            )}
          </div>

          {/* Secure chat panel */}
          <div className="lg:col-span-5 flex flex-col h-[360px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden justify-between">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
              Live Patient Chat Channel
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatLog.map((log, idx) => (
                <div key={idx} className={`flex flex-col ${log.sender === 'patient' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-xs ${
                    log.sender === 'patient' 
                      ? "bg-[#EC407A] text-white rounded-tr-none" 
                      : "bg-slate-850 text-slate-200 rounded-tl-none border border-slate-800"
                  }`}>
                    {log.text}
                  </div>
                  <span className="text-[9px] text-slate-500 px-1 mt-1">{log.time}</span>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-850 flex gap-2 bg-slate-900">
              <input
                type="text"
                placeholder={`Type your message to ${activeConsultation.doctorName}...`}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChatMessage();
                }}
                className="flex-1 bg-slate-950 text-xs px-4 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#EC407A] text-slate-200 border border-slate-800"
              />
              <button
                onClick={handleSendChatMessage}
                className="bg-[#EC407A] hover:bg-[#D81B60] text-white px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Directory Searching & Filters */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, clinic, or diagnostic specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-300"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setFilterSpecialty("")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterSpecialty === "" ? "bg-[#EC407A] text-white shadow" : "bg-white hover:bg-slate-50 border border-slate-100 text-slate-600"
              }`}
            >
              All Experts
            </button>
            <button
              onClick={() => setFilterSpecialty("Specialist")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterSpecialty === "Specialist" ? "bg-[#EC407A] text-white shadow" : "bg-white hover:bg-slate-50 border border-slate-100 text-slate-600"
              }`}
            >
              Breast Surgical Oncology
            </button>
            <button
              onClick={() => setFilterSpecialty("Radiology")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterSpecialty === "Radiology" ? "bg-[#EC407A] text-white shadow" : "bg-white hover:bg-slate-50 border border-slate-100 text-slate-600"
              }`}
            >
              Breast Radiology
            </button>
          </div>
        </div>

        {/* Doctor Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDoctors.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-3xl overflow-hidden bg-white/95 border border-brand-200/30 hover:shadow-lg transition-all flex flex-col"
            >
              <div className="h-44 overflow-hidden relative">
                <img src={getDoctorAvatar(doc.id, doc.avatar)} alt={doc.name} className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="text-xs font-bold text-slate-800">{doc.rating}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-[#4A1D2C] leading-snug">{doc.name}</h3>
                  <p className="text-[11px] font-semibold text-[#EC407A]">{doc.specialty}</p>
                  <p className="text-[10px] text-slate-400">{doc.hospital}</p>
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Experience: {doc.experience}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBookingDoc(doc)}
                      className="flex-1 bg-[#EC407A] hover:bg-[#D81B60] text-white text-xs font-bold py-2 rounded-xl transition shadow shadow-[#EC407A]/10 cursor-pointer"
                    >
                      Book Consult
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Appointment History & prescription download panel */}
      <section className="space-y-6">
        <h2 className="text-xl font-heading font-extrabold text-slate-800">Your Consultations & Records</h2>

        <div className="glass-panel rounded-3xl bg-white overflow-hidden border border-brand-200/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="p-4">Doctor & Specialty</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-800">
                      <div>
                        {apt.doctorName}
                        <p className="text-[10px] text-slate-400 font-normal">{apt.doctorSpecialty}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.date} • {apt.time}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        apt.type === 'Video' ? 'bg-sky-50 text-sky-600' : apt.type === 'Chat' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {apt.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                        apt.status === 'Upcoming' ? 'text-amber-500' : apt.status === 'Completed' ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        <Clock className="w-3 h-3" /> {apt.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        {apt.status === 'Upcoming' && (
                          <button
                            onClick={() => setActiveConsultation(apt)}
                            className="bg-[#EC407A] hover:bg-[#D81B60] text-white font-bold px-3 py-1.5 rounded-xl transition shadow shadow-[#EC407A]/25 cursor-pointer"
                          >
                            Enter Room
                          </button>
                        )}
                        <button
                          onClick={() => handleUploadReport(apt.id)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
                          title="Upload mammography images or ultrasound files for doctor's pre-consult review"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>
                        {apt.prescription && (
                          <button
                            onClick={() => downloadPrescription(apt)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-emerald-600 transition"
                            title="Download prescription and diagnostic orders"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Booking Form Dialog */}
      <AnimatePresence>
        {bookingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-brand-200/40 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                <div className="space-y-0.5">
                  <h3 className="font-heading font-extrabold text-[#4A1D2C] text-lg">Book Telehealth Session</h3>
                  <p className="text-xs text-[#EC407A]">With {bookingDoc.name}</p>
                </div>
                <button
                  onClick={() => setBookingDoc(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
                >
                  ✕
                </button>
              </div>

              {bookSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="font-heading font-bold text-slate-800">Booking Confirmed!</h4>
                  <p className="text-xs text-slate-500">Your telehealth session details are synced. Check your consultation log.</p>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Session Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { type: "Video", icon: Video },
                        { type: "Chat", icon: MessageSquare }
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setBookType(item.type as any)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer ${
                            bookType === item.type ? 'border-[#EC407A] bg-[#FFF5F8] text-[#EC407A]' : 'border-slate-100 hover:bg-slate-50'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Select Date</label>
                      <input
                        type="date"
                        required
                        value={bookDate}
                        onChange={(e) => setBookDate(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Select Time</label>
                      <input
                        type="text"
                        required
                        value={bookTime}
                        onChange={(e) => setBookTime(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-500 text-[11px] leading-relaxed">
                    🔔 Consultations are secure and encrypted. In-app consultations provide a prescription download upon completion.
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#EC407A] hover:bg-[#D81B60] text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-[#EC407A]/25 cursor-pointer"
                  >
                    {submitting ? "Booking session..." : `Confirm Session Booking`}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
