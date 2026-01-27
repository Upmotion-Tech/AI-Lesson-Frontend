import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import {
  fetchCurriculumById,
  deleteCurriculum,
} from "../store/curriculumThunks.js";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import Modal from "../components/common/Modal.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import { CardSkeleton } from "../components/common/Skeleton.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import Badge from "../components/common/Badge.jsx";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Calendar,
  Trash2,
  AlertTriangle,
  BookOpen,
  Sparkles,
  FileCheck,
  Zap,
  Tag,
  GraduationCap,
  Layers,
  ChevronRight,
  Download,
  Share2,
  Clock,
  Target,
  Search
} from "lucide-react";
import { formatDate } from "../utils/formatters.js";

const CurriculumViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    current: curriculum,
    status,
    error,
  } = useAppSelector((state) => state.curriculum);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCurriculumById(id));
    }
  }, [id, dispatch]);

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteCurriculum(id)).unwrap();
      toast.success("Curriculum deleted successfully");
      navigate("/upload-curriculum");
    } catch (error) {
      toast.error(error || "Failed to delete curriculum");
      setIsDeleting(false);
    }
  };

  if (status === "loading") {
    return (
      <PageTransition>
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-48 bg-muted animate-pulse rounded-[2.5rem]" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-3xl" />
            ))}
          </div>
          <CardSkeleton count={2} />
        </div>
      </PageTransition>
    );
  }

  if (error || !curriculum) {
    return (
      <PageTransition>
        <div className="max-w-2xl mx-auto py-20 text-center">
          <div className="bg-danger/10 p-6 rounded-[2.5rem] inline-block mb-6">
             <AlertTriangle className="h-12 w-12 text-danger" />
          </div>
          <h2 className="text-3xl font-black mb-4">Content Not Found</h2>
          <ErrorMessage message={error || "We couldn't locate this piece of curriculum."} />
          <Button 
            onClick={() => navigate("/upload-curriculum")} 
            className="mt-8 rounded-2xl h-14 px-8"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Library
          </Button>
        </div>
      </PageTransition>
    );
  }

  const standards = curriculum.standards || [];
  const textContent = curriculum.rawText || "";
  const wordCount = textContent.split(/\s+/).length;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto pb-20 space-y-10">
        {/* Modern Header Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 p-8 md:p-12 text-white shadow-2xl shadow-indigo-500/20">
          <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
            <BookOpen className="h-64 w-64" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <button
              onClick={() => navigate("/upload-curriculum")}
              className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white transition-colors group px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 w-fit"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Library
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                  <FileCheck className="h-10 w-10" />
                </div>
                <div>
                   <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                      Curriculum Resource
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/30 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      <Zap className="h-3 w-3" />
                      Analyzed
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                    {curriculum.originalFilename || "Document Archive"}
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <Button
                  variant="danger"
                  onClick={handleDeleteClick}
                  className="bg-red-500/20 hover:bg-red-500/40 text-white border border-red-500/30 rounded-2xl h-12 px-6"
                  icon={<Trash2 className="h-4 w-4" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 glass border-none group hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                  <Layers className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Page Chunks</p>
                  <p className="text-2xl font-black text-foreground">{curriculum.chunkCount || '1'}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 glass border-none group hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                  <Tag className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Standards</p>
                  <p className="text-2xl font-black text-foreground">{standards.length}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 glass border-none group hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl">
                  <GraduationCap className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Grade</p>
                  <p className="text-2xl font-black text-foreground">{curriculum.gradeLevelEstimate || 'K-12'}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 glass border-none group hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-500/10 rounded-2xl">
                  <Clock className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Word Count</p>
                  <p className="text-2xl font-black text-foreground">{wordCount.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            <Card 
              title="Intelligence Extraction" 
              icon={<Zap className="text-indigo-600 w-5 h-5"/>} 
              className="premium-shadow border-none overflow-hidden"
            >
               <div className="relative p-2">
                <div
                  className={`prose prose-indigo max-w-none text-foreground/80 leading-relaxed overflow-hidden transition-all duration-700 ${
                    showFullText ? "max-h-none" : "max-h-[800px]"
                  }`}
                >
                  {curriculum.formattedText ? (
                    <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {curriculum.formattedText}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap font-sans space-y-4 bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 italic text-muted-foreground">
                      {textContent}
                    </div>
                  )}
                </div>
                
                {!showFullText && textContent.length > 2000 && (
                  <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-card via-card/90 to-transparent pointer-events-none flex items-end justify-center pb-8">
                     <Button 
                      onClick={() => setShowFullText(true)}
                      variant="outline" 
                      className="flex items-center gap-2 pointer-events-auto shadow-2xl bg-card border-indigo-500/20 h-14 px-8 rounded-2xl hover:bg-slate-50 transition-all font-bold group"
                    >
                      <div className="flex items-center align-center justify-center gap-2 ">
                        Continue Reading
                        <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Button>
                  </div>
                )}
                
                {showFullText && (
                  <div className="mt-12 pt-8 border-t border-border flex justify-center">
                    <Button variant="ghost" onClick={() => setShowFullText(false)} className="rounded-xl">
                      Collapse Content
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* AI Insights Card */}
            <Card 
              title="Expert Summary" 
              icon={<Sparkles className="text-amber-500 w-5 h-5" />}
              className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-xl shadow-indigo-500/5 rounded-[2rem]"
            >
              <div className="space-y-8">
                <div>
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 bg-indigo-500/5 py-1 px-3 rounded-full w-fit">
                    Core Insights
                  </h4>
                  <p className="text-base text-card-foreground leading-relaxed italic font-medium px-4 border-l-4 border-indigo-500/20 py-2">
                    "{curriculum.summary || 'Analytical processing in progress...'}"
                  </p>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 bg-emerald-500/5 py-1 px-3 rounded-full w-fit">
                    Focus Clusters
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {curriculum.topics?.map((topic, i) => (
                      <span key={i} className="px-4 py-2 rounded-2xl bg-white text-indigo-700 text-xs font-bold border border-indigo-100 shadow-sm hover:shadow-md transition-shadow cursor-default">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-indigo-100">
                  <Button 
                    className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 font-bold"
                    onClick={() => navigate("/generate-lesson", { state: { curriculumId: id } })}
                  >
                    Generate Lesson Plan
                  </Button>
                </div>
              </div>
            </Card>

            {/* Standards Spotlight Card */}
            <Card 
              title="Mapped Standards" 
              icon={<Target className="text-emerald-500 w-5 h-5" />}
              className="premium-shadow border-none rounded-[2rem] overflow-hidden"
            >
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {standards.length > 0 ? (
                  standards.map((std, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:bg-white hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="text-[10px] font-black text-indigo-700 px-3 py-1 bg-indigo-50 rounded-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {std.code}
                        </span>
                        {std.domain && (
                           <span className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter truncate max-w-[120px]">
                            {std.domain}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-card-foreground leading-relaxed font-medium">
                        {std.description}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 text-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <div className="p-3 bg-slate-100 rounded-full inline-block mb-3">
                      <Layers className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">Synthesizing standards...</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modern Deletion Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Administrative Action Required"
        size="md"
        footer={
          <div className="flex justify-end gap-3 w-full p-2">
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)} className="rounded-xl px-6">
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              className="rounded-xl px-8 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20"
            >
              Confirm Deletion
            </Button>
          </div>
        }
      >
        <div className="flex items-start gap-6 p-2">
          <div className="p-5 bg-red-50 rounded-3xl text-red-600 border border-red-100">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-foreground mb-1">Irreversible Deletion</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You are about to delete <span className="font-bold text-foreground">"{curriculum.originalFilename}"</span>. All associated AI analysis, extracted standards, and linked metadata will be permanently lost.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Security Warning</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This action will NOT delete lesson plans generated using this content, but you will lose the ability to reference back to the original text.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
};

export default CurriculumViewPage;
