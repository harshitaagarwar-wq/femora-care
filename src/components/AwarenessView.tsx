import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Sparkles, BookOpen, Info, CheckCircle2, AlertCircle, RefreshCw, Award, Download, ArrowRight, Play, Check } from 'lucide-react';

export default function AwarenessView() {
  const [examStep, setExamStep] = useState(0);
  const [activeSymptom, setActiveSymptom] = useState<number | null>(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Symptoms dataset
  const symptoms = [
    {
      title: "Hard localized Lump",
      desc: "A lump that feels firm, distinct from surrounding tissue, typically painless, and has irregular borders.",
      tip: "If felt, note its location relative to your breast quadrants (e.g., upper outer quadrant) and report immediately.",
      bg: "bg-red-50 border-red-200"
    },
    {
      title: "Skin Dimpling or Puckering",
      desc: "Skin that resembles an orange peel (peau d'orange), causing small indentations or pulling inward.",
      tip: "Check while raising arms in front of a mirror to see if the skin pulls asymmetrically.",
      bg: "bg-pink-50 border-pink-200"
    },
    {
      title: "Nipple Inversion or Discharge",
      desc: "A nipple that pulls inward suddenly, or spontaneous, clear, or blood-tinged nipple discharge.",
      tip: "Normal discharge can happen under compression, but fluid release without touching requires review.",
      bg: "bg-amber-50 border-amber-200"
    },
    {
      title: "Asymmetrical Swelling or Redness",
      desc: "Heat, intense swelling, or a rash covering more than one-third of the breast without thermal causes.",
      tip: "Often a sign of standard cellular inflammation or rarely inflammatory breast cancer. Seek clinical advice.",
      bg: "bg-orange-50 border-orange-200"
    }
  ];

  // Self exam steps dataset
  const selfExamSteps = [
    {
      title: "Step 1: The Visual Mirror Check",
      desc: "Stand in front of a mirror with shoulders straight and arms on your hips. Inspect both breasts for normal shape, size, color, or swelling. Look for visible distortion, skin dimpling, or nipple retraction.",
      detail: "Check for any uneven contour or protrusion before moving to movement-based checks."
    },
    {
      title: "Step 2: Raising the Arms",
      desc: "Now, raise your arms high overhead and repeat the visual examination. Look for the same changes. Look for whether both breasts elevate symmetrically and check if there is any fluid discharge from the nipples.",
      detail: "Raising your chest muscles stretches tissues, highlighting internal structural pulling."
    },
    {
      title: "Step 3: Discharge Inspection",
      desc: "Look closely at your nipples for any signs of fluid, discharge, scaling, or crusting. Gently press on each nipple to confirm whether there is any spontaneous clear, milky, yellow fluid, or blood leaking.",
      detail: "Discharge from only one breast or that occurs without pressing is a major flag."
    },
    {
      title: "Step 4: Palpation While Lying Down",
      desc: "Lie down on your back. Place a pillow under your right shoulder and put your right hand behind your head. Use your left hand's three middle fingers to feel your right breast. Use small circular motions.",
      detail: "Move in a systematic vertical pattern from your collarbone down to your lower rib cage, covering the entire breast."
    },
    {
      title: "Step 5: Palpation While Standing/Shower",
      desc: "Finally, feel your breasts while standing or in the shower. Many women find that wet, soapy skin makes it easier to feel internal tissue structures. Cover your entire breast and armpit area.",
      detail: "Use a consistent finger pressure level (light, medium, firm) to feel different tissue depths."
    }
  ];

  // Quiz questions
  const quizQuestions = [
    {
      question: "How often is it recommended for women to perform a breast self-examination (BSE)?",
      options: [
        "Once a week",
        "Once a month, 5-7 days after the period ends",
        "Only once a year during a physical exam",
        "Every six months"
      ],
      correct: 1,
      explanation: "A monthly breast self-examination is the standard cadence. Doing it 5 to 7 days after your menstrual cycle ends ensures your breasts are least tender or swollen."
    },
    {
      question: "Which of the following genes is most commonly associated with hereditary breast cancer risk?",
      options: [
        "TP53 and APOE",
        "BRCA1 and BRCA2",
        "insulin and glucagon",
        "HER2-neu only"
      ],
      correct: 1,
      explanation: "Mutations in BRCA1 and BRCA2 genes significantly increase the lifetime risk of developing breast and ovarian cancer. Genetic counseling helps determine preventive courses."
    },
    {
      question: "True or False: Most breast lumps found during self-examinations are cancerous.",
      options: [
        "True - almost all lumps indicate malignant breast tumors",
        "False - roughly 80% of lumps found are benign (cysts, fibroadenomas, or infections)"
      ],
      correct: 1,
      explanation: "Roughly 80% of breast lumps evaluated clinically are diagnosed as benign. However, you should never guess—always consult Dr. Nisha Hariharan or get a mammogram."
    },
    {
      question: "At what age should women of average risk discuss beginning annual or biannual screening mammograms?",
      options: [
        "Age 40",
        "Age 60",
        "Age 21",
        "Only after they find a physical lump"
      ],
      correct: 0,
      explanation: "Most medical guidelines suggest women of standard risk begin discussing routine screening mammograms at age 40, as early identification before physical symptoms appear is life-saving."
    },
    {
      question: "What is the primary action you should take if you discover a firm, painless breast lump?",
      options: [
        "Wait a few months to see if it dissolves naturally",
        "Immediately search online forums for diagnostic checklists",
        "Book a clinical consult with an oncologist or schedule a mammogram",
        "Squeeze it firmly to resolve any possible blockage"
      ],
      correct: 2,
      explanation: "Never wait or attempt to self-diagnose. Booking a professional breast consultation immediately is the safest and most effective strategy."
    }
  ];

  const handleSelectAnswer = (ansIdx: number) => {
    const updated = [...selectedAnswers];
    updated[currentQuestion] = ansIdx;
    setSelectedAnswers(updated);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      let correctCount = 0;
      selectedAnswers.forEach((ans, idx) => {
        if (ans === quizQuestions[idx].correct) correctCount++;
      });
      setQuizScore(correctCount);
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setQuizScore(null);
    setQuizFinished(false);
    setQuizStarted(false);
  };

  const downloadGuide = () => {
    alert("Downloading Femora Care's 'Breast Self-Examination Companion Guide.pdf' (Simulated Download). In a production system, this sends an optimized booklet containing illustrations and symptom diaries.");
  };

  return (
    <div className="space-y-16 py-4">
      {/* Intro section */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="bg-[#FFF5F8] text-[#EC407A] border border-[#F8BBD0]/30 font-medium text-xs tracking-wider uppercase px-3 py-1 rounded-full">Awareness Portal</span>
        <h1 className="text-4xl font-heading font-extrabold text-[#4A1D2C] tracking-tight">
          Knowledge is your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC407A] to-[#F06292]">Most Powerful Defense</span>
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Understanding the warning signs, genetics, and standard self-inspection practices transforms anxiety into empowering medical literacy. Read our evidence-based clinical guides.
        </p>
      </section>

      {/* Symptoms and Signs grid */}
      <section className="space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-heading font-extrabold text-[#4A1D2C]">4 Symptoms to Monitor</h2>
          <p className="text-xs text-slate-500">Click each physical warning sign to view detailed clinical observations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {symptoms.map((sym, idx) => (
            <div
              key={idx}
              onClick={() => setActiveSymptom(idx)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer ${sym.bg} ${
                activeSymptom === idx 
                  ? "shadow-md ring-2 ring-[#EC407A] scale-[1.02]" 
                  : "hover:shadow-sm opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-mono font-bold text-slate-400">0{idx + 1}</span>
                <div className={`w-2.5 h-2.5 rounded-full ${activeSymptom === idx ? 'bg-[#EC407A]' : 'bg-slate-300'}`} />
              </div>
              <h3 className="font-heading font-bold text-[#4A1D2C] text-base mb-2">{sym.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{sym.desc}</p>
            </div>
          ))}
        </div>

        {activeSymptom !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-3xl bg-[#FFF5F8]/50 border border-[#F8BBD0]/50 max-w-3xl mx-auto flex gap-4 items-start"
          >
            <Info className="w-5 h-5 text-[#EC407A] shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-[#EC407A]">Clinical Radiography Note on "{symptoms[activeSymptom].title}":</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{symptoms[activeSymptom].tip}</p>
            </div>
          </motion.div>
        )}
      </section>

      {/* Prevention, Treatment, and Genetics information grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Genetics Card */}
        <div className="glass-panel p-8 rounded-3xl bg-white space-y-6">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-heading font-bold text-slate-800">BRCA1 & BRCA2 Genetics</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hereditary breast cancers account for 5% to 10% of total diagnoses. Inheriting mutated copies of BRCA1 or BRCA2 genes impairs your cells' ability to auto-repair damaged DNA, raising risks.
          </p>
          <ul className="space-y-2 text-xs text-slate-500">
            <li className="flex items-center gap-2"><Check className="w-4 / 4 text-violet-500 shrink-0" /> Recommended genetic counseling for strong family history.</li>
            <li className="flex items-center gap-2"><Check className="w-4 / 4 text-violet-500 shrink-0" /> Annual MRI scans as a secondary shield.</li>
          </ul>
        </div>

        {/* Lifestyle Prevention Card */}
        <div className="glass-panel p-8 rounded-3xl bg-white space-y-6">
          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-[#EC407A]">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-heading font-bold text-[#4A1D2C]">Lifestyle Prevention</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            While genes can determine susceptibility, you can actively modify your lifestyle triggers. Clinical studies indicate that metabolic factors and high inflammatory diets affect tissue health.
          </p>
          <ul className="space-y-2 text-xs text-slate-500">
            <li className="flex items-center gap-2"><Check className="w-4 / 4 text-[#EC407A] shrink-0" /> Engage in 150+ mins of weekly moderate cardio.</li>
            <li className="flex items-center gap-2"><Check className="w-4 / 4 text-[#EC407A] shrink-0" /> High-fiber, anti-inflammatory Mediterranean nutrition.</li>
          </ul>
        </div>

        {/* Treatment Pathways Card */}
        <div className="glass-panel p-8 rounded-3xl bg-white space-y-6">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-heading font-bold text-slate-800">Modern Treatment Paths</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Breast cancer therapeutics have advanced dramatically, focusing on localized target-specific interventions over invasive chemotherapy wherever clinical markers allow.
          </p>
          <ul className="space-y-2 text-xs text-slate-500">
            <li className="flex items-center gap-2"><Check className="w-4 / 4 text-sky-500 shrink-0" /> Surgical Lumpectomy vs Mastectomy.</li>
            <li className="flex items-center gap-2"><Check className="w-4 / 4 text-sky-500 shrink-0" /> Hormone receptor-targeted (HER2, ER/PR) therapies.</li>
          </ul>
        </div>
      </section>

      {/* Interactive Self Examination Steps */}
      <section className="glass-panel p-8 md:p-12 rounded-3xl bg-[#FFF5F8]/30 border border-[#F8BBD0]/40 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-4 space-y-4">
            <span className="bg-[#FFF5F8] text-[#EC407A] border border-[#F8BBD0]/30 font-mono font-bold text-xs px-2.5 py-1 rounded-md">
              BSE COMPANION
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-[#4A1D2C]">How to Perform a Self-Exam</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conducting this simple 5-step examination once a month helps build deep awareness of your typical tissue topography, allowing you to instantly identify anomalies.
            </p>
            <button
              onClick={downloadGuide}
              className="inline-flex items-center gap-2 bg-[#EC407A] text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-[#D81B60] transition shadow-md shadow-[#EC407A]/20 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Guidebook PDF
            </button>
          </div>

          <div className="md:col-span-8 bg-white/90 p-6 md:p-8 rounded-2xl border border-[#F8BBD0]/30 shadow-lg space-y-6 relative overflow-hidden">
            {/* Step navigation dots */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-semibold text-[#EC407A]">Step {examStep + 1} of {selfExamSteps.length}</span>
              <div className="flex gap-1">
                {selfExamSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setExamStep(idx)}
                    className={`w-5 h-1.5 rounded-full transition-all cursor-pointer ${examStep === idx ? 'bg-[#EC407A] w-8' : 'bg-[#F8BBD0]/60 hover:bg-[#F8BBD0]'}`}
                  />
                ))}
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={examStep}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-heading font-extrabold text-[#4A1D2C]">{selfExamSteps[examStep].title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{selfExamSteps[examStep].desc}</p>
                <div className="p-4 rounded-xl bg-[#FFF5F8] text-[11px] text-[#EC407A] leading-relaxed italic border border-[#F8BBD0]/20">
                  ⚠️ {selfExamSteps[examStep].detail}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Nav */}
            <div className="flex justify-between items-center pt-2">
              <button
                disabled={examStep === 0}
                onClick={() => setExamStep(examStep - 1)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 disabled:opacity-40 transition"
              >
                Previous Step
              </button>
              <button
                disabled={examStep === selfExamSteps.length - 1}
                onClick={() => setExamStep(examStep + 1)}
                className="text-xs font-semibold text-[#EC407A] hover:text-[#D81B60] disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Awareness Quiz */}
      <section className="glass-panel p-8 md:p-12 rounded-3xl bg-gradient-to-tr from-[#FFF5F8] to-white/90 shadow-xl border border-[#F8BBD0]/40">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {!quizStarted ? (
            <div className="text-center space-y-6 py-6">
              <div className="w-14 h-14 bg-[#EC407A] text-white rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-[#EC407A]/20 animate-subtle-wave">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-heading font-extrabold text-[#4A1D2C]">Test Your Breast Health Literacy</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-lg mx-auto">
                  Earn your digital **Breast Awareness Certificate** by completing our clinical 5-question comprehension assessment. Empower your logic.
                </p>
              </div>
              <button
                onClick={() => setQuizStarted(true)}
                className="bg-[#EC407A] text-white font-semibold text-xs px-6 py-3 rounded-xl hover:bg-[#D81B60] transition shadow-lg shadow-[#EC407A]/25 inline-flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white text-white" /> Start Health Literacy Quiz
              </button>
            </div>
          ) : quizFinished ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 py-4"
            >
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-3xl font-heading font-extrabold text-slate-800">Quiz Completed!</h3>
                <p className="text-sm text-slate-500">
                  Your final score: <span className="font-mono font-bold text-lg text-emerald-600">{quizScore} / {quizQuestions.length}</span> ({(quizScore! / quizQuestions.length) * 100}%)
                </p>
              </div>

              {quizScore! >= 4 ? (
                <div className="border border-amber-200 bg-amber-50/40 p-6 rounded-2xl max-w-md mx-auto space-y-3">
                  <Award className="w-8 h-8 text-amber-500 mx-auto" />
                  <h4 className="font-heading font-bold text-sm text-amber-800">Health Literacy Certificate Earned</h4>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    This certifies that the user has completed the Femora Care standard Breast Cancer Detection and Early Self-Check examination literacy curriculum. Keep advocating for early screenings!
                  </p>
                </div>
              ) : (
                <p className="text-xs text-red-500 font-medium max-w-sm mx-auto">
                  We encourage you to review our self-examination guidelines and attempt the assessment again to master the breast wellness defense codes.
                </p>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRestartQuiz}
                  className="bg-brand-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-brand-600 transition flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Restart Assessment
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Question header */}
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Assessment Progress</span>
                <span className="font-semibold text-[#EC407A]">{currentQuestion + 1} of {quizQuestions.length}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#EC407A] h-full transition-all duration-300" style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }} />
              </div>

              {/* Question */}
              <div className="space-y-4">
                <h4 className="text-lg font-heading font-bold text-[#4A1D2C]">{quizQuestions[currentQuestion].question}</h4>
                
                <div className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[currentQuestion] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectAnswer(oIdx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? "bg-[#EC407A] text-white border-[#EC407A] font-medium shadow-md" 
                            : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50/50"
                        }`}
                      >
                        <span>{opt}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-white bg-white/20" : "border-slate-300"
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Answer Feedback / Explanation */}
              {selectedAnswers[currentQuestion] !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-150 flex gap-3 items-start text-xs"
                >
                  <Info className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-700">Health Fact Explanation:</span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{quizQuestions[currentQuestion].explanation}</p>
                  </div>
                </motion.div>
              )}

              {/* Footer navigation */}
              <div className="flex justify-end pt-2">
                <button
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  onClick={handleNextQuestion}
                  className="bg-slate-850 hover:bg-slate-800 text-slate-800 hover:text-white border border-slate-800 font-semibold text-xs px-6 py-2.5 rounded-xl disabled:opacity-40 transition"
                >
                  {currentQuestion === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                </button>
              </div>

            </div>
          )}

        </div>
      </section>

    </div>
  );
}
