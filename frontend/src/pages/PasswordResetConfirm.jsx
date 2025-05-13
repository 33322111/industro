import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const PasswordResetConfirm = () => {
  const { uid, token } = useParams(); // Получаем параметры из URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== reNewPassword) {
      setError("Пароли не совпадают.");
      return;
    }

    try {
      await api.post("/password-reset/confirm/", {
        uid,
        token,
        new_password: newPassword,
      });
      setSuccess("Пароль успешно изменён!");
      setError("");
      setTimeout(() => navigate("/login"), 1400); // Через 2 секунды перейти на логин
    } catch (err) {
      console.error(err);
      setError("Ошибка при смене пароля. Возможно, ссылка устарела.");
      setSuccess("");
    }
  };

  return (
    <div style={styles.container}>
      <h1 className="text-3xl font-bold mb-6">Смена пароля</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Новый пароль:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Повторите пароль:
          <input
            type="password"
            value={reNewPassword}
            onChange={(e) => setReNewPassword(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button}>
          Сменить пароль
        </button>
      </form>
      {success && <p style={styles.success}>{success}</p>}
      {error && <p style={styles.error}>{error}</p>}
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
  success: {
    color: "green",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
};

export default PasswordResetConfirm;