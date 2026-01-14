import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "./common/Card.jsx";
import Button from "./common/Button.jsx";
import Modal from "./common/Modal.jsx";
import Badge from "./common/Badge.jsx";
import { formatDateShort } from "../utils/formatters.js";
import { Users, Trash2, AlertTriangle, Calendar, ArrowRight, Activity, TrendingUp } from "lucide-react";

const StudentDataCard = ({ data, onDelete }) => {
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
      await onDelete(data._id);
      setDeleteModalOpen(false);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsDeleting(false);
    }
  };

  const getTierDistribution = (students) => {
    if (!students || students.length === 0)
      return { tier1: 0, tier2: 0, tier3: 0 };
    return students.reduce(
      (acc, student) => {
        acc[`tier${student.tier}`] = (acc[`tier${student.tier}`] || 0) + 1;
        return acc;
      },
      { tier1: 0, tier2: 0, tier3: 0 }
    );
  };

  const tierDist = getTierDistribution(data?.students);
  const totalStudents = data?.students?.length || 0;

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
          onClick={() => navigate(`/students/${data._id}`)}
        >
          {/* Top Decorative Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="flex flex-col h-full space-y-6">
            {/* Header Area */}
            <div className="flex justify-between items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                 <Users className="h-7 w-7" />
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatDateShort(data.createdAt)}</span>
                 <div className="mt-1.5 flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-black uppercase border border-indigo-100 italic">
                    <Activity className="h-3 w-3" />
                    Sync'd
                 </div>
              </div>
            </div>

            {/* Title & Preview */}
            <div className="flex-1 space-y-4">
               <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight">
                  {data.originalFilename || "Cohort Data Roster"}
               </h3>
               
               <div className="grid grid-cols-3 gap-2">
                 <div className="bg-emerald-500/5 p-3 rounded-2xl border border-emerald-100/50 text-center">
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-tighter">Tier 1</p>
                    <p className="text-lg font-black text-emerald-700">{tierDist.tier1}</p>
                 </div>
                 <div className="bg-amber-500/5 p-3 rounded-2xl border border-amber-100/50 text-center">
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-tighter">Tier 2</p>
                    <p className="text-lg font-black text-amber-700">{tierDist.tier2}</p>
                 </div>
                 <div className="bg-rose-500/5 p-3 rounded-2xl border border-rose-100/50 text-center">
                    <p className="text-[10px] font-black text-rose-700 uppercase tracking-tighter">Tier 3</p>
                    <p className="text-lg font-black text-rose-700">{tierDist.tier3}</p>
                 </div>
               </div>
            </div>

            {/* Total Students Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl w-fit">
               <TrendingUp className="h-4 w-4 text-emerald-600" />
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                 {totalStudents} Population Count
               </span>
            </div>

            {/* Card Actions Footer */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
               <button
                onClick={handleDeleteClick}
                className="h-10 w-10 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all duration-300 border border-rose-100/50"
                title="Delete student data"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 group-hover:gap-2 transition-all">
                Analyze Population <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Modern High-Impact Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Data Removal"
        size="sm"
      >
        <div className="space-y-8 p-2">
          <div className="flex items-center gap-5 p-6 bg-rose-50 rounded-[2rem] border border-rose-100">
            <div className="h-14 w-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/30 shrink-0">
               <AlertTriangle className="h-7 w-7" />
            </div>
            <div className="flex-1">
               <p className="text-sm text-slate-900 font-black uppercase tracking-widest mb-1">
                Security Alert
              </p>
              <p className="text-xs text-rose-700 font-medium leading-relaxed">
                Purging this cohort will remove all linkable personalization data for future lessons.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
             <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setDeleteModalOpen(false)}>
              Keep Data
            </Button>
            <Button variant="danger" className="flex-1 h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-500/20 font-black" onClick={handleConfirmDelete} isLoading={isDeleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StudentDataCard;
