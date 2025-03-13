import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const categories = {
  "Проектирование и инжиниринг": [
    "Архитектурное проектирование промышленных объектов",
    "Технологическое проектирование (линии, цеха, заводы)",
    "Проектирование инженерных сетей (электроснабжение, водоснабжение, вентиляция)",
    "Автоматизация и цифровизация производства (IIoT, SCADA, MES)",
    "Экологическое проектирование (очистные сооружения, отходы)",
    "Другое",
  ],
  "Монтаж и пусконаладочные работы": [
    "Электромонтажные работы",
    "Монтаж и наладка технологического оборудования",
    "Монтаж трубопроводов и инженерных коммуникаций",
    "Пусконаладка КИПиА (контрольно-измерительные приборы и автоматика)",
    "Балансировка и наладка вентиляции и кондиционирования",
    "Другое",
  ],
  "Производство и поставка оборудования": [
    "Промышленные насосы и компрессоры",
    "Котельное и теплоэнергетическое оборудование",
    "Системы очистки воды и газов",
    "Робототехника и автоматизированные комплексы",
    "Электротехническое оборудование (распределительные щиты, трансформаторы)",
    "Другое",
  ],
  "Обслуживание и ремонт": [
    "Техническое обслуживание производственных линий",
    "Диагностика и ремонт промышленного оборудования",
    "Обслуживание инженерных систем (отопление, вентиляция, кондиционирование)",
    "Аутсорсинг сервисных работ (инженеры, наладчики)",
    "Другое",
  ],
  "Строительство промышленных объектов": [
    "Генеральный подряд (строительство \"под ключ\")",
    "Металлоконструкции и каркасные здания",
    "Фундаментные работы и геодезия",
    "Промышленное остекление и фасады",
    "Промышленные покрытия и антикоррозийная защита",
    "Другое",
  ],
  "Логистика и складские услуги": [
    "Транспортировка промышленного оборудования",
    "Логистика опасных грузов",
    "Аренда и продажа складских помещений",
    "Контейнерные перевозки и спецтранспорт",
    "Другое",
  ],
  "Энергетика и альтернативные источники": [
    "Системы энергосбережения и энергоэффективности",
    "Внедрение возобновляемых источников энергии (солнечные панели, биогаз)",
    "Автономные энергосистемы (дизель-генераторы, UPS)",
    "Другое",
  ],
  "Экологические услуги и охрана труда": [
    "Экологический аудит и сертификация",
    "Обращение с промышленными отходами",
    "Фундаментные работы и геодезия",
    "Промышленная безопасность и охрана труда",
    "Пожарная безопасность и противопожарные системыа",
    "Другое",
  ],
  "IT и программное обеспечение для промышленности": [
    "Разработка специализированного ПО для заводов и производств",
    "SCADA, MES, ERP-системы",
    "Инженерное ПО (AutoCAD, SolidWorks, 3D моделирование)",
    "Промышленный интернет вещей (IIoT)",
    "Другое",
  ],
  "Кадровые услуги и обучение": [
    "Поиск и подбор инженеров, проектировщиков, монтажников",
    "Аутсорсинг производственного персонала",
    "Курсы и тренинги по промышленному инжинирингу",
    "Аттестация персонала (сварщики, электрики, операторы)",
    "Другое",
  ],
  "Другое": ["Другое"],
};

const CreateResumePage = () => {
  const navigate = useNavigate();

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
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState("");

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setSelectedSubcategory("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (documents) {
      for (let i = 0; i < documents.length; i++) {
        formData.append("documents", documents[i]);
      }
    }

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
      <h1>Создать резюме</h1>

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
            {Object.keys(categories).map((category) => (
              <option key={category} value={category}>
                {category}
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
              {categories[selectedCategory].map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
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
            <option value="on_site">Выезд</option>
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
          Примеры работ:
          <input
            type="file"
            multiple
            onChange={(e) => setDocuments(e.target.files)}
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
