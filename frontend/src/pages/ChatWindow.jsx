import React, {useEffect, useRef, useState} from "react";
import api from "../services/api";
import defaultAvatar from "../assets/default_avatar.png";

const ChatWindow = ({roomName, onClose, onBackToSidebar}) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);
    const [recipientUsername, setRecipientUsername] = useState("");
    const socketRef = useRef(null);
    const bottomRef = useRef(null);
    const [currentUserAvatar, setCurrentUserAvatar] = useState(null);
    const [recipientAvatar, setRecipientAvatar] = useState(null);

    const recipientId = roomName.split("_")[1];
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/profile/");
                setCurrentUserId(res.data.username);
            } catch (err) {
                console.error("Ошибка загрузки пользователя:", err);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/profile/");
                setCurrentUserId(res.data.username);
                setCurrentUserAvatar(res.data.avatar); // <-- avatar сохраняем
            } catch (err) {
                console.error("Ошибка загрузки пользователя:", err);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchRecipient = async () => {
            try {
                const res = await api.get(`/profile/${recipientId}/`);
                setRecipientUsername(res.data.username);
                setRecipientAvatar(res.data.avatar); // <-- avatar сохраняем
            } catch (err) {
                console.error("Ошибка получения имени собеседника", err);
            }
        };

        if (recipientId) fetchRecipient();
    }, [recipientId]);



    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get(`/chat/history/${roomName}/`);
                setMessages(res.data);
                await api.post(`/chat/mark-as-read/${roomName}/`);
            } catch (err) {
                console.error("Ошибка загрузки истории:", err);
            }
        };
        if (recipientId) fetchHistory();
    }, [recipientId]);

    useEffect(() => {
        const wsUrl = `ws://localhost:8000/ws/chat/${roomName}/?token=${token}`;
        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (!data.timestamp) {
                data.timestamp = new Date().toISOString();
            }
            setMessages((prev) => [...prev, data]);
        };

        socketRef.current.onclose = () => console.log("WebSocket закрыт");
        return () => socketRef.current.close();
    }, [roomName, token]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const sendMessage = () => {
        if (input.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({message: input}));
            setInput("");
        }
    };

    return (
        <div
            id="chatWindow"
            className="fixed top-0 right-0 w-[350px] h-full bg-white border-l shadow-lg flex flex-col z-50"
        >
            {/* Верхняя панель */}
            <div className="p-3 border-b flex justify-between items-center">
                <button
                    onClick={onBackToSidebar}
                    className="text-2xl text-gray-500 font-bold px-2 hover:text-blue-800 transition"
                >
                    ←
                </button>

                <h2 className="text-lg font-bold flex-1 text-center">
                    Чат с {recipientUsername}
                </h2>

                <button
                    onClick={onClose}
                    className="text-xl text-gray-500 hover:text-red-500 transition px-2"
                >
                    ✖
                </button>
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((msg, idx) => {
                    const isMine = String(msg.sender) === String(currentUserId);
                    const time = msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "";

                    return (
                        <div
                            key={idx}
                            className={`flex flex-col ${
                                isMine ? "items-end" : "items-start"
                            } space-y-1`}
                        >
                            <div className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
                                {!isMine && (
                                    <img
                                        src={
                                            isMine
                                                ? currentUserAvatar
                                                    ? `http://localhost:8000${currentUserAvatar}`
                                                    : defaultAvatar
                                                : recipientAvatar
                                                    ? recipientAvatar
                                                    : defaultAvatar
                                        }
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full border border-gray-300"
                                    />
                                )}

                                <div
                                    className={`max-w-[70%] px-4 py-2 rounded-xl text-sm shadow ${
                                        isMine
                                            ? "bg-blue-500 text-white rounded-br-none"
                                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                                    }`}
                                >
                                    {msg.message}
                                </div>

                                {isMine && (
                                    <img
                                        src={
                                            isMine
                                                ? currentUserAvatar
                                                    ? `http://localhost:8000${currentUserAvatar}`
                                                    : defaultAvatar
                                                : recipientAvatar
                                                    ? `http://localhost:8000${recipientAvatar}`
                                                    : defaultAvatar
                                        }
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full border border-gray-300"
                                    />
                                )}
                            </div>

                            <div className="text-xs text-gray-400 px-2">{time}</div>
                        </div>
                    );
                })}
                <div ref={bottomRef}/>
            </div>

            {/* Поле ввода */}
            <div className="p-3 border-t flex gap-2">
                <input
                    className="flex-1 border px-3 py-2 rounded outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Введите сообщение..."
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded font-semibold"
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;