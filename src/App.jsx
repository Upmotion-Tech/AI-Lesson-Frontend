import { useEffect } from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { toast, Toaster, ToastBar } from "react-hot-toast";
import { X } from "lucide-react";
import store from "./store/index.js";
import router from "./router/router.jsx";
import { fetchMe } from "./store/authThunks.js";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";

const AppInitializer = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      store.dispatch(fetchMe()).catch(() => {});
    }
  }, []);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppInitializer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontSize: "0.85rem",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              background: "white",
              color: "#0f172a",
              border: "1px solid #f1f5f9",
              borderRadius: "1.5rem",
              padding: "1rem 1.5rem",
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#4f46e5",
                secondary: "white",
              },
            },
            error: {
              iconTheme: {
                primary: "#e11d48",
                secondary: "white",
              },
            },
          }}
        >
          {(t) => (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <div className="flex items-center gap-3">
                  {icon}
                  <span className="flex-1">{message}</span>
                  <button
                    type="button"
                    onClick={() => toast.dismiss(t.id)}
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </ToastBar>
          )}
        </Toaster>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
