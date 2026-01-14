import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import StudentUploadForm from "../components/StudentUploadForm.jsx";
import StudentDataCard from "../components/StudentDataCard.jsx";
import Card from "../components/common/Card.jsx";
import Loader from "../components/common/Loader.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import { 
  Users, 
  Upload, 
  Plus, 
  Sparkles, 
  FileText, 
  LayoutGrid, 
  Search,
  Filter,
  Zap,
  TrendingUp,
  Activity
} from "lucide-react";
import {
  fetchAllStudentData,
  deleteStudentData,
} from "../store/studentDataThunks.js";
import Button from "../components/common/Button.jsx";
import Modal from "../components/common/Modal.jsx";
import { toast } from "react-hot-toast";

const UploadStudentsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list: studentDataList, status } = useAppSelector(
    (state) => state.studentData
  );

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllStudentData());
    }
  }, [dispatch, status]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student record?")) {
      try {
        await dispatch(deleteStudentData(id)).unwrap();
        toast.success("Student data removed");
      } catch (error) {
        toast.error(error || "Failed to delete student data");
      }
    }
  };

  const handleUploadSuccess = (result) => {
    setIsUploadModalOpen(false);
    toast.success("Student data sync'd!");
    dispatch(fetchAllStudentData());
  };

  const isLoading = status === "loading";

  const totalStudentsCount = studentDataList.reduce((acc, curr) => acc + (curr.students?.length || 0), 0);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        {/* Student Ecosystem Header */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-8 md:p-14 text-white shadow-2xl shadow-emerald-500/20">
          <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none">
            <Users className="h-64 w-64 text-white" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                <Activity className="h-3 w-3 text-emerald-300" />
                Population
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                Student <br /> <span className="text-white/60">Data</span>
              </h1>
              <p className="text-xl text-white/50 font-medium leading-relaxed">
                Sync your class performance data to empower the AI to generate tiered instruction 
                that meets every student where they are throughout your curriculum.
              </p>
            </div>
            
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="rounded-[2rem] h-16 px-10 text-base font-black shadow-2xl shadow-emerald-950/20 group transform transition-all hover:scale-105"
              icon={<Plus className="h-6 w-6 group-hover:scale-125 transition-transform duration-500" />}
            >
              Sync Population
            </Button>
          </div>
        </div>

        {/* Browser & Metadata bar */}
         <div className="flex flex-col md:flex-row gap-6 items-center justify-between px-2">
           {/* <div className="flex items-center gap-3 w-full md:w-96 bg-white rounded-2xl border border-slate-100 p-2 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
             <div className="h-10 w-10 flex items-center justify-center text-slate-300">
               <Search className="h-5 w-5" />
             </div>
             <input 
              type="text" 
              placeholder="Filter cohorts..." 
              className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full text-slate-900"
             />
           </div> */}
           
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl text-emerald-700 text-xs font-black uppercase tracking-widest border border-emerald-100 shadow-sm transition-all cursor-default">
                 <Users className="h-3 w-3" />
                 {totalStudentsCount} Total Students
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-500 text-xs font-black uppercase tracking-widest border border-slate-100 shadow-sm transition-all cursor-default">
                 <FileText className="h-3 w-3" />
                 {studentDataList.length} Sets
              </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-24 space-y-4">
              <Loader size="lg" color="emerald" />
              <p className="text-sm font-black text-muted-foreground uppercase tracking-widest animate-pulse">Syncing Population Data...</p>
            </div>
          ) : studentDataList.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-24 flex flex-col items-center text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]"
            >
               <div className="h-24 w-24 rounded-[2rem] bg-white flex items-center justify-center mb-8 shadow-xl">
                  <Users className="h-10 w-10 text-slate-300" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-4">No Populations Detected</h3>
               <p className="text-muted-foreground font-medium max-w-sm mb-10 leading-relaxed">
                Upload your student rosters or Tier 1/2/3 data (CSV or PDF) to enable tailored lesson generation.
               </p>
               <Button 
                onClick={() => setIsUploadModalOpen(true)} 
                variant="primary" 
                className="h-14 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 shadow-xl"
                icon={<Upload className="h-5 w-5" />}
              >
                  Link Data
               </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {studentDataList.map((data, idx) => (
                  <motion.div
                    key={data._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <StudentDataCard
                      data={data}
                      onDelete={() => handleDelete(data._id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* High-Impact Sync Modal */}
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Roster Synchronization"
          size="md"
        >
          <div className="space-y-8 p-2">
            <div className="flex items-center gap-5 p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 text-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
                <TrendingUp className="h-12 w-12" />
              </div>
              <div className="h-14 w-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <p className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-1">Population Sync</p>
                <p className="text-slate-600 font-medium text-xs leading-relaxed">AI analyzes student tiers to ensure instruction is perfectly scaffolded for your class.</p>
              </div>
            </div>
            
            <div className="bg-slate-50/50 p-1 rounded-[2.5rem] border border-slate-100">
              <StudentUploadForm onSuccess={handleUploadSuccess} />
            </div>
            
            {/* <div className="text-center">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Best experience: CSV Data Exports</p>
            </div> */}
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
};

export default UploadStudentsPage;
