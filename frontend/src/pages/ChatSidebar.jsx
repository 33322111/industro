import React, { useEffect, useState } from "react";
import api from "../services/api";
import defaultAvatar from "../assets/default_avatar.png";
import '../index.css';

const ChatSidebar = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chat/dialogs/");
        setChats(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке чатов:", err);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="w-[340px] max-h-[520px] bg-gradient-to-br from-white to-blue-50 shadow-xl border border-gray-200 rounded-2xl overflow-y-auto p-5">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        💬 Сообщения
      </h2>

      {chats.length === 0 ? (
        <p className="text-gray-500 text-center italic">Нет активных чатов</p>
      ) : (
        chats.map((chat, index) => {
          const timestamp = chat.timestamp;
          const preview = chat.last_message || "";

          const formattedDate = timestamp
            ? new Date(timestamp).toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
            : "";

          const formattedTime = timestamp
            ? new Date(timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <React.Fragment key={chat.id || `${chat.username}_${chat.room_name}`}>
              <div
                className="flex justify-between items-start px-4 py-3 rounded-xl bg-blue-50 hover:bg-white hover:shadow-md transition duration-300 cursor-pointer"
                onClick={() => onSelectChat(chat.room_name)}
              >
                {/* Левая часть: аватар и текст */}
                <div className="flex gap-3 items-start w-[75%]">
                  <img
                    src={chat.avatar || defaultAvatar}
                    onError={(e) => (e.target.src = defaultAvatar)}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm">
                      {chat.username}
                    </span>
                    <span className="text-gray-600 text-sm truncate max-w-[160px]">
                      {preview}
                    </span>
                  </div>
                </div>

                {/* Правая часть: дата и счётчик */}
                <div className="flex flex-col items-end text-xs text-gray-400 min-w-[70px] text-right">
                  <span>{formattedDate}</span>
                  <span>{formattedTime}</span>
                  {chat.unread_count > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 mt-2 font-medium shadow">
                      {chat.unread_count}
                    </span>
                  )}
                </div>
              </div>

              {index < chats.length - 1 && (
                <hr className="my-3 border-gray-200" />
              )}
            </React.Fragment>
          );
        })
      )}
    </div>
  );
};

export default ChatSidebar;