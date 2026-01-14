import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "./common/Card.jsx";
import Button from "./common/Button.jsx";
import Modal from "./common/Modal.jsx";
import { formatDateShort, truncateText } from "../utils/formatters.js";
import { 
  Trash2, 
  AlertTriangle, 
  Calendar, 
  Target,
  ChevronRight,
  BookOpen,
  Zap,
  Clock
} from "lucide-react";

const CurriculumCard = ({ curriculum, onDelete }) => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(curriculum._id);
      setDeleteModalOpen(false);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsDeleting(false);
    }
  };

  const textPreview = curriculum.rawText
    ? truncateText(curriculum.rawText, 120)
    : "No text content available";

  const standardCount = curriculum.standardCount || (curriculum.standards?.length) || 0;

  return (
    <>
      <motion.div
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="h-full"
      >
        <Card
          className="group relative cursor-pointer overflow-hidden p-8 h-full glass premium-shadow border-none rounded-[2.5rem] bg-gradient-to-br from-white to-slate-50/50"
          clickable
          onClick={() => navigate(`/curriculum/${curriculum._id}`)}
        >
          {/* Top Decorative Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-indigo-400 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="flex flex-col h-full space-y-6">
            {/* Header Area */}
            <div className="flex justify-between items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm">
                 <BookOpen className="h-7 w-7" />
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatDateShort(curriculum.createdAt)}</span>
                 <div className="mt-1.5 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black uppercase border border-emerald-100 italic">
                    <Zap className="h-3 w-3" />
                    Verified
                 </div>
              </div>
            </div>

            {/* Title & Preview */}
            <div className="flex-1 space-y-4">
               <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                  {curriculum.originalFilename || "Document Archive"}
               </h3>
               <p className="text-sm text-slate-500 font-medium leading-relaxed italic border-l-2 border-indigo-100 pl-4 py-1">
                 "{textPreview}"
               </p>
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
               <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50/50 text-indigo-700 text-[10px] font-black uppercase border border-indigo-100/50">
                  <Target className="h-3 w-3" />
                  {standardCount} Standards
               </div>
               {curriculum.gradeLevelEstimate && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-black uppercase border border-slate-200">
                     Grade {curriculum.gradeLevelEstimate}
                  </div>
               )}
            </div>

            {/* Card Actions Footer */}
            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
               <button
                onClick={handleDeleteClick}
                className="h-10 w-10 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all duration-300 border border-rose-100/50"
                title="Delete curriculum"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-1 text-[10px] font-black uppercase text-indigo-600 group-hover:gap-2 transition-all">
                Explore Module <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Modern High-Impact Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-8 p-2">
          <div className="flex items-center gap-5 p-6 bg-rose-50 rounded-[2rem] border border-rose-100">
            <div className="h-14 w-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/30 shrink-0">
               <AlertTriangle className="h-7 w-7" />
            </div>
            <div className="flex-1">
               <p className="text-sm text-slate-900 font-black uppercase tracking-widest mb-1">
                Sensitive Action
              </p>
              <p className="text-xs text-rose-700 font-medium leading-relaxed">
                Deleting this document will purge all extracted intelligence and linked standards.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
             <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setDeleteModalOpen(false)}>
              Keep Data
            </Button>
            <Button variant="danger" className="flex-1 h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-500/20 font-black" onClick={handleConfirmDelete} isLoading={isDeleting}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CurriculumCard;
