import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const headers = token
        ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        : { "Content-Type": "application/json" };

      const res = await fetch(`${backend_url}/api/auth/me`, {
        headers,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || data.error) return null;

      return data;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-white dark:bg-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="flex max-w-full mx-auto">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        {authUser && (
          <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-0 h-screen">
            <Sidebar />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <Routes>
            <Route 
              path="/" 
              element={authUser ? <HomePage /> : <Navigate to="/login" />} 
            />
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/notifications"
              element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile/:username"
              element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>

        {/* Right Panel - Hidden on mobile and tablet, visible on desktop */}
        {authUser && (
          <div className="hidden xl:block w-80 flex-shrink-0 sticky top-0 h-screen">
            <RightPanel />
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation (if you have one) */}
      {authUser && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
          {/* You can add mobile navigation here if needed */}
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg, #363636)',
            color: 'var(--toast-color, #fff)',
          },
          className: 'dark:bg-gray-800 dark:text-white bg-white text-black border border-gray-200 dark:border-gray-700',
        }}
      />
    </div>
  );
}

export default App;