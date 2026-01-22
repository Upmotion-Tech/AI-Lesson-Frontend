import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CurriculumUploadForm from "../components/CurriculumUploadForm.jsx";
import CurriculumCard from "../components/CurriculumCard.jsx";
import Card from "../components/common/Card.jsx";
import Loader from "../components/common/Loader.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import { 
  BookOpen, 
  Upload, 
  Plus, 
  Sparkles, 
  FileText, 
  LayoutGrid, 
  Search,
  Filter,
  Zap
} from "lucide-react";
import {
  fetchAllCurricula,
  deleteCurriculum,
} from "../store/curriculumThunks.js";
import EmptyState from "../components/common/EmptyState.jsx";
import Button from "../components/common/Button.jsx";
import Modal from "../components/common/Modal.jsx";
import { toast } from "react-hot-toast";

const UploadCurriculumPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list: curricula, status } = useAppSelector(
    (state) => state.curriculum
  );

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllCurricula());
    }
  }, [dispatch, status]);

  const handleDelete = async (curriculumId) => {
    try {
      await dispatch(deleteCurriculum(curriculumId)).unwrap();
      toast.success("Curriculum deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete curriculum");
      throw error;
    }
  };

  const handleUploadSuccess = (result) => {
    setIsUploadModalOpen(false);
    if (result && result.curriculum && result.curriculum._id) {
       toast.success("Analysis complete!");
      navigate(`/curriculum/${result.curriculum._id}`);
    } else {
      dispatch(fetchAllCurricula());
    }
  };

  const isLoading = status === "loading";

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        {/* Dynamic Library Header */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-8 md:p-14 text-white shadow-2xl shadow-indigo-500/20">
          <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none">
            <BookOpen className="h-64 w-64 text-white" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/10 text-white/90">
                <Sparkles className="h-3 w-3 text-amber-300" />
                Library
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                Curriculum <br /> <span className="text-white/60">Library</span>
              </h1>
              <p className="text-xl text-white/50 font-medium leading-relaxed">
                Your repository of analyzed educational standards and curriculum frameworks. 
                AI-processed for deep personalization.
              </p>
            </div>
            
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="text-indigo-700 rounded-[2rem] h-16 px-10 text-base font-black shadow-2xl shadow-indigo-950/20 group transform transition-all hover:scale-105"
              icon={<Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-500" />}
            >
              Upload Curriculum Document
            </Button>
          </div>
        </div>

        {/* Browser & Filters */}
         <div className="flex flex-col md:flex-row gap-6 items-center justify-between px-2">
           {/* <div className="flex items-center gap-3 w-full md:w-96 bg-white rounded-2xl border border-slate-100 p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
             <div className="h-10 w-10 flex items-center justify-center text-slate-300">
               <Search className="h-5 w-5" />
             </div>
             <input 
              type="text" 
              placeholder="Search library..." 
              className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full text-slate-900"
             />
           </div> */}
           
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-black uppercase tracking-widest border border-indigo-100 shadow-sm transition-all cursor-default">
                 <LayoutGrid className="h-3 w-3" />
                 {curricula.length} Modules
              </div>
           </div>
        </div>

        {/* List Section */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-24 space-y-4">
              <Loader size="lg" />
              <p className="text-sm font-black text-muted-foreground uppercase tracking-widest animate-pulse">Syncing Knowledge Base...</p>
            </div>
          ) : curricula.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-24 flex flex-col items-center text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]"
            >
               <div className="h-24 w-24 rounded-[2rem] bg-white flex items-center justify-center mb-8 shadow-xl">
                  <FileText className="h-10 w-10 text-slate-300" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-4">No Documents Detected</h3>
               <p className="text-muted-foreground font-medium max-w-sm mb-10 leading-relaxed">
                Connect your curriculum PDFs or Word documents to begin the AI standards extraction process.
               </p>
               <Button 
                onClick={() => setIsUploadModalOpen(true)} 
                variant="primary" 
                className="h-14 px-10 rounded-2xl"
                icon={<Upload className="h-5 w-5" />}
              >
                  Start Upload
               </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {curricula.map((curriculum, idx) => (
                  <motion.div
                    key={curriculum._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <CurriculumCard
                      curriculum={curriculum}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* High-Performance Upload Modal */}
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Ingest Curriculum Source"
          size="md"
        >
          <div className="space-y-8 p-2">
            <div className="flex items-center gap-5 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 text-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
                <Zap className="h-12 w-12" />
              </div>
              <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
                <Upload className="h-7 w-7" />
              </div>
              <div>
                <p className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-1">Intelligent Ingestion</p>
                <p className="text-slate-600 font-medium text-xs leading-relaxed">AI will scan for standards, objectives, and grade-level context automatically.</p>
              </div>
            </div>
            
            <div className="bg-slate-50/50 p-1 rounded-[2.5rem] border border-slate-100">
              <CurriculumUploadForm onSuccess={handleUploadSuccess} />
            </div>
            
            <div className="text-center">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Supported: PDF • DOCX • TXT (20MB Max)</p>
            </div>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
};

export default UploadCurriculumPage;
