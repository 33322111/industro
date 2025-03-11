import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Home = () => {
  const [ads, setAds] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    is_client: false,
    is_contractor: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileResponse = await api.get("/profile/");
        const userProfile = profileResponse.data;
        setProfile(userProfile);

        if (userProfile.is_client) {
          const adsResponse = await api.get("/user-ads/");
          setAds(adsResponse.data);
        }

        if (userProfile.is_contractor) {
          const resumesResponse = await api.get("/user-resumes/");
          setResumes(resumesResponse.data);
        }

      } catch (err) {
        setError("Ошибка загрузки данных.");
        console.error("Ошибка загрузки данных:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const sectionTitle = profile.is_client
    ? "Ваши объявления"
    : profile.is_contractor
    ? "Ваши резюме"
    : "";

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2>Добро пожаловать в Industro</h2>
        <p>Ваша платформа для упрощения поиска подрядчиков и продвижения инженерных услуг.</p>
      </div>

      <div style={styles.adsContainer}>
        <h3 style={styles.sectionTitle}>{sectionTitle}</h3>

        {loading && <p style={styles.loading}>Загрузка...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {/* Объявления */}
        {profile.is_client && (
          <>
            {ads.length === 0 && !loading && (
              <p style={styles.noAds}>У вас пока нет объявлений.</p>
            )}
            <ul style={styles.adList}>
              {ads.map((ad) => (
                <li key={ad.id} style={styles.adItem}>
                  <Link to={`/ads/${ad.id}/`} style={styles.adLink}>
                    <h4>{ad.title}</h4>
                    <p>{ad.category} / {ad.subcategory}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Резюме */}
        {profile.is_contractor && (
          <>
            {resumes.length === 0 && !loading && (
              <p style={styles.noAds}>У вас пока нет резюме.</p>
            )}
            <ul style={styles.adList}>
              {resumes.map((resume) => (
                <li key={resume.id} style={styles.adItem}>
                  <Link to={`/resumes/${resume.id}/`} style={styles.adLink}>
                    <h4>{resume.title}</h4>
                    <p>{resume.category} / {resume.subcategory}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  content: {
    textAlign: "center",
    marginBottom: "30px",
  },
  adsContainer: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  loading: {
    textAlign: "center",
    color: "gray",
  },
  error: {
    textAlign: "center",
    color: "red",
  },
  noAds: {
    textAlign: "center",
    color: "gray",
  },
  adList: {
    listStyle: "none",
    padding: 0,
  },
  adItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  adLink: {
    textDecoration: "none",
    color: "#007bff",
    fontSize: "16px",
    fontWeight: "bold",
    display: "block",
  },
};

export default Home;
