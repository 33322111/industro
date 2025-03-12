import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api.js";
import logoutIcon from "../assets/logout_button.png";
import profileIcon from "../assets/profile_button.png";
import messagesIcon from "../assets/messages_button.png";
import filtersIcon from "../assets/filters_button.png";

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    try {
      const response = await api.get(`/ads/search/?search=${encodeURIComponent(searchQuery)}`);
      const searchResults = response.data;

      console.log("Результаты поиска:", searchResults);

      navigate("/search-results", { state: { results: searchResults } });
    } catch (error) {
      console.error("Ошибка при поиске:", error);
    }
  };

  const handleFilters = () => {
    console.log("Открыть фильтры");
    // TODO: добавить модалку с фильтрами или переход на страницу фильтрации
  };

  const searchPlaceholder = profileData.is_client
    ? "Поиск по исполнителям"
    : "Поиск по объявлениям";

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
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={styles.searchInput}
          />
          <button style={styles.filterButton} onClick={handleFilters}>
            <img src={filtersIcon} alt="Фильтры" style={styles.icon} />
          </button>
          <button style={styles.searchButton} onClick={handleSearch}>Найти</button>
        </div>
      )}

      {isAuthenticated && (
        profileData.is_client ? (
          <button style={styles.actionButton} onClick={() => navigate("/create-ad")}>
            Разместить объявление
          </button>
        ) : profileData.is_contractor ? (
          <button style={styles.actionButton} onClick={() => navigate("/create-resume")}>
            Создать резюме
          </button>
        ) : null
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
  filterButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    marginRight: "10px",
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
  actionButton: {
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
    width: "30px",
    height: "30px",
  },
};

export default Header;
