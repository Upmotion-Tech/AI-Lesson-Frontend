import { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Shield, Calendar, BookOpen, Users, FileText, Settings, Briefcase } from "lucide-react";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import { getUserAvatarUrl } from "../utils/userAvatar.js";
import { BillingPanel } from "./BillingPage.jsx";
import { fetchRoles, fetchMyRole, updateMyRole } from "../store/roleThunks.js";
import { clearRoleErrors } from "../store/roleSlice.js";
import { formatRoleLabel } from "../utils/roleUtils.js";

const formatDate = (value) => {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not provided";
  return date.toLocaleDateString();
};

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { list: curricula } = useAppSelector((state) => state.curriculum);
  const { list: studentDataList } = useAppSelector((state) => state.studentData);
  const { list: lessons } = useAppSelector((state) => state.lessons);
  const {
    availableRoles,
    myRole,
    status: rolesStatus,
    updateStatus,
    updateError,
  } = useAppSelector((state) => state.roles);

  const [selectedRole, setSelectedRole] = useState(() => myRole?.educationalRole || "");
  const [showRoleSuccess, setShowRoleSuccess] = useState(false);

  const totalStudents = useMemo(
    () =>
      studentDataList.reduce(
        (sum, studentData) => sum + (studentData.students?.length || 0),
        0
      ),
    [studentDataList]
  );

  const roleLabel = Array.isArray(user?.role)
    ? user.role.join(", ")
    : user?.role || "teacher";
  const normalizedRoles = Array.isArray(user?.role)
    ? user.role
    : user?.role
    ? [user.role]
    : [];
  const isAdminOrSuperAdmin = normalizedRoles.includes("admin") || normalizedRoles.includes("super_admin");
  const isTeacher = normalizedRoles.includes("teacher");
  const avatarUrl = getUserAvatarUrl(user?.profileImage);

  // Fetch roles and user's role info on mount
  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchMyRole());

    return () => {
      dispatch(clearRoleErrors());
    };
  }, [dispatch]);

  // Handle role update
  const handleRoleUpdate = async () => {
    if (!selectedRole || selectedRole === myRole?.educationalRole) return;

    const result = await dispatch(updateMyRole({ educationalRole: selectedRole }));
    if (updateMyRole.fulfilled.match(result)) {
      setShowRoleSuccess(true);
      setTimeout(() => setShowRoleSuccess(false), 3000);
    }
  };

  // Only regular users with subscription can change role in profile
  // Admins/SuperAdmins must use /admin/users to change roles
  const canChangeRole = myRole?.canChangeRole && !isAdminOrSuperAdmin;
  const educationalRoleLabel = myRole?.educationalRoleLabel || formatRoleLabel(user?.educationalRole);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        <div className="rounded-[2rem] bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-8 md:p-12 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-3xl border-2 border-white/30 overflow-hidden bg-indigo-500 flex items-center justify-center text-2xl font-black">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name || "Profile image"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (user?.name?.[0] || "U").toUpperCase()
                )}
              </div>
              <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">
                Account
              </p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-2">
                {user?.name || "Educator"}
              </h1>
              <p className="text-indigo-100 mt-3 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user?.email || "No email available"}
              </p>
              </div>
            </div>
            <Link to="/settings">
              <Button
                className=" text-indigo-700"
                icon={<Settings className="h-4 w-4" />}
              >
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {!isAdminOrSuperAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Curricula</p>
              <p className="text-3xl font-black text-slate-900 mt-2">{curricula.length}</p>
              <BookOpen className="h-5 w-5 text-indigo-600 mt-3" />
            </Card>
            <Card>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Students</p>
              <p className="text-3xl font-black text-slate-900 mt-2">{totalStudents}</p>
              <Users className="h-5 w-5 text-emerald-600 mt-3" />
            </Card>
            <Card>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Lesson Plans</p>
              <p className="text-3xl font-black text-slate-900 mt-2">{lessons.length}</p>
              <FileText className="h-5 w-5 text-rose-600 mt-3" />
            </Card>
          </div>
        )}

        <Card className="rounded-[1.5rem]">
          <h2 className="text-xl font-black text-slate-900 mb-6">Profile Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Name</p>
              <p className="text-sm font-semibold text-slate-900 mt-2 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-500" />
                {user?.name || "Not provided"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Email</p>
              <p className="text-sm font-semibold text-slate-900 mt-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                {user?.email || "Not provided"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">System Role</p>
              <p className="text-sm font-semibold text-slate-900 mt-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-500" />
                {roleLabel}
              </p>
            </div>
            {!isAdminOrSuperAdmin && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 md:col-span-2">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Educational Role</p>
                <div className="mt-2 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  {canChangeRole ? (
                    <>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        disabled={updateStatus === "loading" || rolesStatus !== "succeeded"}
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Select your role...</option>
                        {availableRoles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={handleRoleUpdate}
                        disabled={
                          updateStatus === "loading" ||
                          !selectedRole ||
                          selectedRole === myRole?.educationalRole
                        }
                        className="whitespace-nowrap"
                      >
                        {updateStatus === "loading" ? "Saving..." : "Update Role"}
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-slate-500" />
                      {educationalRoleLabel}
                    </p>
                  )}
                </div>
                {!canChangeRole && (
                  <p className="text-xs text-slate-500 mt-2">
                    An active subscription is required to change your educational role.
                  </p>
                )}
                {showRoleSuccess && (
                  <p className="text-xs text-emerald-600 mt-2">Role updated successfully!</p>
                )}
                {updateError && (
                  <p className="text-xs text-rose-600 mt-2">{updateError}</p>
                )}
              </div>
            )}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Date of Birth</p>
              <p className="text-sm font-semibold text-slate-900 mt-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                {formatDate(user?.dateOfBirth)}
              </p>
            </div>
          </div>
        </Card>

        {isTeacher && !isAdminOrSuperAdmin && (
          <Card className="rounded-[1.5rem]">
            <BillingPanel showHeader />
          </Card>
        )}
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
