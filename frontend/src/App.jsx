import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordReset from "./pages/PasswordReset.jsx";
import Profile from "./pages/Profile.jsx";
import CreateAd from "./pages/CreateAd.jsx";
import AdDetailPage from "./pages/AdDetailPage.jsx";
import CreateResume from "./pages/CreateResume.jsx";
import ResumeDetailPage from "./pages/ResumeDetailPage.jsx";
import SearchResultsPage from "./pages/SearchResultsPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Проверяем наличие токена в localStorage при загрузке приложения
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token); // Устанавливаем true, если токен существует
  }, []);

  const handleLogin = (token) => {
    // Сохраняем токен и обновляем состояние
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    console.log("Вызван handleLogout"); // Лог для проверки
    // Удаляем токен и обновляем состояние
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route
            path="/login"
            element={!isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/" />
            )}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? (
              <Register onLogin={handleLogin} />
            ) : (
              <Navigate to="/" />
            )}
          />
          <Route
            path="/password-reset"
            element={!isAuthenticated ? (
              <PasswordReset onLogin={handleLogin} />
            ) : (
              <Navigate to="/" />
            )}
          />
          <Route
            path="/profile"
            element={<Profile isAuthenticated={isAuthenticated}/>}
          />
          <Route path="*" element={<Navigate to="/" />} />
          <Route
            path="/create-ad"
            element={<CreateAd />}
          />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route
            path="/create-resume"
            element={<CreateResume />}
          />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/ads/:id/" element={<AdDetailPage />} />
          <Route path="/resumes/:id/" element={<ResumeDetailPage />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/profile/:id" element={<UserProfilePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
