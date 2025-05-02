import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const FavouritesPage = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const totalPages = Math.ceil(favourites.length / resultsPerPage);
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentFavourites = favourites.slice(indexOfFirstResult, indexOfLastResult);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, favouritesRes] = await Promise.all([
          api.get("/profile/"),
          api.get("/favourites/")
        ]);

        setIsClient(profileRes.data.is_client);
        setFavourites(favouritesRes.data);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить избранное");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p className="text-center mt-8">Загрузка...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {isClient ? "Ваши избранные резюме" : "Ваши избранные объявления"}
      </h2>

      {favourites.length === 0 ? (
        <p className="text-center text-gray-500">Нет избранных элементов</p>
      ) : (
        <>
          <ul className="space-y-4">
            {currentFavourites.map((item) => {
              const linkTo = isClient
                ? `/resumes/${item.id}/`
                : `/ads/${item.ad.id}/`;

              console.log(item);

              return (
                <li
                  key={item.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-4"
                >
                  <Link to={linkTo} className="text-blue-600 hover:underline block">
                    <h4 className="text-lg font-bold mb-1">{item.ad.title}</h4>
                    <p className="text-gray-600 text-sm">
                      {item.ad.category_name} / {item.ad.subcategory_name}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-center items-center flex-wrap gap-2 mt-6">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Назад
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageClick(index + 1)}
                className={`px-3 py-1 rounded font-semibold ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Вперед
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FavouritesPage;