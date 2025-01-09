// src/services/api.js

import axios from "axios";

// Базовый URL для API
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Укажите ваш базовый URL
  timeout: 5000, // Таймаут запросов (в миллисекундах)
  headers: {
    "Content-Type": "application/json", // Тип контента по умолчанию
  },
});

// Перехватчики запросов и ответов
api.interceptors.request.use(
  (config) => {
    // Если есть токен авторизации, добавляем его в заголовки
    const token = localStorage.getItem("authToken"); // Замените на подходящий метод хранения токена
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка ошибок
    if (error.response && error.response.status === 401) {
      // Например, при 401 (Unauthorized) можно перенаправить на страницу входа
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
