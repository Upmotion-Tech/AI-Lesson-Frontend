import { useEffect } from "react";
import { Shield } from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch.js";
import { useAppSelector } from "../../hooks/useAppSelector.js";
import { fetchAdminStats } from "../../store/adminThunks.js";
import Card from "../../components/common/Card.jsx";
import PageTransition from "../../components/common/PageTransition.jsx";
import AdminStatsCards from "../../components/admin/AdminStatsCards.jsx";

const AdminOverviewPage = () => {
  const dispatch = useAppDispatch();
  const { stats } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  return (
    <PageTransition>
      <div className="space-y-8 pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
                Admin
              </p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Overview
              </h1>
            </div>
          </div>
        </div>
        <AdminStatsCards stats={stats} />
      </div>
    </PageTransition>
  );
};

export default AdminOverviewPage;
