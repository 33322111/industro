import React from "react";
import Header from "./Header.jsx";

const Layout = ({ children, isAuthenticated }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header isAuthenticated={isAuthenticated} />
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
