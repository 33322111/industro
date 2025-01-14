import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ isAuthenticated, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header style={styles.header}>
      <div>
        <h1>Industro</h1>
      </div>
      <div>
        {location.pathname === "/" && !isAuthenticated ? (
          // Главная страница для неавторизованных пользователей
          <>
            <button style={styles.authButton} onClick={() => navigate("/login")}>
              Войти
            </button>
            <button
              style={{ ...styles.authButton, marginLeft: "10px" }}
              onClick={() => navigate("/register")}
            >
              Регистрация
            </button>
          </>
        ) : isAuthenticated ? (
          // Для авторизованных пользователей
          <>
            <button
              style={styles.authButton}
              onClick={() => navigate("/profile")}
            >
              Личный кабинет
            </button>
            <button
              style={{ ...styles.authButton, marginLeft: "10px" }}
              onClick={() => {
                console.log("Кнопка 'Выйти' нажата");
                handleLogout();
              }}
            >
              Выйти
            </button>
          </>
        ) : (
          // Назад на других страницах для неавторизованных
          <button style={styles.authButton} onClick={() => navigate("/")}>
            Назад
          </button>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#1a73e8",
    color: "white",
  },
  authButton: {
    padding: "10px 20px",
    backgroundColor: "white",
    color: "#1a73e8",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default Header;
