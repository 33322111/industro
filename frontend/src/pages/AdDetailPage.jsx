import React, {useEffect, useState} from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import api from "../services/api";
import ChatWindow from "./ChatWindow.jsx";

const AdDetailPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentUserUsername, setCurrentUserUsername] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const getRoomName = (user1, user2) => {
        const sorted = [user1, user2].sort();
        return `room_${sorted[0]}_${sorted[1]}`;
    };

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const [adRes, userRes] = await Promise.all([
                    api.get(`/ads/${id}/`),
                    api.get(`/profile/`)
                ]);
                setAd(adRes.data);
                setCurrentUserUsername(userRes.data.username);
                setCurrentUserId(userRes.data.id);
            } catch (err) {
                setError("Ошибка загрузки объявления");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
    }, [id]);

    const handleOpenChat = () => setIsChatOpen(true);
    const handleCloseChat = () => setIsChatOpen(false);

    const handleDelete = async () => {
        try {
            await api.delete(`/ads/${ad.id}/`);
            navigate("/");
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
    };

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
        if (ad.project_deadline) {
            label += ` — до ${ad.project_deadline} дней`;
        }
        return label;
    };

    if (loading) return <p className="text-center text-gray-500">Загрузка...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!ad) return <p className="text-center text-gray-500">Объявление не найдено</p>;

    const isMyOwnAd = currentUserUsername === ad.author;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
            <h1 className="text-2xl font-bold mb-4">{ad.title}</h1>
            <p className="text-gray-700">{ad.description}</p>

            <div className="mt-4 space-y-2">
                <p><strong>Категория:</strong> {ad.category_name} / {ad.subcategory_name}</p>
                <p>
                    <strong>Цена:</strong> {ad.price_type === "range" ? `${ad.price_from} - ${ad.price_to} ₽` : ad.price_type === "fixed" ? `${ad.fixed_price} ₽` : "Договорная"}
                </p>
                <p><strong>Город:</strong> {ad.city || "Не указан"}</p>
                <p><strong>Срок выполнения:</strong> {getExecutionTimeText()}</p>
                <p>
                    <strong>Автор объявления:</strong>{" "}
                    <Link to={`/profile/${ad.author_id}`} className="text-blue-600 hover:underline">
                        {ad.author}
                    </Link>
                </p>

                {ad.documents && (
                    <div className="mt-4">
                        <p className="font-semibold">Прикреплённый файл:</p>

                        {/* Если изображение */}
                        {ad.documents.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                            <a href={ad.documents} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={ad.documents}
                                    alt="Документ"
                                    className="mt-2 max-w-xs border rounded-lg hover:shadow-md"
                                />
                            </a>
                        ) : (
                            <a
                                href={ad.documents}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline block mt-2"
                            >
                                {decodeURIComponent(ad.documents.split("/").pop())}
                            </a>
                        )}
                    </div>
                )}
            </div>

            {isMyOwnAd && (
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => navigate(`/edit-ad/${ad.id}`)}
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

            {showDeleteConfirm && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg">
                    <p className="text-red-700 font-semibold mb-2">
                        Вы уверены, что хотите удалить это объявление?
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
                    roomName={getRoomName(currentUserId, ad.author_id)}
                    onClose={handleCloseChat}
                />
            )}
        </div>
    );
};

export default AdDetailPage;