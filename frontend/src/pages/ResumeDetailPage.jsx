import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import ChatWindow from "./ChatWindow.jsx";

const ResumeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeRes, userRes] = await Promise.all([
          api.get(`/resumes/${id}/`),
          api.get(`/profile/`)
        ]);
        setResume(resumeRes.data);
        setCurrentUserId(userRes.data.username);
      } catch (err) {
        setError("Ошибка загрузки резюме");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleOpenChat = () => setIsChatOpen(true);
  const handleCloseChat = () => setIsChatOpen(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/resumes/${resume.id}/`);
      navigate("/");
    } catch (error) {
      console.error("Ошибка при удалении резюме:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Загрузка...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!resume) return <p className="text-center text-gray-500">Резюме не найдено</p>;

  const isMyOwnResume = currentUserId === resume.user;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
      <h1 className="text-2xl font-bold mb-4">{resume.title}</h1>
      <p className="text-gray-700">{resume.description}</p>

      <div className="mt-4 space-y-2">
        <p><strong>Категория:</strong> {resume.category_name} / {resume.subcategory_name}</p>
        <p>
          <strong>Цена:</strong>{" "}
          {resume.price_type === "range"
            ? `${resume.price_from} - ${resume.price_to} ₽`
            : resume.price_type === "fixed"
            ? `${resume.fixed_price} ₽`
            : "Договорная"}
        </p>
        <p>
          <strong>Локация:</strong>{" "}
          {resume.location === "on_site"
            ? `Выезд (${resume.city || "Город не указан"})`
            : "Удаленно"}
        </p>

        {resume.documents && (
          <div className="mt-4">
            <p className="font-semibold">Пример работы:</p>
            {resume.documents.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
              <a href={resume.documents} target="_blank" rel="noopener noreferrer">
                <img
                  src={resume.documents}
                  alt="Документ"
                  className="mt-2 max-w-xs border rounded-lg hover:shadow-md"
                />
              </a>
            ) : (
              <a
                href={resume.documents}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline block mt-2"
              >
                {decodeURIComponent(resume.documents.split("/").pop())}
              </a>
            )}
          </div>
        )}
      </div>

      {isMyOwnResume && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate(`/edit-resume/${resume.id}`)}
            className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500"
          >
            ✏️ Редактировать
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            🗑️ Удалить
          </button>
        </div>
      )}

      {!isMyOwnResume && (
        <div className="mt-6">
          <button
            onClick={handleOpenChat}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Написать сообщение
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg">
          <p className="text-red-700 font-semibold mb-2">
            Вы уверены, что хотите удалить это резюме?
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Да, удалить
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {isChatOpen && (
        <ChatWindow
          roomName={`user_${resume.user}`}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default ResumeDetailPage;