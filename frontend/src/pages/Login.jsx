import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login/", formData); // Отправляем username и password на сервер
      const { access } = response.data;

      // Сохраняем токен в localStorage
      localStorage.setItem("authToken", access);
      setError("");

      // Перенаправляем пользователя на главную страницу
      navigate("/");
    } catch (err) {
      setError("Ошибка входа. Проверьте введённые данные.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Вход</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Имя пользователя:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Пароль:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button}>
          Войти
        </button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
      <button
        onClick={() => navigate("/password-reset")}
        style={styles.linkButton}
      >
        Восстановить пароль
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  linkButton: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#1a73e8",
    background: "none",
    border: "none",
    textDecoration: "underline",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
};

export default Login;
