import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

const SearchResultsPage = () => {
  const location = useLocation();
  const { results = [] } = location.state || {};

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Рассчитываем общее количество страниц
  const totalPages = Math.ceil(results.length / resultsPerPage);

  // Определяем, какие результаты показать на текущей странице
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={styles.container}>
      <h2>Результаты поиска</h2>

      {results.length === 0 ? (
        <p>Ничего не найдено</p>
      ) : (
        <>
          <ul style={styles.list}>
            {currentResults.map((ad) => (
              <li key={ad.id} style={styles.listItem}>
                <Link to={`/ads/${ad.id}/`} style={styles.link}>
                  <h4>{ad.title}</h4>
                  <p>{ad.category} / {ad.subcategory}</p>
                </Link>
              </li>
            ))}
          </ul>

          {/* Пагинация */}
          <div style={styles.paginationContainer}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={styles.pageButton}
            >
              Назад
            </button>

            {/* Номера страниц */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageClick(index + 1)}
                style={{
                  ...styles.pageButton,
                  ...(currentPage === index + 1 ? styles.activePageButton : {})
                }}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={styles.pageButton}
            >
              Вперед
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    marginBottom: "10px",
    borderBottom: "1px solid #ccc",
    paddingBottom: "10px",
  },
  link: {
    textDecoration: "none",
    color: "#007bff",
  },
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

export default SearchResultsPage;
