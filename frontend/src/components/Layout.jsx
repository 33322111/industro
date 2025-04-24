import React, { useState, useRef, useEffect } from "react";
import Header from "./Header.jsx";
import ChatSidebar from "../pages/ChatSidebar.jsx";
import ChatWindow from "../pages/ChatWindow.jsx";

const Layout = ({ children, isAuthenticated, handleLogout }) => {
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const chatSidebarRef = useRef(null);

  const toggleChatSidebar = () => {
    setShowChatSidebar((prev) => !prev);
    setActiveRoom(null); // сбрасываем активный чат при повторном открытии
  };

  const handleChatSelect = (roomName) => {
    setActiveRoom(roomName);
    setShowChatSidebar(false);
  };

  // Обработчик "← Назад" из ChatWindow
  const handleBackToSidebar = () => {
    setActiveRoom(null);
    setShowChatSidebar(true);
  };

  // Закрытие по клику вне чата/сайдбара
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
    <div className="flex flex-col min-h-screen relative">
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
          <ChatSidebar onSelectChat={handleChatSelect} />
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

      <footer className="bg-gray-800 text-white text-center py-3">
        <p>&copy; {new Date().getFullYear()} Industro. Все права защищены.</p>
        <p>
          <a
              href="mailto:industro@yandex.ru"
              className="text-blue-400 hover:underline"
          >
            industro@yandex.ru
          </a>
        </p>
      </footer>
    </div>
);
};

export default Layout;