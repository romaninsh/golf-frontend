import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import TagsPage from "@/pages/TagsPage";
import EvidencePage from "@/pages/EvidencePage";
import GolfCoursesPage from "@/pages/GolfCoursesPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import "./App.css";

function App() {
  const { isLoading, error } = useAuth0();
  const { isAuthenticated, isAdmin } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/tags"
            element={isAuthenticated && isAdmin ? <TagsPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/evidence"
            element={
              isAuthenticated && isAdmin ? <EvidencePage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/golf-courses"
            element={
              isAuthenticated && isAdmin ? <GolfCoursesPage /> : <Navigate to="/login" replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
