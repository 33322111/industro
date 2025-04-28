import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateResumePage = () => {
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
  const [location, setLocation] = useState("on_site");
  const [city, setCity] = useState("");
  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");

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

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedSubcategory("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !selectedSubcategory || !title || !description || !document) {
      setError("Пожалуйста, заполните все обязательные поля и загрузите файл.");
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

    if (location === "on_site" && !city) {
      setError("Пожалуйста, укажите город.");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("category", selectedCategory);
    formData.append("subcategory", selectedSubcategory);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price_type", priceType);
    formData.append("price_from", priceFrom);
    formData.append("price_to", priceTo);
    formData.append("fixed_price", fixedPrice);
    formData.append("location", location);
    formData.append("city", city);
    formData.append("documents", document);

    try {
      const response = await api.post("/resumes/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        alert("Резюме успешно создано!");
        navigate("/");
      }
    } catch (error) {
      console.error("Ошибка при создании резюме:", error);
      setError("Ошибка при создании резюме. Пожалуйста, попробуйте снова.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 className="text-3xl font-bold mb-6">Создать резюме</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>
          Категория:
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            required
            style={styles.input}
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
              required
              style={styles.input}
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
            required
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Описание:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ ...styles.input, height: "100px" }}
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
              required
              style={styles.input}
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
                required
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Цена до (₽):
              <input
                type="number"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                required
                style={styles.input}
              />
            </label>
          </>
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
              required
              style={styles.input}
            />
          </label>
        )}

        <label style={styles.label}>
          Пример работы:
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setDocument(e.target.files[0])}
            required
            style={styles.input}
          />
        </label>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>
          Создать резюме
        </button>
      </form>
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

export default CreateResumePage;