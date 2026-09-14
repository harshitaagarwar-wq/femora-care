import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Eye, Compass, Heart, Award, ArrowRight, Calendar, Users, Briefcase } from 'lucide-react';
import NishaAvatar from '../assets/images/regenerated_image_1782893632878.webp';
import RajeevAvatar from '../assets/images/rajeev_agarwal_avatar_1782894559146.jpg';

export default function AboutUsView() {
  const [activeTimeline, setActiveTimeline] = useState(3);

  const timelineEvents = [
    {
      year: "2020",
      title: "The Genesis",
      desc: "Inspired by a personal family struggle with Stage III breast cancer, a small team of oncologists, radiologists, and software engineers joined forces to build a digital platform focused on early, self-led detection.",
      icon: Heart
    },
    {
      year: "2022",
      title: "Clinical Pilot",
      desc: "Launched a randomized control trial in three municipal health clinics to evaluate the efficacy of structured mobile breast self-examination guides. Resulted in a 38% increase in screening adherence.",
      icon: Target
    },
    {
      year: "2024",
      title: "AI Diagnostic Synergy",
      desc: "Co-developed our cloud-based convolutional neural networks (CNNs) with state radiologists, training models on anonymous mammograms and ultrasound images for high-accuracy risk sorting.",
      icon: Award
    },
    {
      year: "2026",
      title: "Femora Care Unified Ecosystem",
      desc: "Introduced the comprehensive modern web portal integrating AI-assisted imaging screening, live genetic risk analysis, certified oncologist teleconsulting, and survivor mutual aid circles.",
      icon: Shield
    }
  ];

  const team = [
    {
      name: "Dr. Nisha Hariharan",
      role: "Founder & Chief Medical Officer",
      bio: "14+ years in breast surgical oncology. Dr. Hariharan leads clinical guidelines and advocates for localized digital screening methods.",
      img: NishaAvatar
    },
    {
      name: "Samantha Knowles",
      role: "Survivor Liaison & Advocacy Lead",
      bio: "Stage III breast cancer survivor since 2022. Samantha manages community support programs, survivors circles, and patient resource kits.",
      img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Dr. Rajeev Agarwal",
      role: "Director of Clinical Research",
      bio: "Clinical oncologist and researcher with 18+ years exp. Oversees medical validity and coordinate multi-center screening trials.",
      img: RajeevAvatar
    },
    {
      name: "Elena Rostova",
      role: "Lead AI Engineer & Data Architect",
      bio: "Specialist in Deep Learning & Medical Image Processing. Formerly developed cellular classification models at Stanford AI Lab.",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
    }
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFF5F8] text-[#EC407A] font-medium text-xs tracking-wider uppercase px-3 py-1 rounded-full border border-[#F8BBD0]/30"
        >
          Our Story
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-heading font-extrabold text-[#4A1D2C] tracking-tight"
        >
          Democratizing Early <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC407A] to-[#F06292]">Breast Cancer Detection</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600 leading-relaxed"
        >
          Femora Care is a comprehensive digital oncology ecosystem designed to bridge the gap between high-tech AI diagnostic screening and everyday self-led health practices. We empower women with early screening mechanisms, doctor access, and sisterhood.
        </motion.p>
      </section>

      {/* Grid: Mission, Vision, Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Our Mission",
            icon: Target,
            text: "To eliminate diagnostic delays in breast cancer by providing absolute access to self-guided screening courses, reliable image risk models, and direct board-certified clinical consultations.",
            bg: "from-pink-50 to-pink-100/40"
          },
          {
            title: "Our Vision",
            icon: Eye,
            text: "A world where zero cases of breast cancer progress undetected beyond Stage I. We envision localized, cloud-based early warnings becoming a standard human habit everywhere.",
            bg: "from-rose-50 to-rose-100/40"
          },
          {
            title: "Our Values",
            icon: Compass,
            text: "Medical-grade precision, absolute patient anonymity, compassionate survivors support, and transparent patient advocacy. Every model, tip, and consultation has scientific integrity.",
            bg: "from-pink-50 to-pink-100/30"
          }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-panel p-8 rounded-3xl bg-gradient-to-br ${item.bg} hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8BBD0]/10 rounded-full blur-2xl group-hover:bg-[#F8BBD0]/20 transition-all duration-300" />
            <div className="bg-[#EC407A] text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-[#EC407A]/20 mb-6">
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-800 mb-3">{item.title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{item.text}</p>
          </motion.div>
        ))}
      </section>

      {/* Interactive Timeline Journey */}
      <section className="glass-panel p-8 md:p-12 rounded-3xl bg-white/80 space-y-8 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF5F8] via-transparent to-transparent rounded-3xl pointer-events-none" />
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-heading font-extrabold text-[#4A1D2C]">Our Journey & Milestones</h2>
          <p className="text-sm text-slate-500">How a small grassroots oncology project grew into a multi-national digital shield.</p>
        </div>

        {/* Timeline Desktop Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-4xl mx-auto border-b border-[#F8BBD0]/30 pb-6">
          {timelineEvents.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTimeline(idx)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all text-left cursor-pointer ${
                activeTimeline === idx
                  ? "bg-[#EC407A] text-white shadow-lg shadow-[#EC407A]/20"
                  : "hover:bg-[#F8BBD0]/20 text-slate-600"
              }`}
            >
              <span className={`text-xs font-mono font-extrabold px-2 py-1 rounded-lg ${
                activeTimeline === idx ? "bg-white/20" : "bg-[#F8BBD0]/30"
              }`}>{item.year}</span>
              <span className="font-heading font-bold text-sm tracking-tight">{item.title}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Display */}
        <motion.div
          key={activeTimeline}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-4xl mx-auto py-4"
        >
          <div className="md:col-span-3 flex justify-center">
            <div className="bg-[#FFF5F8] border border-[#F8BBD0]/30 w-24 h-24 rounded-3xl flex items-center justify-center">
              {(() => {
                const Icon = timelineEvents[activeTimeline].icon;
                return <Icon className="w-12 h-12 text-[#EC407A]" />;
              })()}
            </div>
          </div>
          <div className="md:col-span-9 space-y-3">
            <span className="text-xs font-mono font-extrabold text-[#EC407A] bg-[#FFF5F8] border border-[#F8BBD0]/20 px-2 py-0.5 rounded-md">
              Year {timelineEvents[activeTimeline].year}
            </span>
            <h3 className="text-2xl font-heading font-extrabold text-slate-800">{timelineEvents[activeTimeline].title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{timelineEvents[activeTimeline].desc}</p>
          </div>
        </motion.div>
      </section>

      {/* Meet Team Section */}
      <section className="space-y-8">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <span className="bg-[#FFF5F8] text-[#EC407A] border border-[#F8BBD0]/30 font-medium text-xs px-2.5 py-0.5 rounded-full">Oncology Leadership</span>
          <h2 className="text-3xl font-heading font-extrabold text-[#4A1D2C]">Meet Our Expert Advisory</h2>
          <p className="text-sm text-slate-500">Board-certified specialists, survivors, and deep-learning engineers.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="glass-panel rounded-3xl overflow-hidden bg-white/95 border border-brand-200/30 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover object-center hover:scale-105 transition-all duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-[#4A1D2C] leading-tight">{member.name}</h4>
                  <p className="text-xs font-semibold text-[#EC407A]">{member.role}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed flex-1">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
