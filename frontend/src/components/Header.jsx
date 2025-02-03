import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ isAuthenticated, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Поиск: ", searchQuery);
    // Здесь можно добавить логику для поиска
  };

  // Список страниц, где не нужно отображать поле поиска
  const hideSearchBarPages = ["/login", "/register", "/password-reset", "/profile"];
  const shouldShowSearchBar = !hideSearchBarPages.includes(location.pathname);

  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.logo} onClick={() => navigate("/")}>Industro</h1>
      </div>
      {shouldShowSearchBar && (
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Поиск по объявлениям"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button style={styles.searchButton} onClick={handleSearch}>Найти</button>
        </div>
      )}
      <div style={styles.iconsContainer}>
        {location.pathname === "/" && !isAuthenticated ? (
          // Главная страница для неавторизованных пользователей
          <>
            <button style={styles.authButton} onClick={() => navigate("/login")}>Войти</button>
            <button
              style={{ ...styles.authButton, marginLeft: "10px" }}
              onClick={() => navigate("/register")}
            >Регистрация</button>
          </>
        ) : isAuthenticated ? (
          // Для авторизованных пользователей
          <>
            <button style={styles.authButton} onClick={() => navigate("/profile")}>Личный кабинет</button>
            <button
              style={{ ...styles.authButton, marginLeft: "10px" }}
              onClick={() => {
                console.log("Кнопка 'Выйти' нажата");
                handleLogout();
              }}
            >Выйти</button>
          </>
        ) : (
          // Назад на других страницах для неавторизованных
          <button style={styles.authButton} onClick={() => navigate("/")}>Назад</button>
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
  logo: {
    cursor: "pointer",
    userSelect: "none",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: "8px",
    padding: "5px",
    width: "60%",
  },
  searchInput: {
    border: "none",
    backgroundColor: "transparent",
    padding: "10px",
    fontSize: "16px",
    outline: "none",
    flexGrow: 1,
  },
  searchButton: {
    padding: "10px 20px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  iconsContainer: {
    display: "flex",
    alignItems: "center",
  },
  favoriteIcon: {
    width: "30px",
    height: "30px",
    cursor: "pointer",
    marginRight: "10px",
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
