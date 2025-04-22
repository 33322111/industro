import React, {useEffect, useState} from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../services/api";

const SearchResultsPage = () => {
  const location = useLocation();
  const { results = [] } = location.state || {};

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const totalPages = Math.ceil(results.length / resultsPerPage);
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/");
        setIsClient(res.data.is_client);
      } catch (err) {
        console.error("Ошибка загрузки профиля:", err);
      }
    };
    fetchProfile();
  }, []);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  console.log(isClient);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Результаты поиска</h2>

      {results.length === 0 ? (
        <p className="text-center text-gray-500">Ничего не найдено</p>
      ) : (
        <>
          <ul className="space-y-4">
            {currentResults.map((item) => {
              const linkTo = isClient
                ? `/resumes/${item.id}/` // заказчик видит резюме
                : `/ads/${item.id}/`;   // исполнитель — объявления

              return (
                <li
                  key={item.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-4"
                >
                  <Link to={linkTo} className="text-blue-600 hover:underline block">
                    <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">
                      {isClient
                        ? `${item.category_name} / ${item.subcategory_name}`
                        : `${item.category_name} / ${item.subcategory_name}`}
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

export default SearchResultsPage;