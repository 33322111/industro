import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api.js";
import logoutIcon from "../assets/logout_button.png";
import profileIcon from "../assets/profile_button.png";
import messagesIcon from "../assets/messages_button.png";
import filtersIcon from "../assets/filters_button.png";

const Header = ({ isAuthenticated, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const filtersRef = useRef();

  // Категории из бэкенда
  const [categories, setCategories] = useState([]);

  // Поиск, фильтры и профиль
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [profileData, setProfileData] = useState({
    is_client: false,
    is_contractor: false,
  });

  const initialFilters = {
    category: "",
    subcategory: "",
    price_from: "",
    price_to: "",
    execution_time: "",
    location: "",
    sort_by: "newest",
  };

  const [filters, setFilters] = useState(initialFilters);

  // Получаем категории с бэка
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      }
    };

    fetchCategories();
  }, []);

  // Получаем профиль, если пользователь авторизован
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

  // Очистка поискового запроса при переходе на главную
  useEffect(() => {
    if (location.pathname === "/") {
      setSearchQuery("");
    }
  }, [location.pathname]);

  // Закрытие фильтров при клике вне блока
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  // Поиск по объявлениям или исполнителям
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await api.get(`/ads/search/?search=${encodeURIComponent(searchQuery)}`);
      navigate("/search-results", { state: { results: response.data } });
    } catch (error) {
      console.error("Ошибка при поиске:", error);
    }
  };

  // Переключение показа фильтров
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  // Изменение фильтров
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "category" && { subcategory: "" }), // сбрасываем подкатегорию при смене категории
    }));
  };

  // Применение фильтров
  const applyFilters = async () => {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/ads/filter/?${params.toString()}`);
      navigate("/search-results", { state: { results: response.data } });
      setShowFilters(false);
    } catch (error) {
      console.error("Ошибка применения фильтров:", error);
    }
  };

  // Сброс фильтров
  const resetFilters = async () => {
    setFilters(initialFilters);

    try {
      const response = await api.get("/ads/filter/");
      navigate("/search-results", { state: { results: response.data } });
      setShowFilters(false);
    } catch (error) {
      console.error("Ошибка при сбросе фильтров:", error);
    }
  };

  // Выход с очисткой фильтров
  const handleLogoutWithReset = () => {
    setFilters(initialFilters);
    setShowFilters(false);
    handleLogout(); // исходный обработчик из родителя
    navigate("/"); // перенаправляем на главную после выхода
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
          <button style={styles.filterButton} onClick={toggleFilters}>
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
            <button style={styles.logoutButton} onClick={handleLogoutWithReset}>
              <img src={logoutIcon} alt="Выйти" style={styles.icon} />
            </button>
          </>
        ) : (
          <>
            <button style={styles.authButton} onClick={() => navigate("/login")}>Войти</button>
            <button
              style={{ ...styles.authButton, marginLeft: "10px" }}
              onClick={() => navigate("/register")}
            >
              Регистрация
            </button>
          </>
        )}
      </div>

      {showFilters && (
        <div style={styles.filtersPanel} ref={filtersRef}>
          <h3 style={styles.filtersTitle}>Фильтры</h3>

          {/* Категория */}
          <div style={styles.filterGroup}>
            <label>Категория</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Подкатегория */}
          {filters.category && (
            <div style={styles.filterGroup}>
              <label>Подкатегория</label>
              <select
                value={filters.subcategory}
                onChange={(e) => handleFilterChange("subcategory", e.target.value)}
              >
                <option value="">Все подкатегории</option>
                {categories
                  .find((category) => category.id.toString() === filters.category)
                  ?.subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Цена от */}
          <div style={styles.filterGroup}>
            <label>Цена от (₽)</label>
            <input
              type="number"
              placeholder="Минимальная цена"
              value={filters.price_from}
              onChange={(e) => handleFilterChange("price_from", e.target.value)}
            />
          </div>

          {/* Цена до */}
          <div style={styles.filterGroup}>
            <label>Цена до (₽)</label>
            <input
              type="number"
              placeholder="Максимальная цена"
              value={filters.price_to}
              onChange={(e) => handleFilterChange("price_to", e.target.value)}
            />
          </div>

          {/* Срок выполнения */}
          <div style={styles.filterGroup}>
            <label>Срок выполнения</label>
            <select
              value={filters.execution_time}
              onChange={(e) => handleFilterChange("execution_time", e.target.value)}
            >
              <option value="">Любой срок</option>
              <option value="one_time">Разовое задание</option>
              <option value="long_term">Долгосрочное сотрудничество</option>
              <option value="urgent">Срочный проект</option>
            </select>
          </div>

          {/* Локация */}
          <div style={styles.filterGroup}>
            <label>Локация</label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            >
              <option value="">Любая</option>
              <option value="on_site">На месте</option>
              <option value="remote">Удаленно</option>
            </select>
          </div>

          {/* Сортировка */}
          <div style={styles.filterGroup}>
            <label>Сортировка</label>
            <select
              value={filters.sort_by}
              onChange={(e) => handleFilterChange("sort_by", e.target.value)}
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
            </select>
          </div>

          <div style={styles.filterButtonsContainer}>
            <button style={styles.applyButton} onClick={applyFilters}>
              Применить фильтры
            </button>
            <button style={styles.clearButton} onClick={resetFilters}>
              Очистить фильтры
            </button>
          </div>
        </div>
      )}
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
    position: "relative",
  },
  logo: { cursor: "pointer", userSelect: "none" },
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
  iconsContainer: { display: "flex", alignItems: "center" },
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
    marginRight: "10px",
  },
  logoutButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "5px",
  },
  icon: { width: "30px", height: "30px" },
  filtersPanel: {
    position: "absolute",
    top: "80px",
    right: "20px",
    width: "350px",
    padding: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    zIndex: 100,
    color: "#333",
  },
  filtersTitle: {
    color: "#1a73e8",
    fontSize: "20px",
    marginBottom: "15px",
    textAlign: "center",
  },
  filterGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  filterButtonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  applyButton: {
    flex: 1,
    padding: "10px 15px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  clearButton: {
    flex: 1,
    padding: "10px 15px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Header;
