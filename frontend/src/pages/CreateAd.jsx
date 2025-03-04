import React, { useState } from "react";

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
  "Другое": ["Другое"],
};

const CreateAdPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceType, setPriceType] = useState("Фиксированная цена");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [fixedPrice, setFixedPrice] = useState("");
  const [executionTime, setExecutionTime] = useState("Разовое задание");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [location, setLocation] = useState("На месте");
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

  const handleSubmit = () => {
    if (!selectedCategory || !selectedSubcategory || !title || !description) {
      setError("Пожалуйста, заполните все обязательные поля.");
      return;
    }

    if (priceType === "Фиксированная цена" && !fixedPrice) {
      setError("Пожалуйста, укажите фиксированную цену.");
      return;
    }

    if (priceType === "Диапазон" && (!priceFrom || !priceTo)) {
      setError("Пожалуйста, укажите диапазон цен.");
      return;
    }

    if (executionTime === "Срочный проект" && !projectDeadline) {
      setError("Пожалуйста, укажите сроки проекта.");
      return;
    }

    if (location === "На месте" && !city) {
      setError("Пожалуйста, укажите город.");
      return;
    }

    if (!documents || documents.length === 0) {
      setError("Пожалуйста, загрузите документы.");
      return;
    }

    setError("");

    console.log("Объявление создано:", {
      category: selectedCategory,
      subcategory: selectedSubcategory,
      title,
      description,
      priceType,
      priceFrom,
      priceTo,
      fixedPrice,
      executionTime,
      projectDeadline,
      location,
      city,
      documents,
    });
    alert("Объявление создано!");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Создание объявления</h2>
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
            <option>Фиксированная цена</option>
            <option>Диапазон</option>
            <option>Договорная</option>
          </select>
        </div>

        {priceType === "Фиксированная цена" && (
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

        {priceType === "Диапазон" && (
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
          <label className="block text-sm font-medium mb-2 text-gray-700">Срок выполнения</label>
          <select
            value={executionTime}
            onChange={(e) => setExecutionTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option>Разовое задание</option>
            <option>Долгосрочное сотрудничество</option>
            <option>Срочный проект</option>
          </select>
        </div>

        {executionTime === "Срочный проект" && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Сроки проекта (до N дней)</label>
            <input
              type="number"
              value={projectDeadline}
              onChange={(e) => setProjectDeadline(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Локация</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option>На месте</option>
            <option>Удаленно</option>
          </select>
        </div>

        {location === "На месте" && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Город</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Документы</label>
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
          Создать объявление
        </button>
      </div>
    </div>
  );
};

export default CreateAdPage;