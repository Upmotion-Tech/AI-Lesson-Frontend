import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { fetchAllCurricula } from "../store/curriculumThunks.js";
import { fetchAllStudentData } from "../store/studentDataThunks.js";
import { generateLesson } from "../store/lessonThunks.js";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import Select from "../components/common/Select.jsx";
import Loader from "../components/common/Loader.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import { 
  Sparkles, 
  BookOpen, 
  Users, 
  Zap, 
  ArrowRight, 
  ChevronRight, 
  AlertCircle,
  FileText,
  Target,
  BrainCircuit,
  Settings2,
  Rocket,
  Activity
} from "lucide-react";
import { toast } from "react-hot-toast";

const GenerateLessonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const { list: curricula } = useAppSelector((state) => state.curriculum);
  const { list: studentDataList } = useAppSelector((state) => state.studentData);
  const { status: lessonStatus } = useAppSelector((state) => state.lessons);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    curriculumId: location.state?.curriculumId || "",
    studentDataId: "",
    model: "gpt-4o-mini",
    tonality: "Engaging",
    focusArea: ""
  });

  useEffect(() => {
    dispatch(fetchAllCurricula());
    dispatch(fetchAllStudentData());
  }, [dispatch]);

  const handleGenerate = async () => {
    if (!formData.curriculumId || !formData.studentDataId) {
      toast.error("Please select both curriculum and student data");
      return;
    }

    try {
      const result = await dispatch(generateLesson(formData)).unwrap();
      toast.success("Lesson plan generated successfully!");
      if (result && result._id) {
        navigate(`/lessons/${result._id}`);
      } else {
        navigate("/lessons");
      }
    } catch (error) {
      toast.error(error || "Failed to generate lesson plan");
    }
  };

  const currentCurriculum = curricula.find(c => c._id === formData.curriculumId);
  const currentStudentData = studentDataList.find(s => s._id === formData.studentDataId);

  const steps = [
    { id: 1, title: "Curriculum", icon: BookOpen, desc: "Select Curriculum" },
    { id: 2, title: "Student Data", icon: Users, desc: "Select Student Data" },
    { id: 3, title: "Lesson Plan", icon: BrainCircuit, desc: "Generate Lesson Plan" }
  ];

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto space-y-12 pb-20">
        {/* Generative Header */}
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-700 text-sm font-black uppercase tracking-widest shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            Generate Lesson
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
              Create <span className="gradient-text">Personalized</span> Content
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
              Transform your core curriculum into high-impact, tiered lessons tailored to your specific student population.
            </p>
          </div>
        </div>

        {/* Multi-Step Indicator */}
        <div className="flex items-center justify-between max-w-3xl mx-auto px-4 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
          {steps.map((s, i) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
              <div 
                className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${
                  step >= s.id 
                    ? "bg-indigo-600 border-indigo-100 text-white shadow-xl shadow-indigo-500/20" 
                    : "bg-white border-slate-50 text-slate-300"
                }`}
              >
                <s.icon className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? "text-indigo-600" : "text-slate-400"}`}>
                  Step 0{s.id}
                </p>
                <p className={`text-sm font-bold truncate max-w-[100px] ${step >= s.id ? "text-slate-900" : "text-slate-400"}`}>
                  {s.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Generation Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <Card className="p-10 rounded-[3rem] border-none shadow-2xl shadow-indigo-500/5 bg-gradient-to-br from-white to-slate-50/50">
                    <div className="flex flex-col md:flex-row gap-12">
                      <div className="flex-1 space-y-8">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 mb-2">Curriculum Selection</h3>
                          <p className="text-muted-foreground font-medium">Select the base content for your lesson plan.</p>
                        </div>
                        
                        <div className="space-y-6">
                           {curricula.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {curricula.map((c) => (
                                <button
                                  key={c._id}
                                  onClick={() => setFormData({ ...formData, curriculumId: c._id })}
                                  className={`p-6 rounded-[2rem] text-left transition-all duration-300 border-2 ${
                                    formData.curriculumId === c._id
                                      ? "bg-indigo-50 border-indigo-600 shadow-lg shadow-indigo-500/10"
                                      : "bg-white border-slate-100 hover:border-indigo-200"
                                  }`}
                                >
                                  <div className="flex items-center gap-4 mb-3">
                                    <div className={`p-3 rounded-xl ${formData.curriculumId === c._id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                                      <FileText className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 line-clamp-1">{c.originalFilename}</h4>
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground">
                                    <Target className="h-3 w-3" />
                                    {c.gradeLevelEstimate ? `Grade ${c.gradeLevelEstimate}` : "Mixed Grades"}
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-slate-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200">
                               <p className="text-muted-foreground font-bold italic mb-6">No curriculum found in your library.</p>
                               <Button onClick={() => navigate("/upload-curriculum")} variant="primary" className="rounded-2xl">
                                  Upload Now
                               </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="w-full md:w-80 space-y-6">
                        <div className="p-8 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 relative overflow-hidden">
                          <Zap className="absolute bottom-[-20%] right-[-10%] h-40 w-40 opacity-10" />
                          <h4 className="text-lg font-black mb-4">Pro Tip</h4>
                          <p className="text-white/70 text-sm leading-relaxed font-medium">
                            Choose a curriculum that already has extracted standards for the best results.
                          </p>
                        </div>
                        {formData.curriculumId && (
                           <Button 
                            className="w-full h-16 rounded-[2rem] bg-slate-900 hover:bg-slate-800 text-white font-black shadow-xl"
                            onClick={() => setStep(2)}
                            icon={<ArrowRight className="h-5 w-5" />}
                          >
                            Next Step
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {step === 2 && (
                 <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <Card className="p-10 rounded-[3rem] border-none shadow-2xl shadow-indigo-500/5 bg-gradient-to-br from-white to-slate-50/50">
                    <div className="flex flex-col md:flex-row gap-12">
                      <div className="flex-1 space-y-8">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 mb-2">Student Context</h3>
                          <p className="text-muted-foreground font-medium">Personalize content for your specific classroom tiers.</p>
                        </div>
                        
                        <div className="space-y-6">
                           {studentDataList.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {studentDataList.map((s) => (
                                <button
                                  key={s._id}
                                  onClick={() => setFormData({ ...formData, studentDataId: s._id })}
                                  className={`p-6 rounded-[2rem] text-left transition-all duration-300 border-2 ${
                                    formData.studentDataId === s._id
                                      ? "bg-emerald-50 border-emerald-600 shadow-lg shadow-emerald-500/10"
                                      : "bg-white border-slate-100 hover:border-emerald-200"
                                  }`}
                                >
                                  <div className="flex items-center gap-4 mb-3">
                                    <div className={`p-3 rounded-xl ${formData.studentDataId === s._id ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                                      <Users className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 line-clamp-1">{s.originalFilename}</h4>
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground">
                                    <Activity className="h-3 w-3" />
                                    {s.students?.length || 0} Students Sync'd
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-slate-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200">
                               <p className="text-muted-foreground font-bold italic mb-6">No student data found.</p>
                               <Button onClick={() => navigate("/upload-students")} variant="primary" className="rounded-2xl">
                                  Sync Students
                               </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="w-full md:w-80 space-y-6">
                         <div className="p-8 rounded-[2rem] bg-emerald-600 text-white shadow-xl shadow-emerald-500/30">
                          <h4 className="text-lg font-black mb-4">Adaptive Tech</h4>
                          <p className="text-white/70 text-sm leading-relaxed font-medium">
                            AI will use this data to create specific tiered instructions for each group.
                          </p>
                        </div>
                        <div className="flex flex-col gap-3">
                          <Button 
                            className="w-full h-16 rounded-[2rem] bg-slate-900 hover:bg-slate-800 text-white font-black shadow-xl"
                            onClick={() => setStep(3)}
                            disabled={!formData.studentDataId}
                            icon={<ArrowRight className="h-5 w-5" />}
                          >
                            Step 3
                          </Button>
                          <Button 
                            variant="ghost"
                            className="w-full h-14 rounded-2xl font-bold"
                            onClick={() => setStep(1)}
                          >
                            Back to Curriculum
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <Card className="p-10 rounded-[3rem] border-none shadow-2xl shadow-indigo-500/5 bg-gradient-to-br from-white to-slate-50/50">
                    <div className="flex flex-col md:flex-row gap-12">
                      <div className="flex-1 space-y-10">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 mb-2">Refine Generation</h3>
                          <p className="text-muted-foreground font-medium">Fine-tune how the AI constructs your lesson.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-indigo-600 block flex items-center gap-2">
                              <Settings2 className="h-3 w-3" />
                              Intelligence Model
                            </label>
                            <Select
                              value={formData.model}
                              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                              options={[
                                { value: "gpt-4o-mini", label: "GPT-4o Mini (Fast & Efficient)" },
                                { value: "gpt-4o", label: "GPT-4o (High Performance)" }
                              ]}
                              className="rounded-2xl border-slate-200 h-14"
                            />
                          </div>

                          <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-indigo-600 block flex items-center gap-2">
                              <Zap className="h-3 w-3" />
                              Creative Tonality
                            </label>
                            <Select
                              value={formData.tonality}
                              onChange={(e) => setFormData({ ...formData, tonality: e.target.value })}
                              options={[
                                { value: "Engaging", label: "Engaging & Active" },
                                { value: "Formal", label: "Formal & Academic" },
                                { value: "Creative", label: "Creative & Story-driven" },
                                { value: "Direct", label: "Direct & Structured" }
                              ]}
                              className="rounded-2xl border-slate-200 h-14"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                           <label className="text-xs font-black uppercase tracking-widest text-indigo-600 block">
                              Custom Focus (Optional)
                            </label>
                            <textarea
                              placeholder="e.g. Focus on hands-on activities, emphasize vocabulary for ESL students..."
                              className="w-full rounded-3xl border-slate-200 p-6 min-h-[120px] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
                              value={formData.focusArea}
                              onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                            />
                        </div>
                      </div>

                      <div className="w-full md:w-80 space-y-6">
                        <div className="p-8 rounded-[2rem] bg-indigo-700 text-white shadow-2xl shadow-indigo-500/40 border border-white/10 relative overflow-hidden">
                          <Rocket className="absolute bottom-[-10%] right-[-10%] h-32 w-32 opacity-10 -rotate-12" />
                          <h4 className="text-lg font-black mb-4">Launch Sync</h4>
                          <div className="space-y-4 text-white/70 text-xs font-medium leading-relaxed">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              Curriculum linked successfully
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              Students context mapped
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              AI engine primed
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          <Button 
                            className="w-full h-20 rounded-[2.5rem] bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-black shadow-2xl shadow-indigo-500/50 relative group overflow-hidden"
                            onClick={handleGenerate}
                            disabled={lessonStatus === "loading"}
                          >
                            {lessonStatus === "loading" ? (
                              <div className="flex items-center gap-3">
                                <Loader size="sm" color="white" />
                                <span className="animate-pulse">Thinking...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 justify-center">
                                <span>Generate Lesson</span>
                                <Sparkles className="h-5 w-5 group-hover:scale-125 transition-transform" />
                              </div>
                            )}
                          </Button>
                          <Button 
                            variant="ghost"
                            className="w-full h-14 rounded-2xl font-bold"
                            onClick={() => setStep(2)}
                            disabled={lessonStatus === "loading"}
                          >
                            Back
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Alert */}
        {!currentCurriculum && !currentStudentData && (
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-start gap-4 mx-auto max-w-2xl shadow-lg shadow-amber-500/5 transition-all">
             <AlertCircle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
             <div className="space-y-1">
               <p className="text-sm font-black text-amber-900 uppercase tracking-widest">Workflow Required</p>
               <p className="text-sm text-amber-800/70 font-medium">Please select both a curriculum module and student population data to begin the generative process.</p>
             </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default GenerateLessonPage;
