import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

const SearchResultsPage = () => {
  const location = useLocation();
  const { results = [] } = location.state || {};

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const totalPages = Math.ceil(results.length / resultsPerPage);
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Результаты поиска</h2>

      {results.length === 0 ? (
        <p className="text-center text-gray-500">Ничего не найдено</p>
      ) : (
        <>
          <ul className="space-y-4">
            {currentResults.map((ad) => (
              <li
                key={ad.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-4"
              >
                <Link
                  to={`/ads/${ad.id}/`}
                  className="text-blue-600 hover:underline block"
                >
                  <h4 className="text-lg font-bold mb-1">{ad.title}</h4>
                  <p className="text-gray-600 text-sm">
                    {ad.category_name} / {ad.subcategory_name}
                  </p>
                </Link>
              </li>
            ))}
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