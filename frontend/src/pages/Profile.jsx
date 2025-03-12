import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Profile = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    avatar: null,
    username: "",
    email: "",
    role: "",
    company_info: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  // Редирект при разлогине
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/"); // Перенаправляем на главную
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!isEditing) {
      fetchProfile();
    }
  }, [isEditing]);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile/");
      setProfileData(response.data);
    } catch (error) {
      console.error("Ошибка загрузки профиля:", error);
    }
  };

  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({ ...profileData, avatar: file });
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      Object.entries(profileData).forEach(([key, value]) => {
        if (key === "avatar" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      });

      const response = await api.put("/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Профиль успешно обновлён!");
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);

      if (error.response) {
        setMessage(`Ошибка: ${JSON.stringify(error.response.data)}`);
      } else {
        setMessage("Ошибка: Сервер не отвечает.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1>Личный профиль</h1>
      <div style={styles.profileCard}>
        <div style={styles.avatarContainer}>
          <img
            src={profileData.avatar instanceof File
              ? URL.createObjectURL(profileData.avatar)
              : profileData.avatar || "https://via.placeholder.com/150"}
            alt="Avatar"
            style={styles.avatar}
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={styles.fileInput}
            />
          )}
        </div>

        <div style={styles.infoContainer}>
          <div><strong>Никнейм:</strong> {profileData.username}</div>
          <div><strong>Почта:</strong> {profileData.email}</div>
          <div><strong>Роль:</strong> {profileData.is_client ? "Заказчик" : "Исполнитель"}</div>
          <div>
            <strong>Информация о компании:</strong>{" "}
            {isEditing ? (
              <textarea
                name="company_info"
                value={profileData.company_info}
                onChange={handleInputChange}
                style={styles.textarea}
              />
            ) : (
              profileData.company_info
            )}
          </div>
          <div>
            <strong>Адрес:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                style={styles.input}
              />
            ) : (
              profileData.address
            )}
          </div>
        </div>
      </div>

      <button
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
        style={styles.button}
      >
        {isEditing ? "Сохранить изменения" : "Редактировать профиль"}
      </button>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  profileCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #ccc",
  },
  fileInput: {
    marginTop: "10px",
  },
  infoContainer: {
    textAlign: "left",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    minHeight: "60px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "20px",
    color: "green",
    fontWeight: "bold",
  },
};

export default Profile;
