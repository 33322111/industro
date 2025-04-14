import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import ChatWindow from "./ChatWindow.jsx";

const AdDetailPage = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const [adRes, userRes] = await Promise.all([
          api.get(`/ads/${id}/`),
          api.get(`/profile/`)
        ]);
        setAd(adRes.data);
        setCurrentUserId(userRes.data.username);
      } catch (err) {
        setError("Ошибка загрузки объявления");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);


  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  // Получаем текстовое значение срока выполнения
  const getExecutionTimeText = () => {
    if (!ad) return "";

    let label = "";

    switch (ad.execution_time) {
      case "one_time":
        label = "Разовое задание";
        break;
      case "long_term":
        label = "Долгосрочное сотрудничество";
        break;
      case "urgent":
        label = "Срочный проект";
        break;
      default:
        label = "Не указан";
    }

    // Если есть срок выполнения (deadline), добавляем его
    if (ad.project_deadline) {
      label += ` — до ${ad.project_deadline} дней`;
    }

    return label;
  };

  if (loading) return <p className="text-center text-gray-500">Загрузка...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!ad) return <p className="text-center text-gray-500">Объявление не найдено</p>;

  console.log(currentUserId);
  console.log(ad.author);
  const isMyOwnAd = currentUserId === ad.author;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
      <h1 className="text-2xl font-bold mb-4">{ad.title}</h1>
      <p className="text-gray-700">{ad.description}</p>

      <div className="mt-4 space-y-2">
        <p><strong>Категория:</strong> {ad.category_name} / {ad.subcategory_name}</p>

        <p><strong>Цена:</strong> {ad.price_type === "range" ? `${ad.price_from} - ${ad.price_to} ₽` : ad.price_type === "fixed" ? `${ad.fixed_price} ₽` : "Договорная"}</p>

        <p><strong>Город:</strong> {ad.city || "Не указан"}</p>

        {/* Новый блок срока выполнения */}
        <p><strong>Срок выполнения:</strong> {getExecutionTimeText()}</p>

        <p>
          <strong>Автор объявления:</strong>{" "}
          <Link
            to={`/profile/${ad.author_id}`}
            className="text-blue-600 hover:underline"
          >
            {ad.author}
          </Link>
        </p>
      </div>

      {!isMyOwnAd && (
        <div className="mt-6">
          <button
            onClick={handleOpenChat}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Написать сообщение
          </button>
        </div>
      )}

      {isChatOpen && (
        <ChatWindow
          roomName={`user_${ad.author_id}`}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default AdDetailPage;