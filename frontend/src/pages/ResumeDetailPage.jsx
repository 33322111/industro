import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const ResumeDetailPage = () => {
  const { id } = useParams(); // Получаем ID из URL
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get(`/resumes/${id}/`); // Запрашиваем резюме по ID
        setResume(response.data);
      } catch (err) {
        setError("Ошибка загрузки резюме");
        console.error("Ошибка при получении данных:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Загрузка...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!resume) return <p className="text-center text-gray-500">Резюме не найдено</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{resume.title}</h1>
      <p className="text-gray-700 mb-4">{resume.description}</p>

      <div className="space-y-2">
        <p>
          <strong>Категория:</strong> {resume.category_name} / {resume.subcategory_name}
        </p>
        <p>
          <strong>Цена:</strong>{" "}
          {resume.price_type === "fixed"
            ? `${resume.fixed_price} ₽`
            : resume.price_type === "range"
            ? `${resume.price_from} ₽ - ${resume.price_to} ₽`
            : "Договорная"}
        </p>
        <p>
          <strong>Локация:</strong>{" "}
          {resume.location === "on_site"
            ? `Выезд (${resume.city || "Город не указан"})`
            : "Удаленно"}
        </p>
        {resume.documents && resume.documents.length > 0 && (
          <div className="mt-4">
            <strong>Примеры работ:</strong>
            <ul className="list-disc list-inside mt-2">
              {resume.documents.map((doc, index) => (
                <li key={index}>
                  <a
                    href={doc.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {doc.name || `Файл ${index + 1}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeDetailPage;
