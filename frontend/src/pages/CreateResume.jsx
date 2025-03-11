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
    setSelectedSubcategory(categories[category] ? categories[category][0] : "Другое");
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
  };

  const handleSubmit = async () => {
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
    for (let i = 0; i < documents.length; i++) {
      formData.append("documents", documents[i]);
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
      setError("Ошибка при создании резюме. Пожалуйста, попробуйте снова.");
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Создание резюме</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Категория</label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Выберите категорию</option>
            {Object.keys(categories).map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Подкатегория</label>
            <select
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {categories[selectedCategory].map((subcategory) => (
                <option key={subcategory} value={subcategory}>{subcategory}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Название</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows="4"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Цена</label>
          <select
            value={priceType}
            onChange={(e) => setPriceType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="fixed">Фиксированная цена</option>
            <option value="range">Диапазон</option>
            <option value="negotiable">Договорная</option>
          </select>
        </div>

        {priceType === "fixed" && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Фиксированная цена (₽)</label>
            <input
              type="number"
              value={fixedPrice}
              onChange={(e) => setFixedPrice(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        )}

        {priceType === "range" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Цена от (₽)</label>
              <input
                type="number"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Цена до (₽)</label>
              <input
                type="number"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Локация</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="on_site">Выезд</option>
            <option value="remote">Удаленно</option>
          </select>
        </div>

        {location === "on_site" && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Города (через запятую)</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Примеры работ</label>
          <input
            type="file"
            multiple
            onChange={(e) => setDocuments(e.target.files)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        >
          Создать резюме
        </button>
      </div>
    </div>
  );
};

export default CreateResumePage;
