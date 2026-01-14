import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import {
  fetchStudentDataById,
  deleteStudentData,
} from "../store/studentDataThunks.js";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import StudentPreviewTable from "../components/StudentPreviewTable.jsx";
import TierDistributionChart from "../components/analytics/TierDistributionChart.jsx";
import {
  ArrowLeft,
  Calendar,
  Trash2,
  Users,
  TrendingUp,
  Activity,
  UserCheck,
  ShieldCheck,
  FileText,
  LayoutGrid,
  ChevronRight,
  Download,
  Rocket
} from "lucide-react";
import { toast } from "react-hot-toast";
import { formatDate } from "../utils/formatters.js";

const StudentDataViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    current: studentData,
    status,
    error,
  } = useAppSelector((state) => state.studentData);

  useEffect(() => {
    if (id) {
      dispatch(fetchStudentDataById(id));
    }
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this student population data?")) {
      try {
        await dispatch(deleteStudentData(id)).unwrap();
        toast.success("Student records deleted");
        navigate("/upload-students");
      } catch (error) {
        toast.error("Failed to delete student data");
      }
    }
  };

  if (status === "loading") {
    return (
      <PageTransition>
        <div className="max-w-7xl mx-auto space-y-12">
           <div className="h-64 bg-slate-100 animate-pulse rounded-[3rem]" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="h-96 bg-slate-50 animate-pulse rounded-[2.5rem] col-span-2" />
              <div className="h-96 bg-slate-50 animate-pulse rounded-[2.5rem]" />
           </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !studentData) {
    return (
      <PageTransition>
        <div className="max-w-2xl mx-auto py-20 text-center">
          <div className="bg-red-50 p-6 rounded-[2.5rem] inline-block mb-8">
             <Users className="h-12 w-12 text-red-400" />
          </div>
          <h2 className="text-3xl font-black mb-4">Dataset Unavailable</h2>
          <ErrorMessage message={error || "We couldn't retrieve this specific population record."} />
          <Button 
            onClick={() => navigate("/upload-students")} 
            className="mt-8 rounded-2xl h-14"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Populations
          </Button>
        </div>
      </PageTransition>
    );
  }

  const students = studentData.students || [];
  const tierCounts = students.reduce(
    (acc, student) => {
      const tierKey = `tier${student.tier}`;
      acc[tierKey] = (acc[tierKey] || 0) + 1;
      return acc;
    },
    { tier1: 0, tier2: 0, tier3: 0 }
  );

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto pb-20 space-y-12">
        {/* Dynamic Population Header */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-8 md:p-14 text-white shadow-2xl shadow-emerald-500/20">
          <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none">
            <TrendingUp className="h-64 w-64 text-white" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <button
              onClick={() => navigate("/upload-students")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all w-fit"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Populations
            </button>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div className="space-y-4 max-w-3xl">
                 <div className="flex flex-wrap items-center gap-3">
                   <div className="flex items-center gap-1.5 bg-white/10 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase border border-white/10 backdrop-blur-sm">
                      <Calendar className="h-3 w-3" />
                      Sync'd: {formatDate(studentData.createdAt)}
                   </div>
                   <div className="flex items-center gap-1.5 bg-emerald-500/30 text-emerald-200 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border border-emerald-500/20">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Dataset
                   </div>
                 </div>
                 <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                   {studentData.originalFilename || "Cohort Identification Dataset"}
                 </h1>
                 <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-white/50 text-sm font-bold">
                       <Users className="h-5 w-5" />
                       Total Students: <span className="text-white">{students.length}</span>
                    </div>
                 </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                   className="bg-rose-500/20 hover:bg-rose-500/40 text-white border-rose-500/20 rounded-2xl h-14 w-14 flex items-center justify-center p-0 backdrop-blur-md"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tier Stratification Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {[
             { label: "Tier 1 Proficiency", value: tierCounts.tier1, desc: "On Track / Mastery", color: "text-emerald-600", bg: "bg-emerald-50" },
             { label: "Tier 2 Strategic", value: tierCounts.tier2, desc: "Intervention Required", color: "text-amber-600", bg: "bg-amber-50" },
             { label: "Tier 3 Intensive", value: tierCounts.tier3, desc: "Direct Support Needs", color: "text-rose-600", bg: "bg-rose-50" },
             { label: "Data Integrity", value: "99.8%", desc: "Sync Health Score", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" }
           ].map((stat, i) => (
             <Card key={i} className="p-8 border-none glass group hover:shadow-2xl transition-all duration-500 rounded-[2.5rem]">
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                       {stat.icon ? <stat.icon className="h-6 w-6" /> : <UserCheck className="h-6 w-6" />}
                    </div>
                    {i < 3 && <span className="text-3xl font-black text-slate-900">{stat.value}</span>}
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                    {stat.icon ? <p className="text-3xl font-black text-slate-900">{stat.value}</p> : <p className="text-xs font-bold text-slate-500 italic">{stat.desc}</p>}
                 </div>
               </div>
             </Card>
           ))}
        </div>

        {/* Data Visualization & Detailed Roster */}
        <div className="w-full gap-10">
          <div className="lg:col-span-8 space-y-10">
             <Card 
              title="Individualized Learner Matrix" 
              icon={<LayoutGrid className="text-emerald-600 w-5 h-5" />} 
              className="rounded-[3rem] premium-shadow border-none overflow-hidden"
            >
               <div className="p-4">
                  <StudentPreviewTable students={students} />
               </div>
            </Card>
          </div>

          {/* <div className="lg:col-span-4 space-y-10">
             <Card 
                title="Population Distribution" 
                icon={<Activity className="text-indigo-600 w-5 h-5" />}
                className="rounded-[3rem] premium-shadow border-none"
              >
                <div className="p-2">
                   <TierDistributionChart data={tierCounts} />
                </div>
                <div className="p-6 pt-0">
                   <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Strategic Recommendation</h4>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                        "Your cohort shows a significant Tier 2 concentration. AI generation will prioritize scaffolded inquiry for these students."
                      </p>
                   </div>
                </div>
             </Card>

             <Card className="rounded-[2.5rem] bg-slate-900 text-white p-8 border-none shadow-2xl relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 opacity-10">
                   <Rocket className="h-48 w-48" />
                </div>
                <div className="relative z-10 space-y-6">
                   <h3 className="text-xl font-black">Ready to Personalize?</h3>
                   <p className="text-sm text-white/60 font-medium leading-relaxed">
                     This student population is now linkable to any curriculum document in your library.
                   </p>
                   <Button 
                    variant="primary" 
                    className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 border-none shadow-xl shadow-emerald-500/20 font-black"
                    onClick={() => navigate("/generate-lesson")}
                  >
                     Launch Designer
                     <ChevronRight className="h-4 w-4 ml-2" />
                   </Button>
                </div>
             </Card>
          </div> */}
        </div>
      </div>
    </PageTransition>
  );
};

export default StudentDataViewPage;
