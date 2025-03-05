import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api.js";
import logoutIcon from "../assets/logout_button.png"; // Иконка выхода
import profileIcon from "../assets/profile_button.png"; // Иконка профиля
import messagesIcon from "../assets/messages_button.png"; // Иконка сообщений

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
    is_client: false,
    is_contractor: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

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

  // Определяем плейсхолдер в поле поиска
  const searchPlaceholder = profileData.is_client
    ? "Поиск по исполнителям"
    : "Поиск по объявлениям";

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
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button style={styles.searchButton} onClick={handleSearch}>Найти</button>
        </div>
      )}
      {isAuthenticated && profileData.is_client && (
        <button style={styles.createAdButton} onClick={() => navigate("/create-ad")}>Разместить объявление</button>
      )}
      <div style={styles.iconsContainer}>
        {isAuthenticated ? (
          <>
            <button style={styles.iconButton} onClick={() => navigate("/messages")}>
              <img src={messagesIcon} alt="Сообщения" style={styles.icon} />
            </button>
            <button style={styles.iconButton} onClick={() => navigate("/profile")}>
              <img src={profileIcon} alt="Профиль" style={styles.icon} />
            </button>
            <button style={styles.logoutButton} onClick={handleLogout}>
              <img src={logoutIcon} alt="Выйти" style={styles.icon} />
            </button>
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
    marginRight: "10px",
  },
  iconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    marginRight: "10px",
  },
  logoutButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "5px",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    width: "30px",  // Размер иконок профиля, сообщений и выхода
    height: "30px",
  },
};

export default Header;
