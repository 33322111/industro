import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PasswordReset from "./pages/PasswordReset";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверяем наличие токена авторизации
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token); // Если токен есть, пользователь авторизован
  }, []);

  return (
    <Router>
      <Layout isAuthenticated={isAuthenticated}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/*<Route*/}
          {/*  path="/login"*/}
          {/*  element={!isAuthenticated ? <div>Логин</div> : <Navigate to="/" />}*/}
          {/*/>*/}
          {/*<Route*/}
          {/*  path="/register"*/}
          {/*  element={!isAuthenticated ? <div>Регистрация</div> : <Navigate to="/" />}*/}
          {/*/>*/}
          <Route
            path="/password-reset"
            element={!isAuthenticated ? <PasswordReset /> : <Navigate to="/" />}
          />
          {/*<Route*/}
          {/*  path="/password-change"*/}
          {/*  element={isAuthenticated ? <PasswordChange /> : <Navigate to="/login" />}*/}
          {/*/>*/}
          {/*<Route*/}
          {/*  path="/profile"*/}
          {/*  element={isAuthenticated ? <div>Личный кабинет</div> : <Navigate to="/login" />}*/}
          {/*/>*/}
          {/*<Route path="*" element={<Navigate to="/" />} />*/}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
