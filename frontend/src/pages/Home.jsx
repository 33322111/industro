import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Home = ({ isAuthenticated }) => {
  const [ads, setAds] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({ is_client: false, is_contractor: false });

  const [adsPage, setAdsPage] = useState(1);
  const [resumesPage, setResumesPage] = useState(1);
  const adsPerPage = 5;
  const resumesPerPage = 5;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setAds([]);
        setResumes([]);
        setProfile({ is_client: false, is_contractor: false });
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

  const totalAdsPages = Math.ceil(ads.length / adsPerPage);
  const adsStartIndex = (adsPage - 1) * adsPerPage;
  const currentAds = ads.slice(adsStartIndex, adsStartIndex + adsPerPage);

  const totalResumesPages = Math.ceil(resumes.length / resumesPerPage);
  const resumesStartIndex = (resumesPage - 1) * resumesPerPage;
  const currentResumes = resumes.slice(resumesStartIndex, resumesStartIndex + resumesPerPage);

  const sectionTitle = profile.is_client
    ? "Ваши объявления"
    : profile.is_contractor
    ? "Ваши резюме"
    : "";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Добро пожаловать в Industro</h2>
        <p className="text-gray-600 text-lg">Платформа для инженеров и заказчиков технических услуг.</p>
      </div>

      {!isAuthenticated ? (
          <div className="bg-white rounded-xl shadow p-6 text-gray-800 space-y-4 text-lg leading-relaxed">
            <p>
              <strong>Industro</strong> — это современное решение для тех, кто работает в сфере промышленного
              инжиниринга, монтажа, ремонта и технического обслуживания.
              Платформа помогает соединять заказчиков с квалифицированными подрядчиками, сокращая время поиска и повышая
              прозрачность процессов.
            </p>
            <p>
              Мы понимаем, насколько сложно бывает найти проверенного специалиста или, наоборот, достойный проект.
              Поэтому наша цель — предоставить надежную среду для публикации резюме и объявлений, чтобы обе стороны
              могли легко начать сотрудничество.
            </p>
            <p>
              В эпоху цифровизации бизнес-процессов такие решения, как Industro, становятся особенно актуальными: они
              упрощают коммуникацию,
              экономят ресурсы и способствуют росту доверия в сфере подрядных услуг.
            </p>
            <p>
              Мы стремимся к прозрачности и качеству. Все пользователи проходят проверку, а взаимодействие регулируется
              простыми и понятными <Link to="/rules" className="text-blue-600 underline hover:text-blue-800">правилами
              сервиса</Link>.
            </p>
            <p>
              Присоединяйтесь к нам — <strong>создайте резюме или опубликуйте задание</strong>, чтобы начать
              сотрудничество уже сегодня!
            </p>
          </div>
      ) : (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">{sectionTitle}</h3>

            {loading && <p className="text-center text-gray-500">Загрузка...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

          {/* Клиент: Объявления */}
          {profile.is_client && (
            <>
              {ads.length === 0 && !loading && <p className="text-center text-gray-400">У вас пока нет объявлений.</p>}
              <ul className="divide-y divide-gray-200">
                {currentAds.map((ad) => (
                  <li key={ad.id} className="py-4">
                    <Link to={`/ads/${ad.id}/`} className="block hover:bg-gray-50 p-2 rounded transition">
                      <h4 className="text-lg font-bold text-blue-600">{ad.title}</h4>
                      <p className="text-sm text-gray-500">{ad.category_name} / {ad.subcategory_name}</p>
                    </Link>
                  </li>
                ))}
              </ul>

              {ads.length > adsPerPage && (
                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                  <button onClick={() => setAdsPage((prev) => Math.max(prev - 1, 1))} disabled={adsPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
                    Назад
                  </button>
                  {Array.from({ length: totalAdsPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setAdsPage(index + 1)}
                      className={`px-3 py-1 rounded ${adsPage === index + 1 ? 'bg-blue-600 text-white font-bold' : 'bg-gray-100'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button onClick={() => setAdsPage((prev) => Math.min(prev + 1, totalAdsPages))} disabled={adsPage === totalAdsPages}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
                    Вперед
                  </button>
                </div>
              )}
            </>
          )}

          {/* Подрядчик: Резюме */}
          {profile.is_contractor && (
            <>
              {resumes.length === 0 && !loading && <p className="text-center text-gray-400">У вас пока нет резюме.</p>}
              <ul className="divide-y divide-gray-200">
                {currentResumes.map((resume) => (
                  <li key={resume.id} className="py-4">
                    <Link to={`/resumes/${resume.id}/`} className="block hover:bg-gray-50 p-2 rounded transition">
                      <h4 className="text-lg font-bold text-blue-600">{resume.title}</h4>
                      <p className="text-sm text-gray-500">{resume.category_name} / {resume.subcategory_name}</p>
                    </Link>
                  </li>
                ))}
              </ul>

              {resumes.length > resumesPerPage && (
                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                  <button onClick={() => setResumesPage((prev) => Math.max(prev - 1, 1))} disabled={resumesPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
                    Назад
                  </button>
                  {Array.from({ length: totalResumesPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setResumesPage(index + 1)}
                      className={`px-3 py-1 rounded ${resumesPage === index + 1 ? 'bg-blue-600 text-white font-bold' : 'bg-gray-100'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button onClick={() => setResumesPage((prev) => Math.min(prev + 1, totalResumesPages))} disabled={resumesPage === totalResumesPages}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
                    Вперед
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;