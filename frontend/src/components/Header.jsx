import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import api from "../services/api.js";
import logoutIcon from "../assets/logout_button.png";
import profileIcon from "../assets/profile_button.png";
import messagesIcon from "../assets/messages_button.png";
import filtersIcon from "../assets/filters_button.png";
import favouriteIcon from "../assets/favourite_button.png";

const Header = ({isAuthenticated, handleLogout, toggleChatSidebar}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const filtersRef = useRef();

    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [profileData, setProfileData] = useState({is_client: false, is_contractor: false});
    const [unreadCount, setUnreadCount] = useState(0);

    const initialFilters = {
        category: "",
        subcategory: "",
        price_from: "",
        price_to: "",
        execution_time: "",
        location: "",
        ordering: "-created_at",
    };

    const [filters, setFilters] = useState(initialFilters);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const res = await api.get("/chat/unread-count/");
                setUnreadCount(res.data.unread_count);
            } catch (err) {
                console.error("Ошибка загрузки количества непрочитанных сообщений:", err);
            }
        };

        if (isAuthenticated) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 7500);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

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

    useEffect(() => {
        if (isAuthenticated) fetchProfile();
    }, [isAuthenticated]);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/profile/");
            setProfileData(response.data);
        } catch (error) {
            console.error("Ошибка загрузки профиля:", error);
        }
    };

    useEffect(() => {
        if (location.pathname === "/") setSearchQuery("");
    }, [location.pathname]);

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

    const handleFilterChange = (field, value) => {
        if (field === "sort_by") {
            setFilters((prev) => ({
                ...prev,
                ordering: value === "newest" ? "-created_at" : "created_at",
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                [field]: value,
                ...(field === "category" && {subcategory: ""}),
            }));
        }
    };

    const handleSearch = async () => {
        try {
            const params = new URLSearchParams();
            if (searchQuery.trim()) params.append("search", searchQuery.trim());
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            const endpoint = profileData.is_client
                ? `/resumes/search/?${params.toString()}`
                : `/ads/search/?${params.toString()}`;
            const response = await api.get(endpoint);
            navigate("/search-results", {state: {results: response.data}});
            setShowFilters(false);
        } catch (error) {
            console.error("Ошибка применения поиска/фильтрации:", error);
        }
    };

    const handleLogoutWithReset = () => {
        setFilters(initialFilters);
        setShowFilters(false);
        handleLogout();
        navigate("/");
    };

    const searchPlaceholder = profileData.is_client
        ? "Поиск по исполнителям"
        : "Поиск по объявлениям";

    const hideSearchBarPages = ["/login", "/register", "/change-password", "/profile"];
    const shouldShowSearchBar = !hideSearchBarPages.includes(location.pathname);

    // applySearchAndFilters принимает внешние фильтры
    const applySearchAndFilters = async (customFilters = filters) => {
        try {
            const params = new URLSearchParams();

            if (searchQuery.trim()) params.append("search", searchQuery.trim());

            Object.entries(customFilters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const endpoint = profileData.is_client
                ? `/contractors/search/?${params.toString()}`
                : `/ads/search/?${params.toString()}`;

            const response = await api.get(endpoint);
            navigate("/search-results", {state: {results: response.data}});
            setShowFilters(false);
        } catch (error) {
            console.error("Ошибка применения поиска/фильтрации:", error);
        }
    };

    const applyFilters = () => {
        applySearchAndFilters();
    };

    const resetFilters = () => {
        setFilters(initialFilters);
        applySearchAndFilters(initialFilters); // Передаем начальные фильтры
    };

    return (
        <header className="flex items-center justify-between p-4 bg-blue-600 text-white relative">
            <h1 className="text-2xl font-bold cursor-pointer select-none" onClick={() => navigate("/")}>Industro</h1>

            {isAuthenticated && shouldShowSearchBar && (
                <div className="flex items-center bg-white rounded-lg px-3 py-1 w-2/4 text-black">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-grow outline-none px-2 py-1 text-sm bg-transparent"
                    />
                    <button onClick={() => setShowFilters(!showFilters)} className="mr-2">
                        <img src={filtersIcon} alt="Фильтры" className="w-6 h-6"/>
                    </button>
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-700"
                    >
                        Найти
                    </button>
                </div>
            )}

            {isAuthenticated && profileData.is_client && (
                <button
                    onClick={() => navigate("/create-ad")}
                    className="ml-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm"
                >
                    Разместить объявление
                </button>
            )}

            {isAuthenticated && profileData.is_contractor && (
                <button
                    onClick={() => navigate("/create-resume")}
                    className="ml-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm"
                >
                    Создать резюме
                </button>
            )}

            <div className="flex items-center ml-4 space-x-4">
                {isAuthenticated ? (
                    <>
                        <button onClick={() => navigate("/favourites")}>
                            <img src={favouriteIcon} alt="Избранное" className="w-7 h-7"/>
                        </button>
                        <button onClick={toggleChatSidebar} className="relative">
                            <img src={messagesIcon} alt="Сообщения" className="w-7 h-7"/>
                            {unreadCount > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {unreadCount}
                </span>
                            )}
                        </button>
                        <button onClick={() => navigate("/profile")}>
                            <img src={profileIcon} alt="Профиль" className="w-7 h-7"/>
                        </button>
                        <button onClick={handleLogoutWithReset}>
                            <img src={logoutIcon} alt="Выйти" className="w-7 h-7"/>
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate("/login")}
                                className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold text-sm">
                            Войти
                        </button>
                        <button onClick={() => navigate("/register")}
                                className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold text-sm">
                            Регистрация
                        </button>
                    </>
                )}
            </div>

            {showFilters && (
                <div
                    ref={filtersRef}
                    className="absolute top-full right-4 mt-2 bg-white text-black p-4 rounded-md shadow-xl w-96 z-50"
                >
                    <h3 className="text-blue-600 text-xl font-semibold mb-4 text-center">Фильтры</h3>
                    <div className="space-y-4">
                        <div>
                            <label>Категория</label>
                            <select
                                className="w-full border p-2 rounded"
                                value={filters.category}
                                onChange={(e) => handleFilterChange("category", e.target.value)}
                            >
                                <option value="">Все категории</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>

                        {filters.category && (
                            <div>
                                <label>Подкатегория</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={filters.subcategory}
                                    onChange={(e) => handleFilterChange("subcategory", e.target.value)}
                                >
                                    <option value="">Все подкатегории</option>
                                    {categories
                                        .find((cat) => cat.id.toString() === filters.category)
                                        ?.subcategories.map((subcategory) => (
                                            <option key={subcategory.id}
                                                    value={subcategory.id}>{subcategory.name}</option>
                                        ))}
                                </select>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label>Цена от (₽)</label>
                                <input type="number" className="w-full border p-2 rounded" value={filters.price_from}
                                       onChange={(e) => handleFilterChange("price_from", e.target.value)}/>
                            </div>
                            <div className="flex-1">
                                <label>Цена до (₽)</label>
                                <input type="number" className="w-full border p-2 rounded" value={filters.price_to}
                                       onChange={(e) => handleFilterChange("price_to", e.target.value)}/>
                            </div>
                        </div>

                        <div>
                            <label>Срок выполнения</label>
                            <select className="w-full border p-2 rounded" value={filters.execution_time}
                                    onChange={(e) => handleFilterChange("execution_time", e.target.value)}>
                                <option value="">Любой</option>
                                <option value="one_time">Разовое задание</option>
                                <option value="long_term">Долгосрочное сотрудничество</option>
                                <option value="urgent">Срочный проект</option>
                            </select>
                        </div>

                        <div>
                            <label>Локация</label>
                            <select className="w-full border p-2 rounded" value={filters.location}
                                    onChange={(e) => handleFilterChange("location", e.target.value)}>
                                <option value="">Любая</option>
                                <option value="on_site">На месте</option>
                                <option value="remote">Удаленно</option>
                            </select>
                        </div>

                        <div>
                            <label>Сортировка</label>
                            <select className="w-full border p-2 rounded"
                                    value={filters.ordering === "-created_at" ? "newest" : "oldest"}
                                    onChange={(e) => handleFilterChange("sort_by", e.target.value)}>
                                <option value="newest">Сначала новые</option>
                                <option value="oldest">Сначала старые</option>
                            </select>
                        </div>

                        <div className="flex justify-between gap-4">
                            <button onClick={applyFilters}
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded font-semibold">
                                Применить
                            </button>
                            <button onClick={resetFilters}
                                    className="w-full bg-gray-200 text-blue-600 px-4 py-2 rounded font-semibold">
                                Сбросить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
