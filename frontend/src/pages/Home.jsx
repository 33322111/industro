import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>


      {/* Main Content */}
      <div style={styles.content}>
        <h2>Добро пожаловать в Industro</h2>
        <p>
          Ваша платформа для упрощения поиска подрядчиков и продвижения
          инженерных услуг. Решение для малого и среднего бизнеса.
        </p>
      </div>
    </div>
  );
};

const styles = {
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
  },
};

export default Home;
