import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateAdPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceType, setPriceType] = useState("fixed");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [fixedPrice, setFixedPrice] = useState("");
  const [executionTime, setExecutionTime] = useState("one_time");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [location, setLocation] = useState("on_site");
  const [city, setCity] = useState("");
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState("");

  // Получаем категории при загрузке страницы
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидации формы
    if (!selectedCategory || !selectedSubcategory || !title || !description) {
      setError("Пожалуйста, заполните все обязательные поля.");
      return;
    }

    if (priceType === "fixed" && !fixedPrice) {
      setError("Пожалуйста, укажите фиксированную цену.");
      return;
    }

    if (priceType === "range" && (!priceFrom || !priceTo)) {
      setError("Пожалуйста, укажите диапазон цен.");
      return;
    }

    if (executionTime === "urgent" && !projectDeadline) {
      setError("Пожалуйста, укажите сроки проекта.");
      return;
    }

    if (location === "on_site" && !city) {
      setError("Пожалуйста, укажите город.");
      return;
    }

    if (!documents || documents.length === 0) {
      setError("Пожалуйста, загрузите документы.");
      return;
    }

    setError(""); // Очистка ошибок

    const formData = new FormData();
    formData.append("category", selectedCategory);
    formData.append("subcategory", selectedSubcategory);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price_type", priceType);
    formData.append("price_from", priceFrom);
    formData.append("price_to", priceTo);
    formData.append("fixed_price", fixedPrice);
    formData.append("execution_time", executionTime);
    formData.append("project_deadline", projectDeadline);
    formData.append("location", location);
    formData.append("city", city);

    for (let i = 0; i < documents.length; i++) {
      formData.append("documents", documents[i]);
    }

    try {
      const response = await api.post("/ads/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        alert("Объявление успешно создано!");
        navigate("/");
      }
    } catch (error) {
      setError("Ошибка при создании объявления. Пожалуйста, попробуйте снова.");
      console.error("Ошибка:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Создать объявление</h1>

      <form onSubmit={handleSubmit} style={styles.form}>

        <label style={styles.label}>
          Категория:
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory("");
            }}
            style={styles.input}
            required
          >
            <option value="">Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        {selectedCategory && (
          <label style={styles.label}>
            Подкатегория:
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              style={styles.input}
              required
            >
              <option value="">Выберите подкатегорию</option>
              {categories
                .find((category) => category.id.toString() === selectedCategory)
                ?.subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
            </select>
          </label>
        )}

        <label style={styles.label}>
          Название:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          Описание:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...styles.input, height: "100px" }}
            required
          />
        </label>

        <label style={styles.label}>
          Тип цены:
          <select
            value={priceType}
            onChange={(e) => setPriceType(e.target.value)}
            style={styles.input}
          >
            <option value="fixed">Фиксированная цена</option>
            <option value="range">Диапазон</option>
            <option value="negotiable">Договорная</option>
          </select>
        </label>

        {priceType === "fixed" && (
          <label style={styles.label}>
            Фиксированная цена (₽):
            <input
              type="number"
              value={fixedPrice}
              onChange={(e) => setFixedPrice(e.target.value)}
              style={styles.input}
              required
            />
          </label>
        )}

        {priceType === "range" && (
          <>
            <label style={styles.label}>
              Цена от (₽):
              <input
                type="number"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                style={styles.input}
                required
              />
            </label>

            <label style={styles.label}>
              Цена до (₽):
              <input
                type="number"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                style={styles.input}
                required
              />
            </label>
          </>
        )}

        <label style={styles.label}>
          Срок выполнения:
          <select
            value={executionTime}
            onChange={(e) => setExecutionTime(e.target.value)}
            style={styles.input}
          >
            <option value="one_time">Разовое задание</option>
            <option value="long_term">Долгосрочное сотрудничество</option>
            <option value="urgent">Срочный проект</option>
          </select>
        </label>

        {executionTime === "urgent" && (
          <label style={styles.label}>
            Сроки проекта (дней):
            <input
              type="number"
              value={projectDeadline}
              onChange={(e) => setProjectDeadline(e.target.value)}
              style={styles.input}
              required
            />
          </label>
        )}

        <label style={styles.label}>
          Локация:
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={styles.input}
          >
            <option value="on_site">На месте</option>
            <option value="remote">Удаленно</option>
          </select>
        </label>

        {location === "on_site" && (
          <label style={styles.label}>
            Город:
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={styles.input}
              required
            />
          </label>
        )}

        <label style={styles.label}>
          Документы:
          <input
            type="file"
            multiple
            onChange={(e) => setDocuments(e.target.files)}
            style={styles.input}
          />
        </label>

        <button type="submit" style={styles.button}>
          Создать объявление
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

export default CreateAdPage;
