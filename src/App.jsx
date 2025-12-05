import { useEffect } from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
              fontSize: "0.95rem",
              background: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
            },
            success: {
              iconTheme: {
                primary: "hsl(var(--success))",
                secondary: "white",
              },
            },
            error: {
              iconTheme: {
                primary: "hsl(var(--danger))",
                secondary: "white",
              },
            },
          }}
        />
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
