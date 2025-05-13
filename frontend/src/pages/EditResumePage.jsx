import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const EditResumePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState({
    title: "",
    description: "",
    price_type: "fixed",
    fixed_price: "",
    price_from: "",
    price_to: "",
    category: "",
    subcategory: "",
    location: "",
    city: "",
  });

  const [categories, setCategories] = useState([]);
  const [documentFile, setDocumentFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchResumeAndCategories = async () => {
      try {
        const [resumeRes, categoriesRes] = await Promise.all([
          api.get(`/resumes/${id}/`),
          api.get("/categories/")
        ]);
        setResumeData(resumeRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Ошибка загрузки данных резюме:", err);
      }
    };
    fetchResumeAndCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(resumeData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      if (documentFile) {
        formData.append("documents", documentFile);
      }

      await api.put(`/resumes/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Резюме успешно обновлено!");
      setTimeout(() => navigate(`/resumes/${id}/`), 1500);
    } catch (err) {
      console.error("Ошибка при обновлении:", err);
      setMessage("Ошибка при сохранении изменений.");
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.id.toString() === resumeData.category?.toString()
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h2 className="text-xl font-bold text-center mb-4">Редактировать резюме</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          name="title"
          value={resumeData.title}
          onChange={handleChange}
          placeholder="Заголовок"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={resumeData.description}
          onChange={handleChange}
          placeholder="Описание"
          className="w-full border p-2 rounded"
          rows={5}
        />

        <div>
          <label className="block mb-1">Тип цены</label>
          <select
            name="price_type"
            value={resumeData.price_type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="fixed">Фиксированная</option>
            <option value="range">Диапазон</option>
            <option value="negotiable">Договорная</option>
          </select>
        </div>

        {resumeData.price_type === "fixed" && (
          <input
            type="number"
            name="fixed_price"
            value={resumeData.fixed_price}
            onChange={handleChange}
            placeholder="Фиксированная цена"
            className="w-full border p-2 rounded"
          />
        )}

        {resumeData.price_type === "range" && (
          <div className="flex gap-2">
            <input
              type="number"
              name="price_from"
              value={resumeData.price_from}
              onChange={handleChange}
              placeholder="Цена от"
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              name="price_to"
              value={resumeData.price_to}
              onChange={handleChange}
              placeholder="Цена до"
              className="w-full border p-2 rounded"
            />
          </div>
        )}

        <select
          name="category"
          value={resumeData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Выберите категорию</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {selectedCategory?.subcategories?.length > 0 && (
          <select
            name="subcategory"
            value={resumeData.subcategory}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Выберите подкатегорию</option>
            {selectedCategory.subcategories.map((subcat) => (
              <option key={subcat.id} value={subcat.id}>
                {subcat.name}
              </option>
            ))}
          </select>
        )}

        <select
          name="location"
          value={resumeData.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Выберите формат работы</option>
          <option value="on_site">Выезд</option>
          <option value="remote">Удаленно</option>
        </select>

        <input
          name="city"
          value={resumeData.city}
          onChange={handleChange}
          placeholder="Город"
          className="w-full border p-2 rounded"
        />

        <div>
          <label className="block font-medium mb-1">Загрузить документ (опционально)</label>
          <input
            type="file"
            name="documents"
            onChange={handleFileChange}
            className="w-full"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          />
        </div>

        {message && <p className="text-green-600 font-semibold">{message}</p>}

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Сохранить изменения
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditResumePage;