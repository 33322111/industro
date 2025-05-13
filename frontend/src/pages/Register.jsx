import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" }); // Очистка ошибки при вводе
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      setFieldErrors({});
      setSuccess("");
      return;
    }

    try {
      const response = await api.post("/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        is_client: formData.role === "client",
        is_contractor: formData.role === "contractor",
      });

      const loginResponse = await api.post("/login/", {
        username: formData.username,
        password: formData.password,
      });

      const { access } = loginResponse.data;
      onLogin(access);
      setError("");
      setSuccess("Регистрация успешна!");
      setFieldErrors({});

      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      let globalError = "Ошибка регистрации. Проверьте введённые данные.";
      const newFieldErrors = {};

      if (data) {
        for (const key in data) {
          if (Array.isArray(data[key])) {
            newFieldErrors[key] = data[key][0]; // Первое сообщение об ошибке
          } else if (typeof data[key] === "string") {
            newFieldErrors[key] = data[key];
          }
        }

        if (data.non_field_errors) {
          globalError = data.non_field_errors[0];
        }
      }

      setFieldErrors(newFieldErrors);
      setError(globalError);
      setSuccess("");
    }
  };

  return (
    <div style={styles.container}>
      <h1 className="text-3xl font-bold mb-6">Регистрация</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Никнейм:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
          {fieldErrors.username && <p style={styles.fieldError}>{fieldErrors.username}</p>}
        </label>
        <label style={styles.label}>
          Почта:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          {fieldErrors.email && <p style={styles.fieldError}>{fieldErrors.email}</p>}
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
          {fieldErrors.password && <p style={styles.fieldError}>{fieldErrors.password}</p>}
        </label>
        <label style={styles.label}>
          Повторить пароль:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Выберите роль:
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="client">Заказчик</option>
            <option value="contractor">Исполнитель</option>
          </select>
        </label>
        <button type="submit" style={styles.button}>
          Зарегистрироваться
        </button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
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
  select: {
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
  error: {
    color: "red",
    fontWeight: "bold",
    marginTop: "10px",
  },
  success: {
    color: "green",
    fontWeight: "bold",
    marginTop: "10px",
  },
  fieldError: {
    color: "red",
    fontSize: "14px",
    marginTop: "5px",
  },
};

export default Register;