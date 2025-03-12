import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const AdDetailPage = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await api.get(`/ads/${id}/`);
        setAd(response.data);
      } catch (err) {
        setError("Ошибка загрузки объявления");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Загрузка...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!ad) return <p className="text-center text-gray-500">Объявление не найдено</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{ad.title}</h1>
      <p className="text-gray-700">{ad.description}</p>

      <div className="mt-4 space-y-2">
        <p><strong>Категория:</strong> {ad.category} / {ad.subcategory}</p>
        <p><strong>Цена:</strong> {ad.price_type === "range" ? `${ad.price_from} - ${ad.price_to} ₽` : ad.price_type === "fixed" ? `${ad.fixed_price} ₽` : "Договорная"}</p>
        <p><strong>Город:</strong> {ad.city || "Не указан"}</p>

        {/* Ссылка на профиль автора */}
        <p>
          <strong>Автор объявления:</strong>{" "}
          <Link
            to={`/profile/${ad.author_id}`} // ссылка на профиль
            className="text-blue-600 hover:underline"
          >
            {ad.author}
          </Link>
        </p>
      </div>

      {/* Кнопка написать сообщение (дополнительно) */}
      <div className="mt-6">
        <button
          onClick={() => console.log("Открыть чат с автором")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Написать сообщение
        </button>
      </div>
    </div>
  );
};

export default AdDetailPage;
