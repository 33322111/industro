import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Profile = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    avatar: null,
    username: "",
    email: "",
    is_client: false,
    company_info: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    fetchProfile();
  }, []);

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

      await api.put("/profile/", formData, {
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

      <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>

        <div style={styles.avatarWrapper}>
          <img
            src={
              profileData.avatar instanceof File
                ? URL.createObjectURL(profileData.avatar)
                : profileData.avatar || "https://via.placeholder.com/150"
            }
            alt="Avatar"
            style={styles.avatar}
          />
          {isEditing && (
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          )}
        </div>

        <label style={styles.label}>
          Никнейм:
          <input
            type="text"
            name="username"
            value={profileData.username}
            disabled
            style={{ ...styles.input, backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
          />
        </label>

        <label style={styles.label}>
          Email:
          <input
            type="email"
            name="email"
            value={profileData.email}
            disabled
            style={{ ...styles.input, backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
          />
        </label>

        <label style={styles.label}>
          Роль:
          <input
            type="text"
            value={profileData.is_client ? "Заказчик" : "Исполнитель"}
            disabled
            style={{ ...styles.input, backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
          />
        </label>

        <label style={styles.label}>
          Информация о компании:
          <textarea
            name="company_info"
            value={profileData.company_info}
            onChange={handleInputChange}
            disabled={!isEditing}
            style={{
              ...styles.input,
              height: "100px",
              resize: "vertical",
              backgroundColor: !isEditing ? "#f0f0f0" : "white",
              cursor: !isEditing ? "not-allowed" : "text",
            }}
          />
        </label>

        <label style={styles.label}>
          Адрес:
          <input
            type="text"
            name="address"
            value={profileData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            style={{
              ...styles.input,
              backgroundColor: !isEditing ? "#f0f0f0" : "white",
              cursor: !isEditing ? "not-allowed" : "text",
            }}
          />
        </label>

        {message && <p style={styles.message}>{message}</p>}

        <button type="button" onClick={() => (isEditing ? handleSave() : setIsEditing(true))} style={styles.button}>
          {isEditing ? "Сохранить изменения" : "Редактировать профиль"}
        </button>
      </form>
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
  avatarWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #ccc",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  message: {
    color: "green",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

export default Profile;
