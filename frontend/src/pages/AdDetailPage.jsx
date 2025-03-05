import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const AdDetailPage = () => {
  const { id } = useParams(); // Получаем ID из URL
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await api.get(`/ads/${id}/`); // Запрашиваем объявление по ID
        setAd(response.data);
      } catch (err) {
        setError("Ошибка загрузки объявления");
        console.error("Ошибка при получении данных:", err);
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

      <div className="mt-4">
        <p><strong>Категория:</strong> {ad.category} / {ad.subcategory}</p>
        <p><strong>Цена:</strong> {ad.price_type === "Фиксированная цена" ? `${ad.fixed_price} ₽` : "Договорная"}</p>
        <p><strong>Город:</strong> {ad.city || "Не указан"}</p>
      </div>
    </div>
  );
};

export default AdDetailPage;
