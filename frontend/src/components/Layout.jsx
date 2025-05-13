import React, { useState, useRef, useEffect } from "react";
import Header from "./Header.jsx";
import ChatSidebar from "../pages/ChatSidebar.jsx";
import ChatWindow from "../pages/ChatWindow.jsx";
import api from "../services/api";

const Layout = ({ children, isAuthenticated, handleLogout }) => {
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const chatSidebarRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/profile/");
        setCurrentUserId(res.data.id);
      } catch (err) {
        console.error("Ошибка получения ID пользователя:", err);
      }
    };

    if (isAuthenticated) {
      fetchCurrentUser();
    } else {
      setCurrentUserId(null);
    }
  }, [isAuthenticated]);

  const handleSupportClick = () => {
    setIsSupportChatOpen(true);
  };

  const getRoomName = (user1, user2) => {
  const sorted = [+user1, +user2].sort((a, b) => a - b);
  return `room_${sorted[0]}_${sorted[1]}`;
};

  const toggleChatSidebar = () => {
    setShowChatSidebar((prev) => !prev);
    setActiveRoom(null);
  };

  const handleChatSelect = (roomName) => {
    setActiveRoom(roomName);
    setShowChatSidebar(false);
  };

  const handleBackToSidebar = () => {
    setActiveRoom(null);
    setShowChatSidebar(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInsideSidebar = e.target.closest("#chatSidebar");
      const clickedToggleButton = e.target.closest("#chatToggleButton");
      const clickedInsideChatWindow = e.target.closest("#chatWindow");

      if (!clickedInsideSidebar && !clickedToggleButton && !clickedInsideChatWindow) {
        setShowChatSidebar(false);
        setActiveRoom(null);
      }
    };

    if (showChatSidebar || activeRoom) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChatSidebar, activeRoom]);

  return (
      <div
          className="flex flex-col min-h-screen bg-cover bg-center bg-no-repeat"
          style={{backgroundImage: "url('/background_taller.png')"}}
      >
        <Header
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            toggleChatSidebar={toggleChatSidebar}
        />

        {/* Chat Sidebar */}
        {showChatSidebar && (
            <div
                id="chatSidebar"
                ref={chatSidebarRef}
                className="absolute top-[80px] right-5 z-50 w-[340px] max-h-[80vh] overflow-y-auto rounded-xl shadow-xl bg-white"
            >
              <ChatSidebar onSelectChat={handleChatSelect}/>
            </div>
        )}

        {/* Chat Window */}
        {activeRoom && (
            <div id="chatWindow">
              <ChatWindow
                  roomName={activeRoom}
                  onClose={() => setActiveRoom(null)}
                  onBackToSidebar={handleBackToSidebar}
              />
            </div>
        )}

        <main className="flex-1 p-5">{children}</main>

        <footer className="bg-gray-800 text-white text-center py-4">
          {isAuthenticated && currentUserId !== 2 && (
              <button
                  onClick={handleSupportClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm transition mb-2"
              >
                Чат с поддержкой
              </button>
          )}
          <p>
            <a
                href="mailto:industroo@yandex.ru"
                className="text-blue-400 hover:underline"
            >
              industroo@yandex.ru
            </a>
          </p>
          <p>&copy; {new Date().getFullYear()} Industro. Все права защищены.</p>

          {isSupportChatOpen && currentUserId && (
              <ChatWindow
                  roomName={getRoomName(2, currentUserId)} // ID 2 — админ
                  onClose={() => setIsSupportChatOpen(false)}
              />
          )}
        </footer>
      </div>
  );
};

export default Layout;