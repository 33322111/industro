import React, {useEffect, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api.js";

const Header = ({ isAuthenticated, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [profileData, setProfileData] = useState({
    avatar: null,
    username: "",
    email: "",
    role: "",
    company_info: "",
    address: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile/");
      setProfileData(response.data);
    } catch (error) {
      console.error("Ошибка загрузки профиля:", error);
    }
  };

  const handleSearch = () => {
    console.log("Поиск: ", searchQuery);
  };

  // Список страниц, где не нужно отображать поле поиска
  const hideSearchBarPages = ["/login", "/register", "/change-password", "/profile"];
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
      {isAuthenticated && profileData.is_client && (
        <button style={styles.createAdButton} onClick={() => navigate("/create-ad")}>Создать объявление</button>
      )}
      <div style={styles.iconsContainer}>
        {location.pathname === "/profile" ? (
          <>
            <button style={styles.authButton} onClick={() => navigate(-1)}>Назад</button>
            <button
              style={{ ...styles.authButton, marginLeft: "10px" }}
              onClick={() => {
                console.log("Кнопка 'Выйти' нажата");
                handleLogout();
              }}
            >Выйти</button>
          </>
        ) : isAuthenticated ? (
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
          <>
            <button style={styles.authButton} onClick={() => navigate("/login")}>Войти</button>
            <button
              style={{ ...styles.authButton, marginLeft: "10px" }}
              onClick={() => navigate("/register")}
            >Регистрация</button>
          </>
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
  createAdButton: {
    padding: "10px 20px",
    backgroundColor: "white",
    color: "#1a73e8",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginLeft: "10px",
  },
  iconsContainer: {
    display: "flex",
    alignItems: "center",
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