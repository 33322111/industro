import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";

const ChatWindow = ({ recipientId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const token = localStorage.getItem("authToken");

  // Загрузка истории сообщений и сброс непрочитанных
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const roomName = `user_${recipientId}`;
        const response = await api.get(`/chat/history/${roomName}/`);
        setMessages(response.data);

        // Сброс непрочитанных сообщений
        await api.post(`/chat/mark-as-read/${roomName}/`);
      } catch (err) {
        console.error("Ошибка загрузки истории сообщений", err);
      }
    };

    if (recipientId) fetchHistory();
  }, [recipientId]);

  // WebSocket подключение
  useEffect(() => {
    const roomName = `user_${recipientId}`;
    const wsUrl = `ws://localhost:8000/ws/chat/${roomName}/?token=${token}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket закрыт");
    };

    return () => {
      socketRef.current.close();
    };
  }, [recipientId, token]);

  // Прокрутка вниз
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: input }));
      setInput("");
    }
  };

  return (
    <div className="fixed top-0 right-0 w-[350px] h-full bg-white border-l shadow-lg flex flex-col z-50">
      <div className="p-3 border-b flex justify-between items-center">
        <h2 className="font-bold">Чат</h2>
        <button onClick={onClose}>✖</button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong>{msg.sender ? `${msg.sender}: ` : ""}</strong>{msg.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;