import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  Trash2,
  FileText,
  EyeOff,
  Eye,
  BookOpen,
  Users,
  LayoutTemplate
} from "lucide-react";
import Card from "../../components/common/Card.jsx";
import Modal from "../../components/common/Modal.jsx";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import PageTransition from "../../components/common/PageTransition.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import apiClient from "../../utils/apiClient.js";
import { getUserAvatarUrl } from "../../utils/userAvatar.js";

const getInitials = (name) => {
  if (!name) return "U";
  return name.substring(0, 2).toUpperCase();
};

const TAB_TYPES = [
  { id: "curriculum", label: "Curriculum", icon: BookOpen },
  { id: "student", label: "Student Data", icon: Users },
  { id: "lesson", label: "Lesson Plans", icon: LayoutTemplate },
];

const AdminContentPage = () => {
  const [activeTab, setActiveTab] = useState("curriculum");
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const searchParamsRef = useRef({ search: "", page: 1, limit: 10 });

  const fetchContent = useCallback(async (params = searchParamsRef.current, type = activeTab) => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/users/admin/content/${type}`, {
        params: {
          page: params.page,
          limit: params.limit,
          search: params.search,
        },
      });
      setData(res.data.items || []);
      if (res.data.pagination) setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch content");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // The initial fetch and tab-switch fetches are handled automatically 
  // by DataTable's onFetchParamsChange triggering on new mount (key={activeTab})

  const handleFetchParamsChange = useCallback(
    (params) => {
      searchParamsRef.current = params;
      fetchContent(params, activeTab);
    },
    [fetchContent, activeTab]
  );

  const toggleVisibility = async (record) => {
    try {
      const res = await apiClient.patch(`/users/admin/content/${activeTab}/${record._id}/visibility`);
      toast.success(res.data.message || "Visibility updated");
      fetchContent();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update visibility");
    }
  };

  const deleteContent = async (record) => {
    if (!window.confirm("Are you sure you want to completely delete this content?")) return;
    try {
      const res = await apiClient.delete(`/users/admin/content/${activeTab}/${record._id}`);
      toast.success(res.data.message || "Content deleted");
      fetchContent();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete content");
    }
  };

  const columns = useMemo(() => {
    const cols = [
      {
        key: "teacher",
        header: "Teacher",
        searchKey: [],
        render: (record) => {
          const user = record.teacherId;
          const avatarUrl = getUserAvatarUrl(user?.profileImage);
          return (
            <div className="flex items-center gap-4 min-w-[200px]">
              <div className="h-8 w-8 shrink-0 rounded-full bg-linear-to-br from-indigo-100 to-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden shadow-sm">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-indigo-700">
                    {getInitials(user?.name)}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-foreground text-sm truncate">{user?.name || "Unknown"}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          );
        },
      },
      {
        key: "details",
        header: "Content Details",
        searchKey: [],
        render: (record) => {
          if (activeTab === "lesson") {
            return (
              <div className="max-w-[300px]">
                <p className="font-semibold text-sm truncate">{record.objective || "Untitled Lesson"}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {record.standard?.description || "No standard attached"}
                </p>
              </div>
            );
          }
          return (
            <div className="max-w-[300px]">
              <p className="font-semibold text-sm truncate">{record.originalFilename || "No File Name"}</p>
              {activeTab === "student" && (
                <p className="text-xs text-muted-foreground">
                  {record.students?.length} student records
                </p>
              )}
            </div>
          );
        },
      },
      {
        key: "visibility",
        header: "Visibility",
        searchKey: [],
        render: (record) => {
          return (
            <Badge variant={record.isHidden ? "warning" : "success"} className="shadow-none">
              {record.isHidden ? "Hidden" : "Visible"}
            </Badge>
          );
        },
      },
      {
        key: "createdAt",
        header: "Uploaded At",
        searchKey: [],
        render: (record) => (
          <span className="text-xs font-medium text-muted-foreground">
            {new Date(record.createdAt).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric'
            })}
          </span>
        ),
      },
    ];
    return cols;
  }, [activeTab]);

  const rowActions = useMemo(
    () => [
      {
        key: "toggle-visibility",
        label: "Toggle Visibility",
        icon: <EyeOff className="h-4 w-4" />,
        onClick: toggleVisibility,
      },
      {
        key: "delete-content",
        label: "Permanently Delete",
        icon: <Trash2 className="h-4 w-4 text-rose-500" />,
        destructive: true,
        onClick: deleteContent,
      },
    ],
    [activeTab] // Requires activeTab for accurate API call inside toggle/delete functions
  );

  return (
    <PageTransition>
      <div className="space-y-8 pb-16">
        <div className="rounded-3xl bg-linear-to-br from-slate-900 to-indigo-900 text-white p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
                Admin
              </p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Content Management</h1>
            </div>
          </div>
        </div>

        {/* Custom Admin Content Tabs */}
        <div className="flex border-b border-border/60">
          {TAB_TYPES.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  searchParamsRef.current = { search: "", page: 1, limit: 10 };
                }}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors border-b-2 ${
                  isActive
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <Card className="rounded-2xl border-0 ring-1 ring-border/50 shadow-md">
          <DataTable
            key={activeTab} // Force remount of generic table on tab switch to clear searches
            className="p-2"
            title={`${TAB_TYPES.find(t => t.id === activeTab)?.label} Repository`}
            description={`Manage your users' ${TAB_TYPES.find(t => t.id === activeTab)?.label.toLowerCase()} content.`}
            data={data}
            loading={loading}
            columns={columns}
            rowActions={rowActions}
            initialPageSize={10}
            searchPlaceholder={`Search ${TAB_TYPES.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
            serverPagination={pagination}
            onFetchParamsChange={handleFetchParamsChange}
          />
        </Card>
      </div>
    </PageTransition>
  );
};

export default AdminContentPage;
