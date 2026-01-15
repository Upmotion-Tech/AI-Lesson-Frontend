import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { fetchAllCurricula } from "../store/curriculumThunks.js";
import { fetchAllStudentData } from "../store/studentDataThunks.js";
import { fetchAllLessonPlans } from "../store/lessonThunks.js";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import { CardSkeleton } from "../components/common/Skeleton.jsx";
import Badge from "../components/common/Badge.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import TierDistributionChart from "../components/analytics/TierDistributionChart.jsx";
import LessonPlansChart from "../components/analytics/LessonPlansChart.jsx";
import ResourceCountChart from "../components/analytics/ResourceCountChart.jsx";
import {
  BookOpen,
  Users,
  Sparkles,
  TrendingUp,
  FileText,
  BarChart3,
  Activity,
  ArrowRight,
  Plus,
  Clock,
  ChevronRight,
  Target,
  Rocket,
  Zap,
  LayoutGrid,
  Calendar
} from "lucide-react";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list: curricula, status: curriculumStatus } = useAppSelector(
    (state) => state.curriculum
  );
  const { list: studentDataList, status: studentDataStatus } = useAppSelector(
    (state) => state.studentData
  );
  const { list: lessons, status: lessonsStatus } = useAppSelector(
    (state) => state.lessons
  );
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllCurricula());
    dispatch(fetchAllStudentData());
    dispatch(fetchAllLessonPlans());
  }, [dispatch]);

  const isLoading =
    curriculumStatus === "loading" ||
    studentDataStatus === "loading" ||
    lessonsStatus === "loading";

  const totalStudents = studentDataList.reduce(
    (sum, sd) => sum + (sd.students?.length || 0),
    0
  );

  const aggregateTierDist = studentDataList.reduce(
    (acc, studentData) => {
      const students = studentData.students || [];
      students.forEach(s => {
        acc[`tier${s.tier}`] = (acc[`tier${s.tier}`] || 0) + 1;
      });
      return acc;
    },
    { tier1: 0, tier2: 0, tier3: 0 }
  );

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-8">
          <div className="h-64 w-full bg-slate-100 animate-pulse rounded-[3rem]" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-50 animate-pulse rounded-[2rem]" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-slate-50 animate-pulse rounded-[2.5rem]" />
            <div className="h-96 bg-slate-50 animate-pulse rounded-[2.5rem]" />
          </div>
        </div>
      </PageTransition>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <PageTransition>
      <div className="space-y-12 pb-20">
        {/* State-of-the-art Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 md:p-16 text-white shadow-[0_30px_60px_-15px_rgba(67,97,238,0.3)]"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl text-white text-xs font-black uppercase tracking-[0.2em] border border-white/10"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                AI-Powered Educator Suite
              </motion.div>
              
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1]">
                  {getTimeOfDay()}, <br />
                  <span className="text-white/70 italic font-serif px-1">{user?.name?.split(' ')[0] || 'Educator'}</span>
                </h1>
              </div>
              
              <p className="text-xl text-white/60 leading-relaxed font-medium max-w-lg">
                Your instructional ecosystem is optimized. You have <span className="text-white font-bold">{lessons.length}</span> live lesson plans and <span className="text-white font-bold">{curricula.length}</span> curriculum modules analyzed.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <Button 
                  onClick={() => navigate("/generate-lesson")}
                  className=" rounded-[2rem] h-16 px-10 text-lg font-black shadow-2xl shadow-indigo-900/20 group transform transition-all hover:scale-105 active:scale-95"
                  icon={<Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-500" />}
                >
                  Create New Lesson
                </Button>
                <Button 
                  onClick={() => navigate("/upload-curriculum")}
                  variant="outline"
                  className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/40 rounded-[2rem] h-16 px-10 text-lg font-bold backdrop-blur-sm"
                >
                  Document Library
                </Button>
              </div>
            </div>

            <div className="hidden lg:block relative">
               <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
               >
                 <div className="w-64 h-64 rounded-[3rem] bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-3xl border border-white/20 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <Rocket className="h-32 w-32 text-white drop-shadow-2xl" />
                 </div>
               </motion.div>
               {/* Orbital elements */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-white/5 animate-[spin_20s_linear_infinite]" />
               <div className="absolute top-0 right-0 p-2 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50 animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* High-Impact Stat Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            { label: "Curricula", value: curricula.length, icon: FileText, color: "bg-indigo-500", shadow: "shadow-indigo-500/20", trend: "+2 this week" },
            { label: "Total Students", value: totalStudents, icon: Users, color: "bg-emerald-500", shadow: "shadow-emerald-500/20", trend: "Active learning" },
            { label: "AI Lessons", value: lessons.length, icon: Zap, color: "bg-amber-500", shadow: "shadow-amber-500/20", trend: "Generated" },
            { label: "Data Records", value: studentDataList.length, icon: TrendingUp, color: "bg-rose-500", shadow: "shadow-rose-500/20", trend: "Synchronized" }
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="group relative overflow-hidden border-none glass hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 p-8">
                <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 opacity-[0.03] group-hover:opacity-10 transition-opacity rounded-full ${stat.color}`} />
                <div className="flex flex-col gap-6">
                  <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-xl ${stat.shadow} group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-4xl font-black text-slate-900">{stat.value}</p>
                      <span className="text-[10px] font-bold text-muted-foreground italic">{stat.trend}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Spotlight Actions */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-4">
            <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
              <LayoutGrid className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              Instructional Hub
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "Upload Curriculum", 
                desc: "Manage and analyze educational standards and source documents.", 
                icon: BookOpen, 
                color: "from-indigo-600 to-indigo-800", 
                path: "/upload-curriculum",
                action: "Explore Library"
              },
              { 
                title: "Upload Students", 
                desc: "Track tier distribution and personalize learning pathways.", 
                icon: Users, 
                color: "from-emerald-600 to-emerald-800", 
                path: "/upload-students",
                action: "Analyze Data"
              },
              { 
                title: "Generate Lesson", 
                desc: "Transform curriculum into high-impact personalized lesson plans.", 
                icon: Sparkles, 
                color: "from-amber-500 to-amber-700", 
                path: "/generate-lesson",
                action: "Launch Creator"
              }
            ].map((feature, i) => (
              <motion.button 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate(feature.path)}
                className={`group p-10 rounded-[2.5rem] bg-gradient-to-br ${feature.color} text-left shadow-2xl relative overflow-hidden text-white`}
              >
                <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000 grayscale">
                  <feature.icon className="h-32 w-32" />
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="h-16 w-16 rounded-[1.25rem] bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed font-medium">
                      {feature.desc}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                    {feature.action} <ChevronRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Advanced Intelligence Section */}
        <div className="space-y-10">
          <div className="flex items-center justify-between px-4">
             <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                <BarChart3 className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                Live Insights
              </h2>
            </div>
            <Badge variant="success" className="px-4 py-2 rounded-xl text-xs font-black">Real-time Analysis</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Card
              title="Global Resource Mapping"
              icon={<Target className="text-indigo-600 w-5 h-5" />}
              className="premium-shadow border-none rounded-[3rem] overflow-hidden"
            >
              <div className="p-4">
                <ResourceCountChart
                  curricula={curricula}
                  studentData={studentDataList}
                  lessons={lessons}
                />
              </div>
            </Card>

            <Card
              title="Tier Stratification Matrix"
              icon={<Activity className="text-emerald-600 w-5 h-5" />}
              className="premium-shadow border-none rounded-[3rem] overflow-hidden"
            >
              <div className="p-4">
                <TierDistributionChart data={aggregateTierDist} />
              </div>
            </Card>
          </div>

          {lessons.length > 0 && (
            <Card
              title="Content Generation Trajectory"
              icon={<Clock className="text-amber-500 w-5 h-5" />}
              className="premium-shadow border-none rounded-[3rem] overflow-hidden"
            >
              <div className="p-4">
                <LessonPlansChart lessons={lessons} />
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
