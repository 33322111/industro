import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const UserProfilePage = () => {
  const { id } = useParams(); // ID пользователя из URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/users/${id}/`);
        setUser(response.data);
      } catch (err) {
        setError("Ошибка загрузки профиля пользователя.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Загрузка профиля...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!user) return <p className="text-center text-gray-500">Профиль не найден</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{user.username}</h1>
      <img
        src={user.avatar || "https://via.placeholder.com/150"}
        alt="Аватар"
        className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
      />

      <div className="text-gray-700 space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Роль:</strong> {user.is_client ? "Заказчик" : "Исполнитель"}</p>
        {user.company_info && <p><strong>Информация о компании:</strong> {user.company_info}</p>}
        {user.address && <p><strong>Адрес:</strong> {user.address}</p>}
      </div>

      {/* Добавляем кнопку, чтобы начать чат */}
      <button
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={() => console.log("Открыть чат с этим пользователем!")}
      >
        Написать сообщение
      </button>
    </div>
  );
};

export default UserProfilePage;
