import React, {useState, useRef, useEffect} from "react";
import Header from "./Header.jsx";
import ChatSidebar from "../pages/ChatSidebar.jsx";

const Layout = ({children, isAuthenticated, handleLogout}) => {
    const [showChatSidebar, setShowChatSidebar] = useState(false);
    const chatSidebarRef = useRef(null);

    const toggleChatSidebar = () => setShowChatSidebar((prev) => !prev);

    // Закрытие по клику вне ChatSidebar
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Проверка: клик был вне sidebar и вне кнопки (если нужно)
            const clickedInsideSidebar = e.target.closest("#chatSidebar");
            const clickedToggleButton = e.target.closest("#chatToggleButton");

            if (!clickedInsideSidebar && !clickedToggleButton) {
                setShowChatSidebar(false);
            }
        };

        if (showChatSidebar) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showChatSidebar]);


    return (
        <div style={{display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative"}}>
            <Header
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
                toggleChatSidebar={toggleChatSidebar}
            />

            {/* Обёртка для sidebar, ПЕРЕД main */}
            <div style={{position: "absolute", top: "80px", right: "20px", zIndex: 999}}>
                {showChatSidebar && (
                    <div
                        id="chatSidebar"
                        ref={chatSidebarRef}
                        style={{
                            position: "absolute",
                            top: "50px",
                            right: "20px",
                            zIndex: 999,
                            width: "320px",
                            maxHeight: "80vh",
                            overflowY: "auto",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            borderRadius: "10px",
                            backgroundColor: "#fff",
                        }}
                    >
                        <ChatSidebar onSelectChat={() => setShowChatSidebar(false)}/>
                    </div>
                )}
            </div>

            <main style={styles.main}>{children}</main>

            <footer style={styles.footer}>
                <p>&copy; {new Date().getFullYear()} Industro. Все права защищены.</p>
            </footer>
        </div>
    );
};

const styles = {
    main: {
        flex: 1,
        padding: "20px",
    },
    footer: {
        backgroundColor: "#333",
        color: "white",
        textAlign: "center",
        padding: "10px 0",
    },
};

export default Layout;