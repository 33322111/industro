import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Home = ({ isAuthenticated }) => {
  const [ads, setAds] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    is_client: false,
    is_contractor: false,
  });

  // Пагинация для объявлений
  const [adsPage, setAdsPage] = useState(1);
  const adsPerPage = 5;

  // Пагинация для резюме
  const [resumesPage, setResumesPage] = useState(1);
  const resumesPerPage = 5;

  // Загрузка профиля и данных при входе
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setAds([]);
        setResumes([]);
        setProfile({
          is_client: false,
          is_contractor: false,
        });
        setLoading(false);
        return;
      }

      setLoading(true);
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
  }, [isAuthenticated]);

  // Вычисляем страницы для объявлений
  const totalAdsPages = Math.ceil(ads.length / adsPerPage);
  const adsStartIndex = (adsPage - 1) * adsPerPage;
  const currentAds = ads.slice(adsStartIndex, adsStartIndex + adsPerPage);

  // Вычисляем страницы для резюме
  const totalResumesPages = Math.ceil(resumes.length / resumesPerPage);
  const resumesStartIndex = (resumesPage - 1) * resumesPerPage;
  const currentResumes = resumes.slice(resumesStartIndex, resumesStartIndex + resumesPerPage);

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
              {currentAds.map((ad) => (
                <li key={ad.id} style={styles.adItem}>
                  <Link to={`/ads/${ad.id}/`} style={styles.adLink}>
                    <h4>{ad.title}</h4>
                    <p>{ad.category_name} / {ad.subcategory_name}</p>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Пагинация объявлений */}
            {ads.length > adsPerPage && (
              <div style={styles.paginationContainer}>
                <button
                  onClick={() => setAdsPage((prev) => Math.max(prev - 1, 1))}
                  disabled={adsPage === 1}
                  style={styles.pageButton}
                >
                  Назад
                </button>

                {Array.from({ length: totalAdsPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setAdsPage(index + 1)}
                    style={{
                      ...styles.pageButton,
                      ...(adsPage === index + 1 ? styles.activePageButton : {}),
                    }}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setAdsPage((prev) => Math.min(prev + 1, totalAdsPages))}
                  disabled={adsPage === totalAdsPages}
                  style={styles.pageButton}
                >
                  Вперед
                </button>
              </div>
            )}
          </>
        )}

        {/* Резюме */}
        {profile.is_contractor && (
          <>
            {resumes.length === 0 && !loading && (
              <p style={styles.noAds}>У вас пока нет резюме.</p>
            )}
            <ul style={styles.adList}>
              {currentResumes.map((resume) => (
                <li key={resume.id} style={styles.adItem}>
                  <Link to={`/resumes/${resume.id}/`} style={styles.adLink}>
                    <h4>{resume.title}</h4>
                    <p>{resume.category_name} / {resume.subcategory_name}</p>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Пагинация резюме */}
            {resumes.length > resumesPerPage && (
              <div style={styles.paginationContainer}>
                <button
                  onClick={() => setResumesPage((prev) => Math.max(prev - 1, 1))}
                  disabled={resumesPage === 1}
                  style={styles.pageButton}
                >
                  Назад
                </button>

                {Array.from({ length: totalResumesPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setResumesPage(index + 1)}
                    style={{
                      ...styles.pageButton,
                      ...(resumesPage === index + 1 ? styles.activePageButton : {}),
                    }}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setResumesPage((prev) => Math.min(prev + 1, totalResumesPages))}
                  disabled={resumesPage === totalResumesPages}
                  style={styles.pageButton}
                >
                  Вперед
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "800px", margin: "0 auto", padding: "20px" },
  content: { textAlign: "center", marginBottom: "30px" },
  adsContainer: { padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" },
  sectionTitle: { fontSize: "20px", fontWeight: "bold", marginBottom: "10px" },
  loading: { textAlign: "center", color: "gray" },
  error: { textAlign: "center", color: "red" },
  noAds: { textAlign: "center", color: "gray" },
  adList: { listStyle: "none", padding: 0 },
  adItem: { padding: "10px", borderBottom: "1px solid #ddd" },
  adLink: { textDecoration: "none", color: "#007bff", fontSize: "16px", fontWeight: "bold", display: "block" },
  paginationContainer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "5px",
    flexWrap: "wrap",
  },
  pageButton: {
    padding: "8px 12px",
    backgroundColor: "#f1f1f1",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
  },
  activePageButton: {
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "bold",
  },
};

export default Home;
