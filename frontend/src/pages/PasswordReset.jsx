import React, { useState } from "react";
import api from "../services/api";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/password_reset/", { email });
      setMessage("Письмо для сброса пароля отправлено. Проверьте почту.");
      setError("");
    } catch (err) {
      setError("Ошибка при сбросе пароля. Проверьте введённый email.");
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Сброс пароля</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Сбросить пароль</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PasswordReset;
